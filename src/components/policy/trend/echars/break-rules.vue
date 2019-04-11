<!--  全市2017主要刑事案件占比 -->
<template>
  <div>
    <div class="tactics__box">
      <div class="tactics__box__title">
        全市2017在手案件情况分布图
      </div>
      <el-row class="tactics__box__content">
        <el-col :span="8" class="tactics__box__content-echars">
          <echarts :option="mapTestOps" mapdata="mapData"
                   style="width:100%; height:calc(100% - 0px);"></echarts>
        </el-col>
        <el-col :span="8" class="tactics__box__content-echars">
          <echarts :option="radarOptions" style="width:100%; height:100%;"></echarts>
        </el-col>
        <el-col :span="8" class="tactics__box__content-echars rel">
          <echartsDetails :options="options"></echartsDetails>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .tactics__box {
    margin: 0;
    height: 455px;
    padding: 10px;
    padding-bottom: 0px;
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
      &-echars {
        height: 100%;
      }
    }
    &__title + &__content {
      height: calc(100% - 40px);
      border-top: 0;
    }
  }
</style>

<script>
  import mixin from '../../../../utils/mixin'
  import {clone} from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import echartsDetails from '../../../../widgets/echarts/echart-details'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [mixin, chartsOps],
    components: {
      echarts,
      echartsDetails
    },
    data() {
      return {
        pieTestOps: null,
        radarOptions: null,
        pieTestOpsAge: null,
        pieTestOpsGrade: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        isChange: true,
        showDetail: true,
        options: {
          column: 'three',
          title: '在手案件情况分布图',
          tool: null,
          head: ['名称', '数量', ''],
          // 沅陵县、鹤城区、洪江市、中方县、辰溪县、溆浦县、会同县、麻阳苗族自治县、新晃侗族自治县、芷江侗族自治县、靖州苗族侗族自治县、通道侗族自治县
          list: [{id: 1, name: '沅陵县', value: '435'},
            {id: 2, name: '鹤城区', value: '434'},
            {id: 3, name: '洪江市', value: '134'},
            {id: 4, name: '中方县', value: '834'},
            {id: 5, name: '辰溪县', value: '1234'},
            {id: 6, name: '溆浦县', value: '2234'},
            {id: 7, name: '会同县', value: '234'}
          ]
        }
      }
    },
    computed: {},
    watch: {},
    methods: {
      showList() {
        this.showDetail = !this.showDetail;
      },
      change() {
        this.isChange = !this.isChange
      }
    },
    created() {
      console.log();
    },
    mounted() {
      // 地图数据
      this.mapTestOps = clone(this.echartsMapOptions.base)
      this.mapTestOps.visualMap.show = 'false'
      this.mapTestOps.series[0].data = [{name: '会同县', value: 9}, {name: '辰溪县', value: 12}, {
        name: '鹤城区',
        value: 80
      }, {name: '中方县', value: 12}, {name: '溆浦县', value: 14}, {name: '沅陵县', value: 15}, {name: '麻阳苗族自治县', value: 16}, {
        name: '芷江侗族自治县',
        value: 18
      }, {name: '洪江市', value: 18}, {name: '靖州苗族侗族自治县', value: 19}, {name: '通道侗族自治县', value: 21}, {
        name: '新晃侗族自治县',
        value: 23
      }]
      this.radarOptions = clone(this.echartsRadarOptions.base)
      // 诈骗案、盗窃案、抢夺案、抢劫案、敲诈案、故意杀人 data: [
      this.radarOptions.radar[0].indicator = [
        {text: '沅陵县'},
        {text: '鹤城区'},
        {text: '洪江市'},
        {text: '中方县'},
        {text: '辰溪县'},
        {text: '溆浦县'},
        {text: '会同县'},
        {text: '新晃侗族自治县'},
        {text: '靖州苗族侗族自治县'},
        {text: '通道侗族自治县'}
      ]
      this.radarOptions.series[0].data[0] = [880, 80, 770, 940, 670, 770, 810, 830, 798, 900]
    }
  }
</script>
