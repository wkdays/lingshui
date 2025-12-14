<template>
  <div class="service-page">
    <!-- 装饰图标 -->
    <div class="decor-icons">
      <svg class="decor-icon icon-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83"/>
      </svg>
      <svg class="decor-icon icon-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      <div class="decor-dot dot-1"></div>
      <div class="decor-dot dot-2"></div>
      <div class="decor-dot dot-3"></div>
      <svg class="decor-icon icon-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </div>

    <!-- 右侧倾斜背景 -->
    <div class="slant-bg"></div>

    <!-- 主内容区域 -->
    <div class="hero-section">
      <!-- 左侧内容 -->
      <div class="hero-left">
        <h1 class="hero-title">数字文化出海一站式服务平台</h1>
        <p class="hero-desc">
          助力企业数字化转型，提供全方位数字文化出海服务。集数智化项目开发、数据资产运营、无人机技术服务于一体，打造自贸港数字样板间。
        </p>
        
        <div class="hero-buttons">
          <button class="btn-primary" @click="goToChat">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            智能咨询
          </button>
          <button class="btn-outline" @click="goToChat">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/>
            </svg>
            出海服务
          </button>
        </div>

        <!-- 特性标签 -->
        <div class="feature-tags">
          <span class="tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            数智化项目开发
          </span>
          <span class="tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            数据资产运营
          </span>
          <span class="tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            无人机技术服务
          </span>
          <span class="tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            数字文化出海
          </span>
        </div>
      </div>

      <!-- 右侧展示图 -->
      <div class="hero-right">
        <div class="framework-card">
          <div class="framework-title">陵水数投发展框架</div>
          <div class="framework-grid">
            <div class="framework-item">
              <div class="item-title">数智化项目开发</div>
              <div class="item-content">
                <span>产业数据赋能</span>
                <span>公共数据汇聚</span>
                <span>城市一张网</span>
                <span>档案电子化</span>
              </div>
            </div>
            <div class="framework-item">
              <div class="item-title">数字文化出海服务</div>
              <div class="item-content">
                <span>跨境来数加工</span>
                <span>数字文化产业云</span>
                <span>国际数字内容平台</span>
                <span>海缆登陆站</span>
              </div>
            </div>
            <div class="framework-item">
              <div class="item-title">数据资产运营</div>
              <div class="item-content">
                <span>智能硬件场景</span>
                <span>数据标注服务</span>
                <span>数字经济一体化</span>
                <span>服务支撑体系</span>
              </div>
            </div>
            <div class="framework-item">
              <div class="item-title">无人机技术服务</div>
              <div class="item-content">
                <span>场景化专业服务</span>
                <span>低空经济一网统飞</span>
                <span>低空经济数字基建</span>
                <span>航空数据服务</span>
              </div>
            </div>
          </div>
          <div class="framework-slogan">
            <span>应用场景赋能者</span>
            <span class="divider">·</span>
            <span>建设自贸港数字样板间</span>
            <span class="divider">·</span>
            <span>挖掘数据资源金矿</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部统计数据 -->
    <div class="stats-section">
      <div class="stat-item" v-for="(stat, index) in statistics" :key="stat.label">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const statistics = [
  { value: '1612', label: '服务企业数' },
  { value: '85%', label: '回答准确率' },
  { value: '72', label: '知识库存量' },
  { value: '90%', label: '关键达标率' }
]

const goToChat = () => {
  router.push({
    path: '/ai-chat',
    query: { category: 'culture' }
  })
}
</script>

<style lang="scss" scoped>
$primary: #2A446E;
$secondary: #3E87C7;
$accent: #9EB7CC;

.service-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

// 装饰图标
.decor-icons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.decor-icon {
  position: absolute;
  opacity: 0.6;
  animation: float 4s ease-in-out infinite;
  
  &.icon-1 {
    width: 40px;
    height: 40px;
    top: 150px;
    left: 8%;
    color: $secondary;
    animation-delay: 0s;
  }
  
  &.icon-2 {
    width: 28px;
    height: 28px;
    top: 200px;
    left: 15%;
    color: #f0a0a0;
    animation-delay: 1s;
  }
  
  &.icon-3 {
    width: 32px;
    height: 32px;
    top: 350px;
    left: 5%;
    color: $accent;
    animation-delay: 2s;
  }
}

.decor-dot {
  position: absolute;
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
  
  &.dot-1 {
    width: 12px;
    height: 12px;
    top: 180px;
    left: 20%;
    background: $secondary;
    animation-delay: 0.5s;
  }
  
  &.dot-2 {
    width: 8px;
    height: 8px;
    top: 280px;
    left: 12%;
    background: #f0a0a0;
    animation-delay: 1.5s;
  }
  
  &.dot-3 {
    width: 10px;
    height: 10px;
    top: 320px;
    left: 18%;
    background: $accent;
    animation-delay: 2.5s;
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

// 右侧倾斜背景
.slant-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 55%;
  height: 100%;
  background: linear-gradient(135deg, $secondary 0%, $primary 100%);
  clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);
  z-index: 0;
}

// 主内容区域
.hero-section {
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 60px 40px;
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 200px);
}

// 左侧内容
.hero-left {
  flex: 1;
  max-width: 550px;
  padding-right: 40px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: $primary;
  line-height: 1.3;
  margin: 0 0 24px;
  white-space: nowrap;
}

.hero-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
}

// 按钮组
.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, $secondary, $primary);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba($primary, 0.3);
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
  }
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #fff;
  border: 2px solid $secondary;
  border-radius: 8px;
  color: $secondary;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba($secondary, 0.05);
    transform: translateY(-2px);
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
  }
}

// 特性标签
.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fff;
  border-radius: 20px;
  font-size: 13px;
  color: $primary;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  svg {
    width: 14px;
    height: 14px;
    color: $secondary;
  }
}

// 右侧展示图
.hero-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

// 框架卡片
.framework-card {
  max-width: 520px;
  padding: 30px;
}

.framework-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 32px;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

// 四宫格布局
.framework-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 28px;
}

.framework-item {
  .item-title {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .item-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    span {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
      padding-left: 12px;
      position: relative;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
      }
    }
  }
}

.framework-slogan {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  
  span {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  .divider {
    margin: 0 10px;
    color: rgba(255, 255, 255, 0.4);
  }
}

// 底部统计数据
.stats-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 200px;
  padding: 50px 60px;
  position: relative;
  z-index: 2;
  background: #fff;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  .stat-value {
    font-size: 48px;
    font-weight: 300;
    color: $primary;
    line-height: 1;
    margin-bottom: 12px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #888;
  }
}
</style>
