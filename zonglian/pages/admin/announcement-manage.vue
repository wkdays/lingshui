<template>
  <view class="page">
    <view class="header">
      <text class="title">公告管理</text>
      <view class="add-btn" @click="showAdd">+ 新增</view>
    </view>

    <view v-for="item in list" :key="item.id" class="card">
      <view class="row">
        <view class="name">{{ item.title }}</view>
        <view class="status" :class="item.status">{{ item.status === 'published' ? '已发布' : '草稿' }}</view>
      </view>
      <view class="content">{{ item.content }}</view>
      <view class="time">{{ item.time }}</view>
      <view class="actions">
        <view class="btn toggle" @click="toggleStatus(item)">
          {{ item.status === 'published' ? '下线' : '发布' }}
        </view>
        <view class="btn edit" @click="editItem(item)">编辑</view>
        <view class="btn delete" @click="deleteItem(item)">删除</view>
      </view>
    </view>

    <view v-if="list.length === 0" class="empty">暂无公告</view>

    <!-- 编辑弹窗 -->
    <view v-if="showModal" class="modal-mask" @click="closeModal">
      <view class="modal" @click.stop>
        <view class="modal-title">{{ isEdit ? '编辑公告' : '新增公告' }}</view>
        <view class="field">
          <text class="label">标题</text>
          <input v-model="form.title" placeholder="请输入公告标题" />
        </view>
        <view class="field">
          <text class="label">内容</text>
          <textarea v-model="form.content" placeholder="请输入公告内容" auto-height />
        </view>
        <view class="modal-actions">
          <view class="btn cancel" @click="closeModal">取消</view>
          <view class="btn confirm" @click="saveItem">保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { 
  adminGetAnnouncements, 
  adminCreateAnnouncement, 
  adminUpdateAnnouncement, 
  adminDeleteAnnouncement,
  adminToggleAnnouncementStatus 
} from '../../mock/api'

export default {
  data() {
    return {
      list: [],
      showModal: false,
      isEdit: false,
      form: {
        id: '',
        title: '',
        content: '',
      },
    }
  },
  async onShow() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const res = await adminGetAnnouncements()
      this.list = res.data || []
    },
    showAdd() {
      this.isEdit = false
      this.form = { id: '', title: '', content: '' }
      this.showModal = true
    },
    editItem(item) {
      this.isEdit = true
      this.form = { id: item.id, title: item.title, content: item.content }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async saveItem() {
      if (!this.form.title) {
        uni.showToast({ title: '请输入标题', icon: 'none' })
        return
      }
      if (!this.form.content) {
        uni.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      if (this.isEdit) {
        await adminUpdateAnnouncement(this.form.id, this.form)
        uni.showToast({ title: '更新成功', icon: 'success' })
      } else {
        await adminCreateAnnouncement(this.form)
        uni.showToast({ title: '创建成功', icon: 'success' })
      }
      this.closeModal()
      await this.loadData()
    },
    async toggleStatus(item) {
      const newStatus = item.status === 'published' ? 'draft' : 'published'
      await adminToggleAnnouncementStatus(item.id, newStatus)
      uni.showToast({ title: newStatus === 'published' ? '已发布' : '已下线', icon: 'success' })
      await this.loadData()
    },
    deleteItem(item) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除公告「${item.title}」吗？`,
        success: async (res) => {
          if (res.confirm) {
            await adminDeleteAnnouncement(item.id)
            uni.showToast({ title: '删除成功', icon: 'success' })
            await this.loadData()
          }
        }
      })
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

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: #1f2430;
}

.add-btn {
  background: #2f6dff;
  color: #fff;
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
  font-size: 26rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 18rpx rgba(0, 0, 0, 0.05);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2430;
  flex: 1;
}

.status {
  padding: 6rpx 14rpx;
  border-radius: 14rpx;
  font-size: 22rpx;
}

.status.published {
  background: #e9f7ef;
  color: #4ad17a;
}

.status.draft {
  background: #f5f7fb;
  color: #7a8299;
}

.content {
  font-size: 26rpx;
  color: #4f5b71;
  line-height: 1.5;
  margin-bottom: 10rpx;
}

.time {
  font-size: 24rpx;
  color: #9aa3b5;
  margin-bottom: 12rpx;
}

.actions {
  display: flex;
  gap: 12rpx;
}

.btn {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  border-radius: 20rpx;
  font-size: 26rpx;
}

.btn.toggle {
  background: #e6f0ff;
  color: #2f6dff;
}

.btn.edit {
  background: #fdf2e6;
  color: #fa8c43;
}

.btn.delete {
  background: #ffece6;
  color: #ff6b6b;
}

.empty {
  text-align: center;
  color: #7a8299;
  padding: 60rpx 0;
  font-size: 28rpx;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24rpx;
}

.field {
  margin-bottom: 20rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #7a8299;
  margin-bottom: 8rpx;
}

input, textarea {
  width: 100%;
  background: #f5f7fb;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

textarea {
  min-height: 120rpx;
}

.modal-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.btn.cancel {
  background: #f5f7fb;
  color: #7a8299;
}

.btn.confirm {
  background: #2f6dff;
  color: #fff;
}
</style>
