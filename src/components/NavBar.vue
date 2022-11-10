<!-- 横向导航条 -->
<template>
    <div class="nav-bar">
        <div class="left">
            <img src="../assets/img/common/logo.png" height="55" alt="logo" class="logo">
            <el-button @click="handleToggle" class="menu_icon" link :icon="icon">
            </el-button>
        </div>
        <el-menu router mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
            :ellipsis="false">
            <el-menu-item index="1">站点设置</el-menu-item>
            <el-menu-item index="2">预览网站</el-menu-item>
            <el-sub-menu index="3">
                <template #title>
                    <el-space>
                        <el-avatar :src="profile.avatar" />
                        <span> {{profile.fullname}}</span>
                    </el-space>
                </template>
                <el-menu-item index="3-1">消息通知</el-menu-item>
                <!-- 跳转页面，上面加router——开启路由模式，才可以跳转 -->
                <el-menu-item index="/account/list">账号设置</el-menu-item>
                <el-menu-item index="3-3">退出登录</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useMenuStore } from '@/stores/menu';
import { useAccountStore } from '@/stores/account';
import { onMounted } from 'vue';

//打开页面，NavBar处 加载头像、姓名位置数据
//取出当前id---加载数据时使用
let id = sessionStorage.id;
//初始化
let account = useAccountStore();
//加载当前id的个人资料（loadProfile 来自 account.js）
onMounted(() => {
    account.loadProfile(id);
});
//提取账户state
let { profile } = storeToRefs(account);



//折叠菜单：
let menu = useMenuStore();
//提取  getters
let { icon } = storeToRefs(menu);
//折叠菜单的点击事件：
let handleToggle = () => {
    menu.toggle();
};
//没有setup 的时候：
// export default {
//     setup() {
//         let menu = useMenuStore();
//         //折叠菜单的点击事件：
//         let handleToggle = () => {
//             menu.toggle();
//         };
//         return {
//             handleToggle,
//         }
//     }
// }

</script>

<style lang="less" scoped>
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
    color: white;

    .left {
        display: flex;
        align-items: center;

        .menu_icon {
            color: white;
            font-size: 20px;
        }
    }

    .el-menu {
        //去掉底部边框线
        border-bottom: 0;
    }
}
</style>
