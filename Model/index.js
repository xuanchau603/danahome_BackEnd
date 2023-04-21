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
      defaultValue: "d79b924c-d9e4-11ed-911b-2cf05ddd2632",
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
        "https://res.cloudinary.com/di5qmcigy/image/upload/v1682065006/avatar_user/285-2856724_user-avatar-enter-free-photo-user-avatar-green-removebg-preview_r828vh.png",
    },
  },
  {
    timestamps: true,
  },
);

const CateRoomModel = db.define(
  "category_Rooms",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const CateNewsModel = db.define(
  "category_News",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

const NewsModel = db.define(
  "news",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    house_Number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    acreage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    expire_At: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    user_Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: "ID",
      },
    },
    category_Rooms_Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CateRoomModel,
        key: "ID",
      },
    },
    categorys_News_Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CateNewsModel,
        key: "ID",
      },
    },
  },
  {
    timestamps: true,
  },
);

const ImagesModel = db.define(
  "images",
  {
    ID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    image_URL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    news_Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: NewsModel,
        key: "ID",
      },
    },
  },
  {
    timestamps: true,
  },
);

RoleModel.hasMany(UserModel, { foreignKey: "role_Id" });
UserModel.belongsTo(RoleModel, { foreignKey: "role_Id" });

CateRoomModel.hasMany(NewsModel, { foreignKey: "category_Rooms_Id" });
NewsModel.belongsTo(CateRoomModel, { foreignKey: "category_Rooms_Id" });

CateNewsModel.hasMany(NewsModel, { foreignKey: "categorys_News_Id" });
NewsModel.belongsTo(CateNewsModel, { foreignKey: "categorys_News_Id" });

UserModel.hasMany(NewsModel, { foreignKey: "user_Id" });
NewsModel.belongsTo(UserModel, { foreignKey: "user_Id" });

NewsModel.hasMany(ImagesModel, { foreignKey: "news_Id" });
ImagesModel.belongsTo(NewsModel, { foreignKey: "news_Id" });

db.sync();

module.exports = {
  RoleModel,
  UserModel,
  VerifyCodeModel,
  CateRoomModel,
  CateNewsModel,
  NewsModel,
  ImagesModel,
};
