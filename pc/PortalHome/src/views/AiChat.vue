<template>
  <div class="ai-chat-page">
    <!-- 返回按钮 -->
    <div class="back-btn" @click="goBack">
      <el-icon><ArrowLeft /></el-icon>
      <span>返回</span>
    </div>
    
    <div class="chat-container">
      <!-- 欢迎标题 -->
      <div class="welcome-section">
        <div class="welcome-icon">
          <el-icon :size="48"><ChatLineRound /></el-icon>
        </div>
        <h1 class="welcome-title">{{ pageTitle }}</h1>
        <p class="welcome-subtitle">{{ pageSubtitle }}</p>
      </div>

      <!-- 输入框区域 -->
      <div class="input-box">
        <div class="input-wrapper">
          <textarea 
            v-model="inputText" 
            placeholder="发送消息..."
            @keyup.enter.exact="sendMessage"
            rows="1"
            ref="inputRef"
          ></textarea>
        </div>
        <div class="input-toolbar">
          <div class="toolbar-left">
            <span class="tool-btn">
              <el-icon><Search /></el-icon>
              <span>深度思考</span>
            </span>
            <span class="tool-btn">
              <el-icon><Connection /></el-icon>
              <span>联网搜索</span>
            </span>
          </div>
          <div class="toolbar-right">
            <el-icon class="attach-btn"><Paperclip /></el-icon>
            <button 
              class="send-btn" 
              :class="{ active: inputText.trim() }"
              @click="sendMessage"
              :disabled="!inputText.trim()"
            >
              <el-icon><Top /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChatLineRound, Top, Search, Connection, Paperclip, ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const inputText = ref('')
const inputRef = ref(null)

const categoryMap = {
  culture: '数字文创',
  logistics: '数字物流',
  media: '影视短剧',
  crossborder: '跨境电商'
}

const stageMap = {
  consult: '事前咨询',
  apply: '事中申报',
  review: '事后复查'
}

const pageTitle = computed(() => {
  const category = categoryMap[route.query.category]
  const stage = stageMap[route.query.stage]
  if (category && stage) {
    return `${category} · ${stage}`
  }
  return category || stage || '智能助手'
})

const pageSubtitle = computed(() => {
  return '数字文化出海一站式服务平台，为您提供专业咨询服务'
})

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'instant' })
  inputRef.value?.focus()
})

const goBack = () => {
  router.back()
}

const sendMessage = () => {
  if (!inputText.value.trim()) return
  console.log('发送消息:', inputText.value)
  inputText.value = ''
}
</script>

<style lang="scss" scoped>
.ai-chat-page {
  min-height: calc(100vh - 70px);
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  position: relative;
}

.back-btn {
  position: fixed;
  top: 90px;
  left: 40px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #fff;
  border: 1px solid #e8eef3;
  border-radius: 20px;
  color: #3E87C7;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  &:hover {
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    color: #fff;
    border-color: transparent;
    box-shadow: 0 4px 12px rgba(62, 135, 199, 0.3);
  }
}

.chat-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
}

.welcome-section {
  text-align: center;
  
  .welcome-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 8px 24px rgba(62, 135, 199, 0.3);
  }
}

.welcome-title {
  font-size: 36px;
  font-weight: 600;
  color: #2A446E;
  margin: 0 0 12px;
}

.welcome-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.input-box {
  width: 100%;
  background: #fff;
  border: 2px solid #e8eef3;
  border-radius: 24px;
  padding: 24px 28px 18px;
  box-shadow: 0 8px 30px rgba(42, 68, 110, 0.08);
  transition: all 0.3s;
  
  &:focus-within {
    border-color: #3E87C7;
    box-shadow: 0 8px 40px rgba(62, 135, 199, 0.18);
  }
}

.input-wrapper {
  textarea {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    line-height: 1.6;
    resize: none;
    min-height: 28px;
    max-height: 150px;
    font-family: inherit;
    color: #1a1a1a;
    
    &::placeholder {
      color: #9ca3af;
    }
  }
}

.input-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(62, 135, 199, 0.08), rgba(42, 68, 110, 0.05));
  border-radius: 20px;
  font-size: 13px;
  color: #3E87C7;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  
  &:hover {
    background: linear-gradient(135deg, rgba(62, 135, 199, 0.15), rgba(42, 68, 110, 0.1));
    color: #2A446E;
  }
  
  .el-icon {
    font-size: 14px;
  }
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.attach-btn {
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #6b7280;
  }
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #e8eef3;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  
  &.active {
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    color: #fff;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(62, 135, 199, 0.4);
    }
  }
  
  &:disabled {
    cursor: not-allowed;
  }
}
</style>
