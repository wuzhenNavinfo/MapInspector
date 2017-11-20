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


/*
 案例列表（case/list）
 案例详情（case/query）
 案例新增（case/create）
 案例修改（case/update）
 案例删除（case/delete）
 案例附件上传（case/file/upload）
* */

// 案例列表
router.get('/list', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt()
], function (req, res, next) {
  next('route');
});

// 案例列表与问题的联合查询
router.get('/listDetail', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt(),
  check('projectCode').exists().withMessage('缺少projectCode参数').isInt().withMessage('projectCode必须为整数')
], function (req, res, next) {
  next('route');
});

// 案例详情
router.get('/query', [
  sanitize(['id']).toInt(),
  check('id').exists().withMessage('缺少id参数').isInt().withMessage('id必须为整数')
], function (req, res, next) {
  next('route');
});

// 案例新增;
router.post('/create', [
  check('caseSnap').exists().withMessage('caseSnap属性为必填项'),
  sanitize('caseSnap').escape()
], function (req, res, next) {
  next('route');
});

// 案例新增;
router.post('/upload', function (req, res) {
  new bs_caseController(req, res).upload()
});

// 案例修改;
router.post('/update', [
  check('id').exists().withMessage('缺少案例id').isInt().withMessage('id值必须为整数'),
  sanitize(['caseSnap', 'caseDesc', 'caseMethod']).escape()
], function (req, res, next) {
  next('route');
});

// 案例删除;
router.get('/delete', [
  check('id').exists().withMessage('缺少案例id').isInt().withMessage('id值必须为整数')
], function (req, res, next) {
  next('route');
});

// 统一进行请求参数的错误处理和对控制器方法的操作;
router.use('/', (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new bs_caseController(req, res);
  if (typeof controller[methodName] === 'function') {
    controller[methodName]();
  } else {
    next('route');
  }
});

module.exports = router;
