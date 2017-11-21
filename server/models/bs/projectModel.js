/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */

// 创建 model
const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bb_project', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      projectDesc: {
        type: DataTypes.STRING,
        allowNull: false
      },
      auditUser: {
        type: DataTypes.INTEGER,
        references: {
          model: sequelize.model('om_user'),
          key: 'id'
        }
      },
      projectStatus: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
        }
      }
    }, {
      freezeTableName: true
    }
  );
};

