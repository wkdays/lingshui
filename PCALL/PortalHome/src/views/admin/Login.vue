<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <el-icon :size="48" color="#3E87C7"><OfficeBuilding /></el-icon>
        <h1>后台管理系统</h1>
        <p>数字经济门户网站管理平台</p>
      </div>
      
      <el-form 
        ref="formRef" 
        :model="form" 
        :rules="rules" 
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading"
            class="login-btn"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-tips">
        <p>默认账号: admin / admin</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  await formRef.value?.validate()
  
  loading.value = true
  try {
    const res = await authApi.login(form)
    if (res.token) {
      localStorage.setItem('admin_token', res.token)
      localStorage.setItem('admin_username', form.username)
      ElMessage.success('登录成功')
      router.push('/admin/dashboard')
    }
  } catch (e) {
    // 模拟登录 - 当后端未启动时
    if (form.username === 'admin' && form.password === 'admin') {
      localStorage.setItem('admin_token', 'mock_token_' + Date.now())
      localStorage.setItem('admin_username', form.username)
      ElMessage.success('登录成功')
      router.push('/admin/dashboard')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2A446E 0%, #3E87C7 50%, #9EB7CC 100%);
}

.login-container {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
  
  h1 {
    font-size: 24px;
    color: #2A446E;
    margin: 16px 0 8px;
  }
  
  p {
    font-size: 14px;
    color: #999;
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }
  
  .login-btn {
    width: 100%;
    background: linear-gradient(135deg, #3E87C7, #2A446E);
    border: none;
    
    &:hover {
      background: linear-gradient(135deg, #2A446E, #3E87C7);
    }
  }
}

.login-tips {
  text-align: center;
  margin-top: 20px;
  
  p {
    font-size: 12px;
    color: #999;
  }
}
</style>
