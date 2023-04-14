const { RoleModel, UserModel } = require("../Model");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserController = {
  getAllUser: async (req, res) => {
    try {
      const users = await UserModel.findAll({
        include: {
          model: RoleModel,
          attributes: ["role_Name"],
        },
      });

      res.status(200).json({
        message: "Thành công",
        list_User: users,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi server",
        error,
      });
    }
  },
  getUserById: async (req, res) => {
    const userId = req.params.id;
    if (userId) {
      try {
        const user = await UserModel.findByPk(userId, {
          include: {
            model: RoleModel,
          },
        });
        const { role, password, role_Id, ...data } = user.dataValues;

        res.status(200).json({
          message: "Thành công",
          user_Info: { ...data, isAdmin: user.role.role_Name === "ADMIN" },
        });
      } catch (error) {
        res.status(404).json({
          message: "Tài khoản không tồn tại!",
          error,
        });
      }
    } else {
      res.status(403).json({
        message: "Dữ liệu gửi lên không hợp lệ",
      });
    }
  },
  loginUser: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //Check exist email
    try {
      const user = await UserModel.findOne({
        where: {
          email: email,
        },
        include: {
          model: RoleModel,
        },
      });

      const validPassword = await bcrypt.compare(
        password,
        user.dataValues.password,
      );

      if (validPassword) {
        const accaccess_Token = jwt.sign(
          {
            id: user.dataValues.ID,
            isAdmin: user.role.role_Name === "ADMIN",
          },
          "0802",
          {
            expiresIn: "3d",
          },
        );
        const { role, password, role_Id, ...data } = user.dataValues;

        res.status(200).json({
          message: "Đăng nhập thành công",
          user_Info: { ...data, isAdmin: user.role.role_Name === "ADMIN" },
          access_Token: accaccess_Token,
        });
      } else {
        res.status(401).json({
          message: "Mật khẩu không đúng",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: "Email không tồn tại",
      });
    }
  },
  registerUser: async (req, res) => {
    const fullName = req.body.fullName;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;

    if (!fullName || !email || !phone || !password) {
      res.status(401).json({
        message: "Dữ liệu gửi đi không hợp lệ!",
      });
    } else {
      //check exist user
      const user = await UserModel.findOne({
        where: {
          [Op.or]: [{ email: email }, { phone: phone }],
        },
      });
      if (user) {
        if (user.dataValues.email === email) {
          return res.status(401).json({
            message: "Email đã đăng ký",
          });
        }
        if (user.dataValues.phone === phone) {
          return res.status(401).json({
            message: "Số điện thoại đã đăng ký",
          });
        }
      } else {
        try {
          const salt = await bcrypt.genSalt(10);
          const passwordHashed = await bcrypt.hash(password, salt);
          await UserModel.create({
            full_Name: fullName,
            email: email,
            phone: phone,
            password: passwordHashed,
          });
          res.status(200).json({
            message: "Đăng ký tài khoản thành công",
          });
        } catch (error) {
          res.status(500).json({
            message: "Lỗi server!",
            error,
          });
        }
      }
    }
  },
};

module.exports = UserController;
