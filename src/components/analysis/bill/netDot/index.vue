<!-- 交易网点分析 -->
<!-- 需补充拆线图和柱状图 -->
<template>
<div class="bill-list" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <el-tabs v-model="elTab" v-if="tabs.length>0" :closable="true" @tab-remove="removeTab" @tab-click="updateCurrentTab">
        <el-tab-pane v-for="(item,i) in tabs" :name="`${item.keyVal}|${item.name}`" :key="i" :label="`${item.keyVal}[${item.name}]`"></el-tab-pane>
      </el-tabs>
        <span v-else>&nbsp</span>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>

  <div class="tabs-box">
    <div class="tabs-box__item" v-for="(item,i) in tabs" :key="i" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <!-- 条件 -->
          <el-form :model="item.queryForm" :inline="true" label-width="105px">
            <el-button type="primary" class="primary-btn" native-type="submit" @click.prevent="chartQuery">分析</el-button>
            <el-form-item prop="dateTime" label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>

            <el-form-item prop="targetBank" label="对方开户行">
              <el-input v-model="item.queryForm.targetBank" placeholder=""></el-input>
            </el-form-item>

            <el-form-item prop="targetAccound" label="对方账号">
              <el-input v-model="item.queryForm.targetAccound" placeholder=""></el-input>
            </el-form-item>

            <el-form-item prop="type" label="交易类型">
              <el-select v-model="item.queryForm.type" placeholder="请选择">
                <el-option v-for="item in typeOps" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="summay" label="摘要">
              <el-input v-model="item.queryForm.summay" placeholder=""></el-input>
              <!-- <el-select v-model="item.queryForm.summay" filterable placeholder="请选择">
                <el-option v-for="item in summayOps" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item prop="minAmount" label="金额范围">
              <input type="number" v-model="item.queryForm.minAmount" @blur="item.queryForm.minAmount = moneyChange(item.queryForm.minAmount, item.queryForm)" :min="0" class="cus-number-input" placeholder="最小金额" /> -
              <input type="number" v-model="item.queryForm.maxAmount" @blur="item.queryForm.maxAmount = moneyChange(item.queryForm.maxAmount, item.queryForm)" :min="0" class="cus-number-input" placeholder="最大金额" />
            </el-form-item>
            <el-form-item prop="netDot" label="交易网点">
              <el-input v-model="item.queryForm.netDot" placeholder=""></el-input>
            </el-form-item>

            <!--
            <el-form-item>
              <el-button type="primary" native-type="submit" @click.prevent="chartQuery">分析</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>
      <!-- 结果详情 -->
      <div class="app-content-box">

        <div class="detail-box" v-if="mainBox===true">
          <el-tabs  v-model="resTab">
            <el-tab-pane label="交易网点分析" name='0'>
              <el-table @cell-mouse-enter="cellMouseEnter" 
              stripe 
              border 
              :height="tableHeight" 
              :data="item.queryForm.resData" style="width:100%;" @row-dblclick="rowClick">
                <el-table-column sortable v-for="item in table.columnB" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
              </el-table>
              <div class="app-toolbar footer">
                <pagination :count="item.count" :pagenav="item.queryForm.pagenav" @update:pagenav="val=>updatePage(val,item)"></pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="交易网点金额图" name='1'>
              <div>
                <el-row style="padding: 20px; overflow: auto">
                  <el-col :span="24">
                    <echarts :ref="item.keyVal" :events="eventEchart" :option="item.queryForm.chartData" :style="{height:chartHeight+'px'}"></echarts>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
            <el-tab-pane label="交易网点次数图" name='2'>
              <div>
                <el-row style="padding: 20px;overflow: auto">
                  <el-col :span="24">
                    <echarts :ref="item.keyVal" :events="eventEchart" :option="item.queryForm.chartData2" :style="{height:chartHeight+'px'}"></echarts>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <el-dialog v-draggable="dialogDraggableOptions" class="detail-box" :visible.sync="dialogDetail" size="large" title="详细列表" >
        <el-table @cell-mouse-enter="cellMouseEnter" border :data="dialogList" v-loading="tableloading" height="500">
          <el-table-column sortable v-for="item in table.columnC" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
        </el-table>
        <div class="app-toolbar footer">
          <pagination :count="item.queryForm.pageInfo.count" :pagenav="item.queryForm.pageInfo" @update:pagenav="val=>updateDetailPage(val,item)"></pagination>
        </div>
      </el-dialog>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .comm {
    .app-toolbar {}
    .res-box {}
    .detail-box {}
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
    background: #54a8e7;
  }

</style>
<style>
  .bill-list .tabs-box .el-dialog--info-fixed {
    width: 80%;
  }

</style>

<script>
  import { FETCH_BILL_NET_DOT_LIST, FETCH_BILL_NET_DOT_DETAIL_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import { clone } from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import pagination from '../../../../widgets/pagination/pagination'
  import searchBox from '../../search-tool'
  import getColumnWidth from '../getColumnWidth'
  export default {
    mixins: [billMixin],
    components: { echarts, searchBox, pagination },
    data() {
      return {
        title: '',
        subtext: '',
        resTab: '0',
        commName: 'netDot',
        dialogList: [],
        dialogDetail: false,
        tableloading: false,
        option1: {
          color: ['#3398DB'],
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
          grid: { left: '5%', bottom: '15%', containLabel: true },
          xAxis: [{ data: [], axisLabel: { interval: 0, rotate: 40 }, axisTick: { alignWithLabel: true } }],
          yAxis: [{ type: 'value' }],
          legend: {
            data: ['交易金额']
          },
          series: [{
            name: '交易金额',
            type: 'bar',
            barWidth: '35%',
            data: []
          }]
        },
        option2: {
          title: {
            text: ''
          },
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
          legend: {
            data: ['交易次数']
          },
          grid: { left: '5%', bottom: '15%', containLabel: true },
          xAxis: {
            data: [],
            axisTick: { alignWithLabel: true },
            axisLabel: { interval: 0, rotate: 40, height: 200 }
          },
          yAxis: {},
          series: [{
            name: '交易次数',
            type: 'line',
            data: [],
            markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] }
          }]
        },
        eventEchart: [{ // 点击事件绑定
          on: 'click',
          method: this.chartClick
        }]
      }
    },
    computed: {
      tableHeight() {
        let offset = 430;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 100 ? 100 : height).toString()
      },
      chartHeight() {
        let offset = 390;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 100 ? 100 : height).toString()
      }
    },
    watch: {},
    methods: {
      getColumnWidth,
      query() {
        this.fetchMainList()
        this.mainBox = true
        this.dialogDetail = false
      },
      chartQuery(type) {
        this.resTab = '0'
        // let _currentQuery = clone(this.tabs[this.currentTab])
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_rwid: '', // 分析任务id String 否
            v_zzh: target.keyVal, // 主账号 String 否
            v_zdid: target.guid, // 账单id String 是
            v_jywd: target.queryForm.netDot, // 交易网点（名称） String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_edsx: target.queryForm.maxAmount, // 额度上限 Int 否
            v_edxx: target.queryForm.minAmount, // 额度下限 Int 否
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_sd: '', // 时段  String 否
            v_pageindex: target.queryForm.pagenav.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pagenav.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_NET_DOT_LIST, queryForm).then(() => {
          target.queryForm.resData = this.analysisBill.netDotList.JYWDList
          target.count = this.analysisBill.netDotList.Result.totalcount || 0
          this.option1.xAxis[0].data = []
          this.option1.series[0].data = []
          this.option2.xAxis.data = []
          this.option2.series[0].data = []
          this.analysisBill.netDotList.JYWDList.forEach((d) => {
            this.option1.xAxis[0].data.push(d.jywdmc || '未知网点')
            this.option1.series[0].data.push({ value: d.jyje, minrq: d.minrq, maxrq: d.maxrq, netcode: d.jywddm })
            this.option2.xAxis.data.push(d.jywdmc || '未知网点')
            this.option2.series[0].data.push({ value: d.jycs, minrq: d.minrq, maxrq: d.maxrq, netcode: d.jywddm })
          })
          this.option1.dataZoom = [{ type: 'inside' }]
          this.option2.dataZoom = [{ type: 'inside' }]
          target.queryForm.chartData = clone(this.option1)
          target.queryForm.chartData2 = clone(this.option2)
          this.mainBox = true
          // 获取图表元素
          // let chartElm = this.$refs[target.keyVal]
          // 更新图表
          // if (chartElm) {
          //   if (Array.isArray(chartElm)) {
          //     chartElm.forEach(elm => {
          //       console.log(elm);
          //       elm.action()
          //     })
          //   } else {
          //     chartElm.action()
          //   }
          // }
        })
      },
      tabQuery(type) {
        let target = this.currentTabItem
        target.queryForm.pagenav.currentpage = 0
        this.chartQuery(type)
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_rwid: '', // 分析任务id String 否
            v_zzh: target.keyVal, // 主账号 String 否
            v_zdid: target.guid, // 账单id String 是
            v_jywd: '', // 交易网点（名称） String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_edsx: target.queryForm.maxAmount, // 额度上限 Int 否
            v_edxx: target.queryForm.minAmount, // 额度下限 Int 否
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_sd: '' // 时段  String 否
          })
        this.dispatch(FETCH_BILL_NET_DOT_LIST, queryForm).then(() => {
          target.queryForm.resData = this.analysisBill.netDotList.JYWDList
          target.count = this.analysisBill.netDotList.Result.totalcount || 0
          this.mainBox = true
        })
      },
      chartClick(p) {
        // console.log('图表', p);
        //  图表点击查询话单详情 （1 - 4 类型）
        let _currentQuery = clone(this.tabs[this.currentTab])
        // 查询条件
        _currentQuery.keyVal = p.value // 交易次数
        _currentQuery.queryForm.attribution = p.name // 交易日期
        //  详单列表查询
        this.detailQueryCondition = Object.assign({}, _currentQuery)
        // this.tableloading = true
        this.dialogList = []
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: target.guid, // 账单id String 是
            v_jywd: p.data.netcode, // 交易网点代码 String 是
            v_jywdmc: p.name === '未知帐号' ? '' : p.name, // 交易网点名称 String 是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_edsx: target.queryForm.maxAmount, // 额度下限 Int 否
            v_edxx: target.queryForm.minAmount, // 额度上限 Int 否
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 否
            v_sd: '' // 时段  String 否
          })
        this.dispatch(FETCH_BILL_NET_DOT_DETAIL_LIST, queryForm).then(() => {
          this.dialogList = this.analysisBill.netDotDetailList.JYWDDetailList
          target.queryForm.pageInfo.count = this.analysisBill.netDotDetailList.Result.totalcount || 0
          this.dialogDetail = true
        })
      },
      /**
       * 分页操作
       */
      updatePage(val, item) {
        let target = this.currentTabItem
        target.queryForm.pagenav.currentpage = val.currentpage
        this.chartQuery();
      },
      updateDetailPage(val, item) {
        // console.log('分页');
        let target = this.currentTabItem
        target.queryForm.pageInfo.currentpage = val.currentpage
        this.showDetail();
      },
      rowClick(row, event, column) {
        // let target = this.currentTabItem
        // target.queryForm.pageInfo.currentpage = 0
        this.showDetail(row, event, column);
      },
      showDetail(row, event, column) {
        this.tableloading = true
        let target = this.currentTabItem
        if (row) {
          target.queryForm.rowGuid = row.guid
          target.queryForm.rowJywddm = row.jywddm
          target.queryForm.rowJywdmc = row.jywdmc
        }
        let queryForm = this.delEmpey({
          v_zdid: target.queryForm.rowGuid === '' ? row.guid : target.queryForm.rowGuid, // 账单id String 是
          v_jywd: target.queryForm.rowJywddm === '' ? row.jywddm : target.queryForm.rowJywddm, // 交易网点代码 String 是
          v_jywdmc: target.queryForm.rowJywdmc === '' ? row.jywdmc : target.queryForm.rowJywdmc, // 交易网点名称 String 是
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
          v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
          v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
          v_zy: target.queryForm.summay, // 摘要 String 否
          v_edsx: target.queryForm.maxAmount, // 额度上限 Int 否
          v_edxx: target.queryForm.minAmount, // 额度下限 Int 否
          v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 否
          v_sd: '', // 时段  String 否
          v_pageindex: target.queryForm.pageInfo.currentpage, // 页码 Int 否
          v_pagesize: target.queryForm.pageInfo.limit // 每页大小  Int 否
        })
        this.dispatch(FETCH_BILL_NET_DOT_DETAIL_LIST, queryForm).then(() => {
          this.dialogList = this.analysisBill.netDotDetailList.JYWDDetailList
          target.queryForm.pageInfo.count = this.analysisBill.netDotDetailList.Result.totalcount || 0
          this.tableloading = false
          this.dialogDetail = true
        })
      }
    },
    created() {
      this.table.columnB = [
        { label: '序号', prop: 'r' },
        { label: '开户名', prop: 'khr' },
        { label: '主账号', prop: 'zzh' },
        { label: '网点代码', prop: 'jywddm' },
        { label: '网点名称', prop: 'jywdmc' },
        { label: '交易次数', prop: 'jycs' },
        { label: '交易金额', prop: 'jyje' }
      ]
    },
    mounted() {}

  }

</script>
