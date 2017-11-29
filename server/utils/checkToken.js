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
const sequelize = require("../dataBase");
const userModel = sequelize.import('../models/om/userModel');
const roleModel = sequelize.import('../models/om/roleModel');
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
            return userModel.findOne({
              where: {userName: decoded.data.name, status: 1},
              include: {model: roleModel}
            }).then(result => {
              // 获得解码后的用户信息;
              if (result) {
                req.loginUser = result.dataValues;
                // 供后面的路由使用
                next();
              } else {
                throw new Error('该用户不存在,或没有被激活!');
              }
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
