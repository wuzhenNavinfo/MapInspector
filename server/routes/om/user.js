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

// 用户注册（增加用户）
router.post('/register', [
    check('userName')
    .exists()
    .withMessage('userName参数不能为空'),
    check('password').exists().withMessage('password参数不能为空'),
    check('email').exists().withMessage('email参数不能为空').isEmail().withMessage('邮箱格式不合法')
  ], (req, res, next) => {
    next('route');
  }
);

// 用户登陆
router.post('/login', [
    check('userName').exists().withMessage('userName参数不能为空'),
    check('password').exists().withMessage('password参数不能为空')
  ] , (req, res, next) => {
    next('route');
  }
);

// 查找用户;
router.get('/find', [
    sanitize(['pageSize']).toInt(),
    sanitize('pageNum').toInt()
  ], (req, res, next) => {
    next('route');
  }
);

// 删除用户;
router.get('/delete', [
    check('id').isInt().withMessage('id必须为整数')
  ], (req, res, next) => {
    next('route');
  }
);

// 统一进行请求参数的错误处理和对控制器方法的操作;
router.use('/', (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errorCode: -1, errors: errors.mapped() });
  }
  // 要保证路由接口和控制器方法一致;
  let methodName = path.basename(req.url).split('?')[0];
  let controller = new omController(req, res);
  if (typeof controller[methodName] === 'function') {
    controller[methodName]();
  } else {
    next('route');
  }
});

module.exports = router;
