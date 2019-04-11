<!-- 对比分析 -->
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

            <el-form-item prop="targetAccound2" label="次数">
              <el-input-number :min="1" v-model="item.queryForm.commAccound2" placeholder=""></el-input-number>
            </el-form-item>

            <el-form-item prop="netDot" label="交易网点">
              <el-input v-model="item.queryForm.netDot" placeholder=""></el-input>
            </el-form-item>

            <el-form-item prop="method" label="对比方式">
              <el-cascader :options="options" v-model="item.queryForm.method" placeholder=""></el-cascader>
            </el-form-item>


            <!-- <el-form-item>
              <el-button type="primary" native-type="submit" @click.prevent="query">分析</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </searchBox>
      <!-- 结果详情 -->
      <div class="app-content-box">
        <el-row>
          <el-col :span="24">
            <div class="detail-box" v-if="mainBox===true">
              <el-tabs>
                <el-tab-pane label="对比分析列表">
                  <el-table @cell-mouse-enter="cellMouseEnter" :height="tableHeight" :data="item.queryForm.resData" stripe border style="width:100%;" @row-dblclick="showDetail" >
                    <el-table-column sortable v-for="item in columnE" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
                  </el-table>
                  <div class="app-toolbar footer">
                    <pagination :count="item.count" :pagenav="item.queryForm.pagenav" @update:pagenav="val=>updatePage(val,item)"></pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
          <el-col :span="24">
            <!-- <div class="detail-box" v-if="detailBox===true">
              <el-tabs>
                <el-tab-pane label="详细列表">
                  <el-table @cell-mouse-enter="cellMouseEnter" :data="table.detailData" style="width:100%;" v-loading="loading">
                    <el-table-column v-for="item in table.columnC" :key="item.prop" :label="item.label" :prop="item.prop"></el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div> -->
            <el-dialog v-draggable="dialogDraggableOptions" class="detail-box" :visible.sync="detailBox" style="width:100%;" size="large" title="详细列表">
              <el-table @cell-mouse-enter="cellMouseEnter" v-loading="tableloading" border max-height="600" :fit="true" :data="item.queryForm.detailData">
                <el-table-column sortable v-for="item in table.columnB" :key="item.prop" :label="item.label" :prop="item.prop" :min-width="getColumnWidth(item)"></el-table-column>
              </el-table>
              <div class="app-toolbar footer">
                <pagination :count="item.queryForm.pageInfo.count" :pagenav="item.queryForm.pageInfo" @update:pagenav="val=>updateDetailPage(val,item)"></pagination>
              </div>
            </el-dialog>
          </el-col>
        </el-row>
      </div>

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
  import { FETCH_BILL_CONTRAST_LIST, FETCH_BILL_CONTRAST_DETAIL_LIST } from '../../../../store/types'
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
        commName: 'contrast',
        tableloading: false,
        targetAccound2: 1,
        columnE: [
          // { label: '序号', prop: 'r' },
          { label: '次数', prop: 'cs' },
          { label: '主账号', prop: 'zzh' },
          { label: '交易卡号', prop: 'jykh' },
          { label: '开户名', prop: 'khm' },
          { label: '主账号所属行', prop: 'zzhssh' },
          { label: '对方开户名', prop: 'dfkhm' },
          { label: '对方账号', prop: 'dfzh' },
          { label: '对方账户所属行', prop: 'dfzhssh' },
          { label: '交易日期', prop: 'jyrq' },
          { label: '交易时间', prop: 'jysj' },
          { label: '即时余额', prop: 'jsye' },
          { label: '交易类型', prop: 'jylx' },
          // { label: '业务时间', prop: 'ywsj' },
          { label: '摘要', prop: 'zy' },
          { label: '交易金额', prop: 'jyje' },
          // { label: '借贷标记', prop: 'jdbj' },
          { label: '备注', prop: 'bz' },
          { label: '交易网点', prop: 'jywdmc' },
          { label: '对方身份证号码', prop: 'dfsfzhm' },
          { label: '身份类型', prop: 'sflxtpmc' },
          { label: '单位名称', prop: 'dwmc' }
        ],
        options: [{
          value: '1',
          label: '按时间比',
          children: [{
            value: '10',
            label: '10分钟前后'
          }, {
            value: '30',
            label: '30分钟前后'
          }, {
            value: '60',
            label: '1小时前后'
          }, {
            value: '120',
            label: '2小时前后'
          }, {
            value: '300',
            label: '5小时前后'
          }, {
            value: '1440',
            label: '1天前后'
          }, {
            value: '2880',
            label: '2天前后'
          }, {
            value: '7200',
            label: '5天前后'
          }]
        }, {
          value: '2',
          label: '按金额比',
          children: [{
            value: '1',
            label: '等值比'
          }, {
            value: '2',
            label: '差值比'
          }]
        }]
      }
    },
    computed: {
      tableHeight() {
        let offset = 430;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 200 ? 200 : height).toString()
      }
    },
    watch: {},
    methods: {
      getColumnWidth,
      query() {
        this.fetchMainList()
        this.mainBox = true
        this.detailBox = false
        this.currentTabItem.count = 0
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
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: target.guid, // 账单id String 是
            v_begindate: target.queryForm.timeSlot[0] || '', // 交易开始日期 格式 yyyy-mm-dd String 是
            v_enddate: target.queryForm.timeSlot[1] || '', // 交易结束日期 格式 yyyy-mm-dd String 是
            v_minmoney: target.queryForm.minAmount || 0, // 最小金额（为0时表示不比较） Numeric 否
            v_maxmoney: target.queryForm.maxAmount || 0, // 最大金额（为0时表示不比较 Numeric 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_minute: target.queryForm.method[0] === '1' ? target.queryForm.method[1] : 0, // 分钟 Numeric 是
            v_jylx: target.queryForm.type, // 交易类型（0转入，1转出） String 是
            v_cs: target.queryForm.commAccound2, // 次数 Numeric 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_zdfw: 1, // 账单范围（0全部，1本案件） Numeric 是
            v_bdfs: target.queryForm.method[0], // 比对方式（1：时段，2：金额） Numeric 是
            v_jebdlx: target.queryForm.method[0] === '2' ? target.queryForm.method[1] : '', // 金额比对类型(1：等值,2：差值，当v_bdfs为2时，此字段必填) Numeric 否
            v_pageindex: target.queryForm.pagenav.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pagenav.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_CONTRAST_LIST, queryForm).then(() => {
          target.queryForm.resData = this.analysisBill.contrastList.DBFXList
          target.count = this.analysisBill.contrastList.Result.totalcount || 0
        })
        this.mainBox = true
      },
      showDetail(row, event, column) {
        this.tableloading = true
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: target.guid, // 账单id String 是
            v_ywsj: row.ywsj, // 业务时间 格式yyyymmddhh24miss String 是
            v_minute: target.queryForm.method[0] === '1' ? target.queryForm.method[1] : 0, // 分钟 Numeric 是
            v_jdflag: row.jdbj, // 借贷标记(1贷方，0借方） Numeric 是
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_zdfw: 1, // 账单范围（0全部，1本案件） Numeric 是
            v_bdfs: target.queryForm.method[0], // 比对方式（1：时段，2：金额） Numeric 是
            v_jebdlx: target.queryForm.method[0] === '2' ? target.queryForm.method[1] : '', // 金额比对类型(1：等值,2：差值，当v_bdfs为2时，此字段必填) Numeric 否
            v_dzje: row.jyje, // 等值金额 Numeric 否
            v_pageindex: target.queryForm.pagenav.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pagenav.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_CONTRAST_DETAIL_LIST, queryForm).then(() => {
          target.queryForm.detailData = this.analysisBill.contrastDetailList.DBFXDetailList
          target.queryForm.pageInfo.count = this.analysisBill.contrastDetailList.Result.totalcount || 0
          this.tableloading = false
          this.detailBox = true
        })
      }
    },
    created() {
      this.table.columnB = [...this.table.columnC]
      this.table.columnB.push({ label: '次数', prop: 'cs' })
    },
    mounted() {}

  }

</script>
