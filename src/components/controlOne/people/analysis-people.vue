<!-- 概况(统计) -->
<template>
<div class="analysisPeople" ref="dossier-list-ref" id="dossier-list-ref" style="height:1900px">
  <el-row :gutter="10" class="handle-tool">
    <el-button type="text" class="export-text iconfont icon-image" style="margin:0px 10px;float:right;font-size: 16px;" @click="exportSnapshot">快照</el-button>
    <print-button btnType="text" class="print-text iconfont icon-dayin" style="float:right;font-size: 16px;"  :beforePrint="beforePrint" :afterPrint="afterPrint" printRange="print-list-ref"></print-button>
    <html-to-image :height="snapshotHeight" :el="snapshotDOM" :printName="snapshotName" :submit="snapshot" @generate="generateState"></html-to-image>
    <!-- <print-button btnType="text" class="print-text iconfont icon-dayin" :beforePrint="beforePrint" :afterPrint="afterPrint" printRange="dossier-list-ref"></print-button> -->
  </el-row>
  <div ref="print-list-ref" id="print-list-ref">
    <el-row :gutter="10" style="height:600px;overflow: hidden;">
      <el-col :span="6">
        <el-row :gutter="0">
          <el-col :span="24" style="height: 300px;">
            <!--人员类型统计分析-->
            <statistics :echartdata='chartData' title="重点人员类型统计分析" ref="statistics"></statistics>
          </el-col>
          <el-col :span="24" style="height: 300px">
            <!--近一年重点人员增长趋势-->
            <breakRules :echartdata='chartData' title="重点人员各类型近一年增长趋势" ref="breakRules"></breakRules>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" style="height: 600px">
        <!--人员籍贯热点分布图-->
        <chinaMap :echartdata='chartData' title="重点群体人员归属地热点分布" ref="chinaMap"></chinaMap>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="0">
          <el-col :span="24" style="height:300px;">
            <!--重点人员比例-->
            <peopleType :echartdata='chartData' title="重点人员比例分析" ref="peopleType"></peopleType>
          </el-col>
          <el-col :span="24" style="height:300px;">
            <!--近三年重点人员类型同比分析-->
            <ranking :echartdata='chartData' title="近三年重点人员各类型数量同比分析" ref="ranking"></ranking>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <!--<el-col :span="6" style="height:310px;">-->
      <!--&lt;!&ndash;重点人员增长趋势&ndash;&gt;-->
      <!--<trend></trend>-->
      <!--</el-col>-->
      <el-col :span="12" style="height:310px;">
        <!--近三年重点人员数量同比分析-->
        <controlNum :echartdata='chartData' title="近三年各月份重点人员各类型增量分析" ref="controlNum"></controlNum>
      </el-col>
      <el-col :span="12" style="height:310px;">
        <!--辖区重点人员类型分布-->
        <controlType :echartdata='chartData' title="各辖区各类型重点人员分布数据" ref="controlType"></controlType>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="height:600px;overflow: hidden;">
      <el-col :span="6">
        <el-row :gutter="0">
          <el-col :span="24" style="height: 300px;">
            <!--人员类型统计分析-->
            <statistics :cardata='carData' title="重点车辆类型统计分析" ref="statistics1"></statistics>
          </el-col>
          <el-col :span="24" style="height: 300px">
            <!--近一年重点人员增长趋势-->
            <breakRules :cardata='carData' title="重点车辆各类型近一年增长趋势" ref="breakRules1"></breakRules>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" style="height: 600px">
        <!--人员籍贯热点分布图-->
        <chinaMap :cardata='carData' title="重点车辆归属地热点分布" ref="chinaMap1"></chinaMap>
      </el-col>
      <el-col :span="6">
        <el-row :gutter="0">
          <el-col :span="24" style="height:300px;">
            <!--重点人员比例-->
            <peopleType :cardata='carData' title="重点车辆比例分析" ref="peopleType1"></peopleType>
          </el-col>
          <el-col :span="24" style="height:300px;">
            <!--近三年重点人员类型同比分析-->
            <ranking :cardata='carData' title="近三年重点车辆各类型数量同比分析" ref="ranking1"></ranking>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <!--<el-col :span="6" style="height:310px;">-->
      <!--&lt;!&ndash;重点人员增长趋势&ndash;&gt;-->
      <!--<trend></trend>-->
      <!--</el-col>-->
      <el-col :span="12" style="height:310px;">
        <!--近三年重点人员数量同比分析-->
        <controlNum :cardata='carData' title="近三年各月份重点车辆各类型增量分析" ref="controlNum1"></controlNum>
      </el-col>
      <el-col :span="12" style="height:310px;">
        <!--辖区重点人员类型分布-->
        <controlType :cardata='carData' title="各辖区各类型重点车辆分布数据" ref="controlType1"></controlType>
      </el-col>
    </el-row>
  </div>
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

<script>
  import {
    TJFX_PAGE_DATE
  }
  from '../../../store/types'
  import { mapState } from 'vuex'
  import printButton from '../../../widgets/print/print.vue'
  import mixin from '../../../utils/mixin'
  import chinaMap from './echars/chinaMap'
  import breakRules from './echars/break-rules'
  import ranking from './echars/ranking'
  import controlType from './echars/control-type'
  import controlNum from './echars/control-num'
  import statistics from './echars/people-statistics'
  import peopleType from './echars/people-type'
  import trend from './echars/control-trend'
  // import { closestRef } from '../../../utils/util'
  import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
  export default {
    mixins: [mixin],
    components: {
      chinaMap,
      printButton,
      breakRules,
      ranking,
      controlType,
      controlNum,
      peopleType,
      statistics,
      trend,
      htmlToImage
    },
    data() {
      return {
        snapshotHeight: 0,
        snapshotDOM: document.body,
        snapshotName: '统计分析',
        snapshot: false,
        chartData: '',
        carData: '',
        datemonth: [],
        breakRules: [],
        proporAnaly: {
          xb: [],
          rylx: [],
          fxdj: []
        }
      }
    },
    computed: {
      ...mapState(['focusChart'])
    },
    watch: {},
    methods: {
      beforePrint(next) {
        let statisticsP = this.makeImage(this.$refs.statistics);
        let breakRulesP = this.makeImage(this.$refs.breakRules);
        let chinaMapP = this.makeImage(this.$refs.chinaMap);
        let peopleTypeP = this.makeImage(this.$refs.peopleType);
        let rankingP = this.makeImage(this.$refs.ranking);
        let controlNumP = this.makeImage(this.$refs.controlNum);
        let controlTypeP = this.makeImage(this.$refs.controlType);
        let statistics1P = this.makeImage(this.$refs.statistics1);
        let breakRules1P = this.makeImage(this.$refs.breakRules1);
        let chinaMap1P = this.makeImage(this.$refs.chinaMap1);
        let peopleType1P = this.makeImage(this.$refs.peopleType1);
        let ranking1P = this.makeImage(this.$refs.ranking1);
        let controlNum1P = this.makeImage(this.$refs.controlNum1);
        let controlType1P = this.makeImage(this.$refs.controlType1);
        Promise.all([statisticsP, breakRulesP, chinaMapP, peopleTypeP, rankingP, controlNumP, controlTypeP, statistics1P, breakRules1P, chinaMap1P, peopleType1P, ranking1P, controlNum1P, controlType1P]).then(() => {
          next();
        })
        // this.$('#testImg').append('<img src="/static/img/zcsz.png"/>');
      },
      afterPrint() {
        this.deleteImage();
      },
      makeImage(obj) {
        new Promise((resolve, reject) => {
          obj.echartImg = obj.$refs.echart.makeImage();
        })
      },
      deleteImage() {
        this.$refs.statistics.echartImg = '';
        this.$refs.breakRules.echartImg = '';
        this.$refs.chinaMap.echartImg = '';
        this.$refs.peopleType.echartImg = '';
        this.$refs.ranking.echartImg = '';
        this.$refs.controlNum.echartImg = '';
        this.$refs.controlType.echartImg = '';
        this.$refs.statistics1.echartImg = '';
        this.$refs.breakRules1.echartImg = '';
        this.$refs.chinaMap1.echartImg = '';
        this.$refs.peopleType1.echartImg = '';
        this.$refs.ranking1.echartImg = '';
        this.$refs.controlNum1.echartImg = '';
        this.$refs.controlType1.echartImg = '';
      },
      getdataMonth() {
        let d = new Date()
        let result = []
        for (var i = 0; i < 12; i++) {
          d.setMonth(d.getMonth() - 1)
          let m = d.getMonth() + 1
          m = m < 10 ? '0' + m : m
          result.push(d.getFullYear() + '-' + m)
        }
        return result.reverse()
      },
      exportSnapshot() {
        // 开始导出
        // closestRef(this, 'dossier-list-ref', dom => {
        //   // this.snapshotHeight = outerHeight(dom)
        //   // this.snapshotDOM = dom
        //   // this.$('.handle-tool').css({ 'display': 'none' })
        //   // this.$('.dossier-list-context').css({ 'padding': '20px 10px' })
        //   // this.$nextTick(_ => {
        //   //   this.snapshot = true
        //   // })
        // })
        this.snapshotHeight = this.$('#dossier-list-ref').outerHeight();
        this.snapshotDOM = this.$('#dossier-list-ref')[0]
        this.$('.handle-tool').css({ 'display': 'none' })
        // this.$('.dossier-list-context').css({ 'padding': '20px 10px' })
        this.$nextTick(_ => {
          this.snapshot = true
        })
      },
      generateState(type) {
        // 快照生成结束,状态重置
        this.$('.handle-tool').css({ 'display': 'block' })
        // this.$('.dossier-list-context').css({ 'padding': '20px 0' })
        this.snapshot = false
      }
    },
    created() {
      console.log('创建');
      this.datemonth = this.getdataMonth()
      this.dispatch(TJFX_PAGE_DATE, { queryType: '1' }).then(() => {
        // console.log(this.focusChart.tjfxPageDate.breakRules)
        this.chartData = this.focusChart.tjfxPageDate
      })
      this.dispatch(TJFX_PAGE_DATE, { queryType: '2' }).then(() => {
        // console.log(this.focusChart.tjfxPageDate.breakRules)
        this.carData = this.focusChart.tjfxPageDate
      })
    },
    mounted() {}
  }

</script>
