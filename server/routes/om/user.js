/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/11/1
 *
 * @copyright @Navinfo, all rights reserved.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const omController = require('../../controller/om/om_userController');

let handler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new omController(req, res);
  if (typeof controller[methodName] === 'function' && req.method != 'OPTIONS') {
    controller[methodName]();
  } else {
    next('route');
  }
};

/**
 * @api {post} /om/user/register 用户注册(om/user/register).
 * @apiName register.
 * @apiGroup user manage.
 * @apiDescription 用户注册接口,注册的用户默认会分配为作业员身份(roleCode=2).
 * @apiParam {String} userName      用户名（必填）.
 * @apiParam {String} [fullName]    全名（可选）.
 * @apiParam {String} password      密码（必填）.
 * @apiParam {String} email         邮箱（必填）.
 * @apiParam {String} [cellPhone]   电话（可选）.
 * @apiParam {Integer} [status]     用户状态（可选，默认为0）.
 */
router.post('/register', [
    check('userName')
    .exists()
    .withMessage('userName参数不能为空'),
    check('password').exists().withMessage('password参数不能为空'),
    check('email').exists().withMessage('email参数不能为空').isEmail().withMessage('邮箱格式不合法')
], (req, res, next) => {
    handler(req, res, next);
  }
);

/**
 * @api {post} /om/login 用户登陆(om/user/login)
 * @apiName login.
 * @apiGroup user manage.
 * @apiDescription 用户登陆接口.
 * @apiParam {String} userName 用户名（必填）.
 * @apiParam {String} password 密码（必填）.
 */
router.post('/login', [
    check('userName').exists().withMessage('userName参数不能为空'),
    check('password').exists().withMessage('password参数不能为空')
] , (req, res, next) => {
  handler(req, res, next);
  }
);

/**
 * @api {post} /om/user/find 用户查询(om/user/find)
 * @apiName find.
 * @apiGroup user manage.
 * @apiDescription 用户查询功能，不传参数返回所有用户,
 * 传递pageSize和pageNum可进行分页查询.
 * @apiParam {Integer} [pageSize] 每页显示个数（可选）.
 * @apiParam {Integer} [pageNum]  查询页码（可选）.
 */
router.get('/find', [
    sanitize(['pageSize']).toInt(),
    sanitize('pageNum').toInt()
], (req, res, next) => {
  handler(req, res, next);
  }
);

/**
 * @api {post} /om/user/delete 用户删除(om/user/delete).
 * @apiName delete.
 * @apiGroup user manage.
 * @apiDescription 根据用户id删除用户功能.
 * @apiParam {Integer} userId 用户主键Id（必填）.
 */
router.get('/delete', [
    check('id').isInt().withMessage('id必须为整数')
], (req, res, next) => {
  handler(req, res, next);
  }
);

module.exports = router;
