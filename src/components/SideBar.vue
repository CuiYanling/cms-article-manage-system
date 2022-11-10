<template>
    <el-menu :collapse="isCollapsed" :default-openeds="default_open" router active-text-color="#ffd04b"
        background-color="#545c64" text-color="#fff">

        <!-- <el-sub-menu index="/article/list">
            <template #title>
                <el-icon>
                    <Clock />
                </el-icon>
                <span>信息面板</span>
            </template>
        </el-sub-menu>

        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <Document />
                </el-icon>
                <span>文章管理</span>
            </template>
            <el-menu-item index="/article/release/">
                <el-icon>
                    <DocumentAdd />
                </el-icon>
                <span>发布文章</span>
            </el-menu-item>
            <el-menu-item :router="{name:'ArticleList'}" index="/article/list">
                <el-icon>
                    <Memo />
                </el-icon>
                <span>文章列表</span>
            </el-menu-item>
            <el-menu-item index="/article/tag">
                <el-icon>
                    <Discount />
                </el-icon>
                <span>标签管理</span>
            </el-menu-item>
            <el-menu-item index="/article/comment">
                <el-icon>
                    <ChatLineSquare />
                </el-icon>
                <span>评论管理</span>
            </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/category/list">
            <el-icon>
                <DataAnalysis />
            </el-icon>
            <span>分类管理</span>
        </el-menu-item>

        <el-sub-menu index="4">
            <template #title>
                <el-icon>
                    <DataBoard />
                </el-icon>
                <span>公告管理</span>
            </template>
            <el-menu-item index="/notice/release">
                <el-icon>
                    <Calendar />
                </el-icon>
                <span>发布公告</span>
            </el-menu-item>
            <el-menu-item index="/notice/list">
                <el-icon>
                    <DataAnalysis />
                </el-icon>
                <span>公告列表</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="5">
            <template #title>
                <el-icon>
                    <OfficeBuilding />
                </el-icon>
                <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">
                <el-icon>
                    <User />
                </el-icon>
                <span>用户列表</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="6">
            <template #title>
                <el-icon>
                    <SetUp />
                </el-icon>
                <span>推广管理</span>
            </template>
            <el-menu-item index="/popularize/slideshow">
                <el-icon>
                    <Picture />
                </el-icon>
                <span>轮播图管理</span>
            </el-menu-item>
            <el-menu-item index="/popularize/link">
                <el-icon>
                    <Link />
                </el-icon>
                <span>友情链接</span>
            </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="7">
            <template #title>
                <el-icon>
                    <setting />
                </el-icon>
                <span>系统管理</span>
            </template>
            <el-menu-item index="/admin/list">
                <el-icon>
                    <Medal />
                </el-icon>
                <span>管理员管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/edit">
                <el-icon>
                    <TurnOff />
                </el-icon>
                <span>权限角色</span>
            </el-menu-item>
            <el-menu-item index="/admin/menu">
                <el-icon>
                    <SetUp />
                </el-icon>
                <span>菜单管理</span>
            </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/account/list">
            <el-icon>
                <Postcard />
            </el-icon>
            <span>账户设置</span>
        </el-menu-item> -->

        <!-- axaj生成侧边栏菜单： -->
        <template v-for="menu in menu_tree">
            <!-- 双层嵌套 -->
            <!--此处:index="menu.id" 只是折叠/收起菜单（不需要跳转），只要id不重复即可  -->
            <el-sub-menu v-if="menu.children" :index="menu.id">
                <template #title>
                    <span>{{menu.name}}</span>
                </template>
                <!-- 子菜单循环生成 -->
                <el-menu-item v-for="submenu in menu.children" :index="submenu.path">
                    <span>{{submenu.name}}</span>
                </el-menu-item>
            </el-sub-menu>
            <!-- 单层 -->
            <el-menu-item v-else :index="menu.path">
                <template #title>
                    <span>{{menu.name}}</span>
                </template>
            </el-menu-item>
        </template>

    </el-menu>
</template>


<script setup>
//为了提取数据，保证响应式及ref形式
import { storeToRefs } from 'pinia';
import { useMenuStore } from '@/stores/menu';
import Role from '@/api/role';
import { onMounted, ref } from 'vue';

//初始化useMenuStore
let menu = useMenuStore();

//结构数据，保证其响应式
let { isCollapsed } = storeToRefs(menu);
// console.log(isCollapsed);

//根据角色id，获取当前登录账户的侧边栏菜单
let id = sessionStorage.role;
let menu_tree = ref([]);
//默认开启的菜单
// let default_open = ref([]);
onMounted(async () => {
    let { status, msg, data } = await Role.menu({ id, type: 'tree' });
    console.log(status, data);
    if (status) {
        //默认点击后开启子集菜单的第一个页面（                                                             未成功）
        // let menu = data.find((item) => item.children);
        // default_open.value = [menu.id];
        menu_tree.value = data;
    }
})


</script>

<style lang="less">
.el-menu {
    //去掉侧边边框（默认）
    border: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
}
</style>