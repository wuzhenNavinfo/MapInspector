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

const sequelize = require("../../dataBase");
const userModel = sequelize.import('../../models/om/userModel');
const caseModel = sequelize.import('../../models/bs/caseModel');
const issueModel = sequelize.import('../../models/bs/issueModel');
const projectModel = sequelize.import('../../models/bs/projectModel');

/**
 * 用户管理控制器;
 * @param req
 * @param res
 * @constructor
 */
function caseController(req, res) {
  this.model = {};
  this.model.createUser = req.loginUser.id;
  this.model.projectName = '';
  this.model.projectDesc = '';
  this.model.auditUser = null;
  this.model.projectStatus = 1; // 作业中
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
  let createMan = this.model.createUser;
  requestParam.include = ['pojectUser'];
  // 根据当前登陆用户过滤项目;
  if (this.req.loginUser['om_roles'][0].roleCode == 1) {
    requestParam.where = {createUser: createMan};
  } else {
    requestParam.where = {auditUser: createMan};
  }
  // 根据项目状态过滤项目;
  if (this.req.query.projectStatus) {
    requestParam.where.projectStatus = {$in: JSON.parse(this.req.query.projectStatus)};
  }
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
        return async.parallel([
          function (cb) {
            issueModel.count({where: {proCode: item.id}})
            .then(count=> {
              cb(null, count)
            })
          },
          function (cb) {
            issueModel.count({where: {proCode: item.id, issueStatus: 0}})
            .then(count=> {
              cb(null, count)
            })
          },
          function (cb) {
            issueModel.count({where: {proCode: item.id, issueStatus: 1}})
            .then(count=> {
              cb(null, count)
            })
          },
          function (cb) {
            issueModel.count({where: {proCode: item.id, issueStatus: 2}})
            .then(count=> {
              cb(null, count)
            })
          }
        ], (err, results) => {
          item.dataValues.issueTotal = caseCount;
          item.dataValues.worked = results[0];
          item.dataValues.unworked = caseCount - results[0];
          item.dataValues.createUser = item.dataValues.pojectUser.userName;
          item.dataValues.waitAudited = results[1];
          item.dataValues.audited = results[2];
          item.dataValues.errorCount = results[3];
          delete item.dataValues.pojectUser;
          callback (null, item);
        })
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
 * 提交项目projectStatus 1->待作业；2->已提交；3->已完成；4->审核不通过;
 * @method submit
 * @returns {Promise.<TResult>}
 */
caseController.prototype.submit = function () {
  let projectId = this.req.body.projectId;
  let auditUser = this.req.body.auditUser;
  let updateData = {
    auditUser: auditUser,
    projectStatus: 2,
    submitAt: Date()
  };
  let condition = {where: {id: projectId}};
  async.parallel([
    function (calledBack) {
      return caseModel.count ()
        .then(count => {
          calledBack(null, count)
        })
    },
    function (calledBack) {
      let requestData = {
        where: { proCode: projectId }
      };
      return issueModel.count(requestData)
      .then(count => {
        calledBack(null, count);
      });
    }
  ],(err, results) => {
    if (results[0] != results[1]) {
      this.res.json({errorCode: '-1', message: '问题还没处理完'});
    } else {
      return projectModel.update(updateData, condition)
      .then(affectedCount => {
        if (affectedCount) {
          this.res.json({errorCode: 0, message: '提交案例成功'});
        } else {
          this.res.json({errorCode: -1, message: '提交案例失败'});
        }
      })
      .catch(err => {
        throw err;
      })
    }
  });
};

/**
 * 项目审核;
 * @method auditPro
 * @returns {Promise.<T>}
 */
caseController.prototype.auditPro = function () {
  let projectId = this.req.body.projectId;
  let requestData = {where: {id: projectId}};
  return projectModel.findOne (requestData)
  .then (result => {
    if (result.auditUser != this.req.loginUser.id) {
      return this.req.json ({errorCode: '-1', message: '该项目不属于用该用户审核'});
    }
    if (result.projectStatus != 2) {
      return this.req.json ({errorCode: '-1', message: '该项目不满足审核的状态'});
    }
    let updateData = {projectStatus: this.req.body.projectStatus};
    if (this.req.body.projectStatus == 4) {
      updateData.auditUser = null;
    }
    return projectModel.update (updateData, {where: {id: projectId}})
    .then ((affectedCount, affectedRow) => {
      if (affectedCount) {
        return this.res.json ({errorCode: 0, message: '审核成功'});
      } else {
        return this.res.json ({errorCode: -1, message: '审核失败'});
      }
    });
  })
  .catch (err => {
    throw err
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
