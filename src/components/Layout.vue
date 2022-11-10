<template>
    <el-container>
        <el-header>
            <NavBar></NavBar>
        </el-header>
        <el-container>
            <el-aside width="auto">
                <SideBar></SideBar>
            </el-aside>
            <el-main>
                <RouterView></RouterView>
                <slot></slot>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
//导入组件
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';
</script>

<style lang="less">
.el-header {
    padding: 0;
}

.el-aside {
    min-height: calc(100vh - 60px);
    background-color: #545c64;
}
</style>