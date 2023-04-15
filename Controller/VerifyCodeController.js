const { VerifyCodeModel, UserModel } = require("../Model");
const nodemailer = require("nodemailer");

const VerifyCodeController = {
  createVerifyCode: async (req, res) => {
    try {
      const email = req.body.email;
      const user = await UserModel.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        res.status(401).json({
          message: "Email đã được đăng ký",
        });
      } else {
        const code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        const newVerify = await VerifyCodeModel.create({
          email: email,
          code: code,
        });
        const transporter = nodemailer.createTransport({
          // config mail server
          service: "Gmail",
          auth: {
            user: "lexuanchau2001@gmail.com",
            pass: "rcyvwplufnibppfg",
          },
        });
        const mainOptions = {
          // thiết lập đối tượng, nội dung gửi mail
          from: "DaNaHome",
          to: email,
          subject: "Mã xác nhận đăng ký tài khoản DaNaHome",
          text: "You recieved message from " + req.body.email,
          html: `<h1 style="font-size: 30px; color: rgb(0, 0, 0)">
          Nhập mã xác nhận này để đăng ký tài khoản tại
          <b style="color: rgb(2, 174, 28)">DaNaHome</b>
        </h1> <b style=" font-size: 24px; display: block"
          >Mã xác nhận: <b style="font-size: 28px; color: rgb(2, 174, 28)">${code}</b>
        </b> <b style=" font-size: 24px; display: block"
        >Thời gian hết hạn:
        <b style="color: rgb(255, 46, 46)">${new Date(
          new Date().getTime() + 60000,
        ).toLocaleString()}</b>
      </b>`,
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent: " + info.response);
          }
        });

        setTimeout(() => {
          VerifyCodeModel.destroy({
            where: {
              ID: newVerify.dataValues.ID,
            },
          });
        }, 60000);

        res.status(200).json({
          message: "Vui lòng kiểm tra email để lấy mã xác nhận",
          expires: new Date(new Date().getTime() + 60000).toLocaleString(),
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error,
      });
    }
  },
};

module.exports = VerifyCodeController;
