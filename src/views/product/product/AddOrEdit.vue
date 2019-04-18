<template>
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
    </el-steps>
    <product-info
      v-show="showStatus[0]"
      :productParam="productParam"
      @nextStep="nextStep">
    </product-info>
    <product-sale
      v-show="showStatus[1]"
      :productParam="productParam"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale>
    <product-attribute
      v-show="showStatus[2]"
      :productParam="productParam"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-attribute>
  </el-card>
</template>

<script>
import { saveProduct, detailProduct } from '@/api/product'
import waves from '@/directive/waves' // Waves directive
import i18n from '@/lang'
import { Message } from 'element-ui'
import ProductInfo from './components/ProductInfo'
import ProductAttribute from './components/ProductAttribute'
import ProductSale from './components/ProductSale'

const defaultProductParam = {
  // 产品Id
  id: 0,
  // 产品相册
  albumPics: '',
  // 品牌分类Id
  brandCategoryId: null,
  // 品牌Id
  brandId: null,
  // 产品 说明
  description: '',
  // 详情 说明
  detailDesc: '',
  // 详情页面
  detailHtml: '',
  // 详情手机页面
  detailMobileHtml: '',
  // 详情标题
  detailTitle: '',
  //
  flashPromotionCount: 0,
  flashPromotionId: 0,
  flashPromotionPrice: 0,
  flashPromotionSort: 0,
  // 积分
  giftPoint: 0,
  // 成长值
  giftGrowth: 0,
  // 关键字
  keywords: '',
  // 产品名称
  name: '',
  // 是否是新上线
  newStatus: 0,

  note: '',
  // 市场价
  originalPrice: 0,
  // 产品图片
  pic: '',
  // 会员价格{memberLevelId: 0,memberPrice: 0,memberLevelName: null}
  memberPriceList: [],
  // 商品满减
  productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
  // 商品阶梯价格
  productLadderList: [{ count: 0, discount: 0, price: 0 }],
  // 预览状态
  previewStatus: 0,
  // 价格
  price: 0,
  //
  productAttributeCategoryId: null,
  // 商品属性相关{productAttributeId: 0, value: ''}
  productAttributeValueList: [],
  // 商品sku库存信息{lowStock: 0, pic: '', price: 0, sale: 0, skuCode: '', sp1: '', sp2: '', sp3: '', stock: 0}
  skuStockList: [],
  productColorPictureList: [],
  // 商品相关专题{subjectId: 0}
  subjectProductRelationList: [],
  // 商品相关优选{prefrenceAreaId: 0}
  prefrenceAreaProductRelationList: [],
  // 产品分类ID
  productCategoryId: null,
  productCategoryName: '',
  // 产品编号
  productSn: '',
  promotionEndTime: '',
  promotionPerLimit: 0,
  promotionPrice: null,
  promotionStartTime: '',
  promotionType: 0,
  publishStatus: 0,
  recommandStatus: 0,
  sale: 0,
  serviceIds: '',
  sort: 0,
  stock: 0,
  subTitle: '',
  unit: '',
  usePointLimit: 0,
  verifyStatus: 0,
  weight: 0
}

export default {
  name: 'AddOrEdit',
  components: { ProductInfo, ProductSale, ProductAttribute },
  directives: { waves },
  filters: {
    editStatusFilter(editStatus) {
      const editStatusMap = {
        update: i18n.t('table.edit'),
        create: i18n.t('table.add')
      }
      return editStatusMap[editStatus]
    }
  },
  data() {
    return {
      isEdit: true,
      active: 0,
      productParam: Object.assign({}, defaultProductParam),
      showStatus: [true, false, false]
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      let id = this.$route.query.id
      if (id === undefined) {
        id = 0
      }
      if (id === 0) {
        this.isEdit = false
      } else {
        this.isEdit = true
        detailProduct({ id: id }).then(response => {
          if (response.returnCode === '000000') {
            this.productParam = response.data
          } else {
            Message({
              message: response.returnMsg,
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
      }
    },
    hideAll() {
      for (let i = 0; i < this.showStatus.length; i++) {
        this.showStatus[i] = false
      }
    },
    prevStep() {
      if (this.active > 0 && this.active < this.showStatus.length) {
        this.active--
        this.hideAll()
        this.showStatus[this.active] = true
      }
    },
    nextStep() {
      if (this.active < this.showStatus.length - 1) {
        this.active++
        this.hideAll()
        this.showStatus[this.active] = true
      }
    },
    finishCommit() {
      this.$confirm('是否要提交该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveProduct(this.productParam).then(response => {
          if (response.returnCode === '000000') {
            this.$message({
              type: 'success',
              message: '提交成功',
              duration: 1000
            });
            this.$router.back();
          } else {
            this.message({
              message: response.returnMsg,
              type: 'fail',
              duration: 2000
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
