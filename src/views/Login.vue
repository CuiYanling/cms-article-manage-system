<template>
    <div class="bg">
        <!-- el-card是一个element plus 中封装过的组件，可以直接使用 -->
        <el-card class="form-card">
            <template #header>
                <div class="card-header">
                    <span>登录</span>
                </div>
            </template>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="50px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" show-password />
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleSubmit(formRef)" type="primary">登录</el-button>
                </el-form-item>
            </el-form>
            <el-row justify="space-between">
                <el-col :span="5">
                    <el-link href="/#/register" type="info">注册账户</el-link>
                </el-col>
                <el-col :span="6">
                    <el-link type="info">忘记密码？</el-link>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
//注意axios函数引入位置（最好放上面）
import Admin from '@/api/admin';
//获取vue实例对象
import { useRouter, useRoute } from 'vue-router';

let form = reactive({
    username: '',
    password: '',
})
//获取form组件实例---校验登录
let formRef = ref();

//表单验证：
const rules = reactive({
    username: [
        { required: true, message: '请输入账号!', trigger: 'blur' },
        { min: 3, max: 20, message: '账户长度要求在3-20之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码!', trigger: 'blur' },
        { pattern: /\d{3,}/, message: '密码长度要求至少3位数字', trigger: 'blur' }
    ],
});

//获取router实例对象
let router = useRouter();
//获取当前路径对象
let route = useRoute();

//登录按钮——校验
function handleSubmit(formEl) {
    // console.log(formEl);
    //校验整个表单：
    formEl.validate(async (valid, fields) => {
        //valid 是一个 布尔值：
        // console.log(valid);
        if (valid) {
            //通过校验（发送ajax。。。）
            //确保发送一个对象(使用await需要在上层最近函数中加入async)
            let { msg, status, data } = await Admin.login({ ...form });

            // console.log(msg, status)
            if (status) {
                //缓存数据(放入sessionStorage)
                sessionStorage.id = data.id;
                sessionStorage.role = data.role;
                sessionStorage.token = data.token;
                //登录成功
                ElMessage.success(msg);
                //提取参数
                let { redirect } = route.query;
                if (redirect) {
                    router.replace(redirect);
                } else {
                    //（使用vue-router）跳转页面[push支持传递：地址、path、name跳转]
                    router.push('/article/list');
                }
            } else {
                //登录失败
                ElMessage.error(msg);
            }
        } else {
            //未通过校验
            console.log('校验失败(字段)', fields);
        }
    });
}
</script>

<style lang="less" scoped>
// scoped 保证CSS的作用域，页面之间不错乱（自动加上一个标志，保证每个页面样式的唯一性）
.bg {
    position: relative;
    min-height: 100vh;
    background: url(../assets/img/login/bg.jpg) top center;
    background-size: cover;

    .form-card {
        width: 360px;
        position: absolute;
        top: 50%;
        right: 30px;
        transform: translateY(-50%);
    }
}
</style>