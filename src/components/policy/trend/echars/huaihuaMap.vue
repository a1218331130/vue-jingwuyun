<!-- 本市各区接处警总分布点图 -->
<template>
  <div class="tactics">
    <el-row :gutter="0">
      <el-col :span="24" class="tactics__box-wrap">
        <div class="tactics__box">
          <div class="tactics__box__title">
            全市接出警分布图
          </div>
          <div class="tactics__box__content rel">
            <echartsDetails :options="options"></echartsDetails>
            <huaihua-echarts :option="mapTestOps" mapdata="mapData"
                             style="width:100%; height:calc(100% - 0px);"></huaihua-echarts>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
  .tactics {
    padding: 10px;
    &__box {
      height: calc(100vh - 150px);
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
        overflow: hidden;
        border: 1px solid #ccc;
      }
      &__title + &__content {
        height: calc(100% - 40px);
        border-top: 0;
      }
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
      'huaihua-echarts': echarts,
      echartsDetails
    },
    data() {
      return {
        mapTestOps: null,
        options: {
          column: 'fourPlus',
          title: '接警处警数',
          tool: ['今年', '去年'],
          head: ['名称', '今年(接)', '去年(处)'],
          list: [{id: 1, name: '会同县', alarm: '435', danger: '4234', danger2: '435', alarm2: '4234'},
            {id: 2, name: '辰溪县', alarm: '434', danger: '2234', danger2: '434', alarm2: '2234'},
            {id: 3, name: '鹤城区', alarm: '134', danger: '1234', danger2: '434', alarm2: '2234'},
            {id: 4, name: '中方县', alarm: '834', danger: '234', danger2: '834', alarm2: '234'},
            {id: 5, name: '溆浦县', alarm: '1234', danger: '8834', danger2: '1234', alarm2: '8834'},
            {id: 6, name: '沅陵县', alarm: '2234', danger: '224', danger2: '224', alarm2: '2234'},
            {id: 7, name: '麻阳苗族自治县', alarm: '234', danger: '4234', danger2: '234', alarm2: '4234'},
            {id: 8, name: '芷江侗族自治县', alarm: '234', danger: '834', danger2: '234', alarm2: '834'},
            {id: 9, name: '洪江市', alarm: '234', danger: '634', danger2: '234', alarm2: '634'}
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
      change(val) {
        this.isChange = val
      }
    },
    created() {
      console.log();
    },
    mounted() {
      // 地图数据
      this.mapTestOps = clone(this.echartsMapOptions.base)
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
    }
  }
</script>
