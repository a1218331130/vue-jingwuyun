<template>
<!-- 详情列表弹窗 -->
<el-dialog v-draggable="dialogDraggableOptions" :title="'详单 - ' + dialogTile" :visible.sync="dialog" size="bigest" @open="openInit" :before-close="closeEvent">
  <div v-loading="loadingDetail" element-loading-text="正在查询...">
    <list :list="table.resData" :tab="table.tabList" :pagenav="pageInfo"
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
  import { FETCH_TELLIST_MEETING_DETAIL_LIST } from './../../../store/types'
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
            { label: '对方号码', prop: 'dfhm' },
            { label: '对方姓名', prop: 'xm' },
            { label: '对方身份证号', prop: 'DFSFZHM' },
            { label: '对方单位名称', prop: 'dwmc' },
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
        let target = this.queryCondition;
        // 在碰面分析详情接口中，多项为必填，不能删除键，
        // 如果需要删除键，可以赋值为undefined,无须用mixin中的delEmpty方法
        let queryForm = {
          v_yhid: target.yhid || undefined, // 用户ID
          v_hdid: target.keyVal, // 手机号码(多个手机号码用’,’隔开)
          v_pmsj: target.pmsj || '', // 碰面时间
          v_wcsj: target.queryForm.diffTime || 15, // 误差时间
          v_wcjl: target.queryForm.diffDistance || 300, // 误差距离
          v_xqdm: target.xqdm || 0, // 小区代码
          v_jzdm: target.jzdm || 0, // 基站代码
          v_ip: target.ip || undefined // IP地址
        }

        // 页面参数回填
        //        this.pageInfo.currentpage = queryForm.v_pageindex
        //        this.pageInfo.limit = queryForm.v_pagesize

        this.dialogTile = target.keyVal + '  碰面关系'
        this.dispatch(FETCH_TELLIST_MEETING_DETAIL_LIST, queryForm).then(() => {
          this.table.resData = this.analysisTelList.meetingDetailList.PMFXDetailList.map(d => {
            d.jd = target.jd
            d.wd = target.wd
            return d
          })
          this.pageInfo.count = this.table.resData.length // 数据条数统计
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
