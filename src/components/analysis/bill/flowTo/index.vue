<!-- 资金流向分析 -->
<template>
<div class="bill-list" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div :class="{'tabs__item':true,'current':currentTab===i}" v-for="(item,i) in tabs" title="资金流向分析" @click="currentTab=i">
          资金流向分析
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
    <div class="tabs-box__item" v-for="(item,i) in tabs" v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <!-- 条件 -->
          <el-form :model="item.queryForm" :inline="true" label-width="105px">

            <el-row>
              <el-col :span="24">
                <el-form-item label="分析账号">
                  <span v-for="(val,i) in item.vals">
                    {{val}}[{{item.names[i]}}] <i @click.stop="removeTab({guid:item.guid[i]})" class="iconfont icon-close"></i> {{(i
                    < item.vals.length-1? ', ': '')}} </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-button type="primary" class="primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item prop="dateTime" label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>

            <el-form-item prop="targetBank" label="对方开户行">
              <el-input v-model="item.queryForm.targetBank" placeholder=""></el-input>
            </el-form-item>

            <el-form-item prop="type" label="交易类型">
              <el-select v-model="item.queryForm.type" placeholder="请选择">
                <el-option v-for="item in flowtypeOps" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="targetAccound" label="目标账户">
              <el-select v-model="item.queryForm.targetAccound" placeholder="请选择">
                <el-option v-for="(SA,SAKey) in item.vals" :label="SA" :key="SAKey" :value="SA"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="sourceAccound" label="源账户">
              <el-select v-model="item.queryForm.sourceAccound" placeholder="请选择">
                <el-option v-for="(SA,SAKey) in item.vals" :label="SA" :key="SAKey" :value="SA"></el-option>
              </el-select>
            </el-form-item>


            <!-- <el-form-item>
              <el-button type="primary" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>
      <!-- 结果列表 -->
      <div class="app-content-box">
        <!-- 结果列表 -->
          <el-collapse v-model="activeNames" v-show="resBox===true && !loading" @change="collapseChange">
          <el-collapse-item title="结果列表" name="table">
        <div class="res-box" v-if="resBox===true">
          <el-table @cell-mouse-enter="cellMouseEnter" :height="tableHeight" stripe border :data="table.data">
            <el-table-column sortable border v-for="item in table.columnB" :key="item.prop" :label="item.label" :prop="item.prop"></el-table-column>
          </el-table>
        </div>
         </el-collapse-item>
            <el-collapse-item title="结果关系图" name="chart">
        <!-- 结果详情 -->
        <!-- v-if="detailBox===true" -->
        <el-tabs v-show="detailBox===true" :style="fullScreenStyle">
          <el-tab-pane label="关系图">
<div class="spc-tab-right-box">
  <el-button @click="toggleFullScreen(chartIsFullScreen)">
    <i v-if="chartIsFullScreen" class="iconfont icon-min"></i>
    <i v-else class="iconfont icon-max"></i> {{chartIsFullScreen ? '缩小': '全屏'}}</el-button>
  <el-button @click="setLayout('GridLayout','billFlowToGoBox')">
    <i class="icon iconfont icon-guanlian1"></i> 网格

  </el-button>
  <el-button @click="setLayout('LayeredDigraphLayout','billFlowToGoBox')">
    <i class="icon iconfont icon-data-slice"></i> 分层

  </el-button>
  <el-button @click="setLayout('CircularLayout','billFlowToGoBox')">
    <i class="icon iconfont icon-fenleijishougongtongbu"></i> 圆形

  </el-button>
  <el-button @click="setLayout('ForceDirectedLayout','billFlowToGoBox')">
    <i class="icon iconfont icon-hudong"></i> 反牵引力

  </el-button>
  <el-button @click="setLayout('TreeLayout','billFlowToGoBox')">
    <i class="icon iconfont icon-ranking"></i> 树形

  </el-button>
</div>

            <gocharts ref="billFlowToGoBox" boxId="billFlowToGoBox" :data="goData" @link-click="linkClickEvent" :options="goOptions" :style="chartStyle"></gocharts>
          </el-tab-pane>
        </el-tabs>
         </el-collapse-item>
          </el-collapse>
      </div>

    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .res-box {}

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
    background: #54a8e7;
  }

</style>

<script>
  import { FETCH_BILL_FLOW_TO_LIST, FETCH_BILL_FLOW_TO_DETAIL_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import { clone } from '../../../../utils/util'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import searchBox from '../../search-tool'
  export default {
    mixins: [billMixin],
    components: {
      gocharts,
      searchBox
    },
    data() {
      return {
        activeNames: ['table', 'chart'],
        commName: 'flowTo',
        singleTab: true,
        flowtypeOps: [{ label: '全部', value: '' }, { label: '转出', value: 0 }, { label: '转入', value: 1 }],
        detailQueryURL: 'FETCH_BILL_FLOW_TO_DETAIL_LIST',
        detailQueryResult: [
          { label: '序号', prop: 'r' },
          { label: '主账号', prop: 'zzh' },
          { label: '交易卡号', prop: 'jykh' },
          { label: '对方账号', prop: 'dfzh' },
          { label: '对方开户名', prop: 'dfkhm' },
          { label: '交易日期', prop: 'jyrq' },
          { label: '交易时间', prop: 'jysj' },
          { label: '交易网点', prop: 'jywdmc' },
          { label: '交易类型', prop: 'jylx' },
          { label: '交易金额', prop: 'jyje' },
          { label: '对方账号所属行', prop: 'dfzhssh' },
          // { label: '账单信息ID', prop: 'guid' },
          { label: '备注', prop: 'bz' },
          { label: '对方身份证', prop: 'dfsfzhm' },
          // { label: '身份类型代码', prop: 'sflxdm' },
          { label: '身份类型', prop: 'sflxtpmc' },
          { label: '单位名称', prop: 'dwmc' }
        ]
      }
    },
    computed: {
      tableHeight() {
        let offset = 420;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        console.log(height)
        return (height < 200 ? 200 : height).toString()
      }
    },
    methods: {
      query() {
        if (this.currentTabItem.guid.length < 2) {
          this.$message({
            type: 'warning',
            message: '必须选择一个以上不同的账号'
          })
          return false
        }
        if (this.currentTabItem.queryForm.targetAccound === '' || this.currentTabItem.queryForm.selectAccound === '') {
          this.$message({
            type: 'warning',
            message: '必须选择目标账户和源账户'
          })
          return false
        }
        this.fetchMainList()
        this.resBox = true
        this.detailBox = true
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_yhid: '', // 用户ID String 否
            v_zzh: target.queryForm.sourceAccound, // target.queryForm.selectAccound, // 主账号 String 是
            v_dfzh: target.queryForm.targetAccound, // target.queryForm.targetAccound, // 对方账号 String 是
            v_zdid: target.guid.join(','), // target.guid, // 账单ID String 否
            v_b_time: target.queryForm.timeSlot[0] || '', // 交易开始时间  格式 yyyy-mm-dd String 是
            v_e_time: target.queryForm.timeSlot[1] || '', // 交易结束时间  格式 yyyy-mm-dd String 是
            v_jylx: target.queryForm.type === '' ? '0' : target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_dfssh: target.queryForm.targetBank // 对方所属行 String 否
          })
        this.dispatch(FETCH_BILL_FLOW_TO_LIST, queryForm).then(() => {
          // 列表数据
          if (this.analysisBill.flowToList.DTMain && this.analysisBill.flowToList.ZJLXPathMainList.length !== 0) {
            this.columnB = []
            for (let column in this.analysisBill.flowToList.DTMain[0]) {
              if (column === 'dfzh') {
                this.table.columnB.push({ label: '对方账户', prop: column })
              } else {
                this.table.columnB.push({ label: column, prop: column })
              }
            }
          }
          this.table.data = this.analysisBill.flowToList.ZJLXPathMainList

          // GO数据
          this.goData.nodeDataArray = this.analysisBill.flowToList.ZJLXGXSTList.map(d => {
            return {
              key: d.id,
              category: 'bankcard',
              loc: '0 0',
              name: '节点',
              text: d.value + (!d.name ? '' : `[${d.name}]`),
              isToLink: false
            }
          })
          this.goData.linkDataArray = this.analysisBill.flowToList.ZJLXGXSTList.map(d => {
            return {
              from: d.object1,
              to: d.object2,
              curviness: 0,
              text: d.jyje + '元（' + d.jycs + '次）',
              visible: true
            }
          })
          this.$refs.billFlowToGoBox[0].initMaker()
        })
      },
      showDetail() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zzh: this.currentTabItem.keyVal, // 主账号 String 是
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_kssj: target.queryForm.timeSlot[0] || '', // 交易开始时间  格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 交易结束时间  格式 yyyy-mm-dd String 否
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_dfssh: target.queryForm.targetBank, // 对方所属行 String 否
            v_pageIndex: '', // 当前页码 Numeric 否
            v_pageSize: '' // 每页显示记录数 Numeric 否
          })
        this.dispatch(FETCH_BILL_FLOW_TO_DETAIL_LIST, queryForm).then(() => {})
      },
      /**
       * 关系图连线点击
       * @param reObj
       */
      linkClickEvent(reObj) {
        let _clickObj = reObj.targetObj.data
        //  图表点击查询话单详情 （1 - 4 类型）
        this.detailDialog = true
        // 查询条件
        let _currentQuery = Object.assign({}, clone(this.tabs[this.currentTab]))
        _currentQuery.keyVal = _clickObj.from
        _currentQuery.queryForm.otherPhone = _clickObj.to
        //  详单列表查询
        this.detailQueryCondition = Object.assign({}, _currentQuery)
      },
      collapseChange(val) {
        console.log(val)
      }
    },
    watch: {},
    created() {}
  }

</script>
