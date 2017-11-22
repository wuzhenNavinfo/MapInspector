/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */

// 创建 model
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('om_role', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      roleCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      roleName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      roleDesc: {
        type: DataTypes.STRING
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      freezeTableName: true
    }
  );
};

