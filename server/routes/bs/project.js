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
var bs_projectController = require('../../controller/bs/bs_projectController');

let handler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new bs_projectController(req, res);
  if (typeof controller[methodName] === 'function' && req.method != 'OPTIONS') {
    controller[methodName]();
  } else {
    next('route');
  }
};

// 项目列表
router.get('/list', [
  sanitize(['pageSize']).toInt(),
  sanitize('pageNum').toInt()
], function (req, res, next) {
  handler(req, res, next);
});

// 案例项目;
router.post('/create', [
  check('projectName').exists().withMessage('项目名称（createUser）不能为空')
], function (req, res, next) {
  handler(req, res, next);
});

// 提交项目;
router.post('/submit', [
  check('projectId').exists().withMessage('缺少项目projectId'),
  check('auditUser').exists().withMessage('缺少审核用户id')
], function (req, res, next) {
  handler(req, res, next);
});

// 审核项目;
router.post('/auditPro', [
  check('projectId').exists().withMessage('缺少项目projectId').isInt().withMessage('项目projectId必须为整数'),
  check('projectStatus').exists().withMessage('缺少审核状态').isIn([3, 4]).withMessage('项目状态值域错误')
], function (req, res, next) {
  handler(req, res, next);
});


// 案例删除;
router.get('/delete', [
  check('id')
  .exists().withMessage('项目id不能为空')
  .isInt().withMessage('项目id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

module.exports = router;
