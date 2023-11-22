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

        const isExist = await VerifyCodeModel.findOne({
          where: {
            email: email,
          },
        });
        if (isExist) {
          return res.status(403).json({
            message: "Vui lòng thử lại sau 1 phút!",
          });
        }

        const newCode = await VerifyCodeModel.create({
          email: email,
          code: code,
        });
        setTimeout(async () => {
          await VerifyCodeModel.destroy({
            where: {
              ID: newCode.dataValues.ID,
            },
          });
        }, 60000);
        const transporter = nodemailer.createTransport({
          // config mail server
          service: "Gmail",
          auth: {
            user: "lexuanchau2001@gmail.com",
            pass: "jvzhqzmcluswfvyt"
          },
        });
        const mainOptions = {
          // thiết lập đối tượng, nội dung gửi mail
          from: "DaNaHome",
          to: email,
          subject: "Mã xác nhận đăng ký tài khoản DaNaHome",
          text: "You recieved message from " + req.body.email,
          html: `<div class=""><div class="aHl"></div><div id=":io" tabindex="-1"></div><div id=":id" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc2MjM0NTU1MzYxMDQxODU0MyIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc2MjM0NTU1MzYxMDQxODU0MyIsbnVsbCxbXV0."><div id=":ic" class="a3s aiL "><div class="adM">
      </div><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
      <table style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0" width="600" border="0" cellspacing="0" cellpadding="40">
        <tbody><tr><td align="center"><div style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;text-align:left;width:465px">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
        <div><h1 style="color: green">DaNaHome</h1></div>
        <h1 style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:24px;font-weight:normal;margin:30px 0;padding:0">Xác minh email của bạn để đăng ký tại <b>DaNaHome</b></h1>
      </td></tr>
      </tbody></table>
      
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">Chúng tôi đã nhận được một yêu cầu đăng ký từ email:
       </p>
      <br>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr>
          <td align="center" bgcolor="#f6f6f6" valign="middle" height="40" style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:16px;font-weight:bold">${email}</td>
        </tr>
      </tbody></table>
      
      <br>
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">Để hoàn tất việc đăng ký vui lòng nhập mã xác nhận bên dưới để yêu cầu đăng ký của bạn được chấp nhận:</p>
      <br>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
      <div>
        
          <a  style="background-color:#c9ffd2;border-radius:5px;color:#000;display:inline-block;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:20px;font-weight:600;line-height:50px;text-align:center;text-decoration:none;width:200px" >${code}</a>
        
      </div>
      </td></tr>
      </tbody></table>
      
      <br>
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px"><b>Lưu ý</b>: Mã xác nhận này chỉ có hiệu lực trong vòng 60 giây kể từ lúc bạn nhận được email này</p>

      <br>
      <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%">
      <p style="color:#666666;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:12px;line-height:24px">Nếu bạn không cố gắng đăng ký nhưng nhận được email này hoặc nếu vị trí không khớp, vui lòng bỏ qua email này. Nếu bạn lo lắng về sự an toàn của tài khoản, vui lòng trả lời email này để liên hệ với chúng tôi.</p>
      </div></td></tr>
      </tbody></table>
      </td></tr>
      </tbody></table><div class="yj6qo"></div><div class="adL">
      </div></div></div><div id=":is" class="ii gt" style="display:none"><div id=":it" class="a3s aiL "></div></div><div class="hi"></div></div>`,
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent: " + info.response);
          }
        });

        res.status(200).json({
          message: "Vui lòng kiểm tra email để lấy mã xác nhận",
          Expires_later: 60000,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error,
      });
    }
  },
  createResponseReview: async (req, res) =>{
    try {
      const email = req.body.email;
      const user = await UserModel.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(401).json({
          message: "Email này không tồn tại trong hệ thống!",
        });
      } else {
        const title = req.body.title;
        const content = req.body.content;
        
        
        const transporter = nodemailer.createTransport({
          // config mail server
          service: "Gmail",
          auth: {
            user: "lexuanchau2001@gmail.com",
            pass: "jvzhqzmcluswfvyt"
          },
        });
        const mainOptions = {
          // thiết lập đối tượng, nội dung gửi mail
          from: "DaNaHome",
          to: email,
          subject: "Phản hồi đánh giá",
          text: "You recieved message from " + req.body.email,
          html: `<div class=""><div class="aHl"></div><div id=":io" tabindex="-1"></div><div id=":id" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc2MjM0NTU1MzYxMDQxODU0MyIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc2MjM0NTU1MzYxMDQxODU0MyIsbnVsbCxbXV0."><div id=":ic" class="a3s aiL "><div class="adM">
      </div><table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
      <table style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0" width="600" border="0" cellspacing="0" cellpadding="40">
        <tbody><tr><td align="center"><div style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;text-align:left;width:465px">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
        <div><h1 style="color: green">DaNaHome</h1></div>
        <h1 style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:24px;font-weight:normal;margin:30px 0;padding:0">Phản hồi đánh giá về <b>DaNaHome</b></h1>
      </td></tr>
      </tbody></table>
      
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">Chúng tôi đã nhận được một đánh giá từ email: </p>
      <br>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr>
          <td align="center" bgcolor="#f6f6f6" valign="middle" height="40" style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:16px;font-weight:bold">${email}</td>
        </tr>
      </tbody></table>
      
      <br>
      <b style="color:#1ac96f;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:24px;line-height:24px">${title}</b>
      <br>
      <br>
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">--- ${content}</p>

      <br>
      <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%">
      <p style="color:#666666;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:12px;line-height:24px">Nếu bạn lo lắng về sự an toàn của tài khoản, vui lòng trả lời email này để liên hệ với chúng tôi.</p>
      </div></td></tr>
      </tbody></table>
      </td></tr>
      </tbody></table><div class="yj6qo"></div><div class="adL">
      </div></div></div><div id=":is" class="ii gt" style="display:none"><div id=":it" class="a3s aiL "></div></div><div class="hi"></div></div>`,
        };
        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Message sent: " + info.response);
          }
        });

        res.status(200).json({
          message: "Phản hổi thành công đến email",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error,
      });
    }
  }
};

module.exports = VerifyCodeController;
