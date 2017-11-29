/**
 * @description
 * @file
 * @author    lingLong
 * @date      2017/10/31
 *
 * @copyright @Navinfo, all rights reserved.
 */

/**
 * 引入相关模块
 */
var logger = require('../../log').logger;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const tool = require('../../utils/publicTool');
const nodemailer  = require('nodemailer');
const sequelize = require("../../dataBase");
const userModel = sequelize.import('../../models/om/userModel');
const userRole = sequelize.import('../../models/om/roleModel');
const userRoleModel = sequelize.import('../../models/om/user_roleModel');

/**
 * 用户管理控制器;
 * @param req
 * @param res
 * @constructor
 */
function UserController(req, res) {
	this.model = {};
	this.model.userName = '';
	this.model.password = '';
	this.model.fullName = '';
	this.model.email = '';
	this.model.cellPhone = '';
	this.model.status = 0;
  this.model.company = '';
	this.req = req;
	this.res = res;
}

/**
 * 用户注册功能;
 * @method register
 * @returns {Promise.<TResult>}
 */
UserController.prototype.register = function () {
	tool.extend(this.model, this.req.body);
	// 对密码进行加密处理;
	this.model.password = crypto.createHash('sha1').update(this.model.password).digest('hex');
	// 判断用户是否存在；
  let requestData = {where: {
    $or: [{userName: this.model.userName}, {email: this.model.email}]
  }};
  requestData.attributes = {exclude: ['passport']};
	return userModel.findOne(requestData)
  .then(result => {
    if(result) return this.res.json({errorCode: -1, message: '该用户/邮箱已存在'});
    return userModel.create(this.model)
      .then(userData => {
        if (userData) {
          // 创建用户时先默认分配用户为作业员;
          return userRoleModel.create({userId: userData.id, roleId: 1})
            .then(roleData => {
              userData.dataValues.role = roleData.roleId;
              return this.res.json({
                errorCode: 0,
                result: userData,
                message: '用户创建成功,并为用户分配为游客角色'
              });
            });
        } else {
          throw new Error('创建用户失败');
        }
      });
  }).catch(err => {
    throw err;
  });
};

/**
 * 用户登陆功能;
 * @method login
 * @returns {Promise.<TResult>}
 */
UserController.prototype.login = function () {
  let requestData = {};
  requestData.where = {userName: this.req.body.userName, status: 1, expiredAt: { $gt: Date() }};
  requestData.include =  {model: userRole};
	return userModel.findOne(requestData)
  .then(userData => {
    if (!userData) {
      logger.error('登陆失败，该用户不存在或没有被激活!');
      return this.res.json({errorCode: '-1', message:'登陆失败，该用户不存在或没有被激活或已过期'});
    } else {
      // 判断登陆密码
      let password = crypto.createHash('sha1').update(this.req.body.password).digest('hex');
      if (password != userData.password) {
        return this.res.json({errorCode: '-1', message:'登陆失败，密码错误'});
      }

      let userDataCopy = tool.clone(userData.dataValues);
      userDataCopy.role = ['visitor', 'worker', 'manager', 'superManager'][userDataCopy['om_roles'][0].id - 1];
      // 获得token;
      userDataCopy.token = jwt.sign(
        {data: {name: userData.userName, password: userData.password}},
        config.SECRET, {expiresIn: 60 * 60 * 24});

      // 登陆的返回结果剔除密码;
      delete userDataCopy.password;
      delete userDataCopy.passport;
      delete userDataCopy.om_roles;

      return this.res.status(200).json({
        errorCode: 0,
        result: userDataCopy,
        message: '已获得认证，登陆成功!'
      });
    }
  })
  .catch(err => {
    throw err;
  });
};

/**
 * 查询用户接口，如果不传参数则查找所有用户
 * 如果传入pageSize和pageNum则进行分页查询
 * @method find
 * @returns {Promise.<TResult>}
 */
UserController.prototype.find = function () {
  let requestParam = {};
  requestParam.attributes = {exclude: ['password', 'passport']};
  requestParam.include = {model:userRole};
  if (this.req.query.status) {
    requestParam.where = {status: {$in: JSON.parse(this.req.query.status)}};
  }
  if (this.req.query.pageSize && this.req.query.pageNum) {
    requestParam.limit = this.req.query.pageSize;
    requestParam.offset = (this.req.query.pageNum - 1) * this.req.query.pageSize;
  }
  return userModel.findAndCountAll(requestParam)
  .then(userDatas => {
    let userDatasCopy = tool.clone(userDatas);
    userDatasCopy.rows = userDatasCopy.rows.filter(item => {
      return item.dataValues['om_roles'][0]['om_user_role'].roleId != 4;
    });
    userDatasCopy.rows.forEach(item => {
      let userRole = item.dataValues['om_roles'][0]['om_user_role'].roleId;
      delete item.dataValues['om_roles'];
      item.dataValues.role = ['visitor', 'worker', 'manager', 'superManager'][parseInt(userRole) - 1];
    });
    return this.res.json({
      errorCode: 0,
      result: { data: userDatasCopy.rows, total: userDatasCopy.count - 1 },
      message: '查找成功'
    });
  })
  .catch(err => {
    throw err;
  });
};

/**
 * 删除用户;
 * @method delete
 * @returns {Promise.<TResult>}
 */
UserController.prototype.delete = function () {
  let requestData = {where: {id: this.req.query.id}};
	return userModel.destroy(requestData)
    .then(affectedCount => {
      if(affectedCount) {
        return this.res.json({
          errorCode: 0,
          message: '删除成功'
        });
      } else {
        throw new Error('id为'+this.req.query.id+'的用户不存在');
      }
	  })
    .catch(err => {
      throw err;
    });
};

/**
 * 用户审核功能;
 * @method auditUser
 * @returns {Promise.<TResult>}
 */
UserController.prototype.auditUser = function () {
  return userModel.findOne({ where: {id:this.req.body.userId} })
  .then(userData => {
      if (userData) {
        let where = { where: {id:this.req.body.userId} };
        let updateData = { status: this.req.body.status };
        if (this.req.body.status == 99) {
          updateData = {expiredAt: userData.createdAt};
        }
        return userModel.update(updateData, where)
        .then(affectedCount => {
          if (affectedCount[0]) {
            let updateInfo = ['未审核','已审核','不通过','停用','强制过期'][this.req.body.status];
            if (this.req.body.roleId) {
              let roleInfo = ['游客','作业员','管理员','超级管理员'][this.req.body.roleId];
              return userRoleModel.update({roleId: this.req.body.roleId}, {where: {userId: this.req.body.userId}})
              .then(affectedCount => {
                if (affectedCount[0]) {
                  return this.res.json({errorCode: 0, message: '用户状态更新为' + updateInfo + '，并分配角色为' + roleInfo});
                } else {
                  return this.res.json({errorCode: -1, message: '数据没有发生变化'});
                }
              })
            } else {
              return this.res.json({errorCode: 0, message: '用户状态更新为' + updateInfo});
            }
          } else {
            return this.res.json({errorCode: -1, message: '数据没有发生变化'});
          }
        });
      } else {
        return this.res.json({errorCode: -1, message:'更新失败!id为'+this.req.body.userId+'的用户不存在'});
      }
  })
  .catch(err => {
    throw err;
  });
};

/**
 * 获得验证码
 * @method getPassport
 * @returns {Promise.<T>}
 */
UserController.prototype.getPassport = function () {
  let mailTransport = nodemailer.createTransport({
    host : 'smtp.qq.com',
    secureConnection: true,
    auth : {
      user : '793588344@qq.com',
      pass : 'pljkbnjjslgsbfgd'
    }
  });
  return userModel.findOne({where: {userName: this.req.query.userName}})
  .then(result => {
    if (result) {
      let pool = [1,2,3,4,5,6,7,8,9,0,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      let passport = [];
      for (var i=0;i<4;i++) {
        let index = Math.ceil(Math.random()* pool.length);
        passport.push(pool[index]);
      }
      return userModel.update({passport: passport.join('')},{where: {userName: this.req.query.userName}})
      .then(affectedCount => {
        if (affectedCount[0]) {
          let options = {
            from: '793588344@qq.com',
            to: result.email,
            subject: '来自MapInspector邮件',
            text: '密码重置',
            html: '<p>这是一封来自审图平台的邮件，您本次修改密码操作的验证码为 <strong style="color: #00A0F0">'+passport.join('')+'</strong>,若非本人操作请不要理会<p/>'
          };
          mailTransport.sendMail(options, (err, msg) => {
            if(err){
              return this.res.json({errorCode: -1, message: '邮件发送失败'});
            } else {
              return this.res.json({errorCode: 0, message: '邮件发送成功'});
            }
          });
        } else {
          return this.res.json({errorCode: -1, message: '数据没有改变'});
        }
      });
    }else {
      return this.res.json({errorCode: -1, message: '该用户不存在，无法获取验证码'});
    }
  })
  .catch(err => {
    throw err;
  });
};

/**
 * 重置密码功能;
 * @method resetPwd
 * @returns {Promise.<T>}
 */
UserController.prototype.resetPassword = function () {
  let password = crypto.createHash('sha1').update(this.req.body.password).digest('hex');
  return userModel.findOne({where: {userName: this.req.body.userName}})
  .then(result => {
    // 判断登陆密码
    if (password == result.password) {
      return this.res.json({errorCode: -1, message: '您的密码没有改变'});
    }
    if (this.req.body.passport != result.passport) {
      return this.res.json({errorCode: -1, message: '验证码错误'});
    }
    let now = new Date();
    let updateData = {
      password: password,
      passport: null,
      expiredAt: now.setMonth(now.getMonth() + 3)
    };
    return userModel.update(updateData, {where: {userName: this.req.body.userName}})
    .then(affectedCount => {
      return this.res.json({errorCode: 0, message: '重置密码成功'});
    });
  })
  .catch(err => {
    throw err;
  });
};

module.exports = UserController;
