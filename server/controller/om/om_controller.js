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
var config = require('../../config');
var tool = require('../../utils/publicTool');
module.exports = function(){
    var instance;

    function UserController (options) {
        this.userName = options.userName || '';
        this.password = options.password || '';
        this.fullName = options.fullName || '';
    }

    /*
    * @todo 用户注册功能;
    * */
    UserController.prototype.register = function (req, res) {
        res.json({module: 'register'});
    };

    /**
     * 用户登陆功能;
     * @method login
     * @param req
     * @param res
     */
    UserController.prototype.login = function (req, res) {
        var userName = req.body.userName;
        userModel.findOneUser({userName: userName}).then(function (result) {
            if (!result) {
                res.json({ errorCode: -1, message: '登陆失败，该用户不存在!' });
            } else {
                // 判断登陆密码
                if (req.body.password != result.password) {
                    res.json({ errorCode: -1, message: '登陆失败，密码错误' });
                }
                result.dataValues.token = jwt.sign({
                    data: { name: result.userName, password: result.password }
                }, config.SECRET, { expiresIn: 60 * 60 });
                res.json({
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
     * @param req
     * @param res
     */
    UserController.prototype.find = function (req, res) {
        let flag;
        if(!Object.getOwnPropertyNames(req.query).length) {
            flag = 'findAll';
        } else if (req.query.pageSize && req.query.pageNum) {
            flag = 'pageFind';
        } else {
            res.json({ errorCode: -1, message: '查询参数有误' });
        }
        const pageSize = parseInt(req.query.pageSize);
        const startIndex = (parseInt(req.query.pageNum) - 1) * pageSize;
        const requestParam = flag === 'findAll' ? {} : {limit: pageSize, offset: startIndex};
        userModel.findAllUser(requestParam).then(function (result) {
            res.json({ errorCode: 0, data: result, message: '查找成功' });
        });
    };

    /*
     * @todo 用户更新功能;
     * */
    UserController.prototype.update = function (req, res) {
        res.json({module: 'update'});
    };

    /*
     * @todo 用户删除功能能;
     * */
    UserController.prototype.delete = function (req, res) {
        res.json({module: 'delete'});
    };


    return function(options){
        if(!instance){
            instance = new UserController(options);
        }
        return instance;
    }
}();