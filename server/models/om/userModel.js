/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */

// 创建 model
const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('om_user', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING
      },
      cellPhone: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.INTEGER
      },
      company: {
        type: DataTypes.STRING
      },
      passport: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get: function () {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get: function () {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
        }
      },
      expiredAt: {
        type: DataTypes.DATE,
        defaultValue: function () {
          var date = new Date();
          return date.setMonth(date.getMonth() + 3);
        },
        get: function () {
          return moment(this.getDataValue('expiredAt')).format('YYYY-MM-DD');
        }
      }
    }, {
      getterMethods   : {
        isExpired: function (){
          let now = new Date();
          return this.getDataValue('expiredAt') < now.getTime();
        }
      },
      freezeTableName: true
    }
  );
};

