import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'carousel',
        name: 'Carousel',
        component: () => import('../views/CarouselManage.vue'),
        meta: { title: '轮播图管理' }
      },
      {
        path: 'news',
        name: 'News',
        component: () => import('../views/NewsManage.vue'),
        meta: { title: '新闻动态管理' }
      },
      {
        path: 'bidding',
        name: 'Bidding',
        component: () => import('../views/BiddingManage.vue'),
        meta: { title: '招标公告管理' }
      },
      {
        path: 'project',
        name: 'Project',
        component: () => import('../views/ProjectManage.vue'),
        meta: { title: '项目进度管理' }
      },
      {
        path: 'party',
        name: 'Party',
        component: () => import('../views/PartyManage.vue'),
        meta: { title: '党建工作管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
