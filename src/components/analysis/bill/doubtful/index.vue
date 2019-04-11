<!-- 可疑点分析 -->
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

            <el-form-item prop="minAmount" label="金额范围">
              <input type="number" v-model="item.queryForm.minAmount" class="cus-number-input" :min="0" placeholder="最小金额" /> -
              <input type="number" v-model="item.queryForm.maxAmount" class="cus-number-input" :min="0" placeholder="最大金额" />
            </el-form-item>

            <el-form-item prop="modelType" label="模式">
              <el-select v-model="item.queryForm.modelType">
                <el-option v-for="item2 in modelList" :key="item2.prop" :label="item2.label" :value="item2.prop"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="interval" label="间隔">
              <el-input-number v-model="item.queryForm.interval" :min="0" placeholder=""></el-input-number>分钟
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
            <div class="res-box" v-if="resBox===true">
              <el-tabs>
                <el-tab-pane label="可疑点分析">
                  <el-table @cell-mouse-enter="cellMouseEnter" stripe border :data="table.data" style="width:100%;" 
                  :height="tableHeight" 
                   @row-dblclick="showDetail">
                    <el-table-column v-show="item2.prop!=='ids'" sortable v-for="item2 in table.columnA" :key="item2.prop" :label="item2.label" :prop="item2.prop" >
                    </el-table-column>
                  </el-table>
                  <div class="app-toolbar footer">
                    <pagination :count="item.count" :pagenav="item.queryForm.pagenav" @update:pagenav="val=>updatePage(val,item)"></pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-dialog v-draggable="dialogDraggableOptions" class="detail-box" :visible.sync="detailBox" size="info--fixed" title="详细列表">
        <el-table @cell-mouse-enter="cellMouseEnter" border :data="table.resData">
          <el-table-column sortable v-for="item2 in table.columnB" :key="item2.prop" :label="item2.label" :prop="item2.prop">
          </el-table-column>
        </el-table>
        <div class="app-toolbar footer">
          <pagination :count="item.queryForm.pageInfo.count" :pagenav="item.queryForm.pageInfo" @update:pagenav="val=>updateDetailPage(val,item)"></pagination>
        </div>
      </el-dialog>
      <!-- <el-tabs>
          <el-tab-pane label="详细列表">
            <el-table @cell-mouse-enter="cellMouseEnter" :data="table.resData" style="width:100%;">
              <el-table-column sortable v-for="item2 in table.columnB" :key="item2.prop" :label="item2.label" :prop="item2.prop">
              </el-table-column>
            </el-table>
            <div class="app-toolbar footer">
              <pagination :count="item.queryForm.pageInfo.count" :pagenav="item.queryForm.pageInfo" @update:pagenav="val=>updateDetailPage(val,item)"></pagination>
            </div>
          </el-tab-pane>
        </el-tabs> -->
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
  // 无接口
  import { FETCH_BILL_DOUBTFUL_DETAIL_LIST, FETCH_BILL_DOUBTFUL_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import pagination from '../../../../widgets/pagination/pagination'
  import echarts from '../../../../widgets/echarts'
  import searchBox from '../../search-tool'
  export default {
    mixins: [billMixin],
    components: { echarts, searchBox, pagination },
    data() {
      return {
        commName: 'doubtful',
        resBox: false,
        detailBox: false,
        modelList: [{ label: '短时间多次转账', prop: '1' }, { label: '短时间多次提款', prop: '2' }, { label: '短时间多次存款', prop: '3' }, { label: '当天多次存取款', prop: '4' }, { label: '资金流入马上流出', prop: '5' }],
        table: {
          columnA: [
            { label: '排序', prop: 'r' },
            { label: '次数', prop: 'c' },
            { label: '帐号', prop: 'ids' },
            { label: '交易时间', prop: 'jysj' },
            { label: '存款总额(元)', prop: 'sr' },
            { label: '取款总额(元)', prop: 'zc' }
          ],
          columnB: [
            { label: '序号', prop: 'r' },
            { label: '主账号', prop: 'zzh' },
            { label: '交易卡号', prop: 'jykh' },
            { label: '开户名', prop: 'khm' },
            { label: '对方账号', prop: 'dfzh' },
            { label: '主账号所属行', prop: 'zzhssh' },
            { label: '对方开户名', prop: 'dfkhm' },
            { label: '对方账户所属行', prop: 'dfzhssh' },
            { label: '交易日期', prop: 'jyrq' },
            { label: '交易时间', prop: 'jysj' },
            { label: '即时余额', prop: 'jsye' },
            { label: '交易类型', prop: 'jylx' },
            { label: '摘要', prop: 'zy' },
            { label: '交易金额', prop: 'jyje' },
            { label: '交易网点', prop: 'jywdmc' },
            { label: '对方身份证号码', prop: 'dfsfzhm' },
            // { label: '身份类型代码', prop: 'sflxdm' },
            { label: '单位名称', prop: 'dwmc' }
          ],
          data: [],
          resData: []
        }
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
      query() {
        this.fetchMainList()
        this.resBox = true
        this.detailBox = false
      },
      fetchMainList() {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_rwid: '', // 任务ID
            v_zzh: this.currentTabItem.keyVal, // 主账号 String 否
            v_zdid: target.guid, // 账单id String 是
            v_edsx: target.queryForm.maxAmount, // 额度上限 Int 否
            v_edxx: target.queryForm.minAmount, // 额度下限 Int 否
            v_jywd: '', // 交易网点 String 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_ms: target.queryForm.modelType, // 交易类型（0转入，1转出） String 是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: '', // 对方所属行 String 否
            v_sd: '', // 时段 String 否
            v_pageindex: target.queryForm.pagenav.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pagenav.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_DOUBTFUL_LIST, queryForm).then(() => {
          this.table.data = this.analysisBill.doubtfulList.KYDList
          target.count = this.analysisBill.doubtfulList.Result.totalcount || 0
          // console.log('返回', this.analysisBill.doubtfulList);
        })
      },
      showDetail(row) {
        let target = this.currentTabItem,
          queryForm = this.delEmpey({
            v_zdid: row.ids, // 账单id String 是
            ids: row.ids, // 账单id String 是
            v_edsx: target.queryForm.maxAmount, // 额度上限 Int 否
            v_edxx: target.queryForm.minAmount, // 额度下限 Int 否
            v_jywd: '', // 交易网点 String 否
            v_zy: target.queryForm.summay, // 摘要 String 否
            v_dfzh: target.queryForm.targetAccound, // 对方账号 String 否
            v_jylx: target.queryForm.modelType, // 交易类型（0转入，1转出） String 是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 格式 yyyy-mm-dd String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 格式 yyyy-mm-dd String 否
            v_dfssh: '', // 对方所属行 String 否
            v_sd: '', // 时段 String 否
            v_pageindex: target.queryForm.pageInfo.currentpage, // 页码 Int 否
            v_pagesize: target.queryForm.pageInfo.limit // 每页大小  Int 否
          })
        this.dispatch(FETCH_BILL_DOUBTFUL_DETAIL_LIST, queryForm).then(() => {
          this.table.resData = this.analysisBill.doubtfulDetailList.KYDDetailList
          target.queryForm.pageInfo.count = this.analysisBill.doubtfulDetailList.Result.totalcount || 0
          this.detailBox = true
        })
      }
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
      let target = this.currentTabItem
      target.queryForm.pageInfo.currentpage = val.currentpage
      this.showDetail();
    },
    created() {

    },
    mounted() {
      for (let i = 1; i <= 3; i++) {
        this.table.data.push({
          id: i,
          date: '日期',
          count: '次数',
          importAmount: '存款总额',
          exportAamount: '取款总额'
        })
      }
      for (let i = 1; i <= 30; i++) {
        this.table.resData.push({
          id: i,
          accound: '账号',
          cardNo: '交易卡号',
          name: '开户名',
          date: '交易日期',
          time: '交易时间',
          summay: '摘要',
          type: '交易类型',
          amount: '交易金额(元)',
          netDot: '交易网点'
        })
      }
    }

  }

</script>
