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
router.get('/list', function (req, res) {
    new bs_caseController(req, res).list()
});

// 案例详情
router.get('/query', function (req, res) {
    new bs_caseController(req, res).query()
});

// 案例新增;
router.post('/create', function (req, res) {
    new bs_caseController(req, res).create()
});

// 案例新增;
router.post('/upload', function (req, res) {
  new bs_caseController(req, res).upload()
});

// 案例修改;
router.post('/update', function (req, res) {
    new bs_caseController(req, res).update()
});

// 案例删除;
router.get('/delete', function (req, res) {
    new bs_caseController(req, res).delete()
});

module.exports = router;
