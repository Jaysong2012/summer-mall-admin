<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.name')" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.productCategory.level')" min-width="120px" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.level | levelFilter">{{ scope.row.level | levelFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.productCategory.keywords')" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.keywords }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="scope.row.level < 2" size="mini" type="success" @click="handleAddChildren(scope.row)">{{ $t('table.add') }}
          </el-button>
          <el-button v-if="scope.row.status!=0" size="mini" type="success" @click="handleModifyStatus(scope.row,0)">{{ $t('status.forbidden') }}
          </el-button>
          <el-button v-if="scope.row.status!=1" size="mini" type="danger" @click="handleModifyStatus(scope.row,1)">{{ $t('status.enable') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-edit :item="item" :dialog-visible="dialogVisible" @getList="getList" @handleDialogVisible="handleDialogVisible" />
  </div>
</template>

<script>
import { fetchProductCategoryTree, statusProductCategory } from '@/api/productCategory'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import i18n from '@/lang'
import { Message } from 'element-ui'
import AddOrEdit from './AddOrEdit'

export default {
  name: 'ProductCategoryTree',
  components: { AddOrEdit },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: i18n.t('status.forbidden'),
        1: i18n.t('status.enable')
      }
      return statusMap[status]
    },
    levelFilter(level) {
      const levelMap = {
        0: i18n.t('product.productCategory.level_one'),
        1: i18n.t('product.productCategory.level_two'),
        2: i18n.t('product.productCategory.level_three')
      }
      return levelMap[level]
    }
  },
  data() {
    return {
      tableKey: 0,
      item: { id: 0 },
      list: [],
      listLoading: true,
      statusOptions: [{ label: i18n.t('status.forbidden'), key: 0}, {label: i18n.t('status.enable'), key: 1}],
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchProductCategoryTree().then(response => {
        if (response.returnCode === '000000') {
          this.list = response.data
        } else {
          this.list = response.data
          Message({
            message: response.returnMsg,
            type: 'error',
            duration: 2 * 1000
          })
        }
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    handleCreate() {
      this.item = { 'id': 0, parentId: 0, level: 0 }
      this.dialogVisible = true
    },
    handleAddChildren(row) {
      const childLevel = row.level + 1
      this.item = { 'id': 0, parentId: row.id, level: childLevel }
      this.dialogVisible = true
    },
    handleUpdate(row) {
      this.item = row
      this.dialogVisible = true
    },
    handleModifyStatus(row, status) {
      const obj = {}
      obj.id = row.id
      obj.status = status
      statusProductCategory(obj).then(response => {
        if (response.returnCode === '000000') {
          row.status = status
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.handleFilter()
        } else {
          Message({
            message: response.returnMsg,
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    },
    handleDialogVisible(val) {
      this.dialogVisible = val
    },
    sortChange(data) {
      const { prop, order } = data
    }
  }
}
</script>
