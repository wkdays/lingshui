<template>
  <div class="page-card">
    <div class="page-header">
      <span class="page-title">轮播图管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增轮播图
      </el-button>
    </div>
    
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="标题" min-width="150" />
      <el-table-column prop="image" label="图片" width="120">
        <template #default="{ row }">
          <img v-if="row.image" :src="row.image" class="cover-preview" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑轮播图' : '新增轮播图'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <div class="upload-cover">
            <el-upload
              :show-file-list="false"
              :http-request="handleUpload"
              accept="image/*"
            >
              <img v-if="form.image" :src="form.image" class="cover-image" />
              <div v-else class="upload-icon">
                <el-icon><Plus /></el-icon>
                <span>上传图片</span>
              </div>
            </el-upload>
          </div>
          <div class="form-tip">建议尺寸：1200x400，支持 jpg/png 格式</div>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
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
import { carouselApi, uploadFile } from '../api'

const loading = ref(false)
const submitting = ref(false)
const list = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const editId = ref(null)

const form = reactive({
  title: '',
  image: '',
  description: '',
  sort: 0
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  image: [{ required: true, message: '请上传图片', trigger: 'change' }]
}

const loadList = async () => {
  loading.value = true
  try {
    const res = await carouselApi.list()
    list.value = res.data
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  editId.value = null
  Object.assign(form, { title: '', image: '', description: '', sort: 0 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, {
    title: row.title,
    image: row.image,
    description: row.description,
    sort: row.sort
  })
  dialogVisible.value = true
}

const handleUpload = async ({ file }) => {
  try {
    const res = await uploadFile(file)
    form.image = res.url
    ElMessage.success('上传成功')
  } catch (e) {
    console.error('Upload error:', e)
  }
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (isEdit.value) {
      await carouselApi.update(editId.value, form)
      ElMessage.success('更新成功')
    } else {
      await carouselApi.create(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadList()
  } finally {
    submitting.value = false
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该轮播图吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await carouselApi.delete(row.id)
    ElMessage.success('删除成功')
    loadList()
  }).catch(() => {})
}

onMounted(loadList)
</script>
