<template>
  <div class="page-card">
    <div class="page-header">
      <span class="page-title">新闻动态管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增新闻
      </el-button>
    </div>
    
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column prop="cover" label="封面" width="100">
        <template #default="{ row }">
          <img v-if="row.cover" :src="row.cover" class="cover-preview" />
        </template>
      </el-table-column>
      <el-table-column prop="recommend" label="首页推荐" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.recommend" type="primary" size="small">推荐</el-tag>
          <el-tag v-else type="info" size="small">普通</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览" width="80" />
      <el-table-column prop="created_at" label="发布时间" width="120">
        <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="warning" link @click="handleToggleRecommend(row)">
            {{ row.recommend ? '取消推荐' : '推荐' }}
          </el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      @change="loadList"
    />
    
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑新闻' : '新增新闻'" width="900px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="封面图">
          <div class="upload-cover">
            <el-upload
              :show-file-list="false"
              :http-request="handleUpload"
              accept="image/*"
            >
              <img v-if="form.cover" :src="form.cover" class="cover-image" />
              <div v-else class="upload-icon">
                <el-icon><Plus /></el-icon>
                <span>上传封面</span>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="正文内容" prop="content">
          <div class="editor-container">
            <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" mode="default" />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              mode="default"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
        <el-form-item label="首页推荐">
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
import { ref, reactive, onMounted, shallowRef, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { newsApi, uploadFile } from '../api'

const loading = ref(false)
const submitting = ref(false)
const list = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const editId = ref(null)

const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入正文内容...' }

const form = reactive({
  title: '',
  cover: '',
  summary: '',
  content: '',
  recommend: 0
})

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }]
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleCreated = (editor) => {
  editorRef.value = editor
}

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})

const loadList = async () => {
  loading.value = true
  try {
    const res = await newsApi.list({ page: page.value, limit: limit.value })
    list.value = res.data
    total.value = res.total
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  isEdit.value = false
  editId.value = null
  Object.assign(form, { title: '', cover: '', summary: '', content: '', recommend: 0 })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  editId.value = row.id
  Object.assign(form, {
    title: row.title,
    cover: row.cover || '',
    summary: row.summary || '',
    content: row.content || '',
    recommend: row.recommend || 0
  })
  dialogVisible.value = true
}

const handleUpload = async ({ file }) => {
  try {
    const res = await uploadFile(file)
    form.cover = res.url
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
      await newsApi.update(editId.value, form)
      ElMessage.success('更新成功')
    } else {
      await newsApi.create(form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    loadList()
  } finally {
    submitting.value = false
  }
}

const handleToggleRecommend = async (row) => {
  await newsApi.update(row.id, { recommend: row.recommend ? 0 : 1 })
  ElMessage.success('操作成功')
  loadList()
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该新闻吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await newsApi.delete(row.id)
    ElMessage.success('删除成功')
    loadList()
  }).catch(() => {})
}

onMounted(loadList)
</script>
