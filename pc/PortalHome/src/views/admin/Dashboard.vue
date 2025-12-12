<template>
  <div class="dashboard">
    <div class="stats-row">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon :size="28"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-title">{{ stat.title }}</span>
        </div>
      </div>
    </div>

    <div class="content-row">
      <div class="card recent-list">
        <div class="card-header">
          <h3>最新动态</h3>
          <el-button text type="primary" @click="$router.push('/admin/news')">
            查看全部 <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
        <div class="card-body">
          <div class="list-item" v-for="item in recentNews" :key="item.id">
            <div class="item-info">
              <el-tag size="small" :type="item.tagType">{{ item.type }}</el-tag>
              <span class="item-title">{{ item.title }}</span>
            </div>
            <span class="item-date">{{ item.date }}</span>
          </div>
        </div>
      </div>

      <div class="card quick-actions">
        <div class="card-header">
          <h3>快捷操作</h3>
        </div>
        <div class="card-body">
          <div class="action-grid">
            <div class="action-item" @click="$router.push('/admin/news')">
              <el-icon :size="32" color="#3E87C7"><DocumentAdd /></el-icon>
              <span>发布新闻</span>
            </div>
            <div class="action-item" @click="$router.push('/admin/bidding')">
              <el-icon :size="32" color="#3E87C7"><Bell /></el-icon>
              <span>发布公告</span>
            </div>
            <div class="action-item" @click="$router.push('/admin/project')">
              <el-icon :size="32" color="#2A446E"><DataLine /></el-icon>
              <span>更新项目</span>
            </div>
            <div class="action-item" @click="$router.push('/admin/carousel')">
              <el-icon :size="32" color="#9EB7CC"><PictureFilled /></el-icon>
              <span>轮播管理</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card system-info">
      <div class="card-header">
        <h3>系统信息</h3>
      </div>
      <div class="card-body">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="系统名称">数字经济门户管理系统</el-descriptions-item>
          <el-descriptions-item label="版本号">v1.0.0</el-descriptions-item>
          <el-descriptions-item label="运行环境">Vue 3 + Element Plus</el-descriptions-item>
          <el-descriptions-item label="后端框架">Node.js + Express</el-descriptions-item>
          <el-descriptions-item label="数据库">MySQL 8.0</el-descriptions-item>
          <el-descriptions-item label="当前用户">{{ username }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const username = computed(() => localStorage.getItem('admin_username') || 'admin')

const stats = [
  { title: '新闻动态', value: 26, icon: 'Document', color: 'linear-gradient(135deg, #3E87C7, #2A446E)' },
  { title: '招标公告', value: 12, icon: 'Bell', color: 'linear-gradient(135deg, #2A446E, #3E87C7)' },
  { title: '项目进度', value: 8, icon: 'DataLine', color: 'linear-gradient(135deg, #3E87C7, #9EB7CC)' },
  { title: '党建工作', value: 15, icon: 'Flag', color: 'linear-gradient(135deg, #9EB7CC, #3E87C7)' }
]

const recentNews = ref([
  { id: 1, title: '公司成功签约数智城市项目', type: '新闻动态', tagType: '', date: '2024-01-15' },
  { id: 2, title: '智慧园区建设项目招标公告', type: '招标公告', tagType: 'warning', date: '2024-01-14' },
  { id: 3, title: '党支部开展主题党日活动', type: '党建工作', tagType: 'danger', date: '2024-01-14' },
  { id: 4, title: '数智城市一期项目进度更新', type: '项目进度', tagType: 'success', date: '2024-01-13' },
  { id: 5, title: '低空经济发展规划正式发布', type: '新闻动态', tagType: '', date: '2024-01-12' }
])
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      color: #fff;
    }
  }
  
  .stat-info {
    display: flex;
    flex-direction: column;
    
    .stat-value {
      font-size: 32px;
      font-weight: 600;
      color: #2A446E;
    }
    
    .stat-title {
      font-size: 14px;
      color: #999;
      margin-top: 4px;
    }
  }
}

.content-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      font-size: 16px;
      color: #2A446E;
      margin: 0;
    }
  }
  
  .card-body {
    padding: 20px;
  }
}

.recent-list {
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
    
    .item-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .item-title {
        font-size: 14px;
        color: #333;
      }
    }
    
    .item-date {
      font-size: 12px;
      color: #999;
    }
  }
}

.quick-actions {
  .action-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    
    span {
      font-size: 14px;
      color: #666;
    }
    
    &:hover {
      background: #f0f7ff;
      transform: translateY(-3px);
    }
  }
}

.system-info {
  .card-body {
    padding: 24px;
  }
}
</style>
