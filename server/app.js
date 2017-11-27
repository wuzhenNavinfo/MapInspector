var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./utils/autoRouter');
var log = require('./log');
//初始化数据库表结构;
require('./models/model');
// 创建express实例;
var app = express();

/* 增加跨域处理 */
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
};
log.use(app);
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/dist/')));
app.use(express.static(path.join(__dirname, 'public/upload/')));
app.use(allowCrossDomain);
// 路由分发器;
routes.init(app);

// 捕获404错误;
app.use(function(req, res, next) {
  var err = new Error('没有对应的请求资源');
  err.status = 404;
  next(err);
});

// 最后的错误处理;
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({errorCode: -1, message: err.message});
});

module.exports = app;
