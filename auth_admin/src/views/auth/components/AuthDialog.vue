<script setup>
import { ref, computed } from 'vue'
import { authAddService, authUpdateService } from '@/api/auth.js'
import { dayjs } from 'element-plus'
const emit = defineEmits(['success'])

const openAuthDialog = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}


const dialogVisible = ref(false)
// 表单实例
const ruleFormRef = ref()
// 表单model
const formModel = ref({
  id: 0,
  deviceCode: '',
  tokenCode: '',
  expiryTime: 0,
  isBanned: 0,
  extra_info: ''
})
// 表单验证规则
const rules = {
  deviceCode: [
    { required: true, message: '设备码不能为空', trigger: 'blur' },
    { min: 10, max: 40, message: 'Length should be 10 to 40', trigger: 'blur' }
  ],
  tokenCode: [
    { required: true, message: '授权码不能为空', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' }
  ],
  expiryTime: [{ required: true, message: '到期时间不能为空', trigger: 'blur' }]
}
// 重置表单
const onResetFrom = () => {
  if (!ruleFormRef.value) {
    return
  }
  dialogVisible.value = false
  ruleFormRef.value.clearValidate()
}

// id是否存在来判断 是更新还是添加窗口
const isUpdate = computed(() => formModel.value.id > 0)
const onUpdateCategory = async (isUpdate) => {
  await ruleFormRef.value.validate()
  // 转为毫秒时间戳
  formModel.value.expiryTime = dayjs(formModel.value.expiryTime).valueOf()
  const service = isUpdate ? authUpdateService : authAddService
  const res = await service(formModel.value)
  ElMessage.success(res.data.message)
  emit('success')
  onResetFrom()
}

defineExpose({
  openAuthDialog
})
</script>
<template>
  <el-dialog
    @close="onResetFrom"
    v-model="dialogVisible"
    :title="isUpdate ? '编辑授权' : '添加授权'"
    width="30%"
  >
    <el-form
      ref="ruleFormRef"
      :model="formModel"
      :rules="rules"
      label-width="100px"
      style="padding-right: 30px"
    >
      <el-form-item label="设备码" prop="deviceCode">
        <el-input v-model="formModel.deviceCode" placeholder="请输入设备码"></el-input>
      </el-form-item>
      <el-form-item label="授权码" prop="tokenCode">
        <el-input v-model="formModel.tokenCode" placeholder="请输入授权码"></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="expiryTime">
        <el-date-picker
          v-model="formModel.expiryTime"
          type="date"
          placeholder="请选择到期时间"
          :size="size"
        />
      </el-form-item>
      <el-form-item label="是否封禁" prop="isBanned">
        <el-switch :active-value="1" :inactive-value="0" v-model="formModel.isBanned" />
      </el-form-item>
      <el-form-item label="备注" prop="extra_info">
        <el-input v-model="formModel.extra_info" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onResetFrom">取消</el-button>
        <el-button type="primary" @click="onUpdateCategory(isUpdate)"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
