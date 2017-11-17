/**
 * @description
 * @file
 * @author    lingLong
 * @date      2017/10/31
 *
 * @copyright @Navinfo, all rights reserved.
 */

/**
 * 引入相关模块
 */
const async = require('async');
const tool = require('../../utils/publicTool');
const projectModel = require('../../models/bs/projectModel');
const issueModel = require('../../models/bs/issueModel');
const caseModel = require('../../models/bs/caseModel');

/**
 * 用户管理控制器;
 * @param req
 * @param res
 * @constructor
 */
function caseController(req, res) {
  this.model = {};
  this.model.createUser = '';
  this.model.projectName = '';
  this.model.projectDesc = '';
  this.model.projectStatus = 0; // 作业中
  this.req = req;
  this.res = res;
}

/**
 * 项目列表
 * @method list
 */
caseController.prototype.list = function () {
  let requestParam = null;
  if (!this.req.query.pageSize && !this.req.query.pageNum) {
    requestParam = {where: {createUser: this.req.loginUser.userId},order: [["createdAt", "DESC"]]};
  } else if (this.req.query.pageSize && this.req.query.pageNum) {
    let pageSize = parseInt(this.req.query.pageSize);
    let startIndex = (parseInt(this.req.query.pageNum) - 1) * pageSize;
    if (isNaN(startIndex) || isNaN(pageSize) || startIndex < 0 || pageSize < 1) {
      return this.res.json({errorCode: -1, message: '查询参数有误'});
    }
    requestParam = {
      limit: pageSize,
      offset: startIndex,
      where: {createUser: this.req.loginUser.userId},
      order: [["createdAt", "DESC"]]
    };
  } else {
    return this.res.json({errorCode: -1, message: '查询参数有误'});
  }
  projectModel.findAndCountAll(requestParam).then (result => {
    let rowNum = result.count;
    let dataList = tool.clone(result.rows);
    caseModel.getCount().then(count => {
      async.mapLimit(dataList, 10, (item, callback)=>{
        issueModel.findAll({where: {proCode: item.dataValues.id, createUser: this.req.loginUser.userId}})
        .then(result => {
          item.dataValues.issueTotal = count;
          item.dataValues.worked = result.length;
          item.dataValues.unworked = count - result.length;
          callback(null, item);
        })
        .catch(err => {
          throw err;
        });
      }, (err, results) => {
        if (err) throw err;
        return this.res.json ({errorCode: 0, result: {data: results, total: rowNum}, message: '查找成功'});
      });
    });
  }).catch(err => {
    return this.res.json ({errorCode: -1, message: err.message});
  });
};

/**
 * 创建项目;
 * @method create
 */
caseController.prototype.create = function () {
  this.req.body.createUser = parseInt(this.req.body.createUser);
  if (!this.req.body.createUser || isNaN(this.req.body.createUser)) {
    return this.res.json({errorCode: -1, message: '参数错误,createUser不合法!'});
  }
  tool.extend(this.model, this.req.body);
  projectModel.create(this.model).then(result => {
    if (result) {
      return this.res.json({errorCode: 0, result: { data: result }, message: '项目创建成功'});
    } else {
      return this.res.json({errorCode: -1, message: '项目创建失败!'});
    }
  }).catch(err => {
    return this.res.json({errorCode: -1, message: err.message});
  });
};

/**
 * 删除项目
 * @method delete
 */
caseController.prototype.delete = function () {
  let deleteId;
  try {
    deleteId = parseInt(this.req.query.id);
  }catch (err) {
    throw new Error('缺少项目id');
  }
  projectModel.destroy({where: {id: deleteId}})
    .then(result => {
      if (result) {
        return this.res.json({errorCode: 0, message: '删除成功'});
      } else {
        return this.res.json({errorCode: -1, message: '删除失败,id为${deleteId}的项目不存在'});
      }
    })
    .catch(err => {
      return this.res.json({errorCode: -1, message: err.message});
    });
};


module.exports = caseController;
