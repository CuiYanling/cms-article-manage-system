import { createRouter, createWebHashHistory } from 'vue-router'
//公共结构（组件）：
import Layout from '@/components/Layout.vue';

//router：路由实例对象
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      alias: '/',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      // 任何人都可以阅读文章(不需要登录)
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Register.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      // 命名路由，只要名字不重复即可
      name: 'Admin',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'list',
          name: 'AdminList',
          component: () => import('@/views/Admin/List.vue')
        },
        {
          path: 'listedit/:id',
          name: 'AdminListEdit',
          component: () => import('@/views/Admin/ListEdit.vue')
        },
        {
          path: 'info',
          name: 'AdminInfo',
          component: () => import('@/views/Admin/Info.vue')
        },
      ]
    },
    {
      path: '/article',
      name: 'Article',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'list',
          name: 'ArticleList',
          component: () => import('@/views/Article/List.vue')
        },
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'listedit/:id',
          name: 'ArticleListEdit',
          component: () => import('@/views/Article/ListEdit.vue')
        },
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'release',
          name: 'ArticleRelease',
          component: () => import('@/views/Article/Release.vue')
        },
      ]
    },

    {
      path: '/tag',
      name: 'Tag',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'list',
          name: 'TagList',
          component: () => import('@/views/Tag/List.vue')
        },
      ]
    },

    {
      path: '/comment',
      name: 'Comment',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'CommentList',
          component: () => import('@/views/Comment/List.vue')
        },
      ]
    },

    {
      path: '/notice',
      name: 'Notice',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'list',
          name: 'NoticeList',
          component: () => import('@/views/Notice/List.vue')
        },
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'listedit/:id',
          name: 'NoticeListEdit',
          component: () => import('@/views/Notice/ListEdit.vue')
        },
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'release',
          name: 'NoticeRelease',
          component: () => import('@/views/Notice/Release.vue')
        },
      ]
    },

    {
      path: '/slide',
      name: 'Slide',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'SlideList',
          component: () => import('@/views/Slide/List.vue')
        },
      ]
    },

    {
      path: '/link',
      name: 'Link',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'list',
          name: 'LinkList',
          component: () => import('@/views/Link/List.vue')
        },
      ]
    },
    {
      path: '/user',
      name: 'User',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'list',
          name: 'UserList',
          component: () => import('@/views/User/List.vue')
        },
      ]
    },

    {
      path: '/category',
      name: 'Category',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'list',
          name: 'CategoryList',
          component: () => import('@/views/Category/List.vue')
        },
      ]
    },

    {
      path: '/auth',
      name: 'Auth',
      component: Layout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'role',
          name: 'AuthRole',
          component: () => import('@/views/Auth/Role.vue')
        },
        {
          path: 'menu',
          name: 'AuthMenu',
          component: () => import('@/views/Auth/Menu.vue')
        },
      ]
    },



  ]
})

//全局前置守卫
router.beforeEach((to, from) => {
  // console.log('to', to);
  // console.log('from', from);
  //判断是否 to 登录页 或者 注册页（放行——————return true）
  //当不需要 token 的页面变多时，这样写不方便（to.name）
  // if (to.name === "Login" || to.name === "Register") {}
  //路由元信息：判断是否需要登录验证
  if (!to.meta.requiresAuth) {
    return true;
  }
  //提取 token 进行校验————进行判断
  let token = sessionStorage.token;
  if (token) {
    //token 存在————放行

  } else {
    //token 不存在
    //返回 false 取消导航（白屏————不合理）
    //  return false;
    //将用户 重定向 到 登录页面  
    return { name: 'Login', query: { redirect: to.fullPath } };
  }

});

export default router
