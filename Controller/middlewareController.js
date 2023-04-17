const jwt = require("jsonwebtoken");
const multer = require("multer");

const middlewareController = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const tokenType = token.split(" ")[0];
      if (!(tokenType === "Bearer")) {
        res.status(401).json({
          message: "Token type không đúng",
        });
      } else {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, "0802", (error, user) => {
          if (error) {
            res.status(403).json({
              message: "Token không đúng hoặc đã hết hạn",
            });
          } else {
            req.user = user;
            next();
          }
        });
      }
    } else {
      res.status(404).json({
        message: "Vui lòng cung cấp token",
      });
    }
  },
};

module.exports = middlewareController;
