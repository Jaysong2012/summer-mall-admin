<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input :placeholder="$t('system.sysuser.list.name')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>-->
      <role-select :selected-room-id="listQuery.roleId" @handleRoleIdSelectChange="handleRoleIdSelectChange" />
      <el-select v-model="listQuery.status" :placeholder="$t('system.sysuser.list.status')" clearable style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" :placeholder="$t('system.sysuser.list.sort')" clearable style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.sysuser.list.name')" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.sysuser.list.email')" min-width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.sysuser.list.role')" min-width="120px" align="center">
        <template slot-scope="scope">
          <role-check :checked-roles="scope.row.roleNameList" />
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
          <el-button v-if="scope.row.status!=0" size="mini" type="success" @click="handleModifyStatus(scope.row,0)">{{ $t('status.forbidden') }}
          </el-button>
          <el-button v-if="scope.row.status!=1" size="mini" type="danger" @click="handleModifyStatus(scope.row,1)">{{ $t('status.enable') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <add-or-edit :item="item" :dialog-visible="dialogVisible" @getList="getList" @handleDialogVisible="handleDialogVisible" />

  </div>
</template>

<script>
import { fetchSysuserList, statusSysuser } from '../../../api/system'
import waves from '../../../directive/waves' // Waves directive
import Pagination from '../../../components/Pagination' // Secondary package based on el-pagination
import RoleCheck from '../../../components/RoleCheck'
import RoleSelect from '../../../components/RoleSelect'
import i18n from '../../../lang'
import { Message } from 'element-ui'
import AddOrEdit from './AddOrEdit'

export default {
  name: 'SysuserList',
  components: { Pagination, RoleCheck, AddOrEdit, RoleSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: i18n.t('status.forbidden'),
        1: i18n.t('status.enable')
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      item: { id: 0, roleNameList: [], roleIdList: [] },
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        name: '',
        roleId: '',
        status: 1,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: i18n.t('sort.id.asc'), key: '+id' }, { label: i18n.t('sort.id.dsc'), key: '-id' }],
      statusOptions: [{ label: i18n.t('status.forbidden'), key: 0 }, { label: i18n.t('status.enable'), key: 1 }],
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchSysuserList(this.listQuery).then(response => {
        if (response.returnCode === '000000') {
          this.list = response.data.list
          this.total = response.data.total
        } else {
          this.list = response.data.list
          this.total = response.data.total
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
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleCreate() {
      this.item = { 'id': 0, roleIdList: [], roleNameList: [], avatar: '' }
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
      statusSysuser(obj).then(response => {
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
    handleRoleIdSelectChange(roleId) {
      this.listQuery.roleId = roleId
      this.handleFilter()
    }
  }
}
</script>

<style scoped>

</style>
