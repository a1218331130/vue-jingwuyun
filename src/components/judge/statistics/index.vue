<!-- 概况(统计) -->
<template>
  <div>
    <div class="tactics">
      <el-row :gutter="10">
        <el-col :span="13" class="tactics__box-wrap">
          <div class="tactics__box--half">
            <el-row :gutter="10" style="height:100%">
              <el-col :span="12" style="height:100%" v-if="checkRule('ajgl/lawcase/type',true)">
                <div class="tactics__box__title">
                  案件类别数量图(近三年)
                </div>
                <div class="tactics__box__content">
                  <echarts :option="pieTestOps" style="width:100%; height:100%;"></echarts>
                </div>
              </el-col>
              <el-col :span="12" style="height:100%" v-if="checkRule('ajgl/lawcase/time',true)">
                <div class="tactics__box__title">
                  各时段案发数量比例图(近三年)
                </div>
                <div class="tactics__box__content">
                  <echarts :option="intervalPieTestOps" style="width:100%; height:100%;"></echarts>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="tactics__box--half" v-if="checkRule('ajgl/lawcase/anly',true)">
            <div class="tactics__box__title">
              近三年案发数量同比分析图(近三年)
            </div>
            <div class="tactics__box__content">
              <echarts :option="lineTestOps" style="width:100%; height:100%;"></echarts>
            </div>
          </div>
        </el-col>
        <el-col :span="11" class="tactics__box-wrap" v-if="checkRule('ajgl/lawcase/area',true)">
          <div class="tactics__box">
            <div class="tactics__box__title">
              案件数量区域统计图(近三年)
            </div>
            <div class="tactics__box__content rel">
              <!-- <echartsDetails :options="options"></echartsDetails> -->
              <echarts :option="mapTestOps" :mapdata="mapData" style="width:100%; height:100%"></echarts>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tactics {
    padding: 10px;
    &__base-info {
      height: 160px;
      border-top: 1px solid #ccc;
      &__item {
        line-height: 160px;
      }
    }

    &__box {
      &,
      &-wrap {
        height: calc(100vh - 80px);
      }
      & + & {
        margin-top: 10px;
      }
      &--half {
        @extend .tactics__box;
        height: calc(50% - 5px);
      }
      &--small {
        @extend .tactics__box;
        height: calc(40% - 5px);
        // height: calc(100vh - 600px);
      }
      &--list {
        @extend .tactics__box;
        height: calc(60% - 5px);
        border-top-width: 1px;
      }
      &__title {
        background: #85c0e9;
        color: #fff;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
      }
      &__content {
        background: #fff;
        height: 100%;
        // padding: 20px;
        overflow: hidden;
        border: 1px solid #ccc;
        .el-tabs {
          height: 100%;
          margin: 0;
          &__content {
            height: calc(100% - 42px);
            overflow: auto;
          }
        }
      }
      &__title + &__content {
        height: calc(100% - 40px);
        border-top: 0;
      }
    }

    &__list {
      overflow: auto;
      &__item {
        padding: 15px 30px;
        &__image {
          width: 50px;
          height: 50px;
          border: 5px solid #fff;
          border-radius: 100%;
          overflow: hidden;
          img {
            width: 100%;
            height: auto;
          }
        }
        &__title {
          color: #000;
          margin-bottom: 20px;
        }
        &__desc {
          color: #999;
        }
        &__count {
          text-align: right;
          color: #ff9900;
          margin-bottom: 20px;
        }
        &__author {
          text-align: right;
          color: #999;
        }
      }
    }
  }
</style>

<script>
  import echartsDetails from '../../../widgets/echarts/echart-details'
  import mixin from '../../../utils/mixin'
  import {mapState} from 'vuex'
  import {clone, getOnlyArray} from '../../../utils/util'
  import {
    FETCH_LAWCASE_ANLY,
    FETCH_LAWCASE_AREA,
    FETCH_LAWCASE_TIME,
    FETCH_LAWCASE_TYPE
  } from '../../../store/types'
  import _echarts from 'echarts';
  import echarts from '../../../widgets/echarts'
  import chartsOps from '../../../utils/echartsOptions/all'
  import mapData from '../../../utils/echartsOptions/mapData'

  export default {
    mixins: [mixin, chartsOps, mapData],
    components: {
      echarts,
      echartsDetails
    },
    data() {
      return {
        pieTestOps: null,
        intervalPieTestOps: null,
        lineTestOps: null,
        mapTestOps: null,
        isChange: 1,
        showDetail: true,
        options: {
          column: 'four',
          title: '案件区域数量统计图',
          head: ['名称', '立案数', '立案数'],
          list: [{id: 1, name: '会同县', alarm: '435', danger: '4234'},
            {id: 2, name: '辰溪县', alarm: '434', danger: '2234'},
            {id: 3, name: '鹤城区', alarm: '134', danger: '1234'},
            {id: 4, name: '中方县', alarm: '834', danger: '234'},
            {id: 5, name: '溆浦县', alarm: '1234', danger: '8834'},
            {id: 6, name: '沅陵县', alarm: '2234', danger: '224'},
            {id: 7, name: '麻阳苗族自治县', alarm: '234', danger: '4234'},
            {id: 8, name: '芷江侗族自治县', alarm: '234', danger: '834'},
            {id: 9, name: '洪江市', alarm: '234', danger: '634'}
          ]
        }
      }
    },
    computed: {
      ...mapState(['statistics'])
    },
    watch: {},
    methods: {
      showList() {
        this.showDetail = !this.showDetail;
      },
      change(val) {
        this.isChange = val
      }
    },
    created() {

    },
    mounted() {
      /**
       * [pieTestOps 获取近三年同比案发数量]
       * @type {[type]}
       */
      this.dispatch(FETCH_LAWCASE_ANLY, {}).then(() => {
        let nameList = [],
          valueList = [
            [],
            [],
            []
          ]
        for (let i = 1; i <= 12; i++) {
          nameList.push(i + '月')
          valueList[0].push(0)
          valueList[1].push(0)
          valueList[2].push(0)
        }
        let cate = []
        this.statistics.lawcaseAnly.forEach(d => {
          cate.push(d.NF)
        })
        let cateList = getOnlyArray(cate).sort()
        cateList.map((d, i) => {
          this.statistics.lawcaseAnly.filter(c => c.NF === d).forEach(d => {
            valueList[i][parseInt(d.YF) - 1] = d.TOTAL
          })
        })
        // 折线图数据
        var temps = [{
          name: cateList[0],
          type: 'line',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(236,21,98)'
            }
          },
          areaStyle: {
            normal: {
              color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(236,21,98)'
              }, {
                offset: 0.8,
                color: 'rgba(236,21,98,.1)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          data: []
        }, {
          name: cateList[1],
          type: 'line',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(253,139,69)'
            }
          },
          areaStyle: {
            normal: {
              color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(253,139,69)'
              }, {
                offset: 0.8,
                color: 'rgba(253,139,69,.1)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          data: []
        }, {
          name: cateList[2],
          type: 'line',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(33,178,75)'
            }
          },
          areaStyle: {
            normal: {
              color: new _echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(33,178,75)'
              }, {
                offset: 0.8,
                color: 'rgba(33,178,75,.1)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          data: []
        }];
        this.lineTestOps = clone(this.echartsLineOptions.situation)
        this.lineTestOps.xAxis.data = nameList
        console.log(temps);
        this.lineTestOps.series = temps
        this.lineTestOps.legend.data = cateList
        this.lineTestOps.series[0].data = valueList[0]
        this.lineTestOps.series[1].data = valueList[1]
        this.lineTestOps.series[2].data = valueList[2]
      })
      /**
       * [pieTestOps 获取区域案发数量]
       * @type {[type]}
       */
      this.dispatch(FETCH_LAWCASE_AREA, {}).then(() => {
        // 地图数据
        let list = this.statistics.lawcaseArea.map(d => {
          return {
            name: d.NAME,
            value: d.VALUE
          }
        })
        this.mapTestOps = clone(this.echartsMapOptions.base)
        this.mapTestOps.visualMap.max = list.map(d => d.value).sort((a, b) => {
          return b - a
        })[0] + 50
        this.mapTestOps.visualMap.min = list.map(d => d.value).sort((a, b) => {
          return a - b
        })[0] - 50
        this.mapTestOps.series[0].data = list
      })
      /**
       * [pieTestOps 获取各时段案件数量]
       * @type {[type]}
       */
      this.dispatch(FETCH_LAWCASE_TIME, {}).then(() => {
        let lawcaseTime = this.statistics.lawcaseTime[0]
        let caseNum = Object.keys(lawcaseTime).map(key => lawcaseTime[key])
        // 案件类别比例图饼图数据
        // 凌晨0-8点、上午8-11点、中午11-14点、下午14-18点、晚上18-24点
        let timeList = ['凌晨0-8点', '上午8-11点', '中午11-14点', '下午14-18点', '晚上18-24点']
        let list = timeList.map((d, i) => {
          return {
            name: d,
            value: caseNum[i]
          }
        })
        this.intervalPieTestOps = clone(this.echartsPieOptions.base)
        this.intervalPieTestOps.legend.data = timeList
        this.intervalPieTestOps.series[0].data = list
      })
      /**
       * [pieTestOps 获取案件类型数量]
       * @type {[type]}
       */
      this.dispatch(FETCH_LAWCASE_TYPE, {}).then(() => {
        // 案件类别比例图饼图数据
        let list = this.statistics.lawcaseType.map(d => {
          return {
            name: d.NAME,
            value: d.VALUE
          }
        })
        this.pieTestOps = clone(this.echartsPieOptions.full)
        this.pieTestOps.series[0].label.normal = {
          show: true,
          position: 'iordersss',
          textStyle: {
            color: '#666',
            fontSize: 14,
            fontWeight: 'normal'
          },
          formatter: function (obj) {
            return obj.value;
          }
        }
        this.pieTestOps.series[0].radius = '55%'
        this.pieTestOps.series[0].center[1] = '42%'
        this.pieTestOps.series[0].label.emphasis = {
          show: true
        }
        this.pieTestOps.tooltip = {
          formatter: '{b}<br /> 数量：{c}<br /> 占比：{d}% '
        }
        this.pieTestOps.series[0].labelLine = {
          normal: {
            show: true
          }
        }
        this.pieTestOps.legend.data = list.map(c => c['name'])
        this.pieTestOps.series[0].data = list
      })
    }
  }
</script>
