<template>
  <div>
    <nav class="top-nav">
      <div class="link-container">
        <router-link class="index" to="/" title="数字经济门户">
          <span class="icon_logo_home" title="数字经济门户">数字经济</span>
        </router-link>
        <div class="drop-down"><span class="middle-h"></span></div>
        <ul class="link-list">
          <li v-for="item in menuItems" :key="item.path">
            <router-link class="first-level for-pc" :to="item.path" :exact="item.path === '/'">{{ item.name }}</router-link>
            <ul v-if="item.children" class="sub-drop-down">
              <li v-for="child in item.children" :key="child.path">
                <router-link :to="child.path">{{ child.name }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="btn-container">
        <div class="content">
          <div class="search-wrapper">
            <span class="icon_search_gray"></span>
            <input id="SearchInput" placeholder="站内搜索" />
          </div>
          <div class="language-wrapper">
            <span><router-link to="/admin/login">管理</router-link></span>
            <span class="icon_search"></span>
          </div>
        </div>
      </div>
      <div class="bottom-parallelogram"></div>
    </nav>
    
    <main>
      <router-view />
    </main>
    
    <footer class="modern-footer">
      <div class="footer-top-line"></div>
      <div class="footer-main">
        <div class="footer-container">
          <div class="footer-grid">
            <!-- 品牌区 -->
            <div class="footer-brand">
              <div class="brand-logo">
                <router-link to="/">
                  <span class="logo-text">数字经济</span>
                  <span class="logo-sub">DIGITAL ECONOMY PORTAL</span>
                </router-link>
              </div>
              <p class="brand-slogan">创新驱动发展 · 科技赋能未来</p>
              <div class="brand-contact">
                <div class="contact-item">
                  <span class="contact-icon">📍</span>
                  <span>数字经济产业园区</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">📞</span>
                  <span>400-888-8888</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">✉️</span>
                  <span>contact@portal.com</span>
                </div>
              </div>
            </div>
            
            <!-- 快速导航 -->
            <div class="footer-nav">
              <h4 class="footer-title">关于我们</h4>
              <div class="nav-links">
                <router-link to="/about">公司简介</router-link>
                <router-link to="/about?tab=team">人员风采</router-link>
                <router-link to="/business">业务介绍</router-link>
              </div>
            </div>
            
            <div class="footer-nav">
              <h4 class="footer-title">新闻资讯</h4>
              <div class="nav-links">
                <router-link to="/news">公司动态</router-link>
                <router-link to="/news?tab=party">党建工作</router-link>
                <router-link to="/news?tab=project">项目案例</router-link>
              </div>
            </div>
            
            <div class="footer-nav">
              <h4 class="footer-title">服务支持</h4>
              <div class="nav-links">
                <router-link to="/service">一站式服务</router-link>
                <router-link to="/news?tab=bidding">招标公告</router-link>
                <router-link to="/">联系我们</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-container">
          <div class="bottom-content">
            <div class="copyright">
              <span>© 2025 数字经济门户 版权所有</span>
            </div>
            <div class="bottom-links">
              <router-link to="/">隐私政策</router-link>
              <router-link to="/">使用条款</router-link>
              <router-link to="/">网站地图</router-link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const menuItems = [
  { name: '首页', path: '/' },
  { 
    name: '公司动态', 
    path: '/news',
    children: [
      { name: '新闻动态', path: '/news?tab=news' },
      { name: '招标公告', path: '/news?tab=bidding' },
      { name: '项目进度', path: '/news?tab=project' },
      { name: '党建工作', path: '/news?tab=party' }
    ]
  },
  { 
    name: '公司介绍', 
    path: '/about',
    children: [
      { name: '公司简介', path: '/about' },
      { name: '人员风采', path: '/about?tab=team' }
    ]
  },
  { name: '业务介绍', path: '/business' },
  { name: '一站式服务', path: '/service' }
]
</script>

<style scoped>
.icon_logo_home {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #3E87C7;
  letter-spacing: 2px;
}

/* 现代化底部样式 */
.modern-footer {
  background: linear-gradient(135deg, #2A446E 0%, #2A446E 50%, #2A446E 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
}

.modern-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(62, 135, 199, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(62, 135, 199, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.footer-top-line {
  height: 4px;
  background: linear-gradient(90deg, #3E87C7 0%, #9EB7CC 30%, #9EB7CC 70%, #3E87C7 100%);
}

.footer-main {
  padding: 60px 0 50px;
  position: relative;
  z-index: 1;
}

.footer-container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 50px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 60px;
}

/* 品牌区 */
.footer-brand .brand-logo a {
  display: flex;
  flex-direction: column;
  text-decoration: none;
}

.footer-brand .logo-text {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #fff 0%, #9EB7CC 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-brand .logo-sub {
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.4);
  margin-top: 6px;
}

.footer-brand .brand-slogan {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin: 25px 0;
  padding-left: 15px;
  border-left: 3px solid #3E87C7;
  line-height: 1.8;
}

.footer-brand .brand-contact {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-brand .contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  transition: color 0.3s;
}

.footer-brand .contact-item:hover {
  color: #9EB7CC;
}

.footer-brand .contact-icon {
  font-size: 16px;
  width: 22px;
  text-align: center;
}

/* 导航栏区 */
.footer-nav .footer-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 14px;
}

.footer-nav .footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #3E87C7, #9EB7CC);
  border-radius: 1px;
}

.footer-nav .nav-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-nav .nav-links a {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  padding-left: 0;
}

.footer-nav .nav-links a::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #3E87C7;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.footer-nav .nav-links a:hover {
  color: #9EB7CC;
  padding-left: 10px;
}

.footer-nav .nav-links a:hover::before {
  opacity: 1;
}

/* 底部版权区 */
.footer-bottom {
  background: rgba(0,0,0,0.25);
  padding: 22px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  position: relative;
  z-index: 1;
}

.footer-bottom .bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom .copyright {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
}

.footer-bottom .copyright .separator {
  margin: 0 15px;
  color: rgba(255,255,255,0.2);
}

.footer-bottom .bottom-links {
  display: flex;
  gap: 28px;
}

.footer-bottom .bottom-links a {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-bottom .bottom-links a:hover {
  color: rgba(255,255,255,0.85);
}

/* 响应式 */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .footer-container {
    padding: 0 30px;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 35px;
  }
  
  .footer-main {
    padding: 40px 0 35px;
  }
  
  .footer-bottom .bottom-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .footer-bottom .bottom-links {
    gap: 20px;
  }
}
</style>

<style>
/* 修复导航文字垂直居中 */
.top-nav .link-list > li > .first-level.for-pc {
  line-height: 54px !important;
  position: relative;
  top: -7px;
}

/* 数字经济位置调整 */
.top-nav .index .icon_logo_home {
  position: relative;
  top: -1px;
}

/* 隐藏绿条 */
.top-nav .bottom-parallelogram {
  display: none !important;
}

/* 隐藏管理和搜索 */
.top-nav .btn-container {
  display: none !important;
}

/* 隐藏公司介绍区块 */
.intro-wrapper {
  display: none !important;
}

/* 导航选中状态样式 - 只使用精确匹配 */
.top-nav .link-list > li > a.router-link-exact-active {
  color: #3E87C7 !important;
  font-weight: 600 !important;
}

.top-nav .link-list > li > a.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: #3E87C7;
  border-radius: 2px;
}
</style>
