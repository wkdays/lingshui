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

const defaultData = {
  news: [
    { id: 1, title: '公司成功签约数智城市项目', summary: '近日，公司与某市政府成功签约数智城市建设项目，将为城市数字化转型提供全方位解决方案，助力智慧城市建设迈上新台阶。', created_at: '2024-01-15', cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop' },
    { id: 2, title: '低空经济发展规划正式发布', summary: '公司发布低空经济发展规划，明确未来三年发展目标和重点任务，抢占低空经济新赛道。', created_at: '2024-01-12', cover: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&h=200&fit=crop' },
    { id: 3, title: '数字经济供应链平台正式上线', summary: '历时半年精心打造的数字经济供应链平台正式上线运营，为企业提供一站式数字化服务。', created_at: '2024-01-10', cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop' },
    { id: 4, title: '公司荣获数字经济创新奖', summary: '在第十届数字经济峰会上，公司凭借在数智城市领域的突出贡献，荣获"数字经济创新奖"。', created_at: '2024-01-08', cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&h=200&fit=crop' },
    { id: 5, title: '战略合作签约仪式成功举行', summary: '公司与多家知名企业举行战略合作签约仪式，共同推进数字经济生态建设。', created_at: '2024-01-05', cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop' }
  ],
  bidding: [
    { id: 1, title: '智慧园区建设项目招标公告', summary: '就智慧园区建设项目进行公开招标，欢迎符合条件的供应商参与投标。', created_at: '2024-01-14' },
    { id: 2, title: '数据中心设备采购招标公告', summary: '现就数据中心服务器、存储设备等进行公开招标采购。', created_at: '2024-01-11' },
    { id: 3, title: '软件开发服务招标公告', summary: '就数字化管理平台软件开发服务进行招标，诚邀有实力的软件企业参与。', created_at: '2024-01-09' }
  ],
  project: [
    { id: 1, title: '数智城市一期项目', summary: '项目已完成需求分析和系统设计阶段，正在进行核心模块开发。当前进度：65%', created_at: '2024-01-15' },
    { id: 2, title: '低空经济平台建设', summary: '平台架构设计已完成，正在进行飞行监管模块开发测试。当前进度：40%', created_at: '2024-01-13' },
    { id: 3, title: '供应链数字化改造', summary: '已完成供应商管理模块上线，正在推进物流跟踪功能开发。当前进度：80%', created_at: '2024-01-10' }
  ],
  party: [
    { id: 1, title: '党支部开展"学思想、强党性"主题党日活动', summary: '公司党支部组织全体党员开展主题党日活动，深入学习党的创新理论。', created_at: '2024-01-14', cover: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=300&h=200&fit=crop' },
    { id: 2, title: '深入学习贯彻党的二十大精神', summary: '公司组织专题学习会，深入学习贯彻党的二十大精神，推动各项工作落实。', created_at: '2024-01-11', cover: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&h=200&fit=crop' },
    { id: 3, title: '党员志愿服务进社区', summary: '公司党员志愿者走进社区，开展数字技能培训志愿服务活动。', created_at: '2024-01-08', cover: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop' },
    { id: 4, title: '廉政教育专题学习会召开', summary: '公司召开廉政教育专题学习会，筑牢党员干部廉洁自律防线。', created_at: '2024-01-05', cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=200&fit=crop' }
  ]
}

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

const list = computed(() => defaultData[activeTab.value] || [])
const total = computed(() => list.value.length)

onMounted(() => {
  if (route.query.tab && tabs.some(t => t.key === route.query.tab)) {
    activeTab.value = route.query.tab
  }
})

watch(() => route.query.tab, (val) => {
  if (val && tabs.some(t => t.key === val)) {
    activeTab.value = val
  }
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
