<template>
  <div class="home-page">
    <!-- 核心动态展示区 - 大型轮播图 -->
    <section class="title-carousel">
      <div class="carousel-list">
        <div 
          v-for="(item, index) in carouselItems" 
          :key="index"
          class="item"
          :class="{ active: currentSlide === index }"
          @click="handleCarouselClick(item)"
        >
          <img class="big-image" :src="item.image" alt="数字经济门户" />
          <div class="title-text">
            <div class="title-l">{{ item.title }}</div>
          </div>
        </div>
      </div>
      <div class="carousel-dots">
        <span 
          v-for="(item, index) in carouselItems" 
          :key="index"
          :class="{ active: currentSlide === index }"
          @click="currentSlide = index"
        ></span>
      </div>
      <div class="carousel-arrow prev" @click="prevSlide">‹</div>
      <div class="carousel-arrow next" @click="nextSlide">›</div>
    </section>

    <!-- 焦点新闻区 -->
    <section class="focus-section">
      <div class="focus-side-title">
        <span class="main-title">焦点</span>
        <span class="sub-title">FOCUS</span>
      </div>
      <div class="focus-content">
        <router-link 
          v-for="(item, index) in focusList.slice(focusIndex, focusIndex + 3)" 
          :key="index"
          class="news-item"
          :to="`/news/${item.id}`"
        >
          <div class="news-img" :style="{ backgroundImage: `url(${item.image})` }"></div>
          <div class="text-content">
            <div class="title-l">{{ item.title }}</div>
          </div>
        </router-link>
        <div 
          class="focus-next-btn" 
          @click="nextFocus"
          style="height: 200px; background: linear-gradient(135deg, #3E87C7, #2A446E); border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;"
        >
          <span style="font-size: 36px; color: #fff; line-height: 1;">›</span>
        </div>
      </div>
    </section>

    <!-- 公司动态区 -->
    <section class="news-section">
      <div class="news-wrapper">
        <div class="news-side-title">
          <span class="main-title">公司动态</span>
          <span class="sub-title">NEWS</span>
        </div>
        <div class="show-more">
          <router-link to="/news">更多 <span class="icon-arrow">›</span></router-link>
        </div>
        <div class="news-content">
          <div class="single-list">
            <router-link 
              v-for="(item, index) in newsList.slice(0, 2)" 
              :key="index"
              class="news-single"
              :to="`/news/${item.id}`"
            >
              <div class="img" :style="{ backgroundImage: `url(${item.image})` }"></div>
              <div class="title-part">
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="desc">{{ item.summary }}</div>
            </router-link>
          </div>
          <div class="news-list">
            <router-link 
              v-for="(item, index) in newsList.slice(2)" 
              :key="index"
              class="news-item clearfix"
              :to="`/news/${item.id}`"
            >
              <span class="desc">{{ item.title }}</span>
              <span class="time">{{ formatDate(item.date) }}</span>
            </router-link>
            <router-link class="more" to="/news">更多 <span class="icon-arrow">›</span></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 公司介绍区 -->
    <section class="home-about-zone">
      <div class="home-about-box">
        <!-- 顶部标题条 - 左侧带斜切 -->
        <div style="display: flex; justify-content: flex-start;">
          <div style="width: 38%; background: #3E87C7; display: flex; align-items: center; padding: 12px 30px; gap: 15px; clip-path: polygon(0 0, calc(100% - 30px) 0, 100% 100%, 0 100%);">
            <span style="font-size: 20px; font-weight: 500; letter-spacing: 12px; color: #fff;">公 司 介 绍</span>
            <span style="font-size: 12px; color: rgba(255,255,255,0.7);">ABOUT</span>
          </div>
        </div>
        <!-- 下方内容区 -->
        <div style="padding: 25px 30px; display: flex; gap: 25px;">
          <div style="width: 320px; height: 200px; background: url('/images/company-building-new.jpg') center/cover; flex-shrink: 0; border-radius: 4px;"></div>
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
            <h3 style="font-size: 18px; color: #333; margin-bottom: 12px; font-weight: 600;">数字经济门户</h3>
            <p style="font-size: 14px; color: #666; line-height: 1.8;">数字经济门户是一家专注于数字化转型的高新技术企业，致力于为政府、企业提供智慧城市、大数据、云计算、人工智能等全方位数字化解决方案。</p>
          </div>
          <!-- 右侧快捷链接 -->
          <div style="width: 140px; display: flex; flex-direction: column; gap: 12px;">
            <router-link to="/about" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; text-decoration: none; color: #333; font-size: 14px; background: #f5f7fa; border-left: 3px solid #3E87C7; transition: all 0.3s;">
              <span style="color: #3E87C7;">📋</span> 公司简介
            </router-link>
            <router-link to="/business" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; text-decoration: none; color: #333; font-size: 14px; background: #f5f7fa; border-left: 3px solid #3E87C7; transition: all 0.3s;">
              <span style="color: #3E87C7;">💼</span> 业务介绍
            </router-link>
            <router-link to="/service" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; text-decoration: none; color: #333; font-size: 14px; background: #f5f7fa; border-left: 3px solid #3E87C7; transition: all 0.3s;">
              <span style="color: #3E87C7;">🛠️</span> 一站式服务
            </router-link>
            <router-link to="/news?tab=project" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; text-decoration: none; color: #333; font-size: 14px; background: #f5f7fa; border-left: 3px solid #3E87C7; transition: all 0.3s;">
              <span style="color: #3E87C7;">📁</span> 项目案例
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 党建工作区 -->
    <section class="party-section">
      <div class="party-side-title">
        <span class="main-title">党建工作</span>
        <span class="sub-title">PARTY BUILDING</span>
      </div>
      <div class="show-more-party">
        <router-link to="/news?tab=party">更多 <span class="icon-arrow">›</span></router-link>
      </div>
      <div class="party-content">
        <router-link 
          v-for="(item, index) in partyList" 
          :key="index"
          class="party-item"
          :to="`/news/${item.id}`"
        >
          <div class="party-img" :style="{ backgroundImage: `url(${item.image})` }"></div>
          <div class="party-info">
            <div class="time">
              <span class="month">{{ getMonth(item.date) }}</span>
              <span class="day">{{ getDay(item.date) }}</span>
            </div>
            <div class="info">
              <div class="title">{{ item.title }}</div>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 底部宣传图区 -->
    <section class="banner-images">
      <img src="/images/promotional-banner.jpg" alt="宣传图" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { newsApi } from '@/api'

// 当前轮播索引
const currentSlide = ref(0)
let slideTimer = null

// 轮播图数据
const carouselItems = ref([
  { image: '/images/banner-digital-economy.jpg', title: '数字经济引领未来发展', link: '' },
  { image: '/images/banner-technology.jpg', title: '创新驱动 服务至上', link: '' },
  { image: '/images/banner-smart-city.jpg', title: '科技赋能产业升级', link: '' },
  { image: '/images/banner-building.jpg', title: '智慧城市解决方案', link: '' }
])

// 焦点新闻
const focusIndex = ref(0)
const focusList = ref([
  { id: 1, image: '/images/focus-award.jpg', title: '公司荣获数字化转型优秀企业称号' },
  { id: 2, image: '/images/focus-office.jpg', title: '智慧园区项目顺利通过验收' },
  { id: 3, image: '/images/focus-handshake.jpg', title: '公司与多家企业签署战略合作协议' },
  { id: 4, image: '/images/focus-forum.jpg', title: '年度数字经济发展论坛成功举办' }
])

// 公司动态
const newsList = ref([
  { id: 1, image: '/images/news-meeting-1.jpg', title: '公司召开2025年度工作会议', date: '2024-12-12', summary: '12月12日，公司召开2025年度工作会议，全面总结2024年工作，部署2025年重点任务。' },
  { id: 2, image: '/images/news-conference.jpg', title: '我司在数字经济峰会上获得多项荣誉', date: '2024-12-10', summary: '在第五届数字经济峰会上，我司凭借在智慧城市领域的突出贡献获得多项荣誉。' },
  { id: 3, image: '/images/news-teamwork.jpg', title: '公司荣获"数字化转型优秀企业"称号', date: '2024-12-08', summary: '' },
  { id: 4, image: '/images/news-meeting-2.jpg', title: '智慧园区项目顺利通过验收', date: '2024-12-05', summary: '' },
  { id: 5, image: '/images/news-meeting-1.jpg', title: '公司召开年度战略规划会议', date: '2024-11-28', summary: '' },
  { id: 6, image: '/images/news-conference.jpg', title: '新一代大数据平台正式上线', date: '2024-11-25', summary: '' },
  { id: 7, image: '/images/news-teamwork.jpg', title: '公司与高校共建产学研合作基地', date: '2024-11-20', summary: '' },
  { id: 8, image: '/images/news-meeting-2.jpg', title: '智慧交通解决方案发布会成功举办', date: '2024-11-15', summary: '' }
])

// 公司介绍数据
const aboutItems = ref([
  { icon: '🏢', value: '2018', label: '公司成立于2018年' },
  { icon: '👥', value: '50+', label: '专业技术团队成员' },
  { icon: '📊', value: '100+', label: '成功案例项目' },
  { icon: '🤝', value: '20+', label: '合作伙伴' }
])

// 党建工作
const partyList = ref([
  { id: 10, image: '/images/party-team-activity.jpg', title: '公司党支部开展主题党日活动', date: '2024-12-08' },
  { id: 11, image: '/images/party-volunteer.jpg', title: '党员志愿服务队深入社区开展服务', date: '2024-12-01' },
  { id: 12, image: '/images/party-honor.jpg', title: '公司荣获"先进基层党组织"称号', date: '2024-11-20' },
  { id: 13, image: '/images/party-discussion.jpg', title: '党建引领企业高质量发展座谈会', date: '2024-11-15' }
])

// 轮播控制
const startSlideTimer = () => {
  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
  }, 5000)
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselItems.value.length) % carouselItems.value.length
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
}

const handleCarouselClick = (item) => {
  if (item.link) {
    window.open(item.link, '_blank')
  }
}

// 焦点切换
const nextFocus = () => {
  if (focusIndex.value + 3 >= focusList.value.length) {
    focusIndex.value = 0
  } else {
    focusIndex.value++
  }
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return `${parts[1]}.${parts[2]}`
}

const getMonth = (dateStr) => {
  if (!dateStr) return ''
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  const month = parseInt(dateStr.split('-')[1]) - 1
  return months[month] || ''
}

const getDay = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split('-')[2]
}

// 从API获取数据
onMounted(async () => {
  startSlideTimer()
  
  try {
    const newsRes = await newsApi.getList({ category: 'news', page: 1, pageSize: 8 })
    if (newsRes.data?.list?.length > 0) {
      newsList.value = newsRes.data.list.map(item => ({
        id: item.id,
        image: item.cover_image || '/images/news-1.jpg',
        title: item.title,
        date: item.publish_date?.split('T')[0] || '',
        summary: item.summary || item.content?.substring(0, 100) + '...'
      }))
    }
    
    const partyRes = await newsApi.getList({ category: 'party', page: 1, pageSize: 4 })
    if (partyRes.data?.list?.length > 0) {
      partyList.value = partyRes.data.list.map(item => ({
        id: item.id,
        image: item.cover_image || '/images/party-1.jpg',
        title: item.title,
        date: item.publish_date?.split('T')[0] || ''
      }))
    }
  } catch (error) {
    console.log('使用默认数据展示')
  }
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})
</script>

<style scoped>
.home-page {
  background: #f8f8f8;
  position: relative;
}

.home-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/images/banner-smart-city.jpg') center/cover no-repeat fixed;
  opacity: 0.08;
  z-index: 0;
  pointer-events: none;
}

.home-page > * {
  position: relative;
  z-index: 1;
}

/* 大型轮播图 */
.title-carousel {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
}

.carousel-list {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-list .item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  cursor: pointer;
}

.carousel-list .item.active {
  opacity: 1;
}

.carousel-list .big-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-list .title-text {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 60px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.carousel-list .title-l {
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.carousel-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.3s;
}

.carousel-dots span.active {
  background: #fff;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 80px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
  z-index: 10;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.5);
}

.carousel-arrow.prev {
  left: 0;
}

.carousel-arrow.next {
  right: 0;
}

/* 焦点新闻区 */
.focus-section {
  max-width: 1360px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 30px;
  position: relative;
}

.focus-section > .focus-side-title {
  background: #3E87C7 !important;
  color: #fff !important;
  padding: 30px 20px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  writing-mode: horizontal-tb !important;
  width: 80px !important;
}

.focus-section > .focus-side-title .main-title {
  font-size: 22px !important;
  font-weight: 500 !important;
  letter-spacing: 8px !important;
  writing-mode: vertical-lr !important;
}

.focus-section > .focus-side-title .sub-title {
  font-size: 12px !important;
  opacity: 0.8 !important;
  writing-mode: horizontal-tb !important;
  margin-top: 15px !important;
}


.focus-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 60px;
  gap: 20px;
  flex: 1;
}

.focus-content .news-item {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
}

.focus-section .focus-content .focus-next-btn {
  height: 200px !important;
  background: linear-gradient(135deg, #3E87C7 0%, #2A446E 100%) !important;
  border-radius: 4px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.3s !important;
  box-shadow: 0 4px 15px rgba(11, 94, 178, 0.3) !important;
}

.focus-section .focus-content .focus-next-btn:hover {
  background: linear-gradient(135deg, #2A446E 0%, #3E87C7 100%) !important;
  transform: scale(1.02) !important;
}

.focus-section .focus-content .focus-next-btn .arrow {
  font-size: 60px !important;
  color: #fff !important;
  line-height: 1 !important;
  font-weight: 300 !important;
}

.focus-section .focus-content .focus-next-btn .text {
  font-size: 14px !important;
  color: #fff !important;
  margin-top: 8px !important;
  letter-spacing: 2px !important;
}

.focus-content .news-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s;
}

.focus-content .news-item:hover .news-img {
  transform: scale(1.05);
}

.focus-content .text-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.focus-content .title-l {
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 公司动态区 */
.news-section {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: flex;
  gap: 30px;
}

.news-wrapper {
  flex: 1;
  background: #fff;
  padding: 70px 30px 30px 80px;
  position: relative;
}

.news-side-title {
  writing-mode: vertical-lr;
  background: #3E87C7;
  color: #fff;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  
  &::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: -20px;
    top: 0;
    border-style: solid;
    border-color: #3E87C7 transparent transparent transparent;
    border-width: 50px 20px 0px 20px;
    transform: scaleY(-1);
  }
}

.news-side-title .main-title {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 4px;
}

.news-side-title .sub-title {
  font-size: 12px;
  opacity: 0.8;
  writing-mode: horizontal-tb;
}

.intro-side-title,
.party-side-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
}

.intro-side-title .main-title,
.party-side-title .main-title {
  font-size: 24px;
  color: #333;
  font-weight: 500;
}

.intro-side-title .sub-title,
.party-side-title .sub-title {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
}

.show-more,
.show-more-intro,
.show-more-party {
  position: absolute;
  top: 30px;
  right: 30px;
}

.show-more a,
.show-more-intro a,
.show-more-party a {
  color: #3E87C7;
  font-size: 14px;
  text-decoration: none;
}

.show-more a:hover,
.show-more-intro a:hover,
.show-more-party a:hover {
  text-decoration: underline;
}

.icon-arrow {
  font-weight: bold;
}

.news-content {
  display: flex;
  gap: 30px;
}

.single-list {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-single {
  display: block;
  text-decoration: none;
}

.news-single .img {
  width: 100%;
  height: 160px;
  background-size: cover;
  background-position: center;
  margin-bottom: 12px;
}

.news-single .title-part .title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-single .desc {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-single:hover .title {
  color: #3E87C7;
}

.news-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-list .news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
  text-decoration: none;
}

.news-list .news-item .desc {
  flex: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 20px;
}

.news-list .news-item .time {
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
}

.news-list .news-item:hover .desc {
  color: #3E87C7;
}

.news-list .more {
  display: block;
  text-align: right;
  margin-top: 15px;
  color: #3E87C7;
  font-size: 14px;
  text-decoration: none;
}

/* 公司介绍区 */
.intro-wrapper {
  flex: 0 0 360px;
  background: linear-gradient(135deg, #3E87C7 0%, #2A446E 100%);
  padding: 30px;
  color: #fff;
  position: relative;
}

.intro-side-title .main-title,
.intro-side-title .sub-title {
  color: #fff;
}

.intro-side-title .sub-title {
  opacity: 0.7;
}

.show-more-intro a {
  color: #fff;
}

.intro-content {
  margin-bottom: 20px;
}

.intro-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.intro-items .item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.intro-items .item img {
  width: 40px;
  height: 40px;
}

.intro-items .item .number {
  font-size: 24px;
  font-weight: 600;
  display: block;
}

.intro-items .item p {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.intro-desc p {
  font-size: 14px;
  line-height: 1.8;
  opacity: 0.9;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.quick-links .link-item {
  display: block;
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  text-decoration: none;
  transition: background 0.3s;
}

.quick-links .link-item:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 公司介绍区 - 新版 */
.home-about-zone {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.home-about-box {
  background: #fff;
  position: relative;
}

/* 公司介绍区 */
.about-section {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.about-wrapper {
  background: #fff;
  padding: 30px 30px 30px 90px;
  position: relative;
}

.about-section .about-side-title {
  writing-mode: vertical-lr;
  background: #3E87C7;
  color: #fff;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.about-section .about-side-title .main-title {
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 4px;
}

.about-section .about-side-title .sub-title {
  font-size: 12px;
  opacity: 0.8;
  writing-mode: horizontal-tb;
}

.show-more-about {
  position: absolute;
  top: 30px;
  right: 30px;
}

.show-more-about a {
  color: #3E87C7;
  font-size: 14px;
  text-decoration: none;
}

.about-content {
  display: flex;
  gap: 30px;
}

.about-main {
  flex: 1;
  display: flex;
  gap: 20px;
}

.about-main .about-img {
  width: 300px;
  height: 200px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.about-main .about-info {
  flex: 1;
}

.about-main .about-info h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.about-main .about-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.about-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 150px;
}

.about-items .about-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: #f5f5f5;
  text-decoration: none;
  transition: all 0.3s;
}

.about-items .about-item:hover {
  background: #3E87C7;
  color: #fff;
}

.about-items .about-item .icon {
  font-size: 18px;
}

.about-items .about-item .text {
  font-size: 14px;
  color: #333;
}

.about-items .about-item:hover .text {
  color: #fff;
}

/* 党建工作区 */
.party-section {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px 40px;
  background: #fff;
  position: relative;
}

.party-section::before {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  top: 0;
  height: 4px;
  background: linear-gradient(90deg, #c41e3a, #ff6b6b);
}

.party-side-title {
  padding-top: 30px;
}

.party-side-title .main-title {
  color: #c41e3a;
}

.show-more-party {
  top: 30px;
}

.show-more-party a {
  color: #c41e3a;
}

.party-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-top: 20px;
}

.party-item {
  display: block;
  text-decoration: none;
  background: #fff;
  border: 1px solid #eee;
  transition: box-shadow 0.3s, transform 0.3s;
}

.party-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.party-img {
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
}

.party-info {
  display: flex;
  padding: 15px;
  gap: 15px;
}

.party-info .time {
  flex-shrink: 0;
  text-align: center;
  padding: 8px 12px;
  background: #c41e3a;
  color: #fff;
}

.party-info .time .month {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
}

.party-info .time .day {
  display: block;
  font-size: 20px;
  font-weight: 600;
}

.party-info .info .title {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.party-item:hover .info .title {
  color: #c41e3a;
}

/* 底部宣传图 */
.banner-images {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.banner-images img {
  width: 100%;
  height: auto;
}

/* 响应式 */
@media (max-width: 1200px) {
  .focus-content {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .news-section {
    flex-direction: column;
  }
  
  .intro-wrapper {
    flex: none;
  }
  
  .party-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .title-carousel {
    height: 300px;
  }
  
  .carousel-list .title-l {
    font-size: 20px;
  }
  
  .focus-section {
    flex-direction: column;
  }
  
  .focus-side-title {
    writing-mode: horizontal-tb;
    flex-direction: row;
  }
  
  .focus-content {
    grid-template-columns: 1fr;
  }
  
  .news-content {
    flex-direction: column;
  }
  
  .single-list {
    flex: none;
  }
  
  .party-content {
    grid-template-columns: 1fr;
  }
}
</style>
