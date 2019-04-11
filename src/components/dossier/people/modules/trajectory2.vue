<!-- 轨迹规律统计 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'轨迹规律('+gldata.length+'条结果)'" :expand="true" @on-update-expand="updateExpand" :tableData="tableData"></card-header>
  <!-- 内容 -->
  <div v-show="expandMark">
    <div v-loading='trajectLoading' v-if="gldata.length > 0">
      <el-row :gutter="15" class="kinship-box">
        <el-table class="app-table" border stripe :data="gldata" @cell-mouse-enter="cellMouseEnter">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column label="地址" prop="jsddmc" width="300" align="center"></el-table-column>
          <el-table-column v-for="(itemT,indexT) in tab" :key="indexT" :prop="itemT.prop" :label="itemT.label" align="center"></el-table-column>
        </el-table>
      </el-row>
    </div>
    <div v-loading='trajectLoading' v-else style="position: relative">
      <div class="empty_h">
        <div class="empty "></div>
      </div>
    </div>
    <el-row :gutter="15" v-show="gldata.length > 0" style="border-top:1px solid #d7d7d7; padding: 0;">
      <el-col :span="24">
        <!-- <div class="card-sub-title">时光轨迹</div> -->
        <div class="card-sub-title" @click="displayDetail">查看详情
          <i :class="{'iconfont':true,'icon-unfold1':!detailFlag, 'icon-packup-2':detailFlag}"></i>
        </div>
      </el-col>
      <el-col v-if="timeLine.length > 0 && detailFlag">
        <time-line v-loading="dossierLoading" :timeLine="timeLine" :span="24"></time-line>
      </el-col>
      <el-col :span="24" v-else-if="timeLine.length === 0 && detailFlag">
        <div class="empty_h">
          <div class="empty "></div>
        </div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .kinship-box {
    text-align: center;
    margin-top: 13px;
  }

  .gjfx_ul li {
    list-style: none;
    margin: 0 0 15px;
    padding: 0;
    float: left;
    width: 10%;
    text-align: center;
    .gj_bg {
      width: 67px;
      height: 67px;
      line-height: 86px;
      margin: 0 auto;
      border-radius: 5px;
      color: #fff;
      &.gj_bg1 {
        background: #69ca94;
      }
      &.gj_bg2 {
        background: #7fb5d8;
      }
      &.gj_bg3 {
        background: burlywood;
      }
      &.gj_bg4 {
        background: bisque;
      }
      &.gj_bg5 {
        background: burlywood;
      }
      &.gj_bg6 {
        background: #7fb5d8;
      }
    }
    span {
      margin-top: 5px;
      display: inline-block;
      color: #fd6d6d;
    }
  }

  .card-sub-title {
    color: #46bbfb;
    float: right;
    padding: 15px 0;
    cursor: pointer;
  } // .card-sub-title:nth-child(2) {
  //   float: right;
  //   cursor: pointer;
  // }
  .empty_h {
    height: 113px;
  }

  .qy_box {
    overflow: auto;
    border: 1px solid #e5e5e5;
    height: 177px;
    margin-bottom: 10px;
    .qy_title {
      background: #75c8ff;
      text-align: center;
      color: #fff;
      padding: 58px 0;
      .iconfont {
        font-size: 38px;
      }
    }
    .qy_body {
      background: #fafafa;
    }
    .qu_ul {
      padding: 0;
      margin: 5px;
      li {
        color: #666;
        list-style: none;
        display: inline-block;
        width: 49%;
        margin-bottom: 7px;
        &:first-child {
          margin-bottom: 0;
        }
        label {
          width: calc(100% - 46px);
          display: inline-block;
          vertical-align: top;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span {
          color: #75c8ff;
          margin-right: 25px;
          float: right;
        }
      }
    }
  }

</style>


<script>
  import timeLine from './time_line.vue'
  import cardHeader from './card-header.vue'
  import { mapState } from 'vuex'
  import dossierMixin from '../../dossierMixin'
  import { FETCH_ANALYSIS_TIMELINE, GET_GJGL } from '../../../../store/types'
  // import {} from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import chartsOps from '../../../../utils/echartsOptions/all'
  import { clone } from '../../../../utils/util'
  import bus from '../../../../utils/bus'
  import mixin from '../../../../utils/mixin'
  import '../../../../utils/dateFormat'
  export default {
    mixins: [dossierMixin, chartsOps, mixin],
    components: {
      cardHeader,
      echarts,
      timeLine
    },
    computed: {
      ...mapState(['analysisTimeline', 'analysisLocus', 'dossier']),
      timeLineLength() {
        let num = 0;
        this.timeLine.map(item => {
          num = num + item.detailed.length
        })
        return num
      },
      tableData() {
        return this.gldata.length ? this.gldata : this.timeLine
      }
    },
    data() {
      return {
        trajectLoading: true,
        dossierLoading: true,
        detailFlag: false,
        gldata: [],
        tab: [
          // { label: '地址', prop: 'jsddmc' },
          { label: '类型', prop: 'type' },
          { label: '首次', prop: 'sclx' },
          { label: '最后', prop: 'zhlx' },
          { label: '停留天数', prop: 'ts' },
          { label: '次数', prop: 'tlcs' }
          // { label: '私密', prop: 'smlx' },
          // { label: '工作', prop: 'gzlx' },
          // { label: '饭时', prop: 'fslx' },
          // { label: '出入境', prop: 'crjlx' },
          // { label: '通话', prop: 'thlx' },
          // { label: '资金往来', prop: 'zjwl' },
          // { label: '上网', prop: 'wblx' },
          // { label: '高铁', prop: 'gtlx' },
          // { label: '航班', prop: 'hblx' }
        ],
        trail: [{
          name: '全部',
          number: 0,
          bg: 'gj_bg1',
          icon: 'icon-hangkongyunshu'
        }, {
          name: '旅业',
          number: 0,
          bg: 'gj_bg2',
          icon: 'icon-jiudian'
        }, {
          name: '网吧',
          number: 0,
          bg: 'gj_bg3',
          icon: 'icon-web'
        }, {
          name: '铁路',
          number: 0,
          bg: 'gj_bg4',
          icon: 'icon-huoche'
        }, {
          name: '航班',
          number: 0,
          bg: 'gj_bg5',
          icon: 'icon-hangkongyunshu'
        }, {
          name: '游轮',
          number: 0,
          bg: 'gj_bg6',
          icon: 'icon-youlun'
        }],
        barTestOpsArea: {},
        barOpsArea: null,
        timeLine: [],
        option: null,
        hotelArr: [],
        base: {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data: ['雷达图'],
            show: false
          },
          radar: [{
            indicator: [],
            center: ['45%', '50%'],
            radius: 120,
            startAngle: 90,
            name: {
              textStyle: {
                color: '#666'
              }
            },
            splitNumber: 4,
            shape: 'circle',
            splitArea: {
              areaStyle: {
                color: ['rgba(114, 172, 209, 0.2)', 'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)', 'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 10
              }
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            }
          }],
          series: [{
            name: '雷达图',
            type: 'radar',
            itemStyle: {
              normal: {
                color: '#1c7dc6',
                borderColor: '#0274b0'
              }
            },
            label: {
              normal: {
                show: true,
                formatter: function(params) {}
              }
            },
            data: [{ value: [], name: '雷达图' }]
          }]
        },
        echarts: null
        // [{type: true,
        // year: '2016',
        // detailed: [{
        //   time: '08/18',
        //   room: '501',
        //   address: '湖南怀化市东风长街11号',
        //   startroom: '2017/8/18 14:57',
        //   endroom: '2017/8/18 14:58',
        //   moreUrl: '../more'
        // }, {
        //   time: '08/19',
        //   room: '501',
        //   address: '湖南怀化市东风长街11号',
        //   startroom: '2017/8/18 14:57',
        //   endroom: '2017/8/18 14:58',
        //   moreUrl: '../more'
        // }]}]

      }
    },
    props: ['caseKey', 'zdyData'],
    mounted() {
      //      this.barTestOpsArea = clone(this.echartsBarOptions.base)
      //      this.barTestOpsArea.xAxis.data = ['网吧', '旅业']
      //      // this.barTestOpsArea.legend.data = ['人员数量', '人员类型增量']
      //      var AreaTemp = [{
      //        name: '统计数量',
      //        type: 'bar',
      //        barWidth: 15,
      //        stack: '月份',
      //        data: [1413, 10]
      //      }];
      //      this.barTestOpsArea.series = AreaTemp
    },
    methods: {
      displayDetail() {
        this.detailFlag = !this.detailFlag
      },
      loadData() {
        if (this.checkRule('gjfx/sjz/list', true) && this.checkRule('topic/gjfx/getgjgl', true)) {
          this.getTimeline()
          this.featchGj()
        } else {
          bus.$emit('allLoading')
          this.dossierLoading = false
        }
      },
      /**
       * 轨迹分析
       */
      featchGj() {
        this.dispatchDossier(GET_GJGL, {
          zjhm: this.caseKey
        }).then(() => {
          console.log(this.dossier.getGJGL, 'this.dossier.getGJGl 444444444444444')
          let result = clone(this.dossier.getGJGL)
          this.dossier.getGJGL.map((item, index) => {
            if (item.gtlx > 0 && item.hblx > 0) {
              let items = clone(item)
              items.gtlx = 0;
              items.hblx = 0;
              let elementGt = clone(items)
              elementGt.gtlx = item.gtlx
              // elementGt.jsddmc = item.jsddmc + '(高铁)'
              let elementHb = clone(items)
              elementHb.hblx = item.hblx
              // elementHb.jsddmc = item.jsddmc + '(航班)'
              let num = this.getIndex(item, result)
              result.splice(num, 1, elementGt, elementHb)
            }
            //  else if (item.gtlx > 0 && item.hblx <= 0) {
            //   let num = this.getIndex(item, result)
            //   result[num].jsddmc = result[num].jsddmc + '(高铁)'
            // } else if (item.hblx > 0 && item.gtlx <= 0) {
            //   let num = this.getIndex(item, result)
            //   result[num].jsddmc = result[num].jsddmc + '(航班)'
            // }
          })
          result.map((item, index) => {
            if (item.gtlx >= 1) {
              item.type = '高铁'
            } else if (item.hblx >= 1) {
              item.type = '航班'
            } else if (item.wblx >= 1) {
              item.type = '上网'
            } else if (item.crjlx >= 1) {
              item.type = '出入境'
            }
          })
          this.gldata = result
          this.trajectLoading = false
        })
      },
      getIndex(val, arr) {
        let num = false;
        arr.map((item, index) => {
          if (item.gtlx === val.gtlx && item.hblx === val.hblx && item.jsddmc === val.jsddmc) {
            num = index;
            return
          }
        })
        return num;
      },
      // 时间轴
      getTimeline() {
        let newYear = new Date().getFullYear(),
          lastYear = newYear - 1,
          preYear = lastYear - 1,
          newYeararr = [],
          lastYeararr = [],
          preYeararr = [],
          monthDay = this.dateFormat(new Date(), 'MMdd'),
          vendtime = newYear.toString() + monthDay,
          vstarttime = preYear.toString() + monthDay;
        this.dispatchDossier(FETCH_ANALYSIS_TIMELINE, {
          v_zjhm: this.caseKey,
          v_starttime: vstarttime,
          v_endtime: vendtime,
          v_xzqh: '',
          v_gjz: '',
          type: 'personFile'
        }).then(() => {
          bus.$emit('allLoading')
          if (this.analysisTimeline.list !== null && this.analysisTimeline.list.length > 0) {
            // 数据按照年份分组
            this.analysisTimeline.list.map(d => {
              d.month = d.kssj.split('-')[1] + '-' + d.kssj.split('-')[2].substr(0, 3)
              if (d.kssj.split('-')[0] === newYear.toString()) {
                newYeararr.push({
                  time: d.month,
                  room: d.wzh,
                  hotel: d.csms ? d.csms : '',
                  address: d.csmc,
                  startroom: d.kssj,
                  endroom: d.jssj,
                  type: d.gjlxdm,
                  name: d.xm,
                  number: d.csbh,
                  jsddmc: d.jsddmc,
                  ksddmc: d.ksddmc,
                  show: true
                })
              } else if (d.kssj.split('-')[0] === lastYear.toString()) {
                lastYeararr.push({
                  time: d.month,
                  room: d.wzh,
                  hotel: d.csms ? d.csms : '',
                  address: d.csmc,
                  startroom: d.kssj,
                  endroom: d.jssj,
                  type: d.gjlxdm,
                  name: d.xm,
                  number: d.csbh,
                  jsddmc: d.jsddmc,
                  ksddmc: d.ksddmc,
                  show: true
                })
              } else {
                preYeararr.push({
                  time: d.month,
                  room: d.wzh,
                  hotel: d.csms ? d.csms : '',
                  address: d.csmc,
                  startroom: d.kssj,
                  endroom: d.jssj,
                  type: d.gjlxdm,
                  name: d.xm,
                  number: d.csbh,
                  jsddmc: d.jsddmc,
                  ksddmc: d.ksddmc,
                  show: true
                })
              }
            })
            this.$nextTick(() => {
              this.timeLine.push({
                type: true,
                year: newYear,
                detailed: newYeararr
              }, {
                type: false,
                year: lastYear,
                detailed: lastYeararr
              })
              // {type: false,
              // year: lastYear,
              // detailed: preYear}
            })
            this.dossierLoading = false
          } else {
            this.dossierLoading = false
          }
        })
      }
    },
    created() {
      this.loadData();
    },
    watch: {
      gldata(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '轨迹规律', 'number': val.length })
      }
    }
  }

</script>
