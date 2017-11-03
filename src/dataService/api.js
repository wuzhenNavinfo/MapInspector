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
    let token = appUtil.getCurrentUser().token;
    if (!param) {
      param = {};
    }
    if (url != '/api/om/user/login') {
      param.token = token;
    }
    return axios.post(`${baseUrl + url}`, param)
}

export const login = param => { return postReq('/api/om/user/login', param).then(res => res.data).catch(res => ({errcode: null})); }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点

export const findUser = param => { return axios.get(`${baseUrl}/api/om/user/find`, {params: param}).then(res => res.data).catch(res => ({errcode: null})); }; // 注意get和post的传递参数方式的不同
