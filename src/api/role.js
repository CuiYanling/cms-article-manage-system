import axios from "axios";

//根据id获取侧边栏菜单
let menu = (params) => axios.get('/role/menu/', { params });

//添加角色
let add = (data) => axios.post('/role', data);

let RoleMenu = (params) => axios.get('/role/menu/', { params });

let MenuAdd = (data) => axios.post('/role/menu', data);

export default {
    menu,
    add,
    RoleMenu,
    MenuAdd,
}