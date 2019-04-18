<template>
  <el-dialog :title="dialogStatus | dialogStatusFilter" :visible.sync="visibale" @close="handleDialogVisible(false)">
    <el-form :model="item" label-width="80px" label-position="left">
      <el-form-item :label="$t('table.name')">
        <el-input v-model="item.name" :placeholder="$t('table.name')" />
      </el-form-item>
      <el-form-item :label="$t('product.productBrand.brandCategory')">
        <product-attribute-category-select :selected-id="selectedCategoryId" v-on:handleIdSelectChange="handleIdSelectChange"></product-attribute-category-select>
      </el-form-item>
      <el-form-item :label="$t('select.type')">
        <el-radio-group v-model="item.selectType">
          <el-radio :label="0">{{ $t('select.one') }}</el-radio>
          <el-radio :label="1">{{ $t('select.single') }}</el-radio>
          <el-radio :label="2">{{ $t('select.multi') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('product.productAttribute.inputType')">
        <el-radio-group v-model="item.inputType">
          <el-radio :label="0">{{ $t('product.productAttribute.inputType_select') }}</el-radio>
          <el-radio :label="1">{{ $t('product.productAttribute.inputType_input') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('product.productAttribute.inputList')">
        <el-input :autosize="true" type="textarea" v-model="inputListFormat"></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.productAttribute.attributeType')">
        <el-radio-group v-model="item.type">
          <el-radio :label="1">{{ $t('product.productAttribute.attributeType_attr') }}</el-radio>
          <el-radio :label="2">{{ $t('product.productAttribute.attributeType_params') }}</el-radio>
        </el-radio-group>
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
import { saveProductAttribute } from '@/api/productAttribute'
import waves from '@/directive/waves' // Waves directive
import i18n from '@/lang'
import ProductAttributeCategorySelect from '@/components/Product/ProductAttributeCategorySelect'

export default {
  name: 'AddOrEdit',
  components: { ProductAttributeCategorySelect },
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
      visibale: this.dialogVisible,
      dialogStatus: 'create',
      inputListFormat: this.item.inputList
    }
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
      this.inputListFormat = obj.inputList
    },
    dialogVisible(visible) {
      if (this.visibale !== visible) {
        this.visibale = visible
      }
    },
    inputListFormat: function(newValue, oldValue) {
      this.item.inputList = String(newValue).replace(/\n/g, ',')
      this.inputListFormat = String(newValue).replace(/,/g, '\n')
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
      saveProductAttribute(this.item).then(response => {
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
    }
  }
}
</script>

<style scoped>

</style>
