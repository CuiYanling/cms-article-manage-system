<template>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <span>分类列表-懒加载-扁平化data即可——需要第一层</span>
            </div>
        </template>
        <!-- 树形组件 -->
        <el-tree :load="loadNode" :props="defaultProps" lazy default-expand-all>
            <!-- scope 解构 { node, data }  -->
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <div class="action">
                        <el-button icon="edit" @click.stop="openEditDialog(node,data)" :disabled="data.id===0"
                            type="primary" link size="small">
                            编辑</el-button>
                        <el-button icon="CirclePlus" @click.stop="openInsertDialog(node,data)" type="primary" link
                            size="small">添加</el-button>
                        <el-button icon="delete" @click.stop="handleRemove(node,data)" :disabled="data.id===0"
                            type="primary" link size="small">
                            删除</el-button>
                    </div>
                </span>
            </template>
        </el-tree>
    </el-card>

    <!-- 添加按钮 dialog 弹窗 -->
    <el-dialog v-model="insert_dialog_visible" title="添加分类">
        <el-form ref="insert_form_ref" :rules="rules" :model="insert_form">
            <el-form-item label="分类名称" prop="name" status-icon label-width="80px">
                <el-input v-model="insert_form.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="insert_dialog_visible = false">取消</el-button>
                <el-button type="primary" @click="handleInsert(insert_form_ref)">添加</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 编辑按钮 dialog 弹窗 -->
    <el-dialog v-model="edit_dialog_visible" title="编辑分类">
        <el-form ref="edit_form_ref" :rules="rules" :model="edit_form">
            <el-form-item label="分类名称" prop="name" status-icon label-width="80px">
                <el-input v-model="edit_form.name" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="edit_dialog_visible = false">取消</el-button>
                <el-button type="primary" @click="handleEdit(edit_form_ref)">确认</el-button>
            </span>
        </template>
    </el-dialog>


</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import Category from '@/api/category';

//指定属性对应关系
const defaultProps = {
    children: 'children',
    label: 'name',
}
//懒加载节点
let loadNode = (node, resolve) => {
    //数据加载完成的回调函数（必须调用）——（生成子节点）——传入需要生成的节点数据
    resolve([{ id: 1, name: '懒加载-1' }]);
}

//表单验证规则
let rules = reactive({
    name: [
        { required: true, message: '请输入正确的分类名称！', trigger: 'blur' }
    ]
})

//缓存数据---发送axios时，使用其中的id等数据
let current_data = ref({});
let current_node = ref({});

//添加分类
//添加dialog状态
let insert_dialog_visible = ref(false);
//获取Form组件实例
let insert_form_ref = ref();
//添加Model
let insert_form = reactive({ name: '' });
//打开添加dialog
let openInsertDialog = (node, data) => {
    // console.log(data);
    insert_dialog_visible.value = true;
    current_data.value = data;
    current_node.value = node;
}
//添加分类按钮事件
let handleInsert = (formEl) => {
    formEl.validate(async (valid) => {
        if (valid) {
            let { status, msg, data } = await Category.insert({ ...insert_form, parent_id: current_data.value.id })
            if (status) {
                //新节点的数据
                const newChild = { ...data, ...insert_form, children: [] }
                if (!current_data.value.children) {
                    current_data.value.children = []
                }
                current_data.value.children.push(newChild);
                treeDate.value = [...treeDate.value];
                //关闭dialog弹窗
                insert_dialog_visible.value = false;
            }

        }
    });
}

//编辑分类：
//编辑dialog状态
let edit_dialog_visible = ref(false);
//获取Form组件实例
let edit_form_ref = ref();
//编辑Model
let edit_form = ref({ name: '' });
//打开编辑dialog
let openEditDialog = (node, data) => {
    //打开弹窗
    edit_dialog_visible.value = true;
    //还原表单
    // console.log(data);
    // console.log(node);
    edit_form.value = { ...data };
    //缓存数据
    current_data.value = data;
    current_node.value = node;
}
//编辑分类按钮事件
let handleEdit = (formEl) => {
    formEl.validate(async (valid) => {
        if (valid) {
            let { status, msg, data } = await Category.edit({ ...edit_form.value })
            if (status) {
                //更新DOM
                current_node.value.data = { ...edit_form.value };
                //关闭dialog弹窗
                edit_dialog_visible.value = false;
            }
        }
    });
}

//删除按钮
let handleRemove = (node, data) => {
    ElMessageBox.confirm('此操作将永久删除该分类，确定删除嘛？', { type: ' warning ' })
        .then(async () => {
            let { status, msg } = await Category.remove({ id: data.id });
            if (status) {
                //更新DOM
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex((d) => d.id === data.id);
                children.splice(index, 1);
                treeDate.value = [...treeDate.value]
                //消息提示
                ElMessage.success(msg);
            } else {
                ElMessage.error(msg);
            }
        })
        .catch(() => {
            ElMessage.info('取消成功');
        })
}

</script>


<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>