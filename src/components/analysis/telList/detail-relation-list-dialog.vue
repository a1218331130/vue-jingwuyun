<template>
<!-- 详情列表弹窗 -->
<el-dialog v-draggable="dialogDraggableOptions"
           :title="'详单 - ' + dialogTile"
           :visible.sync="dialog"
           size="bigest"
           @open="openInit"
           :before-close="closeEvent">
  <div v-loading="loadingDetail"
       element-loading-text="正在查询...">
    <list :list="table.resData"
          :tab="table.tabList"
          H="440"
          :pagenav="pageInfo"
 :isInDialog="true"></list>


    <div class="app-toolbar footer">
      <pagination :count="pageInfo.count"
                  :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}"
                  @update:pagenav="pagenavChange"></pagination>
    </div>
  </div>
</el-dialog>
</template>

<style lang="scss" scoped>
  .a {}

</style>

<script>
  import telListMixin from './telListMixin'
  import { FETCH_TELLIST_RELATION_DETAIL_LIST } from './../../../store/types'
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
            { label: '主账号', prop: 'zzh' },
            { label: '主账号所属行', prop: 'zzhssh' },
            { label: '交易类型名称', prop: 'JYLXMC' },
            { label: '对方账号', prop: 'dfzh' },
            { label: '对方账号开户名', prop: 'dfkhm' },
            { label: '对方账号所属行', prop: 'dfzhssh' },
            { label: '交易日期', prop: 'jyrq' },
            { label: '交易时间', prop: 'jysj' },
            { label: '交易金额', prop: 'jyje' },
            { label: '余额', prop: 'jsye' },
            { label: '交易网点代码', prop: 'jywddm' },
            { label: '交易网点名称', prop: 'jywdmc' },
            { label: '备注信息', prop: 'bz' },
            { label: '摘要说明', prop: 'zy' },
            { label: '业务时间', prop: 'YWSJ' },
            { label: '分析对象', prop: 'FXDX' },
            { label: '交易卡号', prop: 'JYKH' },
            { label: '对方单位名称', prop: 'DWMC' }
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
            limit: 10,
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
            v_zjhm: target.keyVal, // 主叫号码
            v_begintime: target.queryForm.timeSlot[0] || '', //  开始时间
            v_endtime: target.queryForm.timeSlot[1] || '', //  结束时间
            //            v_pageindex: target.pageindex || this.pageInfo.currentpage, // 页码
            //            v_pagesize: target.pagesize || this.pageInfo.limit, // 分页大小
            v_orderby: target.orderby || '', // 排序字段
            v_zdid: target.zdid || '', // 账单账号
            v_pageindex: this.pageInfo.currentpage, // 页码  String  否
            v_pagesize: this.pageInfo.limit // 分布大小  String  否
          })

        // 页面参数回填
        //        this.pageInfo.currentpage = queryForm.v_pageindex
        //        this.pageInfo.limit = queryForm.v_pagesize

        this.dialogTile = target.keyVal

        this.dispatch(FETCH_TELLIST_RELATION_DETAIL_LIST, queryForm).then(() => {
          this.table.resData = this.analysisTelList.relationDetailList.GLFXDetailList.map(d => {
            return d
          })
          this.pageInfo.count = this.analysisTelList.relationDetailList.Result.totalcount
          //          this.pageInfo.count = this.analysisTelList.relationDetailList.TotalCount // 数据条数统计
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
