<template>
  <el-cascader
    expand-trigger="hover"
    placeholder="试试搜索：手机"
    :options="options"
    v-model="selectedOptions"
    filterable
    :props="props"
    @change="handleSelectChange"
  ></el-cascader>
</template>

<script>
import { conditionProductCategoryTree, conditionSelectedProductCategoryIdTree } from '@/api/productCategory'
export default {
  name: 'ProductCategorySelect',
  props: ['selectedId'],
  data: function() {
    return {
      props: {
        children: 'children',
        label: 'name',
        value: 'id'
      },
      loading: false,
      options: [],
      selectedOptions: [this.selectedId]
    }
  },
  watch: {
    selectedId(id) {
      if (this.selectedOptions[this.selectedOptions.length - 1] !== id) {
        this.resetSelectOPtions(id)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectChange() {
      if (this.selectedId !== this.selectedOptions[this.selectedOptions.length - 1]) {
        this.$emit('handleIdSelectChange', this.selectedOptions[this.selectedOptions.length - 1])
      }
    },
    getList() {
      this.loading = true
      conditionProductCategoryTree().then(response => {
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
    },
    resetSelectOPtions(id) {
      conditionSelectedProductCategoryIdTree(id).then(response => {
        if (response.returnCode === '000000') {
          this.selectedOptions = response.data
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
