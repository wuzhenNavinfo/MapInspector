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
var bs_issueController = require('../../controller/bs/bs_issueController');

let handler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new bs_issueController(req, res);
  if (typeof controller[methodName] === 'function' && req.method != 'OPTIONS') {
    controller[methodName]();
  } else {
    next('route');
  }
};

// 创建问题;
router.post('/create', [
  check('proCode').exists().withMessage('缺少proCode参数').isInt().withMessage('proCode必须为整数'),
  check('caseCode').exists().withMessage('缺少caseCode参数').isInt().withMessage('caseCode必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

// 创建问题;
router.post('/auditIssue', [
  check('issueStatus').exists().withMessage('缺少issueStatus参数').isInt().withMessage('issueStatus必须为整数'),
  check('id').exists().withMessage('缺少id参数').isInt().withMessage('id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

// 根据项目id和案例id查询单条问题;
router.get('/find', [
  check('proCode').exists().withMessage('缺少proCode参数').isInt().withMessage('proCode必须为整数'),
  check('caseCode').exists().withMessage('缺少caseCode参数').isInt().withMessage('caseCode必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

// 问题上传;
router.post('/upload', function (req, res, next) {
  handler(req, res, next);
});

// 问题删除;
router.get('/delete', [
  check('id')
  .exists().withMessage('项目id不能为空')
  .isInt().withMessage('项目id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});


module.exports = router;
