import axios from 'axios';

var baseUrl = 'http://localhost:3000'; // 服务的地址

export const login = param => { return axios.get(`${baseUrl}/getList`, {params: param}).then(res => res.data); }; // 登录接口
