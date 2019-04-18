<template>
  <div style="margin-top: 50px">
    <el-form :model="productParam" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <product-attribute-category-select v-bind:selectedId="productParam.productAttributeCategoryId" v-on:handleIdSelectChange="handleProductAttributeCategoryChange"></product-attribute-category-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(productAttr,idx) in selectProductAttr">
            {{productAttr.name}}：
            <el-checkbox-group v-model="selectProductAttr[idx].values">
              <el-checkbox
                v-for="item in getInputListArr(productAttr.inputList)"
                :label="item"
                :key="item"
                class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-card>
        <el-table
          style="width: 100%;margin-top: 20px"
          :data="productParam.skuStockList"
          border>
          <el-table-column
            v-for="(item) in selectProductAttr"
            :label="item.name"
            :key="item.id"
            align="center">
            <template slot-scope="scope">
              {{getProductSkuRowInfo(scope.row,item.id)}}
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="商品库存"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="库存预警值"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="SKU编号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList">刷新列表
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(item) in selectProductAttrPics">
            <span>{{item.name}}:</span>
            <single-upload
              v-model="item.pic"
              style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in selectProductParam" :class="{littleMarginTop:index!==0}">
            <div class="paramInputLabel">{{item.name}}:</div>
            <div
              v-if="item.inputType===0">
              <div v-if="item.selectType === 2">
                <el-checkbox-group v-model="selectProductParam[index].values">
                  <el-checkbox
                    v-for="item in getInputListArr(item.inputList)"
                    :label="item"
                    :key="item"
                    class="littleMarginLeft"></el-checkbox>
                </el-checkbox-group>
              </div>
              <div v-else>
                <el-select class="paramInput" v-model="selectProductParam[index].values">
                  <el-option
                    v-for="item in getParamInputList(item.inputList)"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div
              v-else>
              <el-input  class="paramInput" v-model="selectProductParam[index].values"></el-input>
            </div>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { conditionProductAttributeList } from '@/api/productAttribute'
import SingleUpload from '@/components/Upload/SingleUpload'
import MultiUpload from '@/components/Upload/MultiUpload'
import ProductAttributeCategorySelect from '@/components/Product/ProductAttributeCategorySelect'

export default {
  name: 'ProductAttribute',
  components: { ProductAttributeCategorySelect, SingleUpload, MultiUpload },
  props: ['productParam'],
  data() {
    return {
      // 选中的商品属性
      selectProductAttr: [],
      // 选中的商品参数
      selectProductParam: [],
      // 选中的商品属性图片
      selectProductAttrPics: []
    }
  },
  computed: {
    // 是否有商品属性图片
    hasAttrPic() {
      if (this.selectProductAttrPics.length < 1) {
        return false
      }
      return true
    },
    // 商品的编号
    productId() {
      return this.productParam.id
    },
    // 商品的主图和画册图片
    selectProductPics: {
      get: function() {
        const pics = []
        if (this.productParam.pic === undefined || this.productParam.pic === null || this.productParam.pic === '') {
          return pics
        }
        pics.push(this.productParam.pic)
        if (this.productParam.albumPics === undefined || this.productParam.albumPics === null || this.productParam.albumPics === '') {
          return pics
        }
        const albumPics = this.productParam.albumPics.split(',')
        for (let i = 0; i < albumPics.length; i++) {
          pics.push(albumPics[i])
        }
        return pics
      },
      set: function(newValue) {
        if (newValue == null || newValue.length === 0) {
          this.productParam.pic = null
          this.productParam.albumPics = null
        } else {
          this.productParam.pic = newValue[0]
          this.productParam.albumPics = ''
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.productParam.albumPics += newValue[i]
              if (i !== newValue.length - 1) {
                this.productParam.albumPics += ','
              }
            }
          }
        }
      }
    }
  },
  created() {

  },
  watch: {
    productId: function(newValue) {
      if (newValue === undefined || newValue === null || newValue === 0) return
      this.handleEditCreated()
    }
  },
  methods: {
    handleEditCreated() {
      // 根据商品属性分类id获取属性和参数
      if (this.productParam.productAttributeCategoryId !== null && this.productParam.productAttributeCategoryId !== 0) {
        this.handleProductAttrChange(this.productParam.productAttributeCategoryId);
      }
    },
    // 获取设置的可手动添加属性值
    getEditAttrOptions(id) {
      const options = []
      for (let i = 0; i < this.productParam.productAttributeValueList.length; i++) {
        const attrValue = this.productParam.productAttributeValueList[i]
        if (attrValue.productAttributeId === id) {
          const strArr = attrValue.value.split(',')
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j])
          }
          break
        }
      }
      return options
    },
    handleProductAttrChange(id) {
      conditionProductAttributeList({ id: id }).then(response => {
        if (response.returnCode === '000000') {
          const list = response.data
          this.selectProductAttr = []
          this.selectProductParam = []
          for (let i = 0; i < list.length; i++) {
            if (list[i].type === 1) {
              const values = []
              // if (this.productParam.id !== 0) {
              //   if (list[i].handAddStatus === 1) {
              //     // 编辑状态下获取手动添加编辑属性
              //     options = this.getEditAttrOptions(list[i].id);
              //   }
              //   // 编辑状态下获取选中属性
              //   values = this.getEditAttrValues(i);
              // }
              this.selectProductAttr.push({
                id: list[i].id,
                name: list[i].name,
                inputType: list[i].inputType,
                inputList: list[i].inputList,
                selectType: list[i].selectType,
                type: list[i].type,
                // handAddStatus: list[i].handAddStatus,
                handAddStatus: 0,
                values: values
              })
            } else {
              const values = list[i].selectType === 2 ? [] : null
              this.selectProductParam.push({
                id: list[i].id,
                name: list[i].name,
                inputType: list[i].inputType,
                inputList: list[i].inputList,
                selectType: list[i].selectType,
                type: list[i].type,
                values: values
              })
            }
          }
        } else {
          this.message({
            message: response.returnMsg,
            type: 'fail',
            duration: 2000
          })
        }
      })
    },
    getInputListArr(inputList) {
      return inputList.split(',')
    },
    getProductSkuRowInfo(row, id) {
      return row[id]
    },
    handleRefreshProductSkuList() {
      this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshProductAttrPics()
        this.refreshProductSkuList()
      })
    },
    refreshProductSkuList() {
      this.productParam.skuStockList = []
      const handleSelectProductAttr = []
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        handleSelectProductAttr.push(this.selectProductAttr[i])
      }
      const mySKUList = []
      const productAttrDiKaEr = this.getProductAttrDiKaEr(handleSelectProductAttr)
      const idList = String(productAttrDiKaEr.id).split('_')
      for (let i = 0; i < productAttrDiKaEr.values.length; i++) {
        const skuObj = {}
        const attrArr = []
        for (let j = 0; j < idList.length; j++) {
          const attrValue = this.getProductAttrIdValue(idList[j], productAttrDiKaEr.values[i])
          skuObj[idList[j]] = attrValue
          attrArr.push({
            attrId: idList[j],
            attrValue: attrValue
          })
        }
        skuObj.attrArr = attrArr
        mySKUList.push(skuObj)
      }

      this.productParam.skuStockList = mySKUList
    },
    getProductAttrIdValue(id, valueStr) {
      const idNext = String(valueStr).split(id + '_')[1]
      if (idNext.indexOf('$') !== -1) {
        return idNext.split('$')[0]
      }
      return idNext
    },
    getProductAttrDiKaEr(handleSelectProductAttr) {
      if (handleSelectProductAttr.length === 1) {
        return handleSelectProductAttr[0]
      }
      const one = handleSelectProductAttr[0]
      const two = handleSelectProductAttr[1]

      const newOne = this.twoArr2oneArr(one, two)
      handleSelectProductAttr.shift()
      handleSelectProductAttr.shift()
      handleSelectProductAttr.unshift(newOne)

      return this.getProductAttrDiKaEr(handleSelectProductAttr)
    },
    twoArr2oneArr(one, two) {
      const result = []
      const oneArr = one.values
      const twoArr = two.values
      for (let i = 0; i < oneArr.length; i++) {
        for (let j = 0; j < twoArr.length; j++) {
          if (String(one.id).indexOf('_') !== -1) {
            result.push(oneArr[i] + '$' + two.id + '_' + twoArr[j])
          } else {
            result.push(one.id + '_' + oneArr[i] + '$' + two.id + '_' + twoArr[j])
          }
        }
      }
      return {
        id: one.id + '_' + two.id,
        name: one.name + '_' + two.name,
        values: result
      }
    },
    refreshProductAttrPics() {
      this.selectProductAttrPics = []
      if (this.selectProductAttr.length >= 1) {
        for (let i = 0; i < this.selectProductAttr.length; i++) {
          if (this.selectProductAttr[i].name === '颜色') {
            const values = this.selectProductAttr[0].values;
            for (let j = 0; j < values.length; j++) {
              let pic = null
              // if (this.isEdit) {
              //   // 编辑状态下获取图片
              //   pic = this.getProductSkuPic(values[j])
              // }
              this.selectProductAttrPics.push({ name: values[j], pic: pic })
            }
          }
        }
      }
    },
    // 获取商品相关属性的图片
    getProductSkuPic(name) {
      // for ( let i = 0; i < this.productParam.skuStockList.length; i++) {
      //   if(name===this.productParam.skuStockList[i].sp1){
      //     return this.productParam.skuStockList[i].pic;
      //   }
      // }
      // return null;
    },
    // 合并商品属性
    mergeProductAttrValue() {
      this.productParam.productAttributeValueList = [];
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        const attr = this.selectProductAttr[i]
        // if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
        //   this.productParam.productAttributeValueList.push({
        //     productAttributeId: attr.id,
        //     value: this.getOptionStr(attr.options)
        //   });
        // }
        this.productParam.productAttributeValueList.push({
          productAttributeId: attr.id,
          type: attr.type,
          value: this.getStrValue(attr.values)
        })
      }
      for (let i = 0; i < this.selectProductParam.length; i++) {
        const param = this.selectProductParam[i];
        this.productParam.productAttributeValueList.push({
          productAttributeId: param.id,
          type: param.type,
          value: this.getStrValue(param.values)
        })
      }
    },
    getStrValue(arr) {
      if (arr instanceof Array) {
        let result = ''
        for (let i = 0; i < arr.length; i++) {
          result = result + arr[i]
          if (i !== arr.length - 1) {
            result = result + ','
          }
        }
        return result
      } else {
        return arr
      }
    },
    // 合并商品属性图片
    mergeProductAttrPics() {
      this.productParam.productColorPictureList = this.selectProductAttrPics
      // for (let i = 0; i < this.selectProductAttrPics.length; i++) {
      //   for (let j = 0; j < this.productParam.skuStockList.length; j++) {
      //     if (this.productParam.skuStockList[j].sp1 === this.selectProductAttrPics[i].name) {
      //       this.productParam.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
      //     }
      //   }
      // }
    },
    getParamInputList(inputList) {
      return inputList.split(',')
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.mergeProductAttrValue()
      this.mergeProductAttrPics()
      this.$emit('nextStep')
    },
    handleFinishCommit() {
      this.mergeProductAttrValue()
      this.mergeProductAttrPics()
      this.$emit('finishCommit')
    },
    handleProductAttributeCategoryChange(val) {
      this.productParam.productAttributeCategoryId = val
      this.handleProductAttrChange(val)
    }
  }
}
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }
  .littleMarginTop {
    margin-top: 10px;
  }
  .paramInput {
    width: 250px;
  }
  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }
  .cardBg {
    background: #F8F9FC;
  }
</style>
