<template>
  <view class="page">
    <view class="header">
      <text class="title">轮播图管理</text>
      <view class="add-btn" @click="showAdd">+ 新增</view>
    </view>

    <view v-for="item in list" :key="item.id" class="card">
      <image v-if="item.imageUrl" class="banner-preview" :src="item.imageUrl" mode="aspectFill" />
      <view v-else class="banner-preview gradient" :style="{ background: `linear-gradient(90deg, ${item.gradient ? item.gradient[0] : '#3a7bff'}, ${item.gradient ? item.gradient[1] : '#3a9dff'})` }">
        <text class="preview-title">{{ item.title }}</text>
      </view>
      <view class="info">
        <view class="name">{{ item.title }}</view>
        <view class="desc">{{ item.desc }}</view>
        <view class="link" v-if="item.link">跳转：{{ item.link }}</view>
      </view>
      <view class="actions">
        <view class="btn edit" @click="editItem(item)">编辑</view>
        <view class="btn delete" @click="deleteItem(item)">删除</view>
      </view>
    </view>

    <view v-if="list.length === 0" class="empty">暂无轮播图</view>

    <!-- 编辑弹窗 -->
    <view v-if="showModal" class="modal-mask" @click="closeModal">
      <view class="modal" @click.stop>
        <view class="modal-title">{{ isEdit ? '编辑轮播图' : '新增轮播图' }}</view>
        <view class="field">
          <text class="label">标题</text>
          <input v-model="form.title" placeholder="请输入标题" />
        </view>
        <view class="field">
          <text class="label">描述</text>
          <input v-model="form.desc" placeholder="请输入描述" />
        </view>
        <view class="field">
          <text class="label">图片地址</text>
          <input v-model="form.imageUrl" placeholder="请输入图片URL或本地路径" />
        </view>
        <view class="field">
          <text class="label">跳转链接</text>
          <input v-model="form.link" placeholder="点击跳转的页面路径" />
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
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from '../../mock/api'

export default {
  data() {
    return {
      list: [],
      showModal: false,
      isEdit: false,
      form: {
        id: '',
        title: '',
        desc: '',
        imageUrl: '',
        link: '',
      },
    }
  },
  async onShow() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const res = await adminGetBanners()
      this.list = res.data || []
    },
    showAdd() {
      this.isEdit = false
      this.form = { id: '', title: '', desc: '', imageUrl: '', link: '' }
      this.showModal = true
    },
    editItem(item) {
      this.isEdit = true
      this.form = { ...item }
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
      if (this.isEdit) {
        await adminUpdateBanner(this.form.id, this.form)
        uni.showToast({ title: '更新成功', icon: 'success' })
      } else {
        await adminCreateBanner(this.form)
        uni.showToast({ title: '创建成功', icon: 'success' })
      }
      this.closeModal()
      await this.loadData()
    },
    deleteItem(item) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除「${item.title}」吗？`,
        success: async (res) => {
          if (res.confirm) {
            await adminDeleteBanner(item.id)
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

.banner-preview {
  width: 100%;
  height: 160rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
}

.banner-preview.gradient {
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-title {
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
}

.info {
  margin-bottom: 12rpx;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f2430;
}

.desc {
  font-size: 26rpx;
  color: #7a8299;
  margin-top: 6rpx;
}

.link {
  font-size: 24rpx;
  color: #2f6dff;
  margin-top: 6rpx;
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

.btn.edit {
  background: #e6f0ff;
  color: #2f6dff;
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

input {
  width: 100%;
  background: #f5f7fb;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
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
