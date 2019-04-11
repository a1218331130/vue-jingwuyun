<template>
<div class="control__box">
  <div class="control__top" id="count-list-ref">
    <el-row :gutter="15">
      <el-col :span="18" style="position:relative;">
        <div class=" control__top__center ">
          <div class="control__top__left ">
            <div class="control__top__left__group " v-for="(item,key) in mapList " :key="key " @click="dataDetails(item.name, key) " :class="{active:key===isActive} ">
              <div class="tablediv ">
                <div class="tablediv__title ">{{item.name}}</div>
                <div class="tablediv__body ">{{item.number}}</div>
              </div>
            </div>
          </div>
          <echarts ref="echartsMap" :option="mapTestOps " :mapdata="mapData " style="width:100%; height:100% "></echarts>
          <div style="position:absolute;top:0px; right:0px; " class="handle-tool">
          </div>
        </div>
      </el-col>
      <el-col :span="6 ">
        <div class="control__top__right ">
          <div class="control__top__right__echart ">
            <echarts ref="echartstype" :option="pieTestOps " style="width:100%; height:100%; "></echarts>
          </div>
          <div class="control__top__right__group ">
            <el-table :data="tableData" border>
              <el-table-column :label="item.name " align="center " :prop="item.prop " v-for="(item,key) in trdata " :key="key ">

              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

</div>
</template>

<style scoped lang='scss'>
  .control {
    &__box {
      background: #fff;
      padding: 15px;
      box-sizing: border-box;
    }
    &__top {
      height: 95%;
      &__left {
        width: 200px;
        position: absolute;
        left: 7.5px;
        top: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 90px);
        &__group {
          display: flex;
          flex-direction: row;
          background: #4da5e6;
          border-bottom: 1px solid #ccc;
          margin-bottom: 10px;
          flex-basis: 80px;
          transition: all 0.5s;
          cursor: pointer;
          &.active {
            background: #ff9933;
            box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
          }
          &:first-child {
            background: #DE5B5B;
            &.active {
              background: #ff9933;
              box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            }
          }
          &:last-child {
            //  background: #ff9933;
          }
          &:hover {
            box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            background: #ff9933;
            .tablediv {
              &__body {
                background: #ddd;
              }
            }
          }
        }
        .tablediv {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          justify-content: center;
          text-align: center;
          &__title {
            color: #fff;
            font-size: 14px;
            padding: 9px 0;
            flex: 1;
            line-height: 18px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            .lok {
              display: block;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              whith: 100%;
            }
          }
          &__body {
            padding: 5px 0;
            line-height: 35px;
            font-size: 21px;
            font-weight: 900;
            background: #fff;
            flex: 1;
            border-right: 1px dotted #ccc;
          }
          &:first-child {
            .tablediv__body {
              border-left: 1px solid #ccc;
            }
          }
          &:last-child {
            .tablediv__body {
              border-right: 1px solid #ccc;
            }
          }
        }
      }
      &__center {
        height: calc(100vh - 90px);
      }
      &__right {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 90px);
        &__echart {
          box-shadow: 0 0 10px rgba(0, 0, 0, .3);
          border-top: 3px solid #4da5e6;
          margin-bottom: 15px;
          height: 32%;
        }
        &__group {
          border-top: 3px solid #4da5e6;
          border-bottom: 1px solid #4da5e6;
          overflow: auto;
          height: 68%;
        }
      }
    }
    &__bottom {
      height: 170px;
    }
  }

</style>
<style>
  .control__bottom .el-table th.is-leaf .cell {
    background: #4da5e6;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import {
    FXPCGK_MAIN_PAGE_LIST
  } from '../../../store/types'
  import { clone } from '../../../utils/util'
  import echarts from '../../../widgets/echarts'
  import chartsOps from '../../../utils/echartsOptions/all'
  import mapData from '../../../utils/echartsOptions/mapData'
  export default {
    mixins: [mixin, chartsOps, mapData],
    components: {
      echarts
    },
    data() {
      return {
        isActive: 0,
        trdata: [{ name: '类型', prop: 'type' },
          { name: '核查数', prop: 'hcs' },
          { name: '隐患', prop: 'yh' }
        ],
        snapshot: { // 研判报告快照参数初始化
          isTF: false,
          name: '隐患概况',
          height: 0,
          el: this.$('#count-list-ref')[0]
        },
        mapTestOps: null,
        pieTestOps: null,
        mapList: [],
        groupList: [],
        keyList: [],
        tableData: []
      }
    },
    computed: {
      ...mapState(['survey', 'focusChart'])
    },
    methods: {
      dataDetails(item, key) {
        this.isActive = key
        switch (item) {
          case '全部':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'all' }).then(d => {
              let totalAll = clone(this.focusChart.fxpcgkMainPageList[0].total)
              this.mapList = [{
                name: '全部',
                number: totalAll.PEOPLE + totalAll.ORG + totalAll.PLACE + totalAll.CAR + totalAll.AIR + totalAll.CLUE
              }, {
                name: '重点群体人员',
                number: totalAll.PEOPLE
              }, {
                name: '重点行业单位',
                number: totalAll.ORG
              }, {
                name: '重点场所部位',
                number: totalAll.PLACE
              }, {
                name: '重点车辆管控',
                number: totalAll.CAR
              }]
              // 饼图数据
              this.pieTestOps = clone(this.echartsPieOptions.full)
              this.pieTestOps.legend.show = false
              this.pieTestOps.series[0].center = ['50%', '50%']
              this.pieTestOps.series[0].label.normal = {
                position: 'outside',
                formatter: '{b}{c}'
              }
              this.pieTestOps.series[0].labelLine = {
                show: true
              }
              this.pieTestOps.legend.data = ['重点行业单位', '重点场所部位', '重点群体人员', '重点车辆管控'] //, '无人驾驶航空器管理', '重点线索管理']
              this.pieTestOps.series[0].data = [{
                name: '重点行业单位',
                value: this.focusChart.fxpcgkMainPageList[0].total.ORG
              }, {
                name: '重点场所部位',
                value: this.focusChart.fxpcgkMainPageList[0].total.PLACE
              }, {
                name: '重点群体人员',
                value: this.focusChart.fxpcgkMainPageList[0].total.PEOPLE
              }, {
                name: '重点车辆管控',
                value: this.focusChart.fxpcgkMainPageList[0].total.CAR
                // }, {
                //   name: '无人驾驶航空器管理',
                //   value: this.focusChart.fxpcgkMainPageList[0].total.AIR
                // }, {
                //   name: '重点线索管理',
                //   value: this.focusChart.fxpcgkMainPageList[0].total.CLUE
              }]
              // 地图数据
              this.mapTestOps = clone(this.echartsMapOptions.base)
              console.log(this.focusChart.fxpcgkMainPageList, 'this.focusChart.fxpcgkMainPageList')
              this.mapTestOps.series[0].data = [
                { name: this.focusChart.fxpcgkMainPageList[0].area[0].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[1] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[1].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[1] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[2].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[2] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[3].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[3] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[4].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[4] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[5].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[5] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[6].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[6] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[7].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[7] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[8].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[8] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[9].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[9] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[10].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[10] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[11].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[11] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[12].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[12] },
                { name: this.focusChart.fxpcgkMainPageList[0].area[13].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[13] }
                // 核查表单数据
              ]
              this.tableData = [
                { type: '怀化市', hcs: this.focusChart.fxpcgkMainPageList[0].check[10].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[10].TOTAL },
                { type: '麻阳县', hcs: this.focusChart.fxpcgkMainPageList[0].check[13].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[13].TOTAL },
                { type: '会同县', hcs: this.focusChart.fxpcgkMainPageList[0].check[4].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[4].TOTAL },
                { type: '洪江区', hcs: this.focusChart.fxpcgkMainPageList[0].check[9].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[3].TOTAL },
                { type: '鹤城区', hcs: this.focusChart.fxpcgkMainPageList[0].check[12].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[9].TOTAL },
                { type: '辰溪', hcs: this.focusChart.fxpcgkMainPageList[0].check[6].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[6].TOTAL },
                { type: '芷江', hcs: this.focusChart.fxpcgkMainPageList[0].check[1].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[1].TOTAL },
                { type: '沅陵', hcs: this.focusChart.fxpcgkMainPageList[0].check[3].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[3].TOTAL },
                { type: '溆浦', hcs: this.focusChart.fxpcgkMainPageList[0].check[0].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[0].TOTAL },
                { type: '新晃', hcs: this.focusChart.fxpcgkMainPageList[0].check[7].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[7].TOTAL },
                { type: '靖州', hcs: this.focusChart.fxpcgkMainPageList[0].check[5].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[5].TOTAL },
                { type: '通道', hcs: this.focusChart.fxpcgkMainPageList[0].check[11].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[11].TOTAL },
                { type: '中方', hcs: this.focusChart.fxpcgkMainPageList[0].check[8].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[8].TOTAL }

              ]
              this.mapTestOps.tooltip.formatter = function(val) {
                return (`${val.name}:</br>重点人员：${val.data.value.PEOPLE}</br>重点行业：${val.data.value.ORG}</br>重点场所：${val.data.value.PLACE}</br>重点车辆：${val.data.value.CAR}`)
              }
              this.mapTestOps.series[0].zoom = 1.2
            })
            break;
          case '重点场所部位':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'place' }).then(d => {
              this.pieTestOps.legend.data = ['重点场所', '网上阵地', '交通安全管理', '监管场所']
              this.pieTestOps.series[0].data = [{
                name: '重点场所',
                value: this.focusChart.fxpcgkMainPageList[3].placeTotal.ZDCS || 0
              }, {
                name: '网上阵地',
                value: this.focusChart.fxpcgkMainPageList[3].placeTotal.WSZD || 0
              }, {
                name: '交通安全管理',
                value: this.focusChart.fxpcgkMainPageList[3].placeTotal.JTAQGL || 0
              }, {
                name: '监管场所',
                value: this.focusChart.fxpcgkMainPageList[3].placeTotal.JGCS || 0
              }]
              let checkPlace = clone(this.focusChart.fxpcgkMainPageList[3].check)
              let dangerPlace = clone(this.focusChart.fxpcgkMainPageList[3].danger)
              this.tableData = [
                { type: '怀化市', hcs: checkPlace.hhs, yh: dangerPlace.hhs },
                { type: '洪江市', hcs: checkPlace.hjs, yh: dangerPlace.hjs },
                { type: '麻阳县', hcs: checkPlace.mymzzzx, yh: dangerPlace.mymzzzx },
                { type: '会同县', hcs: checkPlace.htx, yh: dangerPlace.htx },
                { type: '鹤城区', hcs: checkPlace.hcq, yh: dangerPlace.hcq },
                { type: '辰溪', hcs: checkPlace.cxx, yh: dangerPlace.cxx },
                { type: '芷江', hcs: checkPlace.zjdzzzx, yh: dangerPlace.zjdzzzx },
                { type: '沅陵', hcs: checkPlace.ylx, yh: dangerPlace.ylx },
                { type: '溆浦', hcs: checkPlace.xpx, yh: dangerPlace.xpx },
                { type: '新晃', hcs: checkPlace.xhdzzzx, yh: dangerPlace.xhdzzzx },
                { type: '靖州', hcs: checkPlace.jzmzdzzzx, yh: dangerPlace.jzmzdzzzx },
                { type: '通道', hcs: checkPlace.tddzzzx, yh: dangerPlace.tddzzzx },
                { type: '中方', hcs: checkPlace.zfx, yh: dangerPlace.zfx }
              ]
              this.mapTestOps.tooltip.formatter = function(val) {
                return (`${val.name}:</br>重点场所：${val.data.value.PLACE}`)
              }
              let chartElm = []
              chartElm.push(this.$refs['echartstype'])
              chartElm.push(this.$refs['echartsMap'])
              if (chartElm) {
                if (Array.isArray(chartElm)) {
                  chartElm[0].action()
                  chartElm[1].action()
                } else {
                  chartElm.action()
                }
              }
            })
            break;
          case '重点行业单位':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'org' }).then(d => {
              this.pieTestOps.legend.data = ['党政机关', '中小学及幼儿园', '医院', '旅馆', '网吧', '烟花爆竹生产、燃放、销售单位', '民爆物品生产、储存、销售等企业', '涉枪生产、使用、销售等单位', '易制爆单位', '易制毒单位', '物流寄递业', '爆破作业单位', '剧毒危险化学物品', '放射性物品', '银行业金融机构', '保安服务公司', '经济犯罪涉稳单位']
              this.pieTestOps.series[0].data = []
              for (key in this.focusChart.fxpcgkMainPageList[4].OrgTypeTotal) {
                this.pieTestOps.series[0].data.push({ name: key, value: this.focusChart.fxpcgkMainPageList[4].OrgTypeTotal[key] })
              }
              this.tableData = [
                { type: '怀化市', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.hhs, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.hhs },
                { type: '麻阳县', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.mymzzzx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.mymzzzx },
                { type: '会同县', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.htx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.htx },
                { type: '洪江区', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.hjs, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.hjs },
                { type: '鹤城区', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.hcq, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.hcq },
                { type: '辰溪', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.cxx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.cxx },
                { type: '芷江', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.zjdzzzx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.zjdzzzx },
                { type: '沅陵', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.ylx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.ylx },
                { type: '溆浦', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.xpx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.xpx },
                { type: '新晃', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.xhdzzzx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.xhdzzzx },
                { type: '靖州', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.jzmzdzzzx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.jzmzdzzzx },
                { type: '通道', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.tddzzzx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.tddzzzx },
                { type: '中方', hcs: this.focusChart.fxpcgkMainPageList[4].checkOrg.zfx, yh: this.focusChart.fxpcgkMainPageList[4].dangerOrg.zfx }
              ]
              this.mapTestOps.tooltip.formatter = function(val) {
                return (`${val.name}:</br>重点行业：${val.data.value.ORG}</br>`)
              }
              let chartElm = []
              chartElm.push(this.$refs['echartstype'])
              chartElm.push(this.$refs['echartsMap'])
              if (chartElm) {
                if (Array.isArray(chartElm)) {
                  chartElm[0].action()
                  chartElm[1].action()
                } else {
                  chartElm.action()
                }
              }
            })
            break;
          case '重点群体人员':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'people' }).then(d => {
              this.pieTestOps.legend.data = ['政治类', '涉恐类', '涉访类', '涉军类', '涉毒类', '境外人员', '其他']
              this.pieTestOps.series[0].data = [{
                name: '政治类',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.zzl || 0
              }, {
                name: '涉恐类',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.skl || 0
              }, {
                name: '涉访类',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.sfl || 0
              }, {
                name: '涉军类',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.sjl || 0
              }, {
                name: '涉毒类',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.sdl || 0
              }, {
                name: '境外人员',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.jwry || 0
              }, {
                name: '其他',
                value: this.focusChart.fxpcgkMainPageList[1].totalPeople.qt || 0
              }]
              this.tableData = [
                { type: '怀化市', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.hhs, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.hhs },
                { type: '麻阳县', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.mymzzzx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.mymzzzx },
                { type: '会同县', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.htx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.htx },
                { type: '洪江区', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.hjs, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.hjs },
                { type: '鹤城区', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.hcq, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.hcq },
                { type: '辰溪', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.cxx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.cxx },
                { type: '芷江', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.zjdzzzx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.zjdzzzx },
                { type: '沅陵', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.ylx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.ylx },
                { type: '溆浦', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.xpx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.xpx },
                { type: '新晃', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.xhdzzzx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.xhdzzzx },
                { type: '靖州', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.jzmzdzzzx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.jzmzdzzzx },
                { type: '通道', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.tddzzzx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.tddzzzx },
                { type: '中方', hcs: this.focusChart.fxpcgkMainPageList[1].checkPeople.zfx, yh: this.focusChart.fxpcgkMainPageList[1].dangerPeople.zfx }
              ]
              this.mapTestOps.tooltip.formatter = function(val) {
                return (`${val.name}:</br>重点人员：${val.data.value.PEOPLE}`)
              }
              let chartElm = []
              chartElm.push(this.$refs['echartstype'])
              chartElm.push(this.$refs['echartsMap'])
              if (chartElm) {
                if (Array.isArray(chartElm)) {
                  chartElm[0].action()
                  chartElm[1].action()
                } else {
                  chartElm.action()
                }
              }
            })
            break;
            //
            //
            // 华丽的分隔区
            //
            //
          case '重点车辆管控':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'car' }).then(d => {
              this.pieTestOps.legend.data = ['毒驾车辆', '超员车辆', '酒驾车辆', '超速车辆', '涉牌涉证车辆', '超载车辆', '疲劳驾驶车辆', '两客一车', '危爆车辆', '违章车辆', '未年检车辆']
              this.pieTestOps.series[0].data = [{
                name: '毒驾车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.djcl || 0
              }, {
                name: '超员车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.cycl || 0
              }, {
                name: '酒驾车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.jjcl || 0
              }, {
                name: '超速车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.cscl || 0
              }, {
                name: '涉牌涉证车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.spczcl || 0
              }, {
                name: '超载车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.czcl || 0
              }, {
                name: '疲劳驾驶车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.pljscl || 0
              }, {
                name: '两客一车',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.lkyw || 0
              }, {
                name: '危爆车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.wbcl || 0
              }, {
                name: '违章车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.wzcl || 0
              }, {
                name: '未年检车辆',
                value: this.focusChart.fxpcgkMainPageList[2].totalCar.wnjcl || 0
              }]
              let checkCar = clone(this.focusChart.fxpcgkMainPageList[2].check)
              let dangerCar = clone(this.focusChart.fxpcgkMainPageList[2].danger)
              this.tableData = [
                { type: '怀化市', hcs: checkCar[13].CAR, yh: dangerCar[13].CAR },
                { type: '麻阳县', hcs: checkCar[0].CAR, yh: dangerCar[0].CAR },
                { type: '会同县', hcs: checkCar[2].CAR, yh: dangerCar[2].CAR },
                { type: '洪江区', hcs: checkCar[3].CAR, yh: dangerCar[3].CAR },
                { type: '鹤城区', hcs: checkCar[4].CAR, yh: dangerCar[4].CAR },
                { type: '辰溪', hcs: checkCar[5].CAR, yh: dangerCar[5].CAR },
                { type: '芷江', hcs: checkCar[6].CAR, yh: dangerCar[6].CAR },
                { type: '沅陵', hcs: checkCar[7].CAR, yh: dangerCar[7].CAR },
                { type: '溆浦', hcs: checkCar[8].CAR, yh: dangerCar[8].CAR },
                { type: '新晃', hcs: checkCar[9].CAR, yh: dangerCar[9].CAR },
                { type: '靖州', hcs: checkCar[10].CAR, yh: dangerCar[10].CAR },
                { type: '通道', hcs: checkCar[11].CAR, yh: dangerCar[11].CAR },
                { type: '中方', hcs: checkCar[12].CAR, yh: dangerCar[12].CAR }
              ]
              this.mapTestOps.tooltip.formatter = function(val) {
                return (`${val.name}:</br>重点车辆：${val.data.value.CAR}`)
              }
              let chartElm = []
              chartElm.push(this.$refs['echartstype'])
              chartElm.push(this.$refs['echartsMap'])
              if (chartElm) {
                if (Array.isArray(chartElm)) {
                  chartElm[0].action()
                  chartElm[1].action()
                } else {
                  chartElm.action()
                }
              }
            })
            break;
          case '无人驾驶航空器管理':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'air' }).then(d => {
              this.pieTestOps.legend.data = ['生产厂家', '销售商', '培训机构', '无人机爱好者', '无人机管理']
              this.pieTestOps.series[0].data = [{
                name: '生产厂家',
                value: this.focusChart.fxpcgkMainPageList[6].type.SFCJ
              }, {
                name: '销售商',
                value: this.focusChart.fxpcgkMainPageList[6].type.XSS
              }, {
                name: '培训机构',
                value: this.focusChart.fxpcgkMainPageList[6].type.PXJG
              }, {
                name: '无人机爱好者',
                value: this.focusChart.fxpcgkMainPageList[6].type.AHZ
              }, {
                name: '无人机管理',
                value: this.focusChart.fxpcgkMainPageList[6].type.SCXX
              }]
              let airObj = clone(this.focusChart.fxpcgkMainPageList[6])
              this.tableData = [
                { type: '怀化市', hcs: airObj.check[10].TOTAL, yh: airObj.danger[10].TOTAL },
                { type: '麻阳县', hcs: airObj.check[0].TOTAL, yh: airObj.danger[0].TOTAL },
                { type: '会同县', hcs: airObj.check[2].TOTAL, yh: airObj.danger[2].TOTAL },
                { type: '洪江区', hcs: airObj.check[3].TOTAL, yh: airObj.danger[3].TOTAL },
                { type: '鹤城区', hcs: airObj.check[4].TOTAL, yh: airObj.danger[4].TOTAL },
                { type: '辰溪', hcs: airObj.check[5].TOTAL, yh: airObj.danger[5].TOTAL },
                { type: '芷江', hcs: airObj.check[6].TOTAL, yh: airObj.danger[6].TOTAL },
                { type: '沅陵', hcs: airObj.check[7].TOTAL, yh: airObj.danger[7].TOTAL },
                { type: '溆浦', hcs: airObj.check[8].TOTAL, yh: airObj.danger[8].TOTAL },
                { type: '新晃', hcs: airObj.check[9].TOTAL, yh: airObj.danger[9].TOTAL },
                { type: '靖州', hcs: airObj.check[11].TOTAL, yh: airObj.danger[11].TOTAL },
                { type: '通道', hcs: airObj.check[12].TOTAL, yh: airObj.danger[12].TOTAL },
                { type: '中方', hcs: airObj.check[13].TOTAL, yh: airObj.danger[13].TOTAL }
              ]
              this.mapTestOps.tooltip.formatter = function(val) {
                return (`${val.name}:</br>无人机：${val.data.value.AIR}`)
              }
              let chartElm = []
              chartElm.push(this.$refs['echartstype'])
              chartElm.push(this.$refs['echartsMap'])
              if (chartElm) {
                if (Array.isArray(chartElm)) {
                  chartElm[0].action()
                  chartElm[1].action()
                } else {
                  chartElm.action()
                }
              }
            })
            break;
          case '重点线索管理':
            this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'clue' }).then(d => {
              let clueObj = clone(this.focusChart.fxpcgkMainPageList[5])
              this.pieTestOps.legend.data = ['怀化市', '洪江市', '麻阳县', '会同县', '鹤城区', '辰溪', '芷江', '沅陵', '靖州', '通道', '中方', '新晃', '溆浦']
              this.pieTestOps.series[0].data = [{
                name: '怀化市',
                value: clueObj.area[10].CLUE
              }, {
                name: '洪江市',
                value: clueObj.area[8].CLUE
              }, {
                name: '麻阳县',
                value: clueObj.area[13].CLUE
              }, {
                name: '会同县',
                value: clueObj.area[3].CLUE
              }, {
                name: '鹤城区',
                value: clueObj.area[12].CLUE
              }, {
                name: '辰溪',
                value: clueObj.area[6].CLUE
              }, {
                name: '沅陵',
                value: clueObj.area[4].CLUE
              }, {
                name: '芷江',
                value: clueObj.area[2].CLUE
              }, {
                name: '靖州',
                value: clueObj.area[5].CLUE
              }, {
                name: '通道',
                value: clueObj.area[11].CLUE
              }, {
                name: '中方',
                value: clueObj.area[9].CLUE
              }, {
                name: '新晃',
                value: clueObj.area[7].CLUE
              }, {
                name: '溆浦',
                value: clueObj.area[0].CLUE
              }]
              this.tableData = [
                { type: '怀化市', hcs: clueObj.check[10].CLUE, yh: clueObj.danger[10].CLUE },
                { type: '洪江市', hcs: clueObj.check[8].CLUE, yh: clueObj.danger[8].CLUE },
                { type: '麻阳县', hcs: clueObj.check[13].CLUE, yh: clueObj.danger[13].CLUE },
                { type: '会同县', hcs: clueObj.check[3].CLUE, yh: clueObj.danger[3].CLUE },
                // { type: '洪江区', hcs: clueObj.check[10].CLUE, yh: clueObj.danger[10].CLUE },
                { type: '鹤城区', hcs: clueObj.check[12].CLUE, yh: clueObj.danger[12].CLUE },
                { type: '辰溪', hcs: clueObj.check[6].CLUE, yh: clueObj.danger[6].CLUE },
                { type: '芷江', hcs: clueObj.check[2].CLUE, yh: clueObj.danger[2].CLUE },
                { type: '沅陵', hcs: clueObj.check[4].CLUE, yh: clueObj.danger[4].CLUE },
                { type: '溆浦', hcs: clueObj.check[0].CLUE, yh: clueObj.danger[0].CLUE },
                { type: '新晃', hcs: clueObj.check[7].CLUE, yh: clueObj.danger[7].CLUE },
                { type: '靖州', hcs: clueObj.check[5].CLUE, yh: clueObj.danger[5].CLUE },
                { type: '通道', hcs: clueObj.check[11].CLUE, yh: clueObj.danger[11].CLUE },
                { type: '中方', hcs: clueObj.check[9].CLUE, yh: clueObj.danger[9].CLUE }
              ]
              let chartElm = []
              chartElm.push(this.$refs['echartstype'])
              chartElm.push(this.$refs['echartsMap'])
              if (chartElm) {
                if (Array.isArray(chartElm)) {
                  chartElm[0].action()
                  chartElm[1].action()
                } else {
                  chartElm.action()
                }
              }
            })
            break;
          case '重点案事件':
            this.pieTestOps.legend.data = ['治安重点案事件', '经侦重点案事件', '刑侦重点案事件', '打黑扫恶重点案事件']
            this.pieTestOps.series[0].data = [{
              name: '治安重点案事件',
              value: 1356
            }, {
              name: '经侦重点案事件',
              value: 2658
            }, {
              name: '刑侦重点案事件',
              value: 8456
            }, {
              name: '打黑扫恶重点案事件',
              value: 3565
            }]
            this.tableData = [
              { type: '洪江市', hcs: '315', yh: '42' },
              { type: '麻阳县', hcs: '56', yh: '12' },
              { type: '会同县', hcs: '16', yh: '252' },
              { type: '洪江区', hcs: '16', yh: '32' },
              { type: '鹤城区', hcs: '16', yh: '12' },
              { type: '辰溪', hcs: '116', yh: '162' },
              { type: '芷江', hcs: '64', yh: '512' },
              { type: '沅陵', hcs: '61', yh: '42' },
              { type: '溆浦', hcs: '56', yh: '52' },
              { type: '新晃', hcs: '61', yh: '62' },
              { type: '靖州', hcs: '51', yh: '192' },
              { type: '通道', hcs: '561', yh: '62' },
              { type: '中方', hcs: '96', yh: '32' }
            ]
            this.mapTestOps.tooltip = {
              formatter: '{b}:<br />(治安重点案事件：{c})<br />(经侦重点案事件：2658)<br />(刑侦重点案事件：8456)<br />(打黑扫恶重点案事件：3565)'
            }
            break;
        }
      }
    },
    mounted() {
      this.snapshot.el = this.$('#count-list-ref')[0]
    },
    created() {
      this.dispatch(FXPCGK_MAIN_PAGE_LIST, { area: 'all' }).then(d => {
        let totalAll = clone(this.focusChart.fxpcgkMainPageList[0].total)
        this.mapList = [{
          name: '全部',
          number: totalAll.PEOPLE + totalAll.ORG + totalAll.PLACE + totalAll.CAR + totalAll.AIR + totalAll.CLUE
        }, {
          name: '重点群体人员',
          number: totalAll.PEOPLE
        }, {
          name: '重点行业单位',
          number: totalAll.ORG
        }, {
          name: '重点场所部位',
          number: totalAll.PLACE
        }, {
          name: '重点车辆管控',
          number: totalAll.CAR
        }]
        // 饼图数据
        this.pieTestOps = clone(this.echartsPieOptions.full)
        this.pieTestOps.legend.show = false
        this.pieTestOps.series[0].center = ['50%', '50%']
        this.pieTestOps.series[0].label.normal = {
          position: 'outside',
          formatter: '{b}{c}'
        }
        this.pieTestOps.series[0].labelLine = {
          show: true
        }
        this.pieTestOps.legend.data = ['重点行业单位', '重点场所部位', '重点群体人员', '重点车辆管控'] //, '无人驾驶航空器管理', '重点线索管理']
        this.pieTestOps.series[0].data = [{
          name: '重点行业单位',
          value: this.focusChart.fxpcgkMainPageList[0].total.ORG
        }, {
          name: '重点场所部位',
          value: this.focusChart.fxpcgkMainPageList[0].total.PLACE
        }, {
          name: '重点群体人员',
          value: this.focusChart.fxpcgkMainPageList[0].total.PEOPLE
        }, {
          name: '重点车辆管控',
          value: this.focusChart.fxpcgkMainPageList[0].total.CAR
          // }, {
          //   name: '无人驾驶航空器管理',
          //   value: this.focusChart.fxpcgkMainPageList[0].total.AIR
          // }, {
          //   name: '重点线索管理',
          //   value: this.focusChart.fxpcgkMainPageList[0].total.CLUE
        }]
        // 地图数据
        this.mapTestOps = clone(this.echartsMapOptions.base)
        this.mapTestOps.series[0].data = [
          { name: this.focusChart.fxpcgkMainPageList[0].area[0].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[0] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[1].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[1] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[2].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[2] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[3].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[3] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[4].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[4] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[5].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[5] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[6].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[6] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[7].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[7] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[8].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[8] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[9].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[9] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[10].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[10] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[11].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[11] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[12].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[12] },
          { name: this.focusChart.fxpcgkMainPageList[0].area[13].SSQYMC, value: this.focusChart.fxpcgkMainPageList[0].area[13] }
          // 核查表单数据
        ]
        this.tableData = [
          { type: '怀化市', hcs: this.focusChart.fxpcgkMainPageList[0].check[10].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[10].TOTAL },
          { type: '麻阳县', hcs: this.focusChart.fxpcgkMainPageList[0].check[13].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[13].TOTAL },
          { type: '会同县', hcs: this.focusChart.fxpcgkMainPageList[0].check[4].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[4].TOTAL },
          { type: '洪江区', hcs: this.focusChart.fxpcgkMainPageList[0].check[9].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[3].TOTAL },
          { type: '鹤城区', hcs: this.focusChart.fxpcgkMainPageList[0].check[12].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[9].TOTAL },
          { type: '辰溪', hcs: this.focusChart.fxpcgkMainPageList[0].check[6].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[6].TOTAL },
          { type: '芷江', hcs: this.focusChart.fxpcgkMainPageList[0].check[1].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[1].TOTAL },
          { type: '沅陵', hcs: this.focusChart.fxpcgkMainPageList[0].check[3].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[3].TOTAL },
          { type: '溆浦', hcs: this.focusChart.fxpcgkMainPageList[0].check[0].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[0].TOTAL },
          { type: '新晃', hcs: this.focusChart.fxpcgkMainPageList[0].check[7].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[7].TOTAL },
          { type: '靖州', hcs: this.focusChart.fxpcgkMainPageList[0].check[5].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[5].TOTAL },
          { type: '通道', hcs: this.focusChart.fxpcgkMainPageList[0].check[11].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[11].TOTAL },
          { type: '中方', hcs: this.focusChart.fxpcgkMainPageList[0].check[8].TOTAL, yh: this.focusChart.fxpcgkMainPageList[0].danger[8].TOTAL }

        ]
        console.log(this.mapTestOps.series[0].data, 'this.mapTestOps.series[0].data')
        this.mapTestOps.tooltip.formatter = function(val) {
          return (`${val.name}:</br>重点人员：${val.data.value.PEOPLE}</br>重点行业：${val.data.value.ORG}</br>重点场所：${val.data.value.PLACE}</br>重点车辆：${val.data.value.CAR}`)
        }
        this.mapTestOps.series[0].zoom = 1.2
      })
    }
  }

</script>
