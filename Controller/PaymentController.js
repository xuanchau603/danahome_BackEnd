const moment = require("moment");
const {
  NewsModel,
  PaymentModel,
  UserModel,
  RoleModel,
  ImagesModel,
} = require("../Model");
const { Op } = require("sequelize");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const PaymentController = {
  createPayment: async (req, res) => {
    const userId = req.user.id;
    const newsId = req.body.newsId;

    try {
      const newPayment = await PaymentModel.create({
        user_Id: userId,
        news_Id: newsId,
        amount: req.body.total,
        order_Id: req.body.orderId,
        payment_Type: req.body.paymentType,
        description: req.body.description,
        status: req.body.status ? req.body.status : "1",
      });

      res.status(200).json({
        message: "Tạo hóa đơn thành công!",
        data: newPayment,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server!",
      });
    }
  },
  createPaymentMomo: (resquest, respone) => {
    //require orderInfo, amount, extraData

    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = new Date().getTime() + Math.floor(Math.random() * 9999) + 1;
    var orderInfo = resquest.body.orderInfo;
    var redirectUrl = "https://danahome.onrender.com/return";
    // var redirectUrl = "http://localhost:3000/return";
    var ipnUrl = "http://localhost:8002/return";
    var amount = resquest.body.amount;
    var requestType = "payWithMethod";
    var extraData = resquest.body.extraData;

    var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "vi",
    });
    //Create the HTTPS objects
    const https = require("https");
    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };
    //Send the request and get the response
    const req = https.request(options, (res) => {
      res.setEncoding("utf8");
      res.on("data", (body) => {
        respone.json(JSON.parse(body));
      });
      res.on("end", () => {
        console.log("No more data in response.");
      });
    });

    req.on("error", (e) => {
      console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    req.write(requestBody);
    req.end();
  },
  notifyPaymentMomo: async (req, res) => {
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const rawSignature = `accessKey=${accessKey}&amount=${req.query.amount}&extraData=${req.query.extraData}&message=${req.query.message}&orderId=${req.query.orderId}&orderInfo=${req.query.orderInfo}&orderType=${req.query.orderType}&partnerCode=${req.query.partnerCode}&payType=${req.query.payType}&requestId=${req.query.requestId}&responseTime=${req.query.responseTime}&resultCode=${req.query.resultCode}&transId=${req.query.transId}`;

    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    if (signature === req.query.signature) {
      if (req.query.resultCode === "0") {
        const data = await JSON.parse(
          Buffer.from(req.query.extraData, "base64").toString(),
        );
        const isExist = await PaymentModel.findOne({
          where: {
            order_Id: req.query.orderId,
          },
        });
        if (Object.keys(data).length >= 3) {
          if (!isExist) {
            await PaymentModel.create({
              news_Id: data.newsId || null,
              user_Id: data.userId,
              amount: parseFloat(req.query.amount),
              description: req.query.orderInfo,
              order_Id: req.query.orderId,
              status: "2",
              payment_Type: "2",
            });
            await NewsModel.update(
              {
                status: 2,
                expire_At: data.expire_At,
              },
              {
                where: {
                  ID: data.newsId,
                },
              },
            );
          }
        } // Nạp tiền
        else if (req.query.orderInfo.includes("Nạp tiền")) {
          if (!isExist) {
            await PaymentModel.create({
              news_Id: null,
              user_Id: data.userId,
              amount: parseFloat(req.query.amount),
              description: req.query.orderInfo,
              order_Id: req.query.orderId,
              status: "2",
              payment_Type: "2",
            });
            const user = await UserModel.findByPk(data.userId);

            await UserModel.update(
              {
                amount: data.isVIP
                  ? user.dataValues.amount +
                    parseFloat(req.query.amount) +
                    parseFloat(req.query.amount) * 0.1
                  : user.dataValues.amount + parseFloat(req.query.amount),
              },
              {
                where: {
                  ID: data.userId,
                },
              },
            );
          }
        } // Đăng ký VIP
        else if (req.query.orderInfo.includes("Đăng ký vip")) {
          if (!isExist) {
            await PaymentModel.create({
              news_Id: null,
              user_Id: data.userId,
              amount: parseFloat(req.query.amount),
              description: req.query.orderInfo,
              order_Id: req.query.orderId,
              status: "2",
              payment_Type: "2",
            });

            await UserModel.update(
              {
                VIP_Expire_At: data.VIP_Expire_At,
                type: 1,
              },
              {
                where: {
                  ID: data.userId,
                },
              },
            );
          }
        } // Đăng ký VIP

        //return
        const UpdatedUser = await UserModel.findByPk(data.userId, {
          include: {
            model: RoleModel,
          },
        });
        const { role, password, role_Id, ...data1 } = UpdatedUser.dataValues;

        return res.status(200).json({
          message: "Thanh toán thành công!",
          statusCode: "1",
          data: { ...data1, isAdmin: UpdatedUser.role.role_Name === "ADMIN" },
        });
      } else {
        return res.status(401).json({
          message: req.query.message,
          statusCode: "2",
        });
      }
    } else {
      return res.status(403).json({
        message: "Thông tin request không hợp lệ!",
        statusCode: "3",
      });
    }
  },
  createPaymentVnpay: (resquest, respone) => {
    //require amount, userId

    var tmnCode = "YDPX0R9W";
    var secretKey = "JYGLMASANCWCHRQEQPYBYDFFYKEDIJJN";
    var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    var returnUrl = "https://danahome.onrender.com/return";
    // var returnUrl = "http://localhost:3000/return";
    var createDate = moment().format("YYYYMMDDHHmmss");
    var orderId =
      resquest.body.newsId +
      "_" +
      `${new Date().getTime() + Math.floor(Math.random() * 9999) + 1}`;
    var amount = resquest.body.amount;
    var orderInfo = resquest.body.orderInfo;
    var locale = "vn";
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_CreateDate"] = createDate;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_IpAddr"] = "192.168.1.103";
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_TxnRef"] = orderId;

    // vnp_Params = sortObject(vnp_Params);

    // var querystring = require("qs");
    // var signData = querystring.stringify(vnp_Params, { encode: false });
    // var crypto = require("crypto");
    // var hmac = crypto.createHmac("sha512", secretKey);
    // var signed = hmac.update(new Buffer.from(signData)).digest("hex");
    // vnp_Params["vnp_SecureHash"] = signed;
    // vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    respone.status(200).json({
      message: "Thành công!",
      payUrl: vnpUrl,
    });

  },
  notifyPaymentVnpay: async (req, res) => {
    var secretKey = "JYGLMASANCWCHRQEQPYBYDFFYKEDIJJN";

    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      if (rspCode === "00") {
        const isExist = await PaymentModel.findOne({
          where: {
            order_Id: orderId,
          },
        });
        if (orderId.includes("naptien")) {
          if (!isExist) {
            const userId = vnp_Params["vnp_OrderInfo"];
            await PaymentModel.create({
              news_Id: null,
              user_Id: userId,
              amount: parseFloat(vnp_Params["vnp_Amount"]) / 100,
              description: vnp_Params["vnp_OrderInfo"],
              order_Id: orderId,
              status: "2",
              payment_Type: "4",
            });
            const user = await UserModel.findByPk(userId);
            await UserModel.update(
              {
                amount: orderId.includes("naptienvip")
                  ? user.dataValues.amount +
                    parseFloat(vnp_Params["vnp_Amount"]) / 100 +
                    (parseFloat(vnp_Params["vnp_Amount"]) / 100) * 0.15
                  : user.dataValues.amount +
                    parseFloat(vnp_Params["vnp_Amount"]) / 100,
              },
              {
                where: {
                  ID: userId,
                },
              },
            );
            //return
            const UpdatedUser = await UserModel.findByPk(userId, {
              include: {
                model: RoleModel,
              },
            });
            const { role, password, role_Id, ...data1 } =
              UpdatedUser.dataValues;

            return res.status(200).json({
              message: "Thanh toán thành công!",
              statusCode: "1",
              data: {
                ...data1,
                isAdmin: UpdatedUser.role.role_Name === "ADMIN",
              },
            });
          } else {
            res.status(401).json({
              message: "Đã tồn tại!",
              statusCode: "3",
            });
          }
        } else if (orderId.includes("dangkyvip")) {
          if (!isExist) {
            const userId = vnp_Params["vnp_OrderInfo"].split("_")[0];
            const VIP_Expire_At = new Date(
              parseInt(vnp_Params["vnp_OrderInfo"].split("_")[1]),
            );
            await PaymentModel.create({
              news_Id: null,
              user_Id: userId,
              amount: parseFloat(vnp_Params["vnp_Amount"]) / 100,
              description: vnp_Params["vnp_OrderInfo"],
              order_Id: orderId,
              status: "2",
              payment_Type: "4",
            });
            await UserModel.update(
              {
                type: 1,
                VIP_Expire_At: VIP_Expire_At,
              },
              {
                where: {
                  ID: userId,
                },
              },
            );
            //return
            const UpdatedUser = await UserModel.findByPk(userId, {
              include: {
                model: RoleModel,
              },
            });
            const { role, password, role_Id, ...data1 } =
              UpdatedUser.dataValues;

            return res.status(200).json({
              message: "Thanh toán thành công!",
              statusCode: "1",
              data: {
                ...data1,
                isAdmin: UpdatedUser.role.role_Name === "ADMIN",
              },
            });
          } else {
            res.status(401).json({
              message: "Đã tồn tại!",
              statusCode: "3",
            });
          }
        } else {
          if (!isExist) {
            const newsId = orderId.split("_")[0];
            const userId = vnp_Params["vnp_OrderInfo"].split("_")[0];
            const expire_At = new Date(
              parseInt(vnp_Params["vnp_OrderInfo"].split("_")[1]),
            );
            await PaymentModel.create({
              news_Id: newsId || null,
              user_Id: userId,
              amount: parseFloat(vnp_Params["vnp_Amount"]) / 100,
              description: vnp_Params["vnp_OrderInfo"],
              order_Id: orderId,
              status: "2",
              payment_Type: "4",
            });
            await NewsModel.update(
              {
                status: 2,
                expire_At: expire_At,
              },
              {
                where: {
                  ID: newsId,
                },
              },
            );

            //return
            const UpdatedUser = await UserModel.findByPk(userId, {
              include: {
                model: RoleModel,
              },
            });
            const { role, password, role_Id, ...data1 } =
              UpdatedUser.dataValues;

            return res.status(200).json({
              message: "Thanh toán thành công!",
              statusCode: "1",
              data: {
                ...data1,
                isAdmin: UpdatedUser.role.role_Name === "ADMIN",
              },
            });
          } else {
            res.status(401).json({
              message: "Đã tồn tại!",
              statusCode: "3",
            });
          }
        }
      } else {
        res.status(401).json({
          message: "Thanh toán thất bại!",
          statusCode: "2",
        });
      }
    } else {
      res.status(403).json({
        message: "Thông tin request không hợp lệ!",
        statusCode: "3",
      });
    }
  },
  getPayment: async (req, res) => {
    const page = req.query.page - 1 || 0;
    const payment_Type = req.query.payment_Type;
    if (req.params.id) {
      const userId = req.params.id;
      try {
        const paymentInfo = await PaymentModel.findAll({
          where: {
            user_Id: userId,
            payment_Type: payment_Type
              ? payment_Type
              : {
                  [Op.ne]: null,
                },
          },
          include: {
            model: NewsModel,
            include: {
              model: ImagesModel,
            },
          },
          offset: page * 5,
          limit: 5,
        });
        const totalPaymentInfo = await PaymentModel.count({
          where: {
            user_Id: userId,
            payment_Type: payment_Type
              ? payment_Type
              : {
                  [Op.ne]: null,
                },
          },
        });
        res.status(200).json({
          message: "Thành công",
          data: paymentInfo,
          totalPaymentInfo,
        });
      } catch (error) {
        res.status(500).json({
          message: "Lỗi server",
        });
      }
    }
  },
};

module.exports = PaymentController;
