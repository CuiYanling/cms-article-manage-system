<template>
    <div class="bg">
        <!-- el-card是一个element plus 中封装过的组件，可以直接使用 -->
        <el-card class="form-card">
            <template #header>
                <div class="card-header">
                    <span>编辑管理员</span>
                </div>
            </template>
            <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="姓名" prop="fullname">
                    <el-input v-model="form.fullname" />
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="form.role" class="m-2" placeholder="请选择角色" size="large">
                        <el-option v-for="item in personlist" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
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
                    <el-button type="primary" @click="handleKeep(formRef)">保存修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<script setup>
//导入组件内离开守卫
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { reactive, ref, watch, watchEffect, inject } from 'vue';
//注意axios函数引入位置（发送axios）（最好放上面）
import Admin from '@/api/admin';
//获取vue实例对象(跳转页面)
import { useRouter } from 'vue-router';
//路径对象
import { useRoute } from 'vue-router';
//form对象 整个表单
let form = ref({});

//依赖注入（环境变量）
let host = inject('host');
// console.log(inject('host'));

//生成角色列表  选择：
let personlist = ref([]);
//加载role角色列表的函数：
async function loadList() {
    let { status, msg, data, total } = await Admin.plist();
    if (status) {
        //获取到数据，渲染数据
        personlist.value = data;
        return data;
        // console.log(data);
    } else {
        //获取失败
        ElMessage.error(msg);
    }
}

//跳转编辑列表页面
//获取对象
let route = useRoute();

let usernames = "";
//加载管理员个人信息
let loadInfo = async (id) => {
    let { status, data } = await Admin.info({ id });
    usernames = data.username;
    if (status) {
        return data;
    }
}

//保证ajax的顺序执行（：
// let init = async () => {
//     let { data: role_list } = await Admin.plist();
//     personlist.value = role_list;
//     let { data: info } = await Admin.info({ id });
//     form.value = info;
// }
// init();

//简化async--->watch---立即执行--->watchEffect(自动监听)--->
// watchEffect(async () => {
//     //解构
//     let { id } = route.params;
//     try {
//         personlist.value = await loadList();
//         form.value = await loadInfo( id );
//     } catch (error) {
//         console.log(error);
//     }
// });
//初始化自动执行，自动分析依赖，监听依赖变化，请求结果
watchEffect(async () => {
    try {
        personlist.value = await loadList();
        form.value = await loadInfo(route.params.id);
    } catch (error) {
        console.log(error);
    }
});



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
// 验证用户名是否已经被占用
const validatePass = async (rule, value, callback) => {
    // console.log(value);
    if (value === '') {
        callback(new Error('请输入用户名!!!'));
        return;
    }
    let { status } = await Admin.checkusername({ username: form.value.username });
    if (usernames === form.value.username) {
        callback();
    }
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
        { validator: validatePass, trigger: 'blur' },
        { min: 3, max: 20, required: true, message: '账户长度要求在3-20之间', trigger: 'blur' }
    ],
    fullname: [
        { required: true, message: '请输入姓名!', trigger: 'blur' },
        { min: 1, max: 10, message: '姓名长度要求在1-10之间', trigger: 'blur' }
    ],
    role: [
        { required: true }
    ],
    sex: [
        { required: true, message: '请选择性别!', trigger: 'change' },
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
let router = useRouter();
//保存按钮——校验
function handleKeep(formEl) {
    formEl.validate(async (valid, fields) => {
        // console.log(valid);
        let formcopy = JSON.parse(JSON.stringify({ ...form.value }));
        delete formcopy.role_name;
        console.log(formcopy);
        //校验成功
        if (valid) {
            console.log(formcopy);
            const { status, msg } = await Admin.keep(formcopy);
            console.log(status, msg);
            if (status) {
                //修改成功
                ElMessage.success(msg);
                // 跳转页面
                router.push('/admin/list');
            } else {
                ElMessage.error(msg);
            }
        } else {
            //未通过校验
            console.log('校验失败(字段)', fields);
            //注册失败
            ElMessage.error("校验未通过，保存修改失败！");
        }
    })
}

// 离开守卫 因为头像没有设置删除操作，所以没有成功
// onBeforeRouteLeave((to, from, next) => {
//     formRef.validateField('avatar', (valid) => {
//         //未通过校验，提示
//         if (!valid) {
//             ElMessageBox.error('确定要离开此页面嘛？您有未保存的修改', { type: 'warning' })
//                 .then(() => {
//                     next(true);
//                 })
//                 .catch(() => {
//                     next(false);
//                 })
//         }
//         //通过校验，放行
//         next(true);
//     });
// });

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