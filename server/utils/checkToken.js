/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/11/2
 *
 * @copyright @Navinfo, all rights reserved.
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/om/userModel');
// 检查用户会话
module.exports = function(req, res, next) {
    //检查post,get的信息或者参数或者头信息
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (req.method != 'OPTIONS') {
      if (token) {
        jwt.verify(token, config.SECRET, function(err, decoded) {
          if (err) {
            return res.json({ errorCode: -1, message: err.message });
          } else {
            userModel.findOneUser({user_name: decoded.data.name}).then(result => {
              // 获得解码后的用户信息;
              req.loginUser = result.dataValues;
              // 供后面的路由使用
              next();
            }).catch(err => {
              return res.json({errorCode: -1, message: err.message});
            });
          }
        });
      } else {
        // 如果没有token，则返回错误
        return res.status(403).send({
          errorCode: -1,
          message: '没有提供token！'
        });
      }
    } else {
      next();
    }
};
