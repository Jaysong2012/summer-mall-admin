<template>
  <el-dialog :title="dialogStatus | dialogStatusFilter" :visible.sync="visibale" @close="handleDialogVisible(false)">
    <el-form :model="item" label-width="80px" label-position="left">
      <el-form-item :label="$t('table.name')">
        <el-input v-model="item.name" :placeholder="$t('table.name')" />
      </el-form-item>
      <el-form-item :label="$t('product.productCategory.icon')">
        <el-input v-model="item.icon" :placeholder="$t('product.productCategory.icon')" />
      </el-form-item>
      <el-form-item :label="$t('product.productCategory.description')">
        <el-input v-model="item.description" :placeholder="$t('product.productCategory.description')" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogVisible(false)">{{ $t('table.cancel') }}</el-button>
      <el-button type="primary" @click="save">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveBrandCategory } from '@/api/brandCategory'
import waves from '@/directive/waves' // Waves directive
import i18n from '@/lang'

export default {
  name: 'AddOrEdit',
  directives: { waves },
  filters: {
    dialogStatusFilter(dialogStatus) {
      const dialogStatusMap = {
        update: i18n.t('table.edit'),
        create: i18n.t('table.add')
      }
      return dialogStatusMap[dialogStatus]
    }
  },
  props: ['dialogVisible', 'item'],
  data() {
    return {
      data: [],
      visibale: this.dialogVisible,
      dialogStatus: 'create'
    }
  },
  watch: {
    item(obj) {
      if (obj.id === 0) {
        this.dialogStatus = 'create'
      } else {
        this.dialogStatus = 'update'
      }
    },
    dialogVisible(visible) {
      if (this.visibale !== visible) {
        this.visibale = visible
      }
    }
  },
  methods: {
    handleDialogVisible: function(visible) {
      if (this.visibale !== visible) {
        this.visibale = visible
      }
      this.$emit('handleDialogVisible', visible)
    },
    save() {
      saveBrandCategory(this.item).then(response => {
        if (response.returnCode === '000000') {
          this.handleDialogVisible(false)
          this.$emit('getList', 0)
        } else {
          this.message({
            message: response.returnMsg,
            type: 'fail',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
