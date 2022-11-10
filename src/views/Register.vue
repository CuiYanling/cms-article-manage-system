<template>
    <div class="bg">
        <!-- el-card是一个element plus 中封装过的组件，可以直接使用 -->
        <el-card class="form-card">
            <template #header>
                <div class="card-header">
                    <span>注册</span>
                </div>
            </template>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" show-password type="password" />
                </el-form-item>
                <el-form-item label="确认密码" prop="checkpass">
                    <el-input v-model="form.checkpass" show-password type="password" />
                </el-form-item>
                <el-form-item label="姓名" prop="fullname">
                    <el-input v-model="form.fullname" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="form.sex" class="ml-4">
                        <el-radio label="男" size="large">男</el-radio>
                        <el-radio label="女" size="large">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机" prop="tel">
                    <el-input v-model="form.tel" />
                </el-form-item>
                <el-form-item prop="checked1">
                    <el-checkbox v-model="form.isAgree" size="large" />
                    <span style="margin-left:-15px">同意本站用户协议（有链接）</span>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleSure(formRef)" :disabled="!form.isAgree" type="primary">注册</el-button>
                </el-form-item>
            </el-form>
            <el-row justify="space-between">
                <el-col :span="5">
                    <el-link href="/#/login" type="info">登录账户</el-link>
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
//注意axios函数引入位置（发送axios）（最好放上面）
import Admin from '@/api/admin';
//获取vue实例对象(跳转页面)
import { useRouter } from 'vue-router';

let form = reactive({
    username: '',
    password: '',
    checkpass: '',
    fullname: '',
    //性别：
    sex: '男',
    tel: '',
    //复选框：
    isAgree: false,
})
//获取form组件实例---校验登录
const formRef = ref();

//第一次密码框校验：
const validatePass = (rule, value, callback) => {
    //非空校验
    if (value === '') {
        callback(new Error('请输入密码！'));
        return;
    };
    //有效性校验
    let isVaild = /\d{3,}/.test(value);
    if (!isVaild) {
        callback(new Error('密码至少三位数字！'));
    };
    //校验---确认密码框（当第一次为空，第二次不为空时）
    if (form.checkPass !== '') {
        //方法一 ES6语法： ?. 判断formRef.valu 是否存在，存在——执行下一条语句，不存在——return
        // formRef.value?.validateField('checkPass', () => null)
        //方法二：
        if (!formRef.value) return
        //验证checkPass
        formRef.value.validateField('checkPass', () => null)
    }
    //全部通过校验
    callback();
}
//第二次密码框校验：
const validatePass2 = (rule, value, callback) => {
    //非空校验
    if (value === '') {
        callback(new Error('请再次输入密码！'));
        return;
    };
    //有效性校验
    if (value !== form.password) {
        callback(new Error('两次密码不同！'));
        return;
    };
    //全部通过校验
    callback();
}
// 验证用户名是否已经被注册
const validatePass3 = async (rule, value, callback) => {
    // console.log(rule, value, callback);
    if (value === '') {
        callback(new Error('请输入用户名!!!'));
        return;
    }
    let { msg, status } = await Admin.checkusername({ username: form.username });
    console.log(msg, status);
    if (!status) {
        callback(new Error('用户已被注册!'));
        return;
    }
    // 全部通过校验
    callback();
}

//校验表单：
const rules = reactive({
    username: [
        // { required: true, message: '请输入账号!', trigger: 'blur' },
        { validator: validatePass3, trigger: 'blur' },
        { min: 3, max: 20, required: true, message: '账户长度要求在3-20之间', trigger: 'blur' }
    ],
    password: [
        { validator: validatePass, required: true, trigger: 'blur' },
    ],
    checkpass: [
        { validator: validatePass2, required: true, trigger: 'blur' }]
    ,
    fullname: [
        { required: true, message: '请输入姓名!', trigger: 'blur' },
        { min: 1, max: 10, message: '姓名长度要求在1-10之间', trigger: 'blur' }
    ],
    sex: [
        { required: true, message: '请选择性别!', trigger: 'change' },
    ],
    tel: [
        { required: true, message: '请输入手机号码!', trigger: 'blur' },
        { pattern: /^1(34[0-8]|705|(3[5-9]|5[0127-9]|8[23478]|78)\d)\d{7}$/, message: '手机号码不符合规则！', trigger: 'blur' }
    ],
    // isAgree: [
    //     { required: true, message: '请同意用户协议!', trigger: 'change' },
    // ]
});

//获取router实例对象
let router = useRouter();

//注册按钮——校验
function handleSure(formEl) {
    formEl.validate(async (valid, fields) => {
        console.log(valid);
        //校验成功
        if (valid) {
            let { status, msg, data } = await Admin.register({ username: form.username, password: form.password, fullname: form.fullname, sex: form.sex, tel: form.tel })
            // console.log(status, msg, data);
            if (status) {
                // 缓存数据
                sessionStorage.id = data.id
                sessionStorage.role = data.role
                sessionStorage.token = data.token
                //注册成功
                ElMessage.success(msg);
                // 跳转页面
                router.push('/admin/list');
            } else {
                ElMessage.error(msg);
            }
        } else {
            //未通过校验
            console.log('校验失败(字段)', fields);
            ElMessage.error("注册失败！！！");
        }
    })
}

</script>

<style lang="less" scoped>
.bg {
    position: relative;
    min-height: 100vh;
    background: url(../assets/img/register/bg.jpg) top center;
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