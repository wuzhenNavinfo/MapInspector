/*
*   系统配置文件
* */
var path = require("path");
var config = {};
// 数据库相关配置;
config.DB_HOST = '192.168.4.189';
config.DB_USER = 'root';
config.DB_PWD = '111111';
config.DB_NAME = 'map_inspector';

// token签名;
config.SECRET = 'mapInspectorSecret';
// 将数据库操作暴露出去;
module.exports = config;
