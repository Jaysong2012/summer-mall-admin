<template>
  <div style="margin-top: 50px">
    <el-form :model="productParam" ref="productSaleForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="赠送积分：">
        <el-input v-model="productParam.giftPoint"></el-input>
      </el-form-item>
      <el-form-item label="赠送成长值：">
        <el-input v-model="productParam.giftGrowth"></el-input>
      </el-form-item>
      <el-form-item label="积分购买限制：">
        <el-input v-model="productParam.usePointLimit"></el-input>
      </el-form-item>
      <el-form-item label="预告商品：">
        <el-switch
          v-model="productParam.previewStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品上架：">
        <el-switch
          v-model="productParam.publishStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="商品推荐：">
        <span style="margin-right: 10px">新品</span>
        <el-switch
          v-model="productParam.newStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
        <span style="margin-left: 10px;margin-right: 10px">推荐</span>
        <el-switch
          v-model="productParam.recommandStatus"
          :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="服务保证：">
        <el-checkbox-group v-model="selectServiceList">
          <el-checkbox :label="1">无忧退货</el-checkbox>
          <el-checkbox :label="2">快速退款</el-checkbox>
          <el-checkbox :label="3">免费包邮</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="详细页标题：">
        <el-input v-model="productParam.detailTitle"></el-input>
      </el-form-item>
      <el-form-item label="详细页描述：">
        <el-input v-model="productParam.detailDesc"></el-input>
      </el-form-item>
      <el-form-item label="商品关键字：">
        <el-input v-model="productParam.keywords"></el-input>
      </el-form-item>
      <el-form-item label="商品备注：">
        <el-input v-model="productParam.note" type="textarea" :autoSize="true"></el-input>
      </el-form-item>
      <el-form-item label="选择优惠方式：">
        <el-radio-group v-model="productParam.promotionType" size="small" @change="handlePromotionTypeChange">
          <el-radio-button :label="0">无优惠</el-radio-button>
          <el-radio-button :label="1">特惠促销</el-radio-button>
          <el-radio-button :label="2">会员价格</el-radio-button>
          <el-radio-button :label="3">阶梯价格</el-radio-button>
          <el-radio-button :label="4">满减价格</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="productParam.promotionType===1">
        <div>
          开始时间：
          <el-date-picker
            v-model="productParam.promotionStartTime"
            value-format="timestamp"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          结束时间：
          <el-date-picker
            v-model="productParam.promotionEndTime"
            value-format="timestamp"
            type="datetime"
            :picker-options="pickerOptions1"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
        <div class="littleMargin">
          促销价格：
          <el-input style="width: 220px" v-model="productParam.promotionPrice" placeholder="输入促销价格"></el-input>
        </div>

      </el-form-item>
      <el-form-item v-show="productParam.promotionType===2">
        <div v-for="(item, index) in productParam.memberPriceList" :class="{littleMargin:index!==0}">
          {{item.memberLevelName}}：
          <el-input v-model="item.memberPrice" style="width: 200px"></el-input>
        </div>
      </el-form-item>
      <el-form-item v-show="productParam.promotionType===3">
        <el-table
          :data="productParam.productLadderList"
          style="width: 80%"
          border>
          <el-table-column
            label="数量"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.count"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="折扣"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.discount"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveProductLadder(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddProductLadder(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-show="productParam.promotionType===4">
        <el-table
          :data="productParam.productFullReductionList"
          style="width: 80%"
          border>
          <el-table-column
            label="满"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.fullPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="立减"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reducePrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleRemoveFullReduction(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" @click="handleAddFullReduction(scope.$index, scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { conditionMemberLevelList } from '@/api/memberLevel'
export default {
  name: 'ProductSale',
  props: ['productParam'],
  data() {
    return {
      // 日期选择器配置
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created() {
    this.initMemberLevelList()
  },
  watch: {
    productParam(param) {
    }
  },
  computed: {
    // 选中的服务保证
    selectServiceList: {
      get() {
        const list = []
        if (this.productParam.serviceIds === undefined || this.productParam.serviceIds == null || this.productParam.serviceIds === '') return list
        const ids = this.productParam.serviceIds.split(',')
        for (let i = 0; i < ids.length; i++) {
          list.push(Number(ids[i]))
        }
        return list
      },
      set(newValue) {
        let serviceIds = ''
        if (newValue != null && newValue.length > 0) {
          for (let i = 0; i < newValue.length; i++) {
            serviceIds += newValue[i] + ','
          }
          if (serviceIds.endsWith(',')) {
            serviceIds = serviceIds.substr(0, serviceIds.length - 1)
          }
          this.productParam.serviceIds = serviceIds
        } else {
          this.productParam.serviceIds = null
        }
      }
    }
  },
  methods: {
    handleEditCreated() {
      const ids = this.productParam.serviceIds.split(',')
      console.log('handleEditCreated', ids)
      for (let i = 0; i < ids.length; i++) {
        this.selectServiceList.push(Number(ids[i]))
      }
    },
    initMemberLevelList() {
      if (this.productParam.id === 0) {
        conditionMemberLevelList().then(response => {
          if (response.returnCode === '000000') {
            const memberPriceList = [];
            for (let i = 0; i < response.data.length; i++) {
              const item = response.data[i];
              memberPriceList.push({ memberLevelId: item.id, memberLevelName: item.name })
            }
            this.productParam.memberPriceList = memberPriceList;
          } else {
            this.message({
              message: response.returnMsg,
              type: 'fail',
              duration: 2000
            })
          }
        })
      }
    },
    handleRemoveProductLadder(index, row) {
      const productLadderList = this.productParam.productLadderList
      if (productLadderList.length === 1) {
        productLadderList.pop()
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        productLadderList.splice(index, 1)
      }
    },
    handleAddProductLadder(index, row) {
      const productLadderList = this.productParam.productLadderList
      if (productLadderList.length < 3) {
        productLadderList.push({
          count: 0,
          discount: 0,
          price: 0
        })
      } else {
        this.$message({
          message: '最多只能添加三条',
          type: 'warning'
        })
      }
    },
    handleRemoveFullReduction(index, row) {
      const fullReductionList = this.productParam.productFullReductionList
      if (fullReductionList.length === 1) {
        fullReductionList.pop()
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0
        })
      } else {
        fullReductionList.splice(index, 1)
      }
    },
    handleAddFullReduction(index, row) {
      const fullReductionList = this.productParam.productFullReductionList
      if (fullReductionList.length < 3) {
        fullReductionList.push({
          fullPrice: 0,
          reducePrice: 0
        })
      } else {
        this.$message({
          message: '最多只能添加三条',
          type: 'warning'
        })
      }
    },
    handlePrev() {
      this.$emit('prevStep')
    },
    handleNext() {
      this.$emit('nextStep')
    },
    handlePromotionTypeChange(type) {
      switch (type) {
        case 3:
          if (this.productParam.productLadderList === null || this.productParam.productLadderList === undefined) {
            this.productParam.productLadderList = [{ count: 0, discount: 0, price: 0 }]
          }
          break
        case 4:
          if (this.productParam.productFullReductionList === undefined || this.productParam.productFullReductionList === null) {
            this.productParam.productFullReductionList = [{ fullPrice: 0, reducePrice: 0 }]
          }
          break
      }
    }
  }
}
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
