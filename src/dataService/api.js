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
    return axios.post(`${baseUrl + url}`, param).then(res => res.data).catch(res => ({errcode: null}));
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

// -- 用户相关  --
export const login = param => { return postReq('/api/om/user/login', param) }; // 登录接口, 注意箭头函数返回对象是要加小括号的知识点
export const findUser = param => { return axios.get(`${baseUrl}/api/om/user/find`, {params: param}).then(res => res.data).catch(res => ({errcode: null})); }; // 注意get和post的传递参数方式的不同
export const findUserList = param => { return getReq('/api/om/user/find', param)};

// -- 案例相关  --
export const queryCaseList = param => { return getReq('/api/bs/case/list', param)};
export const queryCaseById = param => { return getReq('/api/bs/case/query', param)};
export const saveCaseInfo = param => {
  if (!param.id) {
    return postReq('/api/bs/case/create', param);
  } else {
    return postReq('/api/bs/case/update', param);
  }
};
export const deleteCaseById = param => { return getReq('/api/bs/case/delete', param)};

// -- 项目相关  --
export const queryIssueList = param => { return getReq('/api/bs/project/list', param)};
export const saveIssue = param => { return saveIssue('/api/bs/project/save', param)};
export const createProject = param => { return postReq('/api/bs/project/create', param)};
export const deleteProject = param => { return getReq('/api/bs/project/delete', param)};
export const queryCaseListDetail = param => { return getReq('/api/bs/case/listDetail', param)};
export const queryIssue = param => { return getReq('/api/bs/issue/find', param)};
export const createIssue = param => { return postReq('/api/bs/issue/create', param)};
export const submitProjectApi = param => { return postReq('/api/bs/project/submit', param)};



