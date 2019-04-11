<!-- 轨迹规律统计 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="轨迹规律"></card-header>
  <!-- 内容 -->
  <div v-loading='trajectLoading' v-if="gldata.length > 0">
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <ul class="gjfx_ul">
          <li v-for="(item,i) in trail" :key="i">
            <div class="gj_bg " :class="item.bg"><i class="iconfont  " :class="item.icon" style="font-size:35px;"></i>
            </div>
            {{item.name}} <span>{{item.number}}</span>
          </li>

        </ul>
      </el-col>
    </el-row>
    <el-row :gutter="0" style="border-top:1px solid #d7d7d7; padding: 0;">
      <el-col :span="12" style="border-right:1px solid #d7d7d7">
        <div class="card-sub-title" style="padding-top: 15px;"></div>
        <div>
          <echarts :option="option" style="width:100%; height:480px;"></echarts>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="0">
          <el-col :span="24">
            <div class="card-sub-title" style="padding: 15px; ">统计分析</div>
            <echarts :option="barOpsArea" style="width:100%; height:225px;"></echarts>
          </el-col>
          <el-col :span="24" style="border-top:1px solid #d7d7d7; padding: 15px 15px;">
            <el-row :gutter="15" class="qy_box">
              <el-col :span="6" class="qy_title">
                <div class="iconfont icon-city"></div>
                常住酒店
              </el-col>
              <el-col :span="18" class="qy_body">
                <ul class="qu_ul">
                  <li v-for="(itemcs,i) in hotelArr" :key="i"><label>{{i+1}}.{{itemcs.csmc === null ? (itemcs.csbh + '(酒店编号)' ) : itemcs.csmc}} </label><span>{{itemcs.tjsl}}</span></li>
                </ul>
              </el-col>
            </el-row>

          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <div v-else style="position: relative">
    <div class="empty_h">
      <div class="empty "></div>
    </div>
  </div>
  <el-row :gutter="15" style="border-top:1px solid #d7d7d7; padding: 0;">
    <el-col :span="24">
      <div class="card-sub-title" style="padding: 15px 0;">时光轨迹</div>
    </el-col>
    <el-col v-loading="dossierLoading" v-if="timeLine.length > 0">
      <time-line :timeLine="timeLine" :span="24"></time-line>
    </el-col>
    <el-col :span="24" v-else>
      <div class="empty_h">
        <div class="empty "></div>
      </div>
    </el-col>

  </el-row>
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
  }

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
  import { FETCH_ANALYSIS_TIMELINE, FETCH_LOCUS } from '../../../../store/types'
  import { clone } from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import chartsOps from '../../../../utils/echartsOptions/all'
  import bus from '../../../../utils/bus'
  import '../../../../utils/dateFormat'
  export default {
    mixins: [dossierMixin, chartsOps],
    components: {
      cardHeader,
      echarts,
      timeLine
    },
    computed: {
      ...mapState(['analysisTimeline', 'analysisLocus'])
    },
    data() {
      return {
        trajectLoading: true,
        dossierLoading: true,
        gldata: [],
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
                color: ['rgba(114, 172, 209, 0.2)',
                  'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                  'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'
                ],
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
                formatter: function(params) {
                  // console.log('params', params);
                }
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
      loadData() {
        if (this.checkRule('gjfx/sjz/list', true) === true && this.checkRule('topic/gjfx/listgl', true) === true) {
          this.getTimeline()
          // this.getFetchlocus()
        } else {
          bus.$emit('allLoading')
          this.dossierLoading = false;
        }
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
                  address: d.csmc,
                  startroom: d.kssj,
                  endroom: d.jssj,
                  type: d.gjlx,
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
                  address: d.csmc,
                  startroom: d.kssj,
                  endroom: d.jssj,
                  type: d.gjlx,
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
                  address: d.csmc,
                  startroom: d.kssj,
                  endroom: d.jssj,
                  type: d.gjlx,
                  name: d.xm,
                  number: d.csbh,
                  jsddmc: d.jsddmc,
                  ksddmc: d.ksddmc,
                  show: true
                })
              }
            })
            this.timeLine.push({
              type: true,
              year: newYear,
              detailed: newYeararr
            }, {
              type: false,
              year: lastYear,
              detailed: lastYeararr
            }, {
              type: false,
              year: preYear,
              detailed: preYeararr
            })
            this.dossierLoading = false
          } else {
            this.dossierLoading = false
          }
        })
        // 规律分析
        var AreaTemp = [{
          name: '统计数量',
          type: 'bar',
          barWidth: 15,
          stack: '月份',
          data: []
        }]
        this.barTestOpsArea = clone(this.echartsBarOptions.base)
        this.barTestOpsArea.xAxis.data = []
        this.dispatchDossier(FETCH_LOCUS, {
          zjhm: this.caseKey,
          kssj: vstarttime,
          jssj: vendtime,
          V_type: 1
        }).then(() => {
          this.gldata = this.analysisLocus.list.zgs
          bus.$emit('allLoading')
          if (this.analysisLocus.list.zgs.length > 0) {
            this.echarts = this.analysisLocus.list
            this.analysisLocus.list.zgs.forEach(d => {
              if (d.gjlx === 'LY') {
                this.trail[1].number = d.tjsl
              }
              if (d.gjlx === 'WB') {
                this.trail[2].number = d.tjsl
              }
              if (d.gjlx === 'TL') {
                this.trail[3].number = d.tjsl
              }
              if (d.gjlx === 'HB') {
                this.trail[4].number = d.tjsl
              }
              if (d.gjlx === 'YL') {
                this.trail[5].number = d.tjsl
              }
            })
            for (let i = 1; i < this.trail.length; i++) {
              this.trail[0].number = this.trail[0].number + this.trail[i].number
            }
            this.hotelArr = this.analysisLocus.list.cs.filter(r => r.gjlx.includes('LY')) // 旅店次数数据
            this.analysisLocus.list.zgs.map(d => {
              switch (d.gjlx) {
                case 'WB':
                  this.base.radar[0].indicator.push({ text: '网吧' })
                  this.barTestOpsArea.xAxis.data.push('网吧')
                  break;
                case 'LY':
                  this.base.radar[0].indicator.push({ text: '旅业' })
                  this.barTestOpsArea.xAxis.data.push('旅业')
                  break;
                case 'HB':
                  this.base.radar[0].indicator.push({ text: '航班' })
                  this.barTestOpsArea.xAxis.data.push('航班')
                  break;
                case 'TL':
                  this.base.radar[0].indicator.push({ text: '铁路' })
                  this.barTestOpsArea.xAxis.data.push('铁路')
                  break;
                case 'YL':
                  this.base.radar[0].indicator.push({ text: '游轮' })
                  this.barTestOpsArea.xAxis.data.push('游轮')
                  break;
              }
              this.base.series[0].data[0].value.push(d.tjsl)
              AreaTemp[0].data.push(d.tjsl)
            })
            this.option = this.base
            this.barTestOpsArea.series = AreaTemp
            this.barOpsArea = this.barTestOpsArea
            // this.$nextTick(() => {
            this.trajectLoading = false
            // })
          } else {
            this.barOpsArea = this.barTestOpsArea
            // this.$nextTick(() => {
            this.trajectLoading = false
            // })
          }
        })
      }
    },
    created() {
      this.loadData();
    }
  }

</script>
