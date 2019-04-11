<template>
<!-- 详情列表弹窗 -->
<el-dialog v-draggable="dialogDraggableOptions" :title="'详单 - ' + dialogTile" :visible.sync="dialog" size="bigest" @open="openInit" :before-close="closeEvent">
  <div v-loading="loadingDetail" element-loading-text="正在查询...">
    <list :list="table.resData" :tab="table.tabList" :H="'450'" :pagenav="pageInfo"
     :isInDialog="true"></list>

    <div class="app-toolbar footer">
      <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
    </div>
  </div>
</el-dialog>
</template>

<style lang="scss" scoped>
  .a {}

</style>

<script>
  import telListMixin from './telListMixin'
  import { FETCH_TELLIST_DETAIL_LIST } from './../../../store/types'
  import list from './list'
  import pagination from '../../../widgets/pagination/pagination.vue'
  export default {
    mixins: [telListMixin],
    components: { list, pagination },
    props: ['queryCondition', 'dialog'],
    computed: {},
    data() {
      return {
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 500,
          currentpage: 1
        },
        dialogTile: '', //  表格标题
        loadingDetail: true, //  表格标题
        table: { // 表格数据
          tabList: [
            { label: '主叫号码', prop: 'zjhm' },
            { label: '对方姓名', prop: 'xm' },
            { label: '对方身份证号', prop: 'DFSFZHM' },
            { label: '对方号码', prop: 'dfhm' },
            { label: '对方职位', prop: 'zw' },
            { label: '对方号码归属地', prop: 'gsd' },
            { label: '通话地点', prop: 'thd' },
            { label: '通话地址', prop: 'thdd' },
            { label: '呼叫类型', prop: 'hjlx' },
            { label: '通话日期', prop: 'thrq' },
            { label: '通话时间', prop: 'thsj' },
            { label: '时长(秒)', prop: 'thsc' },
            { label: '星期', prop: 'xq' },
            { label: '业务时间', prop: 'ywsj' }
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
        this.pageInfo.limit = obj.limit
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
        let target = this.queryCondition,
          queryForm = this.delEmpey({
            v_zjhm: target.keyVal, //  主叫号码   String  是
            v_dfhm: target.queryForm.otherPhone, // 对方号码   String  否
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
            v_pageindex: target.pageindex || this.pageInfo.currentpage, // 页码  String  否
            v_pagesize: target.pagesize || this.pageInfo.limit, // 分布大小  String  否
            v_type: target.type || 0 // 0查询列表，100 轨迹明细  Int  是
          })

        // 页面参数回填
        this.pageInfo.currentpage = queryForm.v_pageindex
        this.pageInfo.limit = queryForm.v_pagesize

        this.dialogTile = target.keyVal + target.queryForm.attribution || ''

        this.dispatch(FETCH_TELLIST_DETAIL_LIST, queryForm).then(() => {
          this.table.resData = this.analysisTelList.detailList.THMXModelList.map(d => {
            return d;
          })
          this.pageInfo.count = this.analysisTelList.detailList.TotalCount // 数据条数统计
          this.loadingDetail = false
        }).catch(r => {
          this.loadingDetail = false
        })
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
