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
module.exports = db.define('om_role', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        roleCode: {
            type: Sequelize.STRING,
            field: 'role_code',
            unique: true,
            allowNull: false
        },
        roleName: {
            type: Sequelize.STRING,
            unique: true,
            field: 'role_name',
            allowNull: false
        },
        roleDesc: {
            type: Sequelize.STRING,
            field: 'role_desc'
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
