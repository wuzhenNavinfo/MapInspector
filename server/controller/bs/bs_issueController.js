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
const issueModel = require('../../models/bs/issueModel');

/**
 * 用户管理控制器;
 * @param req
 * @param res
 * @constructor
 */
function issueController(req, res) {
  this.model = {};
  this.model.createUser = req.loginUser.userId;
  this.model.proCode = '';
  this.model.caseCode = '';
  this.model.images = '';
  this.model.videos = '';
  this.model.issueStatus = 0;
  this.req = req;
  this.res = res;
}

/**
 * 上传图片
 *@method upload
 */
issueController.prototype.upload = function () {
  let _self = this;
  upLoad({
    dir: 'images/issue',
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
 * 创建问题;
 * @method create
 */
issueController.prototype.create = function () {
  // this.req.body.images = this.req.body.images.join(',');
  // this.req.body.videos = this.req.body.videos.join(',');
  tool.extend(this.model, this.req.body);
  issueModel.upsert(this.model).then(result => {
    if (result) {
      let videos = result.dataValues.videos;
      let images = result.dataValues.images;
      result.dataValues.videos = videos ? videos.split(',') : [];
      result.dataValues.images = images ? images.split(',') : [];
      return this.res.json({errorCode: 0, result: { data: result }, message: '问题创建成功'});
    } else {
      return this.res.json({errorCode: -1, message: '问题创建失败!'});
    }
  }).catch(err => {
    return this.res.json({errorCode: -1, message: err.message});
  });
};

// 查找问题(通过项目id和案例id)
issueController.prototype.find = function () {
  let projectId = parseInt(this.req.query.proCode);
  let caseId = parseInt(this.req.query.caseCode);
  if (!projectId || !caseId){
    return this.res.json({errorCode: 0, message: '参数不合法!'});
  }
  let requestData = {where: {proCode: projectId, caseCode: caseId }};
  issueModel.findOne(requestData).then(result => {
    let videos = result.dataValues.videos;
    let images = result.dataValues.images;
    result.dataValues.videos = videos ? videos.split(',') : [];
    result.dataValues.images = images ? images.split(',') : [];
    return this.res.json({errorCode: 0, result: result, message: '问题查询成功'});
  }).catch(err => {
    return this.res.json({errorCode: -1, message: err.message});
  });
};



module.exports = issueController;
