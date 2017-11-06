/**
 * @description
 * @file
 * @author    lingLong
 * @date      2017/10/31
 *
 * @copyright @Navinfo, all rights reserved.
 */

// 引入userModel模块;
const userModel = require('../../models/om_model');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const crypto = require('crypto');
const tool = require('../../utils/publicTool');

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
 */
UserController.prototype.register = function () {
  tool.extend(this.model, this.req.body);
  if (!this.model.userName || !this.model.password) {
    this.res({errorCode: -1, message: '参数不完整!'});
    return;
  }
  // 对密码进行加密处理;
  this.model.password = crypto.createHash('sha1').update(this.model.password).digest('hex');
  // 判断用户是否存在；
  userModel.findOneUser({userName: this.model.userName}).then(result => {
    if (result) {
      this.res.json({errorCode: -1, message: '该用户已存在!'});
      return;
    }
  });
  // 插入用户;
  userModel.addUser(this.model).then(result => {
    this.res.json(result);
  });
};

/**
 * 用户登陆功能;
 * @method login
 */
UserController.prototype.login = function () {
  tool.extend(this.model, this.req.body);
  if (!this.model.userName || !this.model.password) {
    this.res.json({errorCode: -1, message: '参数不完整!'});
    return;
  }
  userModel.findOneUser({userName: this.model.userName}).then(result => {
    if (!result) {
      this.res.json({errorCode: -1, message: '登陆失败，该用户不存在!'});
      return;
    } else {
      // 判断登陆密码
      var password = crypto.createHash('sha1').update(this.model.password).digest('hex');
      if (password != result.password) {
        this.res.json({errorCode: -1, message: '登陆失败，密码错误'});
        return;
      }

      result.dataValues.token = jwt.sign({
        data: {name: result.userName, password: result.password}
      }, config.SECRET, {expiresIn: 60 * 60 * 24});

      this.res.json({
        errorCode: 0,
        message: '已获得认证，登陆成功!',
        result: result
      });
    }
  });
};

/**
 * 查询用户接口
 * 如果不传参数则查找所有用户
 * 如果传入pageSize和pageNum则进行分页查询
 * @method find
 */
UserController.prototype.find = function () {
  let flag;
  if (!this.req.query.pageSize && !this.req.query.pageNum) {
    flag = 'findAll';
  } else if (this.req.query.pageSize && this.req.query.pageNum) {
    flag = 'pageFind';
  } else {
    this.res.json({errorCode: -1, message: '查询参数有误'});
    return;
  }
  const pageSize = parseInt(this.req.query.pageSize);
  const startIndex = (parseInt(this.req.query.pageNum) - 1) * pageSize;
  const requestParam = flag === 'findAll' ? {} : {limit: pageSize, offset: startIndex};
  userModel.findAllUser(requestParam).then(function (result) {
    this.res.json({errorCode: 0, data: result, message: '查找成功'});
    return;
  });
};

/*
 * @todo 用户更新功能;
 * */
UserController.prototype.update = function () {
  this.res.json({module: 'update'});
};

/*
 * @todo 用户删除功能能;
 * */
UserController.prototype.delete = function () {
  this.res.json({module: 'delete'});
};

module.exports = UserController;
