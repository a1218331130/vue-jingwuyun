<template>
<!-- 详情列表弹窗 -->
<el-dialog v-draggable="dialogDraggableOptions" :title="'详单 - ' + dialogTile" :visible.sync="dialog" size="large" @open="openInit" :before-close="closeEvent">
  <div v-loading="loadingDetail" element-loading-text="正在查询...">
    <list :list="table.resData" :tab="detailQueryResult" :pagenav="pageInfo" H="450"></list>
    <div class="app-toolbar footer">
      <pagination v-if="isPage===1" :count="pageInfo.count" :pagenav="{limit:pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
    </div>
  </div>
</el-dialog>
</template>

<style lang="scss" scoped>
  .res-box {}

</style>

<script>
  import billMixin from './billMixin'
  import { FETCH_BILL_OVERLAPPING_DETAIL_LIST, FETCH_BILL_COMMON_DETAIL_LIST, FETCH_BILL_FLOW_TO_DETAIL_LIST } from './../../../store/types'
  import list from './list'
  import pagination from '../../../widgets/pagination/pagination.vue'
  export default {
    mixins: [billMixin],
    components: { list, pagination },
    props: ['queryCondition', 'dialog', 'detailQueryResult', 'detailQueryURL'],
    computed: {},
    data() {
      return {
        isPage: 1,
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        dialogTile: '', //  表格标题
        loadingDetail: true, //  表格标题
        table: { // 表格数据
          tabList: [
            { label: '序号', prop: 'r' },
            { label: '主账号', prop: 'zzh' },
            { label: '对方账号', prop: 'dfzh' },
            { label: '交易日期', prop: 'jyrq' },
            { label: '交易时间', prop: 'jysj' },
            { label: '交易类型', prop: 'jylx' },
            { label: '交易金额', prop: 'jyje' },
            { label: '交易网点代码', prop: 'jywdmc' },
            { label: '对方开户名', prop: 'dfkhm' },
            { label: '对方主账号所属行', prop: 'dfzhssh' },
            { label: '账单信息Guid', prop: 'guid' },
            { label: '备注信息', prop: 'bz' },
            { label: '对方账户身份证号', prop: 'dfsfzhm' },
            { label: '身份类型代码', prop: 'sflxdm' },
            { label: '身份类型对应的图片名称', prop: 'sflxtpmc' },
            { label: '单位名称', prop: 'dwmc' }
          ],
          resData: []
        }
      }
    },
    methods: {
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = 500
        this.pageInfo.currentpage = obj.currentpage
        this.fetchMainList()
      },
      /**
       * 初始化弹窗
       */
      openInit() {
        if (this.queryCondition) {
          this.pageInfo = { // 页面分页信息相关配置
            count: 10,
            limit: 500,
            currentpage: 1
          }
          this.fetchMainList()
        }
      },
      /**
       * 关闭弹窗触发
       */
      closeEvent() {
        this.$emit('close')
      },
      /**
       * 查询详单列表
       */
      fetchMainList() {
        this.table.resData = []
        this.loadingDetail = true
        let target = this.queryCondition
        if (this.detailQueryURL === 'FETCH_BILL_OVERLAPPING_DETAIL_LIST') {
          let queryForm = this.delEmpey({
            v_zh1: target.keyVal, //  主帐号   String  是
            v_zh2: target.queryForm.otherPhone, // 对方帐号   String  是
            v_gsd: target.queryForm.attribution, // 归属地  String  否
            v_jzdm: target.queryForm.stationCode, // 基站代码   String  否
            v_xqdm: target.xqdm || '', // 小区代码   String  否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_kssj1: target.kssj1 || '', // 开始时间1（针对异常号码查看明细）  String  否
            v_jssj1: target.jssj1 || '', // 结束时间1（针对异常号码查看明细）  String  否
            v_sjd: target.sjd || '', // 时间段（针对规律分析查看明细）  String  否
            v_sjdlx: target.sjdlx, // 时间段类型（针对规律分析0小时，1天，2星期，3月，4年）  String  否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_hjlx: target.queryForm.callType, // 呼叫类型（主叫，被叫 ）  String  否
            v_thdd: target.queryForm.callArea, // 通话地点  String  否
            v_orderby: target.orderby || '', // 排序字段（默认按业务时间倒序）   String  否
            v_sd: target.sd || '', // 时段 String  否
            v_dwmc: target.dwmc || '', // 单位名称   String  否
            v_pageIndex: target.pageindex || this.pageInfo.currentpage, // 页码  String  否
            v_pageSize: target.pagesize || this.pageInfo.limit, // 分布大小  String  否
            v_lx: target.type || 0 // 0查询列表，100 轨迹明细  Int  是
          })

          // 页面参数回填

          this.dialogTile = target.keyVal
          this.dispatch(FETCH_BILL_OVERLAPPING_DETAIL_LIST, queryForm).then(() => {
            this.table.resData = this.analysisBill.overlappingDetailList.JCPDDetailList.map(d => {
              return d
            })
            this.pageInfo.count = this.analysisBill.overlappingDetailList.Result.totalcount // 数据条数统计
            this.loadingDetail = false
          }).catch(r => {
            this.loadingDetail = false
          })
        } else
        if (this.detailQueryURL === 'FETCH_BILL_COMMON_DETAIL_LIST') {
          let queryForm = this.delEmpey({
            v_fxzh: target.queryForm.otherPhone, //  主帐号   String  是
            v_zzh: target.keyVal, // 对方帐号   String  是
            v_gsd: target.queryForm.attribution, // 归属地  String  否
            v_jzdm: target.queryForm.stationCode, // 基站代码   String  否
            v_xqdm: target.xqdm || '', // 小区代码   String  否
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_kssj1: target.kssj1 || '', // 开始时间1（针对异常号码查看明细）  String  否
            v_jssj1: target.jssj1 || '', // 结束时间1（针对异常号码查看明细）  String  否
            v_sjd: target.sjd || '', // 时间段（针对规律分析查看明细）  String  否
            v_sjdlx: target.sjdlx, // 时间段类型（针对规律分析0小时，1天，2星期，3月，4年）  String  否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_hjlx: target.queryForm.callType, // 呼叫类型（主叫，被叫 ）  String  否
            v_thdd: target.queryForm.callArea, // 通话地点  String  否
            v_orderby: target.orderby || '', // 排序字段（默认按业务时间倒序）   String  否
            v_sd: target.sd || '', // 时段 String  否
            v_dwmc: target.dwmc || '', // 单位名称   String  否
            v_pageIndex: target.pageindex || this.pageInfo.currentpage, // 页码  String  否
            v_pageSize: target.pagesize || this.pageInfo.limit, // 分布大小  String  否
            v_lx: target.type || 0 // 0查询列表，100 轨迹明细  Int  是
          })
          // 页面参数回填

          this.dialogTile = target.keyVal
          this.dispatch(FETCH_BILL_COMMON_DETAIL_LIST, queryForm).then(() => {
            this.table.resData = this.analysisBill.commonDetailList.GTZHDetailList.map(d => {
              return d
            })
            this.pageInfo.count = this.analysisBill.commonDetailList.Result.totalcount // 数据条数统计
            this.loadingDetail = false
          }).catch(r => {
            this.loadingDetail = false
          })
        }
        if (this.detailQueryURL === 'FETCH_BILL_FLOW_TO_DETAIL_LIST') {
          let queryForm = this.delEmpey({
            v_dfzh: target.queryForm.otherPhone, //  主帐号   String  是
            v_zzh: target.keyVal, // 对方帐号   String  是
            v_kssj: target.queryForm.timeSlot[0] || '', // 开始时间 String 否
            v_jssj: target.queryForm.timeSlot[1] || '', // 结束时间 String 否
            v_kssj1: target.kssj1 || '', // 开始时间1（针对异常号码查看明细）  String  否
            v_jssj1: target.jssj1 || '', // 结束时间1（针对异常号码查看明细）  String  否
            v_dfssh: target.targetBank || '', // 时间段（针对规律分析查看明细）  String  否
            v_sctj: target.queryForm.timeLabel, // 时长条件（>=,<=） String  否
            v_thsc: target.queryForm.timeLeght, // 时长 String 否
            v_sd: target.sd || '', // 时段 String  否
            v_dwmc: target.dwmc || '', // 单位名称   String  否
            v_pageIndex: target.pageindex || this.pageInfo.currentpage, // 页码  String  否
            v_pageSize: target.pagesize || this.pageInfo.limit, // 分布大小  String  否
            v_jylx: target.type || 0 // 0查询列表，100 轨迹明细  Int  是
          })
          // 页面参数回填

          this.dialogTile = target.keyVal
          this.dispatch(FETCH_BILL_FLOW_TO_DETAIL_LIST, queryForm).then(() => {
            this.table.resData = this.analysisBill.flowToDetailList.ZJLXDetailList.map(d => {
              return d
            })
            this.pageInfo.count = this.analysisBill.flowToDetailList.Result.totalcount // 数据条数统计
            this.loadingDetail = false
          }).catch(r => {
            this.loadingDetail = false
          })
        }
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
