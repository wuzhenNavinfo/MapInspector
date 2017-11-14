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
module.exports = db.define('bb_project', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        projectName: {
          type: Sequelize.STRING,
          field: 'pro_name',
          allowNull: false
        },
        projectDesc: {
          type: Sequelize.STRING,
          field: 'pro_desc',
          allowNull: false
        },
        createUser: {
          type: Sequelize.INTEGER,
          field: 'create_person',
          references: {
            model: 'om_user',
            key: 'user_id'
          }
        },
        projectStatus: {
          type: Sequelize.INTEGER,
          field: 'pro_status'
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
