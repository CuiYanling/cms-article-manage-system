import axios from 'axios';
//token过期，强制跳转页面，从router下index中导入（因为useRouter在这里不可以使用）
import router from '@/router/';
//配置BaseURL
axios.defaults.baseURL = import.meta.env.VITE_SERVER;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // API接口要求在发送之前携带token
    //所以在请求拦截器中加入token
    var token = sessionStorage.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, function (error) {
    // 请求错误做点什么
    // return Promise.reject(error);
});





// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么:抽取data中的数据，返回给下一步 
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么//做测试：不要删除token，因为添加了路由守卫，删除token后会直接跳转登录页面（无法测试）
    console.log(error);
    let { config: { url }, response: { status } } = error;
    switch (status) {
        case 401:
            //消息弹窗通知
            ElNotification.error({
                title: `错误提示：${status}`,
                message: '登录token身份 无效/已过期，请重新登录！'
            })
            //获取当前页面路径
            let { fullPath } = router.currentRoute.value;
            // console.log(fullPath);
            //强制跳转登录(多种跳转方式，具体请看官方文档)
            // router.replace({ path: '/login' }); //方法一
            //在登录页面登录后，跳转到指定页面
            router.replace({ name: 'Login', query: { redirect: fullPath } });
            break;

        case 403:
            //没有权限访问资源，token
            //消息弹窗通知
            ElNotification.error({
                title: `错误提示：${status}`,
                message: '登录token身份 无效/已过期，请重新登录！'
            })
            break;

        case 404:
            //axios传错接口地址,在error下config中解构出来url接口地址
            ElNotification.error({
                title: `错误提示：${status}`,
                message: `API接口地址：${url}不存在！`
            })
            break;

        case 500:
            ElNotification.error({
                title: `错误提示：${status}`,
                message: 'API接口地址：${url}错误，请检查Network！(前端传参错误 或者 后台出错）'
            })
            break;

        default:
            ElNotification.error({
                title: `错误提示：${status}`,
                message: 'API接口地址：${url}错误!,请自行百度错误！',
            })
            break;

    }
    // return Promise.reject(error);
});