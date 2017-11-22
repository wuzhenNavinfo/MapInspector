/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */

// 创建用户脚色关系模型model;
const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('om_user_role', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
      }
    }, {
      freezeTableName: true
    }
  );
};
