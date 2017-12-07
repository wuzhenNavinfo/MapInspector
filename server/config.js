/*
*   系统配置文件
* */
var config = {};
// 正式环境的数据库相关配置;
// config.DB_HOST = '192.168.15.220';
// config.DB_USER = 'root';
// config.DB_PWD = '';
// config.DB_NAME = 'map_inspector';

// 开发环境的数据库相关配置;
config.DB_HOST = '192.168.4.189';
config.DB_USER = 'root';
config.DB_PWD = '111111';
config.DB_NAME = 'map_inspector';

// 超级管理员邮箱设置;
config.EMAIL_NAME = 'mapaudit@navinfo.com';
config.EMAIL_USER = 'mapaudit';
config.EMAIL_HOST = 'mail.navinfo.com';
config.EMAIL_PWD = 'Gaoyu123';
config.EMAIL_PORT = '25';



// token签名;
config.SECRET = 'mapInspectorSecret';
config.ROOTPATH = __dirname;

// 将数据库操作暴露出去;
module.exports = config;
