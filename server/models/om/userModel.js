/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */
const Sequelize = require('sequelize');
const db = require('../../dataBase');

// 创建 model
module.exports = db.define('om_user', {
        userId: {
            type: Sequelize.INTEGER,
            field: 'user_id',
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userName: {
            type: Sequelize.STRING,
            field: 'user_name',
            unique: true,
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
