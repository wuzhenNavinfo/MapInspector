/**
 * @description 前端页面定义的接口调用
 * @file api.js
 * @author    wuzhen
 * @date      2017/11/1
 *
 * @copyright @Navinfo, all rights reserved.
 */

import axios from 'axios';
import appConfig from '../config'

var baseUrl = appConfig.serviceUrl; // 服务的地址

export const login = param => { return axios.get(`${baseUrl}/getList`, {params: param}).then(res => res.data).catch(res => ({errcode: null})); }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点
