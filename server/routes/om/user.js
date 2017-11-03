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
    omController(req.body).register(req, res)
});

// 用户登陆
router.post('/login', function (req, res) {
    omController(req.body).login(req, res)
});

// 查找用户;
router.get('/find', function (req, res) {
    omController(req.body).find(req, res)
});

// 更新用户;
router.post('/update', function (req, res) {
    omController(req.body).update(req, res)
});

// 删除用户;
router.get('/delete', function (req, res) {
    omController(req.body).delete(req, res)
});

module.exports = router;