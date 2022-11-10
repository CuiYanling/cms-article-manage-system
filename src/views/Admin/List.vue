<template>
    <el-card>
        <template #header>
            <div class="card-header">
                <span>管理员列表</span>
            </div>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="#" width="80" />
            <el-table-column prop="username" label="用户名" width="100" />
            <el-table-column prop="fullname" label="姓名" width="100" />
            <el-table-column prop="sex" label="性别" width="80" />
            <el-table-column prop="tel" label="手机" width="150" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column label="头像" width="100">
                <template #default="scope">
                    <el-avatar shape="square" :src="scope.row.avatar" />
                </template>
            </el-table-column>
            <el-table-column label="角色" width="150">
                <template #default="scope">
                    <el-tag :type="scope.row.id===1?'danger':''" disable-transitions>
                        {{scope.row.role_name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="operation" label="操作" #default="scope">
                <el-space>
                    <el-link :href="`/#/admin/listedit/${scope.row.id}`">
                        <el-button type="primary" plain>
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            编辑
                        </el-button>
                    </el-link>
                    <el-button type="danger" :disabled="scope.row.id===1" plain
                        @click="handleRemove(scope.row.id,scope.$index)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                        删除
                    </el-button>
                </el-space>
            </el-table-column>
        </el-table>
    </el-card>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import Admin from '@/api/admin';

let tableData = ref([]);

//加载管理员列表的函数：
// async function loadList() {
//     let { status, msg, data, total } = await Admin.list();
//     if (status) {
//         //获取到数据，渲染数据
//         tableData.value = data;
//         // console.log(data);
//     } else {
//         //获取失败
//         ElMessage.error(msg);
//     }
// }
//方法一：setup
// loadList();
//方法二：onMounted
// onMounted(() => {
//     loadList();
// })
//方法三：onMounted（没有参数的话，就使用onMounted方法）【有参数---watchEffect】
onMounted(async () => {
    let { status, msg, data, total } = await Admin.list();
    if (status) {
        //获取到数据，渲染数据
        tableData.value = data;
        // console.log(data);
    } else {
        //获取失败
        ElMessage.error(msg);
    }
})

//删除按钮：
function handleRemove(id, i) {
    //弹出确认删除框---confirm(传三个参数，用不到的可以不传)
    ElMessageBox.confirm(
        '确认删除此账户嘛?',
        '确认删除',
        {
            type: 'error',
            cancelButtonText: '取消',
            confirmButtonText: '确认'
        }
    )
        .then(async () => {
            //确认按钮——1：发送ajax给后台—---2：等ajax成功后再删除DOM【不传id的话，后台报错500】
            //1:
            let { status, msg } = await Admin.remove({ id });  // id: id  简化为  id
            if (status) {
                //删除成功
                ElMessage.success(msg);
                //2:
                tableData.value.splice(i, 1);
            } else {
                //删除失败
                ElMessage.error(msg);
            }
            //2:

        })
        .catch(() => {
            //取消按钮
            ElMessage('取消成功！');
        })
}

</script>