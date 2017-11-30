/**
 * @description 定义一些公共的方法
 * @file constant.js
 * @author    wuzhen
 * @date      2017/11/30
 *
 * @copyright @Navinfo, all rights reserved.
 */

let _ = require('lodash');

export const Utils = {
  trim: function (str) {
    return _.trim(str);
  },
  clone: function (obj) {
    return _.clone(obj);
  },
  round: function (num, precision=0) {
    return _.round(num, precision);
  }
}
