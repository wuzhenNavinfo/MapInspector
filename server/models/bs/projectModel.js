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
      projectStatus: {
        type: DataTypes.INTEGER
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

