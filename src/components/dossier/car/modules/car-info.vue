<!--车辆基本信息-->
<template>
<div class="car-info" v-loading="dossierLoading">
  <!--标题-->
  <card-header :carKey="carKey" title="基础信息" :jdcfdjddjh="jdcfdjddjh" tool='share'></card-header>
  <!-- 内容 -->
  <el-row :gutter="15">
    <el-col :span="6" class="info-box">
      <!-- <div class="car-imgbg"><i class="iconfont icon-xiaoche"></i></div> -->
      <div class="car-imgbg"><img class="iconfont" :src="getCarImage(carData?carData.zwppmc:'',carData?carData.clxh:'')" onerror="this.src='/static/img/default-car.jpg'" alt=""></div>
    </el-col>
    <el-col :span="18" class="info-box" v-if="carData!==null">
      <el-row>
        <el-col :span="24" class="info-text-name">
          <span class="name">{{carData.jdchphm}}</span>
          <!-- <span class="info-badge">正在使用</span> -->
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="info-text-box">
          <label>车辆识别码</label>
          <span class="lable-text-input">{{carData.clsbdh || '暂无'}}</span>
        </el-col>
        <el-col :span="12" class="info-text-box">
          <label>进口凭证编号</label>
          <span class="lable-text-input">{{carData.jdcllpzbh || '暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="info-text-box">
          <label>发动机号</label>
          <span class="lable-text-input">{{carData.jdcfdjddjh || '暂无'}}</span>
        </el-col>
        <el-col :span="12" class="info-text-box">
          <label>证件号码</label>
          <span class="lable-text-input">{{carData.jdcxsz || '暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="info-text-box">
          <label>车身颜色</label>
          <span class="lable-text-input">{{carData.jdccsysdm || '暂无'}}</span>
        </el-col>
        <el-col :span="12" class="info-text-box">
          <label>出厂日期</label>
          <span class="lable-text-input">{{carData.ccrq?carData.ccrq.split(' ')[0]:'暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="info-text-box">
          <label>使用性质</label>
          <span class="lable-text-input">{{carData.jdcsyxzdm || '暂无'}}</span>
        </el-col>
        <el-col :span="12" class="info-text-box">
          <label>注册日期</label>
          <span class="lable-text-input">{{carData.ccdjrq?carData.ccdjrq.split(' ')[0]:'暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="info-text-box">
          <label>发证机关</label>
          <span class="lable-text-input">{{carData.gajtglfzjgslmc || '暂无'}}</span>
        </el-col>
        <el-col :span="12" class="info-text-box">
          <label>发证日期</label>
          <span class="lable-text-input">{{carData.jdchp_hfrq?carData.jdchp_hfrq.split(' ')[0]:'暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="info-text-box">
          <label>品牌型号</label>
          <span class="lable-text-input">{{carData.zwppmc || '暂无'}}</span>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24" class="info-text-box label-box info-flex-wrap">
          <label>标签</label>
          <el-tag :key="item.LabelName" v-for="item in tages">{{item.LabelName}}</el-tag>

        </el-col>
      </el-row>
    </el-col>
    <el-col :span="21" v-if="carData===null">
      <div class="empty"></div>
    </el-col>
  </el-row>

  <el-row class="info-box-hr" v-if="resources.length > 0">
    <div class="info-line"></div>
    <span class="info-line-title">相关资源表</span>
  </el-row>
  <el-row>
    <el-col :span="24" class="info-table-list">
      <a href="javascript:void(0)" :key="item.comments" v-for="item in resources">{{item.comments}}</a>

    </el-col>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
  label {
    margin-right: 10px;
    width: 110px;
    text-align: justify;
    text-align-last: justify;
  }

  .info-box {
    margin-top: 13px;
    .users-image {
      height: 145px;
      border: 1px solid #D7D7d7;
      text-align: center;
      background-color: #F2F2F2;
      img {
        margin: 5px;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
      }
    }
    .car-imgbg {
      background: #dff1ff;
      height: 252px;
      overflow: hidden;
      display: flex;
      align-items: center;
      align-content: center;
      position: relative;
      .iconfont {
        font-size: 42px;
        color: #b9dfff;
        text-align: center;
        width: 100%;
        height: 252px;
      }
    }
    .attention-button {
      width: 98%;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background-color: #5BABE6;
      text-align: center;
      margin: 12px auto 0;
      cursor: pointer;
      &:hover {
        background-color: #FF9900;
      }
    }
    .info-text-name {
      margin-bottom: 12px;
      margin-left: 10px;
      .name {
        font-size: 22px;
        color: #217fbc;
        font-weight: bold;
        vertical-align: middle;
      }
      .info-badge {
        background: #ea4b35;
        border-radius: 4px;
        color: #fff;
        padding: 5px;
        position: relative;
        &:before {
          content: "";
          width: 0;
          height: 0;
          position: absolute;
          top: 3px;
          right: -12px;
          border-top: 12px solid transparent;
          border-left: 12px solid #ea4b35;
          border-bottom: 12px solid transparent;
        }
      }
    }
    .info-text-box {
      display: flex;
      label {
        min-height: 28px;
        line-height: 28px;
        padding: 0 8px;
        background-color: #F2F2F2;
        margin-bottom: 2px;
      }
      span.lable-text-input {
        line-height: 28px;
        width: 65%;
      }
      &.label-box {
        label {
          height: 38px;
          line-height: 38px;
        }
        span {
          line-height: 22px;
          padding: 0 10px;
          margin-top: 7px;
          height: 25px;
          margin-right: 6px;
          background-color: #FF9900;
        }
      }
    }
  }

  .info-box-hr {
    padding-top: 10px;
    height: 25px;
    .info-line {
      width: 100%;
      height: 4px;
      background-color: #F2F2F2;
    }
    .info-line-title {
      position: absolute;
      margin-top: -14px;
      padding-right: 10px;
      background-color: #fff;
    }
  }

  .info-table-list {
    padding-left: 10px;
    line-height: 35px;
    a {
      margin-right: 15px;
    }
  }

</style>


<script>
  import cardHeader from './card-header.vue'
  import mixin from '../../../../utils/mixin'
  import {
    CAR_INFO_SB,
    //    CAR_RELETE_SOURCE,
    SYS_LABEL_GET_SYS_LABELS_KEYWORD
  } from '../../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [mixin],
    data() {
      return {
        dossierLoading: true,
        carData: null,
        resources: [],
        tages: []
      }
    },
    props: ['carKey', 'jdcfdjddjh'],
    components: {
      cardHeader
    },
    watch: {},
    methods: {
      loadData() {
        let count = 0,
          self = this
        this.dispatch(CAR_INFO_SB, { cphm: this.carKey, jdcfdjddjh: this.jdcfdjddjh }).then(() => {
          this.carData = this.dossier.CarInfoSB[0]
          bus.$emit('allCarLoading')
          if (this.carData !== null && this.carData !== '') {
            bus.$emit('getClsbdh', this.carData.clsbdh)
            bus.$emit('getCarModel', this.carData.clxh)
          }
          this.dossierLoading = false
          count++
          checkLoading()
        })
        //      this.dispatch(CAR_RELETE_SOURCE, { cphm: this.carKey }).then(() => {
        //        this.resources = this.dossier.carReleteSource
        //        // console.log(this.carData)
        //        bus.$emit('allCarLoading')
        //        console.log(7)
        //        count++
        //        checkLoading()
        //      })
        this.dispatch(SYS_LABEL_GET_SYS_LABELS_KEYWORD, { Keyword: this.$router.history.current.query.key, LabelType: '1' }).then(() => {
          this.tages = this.sysLabel.SysLabelGetSysLabelsKeyword
          // console.log(this.sysLabel.SysLabelGetSysLabelsKeyword)
          bus.$emit('allCarLoading')
          this.dossierLoading = false
          count++
          checkLoading()
        })

        function checkLoading() {
          if (count === 3) self.dossierLoading = false
        }
      }
    },
    created() {
      this.loadData();
    },
    computed: {
      ...mapState(['dossier', 'sysLabel'])
    }
  }

</script>
