import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'news',
        name: 'News',
        component: () => import('@/views/News.vue'),
        meta: { title: '公司动态' }
      },
      {
        path: 'news/:id',
        name: 'NewsDetail',
        component: () => import('@/views/NewsDetail.vue'),
        meta: { title: '详情' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: { title: '公司介绍' }
      },
      {
        path: 'business',
        name: 'Business',
        component: () => import('@/views/Business.vue'),
        meta: { title: '业务介绍' }
      },
      {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/Service.vue'),
        meta: { title: '一站式服务' }
      },
      {
        path: 'ai-chat',
        name: 'AiChat',
        component: () => import('@/views/AiChat.vue'),
        meta: { title: 'AI对话' }
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'login',
        name: 'AdminLogin',
        component: () => import('@/views/admin/Login.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'news',
        name: 'AdminNews',
        component: () => import('@/views/admin/NewsManage.vue')
      },
      {
        path: 'bidding',
        name: 'AdminBidding',
        component: () => import('@/views/admin/BiddingManage.vue')
      },
      {
        path: 'project',
        name: 'AdminProject',
        component: () => import('@/views/admin/ProjectManage.vue')
      },
      {
        path: 'party',
        name: 'AdminParty',
        component: () => import('@/views/admin/PartyManage.vue')
      },
      {
        path: 'carousel',
        name: 'AdminCarousel',
        component: () => import('@/views/admin/CarouselManage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth !== false && to.path.startsWith('/admin') && to.name !== 'AdminLogin') {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      next('/admin/login')
      return
    }
  }
  next()
})

export default router
