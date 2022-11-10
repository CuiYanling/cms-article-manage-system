import axios from "axios";

//发布文章   /article/release
let release = (data) => axios.post('/article/release', data);


//-----------文章列表
let artlist = (params) => axios.get('/article/list', { params });
//删除文章
let remove = (data) => axios.post('/article/remove', data);
//获取指定id文章
let info = (params) => axios.get('/article/detail', { params });
//编辑指定文章
let edit = (data) => axios.post('/article/edit', data);
//给指定文章标记标签
let articletag = (data) => axios.post('/article/tag', data);

//--------------标签管理
//标签列表
let taglist = (params) => axios.get('/tag/list', { params });
//创建标签
let createtag = (data) => axios.post('/tag/', data);
//编辑标签
let edittag = (id, data) => axios.put(`/tag/${id}`, data);
//删除标签
let removetag = (id, params) => axios.delete(`/tag/${id}`, { params });


//---------------评论管理
let commentlist = (params) => axios.get('/comment/recent', { params });

export default {
    //-----------发布文章
    release,


    //-----------文章列表
    artlist,
    remove,
    info,
    edit,
    articletag,

    //--------------标签管理
    taglist,
    createtag,
    edittag,
    removetag,


    //---------------评论管理
    commentlist,

}