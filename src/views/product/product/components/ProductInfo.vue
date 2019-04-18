<template>
  <div style="margin-top: 50px">
    <el-form :model="productParam" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="productCategoryId">
        <product-category-select v-bind:selectedId="productParam.productCategoryId" v-on:handleIdSelectChange="handleProductCategoryChange"></product-category-select>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="productParam.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="productParam.subTitle"></el-input>
      </el-form-item>
      <el-form-item :label="$t('product.productBrand.brandCategory')" prop="brandCategoryId">
        <brand-category-select :selected-id="productParam.brandCategoryId" v-on:handleIdSelectChange="handleBrandCategoryChange"></brand-category-select>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <product-brand-select :selected-id="productParam.brandId" :category-id="productParam.brandCategoryId" v-on:handleIdSelectChange="handleBrandChange"></product-brand-select>
      </el-form-item>
      <el-form-item label="商品介绍：" prop="description">
        <el-input
          :autoSize="true"
          v-model="productParam.description"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：" prop="productSn">
        <el-input v-model="productParam.productSn"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input v-model="productParam.price"></el-input>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input v-model="productParam.originalPrice"></el-input>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="productParam.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input v-model="productParam.weight" style="width: 300px"></el-input>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="productParam.sort"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ProductCategorySelect from '@/components/Product/ProductCategorySelect'
import BrandCategorySelect from '@/components/Product/BrandCategorySelect'
import ProductBrandSelect from '@/components/Product/ProductBrandSelect'

export default {
  name: 'ProductInfo',
  components: { ProductCategorySelect, BrandCategorySelect, ProductBrandSelect },
  props: ['productParam'],
  data() {
    return {
      hasEditCreated: false,
      // 选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
        subTitle: [{ required: true, message: '请输入商品副标题', trigger: 'blur' }],
        productCategoryId: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        brandId: [{ required: true, message: '请选择商品品牌', trigger: 'blur' }],
        description: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
        requiredProp: [{ required: true, message: '该项为必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
  },
  computed: {
    // 商品的编号
    productId() {
      return this.productParam.id
    }
  },
  watch: {
    productParam(param) {
      console.log(param)
      if (this.param.id === 0) {

      }
    }
  },
  methods: {
    handleNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('nextStep')
        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 2000
          })
          return false
        }
      })
    },
    // handleBrandChange(val) {
    //   let brandName = '';
    //   for (let i = 0; i < this.brandOptions.length; i++) {
    //     if (this.brandOptions[i].value === val) {
    //       brandName = this.brandOptions[i].label;
    //       break;
    //     }
    //   }
    //   this.productParam.brandName = brandName;
    // },
    handleProductCategoryChange(val) {
      this.productParam.productCategoryId = val;
    },
    handleBrandCategoryChange(val) {
      this.productParam.brandCategoryId = val;
    },
    handleBrandChange(val) {
      this.productParam.brandId = val
    }
  }
}
</script>

<style scoped>
</style>
