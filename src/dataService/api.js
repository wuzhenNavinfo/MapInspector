/**
 * @description 前端页面定义的接口调用
 * @file api.js
 * @author    wuzhen
 * @date      2017/11/1
 *
 * @copyright @Navinfo, all rights reserved.
 */

import axios from 'axios';
import { appConfig, appUtil } from '../config';

var baseUrl = appConfig.serviceUrl; // 服务的地址

// 统一增加token
var postReq = function (url, param) {
    if (!param) {
      param = {};
    }
    if (url != '/api/om/user/login') {
      let token = appUtil.getCurrentUser().token;
      param.token = token;
    }
    return axios.post(`${baseUrl + url}`, param)
}
// 统一增加token
var getReq = function (url, param) {
  if (!param) {
    param = {};
  }
  if (url != '/api/om/user/login') {
    let token = appUtil.getCurrentUser().token;
    param.token = token;
  }
  return axios.get(`${baseUrl + url}`, {params: param}).then(res => res.data).catch(res => ({errcode: null}));
}

export const login = param => { return postReq('/api/om/user/login', param).then(res => res.data).catch(res => ({errcode: null})); }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点

export const findUser = param => { return axios.get(`${baseUrl}/api/om/user/find`, {params: param}).then(res => res.data).catch(res => ({errcode: null})); }; // 注意get和post的传递参数方式的不同

export const queryCaseList = param => { return getReq('/api/bs/case/list', param)};

export const queryCaseById = param => { return getReq('/api/bs/case/query', param)};

export const saveCase = param => { return postReq('/api/om/user/login', param).then(res => res.data).catch(res => ({errcode: null})); };
