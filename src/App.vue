<script setup>
import { ElConfigProvider } from 'element-plus'
import { RouterView } from 'vue-router'
//组件 中文化
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

</script>

<template>
  <el-config-provider :locale="zhCn"> 
    <RouterView />
  </el-config-provider>

</template>

<style scoped>

</style>
