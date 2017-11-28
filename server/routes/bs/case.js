/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/11/1
 *
 * @copyright @Navinfo, all rights reserved.
 */
var express = require('express');
var router = express.Router();
const path = require('path');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var bs_caseController = require('../../controller/bs/bs_caseController');

let handler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new bs_caseController(req, res);
  if (typeof controller[methodName] === 'function' && req.method != 'OPTIONS') {
    controller[methodName]();
  } else {
    next('route');
  }
};

/**
 * @api {get} /bs/case/list 用户查询(bs/case/list)
 * @apiName list.
 * @apiGroup case manage.
 * @apiDescription 案例查询功能，不传参数返回所有用户,
 * 传递pageSize和pageNum可进行分页查询.
 * @apiParam {Integer} [pageSize] 每页显示个数（可选）.
 * @apiParam {Integer} [pageNum]  查询页码（可选）.
 */
router.get('/list', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt()
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {get} /bs/case/listDetail 用户查询(bs/case/listDetail).
 * @apiName listDetail.
 * @apiGroup case manage.
 * @apiDescription 案例与问题的联合查询,返回特定项目下案例与问题的关联查询结果,
 * 传递一个参数返回所有结果，传递三个参数可进行分页查询.
 * 传递pageSize和pageNum可进行分页查询.
 * @apiParam {Integer} projectCode 项目Id（必填）.
 * @apiParam {Integer} [pageSize] 每页显示个数（可选）.
 * @apiParam {Integer} [pageNum]  查询页码（可选）.
 */
router.get('/listDetail', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt(),
  check('projectCode').exists().withMessage('缺少projectCode参数').isInt().withMessage('projectCode必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {get} /bs/case/query 用户查询(bs/case/query).
 * @apiName query.
 * @apiGroup case manage.
 * @apiDescription 案例详情接口,返回某个案例的全量信息.
 * 传递pageSize和pageNum可进行分页查询.
 * @apiParam {Integer} id 案例的Id（必填）.
 */
router.get('/query', [
  sanitize(['id']).toInt(),
  check('id').exists().withMessage('缺少id参数').isInt().withMessage('id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/create 新建案例(bs/case/create).
 * @apiName create.
 * @apiGroup case manage.
 * @apiDescription 新增案例.
 * @apiParam {String} caseSnap 案例概述（必填）.
 * @apiParam {String} [caseDesc] 案例的描述，默认为空（可选）.
 * @apiParam {String} [caseMethod] 案例的处理方法，默认为空（可选）.
 * @apiParam {Array} [images] 案例图片，默认为[]（可选）.
 * @apiParam {Array} [videos] 案例视频，默认为[]（可选）.
 * @apiParam {geoJson} [marker] 案例的点位信息，默认为{type: 'Point', coordinates: [0, 0]}（可选）.
 */
router.post('/create', [
  check('caseSnap').exists().withMessage('caseSnap属性为必填项'),
  sanitize('caseSnap').escape()
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/upload 案例上传(bs/case/upload).
 * @apiName upload.
 * @apiGroup case manage.
 * @apiDescription 案例上传接口，支持的图片格式为'.jpg', 'jpeg', '.png', '.gif'.
 */
router.post('/upload', function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/update 修改案例(bs/case/update).
 * @apiName update.
 * @apiGroup case manage.
 * @apiDescription 修改案例.
 * @apiParam {String} [caseSnap] 案例概述（可选）.
 * @apiParam {String} [caseDesc] 案例的描述，默认为空（可选）.
 * @apiParam {String} [caseMethod] 案例的处理方法，默认为空（可选）.
 * @apiParam {Array} [images] 案例图片，默认为[]（可选）.
 * @apiParam {Array} [videos] 案例视频，默认为[]（可选）.
 * @apiParam {geoJson} [marker] 案例的点位信息，默认为{type: 'Point', coordinates: [0, 0]}（可选）.
 */
router.post('/update', [
  check('id').exists().withMessage('缺少案例id').isInt().withMessage('id值必须为整数'),
  sanitize(['caseSnap', 'caseDesc', 'caseMethod']).escape()
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/case/delete 案例删除(bs/case/delete).
 * @apiName delete.
 * @apiGroup case manage.
 * @apiDescription 根据案例id删除案例功能.
 * @apiParam {Integer} id 案例主键Id（必填）.
 */
router.get('/delete', [
  check('id').exists().withMessage('缺少案例id').isInt().withMessage('id值必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

module.exports = router;
