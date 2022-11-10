import axios from "axios";

//封装管理员相关的axios

//登录
//方法一:正常函数
// function login(data) {
//     return axios.post('/admin/login', data);
// }
//方法二：箭头函数
// login:(data)=>axios.post('/admin/login',data),
let login = (data) => axios.post('/admin/login', data);

//（提交）注册
let register = (data) => axios.post('/admin/register', data);

//（提交）检测用户名是否可用
let checkusername = (data) => axios.post('/admin/check/username', data);


//一一一一一一一一管理员列表：
//（请求） 管理员列表 数据(data是对象)
// let list = () => axios.get('/admin/list',{params:{pagesize:10}});
// let list = (data) => axios.get('/admin/list',{params:data});
// let list = (params) => axios.get('/admin/list',{params:params});
let list = (params) => axios.get('/admin/list', { params });

//删除管理员账户
let remove = (data) => axios.post('/admin/remove', data);

//编辑按钮，
//获取用户个人资料  /id  /admin/info
let info = (params) => axios.get('/admin/info', { params });
//编辑按钮后————保存修改
let keep = (data) => axios.post('/admin/info', data);


//二二二二二二二二二权限角色列表：
//获取权限角色列表
let plist = (params) => axios.get('/role/list', { params });
//编辑按钮——————保存编辑
let pedit = (id, data) => axios.put(`/role/${id}`, data);
//删除按钮 
let premove = (id, params) => axios.delete(`/role/${id}`, { params });
//设置按钮——————tree树



export default {
    login,
    register,
    checkusername,
    list,
    //一一一一一一一一管理员列表：
    remove,
    info,
    keep,

    plist,

    //二二二二二二二二二权限角色列表：
    pedit,
    premove,



}