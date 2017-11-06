/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */
const Sequelize = require('sequelize');
const db = require('../dataBase');

// 创建 model
var User = db.define('om_user', {
        userId: {
            type: Sequelize.INTEGER,
            field: 'user_id',
            autoIncrement: true,
            allowNull: false
        },
        userName: {
            type: Sequelize.STRING,
            field: 'user_name',
            unique: true,
            primaryKey: true,
            allowNull: false
        },
        fullName: {
            type: Sequelize.STRING,
            field: 'full_name'
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING
        },
        cellPhone: {
            type: Sequelize.STRING,
            field: 'cell_phone'
        },
        status: {
            type: Sequelize.INTEGER
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        freezeTableName: true
    }
);

// 如果 force = true 则会把存在的表（如果 users 表已存在）先销毁再创建表
// var user = User.sync({ force: false });

// 添加新用户
exports.addUser = function(userObj) {
    return User.create(userObj);
};

// 查找用户（支持查询所有和分页查询）
exports.findAllUser = function(params) {
    return User.findAll(params);
};

// 通过用户名查找用户;
exports.findOneUser = function (params) {
    return User.findOne({
        where: params
    })
};
