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
var bs_projectController = require('../../controller/bs/bs_projectController');



// 项目列表
router.get('/list', function (req, res) {
    new bs_projectController(req, res).list()
});

// 案例项目;
router.post('/create', function (req, res) {
    new bs_projectController(req, res).create()
});


// 案例删除;
router.get('/delete', function (req, res) {
    new bs_projectController(req, res).delete()
});

module.exports = router;
