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

/**
 * @api {get} /bs/project/list 项目列表(bs/project/list).
 * @apiName list.
 * @apiGroup project manage.
 * @apiDescription 项目查询功能，不传参数返回所有项目,
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
 * @api {post} /bs/project/create 创建项目(bs/project/create).
 * @apiName create.
 * @apiGroup project manage.
 * @apiDescription 创建项目.
 * @apiParam {String} projectName 项目名称(必传).
 * @apiParam {Integer} [projectDesc] 项目描述(可选).
 */
router.post('/create', [
  check('projectName').exists().withMessage('项目名称（createUser）不能为空')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/project/submit 项目提交(bs/project/submit).
 * @apiName submit.
 * @apiGroup project manage.
 * @apiDescription 项目提交.
 * @apiParam {Integer} projectId 要提交的项目id(必传).
 * @apiParam {Integer} auditUser 提交给的用户id(必传).
 */
router.post('/submit', [
  check('projectId').exists().withMessage('缺少项目projectId'),
  check('auditUser').exists().withMessage('缺少审核用户id')
], function (req, res, next) {
  handler(req, res, next);
});

/**
 * @api {post} /bs/project/auditPro 审核项目(bs/project/auditPro).
 * @apiName auditPro.
 * @apiGroup project manage.
 * @apiDescription 审核项目.
 * @apiParam {Integer} projectStatus 项目的状态(必传)，可选值为[1未提交，2已提交/待审核，3审核通过,4审核不通过].
 * @apiParam {Integer} projectId 项目的主键id(必传).
 */
router.post('/auditPro', [
  check('projectId').exists().withMessage('缺少项目projectId').isInt().withMessage('项目projectId必须为整数'),
  check('projectStatus').exists().withMessage('缺少审核状态').isIn([3, 4]).withMessage('项目状态值域错误')
], function (req, res, next) {
  handler(req, res, next);
});


/**
 * @api {get} /bs/project/delete 项目删除(bs/project/delete)
 * @apiName delete.
 * @apiGroup project manage.
 * @apiDescription 根据项目id删除问题功能.
 * @apiParam {Integer} id 项目主键Id（必填）.
 */
router.get('/delete', [
  check('id')
  .exists().withMessage('项目id不能为空')
  .isInt().withMessage('项目id必须为整数')
], function (req, res, next) {
  handler(req, res, next);
});

module.exports = router;
