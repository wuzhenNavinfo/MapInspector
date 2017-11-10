/**
 * @description 路由模块自动加载器
 * @file
 * @author    lingLong
 * @date      2017/10/31
 *
 * @copyright @Navinfo, all rights reserved.
 */
var fs = require('fs');
var path = require('path');
var loadRoute = {
    path: path.join(__dirname, '../routes/'),
    app: null,
    listDir: function (dir) {
        dir = dir ? dir : this.path;
        var fileList = fs.readdirSync(dir, 'utf-8');
        for (var i = 0; i < fileList.length; i++) {
            var stat = fs.lstatSync(dir + fileList[i]);
            if (stat.isDirectory()) {
                this.listDir(dir + fileList[i] + '/');
            } else {
                this.loadRoute(dir + fileList[i]);
            }

        }
    },

    loadRoute: function (routeFile) {
        var route = require(routeFile.substring(0, routeFile.lastIndexOf('.')));
        // //完整的请求路径
        var routePath = '/' + routeFile.substring(this.path.length, routeFile.lastIndexOf('.'));
        if (routePath.length >= 5) {
            //除去index的有效路径
            if (routePath.substring(routePath.length - 5) == "index") {
                var validPath = routePath.substring(0, routePath.length - 5);
                this.app.use('/api' + validPath, route);
            } else {
                this.app.use('/api' + routePath, route);
            }
        } else {
            this.app.use('/api' + routePath, route);
        }
    },

    init: function (app, path) {
        if (!app) {
            console.error("系统主参数App未设置");
            return false;
        }
        this.app = app;
        this.path = path ? path : this.path;
        this.listDir();
    }
};
module.exports = loadRoute;
