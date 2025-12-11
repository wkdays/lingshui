<template>
  <view class="page">
    <view class="card">
      <view class="section-title">基础信息</view>
      <view class="field">
        <text class="label">任务标题</text>
        <input v-model="form.title" placeholder="请输入任务标题" />
      </view>
      <view class="field">
        <text class="label">任务类型</text>
        <radio-group class="radio-group" @change="changeType">
          <label class="radio" v-for="item in typeOptions" :key="item.value">
            <radio :value="item.value" :checked="form.taskType === item.value" />{{ item.label }}
          </label>
        </radio-group>
      </view>
      <view class="field">
        <text class="label">分类</text>
        <input v-model="form.category" placeholder="如：简单关注/注册下载" />
      </view>
    </view>

    <view class="card">
      <view class="section-title">酬劳与时间</view>
      <view class="field">
        <text class="label">单次酬劳(元)</text>
        <input v-model="form.amount" type="number" placeholder="请输入金额" />
      </view>
      <view class="field">
        <text class="label">工作日期/周期</text>
        <input v-model="form.period" placeholder="如：今日结算 / 12月12日前" />
      </view>
      <view class="field">
        <text class="label">截止时间</text>
        <input v-model="form.deadline" placeholder="如：23:59 截止" />
      </view>
    </view>

    <view class="card">
      <view class="section-title">要求</view>
      <view class="field">
        <text class="label">需求人数</text>
        <input v-model="form.peopleNeeded" type="number" placeholder="请输入需求人数" />
      </view>
      <view class="field">
        <text class="label">工作内容</text>
        <textarea v-model="form.content" auto-height placeholder="请填写工作内容、完成标准等" />
      </view>
      <view class="field">
        <text class="label">完成标准</text>
        <textarea v-model="form.standard" auto-height placeholder="例：上传截图、通过审核算完成" />
      </view>
    </view>

    <view class="submit" @click="submit">发布任务</view>
  </view>
</template>

<script>
import { createTask } from '../../mock/api'

export default {
  data() {
    return {
      form: {
        title: '',
        taskType: 'daily',
        category: '',
        amount: '',
        period: '',
        deadline: '',
        peopleNeeded: '',
        content: '',
        standard: '',
      },
      typeOptions: [
        { label: '日结单', value: 'daily' },
        { label: '赏金单', value: 'bounty' },
      ],
    }
  },
  onLoad(query) {
    if (query.type) this.form.taskType = query.type
    if (query.label) this.form.category = query.label
  },
  methods: {
    changeType(e) {
      this.form.taskType = e.detail.value
    },
    async submit() {
      await createTask(this.form)
      uni.showToast({ title: '发布成功 (mock)', icon: 'none' })
      uni.navigateTo({ url: '/pages/task/my-published' })
    },
  },
}
</script>

<style>
.page {
  padding: 16rpx 24rpx 40rpx;
  background: #f5f7fb;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 18rpx;
  padding: 18rpx;
  box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 14rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  margin-bottom: 12rpx;
  color: #1f2430;
}

.field {
  margin-bottom: 16rpx;
}

.label {
  display: block;
  font-size: 24rpx;
  color: #7a8299;
  margin-bottom: 8rpx;
}

input,
textarea {
  width: 100%;
  background: #f5f7fb;
  border-radius: 14rpx;
  padding: 16rpx;
  box-sizing: border-box;
  font-size: 28rpx;
}

textarea {
  min-height: 120rpx;
}

.radio-group {
  display: flex;
  gap: 20rpx;
}

.radio {
  font-size: 26rpx;
  color: #4f5b71;
}

.submit {
  background: linear-gradient(120deg, #2f6dff, #6ca7ff);
  color: #fff;
  text-align: center;
  padding: 18rpx 0;
  border-radius: 26rpx;
  font-size: 32rpx;
  font-weight: 700;
  margin-top: 10rpx;
}
</style>
