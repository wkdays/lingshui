<template>
  <div class="news-page">
    <!-- Banner 大图 -->
    <div class="page-banner">
      <img src="/images/banner-technology.jpg" alt="公司动态" class="banner-img" />
      <div class="banner-overlay">
        <h1>公司动态</h1>
        <p>了解公司最新资讯与发展动态</p>
      </div>
    </div>

    <div class="container">
      <!-- 栏目导航 -->
      <div class="tab-nav">
        <div 
          v-for="tab in tabs" 
          :key="tab.key" 
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content-area card">
        <div class="list-container">
          <div 
            v-for="item in list" 
            :key="item.id" 
            class="list-item"
            @click="goDetail(item)"
          >
            <div class="item-date">
              <span class="day">{{ getDay(item.created_at) }}</span>
              <span class="year-month">{{ getYearMonth(item.created_at) }}</span>
            </div>
            <div class="item-content">
              <h3>{{ item.title }}</h3>
              <p class="item-summary">{{ item.summary }}</p>
            </div>
            <div class="item-action">
              <span class="view-more">>查看全文</span>
            </div>
          </div>

          <el-empty v-if="!loading && !list.length" description="暂无数据" />
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="total > pageSize">
          <el-pagination
            v-model:current-page="page"
            :page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="(val) => page = val"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newsApi, biddingApi, projectApi, partyApi } from '@/api'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'news', name: '新闻动态' },
  { key: 'bidding', name: '招标公告' },
  { key: 'project', name: '项目进度' },
  { key: 'party', name: '党建工作' }
]

const activeTab = ref('news')
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)

const apiMap = {
  news: newsApi,
  bidding: biddingApi,
  project: projectApi,
  party: partyApi
}

const list = ref([])
const total = ref(0)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const getDay = (date) => {
  if (!date) return '01'
  const d = new Date(date)
  return String(d.getDate()).padStart(2, '0')
}

const getYearMonth = (date) => {
  if (!date) return '2024-01'
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const switchTab = (key) => {
  activeTab.value = key
  page.value = 1
  router.replace({ query: { tab: key } })
}

const goDetail = (item) => {
  router.push(`/news/${item.id}?type=${activeTab.value}`)
}

const loadData = async () => {
  loading.value = true
  try {
    const api = apiMap[activeTab.value]
    const res = await api.getList({ page: page.value, limit: pageSize.value })
    if (res?.data) {
      list.value = res.data
      total.value = res.total || res.data.length
    }
  } catch (error) {
    console.error('Load data error:', error)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.tab && tabs.some(t => t.key === route.query.tab)) {
    activeTab.value = route.query.tab
  }
  loadData()
})

watch(() => route.query.tab, (val) => {
  if (val && tabs.some(t => t.key === val)) {
    activeTab.value = val
  }
})

watch([activeTab, page], () => {
  loadData()
})
</script>

<style lang="scss" scoped>
$primary-dark: #2A446E;
$primary-main: #3E87C7;

.news-page {
  min-height: calc(100vh - 200px);
  background: #fff;
}

.page-banner {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
  
  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .banner-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 60px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    text-align: center;
    color: #fff;
  }
  
  h1 {
    font-size: 42px;
    font-weight: 500;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  p {
    font-size: 18px;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
}

.tab-nav {
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.tab-item {
  padding: 14px 35px;
  color: #666;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  
  &:hover {
    color: $primary-main;
  }
  
  &.active {
    background: #fff;
    color: $primary-main;
    border-bottom-color: $primary-main;
  }
}

.content-area {
  padding: 25px;
  min-height: 400px;
  border: 1px solid #e5e5e5;
  border-top: none;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border: 1px solid #e5e5e5;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: $primary-main;
    box-shadow: 0 2px 12px rgba(62, 135, 199, 0.15);
    
    h3 {
      color: $primary-main;
    }
    
    .view-more {
      color: $primary-main;
    }
  }
}

.item-date {
  flex-shrink: 0;
  width: 80px;
  text-align: center;
  padding-right: 25px;
  border-right: 1px solid #e5e5e5;
  margin-right: 25px;
  
  .day {
    display: block;
    font-size: 36px;
    font-weight: 300;
    color: #999;
    line-height: 1;
  }
  
  .year-month {
    display: block;
    font-size: 13px;
    color: #999;
    margin-top: 5px;
  }
}

.item-content {
  flex: 1;
  min-width: 0;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    line-height: 1.5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .item-summary {
    font-size: 13px;
    color: #888;
    line-height: 1.8;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.item-action {
  flex-shrink: 0;
  margin-left: 20px;
  
  .view-more {
    font-size: 13px;
    color: #999;
    white-space: nowrap;
    
    &:hover {
      color: $primary-main;
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  padding-top: 25px;
}
</style>
