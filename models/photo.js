"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      photo.belongsTo(models.user, { foreignKey: 'UserId' })
      photo.hasMany(models.comment,{ foreignKey: 'PhotoId' })

    }
  }
  photo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title is required!",
          },
        },
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Caption is required!",
          },
        },
      },
      poster_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Poster image is required!",
          },
          isUrl: {
            msg: "Poster image URL is not valid!",
          },
        },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'photo',
    freezeTableName: true

  });
  return photo;
};
