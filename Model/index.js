const { DataTypes, UUIDV4 } = require("sequelize");
const db = require("./dbConnect");

const RoleModel = db.define(
  "roles",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    role_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 2,
      },
    },
    role_Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

const VerifyCodeModel = db.define(
  "verify_Codes",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = db.define(
  "users",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    role_Id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: "d79b924c-d9e4-11ed-911b-2cf05ddd2632	",
      references: {
        model: RoleModel,
        key: "ID",
      },
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    full_Name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "User",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_URL: {
      type: DataTypes.STRING,
      defaultValue:
        "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon.png",
    },
  },
  {
    timestamps: true,
  },
);

RoleModel.hasMany(UserModel, { foreignKey: "role_Id" });
UserModel.belongsTo(RoleModel, { foreignKey: "role_Id" });

db.sync();

module.exports = {
  RoleModel,
  UserModel,
  VerifyCodeModel,
};
