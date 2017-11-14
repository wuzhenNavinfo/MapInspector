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
var bs_issueController = require('../../controller/bs/bs_issueController');


// 案例项目;
router.post('/create', function (req, res) {
  new bs_issueController(req, res).create()
});

// 案例项目;
router.get('/find', function (req, res) {
  new bs_issueController(req, res).find()
});

// 案例项目;
router.post('/upload', function (req, res) {
  new bs_issueController(req, res).upload()
});


// 案例删除;
router.get('/delete', function (req, res) {
    new bs_issueController(req, res).delete()
});

module.exports = router;
