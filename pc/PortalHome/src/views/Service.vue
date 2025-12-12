<template>
  <div class="service-page">
    <div class="page-banner">
      <img src="/images/banner-digital-economy.jpg" alt="一站式服务" class="banner-img" />
      <div class="banner-overlay">
        <h1>一站式服务</h1>
        <p>数字经济全流程服务平台</p>
      </div>
    </div>

    <div class="container">
      <!-- 服务卡片网格 -->
      <div class="service-grid">
        <div 
          v-for="service in services" 
          :key="service.name"
          class="service-card card"
          @click="selectService(service)"
        >
          <div class="card-header">
            <div class="card-icon" :style="{ background: service.color }">
              <el-icon :size="24"><component :is="service.icon" /></el-icon>
            </div>
            <div class="card-stats">
              <span class="stats-label">服务数</span>
              <span class="stats-value">{{ service.count }}</span>
            </div>
          </div>
          <h3>{{ service.name }}</h3>
          <p class="card-desc">{{ service.desc }}</p>
          <div class="card-progress">
            <span class="progress-label">{{ service.progressLabel }}</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: service.progress + '%', background: service.progressColor }"></div>
            </div>
            <span class="progress-value">{{ service.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- 办事阶段选择 -->
      <div class="stage-section card">
        <h2>办事阶段</h2>
        <div class="stage-buttons">
          <div 
            v-for="stage in stages" 
            :key="stage.key"
            class="stage-btn"
            :class="{ active: activeStage === stage.key }"
            @click="activeStage = stage.key"
          >
            <el-icon :size="20"><component :is="stage.icon" /></el-icon>
            <span>{{ stage.name }}</span>
          </div>
        </div>
      </div>

      <!-- AI智能搜索区域 - DeepSeek风格 -->
      <div class="ai-search-section">
        <div class="ai-search-box">
          <div class="search-input-wrapper">
            <textarea 
              v-model="chatInput" 
              placeholder="有什么可以帮您的？"
              @keyup.enter.exact="sendMessage"
              class="ai-search-input"
              rows="3"
            ></textarea>
          </div>
          <div class="search-toolbar">
            <div class="toolbar-left">
              <div class="toolbar-icon-btn" title="设置">
                <el-icon><Setting /></el-icon>
              </div>
              <div class="toolbar-categories">
                <span 
                  v-for="biz in businessTypes" 
                  :key="biz.key"
                  class="toolbar-category-btn"
                  :class="{ active: activeBusiness === biz.key }"
                  :style="{ '--btn-gradient': biz.gradient }"
                  @click="selectBusiness(biz)"
                >
                  <span class="btn-text">{{ biz.name }}</span>
                </span>
              </div>
            </div>
            <div class="toolbar-right">
              <div class="toolbar-icon-btn" title="上传文件">
                <el-icon><Paperclip /></el-icon>
              </div>
              <div class="toolbar-icon-btn" title="语音输入">
                <el-icon><Microphone /></el-icon>
              </div>
              <button 
                class="send-btn" 
                :class="{ active: chatInput.trim() }"
                @click="sendMessage"
                :disabled="!chatInput.trim()"
              >
                <el-icon><Top /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 业务类型选择卡片 -->
      <div class="business-type-section">
        <div class="section-header">
          <div class="header-line"></div>
          <h3>业务类型</h3>
        </div>
        <div class="business-type-cards">
          <div 
            v-for="biz in businessTypes" 
            :key="biz.key"
            class="business-type-card"
            :class="{ active: activeBusiness === biz.key }"
            @click="selectBusiness(biz)"
          >
            <div class="type-icon" :style="{ background: biz.gradient }">
              <el-icon :size="28"><component :is="biz.icon" /></el-icon>
            </div>
            <span class="type-name">{{ biz.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Top, Paperclip, Microphone, Picture, Van, VideoCamera, ShoppingCart } from '@element-plus/icons-vue'

const activeStage = ref('consult')
const activeBusiness = ref('')
const chatInput = ref('')

const services = [
  {
    name: '业务咨询',
    desc: '需求分析与规划',
    icon: 'Document',
    color: 'linear-gradient(135deg, #3E87C7, #2A446E)',
    count: '8/12',
    progress: 85,
    progressLabel: '服务完成度',
    progressColor: '#3E87C7'
  },
  {
    name: '政策咨询',
    desc: '资质与合规审查',
    icon: 'Reading',
    color: 'linear-gradient(135deg, #2A446E, #3E87C7)',
    count: '9/10',
    progress: 88,
    progressLabel: '合规率',
    progressColor: '#2A446E'
  },
  {
    name: '法律咨询',
    desc: '风险识别与评估',
    icon: 'Notebook',
    color: 'linear-gradient(135deg, #3E87C7, #9EB7CC)',
    count: '12/14',
    progress: 90,
    progressLabel: '风险覆盖',
    progressColor: '#3E87C7'
  },
  {
    name: '业务执行',
    desc: '流程监控与管理',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #9EB7CC, #3E87C7)',
    count: '14/15',
    progress: 82,
    progressLabel: '执行进度',
    progressColor: '#9EB7CC'
  },
  {
    name: '审批办理',
    desc: '证照与许可审核',
    icon: 'CircleCheck',
    color: 'linear-gradient(135deg, #2A446E, #9EB7CC)',
    count: '16/18',
    progress: 95,
    progressLabel: '办理进度',
    progressColor: '#2A446E'
  },
  {
    name: '合同管理',
    desc: '文书审核与签署',
    icon: 'DocumentCopy',
    color: 'linear-gradient(135deg, #9EB7CC, #2A446E)',
    count: '18/20',
    progress: 87,
    progressLabel: '审核完成',
    progressColor: '#9EB7CC'
  },
  {
    name: '业务复盘',
    desc: '效果评估与优化',
    icon: 'DataAnalysis',
    color: 'linear-gradient(135deg, #3E87C7, #2A446E)',
    count: '6/8',
    progress: 75,
    progressLabel: '优化覆盖',
    progressColor: '#3E87C7'
  },
  {
    name: '年检维护',
    desc: '持续合规监管',
    icon: 'Clock',
    color: 'linear-gradient(135deg, #2A446E, #3E87C7)',
    count: '5/6',
    progress: 82,
    progressLabel: '维护状态',
    progressColor: '#2A446E'
  },
  {
    name: '纠纷处理',
    desc: '争议解决与维权',
    icon: 'Warning',
    color: 'linear-gradient(135deg, #9EB7CC, #3E87C7)',
    count: '4/5',
    progress: 75,
    progressLabel: '解决率',
    progressColor: '#9EB7CC'
  }
]

const stages = [
  { key: 'consult', name: '事前咨询', icon: 'ChatLineRound' },
  { key: 'apply', name: '事中申报', icon: 'Edit' },
  { key: 'review', name: '事后复查', icon: 'Search' }
]

const businessTypes = [
  { key: 'culture', name: '数字文创', icon: 'Picture', gradient: 'linear-gradient(135deg, #3E87C7, #2A446E)' },
  { key: 'logistics', name: '数字物流', icon: 'Van', gradient: 'linear-gradient(135deg, #2A446E, #3E87C7)' },
  { key: 'media', name: '影视短剧', icon: 'VideoCamera', gradient: 'linear-gradient(135deg, #3E87C7, #9EB7CC)' },
  { key: 'crossborder', name: '跨境电商', icon: 'ShoppingCart', gradient: 'linear-gradient(135deg, #9EB7CC, #2A446E)' }
]

const selectService = (service) => {
  ElMessage.info(`进入「${service.name}」服务`)
}

const selectBusiness = (biz) => {
  activeBusiness.value = biz.key
}

const sendMessage = () => {
  if (!chatInput.value.trim()) return
  ElMessage.success('消息已发送，智能助手正在处理...')
  chatInput.value = ''
}

const resetSelection = () => {
  activeBusiness.value = ''
}
</script>

<style lang="scss" scoped>
.service-page {
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
  padding-bottom: 60px;
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

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 40px 0;
}

.service-card {
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      color: #fff;
    }
  }
  
  .card-stats {
    text-align: right;
    
    .stats-label {
      display: block;
      font-size: 12px;
      color: #999;
    }
    
    .stats-value {
      font-size: 20px;
      font-weight: 600;
      color: #3E87C7;
    }
  }
  
  h3 {
    font-size: 18px;
    color: #2A446E;
    margin-bottom: 8px;
  }
  
  .card-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }
  
  .card-progress {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .progress-label {
      font-size: 12px;
      color: #999;
      flex-shrink: 0;
    }
    
    .progress-bar {
      flex: 1;
      height: 6px;
      background: #eee;
      border-radius: 3px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s;
      }
    }
    
    .progress-value {
      font-size: 13px;
      color: #3E87C7;
      font-weight: 500;
      flex-shrink: 0;
    }
  }
}

.stage-section, .business-section, .chat-entry {
  padding: 30px;
  margin-bottom: 24px;
  
  h2 {
    font-size: 20px;
    color: #2A446E;
    margin-bottom: 24px;
    padding-left: 12px;
    border-left: 4px solid #3E87C7;
  }
}

.stage-buttons {
  display: flex;
  gap: 20px;
}

.stage-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #f5f7fa;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  
  span {
    font-size: 15px;
    color: #666;
  }
  
  .el-icon {
    color: #999;
  }
  
  &:hover {
    border-color: #3E87C7;
    
    span, .el-icon {
      color: #3E87C7;
    }
  }
  
  &.active {
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    border-color: transparent;
    
    span, .el-icon {
      color: #fff;
    }
  }
}

.business-cards {
  display: flex;
  gap: 24px;
}

.business-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  
  .biz-icon {
    width: 70px;
    height: 70px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      color: #fff;
    }
  }
  
  span {
    font-size: 16px;
    color: #2A446E;
    font-weight: 500;
  }
  
  &:hover {
    background: #fff;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    border-color: #3E87C7;
    background: #fff;
    box-shadow: 0 8px 30px rgba(62, 135, 199, 0.2);
  }
}

// AI智能搜索区域样式 - DeepSeek风格
.ai-search-section {
  margin-top: 40px;
  padding: 0 20px;
}

.ai-search-box {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 24px;
  padding: 24px 28px 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #d0d0d0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  &:focus-within {
    border-color: #3E87C7;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  }
  
  .search-input-wrapper {
    margin-bottom: 16px;
  }
  
  .ai-search-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 16px;
    color: #1a1a1a;
    padding: 12px 4px;
    resize: none;
    min-height: 72px;
    max-height: 200px;
    line-height: 1.6;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: transparent;
    
    &::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }
  }
  
  .search-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
  }
  
  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .toolbar-icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b7280;
    background: transparent;
    
    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
    
    .el-icon {
      font-size: 18px;
    }
  }
  
  .toolbar-categories {
    display: flex;
    gap: 8px;
    margin-left: 4px;
  }
  
  .toolbar-category-btn {
    position: relative;
    padding: 8px 18px;
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    color: #fff;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border: none;
    
    .btn-text {
      position: relative;
      z-index: 1;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--btn-gradient);
      opacity: 1;
      transition: opacity 0.3s;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      
      &::before {
        opacity: 0.9;
      }
    }
    
    &.active {
      transform: scale(1.05);
      box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
      
      &::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(135deg, #3E87C7, #2A446E);
        border-radius: 22px;
        z-index: -1;
        animation: pulse-ring 1.5s ease-out infinite;
      }
    }
  }
  
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    background: #e5e7eb;
    color: #9ca3af;
    
    .el-icon {
      font-size: 16px;
      transition: transform 0.3s;
    }
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    &.active {
      background: linear-gradient(135deg, #3E87C7, #2A446E);
      color: #fff;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        
        .el-icon {
          transform: translateY(-2px);
        }
      }
    }
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

// 业务类型选择卡片样式
.business-type-section {
  margin-top: 40px;
  padding: 0 20px;
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    
    .header-line {
      width: 4px;
      height: 20px;
      background: linear-gradient(135deg, #3E87C7, #2A446E);
      border-radius: 2px;
    }
    
    h3 {
      font-size: 18px;
      color: #2A446E;
      font-weight: 600;
      margin: 0;
    }
  }
  
  .business-type-cards {
    display: flex;
    gap: 20px;
  }
  
  .business-type-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 28px 20px;
    background: #fff;
    border-radius: 16px;
    border: 2px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    .type-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      
      .el-icon {
        color: #fff;
      }
    }
    
    .type-name {
      font-size: 15px;
      color: #2A446E;
      font-weight: 500;
    }
    
    &:hover {
      border-color: #e0e0e0;
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
      
      .type-icon {
        transform: scale(1.05);
      }
    }
    
    &.active {
      border-color: #3E87C7;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
      
      .type-icon {
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
      }
    }
  }
}

.ai-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  .ai-card {
    background: #2A446E;
    border-radius: 16px;
    padding: 60px 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    
    span {
      color: #fff;
      font-size: 20px;
      font-weight: 500;
    }
  }
}
</style>
