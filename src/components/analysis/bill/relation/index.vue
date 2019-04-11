<!-- 关联分析 -->
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
    <div class="tabs-box__item" 
    v-for="(item,i) in tabs" :key="i"
     v-show="i===currentTab">
      <searchBox>
        <div slot="formBox">
          <!-- 条件 -->
          <el-form :model="item.queryForm" :inline="true" label-width="105px">
            <el-button type="primary" class="primary-btn" native-type="submit" @click.prevent="query">分析</el-button>
            <el-form-item prop="dateTime" label="时间段">
              <el-date-picker type="daterange" v-model="item.queryForm.timeSlotArr" range-separator=" / " :editable="false" :picker-options="pickerOptions" @change="val=>updateTimeSlot(item.queryForm, val)" placeholder="请选择"></el-date-picker>
            </el-form-item>

            <el-form-item prop="interval" label="次数">
              <el-input-number :min="1" v-model="item.queryForm.interval" placeholder=""></el-input-number>
            </el-form-item>

            <el-form-item prop="minAmount" label="金额范围">
              <input type="number" v-model="item.queryForm.minAmount" @blur="item.queryForm.minAmount = moneyChange(item.queryForm.minAmount, item.queryForm)" :min="0" class="cus-number-input" placeholder="最小金额" /> -
              <input type="number" v-model="item.queryForm.maxAmount" @blur="item.queryForm.maxAmount = moneyChange(item.queryForm.maxAmount, item.queryForm)" :min="0" class="cus-number-input" placeholder="最大金额" />
            </el-form-item>

            <!-- <el-form-item prop="timeInterval" label="时段">
              <el-select v-model="item.queryForm.timeInterval" filterable placeholder="请选择">
                <el-option v-for="item in timeOps" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-form-item> -->

            <el-form-item label="时间间隔">
              <el-select v-model="item.queryForm.timeInterval2" style="width:120px;" placeholder="">
                <el-option v-for="item in timeInterval2" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item>
              <el-button type="primary" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>
      <!-- 结果详情 -->
      <div class="app-content-box">
        <div class="detail-box" v-if="mainBox===true">
          <el-tabs>
            <el-tab-pane label="关联分析">
              <el-table @cell-mouse-enter="cellMouseEnter" :height="tableHeight" :data="item.queryForm.resData" style="width:100%;" @row-dblclick="showDetail" border>
                <el-table-column sortable v-for="item in columnA" :key="item.prop" :label="item.label" :prop="item.prop"
                :min-width="getColumnWidth(item)" ></el-table-column>
              </el-table>
              <div class="app-toolbar footer">
                <pagination :count="item.count" :pagenav="item.queryForm.pagenav" @update:pagenav="val=>updatePage(val,item)"></pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <el-dialog v-draggable="dialogDraggableOptions" v-loading="tableloading" class="detail-box" :visible.sync="detailBox" style="width:100%;" size="midden" title="详细列表">
        <el-table @cell-mouse-enter="cellMouseEnter" border max-height="600" :data="dialogList">
          <el-table-column sortable v-for="item in columnDetail" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
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

<script>
  import { FETCH_BILL_RELATION_LIST, FETCH_BILL_RELATION_DETAIL_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import pagination from '../../../../widgets/pagination/pagination'
  import echarts from '../../../../widgets/echarts'
  import searchBox from '../../search-tool'
  import getColumnWidth from '../getColumnWidth'
  export default {
    mixins: [billMixin],
    components: { echarts, searchBox, pagination },
    data() {
      return {
        dialogList: [],
        commName: 'relation',
        tableloading: false,
        columnA: [
          { label: '序号', prop: 'r' },
          { label: '次数', prop: 'cs' },
          { label: '主账号', prop: 'zzh' },
          { label: '交易卡号', prop: 'jykh' },
          { label: '主账号所属行', prop: 'zzhssh' },
          { label: '开户名', prop: 'khm' },
          { label: '对方账号', prop: 'dfzh' },
          { label: '对方账号所属行', prop: 'dfzhssh' },
          { label: '对方开户名', prop: 'dfkhm' },
          { label: '交易日期', prop: 'jyrq' },
          { label: '交易时间', prop: 'jysj' },
          { label: '交易网点', prop: 'jywdmc' },
          { label: '交易类型', prop: 'jylx' },
          { label: '交易金额', prop: 'jyje' },
          // { label: '业务时间', prop: 'ywsj' },
          { label: '摘要', prop: 'zy' },
          // { label: '即时余额', prop: 'jsye' },
          { label: '备注', prop: 'bz' },
          { label: '对方身份证号码', prop: 'dfsfzhm' },
          // { label: '身份类型代码', prop: 'sflxdm' },
          { label: '身份类型', prop: 'sflxtpmc' },
          { label: '单位名称', prop: 'dwmc' }
        ],
        columnDetail: [
          { label: '序号', prop: 'rid' },
          { label: '主叫姓名', prop: 'zjxm' },
          { label: '主叫号码', prop: 'zjhm' },
          { label: '呼叫类型', prop: 'hjlx' },
          { label: '对方号码', prop: 'dfhm' },
          { label: '通话地', prop: 'thd' },
          { label: '通话日期', prop: 'thrq' },
          { label: '通话时间', prop: 'thsj' },
          { label: '通话时长', prop: 'thsc' },
          { label: '基站代码', prop: 'jzdm' },
          { label: '小区代码', prop: 'xqdm' },
          { label: '对方号码归属地', prop: 'gsd' },
          // { label: '业务时间', prop: 'ywsj' },
          { label: '通话地点', prop: 'thdd' },
          { label: '对方身份证号码', prop: 'dfsfzhm' },
          { label: '身份类型', prop: 'sflxtpmc' },
          { label: '单位名称', prop: 'dwmc' }
        ]
      }
    },
    computed: {
      tableHeight() {
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
        this.detailBox = false
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: target.guid, // 账单id String 是
            v_begindate: target.queryForm.timeSlot[0] || '', // 交易开始日期 格式 yyyy-mm-dd String 是
            v_enddate: target.queryForm.timeSlot[1] || '', // 交易结束日期 格式 yyyy-mm-dd String 是
            v_begintime: '', // 开始时间 String 否
            v_endtime: '', // 结束时间 String 否
            v_minmoney: target.queryForm.minAmount, // 最小金额 Numeric 否
            v_maxmoney: target.queryForm.maxAmount, // 最大金额 Numeric 否
            v_phonenos: '', // 手机号码 String 否
            v_minute: target.queryForm.timeInterval2 || '', // 分钟数 Numeric 是
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_cs: target.queryForm.interval, // 次数 Numeric 否
            v_pageindex: target.queryForm.pagenav.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pagenav.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_RELATION_LIST, queryForm).then(() => {
          target.count = this.analysisBill.relationList.Result.totalcount || 0
          target.queryForm.resData = this.analysisBill.relationList.GLFXList
        })
        this.mainBox = true
      },
      /**
       * 分页操作
       */
      updatePage(val, item) {
        let target = this.currentTabItem
        target.queryForm.pagenav.currentpage = val.currentpage
        this.fetchMainList();
      },
      updateDetailPage(val, item) {
        let target = this.currentTabItem
        target.queryForm.pageInfo.currentpage = val.currentpage
        this.showDetail();
      },
      showDetail(row, event, column) {
        // this.tableloading = true
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: target.guid, // 账单id String 是
            v_sjhms: '', // 手机号码 String 否
            v_date: row.ywsj, // 分钟数 String 否
            v_minute: target.queryForm.timeInterval2, // 时间间隔 String 否
            v_pageindex: target.queryForm.pageInfo.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pageInfo.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_RELATION_DETAIL_LIST, queryForm).then(() => {
          this.dialogList = this.analysisBill.relationDetailList.ZDGLFXDetailList
          target.queryForm.pageInfo.count = this.analysisBill.relationDetailList.Result.totalcount || 0
          // this.tableloading = false
          this.detailBox = true
        })
      }
    },
    created() {
      this.table.columnB = [
        { label: '序号', prop: 'r' },
        { label: '主叫姓名', prop: 'zjxm' },
        { label: '主叫号码', prop: 'zjhm' },
        { label: '呼叫类型', prop: 'hjlx' },
        { label: '对方号码', prop: 'dfhm' },
        { label: '通话地', prop: 'thd' },
        { label: '通话日期', prop: 'thrq' },
        { label: '通话时间', prop: 'thsj' },
        { label: '通话时长', prop: 'thsc' },
        { label: '基站代码', prop: 'jzdm' },
        { label: '小区代码', prop: 'xqdm' },
        { label: '对方号码归属地', prop: 'gsd' },
        { label: '业务时间', prop: 'ywsj' },
        { label: '通话地点', prop: 'thdd' },
        { label: '对方单位', prop: 'dwmc' }
      ]
    },
    mounted() {}

  }

</script>
