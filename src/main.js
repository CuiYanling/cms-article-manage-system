// 入口文件
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/assets/css/main.css'

//配置axios
import '@/plugins/axios.config.js';

//导入所有字体图标：
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
//持久性 插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App)
//全局注册图标组件：
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//使用持久性插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

//应用层注入 API接口服务器（依赖注入）
app.provide('host', import.meta.env.VITE_SERVER);



app.use(pinia)
app.use(router)

app.mount('#app')
