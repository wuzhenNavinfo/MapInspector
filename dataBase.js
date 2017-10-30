/**
 * @description
 * @file
 * @author    xujie
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */
var mysql = require('mysql');
var config = require('./config');
var db = {};

db.query = function (sql, callback) {
    // 配置数据库并创建一个数据库链接池;
    var connectionPool = mysql.createConnection({
        host     : config.DB_HOST,
        user     : config.DB_USER,
        password : config.DB_PWD,
        database : config.DB_NAME
    });

    // 数据库链接;
    connectionPool.connect(function (err) {
        if (err) {
            console.error('数据库链接失败!' + err.stark);
            return ;
        }
        console.log('数据库链接的id为 ' + connectionPool.threadId);
    });

    // sql语句的执行；
    connectionPool.query(sql, function (err, results, fields) {
        if (err) throw err;
        // sql执行成功后的回掉函数执行;
        callback(results);
    });

    // 关闭本次数据库链接;
    connectionPool.end(function (err) {
        if (err) throw err;
        console.log('关闭数据库链接');
    })
};

// 将数据库操作暴露出去;
module.exports = db;