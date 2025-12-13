<template>
  <div class="service-page">
    <!-- 顶部大图Banner -->
    <div class="page-banner">
      <img src="/images/banner-digital-economy.jpg" alt="一站式服务" class="banner-img" />
      <div class="banner-overlay">
        <h1>一站式服务</h1>
        <p>数字经济全流程服务平台</p>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧业务类型选择 -->
      <div class="left-sidebar">
        <!-- 对话列表头部 - Kimi风格 -->
        <div class="chat-list-header">
          <el-icon :size="18"><ChatLineRound /></el-icon>
          <span>对话列表</span>
        </div>
        
        <div 
          v-for="biz in businessTypes" 
          :key="biz.key"
          class="biz-tab-item"
          :class="{ active: activeBusiness === biz.key }"
          @click="selectBusiness(biz)"
        >
          <el-icon :size="20" class="biz-icon"><component :is="biz.icon" /></el-icon>
          <span class="biz-name">{{ biz.name }}</span>
        </div>
      </div>

      <!-- 右侧主要内容区 -->
      <div class="right-content">
        <!-- 平台标题 -->
        <div class="platform-header">
          <h1>数字文化出海一站式服务平台</h1>
        </div>

        <!-- 流程图区域 -->
        <div class="flow-section">
          <!-- 左侧阶段按钮 -->
          <div class="stage-buttons">
            <div 
              v-for="stage in stages" 
              :key="stage.key"
              class="stage-btn"
              :class="{ active: activeStage === stage.key }"
              @click="selectStage(stage)"
            >
              <el-icon :size="16"><component :is="stage.icon" /></el-icon>
              <span>{{ stage.name }}</span>
            </div>
          </div>

          <!-- 箭头 -->
          <div class="flow-arrow">
            <el-icon :size="24"><Right /></el-icon>
          </div>

          <!-- 服务流程卡片 -->
          <div class="service-flow">
            <div class="flow-card" v-for="flow in serviceFlows" :key="flow.key">
              <div class="flow-icon">
                <el-icon :size="28"><component :is="flow.icon" /></el-icon>
              </div>
              <div class="flow-title">{{ flow.title }}</div>
              <div class="flow-desc">{{ flow.desc }}</div>
            </div>
            <!-- 最后一个箭头指向业务 -->
            <div class="final-arrow">
              <el-icon :size="32"><Right /></el-icon>
            </div>
            <div class="flow-card business-card">
              <div class="flow-icon">
                <el-icon :size="28"><TrendCharts /></el-icon>
              </div>
              <div class="flow-title">业务</div>
              <div class="flow-desc">数字游戏、短视频影视、<br/>跨境电商、数字文创</div>
            </div>
          </div>
        </div>

        <!-- 底部标语 -->
        <div class="platform-slogan">
          <p>集检索、生成、审阅、合规落地与一体的"全生命周期只能申报服务闭环"服务平台</p>
        </div>

      </div>
    </div>

    <!-- 统计数据 - 底部横跨全宽 -->
    <div class="stats-wrapper">
      <div class="stats-section">
        <div class="stat-item" v-for="stat in statistics" :key="stat.label">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Right, Picture, Van, VideoCamera, ShoppingCart, Monitor, User, Coin, TrendCharts, ChatLineRound, Edit, Search } from '@element-plus/icons-vue'

const router = useRouter()
const activeStage = ref('consult')
const activeBusiness = ref('culture')

const stages = [
  { key: 'consult', name: '事前咨询', icon: 'ChatLineRound' },
  { key: 'apply', name: '事中申报', icon: 'Edit' },
  { key: 'review', name: '事后复查', icon: 'Search' }
]

const businessTypes = [
  { key: 'culture', name: '数字文创', icon: 'Picture' },
  { key: 'logistics', name: '数字物流', icon: 'Van' },
  { key: 'media', name: '影视短剧', icon: 'VideoCamera' },
  { key: 'crossborder', name: '跨境电商', icon: 'ShoppingCart' }
]

const serviceFlows = [
  { key: 'gov', title: '政务', desc: '国内一网通办', icon: 'Monitor' },
  { key: 'law', title: '法务', desc: '国外全球经营', icon: 'User' },
  { key: 'finance', title: '财务', desc: 'xxxxxxx', icon: 'Coin' }
]

const statistics = [
  { value: '1612', label: '服务企业数' },
  { value: '2185', label: '回答准确率' },
  { value: '72', label: '知识库存量' },
  { value: '90', label: '关键达标率' }
]

const selectBusiness = (biz) => {
  activeBusiness.value = biz.key
  goToChat()
}

const selectStage = (stage) => {
  activeStage.value = stage.key
  goToChat()
}

const goToChat = () => {
  router.push({
    path: '/ai-chat',
    query: {
      category: activeBusiness.value,
      stage: activeStage.value
    }
  })
}
</script>

<style lang="scss" scoped>
.service-page {
  min-height: calc(100vh - 70px);
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

.main-content {
  display: flex;
  gap: 50px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  min-height: 600px;
}

// 左侧业务类型选择 - 类似图2的简洁列表样式
.left-sidebar {
  width: 180px;
  flex-shrink: 0;
  padding: 12px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  align-self: stretch;
  display: flex;
  flex-direction: column;
}

// 对话列表头部 - Kimi风格
.chat-list-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, rgba(62, 135, 199, 0.1), rgba(91, 163, 217, 0.06));
  border-radius: 10px;
  color: #3E87C7;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(135deg, rgba(62, 135, 199, 0.15), rgba(91, 163, 217, 0.1));
  }
}

.biz-tab-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 12px;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .biz-icon {
    color: #666;
    transition: color 0.2s;
  }
  
  .biz-name {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }
  
  &:hover {
    background: #f5f7fa;
    
    .biz-icon, .biz-name {
      color: #3E87C7;
    }
  }
  
  &.active {
    background: linear-gradient(135deg, rgba(62, 135, 199, 0.12), rgba(91, 163, 217, 0.08));
    
    .biz-icon {
      color: #3E87C7;
    }
    
    .biz-name {
      color: #3E87C7;
      font-weight: 600;
    }
  }
}

// 右侧主要内容区
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

// 平台标题
.platform-header {
  background: linear-gradient(135deg, #3E87C7, #5BA3D9);
  border-radius: 12px;
  padding: 24px 40px;
  text-align: center;
  
  h1 {
    color: #fff;
    font-size: 28px;
    font-weight: 600;
    margin: 0;
    letter-spacing: 2px;
  }
}

// 流程图区域
.flow-section {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 40px 30px;
  background: #f8fafc;
  border-radius: 12px;
  min-height: 200px;
}

.stage-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex-shrink: 0;
}

.stage-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fff;
  border: 2px solid #e4e7ed;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  
  span {
    font-size: 14px;
    color: #666;
  }
  
  .el-icon {
    color: #3E87C7;
  }
  
  &:hover {
    border-color: #3E87C7;
    background: rgba(62, 135, 199, 0.05);
  }
  
  &.active {
    background: #3E87C7;
    border-color: #3E87C7;
    
    span, .el-icon {
      color: #fff;
    }
  }
}

.flow-arrow {
  color: #3E87C7;
  display: flex;
  align-items: center;
}

.service-flow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.flow-card {
  background: linear-gradient(135deg, #3E87C7, #5BA3D9);
  border-radius: 8px;
  padding: 24px 28px;
  text-align: center;
  min-width: 130px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    border: 10px solid transparent;
    border-left-color: #5BA3D9;
  }
  
  &:last-of-type::after {
    display: none;
  }
  
  .flow-icon {
    color: #fff;
    margin-bottom: 8px;
  }
  
  .flow-title {
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .flow-desc {
    color: rgba(255, 255, 255, 0.85);
    font-size: 12px;
  }
}

.final-arrow {
  color: #3E87C7;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.business-card {
  background: linear-gradient(135deg, #2A446E, #3E87C7) !important;
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%);
  padding-right: 40px !important;
  
  &::after {
    display: none !important;
  }
  
  .flow-desc {
    font-size: 11px;
    line-height: 1.4;
  }
}

// 底部标语
.platform-slogan {
  background: linear-gradient(135deg, #3E87C7, #2A446E);
  border-radius: 8px;
  padding: 16px 30px;
  text-align: center;
  
  p {
    color: #fff;
    font-size: 15px;
    margin: 0;
    letter-spacing: 1px;
  }
}

// 统计数据 - 底部全宽
.stats-wrapper {
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

.stats-section {
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 40px;
}

.stat-item {
  flex: 1;
  text-align: center;
  
  .stat-value {
    font-size: 52px;
    font-weight: 300;
    color: #333;
    line-height: 1;
    margin-bottom: 14px;
  }
  
  .stat-label {
    font-size: 15px;
    color: #666;
  }
}
</style>
