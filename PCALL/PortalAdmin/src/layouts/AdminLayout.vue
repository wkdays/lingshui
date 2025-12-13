<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="logo">数字经济门户管理</div>
      <el-menu
        :default-active="$route.path"
        router
        background-color="transparent"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>控制台</span>
        </el-menu-item>
        <el-sub-menu index="home-manage">
          <template #title>
            <el-icon><House /></el-icon>
            <span>首页管理</span>
          </template>
          <el-menu-item index="/carousel">轮播图管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="content-manage">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/news">新闻动态</el-menu-item>
          <el-menu-item index="/bidding">招标公告</el-menu-item>
          <el-menu-item index="/project">项目进度</el-menu-item>
          <el-menu-item index="/party">党建工作</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </aside>
    <main class="admin-main">
      <header class="admin-header">
        <span class="header-title">{{ $route.meta.title || '控制台' }}</span>
        <div class="header-user">
          <span class="username">{{ username }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const username = computed(() => localStorage.getItem('admin_username') || 'admin')

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    router.push('/login')
  }).catch(() => {})
}
</script>
