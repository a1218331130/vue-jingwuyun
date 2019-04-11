<!-- 本市各区接处警总分布点图 -->
<template>
<div class="tactics">
  <el-row :gutter="0">
    <el-col :span="24" class="tactics__box-wrap">
      <div class="tactics__box">
        <div class="tactics__box__title">
          全市主要刑事案犯罪户籍分布图
        </div>
        <div class="tactics__box__content rel">
          <echartsDetails :options="options"></echartsDetails>
          <echarts :option="mapTestOps" mapdata="chinaMapDataJson" style="width:100%; height:calc(100% - 0px);"></echarts>
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
import { clone } from '../../../../utils/util'
import echarts from '../../../../widgets/echarts'
import echartsDetails from '../../../../widgets/echarts/echart-details'
import chartsOps from '../../../../utils/echartsOptions/all'
import mapData from '../../../../utils/echartsOptions/mapData'
export default {
  mixins: [mixin, chartsOps, mapData],
  components: {
    echarts,
    echartsDetails
  },
  data() {
    return {
      mapTestOps: null,
      options: {
        column: 'three',
        title: '刑事案犯罪户籍分布图',
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
    this.mapTestOps = clone(this.echartsMapOptions.chinaMap)
    this.mapTestOps.series[0].data = [{ name: '北京', value: 800 },
      { name: '天津', value: 800 },
      { name: '上海', value: 11800 },
      { name: '重庆', value: 2800 },
      { name: '河北', value: 4800 },
      { name: '河南', value: 61800 },
      { name: '云南', value: 91800 },
      { name: '辽宁', value: 8090 },
      { name: '黑龙江', value: 800 },
      { name: '湖南', value: 8009 },
      { name: '安徽', value: 8050 },
      { name: '山东', value: 8050 },
      { name: '新疆', value: 1800 },
      { name: '江苏', value: 3800 },
      { name: '浙江', value: 8010 },
      { name: '江西', value: 2800 },
      { name: '湖北', value: 800 },
      { name: '广西', value: 800 },
      { name: '甘肃', value: 2800 },
      { name: '山西', value: 2800 },
      { name: '内蒙古', value: 800 },
      { name: '陕西', value: 2800 },
      { name: '吉林', value: 2800 },
      { name: '福建', value: 2800 },
      { name: '贵州', value: 800 },
      { name: '广东', value: 800 },
      { name: '青海', value: 80 },
      { name: '西藏', value: 80 },
      { name: '四川', value: 800 },
      { name: '宁夏', value: 80 },
      { name: '海南', value: 80 },
      { name: '台湾', value: 80 },
      { name: '香港', value: 800 },
      { name: '澳门', value: 800 }
    ]
  }
}
</script>
