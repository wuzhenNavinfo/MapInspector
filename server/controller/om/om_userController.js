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
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const tool = require('../../utils/publicTool');

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
	return userModel.findOne(requestData)
  .then(result => {
    if(result) return this.res.json({errorCode: -1, message: '该用户/邮箱已存在'});
    return userModel.create(this.model)
      .then(userData => {
        if (userData) {
          // 创建用户时先默认分配用户为作业员;
          return userRoleModel.create({userId: userData.id, roleId: 2})
            .then(roleData => {
              userData.dataValues.role = roleData.roleId;
              return this.res.json({
                errorCode: 0,
                result: userData,
                message: '用户创建成功,并为用户分配为作业员角色'
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
  requestData.where = {userName: this.req.body.userName};
	return userModel.findOne(requestData)
  .then(userData => {
    if (!userData) {
      throw new Error('登陆失败，该用户不存在!');
    } else {
      // 判断登陆密码
      let password = crypto.createHash('sha1').update(this.req.body.password).digest('hex');
      if (password != userData.password) {
        return this.res.json({errorCode: '-1', message:'登陆失败，密码错误'});
      }
      // 查询角色;
      return userRoleModel.findOne({where: {userId: userData.id}})
      .then(roleData => {
        let userDataCopy = tool.clone(userData.dataValues);
        userDataCopy.role = ['worker', 'manager'][roleData.roleId - 1];
        // 获得token;
        userDataCopy.token = jwt.sign(
          {data: {name: userData.userName, password: userData.password}},
          config.SECRET, {expiresIn: 60 * 60 * 24});
        // 登陆的返回结果剔除密码;
        delete userDataCopy.password;
        return this.res.status(200).json({
          errorCode: 0,
          result: userDataCopy,
          message: '已获得认证，登陆成功!'
        });
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
  requestParam.attributes = {exclude: ['password']};
  requestParam.include = {
    model:userRole,
    through: {attributes: ['roleCode', 'roleName']}
  };
  if (this.req.query.pageSize && this.req.query.pageNum) {
    requestParam.limit = this.req.query.pageSize;
    requestParam.offset = (this.req.query.pageNum - 1) * this.req.query.pageSize;
  }
  return userModel.findAndCountAll(requestParam)
  .then(userDatas => {
    let userDatasCopy = tool.clone(userDatas);
    userDatasCopy.rows.forEach(item => {
      let userRole = item.dataValues['om_roles'][0].roleCode;
      delete item.dataValues['om_roles'];
      item.dataValues.role = parseInt(userRole) === 1 ? 'worker' : 'manager';
    });
    return this.res.json({
      errorCode: 0,
      result: { data: userDatasCopy.rows, total: userDatasCopy.count },
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

module.exports = UserController;
