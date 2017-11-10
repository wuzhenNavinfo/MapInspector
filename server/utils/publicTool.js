/**
 * @description
 * @file
 * @author    linglong
 * @date      2017/11/2
 *
 * @copyright @Navinfo, all rights reserved.
 */

var _ = require('lodash');
module.exports = {
    isObject: Object.isObject || function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Object]');
    },
    isArray: Array.isArray || function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    },
    clone: function (obj) {
        return _.cloneDeep(obj);
    },
    extend: function (object, source) {
        return _.extend(object, source);
    },
    merge: function (object, source) {
        return _.merge(object, source);
    },
    isEmptyObject: function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    }
};
