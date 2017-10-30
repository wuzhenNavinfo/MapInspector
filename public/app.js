/**
 * @description
 * @file
 * @author    xujie
 * @date      2017/10/25
 *
 * @copyright @Navinfo, all rights reserved.
 */
angular.module('app', []).controller('AppCtrl', ['$scope', '$http', function ($scope) {
    var init = function () {
        $scope.test = '网站排名列表';
        $scope.listModel = {
            name: '',
            country: '',
            url: '',
            alexa: ''
        };
        $scope.pageModel = {
            pageSize: 3,
            pageNum: 1,
            pageTotal: 0
        };
        $scope.getList();
    };

    $scope.getList = function (param) {
        if (param) {
            $scope.pageModel.pageNum = param;
        }
        // 查询列表;
        $.ajax({
            url:'/getList',
            data: {
                pageSize: $scope.pageModel.pageSize,
                pageNum: $scope.pageModel.pageNum
            },
            dataType:"json"
        }).done(function(data) {
            $scope.$apply(function () {
                $scope.list = data.data;
                $scope.pageModel.pageTotal = data.total;
                $scope.pageArray = [];
                for (var i=1;i<=Math.ceil($scope.pageModel.pageTotal/$scope.pageModel.pageSize);i++) {
                    $scope.pageArray.push(i);
                }
            });
        });
    };

    // 添加列表
    $scope.addList = function () {
        // 查询列表;
        $.ajax({
            url:'/addList',
            data: $scope.listModel,
            dataType:"json"
        }).done(function(data) {
            init();
        });
    };

    // 删除列表;
    $scope.deleteList = function (listId) {
        // 删除列表;
        $.ajax({
            url:'/deleteList',
            data: {id: parseInt(listId)},
            dataType:"json"
        }).done(function(data) {
            init();
        });
    };

    init();
}]);