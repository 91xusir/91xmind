<script setup>
import { ref, onMounted } from 'vue'
import { Delete, Edit, CopyDocument, Notebook } from '@element-plus/icons-vue'
import { tokenPageListService, tokenDeleteService, tokenQuaryListService } from '@/api/token.js'
import TokenLogsDialog from './components/TokenLogsDialog.vue'
import BatchEditDialog from './components/BatchEditDialog.vue'
import TokenEditDialog from './components/TokenEditDialog.vue'
// 初始化
onMounted( async () => {
   await onPageChange()
})

//子组件实例
const tokenLogsDialog = ref()
const batchEditDialog = ref()
const tokenEditDialog = ref()

//表格数据
const tokenTableData = ref([])
//表格加载动画
const tableLoading = ref(true)

//分页数据
const page = ref({
  total: 0,
  pageSize: 10,
  currentPage: 1
})

//查询
const queryData = ref({
  tokenCode: ''
})
const onQueryData = async () => {
  if (!queryData.value.tokenCode) return
  const res = await tokenQuaryListService(queryData.value)
  tokenTableData.value = res.data.rows
}
const onResetData = () => {
  queryData.value = {
    tokenCode: ''
  }
  onPageChange()
}

//多选
const selectedData = ref([])
const onSelection = (e) => {
  selectedData.value = e
}

//单删
const onDelete = async (row) => {
  const res = await tokenDeleteService(row.id)
  ElMessage.success(res.data.message)
  onPageChange()
}

// 分页数据加载
const onPageChange = async () => {
  tableLoading.value = true
  const res = await tokenPageListService(page.value)
  tokenTableData.value = res.data.rows
  page.value.total = res.data.total
  setTimeout(() => {
    tableLoading.value = false
  }, 300)
}

//复制
const onCopy = async (row) => {
  try {
    await navigator.clipboard.writeText(row.tokenCode);
    ElMessage.success('复制成功');
  } catch (error) {
    ElMessage.error('复制失败，请重试');
  }
};
</script>

<template>
  <page-container title="授权码管理">
    <template #extra>
      <el-button type="primary" @click="tokenLogsDialog.openLog()" plain>
        <el-icon><Notebook /></el-icon>日志
      </el-button>
      <el-button type="primary" @click="tokenEditDialog.onOpenEditDialog()" plain>
        <el-icon><Edit /></el-icon>添加授权码
      </el-button>
      <el-button
        type="primary"
        @click="batchEditDialog.openBatchDialog(selectedData)"
        :disabled="selectedData.length > 0 ? false : true"
        plain
      >
        <el-icon><Edit /></el-icon>批量操作
      </el-button>
    </template>
    <!-- 表格查询 -->
    <el-row gutter="25">
      <el-col :span="4" :offset="0">
        <div>
          <el-input v-model="queryData.tokenCode" placeholder="请输入授权码"></el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="onQueryData" plain>查询</el-button>
        <el-button type="primary" @click="onResetData" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 表格数据 -->
    <el-table
    
      v-loading="tableLoading"
      :data="tokenTableData"
      style="width: 100%"
      @selection-change="onSelection"
    >
      <el-table-column type="selection" label="多选框" />
      <el-table-column label="id" prop="id" width="80" />
      <el-table-column label="授权码" prop="tokenCode" />
      <el-table-column
        label="激活天数"
        prop="days"
        :formatter="(t) => (t.days == -1 ? '永久' : t.days + ' 天')"
      />
      <el-table-column label="操作" fixed="right" width="280">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="onCopy(scope.row)"
            plain
          >
          <el-icon><CopyDocument /></el-icon>
            复制授权码
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="tokenEditDialog.onOpenEditDialog(scope.row)"
            plain
          >
          <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-popconfirm title="确认删除吗?" @confirm="onDelete(scope.row)">
            <template #reference>
              <el-button size="small" type="danger" plain>
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :page-sizes="[10, 20, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @current-change="onPageChange()"
        @size-change="onPageChange()"
      />
    </div>
  </page-container>
  <!-- 弹窗 -->
  <!-- 批量操作弹窗 -->
  <BatchEditDialog ref="batchEditDialog" @onMulDeleteScucess="onPageChange()" />
  <TokenEditDialog ref="tokenEditDialog" @onUpdateScucess="onPageChange()" />
  <TokenLogsDialog ref="tokenLogsDialog" />
</template>
<style scoped></style>
