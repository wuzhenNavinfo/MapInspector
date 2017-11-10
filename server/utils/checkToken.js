/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/11/2
 *
 * @copyright @Navinfo, all rights reserved.
 */

var jwt = require('jsonwebtoken');
var config = require('../config');
// 检查用户会话
module.exports = function(req, res, next) {
    //检查post,get的信息或者参数或者头信息
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.SECRET, function(err, decoded) {
            if (err) {
                return res.json({ errorCode: -1, message: err.message });
            } else {
                // 获得解码后的用户信息;
                req.loginUser = decoded;
                // 供后面的路由使用
                next();
            }
        });
    } else {
        // 如果没有token，则返回错误
        return res.status(403).send({
            errorCode: -1,
            message: '没有提供token！'
        });
    }
};
