<!-- 轨迹规律统计 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'轨迹规律统计'+(barTestOpsArea?'':'(暂无结果)')" :expand="true" :tableData="tableData" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <div class="content-box" v-show="expandMark">
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24" v-if="barTestOpsArea !== null">
        <echarts :option="barTestOpsArea" style="width:100%; height:300px;"></echarts>
      </el-col>
      <el-col :span="24" class="trajecth" v-else>
        <div class="empty"></div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<style lang="scss" scoped>
.kinship-box {
    text-align: center;
    margin-top: 13px;
    .trajecth {
        height: 113px;
    }
}
</style>


<script>
import dossierMixin from '../../dossierMixin'
import mixin from '../../../../utils/mixin'
// import {clone} from '../../../../utils/util'
import cardHeader from './card-header.vue'
import echarts from '../../../../widgets/echarts'
import echartsDetails from '../../../../widgets/echarts/echart-details'
import bus from '../../../../utils/bus'
import chartsOps from '../../../../utils/echartsOptions/all'
export default {
  mixins: [mixin, chartsOps, dossierMixin],
  components: {
    cardHeader,
    echarts,
    echartsDetails
  },
  data() {
    return {
      barTestOpsArea: null,
      tableData: []
    }
  },
  watch: {
    barTestOpsArea(val) {
      if(val !== null) {
        this.tableData.push(val)
      }
    },
    tableData(val) {
      bus.$emit('update:dossierSubTitle', { 'title': '轨迹规律统计', 'number': val.length })
    }
  },
  mounted() {
    //      this.barTestOpsArea = clone(this.echartsBarOptions.base)
    //      this.barTestOpsArea.xAxis.data = ['株洲市', '张家界市', '长沙市', '衡阳市', '湘潭市', '邵阳市', '岳阳市', '益阳市', '郴州市', '永州市', '娄底市', '常德市', '怀化市', '湘西土家族苗族自治州']
    //      // this.barTestOpsArea.legend.data = ['人员数量', '人员类型增量']
    //      var AreaTemp = [{
    //        name: '涉稳人员',
    //        type: 'bar',
    //        barWidth: 15,
    //        stack: '月份',
    //        data: [320, 270, 360, 340, 280, 800, 320, 270, 360, 340, 280, 800, 700, 500]
    //      }];
    //      this.barTestOpsArea.series = AreaTemp
  }
}
</script>
