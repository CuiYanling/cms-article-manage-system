<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>发布文章</span>
            </div>
        </template>
        <el-form ref="formRef" :rules="rules" :model="form">
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="form.description" :rows="3" type="textarea" placeholder="" />
            </el-form-item>
            <el-form-item label="分类" :model="form">
                <el-space>
                    <el-select v-model="form.cate_1st" class="m-2" placeholder="Select">
                        <el-option v-for="item in options_1st" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <el-select v-model="form.cate_2nd" class="m-2" placeholder="Select">
                        <el-option v-for="item in options_2nd" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-space>
            </el-form-item>
            <el-form-item label="主图" prop="main_photo">
                <el-upload class="avatar-uploader" :action="`${host}/upload/common/`" :headers="headers" :data="extra"
                    :show-file-list="false" accept=".png,.jpg,.jpeg" :on-success="handleUploadSuccess"
                    :on-error="handleUploadError" :before-upload="handlebeforeUpload">
                    <img v-if="form.main_photo" :src="form.main_photo" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <div style="border: 1px solid #ccc">
                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
                    <Editor style="height: 500px; overflow-y: hidden;" v-model="form.content"
                        :defaultConfig="editorConfig" @onCreated="handleCreated" />
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleRelease(formRef)">发布文章</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>


<script setup>
import Article from '@/api/article';
import Category from '@/api/category';
// 引入 css
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, watch, inject } from 'vue';
import { onBeforeUnmount, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
//获取vue实例对象(跳转页面)
import { useRouter, useRoute } from 'vue-router';
//获取router实例对象
let router = useRouter();

//依赖注入（环境变量）
let host = inject('host');
// console.log(inject('host'));

//表单
let form = ref({
    title: '',
    description: '',
    cate_1st: '',
    cate_2nd: '',
    main_photo: '',
    content: '',
});

//图像上传：
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
        form.value.main_photo = src;
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

//富文本编辑框:
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
const toolbarConfig = {};
const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
};
//上传图片
editorConfig.MENU_CONF['uploadImage'] = {
    fieldName: 'file',
    server: `${host}/upload/editor/`,
    // 自定义增加 http  header
    headers: {
        Authorization: `Bearer ${sessionStorage.token}`,
    },
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
});
// 记录 editor 实例，重要！
const handleCreated = (editor) => {
    editorRef.value = editor
};

//1、获取两级分类：先获取一级分类，然后watch监听，得到二级分类
//一级分类列表
let options_1st = ref([]);
//二级分类列表
let options_2nd = ref([]);
//请求子集分类
let loadSubcate = async (id) => {
    let { status, data } = await Category.subcate({ id });
    if (status) {
        return data;
    }
}
onMounted(async () => {
    options_1st.value = await loadSubcate(0);
});
//watch监听一级分类，得到二级分类 
watch(() => form.value.cate_1st, async (newValue, oldValue) => {
    // console.log(newValue);
    options_2nd.value = await loadSubcate(newValue);
    form.value.cate_2nd = options_2nd.value[0].id;
});


//表单验证：
//获取form组件实例---校验登录
const formRef = ref();
//校验表单：
const rules = reactive({
    content: [
        { required: true, message: '请输入内容！', trigger: 'blur' },
    ],
    title: [
        { required: true, message: '请输入标题!', trigger: 'blur' },
        { min: 1, max: 50, message: '标题长度要求在1-50之间！', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入描述!' },
        { min: 1, max: 500, message: '标题长度要求在1-500之间！', trigger: 'blur' }
    ],
    textarea: [
        { required: true }
    ],
    // classify: [
    //     { required: true }
    // ],
    main_photo: [
        { required: true }
    ]
});

//发布按钮：
let handleRelease = (formEl) => {
    formEl.validate(async (valid, fields) => {
        //校验成功
        if (valid) {
            const { status, msg } = await Article.release({ ...form.value });
            if (status) {
                //修改成功
                ElMessage.success(msg);
                // 跳转页面
                router.push('/article/list');
            } else {
                ElMessage.error(msg);
            }
        } else {
            //未通过校验
            console.log('校验失败(字段)', fields);
            //注册失败
            ElMessage.error("校验未通过，发布公告失败！");
        }
    })
}

</script>
