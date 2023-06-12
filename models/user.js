  'use strict';
  const bcrypt = require('../helpers/bcrypt')
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class user extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        this.hasMany(models.photo, { foreignKey: 'UserId' });
        this.hasMany(models.comment, { foreignKey: 'UserId' });
        this.hasOne(models.SocialMedia, { foreignKey: 'UserId' });
      }
    }
    user.init({
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Full name is required!'
          },
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email address already in use!'
        },
        validate: {
          notEmpty: {
            msg: 'Email is required!'
          },
          isEmail: {
            msg: 'Email format is not valid!'
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username address already in use!'
        },
        validate: {
          notEmpty: {
            msg: 'Username is required!'
          },
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password is required!'
          },
        }
      },
      profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Profile image is required!'
          },
          isUrl: {
            msg: 'Profile image URL is not valid!'
          }
        }
      },  
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Age must be an integer!'
          },
          notEmpty: {
            msg: 'Age is required!'
          },
        }
      },
      phone_number:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isInt: {
            msg: 'Phone number must be an integer!'
          },
          notEmpty: {
            msg: 'Phone number is required!'
          },
        }
      }
    }, {
      sequelize,
      modelName: 'user',
      freezeTableName: true,
      hooks: {
        beforeCreate: (user) => {
          const hashedPass = bcrypt.hashPassword(user.password)
  
          user.password = hashedPass
        }
      }
    });
    return user;
  };