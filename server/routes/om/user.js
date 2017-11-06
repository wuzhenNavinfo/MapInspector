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
var omController = require('../../controller/om/om_controller');

// 用户注册（增加用户）
router.post('/register', function (req, res) {
    new omController(req, res).register()
});

// 用户登陆
router.post('/login', function (req, res) {
    new omController(req, res).login()
});

// 查找用户;
router.get('/find', function (req, res) {
    new omController(req, res).find()
});

// 更新用户;
router.post('/update', function (req, res) {
    new omController(req, res).update()
});

// 删除用户;
router.get('/delete', function (req, res) {
    new omController(req, res).delete()
});

module.exports = router;
