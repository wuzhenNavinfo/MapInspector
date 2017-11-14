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
const upLoad = require('../../utils/upload');
const tool = require('../../utils/publicTool');
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
  this.model.caseSnap = '';
  this.model.caseDesc = '';
  this.model.caseMethod = '';
  this.model.images = '';
  this.model.videos = '';
  this.model.marker = {type: 'Point', coordinates: [0, 0]};
  this.req = req;
  this.res = res;
}

/**
 * 案例列表
 * @method list
 */
caseController.prototype.list = function () {
  let pageSize = parseInt(this.req.query.pageSize);
  let startIndex = (parseInt(this.req.query.pageNum) - 1) * pageSize;
  if (isNaN(startIndex) || isNaN(pageSize) || startIndex < 0 || pageSize < 1) {
    return this.res.json({errorCode: -1, message: '查询参数有误'});
  }
  let requestParam = { limit: pageSize, offset: startIndex };
  caseModel.multiFind (requestParam).then (result => {
    let rowNum = result.count;
    let dataList = [];
    for (let i = 0; i < result.rows.length; i++) {
      let data = {};
      let imageLength = 0;
      let videoLength = 0;
      if (result.rows[i].dataValues.images) {
        imageLength = result.rows[i].dataValues.images.split(',').length;
      }
      if (result.rows[i].dataValues.videos) {
        videoLength = result.rows[i].dataValues.videos.split(',').length;
      }
      data.id = result.rows[i].dataValues.id;
      data.createUser = result.rows[i].dataValues.createUser;
      data.caseSnap = result.rows[i].dataValues.caseSnap;
      data.mediaLength = imageLength + videoLength;
      data.createdAt = result.rows[i].dataValues.createdAt;
      dataList.push(data);
    }
    return this.res.json ({errorCode: 0, result: {data: dataList, total: rowNum}, message: '查找成功'});
  }).catch(err => {
    throw err;
  });
};

/**
 * 查询案例详情
 * @method query
 */
caseController.prototype.query = function () {
  let id = parseInt(this.req.query.id);
  if (!id || isNaN(id)) {
    return this.res.json({errorCode: -1, message: '查询参数有误'});
  }
  let requestParam = { where: { id: parseInt(this.req.query.id) } };
  caseModel.findOneCase(requestParam).then(result => {
    if (result) {
      let videos = result.dataValues.videos;
      let images = result.dataValues.images;
      result.dataValues.videos = videos ? videos.split(',') : [];
      result.dataValues.images = images ? images.split(',') : [];
      return this.res.json({errorCode: 0, result: { data: result }, message: '查找成功'});
    } else {
      return this.res.json({errorCode: -1, message: 'id为' + this.req.query.id + '的案例不存在!'});
    }
  }).catch(err => {
    throw err;
  });
};

/**
 * 上传图片
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
 */
caseController.prototype.create = function () {
  this.req.body.createUser = parseInt(this.req.body.createUser);
  if (!this.req.body.createUser || isNaN(this.req.body.createUser)) {
    return this.res.json({errorCode: -1, message: '参数错误,createUser不合法!'});
  }
  this.req.body.images = this.req.body.images.join(',');
  this.req.body.videos = this.req.body.videos.join(',');
  tool.extend(this.model, this.req.body);
  caseModel.addCase(this.model).then(result => {
    if (result) {
      let videos = result.dataValues.videos;
      let images = result.dataValues.images;
      result.dataValues.videos = videos ? videos.split(',') : [];
      result.dataValues.images = images ? images.split(',') : [];
      return this.res.json({errorCode: 0, result: { data: result }, message: '案例创建成功'});
    } else {
      return this.res.json({errorCode: -1, message: '案例创建失败!'});
    }
  }).catch(err => {
    throw err;
  });
};

/**
 * 创建案例
 * @method create
 */
caseController.prototype.update = function () {
  this.req.body.id = parseInt(this.req.body.id);
  if (!this.req.body.id || isNaN(this.req.body.id)) {
    return this.res.json({errorCode: -1, message: '参数错误id值不合法!'});
  }
  this.req.body.createUser = parseInt(this.req.body.createUser);
  this.req.body.images = this.req.body.images.join(',');
  this.req.body.videos = this.req.body.videos.join(',');
  tool.extend(this.model, this.req.body);
  delete this.model.id;
  var updateData = this.model;
  var condition = {where: {id: this.req.body.id}};
  caseModel.updateCase(updateData, condition).then(result => {
    if (result) {
      return this.res.json({errorCode: 0, message: '案例更新成功'});
    } else {
      return this.res.json({errorCode: -1, message: '案例更新失败!'});
    }
  }).catch(err => {
    throw err;
  });
};

/**
 * 删除案例
 * @method delete
 */
caseController.prototype.delete = function () {
  let deleteId =  0;
  let requestParam = {};
  if (this.req.query.id) {
    deleteId = parseInt(this.req.query.id);
  } else {
    return this.res.json({errorCode: -1, message: '参数错误!'});
  }
  requestParam.where = { id: deleteId };
  caseModel.deleteCase(requestParam).then(result => {
    if (result) {
      return this.res.json({errorCode: 0, message: '删除成功'});
    } else {
      return this.res.json({errorCode: -1, message: '删除失败'});
    }
  }).catch(err => {
    throw err;
  });
};


module.exports = caseController;
