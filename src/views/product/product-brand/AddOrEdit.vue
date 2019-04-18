<template>
  <el-dialog :title="dialogStatus | dialogStatusFilter" :visible.sync="visibale" @close="handleDialogVisible(false)">
    <el-form :model="item" label-width="80px" label-position="left">
      <el-form-item :label="$t('table.name')">
        <el-input v-model="item.name" :placeholder="$t('table.name')" />
      </el-form-item>
      <el-form-item :label="$t('product.productBrand.brandCategory')">
        <brand-category-select :selected-id="selectedCategoryId" v-on:handleIdSelectChange="handleIdSelectChange"></brand-category-select>
      </el-form-item>
      <el-form-item :label="$t('product.productCategory.sort')">
        <el-input v-model="item.sort" :placeholder="$t('product.productCategory.sort')" />
      </el-form-item>
      <el-form-item :label="$t('product.productCategory.icon')">
        <!--<el-input v-model="item.logo" :placeholder="$t('product.productCategory.icon')" />-->
        <single-upload v-model="item.logo" :placeholder="$t('product.productCategory.icon')" v-on:input="handleLogoSelect"/>
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
import { saveProductBrand } from '@/api/productBrand'
import waves from '@/directive/waves' // Waves directive
import i18n from '@/lang'
import BrandCategorySelect from '@/components/Product/BrandCategorySelect'
import SingleUpload from '@/components/Upload/SingleUpload'

export default {
  name: 'AddOrEdit',
  components: { BrandCategorySelect, SingleUpload},
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
      selectedCategoryId: this.item.categoryId,
      data: [],
      value: Object,
      visibale: this.dialogVisible,
      dialogStatus: 'create'
    }
  },
  computed: {
  },
  watch: {
    item(obj) {
      if (obj.id === 0) {
        this.dialogStatus = 'create'
      } else {
        this.dialogStatus = 'update'
      }

      if (obj.categoryId !== this.selectedCategoryId){
        this.selectedCategoryId = obj.categoryId
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
      saveProductBrand(this.item).then(response => {
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
    },
    handleIdSelectChange(id) {
      this.selectedCategoryId = id
      this.item.categoryId = id
    },
    handleLogoSelect(logo) {
      this.item.logo = logo
    }
  }
}
</script>

<style scoped>

</style>
