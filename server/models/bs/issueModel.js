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
module.exports = db.define('bb_issue', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    createUser: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'om_user',
        key: 'user_id'
      }
    },
    proCode: {
      type: Sequelize.INTEGER,
      field: 'pro_code',
      allowNull: false,
      unique: 'compositeIndex',
      references: {
        model: 'bb_project',
        key: 'id'
      }
    },
    caseCode: {
      type: Sequelize.INTEGER,
      field: 'case_code',
      allowNull: false,
      unique: 'compositeIndex',
      references: {
        model: 'bb_case',
        key: 'id'
      }
    },
    images: {
      type: Sequelize.STRING
    },
    videos: {
      type: Sequelize.STRING
    },
    issueStatus: {
      type: Sequelize.INTEGER,
      field: 'issue_status'
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
