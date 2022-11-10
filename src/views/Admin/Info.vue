<template>
    <div class="bg">
        <!-- el-card是一个element plus 中封装过的组件，可以直接使用 -->
        <el-card class="form-card">
            <template #header>
                <div class="card-header">
                    <span>账户资料</span>
                </div>
            </template>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" disabled />
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
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" />
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-upload class="avatar-uploader" :action="`${host}/upload/common/`" :headers="headers"
                        :data="extra" :show-file-list="false" accept=".png,.jpg,.jpeg" :on-success="handleUploadSuccess"
                        :on-error="handleUploadError" :before-upload="handlebeforeUpload">
                        <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleKeep(formRef)">修改资料</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<!-- 不需要发送Ajax 直接从仓库获取~~~ -->
<script setup>
import { reactive, ref, watch, watchEffect, inject } from 'vue';
import { useAccountStore } from '@/stores/account';
import { storeToRefs } from 'pinia';

//form对象 整个表单
let form = ref({});

//依赖注入（环境变量）
let host = inject('host');
// console.log(inject('host'));

//初始化
let account = useAccountStore();
//浅拷贝---还原表单——此处不需要storeToRefs———失去响应性(浅拷贝：保证不点修改不动数据)
form.value = { ...account.profile };
// let { profile } = storeToRefs(account);

//头像：
//提取token
let token = sessionStorage.token;
let headers = { Authorization: `Bearer ${token}` };
//附加参数：
let extra = { type: 'avatar' };
//上传之前的检查：
const handlebeforeUpload = (rawFile) => {
    //判断图片格式/^image\/(jpeg|png|jpg)$/
    let isValid = /^image\/(jpeg|png|jpg)$/.test(rawFile.type);
    if (!isValid) {
        ElMessage.error('头像必须是JPG/PNG/JPEG格式!');
        //return false 为了取消上传文件
        return false;
        //判断图片体积（大于2MB）
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像体积不允许超过2MB!');
        return false;
    }
    return true;
}
//上传成功
const handleUploadSuccess = ({ status, msg, src }, uploadFile) => {
    // console.log(status, msg, uploadFile);
    if (status) {
        //上传成功
        //生成图片地址
        form.value.avatar = src;
        ElMessage.success(msg);
    } else {
        //上传失败
        ElMessage.error(msg);
    }
}
//上传失败
const handleUploadError = (error, uploadFile) => {
    // console.log(error);
    //将json对象 转换 为对象并解析出来
    let { status, msg } = JSON.parse(error.message);
    //错误通知
    ElMessage.error(msg);
}

//获取form组件实例---校验登录
const formRef = ref();
// 验证用户名是否已经被占用：
//不需要了

//校验表单：
const rules = reactive({
    fullname: [
        { required: true, message: '请输入姓名!', trigger: 'blur' },
        { min: 1, max: 10, message: '姓名长度要求在1-10之间', trigger: 'blur' }
    ],
    sex: [
        { required: true, trigger: 'change' },
    ],
    tel: [
        { required: true, message: '请输入手机号码!', trigger: 'blur' },
        { pattern: /^1(34[0-8]|705|(3[5-9]|5[0127-9]|8[23478]|78)\d)\d{7}$/, message: '手机号码不符合规则！', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱号!', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱地址！', trigger: 'blur' }
    ],
    avatar: [
        { required: true }
    ]
});

//获取router实例对象

//保存按钮——校验
function handleKeep(formEl) {
    formEl.validate(async (valid, fields) => {
        //校验成功
        if (valid) {
            //调用action
            account.updateProfile(form.value);
            // console.log(form.value)
        }
    })
}

</script>


<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
    
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>