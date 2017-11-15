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

// 添加新用户
exports.getCount = function(param) {
  return caseInfo.count();
};

exports.findCombinaionIssue = function (obj) {
  var limit = '';
  if (obj.offset && obj.limit) {
    limit = ' limit ' + obj.offset + ',' + obj.limit;
  }
  var cond = obj.condition;
  var sql = 'SELECT ' +
    'c.id as caseCode, c.case_snap as caseSnap, c.case_desc as caseDesc, c.images as caseImages, c.videos as caseVideos, c.createdAt, ' +
    'i.pro_code as proCode, i.case_code as proCaseCode, i.images as proImages, i.videos as proVideos ' +
    'FROM bb_case AS c LEFT JOIN bb_issue As i ' +
    'ON (c.id=i.case_code) AND i.pro_code='+ cond + limit;
  return db.query(sql, { type: Sequelize.QueryTypes.SELECT});
};
