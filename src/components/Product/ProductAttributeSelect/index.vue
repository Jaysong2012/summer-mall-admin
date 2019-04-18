<template>
  <el-select v-model="id" :placeholder="$t('product.productBrand.brandCategory')" clearable style="width: 140px" class="filter-item" v-on:change="handleSelectChange" v-bind:v-loading="loading">
    <el-option  v-for="item in options" :label="item.name" :key="item.id" :value="item.id"/>
  </el-select>
</template>

<script>
import { conditionProductAttributeList } from '@/api/productAttribute'
export default {
  name: 'ProductAttributeSelect',
  props: ['selectedId', 'categoryId'],
  data: function() {
    return {
      loading: false,
      id: this.selectedId,
      options: []
    }
  },
  watch: {
    selectedId(id) {
      if (this.id !== id) {
        this.id = id
      }
    },
    categoryId(id) {
      this.getList(id)
    }
  },
  created() {
    this.getList(0)
  },
  methods: {
    handleSelectChange() {
      if (this.selectedId !== this.id) {
        this.$emit('handleIdSelectChange', this.id);
      }
    },
    getList(id) {
      this.loading = true
      conditionProductAttributeList({ id: id }).then(response => {
        if (response.returnCode === '000000') {
          this.options = response.data
          this.loading = false
        } else {
          this.loading = false
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
