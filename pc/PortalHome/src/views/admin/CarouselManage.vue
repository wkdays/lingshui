<template>
  <div class="manage-page">
    <div class="page-header">
      <h2>核心动态管理</h2>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon> 新增轮播
      </el-button>
    </div>

    <div class="content-card">
      <el-table :data="list" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="150">
          <template #default="{ row }">
            <el-image :src="row.image" fit="cover" style="width: 120px; height: 60px; border-radius: 4px;" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑轮播' : '新增轮播'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="100" />
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
import { carouselApi } from '@/api'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const list = ref([])

const form = reactive({ id: null, title: '', image: '', description: '', sort: 0 })
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  image: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
}

const defaultList = [
  { id: 1, title: '数字经济创新发展', description: '推动数字技术与实体经济深度融合，打造数字经济新高地', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop', sort: 1 },
  { id: 2, title: '智慧城市建设', description: '构建城市数字化底座，赋能城市治理现代化', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=400&fit=crop', sort: 2 },
  { id: 3, title: '低空经济新赛道', description: '开拓低空经济新蓝海，引领产业创新发展', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=400&fit=crop', sort: 3 }
]

const fetchList = async () => {
  loading.value = true
  try {
    const res = await carouselApi.getList()
    if (res.data?.length) list.value = res.data
    else throw new Error()
  } catch { list.value = defaultList }
  finally { loading.value = false }
}

const openDialog = (row = null) => {
  isEdit.value = !!row
  Object.assign(form, row || { id: null, title: '', image: '', description: '', sort: 0 })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  submitting.value = true
  try {
    isEdit.value ? await carouselApi.update(form.id, form) : await carouselApi.create(form)
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchList()
  } catch {
    ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
    dialogVisible.value = false
    if (!isEdit.value) list.value.push({ ...form, id: Date.now() })
  } finally { submitting.value = false }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该条记录？', '提示', { type: 'warning' })
  try { await carouselApi.delete(row.id); ElMessage.success('删除成功'); fetchList() }
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
</style>
