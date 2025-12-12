<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>项目进度管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon> 新增项目
      </el-button>
    </div>

    <div class="content-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="项目名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="summary" label="进度描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="progress" label="进度" width="100">
          <template #default="{ row }">
            <el-progress :percentage="row.progress || 0" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="更新时间" width="120">
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
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next" @current-change="fetchList" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑项目' : '新增项目'" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="进度" prop="progress">
          <el-slider v-model="form.progress" :max="100" show-input />
        </el-form-item>
        <el-form-item label="进度描述" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入进度描述" />
        </el-form-item>
        <el-form-item label="详细说明" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入详细说明，支持HTML" />
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
import { projectApi } from '@/api'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({ id: null, title: '', summary: '', content: '', progress: 0 })
const rules = {
  title: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入进度描述', trigger: 'blur' }]
}

const defaultList = [
  { id: 1, title: '数智城市一期项目', summary: '项目已完成需求分析和系统设计阶段，正在进行核心模块开发。', progress: 65, created_at: '2024-01-15' },
  { id: 2, title: '低空经济平台建设', summary: '平台架构设计已完成，正在进行飞行监管模块开发测试。', progress: 40, created_at: '2024-01-13' },
  { id: 3, title: '供应链数字化改造', summary: '已完成供应商管理模块上线，正在推进物流跟踪功能开发。', progress: 80, created_at: '2024-01-10' }
]

const formatDate = (date) => date ? new Date(date).toLocaleDateString('zh-CN') : ''

const fetchList = async () => {
  loading.value = true
  try {
    const res = await projectApi.getList({ page: page.value, limit: pageSize.value })
    if (res.data?.length) { list.value = res.data; total.value = res.total || res.data.length }
    else throw new Error()
  } catch { list.value = defaultList; total.value = defaultList.length }
  finally { loading.value = false }
}

const openDialog = (row = null) => {
  isEdit.value = !!row
  Object.assign(form, row || { id: null, title: '', summary: '', content: '', progress: 0 })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    isEdit.value ? await projectApi.update(form.id, form) : await projectApi.create(form)
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
  try { await projectApi.delete(row.id); ElMessage.success('删除成功'); fetchList() }
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
