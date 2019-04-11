<!-- 概况(统计) -->
<template>
<div class="analysisPeople">
  <div style="height:25px">
    <!-- <el-button title="快照" class="iconfont icon-image" @click="snapshot.isTF=true" style="position: fixed;right: 22%;top:8.2%;z-index:999;opacity: 0.35"></el-button> -->
    <breifPopover contentId="d36a1d38490f416ca19ec6799106728b" style="padding-top:5px;float:right"></breifPopover>
    <el-button type="text" class="export-text iconfont icon-image" style="float:right;font-size: 16px;" @click="snapshot.isTF=true">快照</el-button>
    <!-- <el-button type="text" class="export-text iconfont icon-dayin" style="float:right" @click="print">打印</el-button> -->

    <print-button btnType="text" class="print-text iconfont icon-dayin" style="float:right;font-size: 16px;" :beforePrint="beforePrint" :afterPrint="afterPrint" printRange="print-list-ref"></print-button>
  </div>
  <div ref="count-list-ref" id="count-list-ref" style="height:1820px">
    <!-- startprint -->
    <div ref="print-list-ref" id="print-list-ref">
      <el-row :gutter="15">
        <el-col :span="24">
          <el-row :gutter="0">
            <el-col :span="24" style="height: 445px;">
              <!--人员类型统计分析-->
              <statistics :chartData="chartData" title="重点群体人员" ref="statistics"></statistics>
            </el-col>
            <!-- <el-button title="快照" class="iconfont icon-image" @click="snapshot.isTF=true" style="position: fixed;right:20px;top:71px;z-index:999;opacity: 0.35"></el-button> -->
          </el-row>
        </el-col>

        <el-col :span="24">
          <el-row :gutter="0">
            <el-col :span="24" style="height: 445px;">
              <!--重点场所统计-->
              <industry :chartData="chartData" title="重点场所部位" ref="industry"></industry>
            </el-col>

          </el-row>
        </el-col>

        <el-col :span="24">
          <el-row :gutter="0">
            <el-col :span="24" style="height: 445px;">
              <!--重点行业单位-->
              <org :chartData="chartData" title="重点行业单位" ref="org"></org>
            </el-col>

          </el-row>
        </el-col>

        <el-col :span="24">
          <el-row :gutter="0">
            <el-col :span="24" style="height: 445px;">
              <!--重点车辆管控-->
              <car :chartData="chartData" title="重点车辆管控" ref="car"></car>
            </el-col>

          </el-row>
        </el-col>


      </el-row>
    </div>
    <!-- endprint -->
  </div>
  <!-- 快照 -->
  <html-to-image :height="snapshot.height" :printName="snapshot.name" :el="snapshot.el" :submit="snapshot.isTF" @generate="generateState"></html-to-image>
  <!-- 打印 -->


</div>
</template>

<style lang="scss" scoped>
  .analysisPeople {
    height: 100%;
    overflow: auto;
    padding: 10px;
    background-color: #f5f5f5;
  }

  .el-col {
    padding-bottom: 10px;
  }

</style>
<style scoped lang="scss">
  .header-tool {
    overflow: hidden;
    border-bottom: 2px solid #46BDFD;
    color: #46BDFD;
    position: relative;
    .expandMark {
      float: right;
      font-size: 18px;
    }
  }

  .d-sub-title {
    float: right;
    font-size: 14px;
    line-height: 45px;
  }

  .text-c {
    text-align: center;
  }

  .handle-tool {
    float: right;
    padding: 0;
    margin: 9px;
    dd {
      float: right;
      width: 65px;
      height: 28px;
      background-color: #46BDFD;
      line-height: 28px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      .print-text {
        padding: 0;
        color: #fff;
        font-size: 20px;
        width: 100%;
        height: 100%;
      }
      &.bg-yello {
        background-color: #FF9900;
      }
      .export-text {
        padding: 0;
        color: #fff;
        font-size: 20px;
        width: 100%;
        height: 100%;
        &.icon-plus {
          background-color: #f90;
        }
      }
      &:hover {
        background-color: #ff9900;
      }
    }
    .icon-move:before {
      margin-right: 3px;
    }
    .icon-save:before {
      margin-right: 3px;
    }
    .icon-export:before {
      margin-right: 3px;
    }
  }

  .mar-t {
    margin-top: 15px;
  }

  .header-tool.header-border {
    border-bottom: 1px solid #eee;
    .d-sub-title {}
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import printButton from '../../../widgets/print/print.vue'
  import chinaMap from './echars/chinaMap'
  import breakRules from './echars/break-rules'
  import ranking from './echars/ranking'
  import controlType from './echars/control-type'
  import controlNum from './echars/control-num'
  import statistics from './echars/people-statistics'
  import industry from './echars/industry-statistics'
  import org from './echars/org-statistics'
  import car from './echars/car-statistics'
  import peopleType from './echars/people-type'
  import trend from './echars/control-trend'
  import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
  import breifPopover from '../../../widgets/brief-popover/brief-popover.vue'
  import { mapState } from 'vuex'
  import {
    FXPCGK_MAIN_PAGE_LIST
  } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      chinaMap,
      breakRules,
      ranking,
      controlType,
      controlNum,
      industry,
      htmlToImage,
      org,
      car,
      peopleType,
      statistics,
      printButton,
      breifPopover,
      trend
    },
    data() {
      return {
        chartData: {
          people: {},
          car: {},
          place: {},
          org: {}
        },
        printRan: this.$('#count-list-ref')[0],
        snapshot: { // 研判报告快照参数初始化
          isTF: false,
          name: '隐患概况',
          height: 1900,
          el: this.$('#count-list-ref')[0]
        }
      }
    },
    computed: {
      ...mapState(['focusChart'])
    },
    watch: {},
    methods: {
      beforePrint(next) {
        console.log('226 before print')
        let statisticsP = this.makeImage(this.$refs.statistics);
        let industryP = this.makeImage(this.$refs.industry);
        let orgP = this.makeImage(this.$refs.org);
        let carP = this.makeImage(this.$refs.car);
        Promise.all([statisticsP, industryP, orgP, carP]).then(() => {
          next();
        })
        // this.$('#testImg').append('<img src="/static/img/zcsz.png"/>');
      },
      afterPrint() {
        console.log('afterPrint')
        this.deleteImage();
      },
      makeImage(obj) {
        new Promise((resolve, reject) => {
          obj.echartImg = obj.$refs.echart.makeImage();
        })
      },
      deleteImage() {
        this.$refs.statistics.echartImg = '';
        this.$refs.industry.echartImg = '';
        this.$refs.org.echartImg = '';
        this.$refs.car.echartImg = '';
      },
      /**
       * 快照导出触发
       * 用了jq $
       */
      exportSnapshot(r) {
        this.caseChartImgShow = true;
        // let _tDom = this.$('#' + r).clone().appendTo(document.body)
        // if(_tDom) {
        // this.$('.handle-tool').css({ 'display': 'none' })
        // this.$('.add-box-button').css({ 'display': 'none' })
        // _tDom.css('width', this.$('#' + r).width());
        // this.snapshot.height = outerHeight(_tDom[0])
        this.snapshot.height = 1900
        this.snapshot.el = this.$('#count-list-ref')[0]
        this.$nextTick(_ => {
          this.snapshot.isTF = true
        })
        // }
      },
      generateState(type) {
        this.caseChartImgShow = false;
        this.snapshot.height = 1900
        this.snapshot.el = this.$('#count-list-ref')[0]
        // 快照生成结束,状态重置
        // this.$('.handle-tool').css({ 'display': 'block' })
        // this.$('.add-box-button').css({ 'display': 'block' })
        this.snapshot.isTF = false
        // this.$(this.snapshot.el).remove();
      }
    },
    created() {},
    mounted() {
      this.snapshot.el = this.$('#count-list-ref')[0]
      this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'danger' }).then(d => {
        this.chartData = this.focusChart.fxpcgkMainPageList
      })
    }
  }

</script>
