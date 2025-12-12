<template>
  <div class="admin-layout" v-if="isLogin">
    <el-container>
      <el-aside width="220px" class="sidebar">
        <div class="sidebar-logo">
          <el-icon :size="28"><OfficeBuilding /></el-icon>
          <span>后台管理</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          router
          background-color="#2A446E"
          text-color="#fff"
          active-text-color="#9EB7CC"
        >
          <el-menu-item index="/admin/dashboard">
            <el-icon><DataBoard /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/admin/carousel">
            <el-icon><PictureFilled /></el-icon>
            <span>核心动态管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/news">
            <el-icon><Document /></el-icon>
            <span>新闻动态管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/bidding">
            <el-icon><Bell /></el-icon>
            <span>招标公告管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/project">
            <el-icon><DataLine /></el-icon>
            <span>项目进度管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/party">
            <el-icon><Flag /></el-icon>
            <span>党建工作管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <span class="user-info">
              <el-icon><User /></el-icon>
              {{ username }}
            </span>
            <el-button text @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出
            </el-button>
          </div>
        </el-header>
        
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
  <router-view v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isLogin = computed(() => route.name !== 'AdminLogin')
const activeMenu = computed(() => route.path)
const username = computed(() => localStorage.getItem('admin_username') || 'admin')

const titleMap = {
  '/admin/dashboard': '仪表盘',
  '/admin/carousel': '核心动态管理',
  '/admin/news': '新闻动态管理',
  '/admin/bidding': '招标公告管理',
  '/admin/project': '项目进度管理',
  '/admin/party': '党建工作管理'
}

const currentTitle = computed(() => titleMap[route.path] || '管理')

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_username')
  router.push('/admin/login')
}
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
}

.sidebar {
  background: #2A446E;
  min-height: 100vh;
  
  .sidebar-logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .el-menu {
    border-right: none;
    
    .el-menu-item {
      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
      
      &.is-active {
        background: rgba(62, 135, 199, 0.3) !important;
      }
    }
  }
}

.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
  }
}

.main {
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}
</style>
