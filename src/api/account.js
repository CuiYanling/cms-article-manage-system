import axios from "axios";

//获取用户列表
let userlist = (params) => axios.get('/user/list', { params });

//编辑按钮，获取用户个人资料  /id  /admin/info
let info = (params) => axios.get('/admin/info', { params });

//修改账户资料
let account = (data) => axios.post('/admin/account', data)

export default {
    userlist,
    info,
    account,

}