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
  this.model.createUser = req.loginUser.userId;
  this.model.projectName = '';
  this.model.projectDesc = '';
  this.model.projectStatus = 0; // 作业中
  this.req = req;
  this.res = res;
}

/**
 * 根据用户查询项目列表
 * @method list
 * @returns {Promise.<TResult>}
 */
caseController.prototype.list = function () {
  let requestParam = {order: [["createdAt", "DESC"]]};
  requestParam.where = {createUser: this.model.createUser};
  if (this.req.query.pageSize && this.req.query.pageNum) {
    requestParam.limit = this.req.query.pageSize;
    requestParam.offset = (this.req.query.pageNum - 1) * this.req.query.pageSize;
  }
  return projectModel.findAndCountAll (requestParam)
  .then (result => {
    let proTotal = result.count;
    let proDataList = tool.clone (result.rows);
    return caseModel.count ()
    .then (caseCount => {
      return async.map (proDataList, (item, callback) => {
        let requestData = {
          where: {
            createUser: this.model.createUser,
            proCode: item.dataValues.id
          }
        };
        return issueModel.findAll (requestData)
        .then (issueDatas => {
          item.dataValues.issueTotal = caseCount;
          item.dataValues.worked = issueDatas.length;
          item.dataValues.unworked = caseCount - issueDatas.length;
          callback (null, item);
        });
      }, (err, results) => {
        if (err) throw err;
        return this.res.json ({
          errorCode: 0,
          result: {data: results, total: proTotal},
          message: '查找成功'
        });
      });
    });
  })
  .catch (err => {
    throw err;
  });
};

/**
 * 创建项目;
 * @method create
 * @returns {Promise.<TResult>}
 */
caseController.prototype.create = function () {
  tool.extend(this.model, this.req.body);
  return projectModel.findOne ({where: {projectName: this.model.projectName}})
  .then(result => {
    if (result) {
      return this.res.json({
        errorCode: -1,
        message: '以'+this.model.projectName+'为名的项目已存在'
      });
    } else {
      return projectModel.create(this.model)
      .then(result => {
        if (result) {
          return this.res.json({
            errorCode: 0,
            result: { data: result },
            message: '项目创建成功'
          });
        } else {
          return this.res.json({
            errorCode: -1,
            message: '项目创建失败!'
          });
        }
      });
    }
  })
  .catch(err => {
    throw err;
  });
};

/**
 * 根据项目id删除项目;
 * @method delete
 * @returns {Promise.<TResult>}
 */
caseController.prototype.delete = function () {
  let requestData = {where: {id: this.req.query.id}};
  return projectModel.destroy (requestData)
  .then (result => {
    if (result) {
      return this.res.json ({
        errorCode: 0,
        message: '删除成功'
      });
    } else {
      return this.res.json ({
        errorCode: -1,
        message: '删除失败,id为' + this.req.query.id + '的项目不存在'
      });
    }
  })
  .catch (err => {
    throw err;
  });
};


module.exports = caseController;
