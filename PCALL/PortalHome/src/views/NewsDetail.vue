<template>
  <div class="detail-page">
    <div class="page-banner">
      <h1>{{ typeNames[type] || '详情' }}</h1>
    </div>

    <div class="container">
      <div class="detail-card card">
        <div class="detail-header">
          <h1>{{ detail.title }}</h1>
          <div class="detail-meta">
            <span><el-icon><Calendar /></el-icon> {{ formatDate(detail.created_at) }}</span>
            <span v-if="detail.views"><el-icon><View /></el-icon> {{ detail.views }} 次浏览</span>
            <span v-if="detail.author"><el-icon><User /></el-icon> {{ detail.author }}</span>
          </div>
        </div>

        <div class="detail-cover" v-if="detail.cover">
          <img :src="detail.cover" :alt="detail.title" />
        </div>

        <div class="detail-content" v-html="detail.content || detail.summary"></div>

        <div class="detail-footer">
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { newsApi, biddingApi, projectApi, partyApi } from '@/api'

const route = useRoute()
const router = useRouter()

const typeNames = {
  news: '新闻动态',
  bidding: '招标公告',
  project: '项目进度',
  party: '党建工作'
}

const type = ref('news')

const apiMap = {
  news: newsApi,
  bidding: biddingApi,
  project: projectApi,
  party: partyApi
}

const defaultDetail = {
  news: {
    title: '公司成功签约数智城市项目',
    summary: '近日，公司与某市政府成功签约数智城市建设项目。',
    content: `
      <p>近日，公司与某市政府成功签约数智城市建设项目，将为城市数字化转型提供全方位解决方案，助力智慧城市建设迈上新台阶。</p>
      <p>本次签约的数智城市项目总投资额达数亿元，建设周期为三年，涵盖城市治理、公共服务、产业发展等多个领域。项目建成后，将显著提升城市运行效率和市民生活品质。</p>
      <h3>项目亮点</h3>
      <ul>
        <li>构建城市数字化底座，实现数据互联互通</li>
        <li>打造智慧政务平台，提升政务服务效能</li>
        <li>建设智慧交通系统，优化城市交通管理</li>
        <li>搭建智慧民生平台，提升公共服务水平</li>
      </ul>
      <p>公司将充分发挥在数字经济领域的技术优势和项目经验，高质量完成项目建设任务，为推动城市高质量发展贡献力量。</p>
    `,
    created_at: '2024-01-15',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    views: 1256,
    author: '综合管理部'
  },
  bidding: {
    title: '智慧园区建设项目招标公告',
    content: `
      <h3>一、项目概况</h3>
      <p>就智慧园区建设项目进行公开招标，欢迎符合条件的供应商参与投标。</p>
      <h3>二、招标内容</h3>
      <p>智慧园区综合管理平台开发与部署，包括但不限于：</p>
      <ul>
        <li>园区综合管理系统</li>
        <li>智能安防监控系统</li>
        <li>智慧停车管理系统</li>
        <li>能耗监测管理系统</li>
      </ul>
      <h3>三、投标人资格要求</h3>
      <ul>
        <li>具有独立法人资格，注册资金不低于500万元</li>
        <li>具有相关行业资质证书</li>
        <li>近三年有类似项目实施经验</li>
      </ul>
      <h3>四、报名时间</h3>
      <p>2024年1月15日至2024年1月25日</p>
    `,
    created_at: '2024-01-14'
  },
  project: {
    title: '数智城市一期项目进度更新',
    content: `
      <h3>项目概述</h3>
      <p>数智城市一期项目旨在构建城市数字化底座，实现城市治理智能化、精细化。</p>
      <h3>当前进度</h3>
      <p><strong>整体进度：65%</strong></p>
      <h4>已完成工作：</h4>
      <ul>
        <li>需求分析报告编制完成</li>
        <li>系统架构设计完成</li>
        <li>数据库设计完成</li>
        <li>核心模块开发进行中（完成80%）</li>
      </ul>
      <h4>下阶段计划：</h4>
      <ul>
        <li>完成核心模块开发</li>
        <li>开展系统集成测试</li>
        <li>用户培训与试运行</li>
      </ul>
      <h3>里程碑节点</h3>
      <p>预计2024年3月完成一期建设，4月正式上线运行。</p>
    `,
    created_at: '2024-01-15'
  },
  party: {
    title: '党支部开展"学思想、强党性"主题党日活动',
    content: `
      <p>为深入学习贯彻习近平新时代中国特色社会主义思想，1月14日，公司党支部组织全体党员开展"学思想、强党性"主题党日活动。</p>
      <h3>活动内容</h3>
      <p>本次活动主要包括以下内容：</p>
      <ul>
        <li>集体学习党的二十大报告精神</li>
        <li>观看党建教育专题片</li>
        <li>开展学习心得交流研讨</li>
        <li>重温入党誓词</li>
      </ul>
      <h3>活动意义</h3>
      <p>通过本次主题党日活动，全体党员进一步增强了党性修养，坚定了理想信念，纷纷表示要在各自岗位上发挥先锋模范作用，以实际行动践行初心使命，为公司高质量发展贡献力量。</p>
    `,
    created_at: '2024-01-14',
    cover: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop'
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const goBack = () => {
  router.push(`/news?tab=${type.value}`)
}

const detail = computed(() => defaultDetail[type.value] || defaultDetail.news)

onMounted(() => {
  type.value = route.query.type || 'news'
})
</script>

<style lang="scss" scoped>
$primary-dark: #2A446E;
$primary-main: #3E87C7;

.detail-page {
  min-height: calc(100vh - 200px);
  background: #f5f5f5;
}

.page-banner {
  background: $primary-main;
  padding: 25px 20px;
  text-align: center;
  color: #fff;
  
  h1 {
    font-size: 20px;
    font-weight: normal;
  }
}

.detail-card {
  max-width: 900px;
  margin: 30px auto;
  padding: 40px;
  background: #fff;
  border: 1px solid #e5e5e5;
}

.detail-header {
  text-align: center;
  padding-bottom: 25px;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 30px;
  
  h1 {
    font-size: 24px;
    font-weight: normal;
    color: #333;
    margin-bottom: 18px;
    line-height: 1.5;
  }
}

.detail-meta {
  display: flex;
  justify-content: center;
  gap: 25px;
  color: #999;
  font-size: 13px;
  
  span {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.detail-cover {
  margin-bottom: 25px;
  text-align: center;
  
  img {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
}

.detail-content {
  font-size: 15px;
  line-height: 2;
  color: #333;
  
  :deep(h3) {
    font-size: 18px;
    color: $primary-dark;
    margin: 25px 0 15px;
    padding-left: 10px;
    border-left: 3px solid $primary-main;
  }
  
  :deep(h4) {
    font-size: 16px;
    color: $primary-dark;
    margin: 20px 0 10px;
  }
  
  :deep(p) {
    margin-bottom: 15px;
    text-indent: 2em;
  }
  
  :deep(ul), :deep(ol) {
    margin: 15px 0;
    padding-left: 40px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.8;
    }
  }
  
  :deep(ul) {
    list-style: disc;
  }
  
  :deep(ol) {
    list-style: decimal;
  }
}

.detail-footer {
  margin-top: 40px;
  padding-top: 25px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: center;
}
</style>
