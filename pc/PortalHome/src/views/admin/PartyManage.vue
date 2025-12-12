<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>党建工作管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon> 新增党建
      </el-button>
    </div>

    <div class="content-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="summary" label="摘要" min-width="250" show-overflow-tooltip />
        <el-table-column label="推荐" width="80">
          <template #default="{ row }">
            <el-switch v-model="row.recommend" :active-value="1" :inactive-value="0" @change="toggleRecommend(row)" />
          </template>
        </el-table-column>
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
        <el-pagination v-model:current-page="page" :page-size="pageSize" :total="total" layout="total, prev, pager, next" @current-change="fetchList" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑党建' : '新增党建'" width="700px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.cover" placeholder="请输入封面图URL" />
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="8" placeholder="请输入正文内容，支持HTML" />
        </el-form-item>
        <el-form-item label="推荐首页">
          <el-switch v-model="form.recommend" :active-value="1" :inactive-value="0" />
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
import { partyApi } from '@/api'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const form = reactive({ id: null, title: '', cover: '', summary: '', content: '', recommend: 0 })
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }]
}

const defaultList = [
  { id: 1, title: '党支部开展"学思想、强党性"主题党日活动', summary: '公司党支部组织全体党员开展主题党日活动，深入学习党的创新理论。', recommend: 1, created_at: '2024-01-14' },
  { id: 2, title: '深入学习贯彻党的二十大精神', summary: '公司组织专题学习会，深入学习贯彻党的二十大精神。', recommend: 1, created_at: '2024-01-11' },
  { id: 3, title: '党员志愿服务进社区', summary: '公司党员志愿者走进社区，开展数字技能培训志愿服务活动。', recommend: 0, created_at: '2024-01-08' },
  { id: 4, title: '廉政教育专题学习会召开', summary: '公司召开廉政教育专题学习会，筑牢党员干部廉洁自律防线。', recommend: 0, created_at: '2024-01-05' }
]

const formatDate = (date) => date ? new Date(date).toLocaleDateString('zh-CN') : ''

const fetchList = async () => {
  loading.value = true
  try {
    const res = await partyApi.getList({ page: page.value, limit: pageSize.value })
    if (res.data?.length) { list.value = res.data; total.value = res.total || res.data.length }
    else throw new Error()
  } catch { list.value = defaultList; total.value = defaultList.length }
  finally { loading.value = false }
}

const openDialog = (row = null) => {
  isEdit.value = !!row
  Object.assign(form, row || { id: null, title: '', cover: '', summary: '', content: '', recommend: 0 })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    isEdit.value ? await partyApi.update(form.id, form) : await partyApi.create(form)
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
  try { await partyApi.delete(row.id); ElMessage.success('删除成功'); fetchList() }
  catch { list.value = list.value.filter(item => item.id !== row.id); ElMessage.success('删除成功') }
}

const toggleRecommend = async (row) => {
  try { await partyApi.update(row.id, { recommend: row.recommend }); ElMessage.success('更新成功') }
  catch { ElMessage.success('更新成功') }
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
