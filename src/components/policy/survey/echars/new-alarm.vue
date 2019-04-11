<!-- 概况(统计) -->
<template>
  <div>
    <el-row :gutter="0" style="overflow: hidden;">
      <el-col :span="12">
        <div class="tactics__box" style="padding-right: 5px">
          <div class="tactics__box__title">
            最新警情
          </div>
          <el-table @cell-mouse-enter="cellMouseEnter" class="tactics__box__content app-table" border stripe :data="list">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="time" label="时间" width="200">
            </el-table-column>
            <el-table-column prop="area" label="地区" width="200">
            </el-table-column>
            <el-table-column prop="detail" label="案情">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="tactics__box" style="padding-left: 5px">
          <div class="tactics__box__title">
            本市各区值班人员表
          </div>
          <el-table @cell-mouse-enter="cellMouseEnter" class="tactics__box__content app-table" border stripe :data="perList">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="area" label="地区" width="200">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="200">
            </el-table-column>
            <el-table-column prop="phone" label="联系方式">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
  .tactics__box {
    margin: 0;
    height: 325px;
    padding: 10px ;
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
  import chartsOps from '../../../../utils/echartsOptions/all'
  import mapData from '../../../../utils/echartsOptions/mapData'
  export default {
    mixins: [mixin, chartsOps, mapData],
    components: {
      echarts
    },
    data() {
      return {
        pieTestOps: null,
        lineTestOps: null,
        mapTestOps: null,
        barTestOps: null,
        list: [],
        perList: []
      }
    },
    computed: {},
    watch: {},
    methods: {},
    created() {
      for (var i = 0; i < 10; i++) {
        this.list.push({
          detail: '某某伤人案，致多人人受伤',
          area: '怀化长沙县',
          time: '2017-07-21 :21:44:55'
        })
      }
      for (var k = 0; k < 10; k++) {
        this.perList.push({
          area: '辰溪县',
          name: '张三',
          phone: '15089555220'
        })
      }
    },
    mounted() {
      // 柱图数据
      this.barTestOps = clone(this.echartsBarOptions.horizontalType)
      this.barTestOps.xAxis.data = ['在逃人员', '前科人员', '少数民族', '吸毒人员', '涉人员', '涉枪人员']
      this.barTestOps.series[0].data = [320, 270, 360, 340, 280, 800, 500, 700]
    }
  }
</script>
