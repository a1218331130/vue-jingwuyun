<template>
<div class="union-statistics">
  <el-row :gutter="10">
    <el-col :span="8">
      <div class="union-statistics__box" style="height:720px;">
        <div class="union-statistics__box__title">
          申请被完成率
        </div>
        <div class="tactics__box__content union-statistics__box__content">
             <el-row style="padding:5px">
                 <el-col :span="8" class="top_city" v-for="(k, indexs) in shenqing" :key="indexs" v-if="2>=indexs">
                   <span class="number" v-if="indexs===0">第一名</span>
                   <span class="number" v-if="indexs===1">第二名</span>
                   <span class="number" v-if="indexs===2">第三名</span>
                   <span class="city" title="k.type">{{k.type}}</span>
                   <span class="city">{{k.percent}}</span>
                 </el-col>
            </el-row>
            <el-row style="padding:5px">
                 <el-table id="orgTableBox" @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="shenqing">
                    <el-table-column type="index" label="序号" align="center" width="80">
                      <template scope="scope">
                        <span class="xu_hao" v-if="2>=scope.$index">{{scope.$index + 1}}</span>
                        <span class="xu_hao_none" v-if="scope.$index>2">{{scope.$index + 1}}</span>
                      </template>
                    </el-table-column> 
                    <el-table-column width="150" prop="type" label="名称"></el-table-column>
                    <el-table-column width="100" prop="count" label="申请"></el-table-column>
                    <el-table-column width="100" prop="count1" label="完成"></el-table-column>
                    <el-table-column prop="percent" label="完成率"></el-table-column>
                </el-table> 
           </el-row>
        </div>
        <!-- <div class="union-statistics__box__content rel">
          <echarts ref='center' :option="centerOps" style="width:100%; height:100%;"></echarts>
        </div> -->
      </div>
    </el-col>
    <el-col :span="8">
      <div class="union-statistics__box" style="height:720px;">
        <div class="union-statistics__box__title">
          协调总览
        </div>
        <div class="union-statistics__box__content rel">
          <echarts ref="xtCenter" :option="xtCenterOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="union-statistics__box" style="height:720px;">
        <div class="union-statistics__box__title">
          申请被完成率
        </div>
        <div class="tactics__box__content union-statistics__box__content">
             <el-row style="padding:5px">
                 <el-col :span="8" class="top_city" v-for="(k, indexs) in shouli" :key="indexs" v-if="2>=indexs">
                   <span class="number" v-if="indexs===0">第一名</span>
                   <span class="number" v-if="indexs===1">第二名</span>
                   <span class="number" v-if="indexs===2">第三名</span>
                   <span class="city" :title="k.type">{{k.type}}</span>
                   <span class="city">{{k.percent}}</span>
                 </el-col>
            </el-row>
            <el-row style="padding:5px">
                 <el-table id="orgTableBox" @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="shouli">
                    <el-table-column type="index" label="序号" align="center" width="80">
                      <template scope="scope">
                        <span class="xu_hao" v-if="2>=scope.$index">{{scope.$index + 1}}</span>
                        <span class="xu_hao_none" v-if="scope.$index>2">{{scope.$index + 1}}</span>
                      </template>
                    </el-table-column> 
                    <el-table-column width="150" prop="type" label="名称"></el-table-column>
                    <el-table-column width="100" prop="count" label="受理"></el-table-column>
                    <el-table-column width="100" prop="count1" label="完成"></el-table-column>
                    <el-table-column prop="percent" label="完成率"></el-table-column>
                </el-table> 
           </el-row>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="union-statistics__box" style="height:400px;">
        <div class="union-statistics__box__title">
          中心维度
        </div>
        <div class="union-statistics__box__content rel">
          <echarts ref='center' :option="centerOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="union-statistics__box" style="height:400px;">
        <div class="union-statistics__box__title">
          紧急程度维度
        </div>
        <div class="union-statistics__box__content rel">
          <echarts ref='lev' :option="levOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="union-statistics__box" style="height:400px;">
        <div class="union-statistics__box__title">
          时间维度(申请数)
        </div>
        <div style="padding:10px">
          <span>筛选：</span>
          <el-radio-group v-model="timeType0" @change="chooseTime">
             <el-radio-button :label="0">近三年</el-radio-button>
             <el-radio-button :label="1">近一年</el-radio-button>
             <el-radio-button :label="2">近30天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="union-statistics__box__content rel" v-loading="loading1">
          <echarts ref="time" :option="timeOps" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col>
    <el-col :span="12">
      <div class="union-statistics__box" style="height:400px;">
        <div class="union-statistics__box__title">
          时间维度(受理数)
        </div>
        <div style="padding:10px">
          <span>筛选：</span>
          <el-radio-group v-model="timeType1" @change="chooseTime1">
             <el-radio-button :label="0">近三年</el-radio-button>
             <el-radio-button :label="1">近一年</el-radio-button>
             <el-radio-button :label="2">近30天</el-radio-button>
          </el-radio-group>
        </div>
        <div class="union-statistics__box__content rel" v-loading="loading2">
          <echarts ref="time" :option="timeOps1" style="width:100%; height:100%;"></echarts>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
.xu_hao{
  padding: 5px 8px;
  background: #ff7371;
  color: white;
}
.xu_hao_none{
  padding: 5px 8px;
  background: #69b2e7;
  color: white;
}
.tactics__box__content .top_city .number{
  font-size: 14px;
  display: inline-block;
  width: 20px;
  line-height: 20px;
  position: absolute;
  left: 0px;
  padding-top: 10px;
  height: 70px;
  background-color: rgba(0,0,0,0.2);
}
.tactics__box__content .top_city .city{
  display: block;
  width: 100px;
  position: absolute;
  top: -12px;
  left: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tactics__box__content .top_city .city:nth-child(3){
  top: 12px;
}
.tactics__box__content .top_city{
    width: 32%;
    text-align: center;
    background: #f8b121;
    margin-top:10px;
    color: white;
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    position: relative;
}
.tactics__box__content .top_city:nth-child(2){
  margin-left: 1%;
  margin-right: 1%;
  background: #0096ff;
}
.tactics__box__content .top_city:nth-child(1){
  margin-left: 1%;
  background: #fe1d19;
}
.union-statistics {
    padding: 10px;
    &__box {
        height: calc(100vh - 150px);
        margin-bottom: 10px;
        position: relative;
        &-wrap {
            height: calc(100vh - 160px);
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
            border: 1px solid #ccc;
        }
        &__title + &__content {
            height: calc(100% - 40px);
            border-top: 0;
        }
    }
    .person-box {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 2;
        &__item {
            text-align: center;
            width: 160px;
            margin-bottom: 10px;
            &__title {
                font-size: 14px;
                color: #fff;
                height: 35px;
                line-height: 35px;
            }
            &__value {
                background: #f2f2f2;
                font-size: 20px;
                color: #666;
                font-weight: bold;
                height: 50px;
                line-height: 50px;
                border: 1px solid #ccc;
                position: relative;
                &:before {
                    content: '';
                    width: 90%;
                    border-bottom: 1px dashed #ccc;
                    position: absolute;
                    top: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            &.blue {
                .person-box__item__title {
                    background-color: #54aaff;
                }
            }
            &.orange {
                .person-box__item__title {
                    background-color: #ff9933;
                }
            }
            &.green {
                .person-box__item__title {
                    background-color: #66cc66;
                }
            }
        }
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { STATISTICS_ONE, STATISTICS_TWO, STATISTICS_THREE, STATISTICS_FOUR, STATISTICS_FIVE } from '../../../store/types'

import mixin from '../../../utils/mixin'
import { clone } from '../../../utils/util'
import echarts from '../../../widgets/echarts'
import echartsDetails from '../../../widgets/echarts/echart-details'
import chartsOps from '../../../utils/echartsOptions/all'
import mapData from '../../../utils/echartsOptions/mapData'
export default {
  mixins: [mixin, chartsOps, mapData],
  components: {
    echarts,
    echartsDetails
  },
  data: () => ({
    tableList: [],
    loading1: false,
    loading2: false,
    timeType: '0',
    timeType0: '0',
    timeType1: '0',
    totalArr: '',
    xtCenterList: [],
    shouli: [],
    shenqing: [],
    xtCenterOps: null,
    timeOps: null,
    timeOps1: null,
    levOps: null,
    type: '',
    centerOps: null
  }),
  computed: {
    ...mapState(['unionStatistics', 'users', 'union'])
  },
  watch: {
    '$route' () {
      this.init()
    }
  },
  methods: {
    chooseTime(val) {
      this.timeType = val;
      this.loading1 = true;
      this.timeLine();
    },
    chooseTime1(val) {
      this.timeType = val;
      this.loading2 = true;
      this.timeLine1();
    },
    timeLine1() {
      // 时间维度
      this.dispatch(STATISTICS_FOUR, { type: this.timeType }).then(() => {
        this.loading2 = false;
        this.timeOps1 = clone(this.echartsLineOptions.base)
        this.timeOps1.legend.data = this.unionStatistics.statisticsFour[0].list.map(d => d.type);
        this.timeOps1.tooltip = {
          trigger: 'axis'
        }
        this.timeOps1.yAxis = {
          type: 'value'
        }
        // this.timeOps.legend.data = ['怀化市', '会同市', '长沙市'];
        this.timeOps1.xAxis.data = this.unionStatistics.statisticsFour.map(d => d.statisticsType);
        this.timeOps1.xAxis.type = 'category';
        this.timeOps1.xAxis.boundaryGap = false;
        var xarrayL = [];
        var xarray0 = [];
        var xarray1 = [];
        var xarray2 = [];
        var xarray3 = [];
        var xarray4 = [];
        var xarray5 = [];
        var xarray6 = [];
        var xarray7 = [];
        var xarray8 = [];
        var xarray9 = [];
        var xarray10 = [];
        var xarray11 = [];
        var xarray12 = [];
        for(var n = 0; n < this.unionStatistics.statisticsFour.length; n++) {
          xarray0.push(this.unionStatistics.statisticsFour[n].list[0].count1);
          xarray1.push(this.unionStatistics.statisticsFour[n].list[1].count1);
          xarray2.push(this.unionStatistics.statisticsFour[n].list[2].count1);
          xarray3.push(this.unionStatistics.statisticsFour[n].list[3].count1);
          xarray4.push(this.unionStatistics.statisticsFour[n].list[4].count1);
          xarray5.push(this.unionStatistics.statisticsFour[n].list[5].count1);
          xarray6.push(this.unionStatistics.statisticsFour[n].list[6].count1);
          xarray7.push(this.unionStatistics.statisticsFour[n].list[7].count1);
          xarray8.push(this.unionStatistics.statisticsFour[n].list[8].count1);
          xarray9.push(this.unionStatistics.statisticsFour[n].list[9].count1);
          xarray10.push(this.unionStatistics.statisticsFour[n].list[10].count);
          xarray11.push(this.unionStatistics.statisticsFour[n].list[11].count);
          xarray12.push(this.unionStatistics.statisticsFour[n].list[12].count);
        }
        xarrayL[0] = xarray0;
        xarrayL[1] = xarray1;
        xarrayL[2] = xarray2;
        xarrayL[3] = xarray3;
        xarrayL[4] = xarray4;
        xarrayL[5] = xarray5;
        xarrayL[6] = xarray6;
        xarrayL[7] = xarray7;
        xarrayL[8] = xarray8;
        xarrayL[9] = xarray9;
        xarrayL[10] = xarray10;
        xarrayL[11] = xarray11;
        xarrayL[12] = xarray12;
        // this.timeOps1 = clone(this.timeOps)
        // this.timeOps.series[0].name = this.timeOps.legend.data[0];
        // this.timeOps.series[0].data = arrayL[0];
        this.timeOps1.series[0].name = this.timeOps1.legend.data[0];
        this.timeOps1.series[0].data = xarrayL[0];
        for(var i = 1; i < this.timeOps1.legend.data.length; i++) {
          // this.timeOps.series[i] = clone(this.timeOps.series[0])
          this.timeOps1.series[i] = clone(this.timeOps1.series[0])
        }
        for(var j = 1; j < this.timeOps1.legend.data.length; j++) {
          // this.timeOps.series[j].name = this.timeOps.legend.data[j];
          this.timeOps1.series[j].name = this.timeOps1.legend.data[j];
          // this.timeOps.series[j].data = arrayL[j];
          this.timeOps1.series[j].data = xarrayL[j];
        }
        // this.$nextTick(() => {
        //   if(this.$refs.time.action) this.$refs.time.action()
        // })
      })
    },
    timeLine() {
      // 时间维度
      this.dispatch(STATISTICS_FOUR, { type: this.timeType }).then(() => {
        this.loading1 = false;
        this.timeOps = clone(this.echartsLineOptions.base)
        this.timeOps.legend.data = this.unionStatistics.statisticsFour[0].list.map(d => d.type);
        this.timeOps.tooltip = {
          trigger: 'axis'
        }
        this.timeOps.yAxis = {
          type: 'value'
        }
        // this.timeOps.legend.data = ['怀化市', '会同市', '长沙市'];
        this.timeOps.xAxis.data = this.unionStatistics.statisticsFour.map(d => d.statisticsType);
        this.timeOps.xAxis.type = 'category';
        this.timeOps.xAxis.boundaryGap = false;
        var arrayL = [];
        var array0 = [];
        var array1 = [];
        var array2 = [];
        var array3 = [];
        var array4 = [];
        var array5 = [];
        var array6 = [];
        var array7 = [];
        var array8 = [];
        var array9 = [];
        var array10 = [];
        var array11 = [];
        var array12 = [];
        for(var n = 0; n < this.unionStatistics.statisticsFour.length; n++) {
          array0.push(this.unionStatistics.statisticsFour[n].list[0].count);
          array1.push(this.unionStatistics.statisticsFour[n].list[1].count);
          array2.push(this.unionStatistics.statisticsFour[n].list[2].count);
          array3.push(this.unionStatistics.statisticsFour[n].list[3].count);
          array4.push(this.unionStatistics.statisticsFour[n].list[4].count);
          array5.push(this.unionStatistics.statisticsFour[n].list[5].count);
          array6.push(this.unionStatistics.statisticsFour[n].list[6].count);
          array7.push(this.unionStatistics.statisticsFour[n].list[7].count);
          array8.push(this.unionStatistics.statisticsFour[n].list[8].count);
          array9.push(this.unionStatistics.statisticsFour[n].list[9].count);
          array10.push(this.unionStatistics.statisticsFour[n].list[10].count);
          array11.push(this.unionStatistics.statisticsFour[n].list[11].count);
          array12.push(this.unionStatistics.statisticsFour[n].list[12].count);
        }
        arrayL[0] = array0;
        arrayL[1] = array1;
        arrayL[2] = array2;
        arrayL[3] = array3;
        arrayL[4] = array4;
        arrayL[5] = array5;
        arrayL[6] = array6;
        arrayL[7] = array7;
        arrayL[8] = array8;
        arrayL[9] = array9;
        arrayL[10] = array10;
        arrayL[11] = array11;
        arrayL[12] = array12;
        // this.timeOps1 = clone(this.timeOps)
        this.timeOps.series[0].name = this.timeOps.legend.data[0];
        this.timeOps.series[0].data = arrayL[0];
        // this.timeOps1.series[0].name = this.timeOps1.legend.data[0];
        // this.timeOps1.series[0].data = xarrayL[0];
        for(var i = 1; i < this.timeOps.legend.data.length; i++) {
          this.timeOps.series[i] = clone(this.timeOps.series[0])
          // this.timeOps1.series[i] = clone(this.timeOps1.series[0])
        }
        for(var j = 1; j < this.timeOps.legend.data.length; j++) {
          this.timeOps.series[j].name = this.timeOps.legend.data[j];
          // this.timeOps1.series[j].name = this.timeOps.legend.data[j];
          this.timeOps.series[j].data = arrayL[j];
          // this.timeOps1.series[j].data = xarrayL[j];
        }
        // this.$nextTick(() => {
        //   if(this.$refs.time.action) this.$refs.time.action()
        // })
      })
    },
    // 总的接口
    states() {
      this.dispatch(STATISTICS_ONE).then(() => {
        this.tableList = this.unionStatistics.statisticsOne;
        this.shouli = this.tableList[1].list;
        this.shenqing = this.tableList[0].list;
      })
      this.getBarList();
      this.centerBar();
      this.levBar();
    },
    // 中心
    centerBar() {
      // 中心
      this.dispatch(STATISTICS_FIVE).then(() => {
        this.centerOps = clone(this.echartsPieOptions.tactics)
        // this.centerOps.xAxis.data = ['情报指挥中心', '治安防控中心', '侦查实战中心', '执法监督中心']
        // this.centerOps.legend.data = ['申请数', '受理数', '申请百分比', '受理百分比']
        // this.centerOps.series[0].name = '申请数'
        // this.centerOps.series[0].data = this.unionStatistics.statisticsFive.map(d => d.count)
        // this.centerOps.series[1] = clone(this.centerOps.series[0])
        // this.centerOps.series[1].name = '受理数'
        // this.centerOps.series[1].data = this.unionStatistics.statisticsFive.map(d => d.count1)
        // this.centerOps.series[2] = clone(this.centerOps.series[0])
        // this.centerOps.series[2].name = '申请百分比'
        // this.centerOps.series[2].data = this.unionStatistics.statisticsFive.map(d => d.percent)
        // this.centerOps.series[3] = clone(this.centerOps.series[0])
        // this.centerOps.series[3].name = '受理百分比'
        // this.centerOps.series[3].data = this.unionStatistics.statisticsFive.map(d => d.percent1)
        this.centerOps.series[0].name = '申请'
        this.centerOps.legend.data = ['情报指挥中心', '治安防控中心', '侦查实战中心', '执法监督中心']
        this.centerOps.series[0]['label'] = {
          normal: {
            color: '#666',
            formatter: '{b}\n{a} {c}次'
          }
        }
        this.centerOps.tooltip = {
          trigger: 'item',
          formatter: '{b} : {c}'
        };
        this.centerOps.series[0]['radius'] = ['70%', '85%']
        this.centerOps.series[0].data = this.unionStatistics.statisticsFive.map(d => { return { value: d.count, name: d.type } })
        this.centerOps.series[1] = clone(this.centerOps.series[0])
        this.centerOps.series[1].name = '受理'
        this.centerOps.series[1]['label'] = {
          normal: {
            formatter: '{b}\n{a} {c}次',
            position: 'inner'
          }
        }
        this.centerOps.series[1]['radius'] = [0, '50%']
        this.centerOps.series[1].data = this.unionStatistics.statisticsFive.map(d => { return { value: d.count1, name: d.type } })
      })
    },
    // 中间的柱状图
    getBarList() {
      // 地区维度
      this.dispatch(STATISTICS_THREE).then(() => {
        var cities = [];
        var accepts = [];
        var applys = [];
        this.xtCenterList = this.unionStatistics.statisticsThree;
        this.xtCenterOps = clone(this.echartsBarOptions.stack)
        this.xtCenterOps.tooltip['axisPointer'] = {
          type: 'shadow'
        }
        for(var i = 0; i < this.xtCenterList.length; i++) {
          cities.push(this.xtCenterList[i].type);
          accepts.push(this.xtCenterList[i].count1);
          applys.push(this.xtCenterList[i].count);
        }
        this.xtCenterOps.yAxis.data = cities;
        this.xtCenterOps.yAxis.type = 'category';
        this.xtCenterOps.xAxis.type = 'value';
        this.xtCenterOps.xAxis.boundaryGap = [0, 5];
        this.xtCenterOps.legend.data = ['申请数', '受理数']
        this.xtCenterOps.series[0].name = '申请数'
        this.xtCenterOps.series[0].data = applys
        this.xtCenterOps.series[1].name = '受理数'
        this.xtCenterOps.series[1].type = 'bar'
        this.xtCenterOps.series[1].data = accepts
      })
    },
    levBar() {
      // 紧急程度
      this.levOps = clone(this.echartsPieOptions.tactics)
      this.dispatch(STATISTICS_TWO).then(() => {
        this.levOps.series[0].name = '申请'
        this.levOps.legend.data = ['平级24小时', '加急6小时', '特级4小时', '特级2小时']
        this.levOps.legend.x = 'right'
        this.levOps.series[0]['label'] = {
          normal: {
            color: '#666',
            formatter: '{b}\n{a} {c}次 ({d}%)'
          }
        }
        this.levOps.series[0]['radius'] = ['70%', '85%'];
        this.levOps.series[1] = clone(this.levOps.series[0])
        var statisticsTwoArr = [];
        var types = '';
        statisticsTwoArr = this.unionStatistics.statisticsTwo;
        for(var i = 0; i < statisticsTwoArr.length; i++) {
          if(statisticsTwoArr[i].type === '0') {
            types = '平级24小时';
          }else if(statisticsTwoArr[i].type === '1') {
            types = '加急6小时';
          }else if(statisticsTwoArr[i].type === '2') {
            types = '特级4小时';
          }else if(statisticsTwoArr[i].type === '3') {
            types = '特级2小时';
          }
          this.levOps.series[0].data.push({ value: statisticsTwoArr[i].count, name: types });
          this.levOps.series[1].data.push({ value: statisticsTwoArr[i].count1, name: types });
        }
        // this.levOps.series[0].data = this.unionStatistics.statisticsTwo.map(d => { return { value: d.count, name: d.type } })
        // this.levOps.series[1] = clone(this.levOps.series[0])
        this.levOps.series[1].name = '受理'
        this.levOps.series[1]['label'] = {
          normal: {
            formatter: '{b}\n{a} {c}次',
            position: 'inner'
          }
        }
        this.levOps.series[1]['radius'] = [0, '50%']
      })
    },
    init() {
      this.timeOps = null
      this.timeOps1 = null
      this.timeLine();
      this.timeLine1();
    }
  },
  mounted() {},
  created() {
    this.init();
    this.states();
  }
}
</script>
