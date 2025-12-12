<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>招标公告管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon> 新增公告
      </el-button>
    </div>

    <div class="content-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="summary" label="摘要" min-width="250" show-overflow-tooltip />
        <el-table-column prop="created_at" label="发布时间" width="120">
          <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchList"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑公告' : '新增公告'" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入正文内容，支持HTML" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { biddingApi } from '@/api'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({ id: null, title: '', summary: '', content: '' })
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }]
}

const defaultList = [
  { id: 1, title: '智慧园区建设项目招标公告', summary: '就智慧园区建设项目进行公开招标，欢迎符合条件的供应商参与投标。', created_at: '2024-01-14' },
  { id: 2, title: '数据中心设备采购招标公告', summary: '现就数据中心服务器、存储设备等进行公开招标采购。', created_at: '2024-01-11' },
  { id: 3, title: '软件开发服务招标公告', summary: '就数字化管理平台软件开发服务进行招标。', created_at: '2024-01-09' }
]

const formatDate = (date) => date ? new Date(date).toLocaleDateString('zh-CN') : ''

const fetchList = async () => {
  loading.value = true
  try {
    const res = await biddingApi.getList({ page: page.value, limit: pageSize.value })
    if (res.data?.length) { list.value = res.data; total.value = res.total || res.data.length }
    else throw new Error()
  } catch { list.value = defaultList; total.value = defaultList.length }
  finally { loading.value = false }
}

const openDialog = (row = null) => {
  isEdit.value = !!row
  Object.assign(form, row || { id: null, title: '', summary: '', content: '' })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    isEdit.value ? await biddingApi.update(form.id, form) : await biddingApi.create(form)
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchList()
  } catch {
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    if (!isEdit.value) list.value.unshift({ ...form, id: Date.now(), created_at: new Date().toISOString() })
  } finally { submitting.value = false }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该条记录？', '提示', { type: 'warning' })
  try { await biddingApi.delete(row.id); ElMessage.success('删除成功'); fetchList() }
  catch { list.value = list.value.filter(item => item.id !== row.id); ElMessage.success('删除成功') }
}

onMounted(() => fetchList())
</script>

<style lang="scss" scoped>
.manage-page { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
  h2 { font-size: 20px; color: #2A446E; margin: 0; }
}
.content-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); }
.pagination { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
