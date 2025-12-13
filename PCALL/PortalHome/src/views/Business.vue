<template>
  <div class="business-page">
    <div class="page-banner">
      <img src="/images/banner-smart-city.jpg" alt="业务介绍" class="banner-img" />
      <div class="banner-overlay">
        <h1>业务介绍</h1>
        <p>数字经济全方位解决方案</p>
      </div>
    </div>

    <div class="container">
      <!-- 业务架构展示区 -->
      <section class="architecture-section">
        <div class="arch-content card">
          <div class="arch-diagram">
            <div class="arch-center">
              <div class="center-circle">
                <span>数字经济</span>
                <span>核心平台</span>
              </div>
            </div>
            <div class="arch-items">
              <div 
                v-for="(item, idx) in archItems" 
                :key="item.name"
                class="arch-item"
                :class="{ active: activeArch === idx }"
                :style="getItemStyle(idx)"
                @click="activeArch = idx"
              >
                <el-icon :size="28"><component :is="item.icon" /></el-icon>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          <div class="arch-detail">
            <h3>{{ archItems[activeArch].name }}</h3>
            <p>{{ archItems[activeArch].desc }}</p>
            <ul>
              <li v-for="point in archItems[activeArch].points" :key="point">
                <el-icon><Check /></el-icon>
                {{ point }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 产品介绍区 -->
      <section class="products-section">
        <h2 class="section-title">产品介绍</h2>
        <div class="products-grid">
          <div 
            v-for="product in products" 
            :key="product.name"
            class="product-card card"
            @click="showProductDetail(product)"
          >
            <div class="product-icon">
              <el-icon :size="48"><component :is="product.icon" /></el-icon>
            </div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.brief }}</p>
            <div class="product-link">
              了解详情 <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 产品详情弹窗 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="currentProduct.name"
      width="700px"
      class="product-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon">
            <el-icon :size="60"><component :is="currentProduct.icon" /></el-icon>
          </div>
          <p class="dialog-brief">{{ currentProduct.brief }}</p>
        </div>
        <div class="dialog-body">
          <h4>产品概述</h4>
          <p>{{ currentProduct.desc }}</p>
          <h4>核心功能</h4>
          <ul>
            <li v-for="feature in currentProduct.features" :key="feature">
              <el-icon><CircleCheck /></el-icon>
              {{ feature }}
            </li>
          </ul>
          <h4>应用场景</h4>
          <p>{{ currentProduct.scenario }}</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeArch = ref(0)
const dialogVisible = ref(false)
const currentProduct = ref({})

const archItems = [
  {
    name: '数智城市',
    icon: 'OfficeBuilding',
    desc: '以城市数字化底座为核心，构建智慧城市治理体系，实现城市运行态势感知、事件协同处置、决策科学支撑。',
    points: [
      '城市运行监测预警',
      '多部门协同指挥',
      '公共服务智能化',
      '城市大脑决策支持'
    ]
  },
  {
    name: '低空经济',
    icon: 'Position',
    desc: '打造低空经济一网统飞平台，提供空域管理、飞行服务、应用场景等全链条解决方案。',
    points: [
      '空域资源管理',
      '飞行计划审批',
      '实时监控调度',
      '应急处置保障'
    ]
  },
  {
    name: '数字供应链',
    icon: 'Connection',
    desc: '数字化供应链管理平台，整合供应商、生产、仓储、物流全链条，提升产业协同效率。',
    points: [
      '供应商协同管理',
      '智能仓储物流',
      '订单全程追溯',
      '数据分析决策'
    ]
  },
  {
    name: '数据要素',
    icon: 'DataAnalysis',
    desc: '数据要素流通交易平台，推动数据资产化运营，释放数据要素价值。',
    points: [
      '数据资产登记',
      '数据确权定价',
      '安全流通交易',
      '价值评估服务'
    ]
  }
]

const products = [
  {
    name: '数智城市一张图',
    icon: 'MapLocation',
    brief: '城市数字化治理的可视化中枢',
    desc: '数智城市一张图是城市数字化治理的核心平台，通过整合城市各类数据资源，构建城市运行的数字孪生体系，实现城市态势一屏感知、事件处置一网协同、决策支持一键直达。',
    features: [
      '城市运行态势实时展示',
      '多源数据融合分析',
      '突发事件智能预警',
      '跨部门协同调度',
      '领导驾驶舱决策支持'
    ],
    scenario: '适用于城市综合治理中心、智慧城管、应急指挥等场景，为城市管理者提供全方位的数字化治理工具。'
  },
  {
    name: '低空经济一网统飞',
    icon: 'Promotion',
    brief: '低空飞行全要素管理平台',
    desc: '低空经济一网统飞平台是面向低空经济发展的综合管理服务平台，实现空域资源统一管理、飞行活动全程监管、应用场景协同服务，推动低空经济规范有序发展。',
    features: [
      '空域资源可视化管理',
      '飞行计划在线申请审批',
      '无人机实时监控追踪',
      '飞行冲突智能预警',
      '应急处置快速响应'
    ],
    scenario: '适用于低空飞行管理部门、无人机运营企业、通航服务机构等，支撑物流配送、巡检作业、应急救援等低空应用场景。'
  },
  {
    name: '数字经济供应链',
    icon: 'Goods',
    brief: '产业数字化协同服务平台',
    desc: '数字经济供应链平台整合产业链上下游资源，通过数字化手段优化供应链各环节，实现信息共享、业务协同、价值共创，助力企业降本增效。',
    features: [
      '供应商全生命周期管理',
      '智能采购与订单协同',
      '仓储物流一体化服务',
      '供应链金融支持',
      '全链路数据分析'
    ],
    scenario: '适用于制造业、零售业、物流业等行业，帮助企业构建敏捷、高效、可靠的数字化供应链体系。'
  },
  {
    name: '数据要素',
    icon: 'Coin',
    brief: '数据资产流通交易平台',
    desc: '数据要素平台聚焦数据要素市场化配置，提供数据登记确权、质量评估、定价交易、安全流通等全流程服务，推动数据资源向数据资产转化。',
    features: [
      '数据资产目录管理',
      '数据质量评估认证',
      '合规确权与授权管理',
      '多模式交易撮合',
      '隐私计算安全流通'
    ],
    scenario: '适用于数据交易所、数据服务商、数据需求方等，支撑政务数据开放、企业数据交易、数据产品创新等场景。'
  }
]

const getItemStyle = (idx) => {
  const angles = [-45, 45, 135, 225]
  const angle = angles[idx]
  const radius = 140
  const x = Math.cos(angle * Math.PI / 180) * radius
  const y = Math.sin(angle * Math.PI / 180) * radius
  return {
    transform: `translate(${x}px, ${y}px)`
  }
}

const showProductDetail = (product) => {
  currentProduct.value = product
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.business-page {
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

.architecture-section {
  padding: 40px 0;
}

.arch-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px;
}

.arch-diagram {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arch-center {
  .center-circle {
    width: 140px;
    height: 140px;
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(62, 135, 199, 0.4);
  }
}

.arch-items {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arch-item {
  position: absolute;
  width: 100px;
  height: 100px;
  background: #fff;
  border: 2px solid #9EB7CC;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  
  .el-icon {
    color: #3E87C7;
  }
  
  span {
    font-size: 13px;
    color: #2A446E;
    font-weight: 500;
  }
  
  &.active {
    border-color: #3E87C7;
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    transform: scale(1.1) !important;
    
    .el-icon, span {
      color: #fff;
    }
  }
}

.arch-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  
  h3 {
    font-size: 24px;
    color: #2A446E;
    margin-bottom: 16px;
    padding-left: 12px;
    border-left: 4px solid #3E87C7;
  }
  
  p {
    font-size: 15px;
    color: #555;
    line-height: 1.8;
    margin-bottom: 20px;
  }
  
  ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
    
    .el-icon {
      color: #3E87C7;
    }
  }
}

.products-section {
  padding: 20px 0 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.product-card {
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    .product-icon {
      background: linear-gradient(135deg, #3E87C7, #2A446E);
      
      .el-icon {
        color: #fff;
      }
    }
    
    .product-link {
      color: #3E87C7;
    }
  }
  
  .product-icon {
    width: 90px;
    height: 90px;
    margin: 0 auto 20px;
    background: #f0f7ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    
    .el-icon {
      color: #3E87C7;
    }
  }
  
  h3 {
    font-size: 18px;
    color: #2A446E;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  
  .product-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #3E87C7;
    transition: color 0.3s;
  }
}

.product-dialog {
  .dialog-content {
    padding: 0 20px;
  }
  
  .dialog-header {
    text-align: center;
    padding-bottom: 24px;
    border-bottom: 1px solid #eee;
    margin-bottom: 24px;
    
    .dialog-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #3E87C7, #2A446E);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .el-icon {
        color: #fff;
      }
    }
    
    .dialog-brief {
      font-size: 16px;
      color: #666;
    }
  }
  
  .dialog-body {
    h4 {
      font-size: 16px;
      color: #2A446E;
      margin: 20px 0 12px;
      padding-left: 10px;
      border-left: 3px solid #3E87C7;
    }
    
    p {
      font-size: 14px;
      color: #555;
      line-height: 1.8;
    }
    
    ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      
      li {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #333;
        
        .el-icon {
          color: #3E87C7;
        }
      }
    }
  }
}
</style>
