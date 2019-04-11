<!-- 概况(统计) -->
<template>
<div class="tactics echarts-div_box">
  <el-row :gutter="0" style="height: 100%">
    <el-col :span="24" style="height: 100%" class="tactics__box-wrap">
      <div class="tactics__box">
        <div class="tactics__box__title">
          {{title}}
        </div>
        <div class="tactics__box__content rel">
          <img :src="echartImg" v-show="echartImg" />
          <echarts v-show="!echartImg" :option="mapTestOps" :mapdata="mapData" style="width:100%; height:100%;" ref="echart"></echarts>
        </div>
      </div>
    </el-col>
  </el-row>
</div>
</template>
<style lang="scss" scoped>
  .tactics {
    /*padding: 10px;*/
    &__box {
      /*height: calc(100vh - 150px);*/
      &-wrap {
        /*height: calc(100vh - 160px);*/
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
        overflow: hidden;
        border: 1px solid #ccc;
      }
      &__title+&__content {
        height: calc(100% - 40px);
        border-top: 0;
      }
    }
  }

</style>

<script>
  import mixin from '../../../../utils/mixin'
  import { clone } from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import mapData from '../../../../utils/echartsOptions/mapData'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [mixin, chartsOps, mapData],
    components: {
      echarts
    },
    data() {
      return {
        echartImg: '',
        mapTestOps: null,
        showDetail: true,
        options: {
          column: 'three',
          title: '在控对象情况分布图',
          tool: null,
          head: ['名称', '数量'],
          list: [
            { id: 1, name: '四川', value: '435' },
            { id: 2, name: '山东', value: '434' },
            { id: 3, name: '广东', value: '134' },
            { id: 4, name: '河南', value: '834' },
            { id: 5, name: '重庆', value: '1234' },
            { id: 6, name: '河北', value: '2234' },
            { id: 7, name: '江苏', value: '234' },
            { id: 8, name: '湖北', value: '234' },
            { id: 9, name: '浙江', value: '234' }
          ]
        },
        echartmap: {
          name: [],
          mapname: []
        }
      }
    },
    computed: {},
    props: ['echartdata', 'cardata', 'title'],
    watch: {
      echartdata(val) {
        this.echartmap.name = Array.from(new Set(val.chinaMap.map(d => {
          return d.FJDMMC
        })))
        this.echartmap.mapname = ['鹤城区', '沅陵县', '新晃侗族自治县', '洪江市', '麻阳苗族自治县', '辰溪县', '会同县', '中方县', '芷江侗族自治县', '通道侗族自治县', '靖州苗族侗族自治县', '溆浦县', '怀化市']
        this.echartmap.name.map(a => {
          this.echartmap[a] = []
          this.echartmap.mapname.map(b => {
            let data = ''
            val.chinaMap.filter(c => a === c.FJDMMC).map(d => {
              if (d.SSQYMC === b) {
                data = d.NUM
              }
            })
            if (data !== '') {
              this.echartmap[a].push({ name: b, value: data })
            } else {
              this.echartmap[a].push({ name: b, value: 0 })
            }
          })
        })
        // 地图数据
        this.mapTestOps = clone(this.echartsMapOptions.base)
        this.mapTestOps.series = []
        this.echartmap.name.map(d => {
          this.mapTestOps.series.push({
            name: d,
            type: 'map',
            mapType: 'mapData',
            roam: true,
            zoom: 1.3,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, .2)'
              }
            },
            data: this.echartmap[d]
          })
        })
        let option = this.mapTestOps.series
        this.mapTestOps.tooltip = {
          // formatter: '{b}:<br />(重点群体人员：{c})<br />(重点行业单位：0)<br />(重点场所部位：0)<br />(重点车辆管控：0)<br />(无人驾驶航空器管理：0)<br />(重点线索管理：0)'
          trigger: 'item',
          formatter: function(params) {
            let res = params.name + '<br/>'
            let myseries = option
            for (let i = 0; i < myseries.length; i++) {
              for (let j = 0; j < myseries[i].data.length; j++) {
                if (myseries[i].data[j].name === params.name) {
                  res += myseries[i].name + ':' + myseries[i].data[j].value + '</br>'
                }
              }
            }
            return res
          }
        }
        this.mapTestOps.series[0].zoom = 1.2
      },
      cardata(val) {
        this.echartmap.name = Array.from(new Set(val.chinaMap.map(d => {
          return d.CLLXMC
        })))
        this.echartmap.mapname = ['鹤城区', '沅陵县', '新晃侗族自治县', '洪江市', '麻阳苗族自治县', '辰溪县', '会同县', '中方县', '芷江侗族自治县', '通道侗族自治县', '靖州苗族侗族自治县', '溆浦县', '怀化市']
        this.echartmap.name.map(a => {
          this.echartmap[a] = []
          this.echartmap.mapname.map(b => {
            let data = ''
            val.chinaMap.filter(c => a === c.CLLXMC).map(d => {
              if (d.SSQYMC === b) {
                data = d.NUM
              }
            })
            if (data !== '') {
              this.echartmap[a].push({ name: b, value: data })
            } else {
              this.echartmap[a].push({ name: b, value: 0 })
            }
          })
        })
        // 地图数据
        this.mapTestOps = clone(this.echartsMapOptions.base)
        this.mapTestOps.series = []
        this.echartmap.name.map(d => {
          this.mapTestOps.series.push({
            name: d,
            type: 'map',
            mapType: 'mapData',
            roam: true,
            zoom: 1.3,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, .2)'
              }
            },
            data: this.echartmap[d]
          })
        })
        let option = this.mapTestOps.series
        this.mapTestOps.tooltip = {
          // formatter: '{b}:<br />(重点群体人员：{c})<br />(重点行业单位：0)<br />(重点场所部位：0)<br />(重点车辆管控：0)<br />(无人驾驶航空器管理：0)<br />(重点线索管理：0)'
          trigger: 'item',
          formatter: function(params) {
            let res = params.name + '<br/>'
            let myseries = option
            for (let i = 0; i < myseries.length; i++) {
              for (let j = 0; j < myseries[i].data.length; j++) {
                if (myseries[i].data[j].name === params.name) {
                  res += myseries[i].name + ':' + myseries[i].data[j].value + '</br>'
                }
              }
            }
            return res
          }
        }
        this.mapTestOps.series[0].zoom = 1.2
      }
    },
    methods: {},
    created() {},
    mounted() {
      // 地图数据
      //
      // this.mapTestOps = clone(this.echartsMapOptions.base)
      // this.mapTestOps.series = []
      // this.mapTestOps.series.push({
      //   name: '涉毒类',
      //   type: 'map',
      //   mapType: 'mapData',
      //   roam: true,
      //   zoom: 1.3,
      //   label: {
      //     normal: {
      //       show: true
      //     },
      //     emphasis: {
      //       show: true
      //     }
      //   },
      //   itemStyle: {
      //     normal: {
      //       borderColor: 'rgba(0, 0, 0, .2)'
      //     }
      //   },
      //   data: [
      //     { name: '鹤城区', value: 91 },
      //     { name: '沅陵县', value: 21 },
      //     { name: '新晃侗族自治县', value: 21 },
      //     { name: '洪江市', value: 23 },
      //     { name: '麻阳苗族自治县', value: 24 },
      //     { name: '辰溪县', value: 13 },
      //     { name: '会同县', value: 13 },
      //     { name: '芷江侗族自治县', value: 21 },
      //     { name: '中方县', value: 54 },
      //     { name: '芷江侗族自治县', value: 56 },
      //     { name: '通道侗族自治县', value: 78 },
      //     { name: '靖州苗族侗族自治县', value: 23 },
      //     { name: '溆浦县', value: 34 },
      //     { name: '怀化市', value: 100 }
      //   ]
      // }, {
      //   name: '涉军类',
      //   type: 'map',
      //   mapType: 'mapData',
      //   roam: true,
      //   zoom: 1.3,
      //   label: {
      //     normal: {
      //       show: true
      //     },
      //     emphasis: {
      //       show: true
      //     }
      //   },
      //   itemStyle: {
      //     normal: {
      //       borderColor: 'rgba(0, 0, 0, .2)'
      //     }
      //   },
      //   data: [
      //     { name: '鹤城区', value: 92 },
      //     { name: '沅陵县', value: 21 },
      //     { name: '新晃侗族自治县', value: 21 },
      //     { name: '洪江市', value: 23 },
      //     { name: '麻阳苗族自治县', value: 24 },
      //     { name: '辰溪县', value: 13 },
      //     { name: '会同县', value: 13 },
      //     { name: '芷江侗族自治县', value: 21 },
      //     { name: '中方县', value: 54 },
      //     { name: '芷江侗族自治县', value: 56 },
      //     { name: '通道侗族自治县', value: 78 },
      //     { name: '靖州苗族侗族自治县', value: 23 },
      //     { name: '溆浦县', value: 34 },
      //     { name: '怀化市', value: 100 }
      //   ]
      // })
      // let option = this.mapTestOps.series
      // this.mapTestOps.tooltip = {
      //   // formatter: '{b}:<br />(重点群体人员：{c})<br />(重点行业单位：0)<br />(重点场所部位：0)<br />(重点车辆管控：0)<br />(无人驾驶航空器管理：0)<br />(重点线索管理：0)'
      //   trigger: 'item',
      //   formatter: function (params) {
      //     let res = params.name + '<br/>'
      //     let myseries = option
      //     for(let i = 0; i < myseries.length; i++) {
      //       for(let j = 0; j < myseries[i].data.length; j++) {
      //         if(myseries[i].data[j].name === params.name) {
      //           res += myseries[i].name + ':' + myseries[i].data[j].value + '</br>'
      //         }
      //       }
      //     }
      //     return res
      //   }
      // }
      // this.mapTestOps.series[0].zoom = 1.2
    }
  }

</script>
