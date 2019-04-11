<!-- 牌曾挂车 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'牌曾挂车('+tableData.length+'条结果)'" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-loading="dossierLoading" v-show="expandMark">
    <!-- 改版前 -->
    <!-- <el-col :span="24">
      <el-table :data="tableData" :show-header=false>
        <el-table-column prop="address" label="其他信息" align="left">
          <template scope="scope">
            <p class="time-text">
              品牌：{{scope.row.ppmc}}
            </p>
            <p class="other-text">
              <span>颜色：</span> {{scope.row.ys}}
            </p>
          </template>
</el-table-column>
<el-table-column prop="address" label="其他信息" align="left">
  <template scope="scope">
            <p class="time-text">
              姓名：{{scope.row.xm}}
            </p>
            <p class="other-text">
              <span>身份证号码：</span> {{scope.row.sfzhm}}
            </p>
          </template>
</el-table-column>
<el-table-column prop="address" label="其他信息" align="left">
  <template scope="scope">
            <p class="time-text">
              注册时间：{{scope.row.zcsj}}
            </p>
            <p class="other-text">
              <span>车辆识别码：</span> {{scope.row.clsbdh}}
            </p>
          </template>
</el-table-column>

</el-table>
</el-col> -->
<!-- 改版后 -->
<el-row class="car-box-wapper" v-for="(elem,index) in tableData" :key="index">
  <el-col :span="3" class="car-img">
    <!--  @click="handlePrimaryClick(data.clxx[0].pid,false,2)" -->
    <span class="avatar-pic"><img :src="getCarImage(elem.ppmc?elem.ppmc:'',tableData.length===1?carModel:'')" onerror="this.src='/static/img/default-car.jpg'" alt=""></span>
  </el-col>
  <el-col :span="21" class="car-info-content">
    <div class="car-info-item" style="border:1px solid #e4e4e4;border-bottom:none">
      <div class="car-itme-label">车辆识别码 :</div>
      <div class="car-item-content">{{elem.clsbdh}}</div>
    </div>
    <div class="car-info-item" style="border:1px solid #e4e4e4;border-bottom:none">
      <div class="car-itme-label">车&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp主 :</div>
      <div class="car-item-content">{{elem.xm}}</div>
    </div>
    <div class="car-info-item" style="border:1px solid #e4e4e4;border-bottom:none">
      <div class="car-itme-label">品&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp牌 :</div>
      <div class="car-item-content">{{elem.zwppmc}}</div>
    </div>
    <div class="car-info-item" style="border:1px solid #e4e4e4;">
      <div class="car-itme-label">注册时间 :</div>
      <div class="car-item-content">{{elem.ccdjrq}}</div>
    </div>
    <div class="car-info-item" style="border:1px solid #e4e4e4;">
      <div class="car-itme-label">证件号码 :</div>
      <div class="car-item-content">{{elem.sfzhm}}</div>
    </div>
    <div class="car-info-item" style="border:1px solid #e4e4e4;">
      <div class="car-itme-label">颜&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp色 :</div>
      <div class="car-item-content">{{elem.ys}}</div>
    </div>
  </el-col>
</el-row>
</el-row>
</div>
</template>

<style lang="scss" scoped>
  .kinship-box {
    margin-top: 13px;
    padding: 0 8px;
  }

  .car-box-wapper {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    .car-img {
      height: 90px;
      box-sizing: border-box;
      border: 1px solid #e4e4e4;
      border-right: none;
      .avatar-pic {
        box-sizing: border-box;
        width: 148px;
        img {
          width: 148px;
          height: 88px;
        }
      }
    }
    .car-info-content {
      .car-info-item {
        box-sizing: border-box;
        width: 340px;
        float: left;
        overflow: hidden;
        display: flex;
        height: 45px;
        line-height: 44px;
        text-align: center;
        .car-itme-label {
          color: #fff;
          box-sizing: border-box;
          background: #b4d6f1;
          width: 110px;
          border-right: 1px solid #e4e4e4;
        }
        .car-item-content {
          box-sizing: border-box;
          width: 230px;
        }
      }
    }
  }

</style>


<script>
  import dossierMixin from '../../dossierMixin'
  import cardHeader from './card-header.vue'
  import mixin from '../../../../utils/mixin'
  import bus from '../../../../utils/bus'
  import { GET_PCGC_LIST } from '../../../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin, dossierMixin],
    data() {
      return {
        dossierLoading: false,
        tableData: [],
        clsbdh: '',
        carModel: ''
      }
    },
    props: ['carKey'],
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '牌曾挂车', 'number': val.length })
      }
    },
    methods: {
      loadData(d) {
        if (this.checkRule('jwy/vehicleFile/getPCGCList', true) === true) {
          this.dossierLoading = true
          this.dispatch(GET_PCGC_LIST, { cphm: this.carKey }).then(() => {
            this.tableData = this.dossier.getPCGCList
            bus.$emit('allCarLoading')
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allCarLoading')
          this.dossierLoading = false
        }
      }
    },
    created() {
      // this.loadData()
      bus.$on('getClsbdh', d => {
        this.loadData(d)
      })
      bus.$on('getCarModel', d => {
        this.carModel = d
      })
    },
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
