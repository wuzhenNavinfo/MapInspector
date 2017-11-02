/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */
var db = require('../dataBase');

//查询排名列表
exports.getList = function(req, res) {
    var pageSize = parseInt(req.query.pageSize);
    var start = (parseInt(req.query.pageNum) - 1) * pageSize;
    db.query('SELECT SQL_CALC_FOUND_ROWS `id`, `name`, `country`, `url`, `alexa` FROM websites LIMIT '+start+', '+pageSize+'', function (result) {
        db.query('SELECT COUNT(*) AS count FROM websites', function (countRes) {
            var pageResult = {};
            pageResult.data = result;
            pageResult.total = countRes[0].count;
            res.json(pageResult);
        });
    })
};

//增加排名列表
exports.addList = function(req, res) {
    var queryParam = req.query;
    var sql = "INSERT INTO websites (`name`,`country`,`url`,`alexa`)VALUES ( '" + queryParam.name+"', '"+queryParam.country+"', '"+queryParam.url+"', '"+parseInt(queryParam.alexa)+ "');";
    db.query(sql, function (result) {
        res.json(result)
    })
};

//删除排名列表
exports.deleteList = function(req, res) {
    var queryParam = req.query;
    var sql = 'DELETE FROM  websites WHERE id="'+queryParam.id+'"';
    db.query(sql, function (result) {
        res.json(result)
    })
};
