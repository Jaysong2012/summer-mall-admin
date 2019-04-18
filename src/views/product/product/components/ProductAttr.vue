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
            <div v-if="productAttr.handAddStatus===0">
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <el-checkbox
                  v-for="item in getInputListArr(productAttr.inputList)"
                  :label="item"
                  :key="item"
                  class="littleMarginLeft"></el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div
                  v-for="(item,index) in selectProductAttr[idx].options"
                  style="display: inline-block"
                  class="littleMarginLeft">
                  <el-checkbox :label="item" :key="item"></el-checkbox>
                  <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
              <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
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
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuPrice">同步价格
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div
            v-for="(item,index) in selectProductAttrPics">
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
            <el-select v-if="item.inputType===0" class="paramInput" v-model="selectProductParam[index].value">
              <el-option
                v-for="item in getParamInputList(item.inputList)"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-else class="paramInput" v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="productParam.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="productParam.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {fetchList as fetchProductAttrCateList} from '@/api/productAttributeCategory'
import { conditionProductAttributeList } from '@/api/productAttribute'
import SingleUpload from '@/components/Upload/SingleUpload'
import MultiUpload from '@/components/Upload/MultiUpload'
import Tinymce from '@/components/Tinymce'
import ProductAttributeCategorySelect from '@/components/Product/ProductAttributeCategorySelect'

export default {
  name: 'ProductAttr',
  components: {ProductAttributeCategorySelect, SingleUpload, MultiUpload, Tinymce},
  props: ['productParam'],
  data() {
    return {
      // 编辑模式时是否初始化成功
      hasEditCreated: false,
      // 商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      // 选中的商品属性
      selectProductAttr: [],
      // 选中的商品参数
      selectProductParam: [],
      // 选中的商品属性图片
      selectProductAttrPics: [],
      // 可手动添加的商品属性
      addProductAttrValue: '',
      // 商品富文本详情激活类型
      activeHtmlName: 'pc'
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
          this.productParam.pic = null;
          this.productParam.albumPics = null;
        } else {
          this.productParam.pic = newValue[0];
          this.productParam.albumPics = '';
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.productParam.albumPics += newValue[i];
              if (i !== newValue.length - 1) {
                this.productParam.albumPics += ',';
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
      if (!this.isEdit) return
      if (this.hasEditCreated) return
      if (newValue === undefined || newValue === null || newValue === 0) return
      this.handleEditCreated();
    }
  },
  methods: {
    handleEditCreated() {
      // 根据商品属性分类id获取属性和参数
      if (this.productParam.productAttributeCategoryId !== null) {
        this.handleProductAttrChange(this.productParam.productAttributeCategoryId);
      }
      this.hasEditCreated = true
    },
    getProductAttrList(type, cid) {
      const param = { pageNum: 1, pageSize: 100, type: type }
      fetchProductAttrList(cid, param).then(response => {
        const list = response.data.list
        if (type === 0) {
          this.selectProductAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];
            if (this.isEdit) {
              if (list[i].handAddStatus === 1) {
                // 编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              // 编辑状态下获取选中属性
              values = this.getEditAttrValues(i);
            }
            this.selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options
            });
          }
          if(this.isEdit){
            //编辑模式下刷新商品属性图片
            this.refreshProductAttrPics();
          }
        } else {
          this.selectProductParam = [];
          for (let i = 0; i < list.length; i++) {
            let value=null;
            if(this.isEdit){
              //编辑模式下获取参数属性
              value= this.getEditParamValue(list[i].id);
            }
            this.selectProductParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              inputList: list[i].inputList
            });
          }
        }
      });
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
          break;
        }
      }
      return options;
    },
    // 获取选中的属性值
    getEditAttrValues(index) {
      let values = [];
      if (index === 0) {
        for (let i = 0; i < this.productParam.skuStockList.length; i++) {
          let sku = this.productParam.skuStockList[i];
          if (sku.sp1 != null && values.indexOf(sku.sp1) === -1) {
            values.push(sku.sp1);
          }
        }
      } else if (index === 1) {
        for (let i = 0; i < this.productParam.skuStockList.length; i++) {
          let sku = this.productParam.skuStockList[i];
          if (sku.sp2 != null && values.indexOf(sku.sp2) === -1) {
            values.push(sku.sp2);
          }
        }
      } else {
        for (let i = 0; i < this.productParam.skuStockList.length; i++) {
          let sku = this.productParam.skuStockList[i];
          if (sku.sp3 != null && values.indexOf(sku.sp3) === -1) {
            values.push(sku.sp3);
          }
        }
      }
      return values;
    },
    // 获取属性的值
    getEditParamValue(id) {
      for (let i = 0; i < this.productParam.productAttributeValueList.length; i++) {
        if (id === this.productParam.productAttributeValueList[i].productAttributeId) {
          return this.productParam.productAttributeValueList[i].value;
        }
      }
    },
    handleProductAttrChange(id) {
      // this.getProductAttrList(0, value)
      // this.getProductAttrList(1, value)
      conditionProductAttributeList({ id: id }).then(response => {
        if (response.returnCode === '000000') {
          const list = response.data
          console.log(response.data)
          this.selectProductAttr = []
          this.selectProductParam = []
          for (let i = 0; i < list.length; i++) {
            if (list[i].type === 1) {
              let options = []
              let values = []
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
                values: values,
                options: options
              })
            } else {
              this.selectProductParam.push({
                id: list[i].id,
                name: list[i].name,
                inputType: list[i].inputType,
                inputList: list[i].inputList,
                selectType: list[i].selectType,
                type: list[i].type
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
    handleAddProductAttrValue(idx) {
      let options = this.selectProductAttr[idx].options;
      if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
        this.$message({
          message: '属性值不能为空',
          type: 'warning',
          duration: 1000
        });
        return
      }
      if (options.indexOf(this.addProductAttrValue) !== -1) {
        this.$message({
          message: '属性值不能重复',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.selectProductAttr[idx].options.push(this.addProductAttrValue);
      this.addProductAttrValue = null;
    },
    handleRemoveProductAttrValue(idx, index) {
      this.selectProductAttr[idx].options.splice(index, 1);
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
      });
    },
    handleSyncProductSkuPrice() {
      this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(this.productParam.skuStockList!==null&&this.productParam.skuStockList.length>0){
          let price=this.productParam.skuStockList[0].price;
          for(let i=0;i<this.productParam.skuStockList.length;i++){
            this.productParam.skuStockList[i].price=price;
          }
        }
      });
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
          console.log(this.selectProductAttr[i].name)
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
      for ( let i = 0; i < this.productParam.skuStockList.length; i++) {
        if(name===this.productParam.skuStockList[i].sp1){
          return this.productParam.skuStockList[i].pic;
        }
      }
      return null;
    },
    // 合并商品属性
    mergeProductAttrValue() {
      this.productParam.productAttributeValueList = [];
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        let attr = this.selectProductAttr[i];
        if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
          this.productParam.productAttributeValueList.push({
            productAttributeId: attr.id,
            value: this.getOptionStr(attr.options)
          });
        }
      }
      for (let i = 0; i < this.selectProductParam.length; i++) {
        let param = this.selectProductParam[i];
        this.productParam.productAttributeValueList.push({
          productAttributeId: param.id,
          value: param.value
        });
      }
    },
    // 合并商品属性图片
    mergeProductAttrPics() {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        for (let j = 0; j < this.productParam.skuStockList.length; j++) {
          if (this.productParam.skuStockList[j].sp1 === this.selectProductAttrPics[i].name) {
            this.productParam.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
          }
        }
      }
    },
    getOptionStr(arr) {
      let str = ''
      for (let i = 0; i < arr.length; i++) {
        str += arr[i]
        if (i !== arr.length - 1) {
          str += ','
        }
      }
      return str
    },
    handleRemoveProductSku(index, row) {
      let list = this.productParam.skuStockList;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },
    getParamInputList(inputList) {
      return inputList.split(',');
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.mergeProductAttrValue();
      this.mergeProductAttrPics();
      this.$emit('nextStep')
    },
    handleFinishCommit() {
      this.mergeProductAttrValue();
      this.mergeProductAttrPics();
      this.$emit('finishCommit',this.isEdit);
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
