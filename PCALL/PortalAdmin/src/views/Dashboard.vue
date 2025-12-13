<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <div class="stat-card" :style="{ borderColor: item.color }">
          <div class="stat-icon" :style="{ background: item.color }">
            <el-icon :size="28"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-title">{{ item.title }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="page-card">
          <div class="page-header">
            <span class="page-title">最新新闻动态</span>
            <el-button type="primary" link @click="$router.push('/news')">查看全部</el-button>
          </div>
          <el-table :data="newsList" stripe>
            <el-table-column prop="title" label="标题" show-overflow-tooltip />
            <el-table-column prop="views" label="浏览" width="80" />
            <el-table-column prop="created_at" label="发布时间" width="120">
              <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="page-card">
          <div class="page-header">
            <span class="page-title">最新党建工作</span>
            <el-button type="primary" link @click="$router.push('/party')">查看全部</el-button>
          </div>
          <el-table :data="partyList" stripe>
            <el-table-column prop="title" label="标题" show-overflow-tooltip />
            <el-table-column prop="views" label="浏览" width="80" />
            <el-table-column prop="created_at" label="发布时间" width="120">
              <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import { newsApi, partyApi, biddingApi, projectApi } from '../api'
import { Document, Notification, FolderOpened, Flag } from '@element-plus/icons-vue'

const stats = ref([
  { title: '新闻动态', value: 0, color: '#2A446E', icon: shallowRef(Document) },
  { title: '招标公告', value: 0, color: '#3E87C7', icon: shallowRef(Notification) },
  { title: '项目进度', value: 0, color: '#9EB7CC', icon: shallowRef(FolderOpened) },
  { title: '党建工作', value: 0, color: '#5A7A9E', icon: shallowRef(Flag) }
])

const newsList = ref([])
const partyList = ref([])

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadData = async () => {
  try {
    const [newsRes, biddingRes, projectRes, partyRes] = await Promise.all([
      newsApi.list({ limit: 5 }),
      biddingApi.list({ limit: 5 }),
      projectApi.list({ limit: 5 }),
      partyApi.list({ limit: 5 })
    ])
    
    stats.value[0].value = newsRes.total
    stats.value[1].value = biddingRes.total
    stats.value[2].value = projectRes.total
    stats.value[3].value = partyRes.total
    
    newsList.value = newsRes.data
    partyList.value = partyRes.data
  } catch (e) {
    console.error('Load dashboard data error:', e)
  }
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 4px solid;
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  
  .stat-info {
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }
    .stat-title {
      font-size: 14px;
      color: #999;
      margin-top: 4px;
    }
  }
}
</style>
