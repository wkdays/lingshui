<template>
  <div class="about-page">
    <div class="page-banner">
      <img src="/images/banner-building.jpg" alt="公司介绍" class="banner-img" />
      <div class="banner-overlay">
        <h1>公司介绍</h1>
        <p>了解我们的发展历程与团队风采</p>
      </div>
    </div>

    <div class="container">
      <!-- 子导航 -->
      <div class="tab-nav">
        <div 
          class="tab-item"
          :class="{ active: activeTab === 'intro' }"
          @click="activeTab = 'intro'"
        >
          公司介绍
        </div>
        <div 
          class="tab-item"
          :class="{ active: activeTab === 'team' }"
          @click="activeTab = 'team'"
        >
          人员风采
        </div>
      </div>

      <!-- 公司介绍内容 -->
      <div class="content-area card" v-show="activeTab === 'intro'">
        <div class="intro-section">
          <div class="intro-header">
            <h2>企业简介</h2>
          </div>
          <div class="intro-body">
            <div class="intro-image">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" alt="公司大楼" />
            </div>
            <div class="intro-text">
              <p>我们是一家专注于数字经济领域的创新型企业，成立于2018年，总部位于数字经济产业园区。公司以"科技创新、服务社会"为使命，致力于为客户提供数智城市、低空经济、数字经济供应链、数据要素等全方位解决方案。</p>
              <p>公司秉承"创新驱动、服务至上"的发展理念，汇聚了一批来自国内外知名企业和科研机构的精英人才，打造了一支专业化、年轻化的高素质团队。经过多年发展，公司已成长为数字经济领域的领军企业之一。</p>
            </div>
          </div>
        </div>

        <div class="history-section">
          <h2>发展历程</h2>
          <div class="timeline">
            <div class="timeline-item" v-for="item in timeline" :key="item.year">
              <div class="timeline-year">{{ item.year }}</div>
              <div class="timeline-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="business-section">
          <h2>主营业务</h2>
          <div class="business-grid">
            <div class="business-card" v-for="item in businesses" :key="item.title">
              <div class="business-icon">
                <el-icon :size="40"><component :is="item.icon" /></el-icon>
              </div>
              <h4>{{ item.title }}</h4>
              <p>{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 人员风采内容 -->
      <div class="content-area card" v-show="activeTab === 'team'">
        <div class="team-section">
          <h2>核心团队</h2>
          <div class="team-grid">
            <div class="team-card" v-for="member in teamMembers" :key="member.name">
              <div class="member-avatar">
                <img :src="member.avatar" :alt="member.name" />
              </div>
              <div class="member-info">
                <h4>{{ member.name }}</h4>
                <span class="member-title">{{ member.title }}</span>
                <p>{{ member.intro }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="culture-section">
          <h2>团队风采</h2>
          <div class="culture-grid">
            <div class="culture-item" v-for="(img, idx) in cultureImages" :key="idx">
              <img :src="img.url" :alt="img.title" />
              <div class="culture-overlay">
                <span>{{ img.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('intro')

const timeline = [
  { year: '2018', title: '公司成立', desc: '公司在数字经济产业园区正式注册成立，开启创业征程。' },
  { year: '2019', title: '业务拓展', desc: '成功承接首个数智城市项目，业务规模快速增长。' },
  { year: '2020', title: '团队壮大', desc: '员工规模突破100人，引进多名行业专家。' },
  { year: '2021', title: '创新突破', desc: '低空经济业务板块正式启动，获得多项专利授权。' },
  { year: '2022', title: '战略升级', desc: '完成战略升级，形成四大核心业务板块。' },
  { year: '2023', title: '高速发展', desc: '年营收突破亿元，荣获多项行业荣誉。' },
  { year: '2024', title: '再创辉煌', desc: '持续深耕数字经济领域，向更高目标迈进。' }
]

const businesses = [
  { icon: 'OfficeBuilding', title: '数智城市', desc: '构建城市数字化底座，赋能城市治理现代化' },
  { icon: 'Position', title: '低空经济', desc: '开拓低空经济新蓝海，打造一网统飞平台' },
  { icon: 'Connection', title: '数字供应链', desc: '数字化供应链解决方案，提升产业协同效率' },
  { icon: 'DataAnalysis', title: '数据要素', desc: '释放数据要素价值，推动数据资产化运营' }
]

const teamMembers = [
  {
    name: '张伟',
    title: '董事长兼CEO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    intro: '20年企业管理经验，曾任多家知名企业高管，具有丰富的数字经济领域实践经验。'
  },
  {
    name: '李明',
    title: '技术总监',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    intro: '博士学位，人工智能专家，主导多个国家级科技项目，发表论文50余篇。'
  },
  {
    name: '王芳',
    title: '运营总监',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    intro: '15年运营管理经验，擅长项目管理与团队建设，推动公司业务持续增长。'
  },
  {
    name: '刘强',
    title: '市场总监',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    intro: '资深市场营销专家，成功开拓多个重点区域市场，建立广泛合作伙伴网络。'
  }
]

const cultureImages = [
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop', title: '团队协作' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop', title: '技术研讨' },
  { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop', title: '项目汇报' },
  { url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop', title: '团建活动' },
  { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop', title: '办公环境' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', title: '战略会议' }
]
</script>

<style lang="scss" scoped>
.about-page {
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
    color: #3E87C7;
  }
  
  &.active {
    background: #fff;
    color: #3E87C7;
    border-bottom-color: #3E87C7;
  }
}

.content-area {
  padding: 40px;
  
  h2 {
    font-size: 24px;
    color: #2A446E;
    margin-bottom: 30px;
    padding-left: 12px;
    border-left: 4px solid #3E87C7;
  }
}

.intro-section {
  margin-bottom: 50px;
}

.intro-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.intro-image img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.intro-text {
  p {
    font-size: 16px;
    line-height: 1.9;
    color: #555;
    margin-bottom: 16px;
    text-indent: 2em;
  }
}

.history-section {
  margin-bottom: 50px;
}

.timeline {
  position: relative;
  padding-left: 30px;
  
  &::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #3E87C7, #9EB7CC);
    border-radius: 2px;
  }
}

.timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -26px;
    top: 5px;
    width: 14px;
    height: 14px;
    background: #3E87C7;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 0 0 3px #3E87C7;
  }
}

.timeline-year {
  flex-shrink: 0;
  width: 60px;
  font-size: 18px;
  font-weight: 600;
  color: #3E87C7;
}

.timeline-content {
  flex: 1;
  
  h4 {
    font-size: 16px;
    color: #2A446E;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.business-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.business-card {
  text-align: center;
  padding: 30px 20px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    background: #fff;
  }
  
  .business-icon {
    color: #3E87C7;
    margin-bottom: 16px;
  }
  
  h4 {
    font-size: 18px;
    color: #2A446E;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.team-section {
  margin-bottom: 50px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.team-card {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    background: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
}

.member-avatar {
  flex-shrink: 0;
  
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #3E87C7;
  }
}

.member-info {
  h4 {
    font-size: 18px;
    color: #2A446E;
    margin-bottom: 6px;
  }
  
  .member-title {
    display: inline-block;
    font-size: 13px;
    color: #3E87C7;
    background: rgba(62, 135, 199, 0.1);
    padding: 3px 10px;
    border-radius: 12px;
    margin-bottom: 12px;
  }
  
  p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.culture-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.culture-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
  
  .culture-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 50%, rgba(42, 68, 110, 0.8));
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 16px;
    
    span {
      color: #fff;
      font-size: 15px;
      font-weight: 500;
    }
  }
}
</style>
