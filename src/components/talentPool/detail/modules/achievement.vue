<template>
  <!--主要业绩-->
  <div class="bmhx_box">
    <card-header title="注意业绩"></card-header>
    <!--大模块内容-->
    <div class="bmhx_box_body">
      <!-- 小模块内容-->
      <div class="bmhx_content" style="text-align:center;">
        <h4 style="text-align:left;">办案业绩</h4>
        <echarts :option="barTestOpsField" style="width:100%; height:calc(100% - 35px);"></echarts>
      </div>

      <!-- 小模块内容-->

    </div>
    <div class="bmhx_box_body">
      <!-- 小模块内容-->
      <div class="bmhx_content" style="text-align:center;">
        <h4 style="text-align:left;">考核情况</h4>
        <div class="zb_table">
          <ul class="zb_table_ul">

            <li class="zb_table_li" v-for="item in datalist ">
              <div class="zb_table_bt">{{item.title}}</div>
              <p>{{item.number}}</p>
            </li>

            <div style=" clear: both"></div>
          </ul>


        </div>

      </div>

      <!-- 小模块内容-->

    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>


<script>
  import mixin from '../../../../utils/mixin'
  import {clone} from '../../../../utils/util'
  import cardHeader from './card-header.vue'
  import echarts from '../../../../widgets/echarts'
  import chartsOps from '../../../../utils/echartsOptions/all'
  export default {
    mixins: [mixin, chartsOps],
    components: {
      cardHeader,
      echarts
    },
    data() {
      return {
        datalist: [{
          title: '在办',
          number: '5件6人'
        }, {
          title: '侦查',
          number: '5件6人'
        }, {
          title: '移送起诉',
          number: '5件6人'
        }, {
          title: '移送不起诉',
          number: '5件6人'
        }, {
          title: '撤案',
          number: '5件6人'
        }, {
          title: '其他',
          number: '5件6人'
        }],
        barTestOpsField: null
      }
    },
    mounted() {
      // 擅长领域分布图
      // 电子取证 话单分析 财务分析 心理测谎 司法会计 情报研判
      this.barTestOpsField = clone(this.echartsBarOptions.horizontalType)
      this.barTestOpsField.xAxis.data = ['2006', '2007', '2008', '2009', '2010', '2011']
      // this.barTestOpsField.legend.data = ['人员数量', '人员类型增量']
      var temp = [{
        name: '涉稳人员',
        type: 'bar',
        barWidth: 20,
        stack: '月份',
        data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800]
      }];
      this.barTestOpsField.series = temp
    }
  }
</script>

