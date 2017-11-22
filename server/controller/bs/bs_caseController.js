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
const moment = require('moment');
const upLoad = require('../../utils/upload');
const tool = require('../../utils/publicTool');
const sequelize = require("../../dataBase");
const caseModel = sequelize.import('../../models/bs/caseModel');

/**
 * 用户管理控制器;
 * @param req
 * @param res
 * @constructor
 */
function caseController(req, res) {
  this.model = {};
  this.model.createUser = req.loginUser.id;
  this.model.caseSnap = '';
  this.model.caseDesc = '';
  this.model.caseMethod = '';
  this.model.images = [];
  this.model.videos = [];
  this.model.marker = {type: 'Point', coordinates: [0, 0]};
  this.req = req;
  this.res = res;
}

/**
 * 查存所有案例列表;
 * @method list
 * @returns {Promise.<TResult>}
 */
caseController.prototype.list = function () {
  let requestParam = {order: [["createdAt", "DESC"]]};
  if (this.req.query.pageSize && this.req.query.pageNum) {
    requestParam.limit = this.req.query.pageSize;
    requestParam.offset = (this.req.query.pageNum - 1) * this.req.query.pageSize;
  }
  return caseModel.findAndCountAll (requestParam).then (caseDatas => {
    let caseTotal = caseDatas.count;
    for (let i = 0; i < caseDatas.rows.length; i++) {
      let data = tool.clone (caseDatas.rows[i].dataValues);
      let imageLength = data.images ? data.images.split (',').length : 0;
      let videoLength = data.videos ? data.videos.split (',').length : 0;
      caseDatas.rows[i].dataValues.mediaLength = imageLength + videoLength;
    }
    return this.res.json ({
      errorCode: 0,
      result: {data: caseDatas.rows, total: caseTotal},
      message: '查找成功'
    });
  }).catch (err => {
    throw err;
  });
};

/**
 * 案例列表;
 * @method list
 * @returns {Promise.<TResult>}
 */
caseController.prototype.listDetail = function () {
  let requestParam = {order: [["createdAt", "DESC"]]};
  requestParam.condition = this.req.query.projectCode;
  if (this.req.query.pageSize && this.req.query.pageNum) {
    requestParam.limit = this.req.query.pageSize;
    requestParam.offset = (this.req.query.pageNum - 1) * this.req.query.pageSize;
  }
  return caseModel.findJoinWithIssue (requestParam)
  .then (result => {
    return caseModel.count()
    .then(caseCount => {
      let dataList = [];
      for (let i = 0; i < result.length; i++) {
        let data = {};
        proImageLength = result[i].proImages ? result[i].proImages.split(',').length : 0;
        proVideoLength = result[i].proVideos ? result[i].proVideos.split(',').length : 0;
        data.proMediaLength = proImageLength + proVideoLength;
        data.proCode = result[i].proCode ? result[i].proCode : this.req.query.projectCode;

        caseImageLength = result[i].caseImages ? result[i].caseImages.split(',').length : 0;
        caseVideoLength = result[i].caseVideos ? result[i].caseVideos.split(',').length : 0;
        data.caseMediaLength = caseImageLength + caseVideoLength;
        data.caseSnap = result[i].caseSnap;
        data.caseDesc = result[i].caseDesc;
        data.caseCode = result[i].caseCode;
        data.marker = result[i].marker;
        data.createdAt = moment(result[i].createdAt).format('YYYY-MM-DD');
        dataList.push(data);
      }
      return this.res.json ({
        errorCode: 0,
        result: {data: dataList, total: caseCount},
        message: '查找成功'
      });
    });
  })
  .catch(err => {
    throw err;
  });
};

/**
 * 根据案例id查询案例详情
 * @method query
 * @returns {Promise.<TResult>}
 */
caseController.prototype.query = function () {
  let requestParam = {where: {id: this.req.query.id}};
  return caseModel.findOne (requestParam).then (caseData => {
    if (caseData) {
      let caseDataCopy = tool.clone (caseData);
      let caseValues = caseDataCopy.dataValues;
      caseDataCopy.dataValues.videos = caseValues.videos ? caseValues.videos.split (',') : [];
      caseDataCopy.dataValues.images = caseValues.images ? caseValues.images.split (',') : [];
      return this.res.json ({
        errorCode: 0,
        result: {data: caseDataCopy},
        message: '查找成功'
      });
    } else {
      return this.res.json ({
        errorCode: -1,
        message: 'id为' + this.req.query.id + '的案例不存在!'
      });
    }
  }).catch (err => {
    throw err;
  });
};

/**
 * 上传图片todo
 *@method upload
 */
caseController.prototype.upload = function () {
  let _self = this;
  upLoad({
    dir: 'images/case',
    req: _self.req,
    calledBack: function (results) {
      return _self.res.json ({
        errorCode: 0,
        result: {data: results},
        message: '成功上传' + results.length + '张图片'
      });
    }
  });
};

/**
 * 创建案例
 * @method create
 * @returns {Promise.<TResult>}
 */
caseController.prototype.create = function () {
  tool.extend (this.model, this.req.body);
  this.model.images = this.model.images.join (',');
  this.model.videos = this.model.videos.join (',');
  return caseModel.create (this.model)
  .then (caseData => {
    if (caseData) {
      let caseDataCopy = tool.clone (caseData);
      let caseValues = caseDataCopy.dataValues;
      caseDataCopy.dataValues.videos = caseValues.videos ? caseValues.videos.split (',') : [];
      caseDataCopy.dataValues.images = caseValues.images ? caseValues.images.split (',') : [];
      return this.res.json ({
        errorCode: 0,
        result: {data: caseDataCopy},
        message: '案例创建成功'
      });
    } else {
      return this.res.json ({
        errorCode: -1,
        message: '案例创建失败'
      });
    }
  })
  .catch (err => {
    throw err;
  });
};

/**
 * 更新案例
 * @method update
 * @returns {Promise.<TResult>}
 */
caseController.prototype.update = function () {
  let condition = {where: {id: this.req.body.id}};
  tool.extend (this.model, this.req.body);
  this.model.images = this.model.images.join (',');
  this.model.videos = this.model.videos.join (',');
  delete this.model.id;
  return caseModel.update (this.model, condition)
  .then (result => {
    if (result) {
      return this.res.json ({
        errorCode: 0,
        message: '案例更新成功'
      });
    } else {
      return this.res.json ({
        errorCode: -1,
        message: '案例更新失败!'
      });
    }
  })
  .catch (err => {
    throw err;
  });
};

/**
 * 删除案例
 * @method delete
 * @returns {Promise.<TResult>}
 */
caseController.prototype.delete = function () {
  let requestParam = {where: {id: this.req.query.id}};
  return caseModel.destroy (requestParam)
  .then (result => {
    if (result) {
      return this.res.json ({
        errorCode: 0,
        message: '删除成功'
      });
    } else {
      return this.res.json ({
        errorCode: -1,
        message: '删除失败'
      });
    }
  })
  .catch (err => {
    throw err;
  });
};


module.exports = caseController;
