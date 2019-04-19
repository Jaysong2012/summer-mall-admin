<template>
  <div class="app-container">
    <div class="filter-container">
      <product-category-select :selected-id="listQuery.categoryId" v-on:handleIdSelectChange="handleIdSelectChange"></product-category-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
    </div>

    <div class="table-container">
      <el-table
        ref="productTable"
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
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
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handleModifyStatus(scope.row,scope.row.publishStatus,1)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                @change="handleModifyStatus(scope.row,scope.row.newStatus,2)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleModifyStatus(scope.row,scope.row.recommandStatus,3)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
          <template slot-scope="scope">
            <p><el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusFilter }}</el-tag></p>
            <p>
              <el-button v-if="scope.row.status!=0" size="mini" type="success" @click="handleModifyStatus(scope.row,0, 0)">{{ $t('status.forbidden') }}
              </el-button>
              <el-button v-if="scope.row.status!=1" size="mini" type="danger" @click="handleModifyStatus(scope.row,1, 1)">{{ $t('status.enable') }}
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType"
        placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { listProduct, statusProduct ,batchStatusProduct } from '@/api/product'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import i18n from '@/lang'
import { Message } from 'element-ui'
import ProductCategorySelect from '@/components/Product/ProductCategorySelect'

export default {
  name: 'List',
  components: { Pagination, ProductCategorySelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: i18n.t('status.forbidden'),
        1: i18n.t('status.enable')
      }
      return statusMap[status]
    },
    verifyStatusFilter(value) {
      if (value === 1) {
        return '审核通过';
      } else {
        return '未审核';
      }
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        categoryId: null,
        status: 1
      },
      statusOptions: [{ label: i18n.t('status.forbidden'), key: 0 }, { label: i18n.t('status.enable'), key: 1 }],
      multipleSelection: [],
      operates: [
        {
          label: '商品上架',
          value: 'publishOn'
        },
        {
          label: '商品下架',
          value: 'publishOff'
        },
        {
          label: '设为新品',
          value: 'newOn'
        },
        {
          label: '取消新品',
          value: 'newOff'
        },
        {
          label: '设为推荐',
          value: 'recommendOn'
        },
        {
          label: '取消推荐',
          value: 'recommendOff'
        },
        {
          label: '转移到分类',
          value: 'transferCategory'
        },
        {
          label: '移入回收站',
          value: 'recycle'
        }
      ],
      operateType: null,
      publishStatusOptions: [{
        value: 1,
        label: '上架'
      }, {
        value: 0,
        label: '下架'
      }],
      verifyStatusOptions: [{
        value: 1,
        label: '审核通过'
      }, {
        value: 0,
        label: '未审核'
      }]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listProduct(this.listQuery).then(response => {
        if (response.returnCode === '000000') {
          this.list = response.data.list
          this.total = response.data.total
        } else {
          this.list = []
          this.total = 0
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
      this.$router.push({ path: '/product/product/add-or-edit' })
    },
    handleUpdate(row) {
      this.$router.push({ path: '/product/product/add-or-edit', query: { id: row.id }})
    },
    handleModifyStatus(row, status, type) {
      const obj = {}
      obj.id = row.id
      switch (type) {
        case 0:
          obj.status = status
          break
        case 1:
          obj.publishStatus = status
          break
        case 2:
          obj.newStatus = status
          break
        case 3:
          obj.recommandStatus = status
          break
        case 4:
          obj.verifyStatus = status
          break
        default:
          obj.status = status
          break
      }

      statusProduct(obj).then(response => {
        if (response.returnCode === '000000') {
          if (type === 0) {
            row.status = status
          }
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
    handleBatchStatus(ids, status, type) {
      const obj = {}
      obj.ids = ids
      switch (type) {
        case 0:
          obj.status = status
          break
        case 1:
          obj.publishStatus = status
          break
        case 2:
          obj.newStatus = status
          break
        case 3:
          obj.recommandStatus = status
          break
        case 4:
          obj.verifyStatus = status
          break
        default:
          obj.status = status
          break
      }

      batchStatusProduct(obj).then(response => {
        if (response.returnCode === '000000') {
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
    handleIdSelectChange(id) {
      this.listQuery.categoryId = id
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBatchOperate() {
      if (this.operateType === null) {
        this.$message({
          message: '请选择操作类型',
          type: 'warning',
          duration: 1000
        })
        return
      }
      if (this.multipleSelection === null || this.multipleSelection.length < 1) {
        this.$message({
          message: '请选择要操作的商品',
          type: 'warning',
          duration: 1000
        })
        return
      }
      this.$confirm('是否要进行该批量操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.handleBatchStatus(ids, 1, 1)
            break
          case this.operates[1].value:
            this.handleBatchStatus(ids, 0, 1)
            break
          case this.operates[2].value:
            this.handleBatchStatus(ids, 1, 2)
            break
          case this.operates[3].value:
            this.handleBatchStatus(ids, 0, 2)
            break
          case this.operates[4].value:
            this.handleBatchStatus(ids, 1, 3)
            break
          case this.operates[5].value:
            this.handleBatchStatus(ids, 0, 3)
            break
          case this.operates[6].value:
            break
          case this.operates[7].value:
            break
          default:
            break
        }
        this.getList();
      })
    },
    handleShowVerifyDetail(index,row) {
      console.log('handleShowVerifyDetail', row);
    },
    handleShowSkuEditDialog(index, row) {

    }
  }
}
</script>

<style scoped>
</style>
