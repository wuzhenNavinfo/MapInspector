/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */
const Sequelize = require('sequelize');
const db = require('../../dataBase');

// 创建 model
var caseInfo = db.define('bb_case', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        createUser: {
          type: Sequelize.INTEGER,
          field: 'create_user',
          allowNull: false,
          references: {
            model: 'om_user',
            key: 'user_id'
          }
        },
        caseSnap: {
          type: Sequelize.STRING,
          field: 'case_snap'
        },
        caseDesc: {
          type: Sequelize.STRING,
          field: 'case_desc'
        },
        caseMethod: {
          type: Sequelize.STRING,
          field: 'case_method'
        },
        images: {
          type: Sequelize.STRING
        },
        videos: {
          type: Sequelize.STRING
        },
        marker: {
          type: Sequelize.GEOMETRY
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        freezeTableName: true
    }
);

// 如果 force = true 则会把存在的表（如果 users 表已存在）先销毁再创建表
// var user = User.sync({ force: false });

// 添加新用户
exports.addCase = function(param) {
    return caseInfo.create(param);
};

// 更新用户;
exports.updateCase = function (params, conditions) {
  return caseInfo.update(params, conditions)
};

// 添加新用户
exports.multiFind = function(param) {
  return caseInfo.findAndCountAll(param);
};

// 通过案例id查找;
exports.findOneCase = function (params) {
  return caseInfo.findOne(params)
};

// 添加新用户
exports.deleteCase = function(param) {
  return caseInfo.destroy(param);
};
