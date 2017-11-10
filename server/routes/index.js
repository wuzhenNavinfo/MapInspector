var express = require('express');
var router = express.Router();
var token = require('../utils/checkToken');
// 对api的所有接口进行token验证，除了login/register接口
router.use(/^((?!((register)|login)).)*$/, token);
module.exports = router;
