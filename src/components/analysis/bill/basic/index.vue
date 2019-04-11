<!-- 基本账户分析 -->
<template>
<div class="bill-list" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" :key="i" title="基本账户分析" @click="currentTab=i">
          基本账户分析
          <i class="iconfont icon-close" @click.stop="removeTab(item)"></i>
        </div>
      </div>
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
            <el-row>
              <el-col :span="24">
                <el-form-item label="分析账号">
                  <span v-for="(val,i) in item.vals" :key="i">
                    {{val}}[{{item.names[i]}}] <i @click.stop="removeTab({guid:item.guid[i]})" class="iconfont icon-close"></i>
                     {{(i < item.vals.length - 1 ? ', ' : '')}} </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item prop="dateTime" label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm?item.queryForm:'', val)" placeholder="请选择"></el-date-picker>
            </el-form-item>

            <el-form-item prop="targetBank" label="对方开户行">
              <el-input v-model="item.queryForm.targetBank" placeholder=""></el-input>
            </el-form-item>

            <el-form-item prop="targetCarNo" label="对方账号">
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

            <!-- <el-form-item>
              <el-button type="primary" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>
      <!-- 结果列表 -->
      <div class="app-content-box">
        <div class="res-box" v-if="resBox===true">
          <el-table @cell-mouse-enter="cellMouseEnter" :height="listBoxHeight" border :data="table.data" @row-dblclick="showDetail" style="text-align:center;width: 100%;">
            <el-table-column type="index" label="序号" align="center" sortable>
              <template scope="scope">
                {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
              </template>
</el-table-column>
<el-table-column type="index" label="操作" align="center">
  <template scope="scope">
                    <span style="color:#46bdfd" class="view-map" @click="showDetail(scope.row)">查看</span>
                  </template>
</el-table-column>
<el-table-column sortable v-for="(item, indexT) in table.columnA" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
</el-table>
</div>
<!-- 结果详情 -->
<!--  v-show="detailBox===true" -->
<div class="detail-box" v-if="detailBox===true">
  <el-tabs @tab-click="tabQuery">
    <el-tab-pane label="详细信息" name="0">
      <el-table @cell-mouse-enter="cellMouseEnter" style="width:100%" :height="detailBoxHeight" :data="table.resData" stripe border>
        <el-table-column sortable v-for="(item, indexT) in table.columnB" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
      </el-table>
      <div class="app-toolbar footer">
        <pagination :count="item.count" :pagenav="item.pagenav" @update:pagenav="val=>updateDetailPage(val,item)"></pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane label="收支分类图" name="1">
      <echarts ref="echartstype" :option="option1" :style="{height:chartHeight+'px',width:'100%'}"></echarts>
    </el-tab-pane>
    <el-tab-pane label="累计收入支出图" name="2">
      <echarts ref="echarts" :option="option2" :style="{height:chartHeight+'px',width:'100%'}"></echarts>
    </el-tab-pane>
  </el-tabs>
</div>
</div>
</div>
</div>
</div>
</template>

<style lang="scss" scoped>
  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
    background: #54a8e7;
  }

  .comm {
    .app-toolbar {}
    .res-box {}
    .detail-box {}
  }

  .bill-list {
    height: 100%;
  }

  .tabs-box {
    display: flex;
    height: calc(100% - 37px);
    &__item {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      .app-content-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        .res-box {
          flex: none;
          overflow: auto;
        }
        .detail-box {
          flex: 1;
        }
      }
    }
  }

</style>

<script>
  import { FETCH_BILL_BASIC_DETAIL_LIST, FETCH_BILL_BP_CAT_LIST, FETCH_BILL_BP_COUNT_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import getColumnWidth from '../getColumnWidth'
  //  import {clone} from '../../../../utils/util'
  import echarts from '../../../../widgets/echarts'
  import searchBox from '../../search-tool'
  import pagination from '../../../../widgets/pagination/pagination'
  // import pagination from '../../pagination'
  export default {
    mixins: [billMixin],
    components: { echarts, searchBox, pagination },
    data() {
      return {
        commName: 'basic',
        singleTab: true,
        detailGuid: 0,
        title: '',
        subtext: '',
        option1: {
          title: {
            text: ''
          },
          tooltip: {},
          legend: {
            data: []
          },
          series: [{
            center: ['50%', '60%'],
            name: '交易类型',
            type: 'pie',
            data: [],
            labelLine: {
              normal: {
                show: true
              }
            },
            label: {
              normal: {
                show: true,
                position: 'outer'
              }
            }
          }]
        },
        option2: {
          title: {
            text: ''
          },
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
          grid: { left: '5%', bottom: '15%', containLabel: true },
          legend: {
            data: ['收入', '支出']
          },
          xAxis: {
            data: [],
            axisTick: { alignWithLabel: true }
          },
          yAxis: {},
          series: [{
            name: '收入',
            type: 'line',
            data: [],
            markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] }
          }, {
            name: '支出',
            type: 'line',
            data: [],
            markPoint: { data: [{ type: 'max', name: '最大值' }, { type: 'min', name: '最小值' }] }
          }]
        }
      }
    },
    computed: {
      listBoxHeight() {
        if (this.detailBox) {
          return 200;
        } else {
          return (document.documentElement.clientHeight - 430).toString()
        }
      },
      detailBoxHeight() {
        let offset = document.documentElement.clientHeight - 200 - 420;
        return (offset < 250 ? 250 : offset).toString()
      },
      chartHeight() {
        let offset = 420;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 100 ? 100 : height).toString()
      }
    },
    watch: {},
    methods: {
      getColumnWidth,
      query() {
        this.fetchBasicList(true, false)
        this.resBox = true
        this.detailBox = false
        this.table.resData = []
        this.currentTabItem.pagenav.currentpage = 1
        this.currentTabItem.pagenav.limit = 500
        this.currentTabItem.count = 0
      },
      showDetail(row, event, column) {
        this.currentTabItem.pagenav.currentpage = 1
        this.title = row.KHR
        this.subtext = row.ZZH
        this.detailGuid = row.GUID
        this.getDetail()
        this.chartQuery()
      },
      getDetail() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: this.detailGuid, // 账单id String 是
            v_edsx: target.queryForm.maxAmount, // 额度上限 Numeric 否
            v_edxx: target.queryForm.minAmount, // 额度下限 Numeric 否
            v_jywd: target.queryForm.netDot, // 交易网点 String 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
            v_sd: '', // 时段 String 否
            v_pageindex: target.pagenav.currentpage, // 页码 Int 否
            v_pagesize: target.pagenav.limit // 每页大小  Int 否
          })
        // this.detailGuid = row.GUID
        this.dispatch(FETCH_BILL_BASIC_DETAIL_LIST, queryForm).then(() => {
          this.table.resData = this.analysisBill.basicDetailList.JBZHFXDetailList
          target.count = this.analysisBill.basicDetailList.Result.totalcount || 500
          this.detailBox = true
        })
      },
      updateDetailPage(val, item) {
        let target = this.currentTabItem
        target.pagenav.currentpage = val.currentpage
        this.getDetail();
      },
      chartQuery() {
        let target = this.currentTabItem
        this.dispatch(FETCH_BILL_BP_CAT_LIST, this.delEmpey({
          v_yhid: '1aa0bd6b11d34bfe91ef013da111002d', // 任务ID
          v_zzh: '', // 主账号 String 否
          v_zdid: this.detailGuid, // 账单id String 是
          v_edsx: target.queryForm.maxAmount, // 额度上限 Numeric 否
          v_edxx: target.queryForm.minAmount, // 额度下限 Numeric 否
          v_jywd: target.queryForm.netDot, // 交易网点 String 否
          v_zy: target.queryForm.summay, // 摘要 String 否
          v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
          v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
          v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
          v_sd: '' // 时段 String 否
        })).then(() => {})
        this.dispatch(FETCH_BILL_BP_COUNT_LIST, this.delEmpey({
          v_yhid: '1aa0bd6b11d34bfe91ef013da111002d', // 任务ID
          v_zzh: '', // 主账号 String 否
          v_zdid: this.detailGuid, // 账单id String 是
          v_edsx: target.queryForm.maxAmount, // 额度上限 Numeric 否
          v_edxx: target.queryForm.minAmount, // 额度下限 Numeric 否
          v_jywd: target.queryForm.netDot, // 交易网点 String 否
          v_zy: target.queryForm.summay, // 摘要 String 否
          v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
          v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
          v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
          v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
          v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
          v_sd: '' // 时段 String 否
        })).then(() => {
          // 获取累计收入支出统计列表
        })
      },
      tabQuery(type) {
        if (type.name === '0') {
          // this.getDetail()
        } else if (type.name === '1') {
          this.option1.title.text = this.title
          this.option1.title.subtext = this.subtext
          this.option1.legend.data = []
          this.analysisBill.bpCatList.SZFLList.forEach((d) => {
            this.option1.legend.data.push(d.zy)
          })
          this.option1.series[0].data = this.analysisBill.bpCatList.SZFLList.map((d) => {
            return {
              value: d.jyje,
              name: d.zy
            }
          })
          this.option1.series[0].label.normal = {
            show: true,
            position: 'outer',
            textStyle: {
              color: '#666',
              fontSize: 14,
              fontWeight: 'normal'
            },
            formatter: '{d}%'
          }
          let chartElm2 = this.$refs['echartstype']
          if (chartElm2) {
            if (Array.isArray(chartElm2)) {
              chartElm2[0].action()
            } else {
              chartElm2.action()
            }
          }
        } else {
          this.option2.title.text = this.title
          this.option2.title.subtext = this.subtext
          this.option2.xAxis.data = []
          this.option2.series[0].data = []
          this.option2.series[1].data = []
          this.analysisBill.bpCountList.LJSRZCList.forEach((d) => {
            this.option2.xAxis.data.push(d.jyrq)
            this.option2.series[0].data.push(d.sr)
            this.option2.series[1].data.push(d.zc)
          })
          let chartElm = this.$refs['echarts']
          if (chartElm) {
            if (Array.isArray(chartElm)) {
              chartElm[0].action()
            } else {
              chartElm.action()
            }
          }
        }
      }
    },
    created() {
      this.table.columnB = [
        { label: '序号', prop: 'r' },
        { label: '主账号', prop: 'zzh' },
        { label: '对方账号', prop: 'dfzh' },
        { label: '交易卡号', prop: 'jykh' },
        { label: '开户名', prop: 'khm' },
        { label: '对方开户名', prop: 'dfkhm' },
        { label: '交易日期', prop: 'jyrq' },
        // { label: '交易次数', prop: 'count' },
        { label: '交易时间', prop: 'jysj' },
        { label: '摘要', prop: 'zy' },
        { label: '交易类型', prop: 'jylx' },
        { label: '交易金额(元)', prop: 'jyje' },
        { label: '交易网点', prop: 'jywdmc' }
      ]
      this.table.columnA.shift(1, 1)
      this.table.columnA.push({ label: '收入次数', prop: 'SKCS' }, { label: '支出次数', prop: 'ZCCS' })
    },
    mounted() {}
  }

</script>
