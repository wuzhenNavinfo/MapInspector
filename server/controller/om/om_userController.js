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
const userModel = require('../../models/om/userModel');
const userRoleModel = require('../../models/om/user_roleModel');
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
		if(result) {
			this.res.json({errorCode: -1, message: '该用户已存在!'});
		} else {
			userModel.addUser(this.model).then(result => {
        if (result) {
          // 创建用户时默认为用户分配的角色是“游客”;
          userRoleModel.addURRelation(result.userId, 1).then(res => {
            result.dataValues.role = res.roleCode;
            this.res.json(result);
          });
        }
			});
		}
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
	var defaultsAttr = { exclude: ['password'] };
	const requestParam = flag === 'findAll' ? { attributes: defaultsAttr } : {limit: pageSize, offset: startIndex, attributes: defaultsAttr};
	userModel.findAllUser(requestParam).then(result => {
			return result
		}).then(result => {
			return userModel.getTotalRowNum('user_id', 'total').then(data => {
				this.res.json({errorCode: 0, result: { data: result, total: data[0].dataValues.total }, message: '查找成功'});
			});
		});
};

/*
 * @todo 用户更新功能;
 * */
UserController.prototype.update = function () {
	tool.extend(this.model, this.req.body);
	userModel.upDateOneUser(this.model, { where: { userName: this.model.userName } }).then(result => {
		this.res.json({errorCode: 0, result: { data: result }, message: '更新成功'});
		return;
	});
};

/**
 * 删除用户;
 * @method delete
 */
UserController.prototype.delete = function () {
	tool.extend(this.model, this.req.query);
	userModel.deleteOneUser({ userName: this.model.userName }).then(result => {
		if (result === 1) {
			this.res.json({errorCode: 0, result: { data: result }, message: '删除成功'});
		} else {
			this.res.json({errorCode: -1, result: { data: result }, message: '删除失败'});
		}
		return;
	});
};

module.exports = UserController;
