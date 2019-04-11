<template>
<!-- 详情列表弹窗 -->
<el-dialog v-draggable="dialogDraggableOptions" :title="dialogTile" :visible.sync="dialog" size="bigest" @open="openInit" :before-close="closeEvent">
  <div v-loading="loadingDetail" element-loading-text="正在查询..." >
    <!-- <list :list="table.resData" :tab="table.tabList" :H="'450'" :pagenav="pageInfo"
     :isInDialog="true"></list> -->
     <div style="min-height:300px;">
     <el-table @cell-mouse-enter="cellMouseEnter" :row-style="setRowStyle" v-loading="loading" :height="'100%'" :data="tableData" border stripe>
          <!-- <el-table-column align="center" label="操作" type="selection" prop="operation" width="130px">
          </el-table-column> -->
          <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
          <el-table-column align="center" label="姓名" prop="object" width="130px"></el-table-column>
          <el-table-column align="center" label="证件号" prop="idnumber" width="250px"></el-table-column>
          <el-table-column align="center" label="类型" prop="thing" width="130px"></el-table-column>
          <el-table-column align="center" label="日期" prop="data" width="250px"></el-table-column>
          <el-table-column align="left" label="摘要" prop="decs"></el-table-column>
          <el-table-column align="center" label="操作" :width="150">
            <template scope="scope">
               <el-button type="primary" size="mini" @click="saveTrace(scope.row)">保存</el-button>
            </template>
</el-table-column>
</el-table>
</div>
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
  import mixin from '../../../utils/mixin'
  // 接口没写好
  // import { FETCH_MY_TIMELINE_LIST } from './../../../store/types'
  import pagination from '../../../widgets/pagination/pagination.vue'
  import { mapState } from 'vuex';
  export default {
    mixins: [mixin],
    components: { pagination },
    props: ['queryCondition', 'dialog'],
    computed: {
      ...mapState(['analysisTimeline'])
    },
    data() {
      return {
        pageInfo: { // 页面分页信息相关配置
          count: 0,
          limit: 500,
          currentpage: 1
        },
        dialogTile: '我的时光轴', //  表格标题
        loadingDetail: true, //  表格标题
        tableData: [],
        colorMap: {
          ly: '#409eff',
          wb: '#ea612c',
          tl: '#67c23a',
          yh: '#e6a23c',
          hb: '#f56c6c',
          hd: '#037D24'
        }
      }
    },
    methods: {
      getBoxStyle(elem, idx) {
        let border = idx % 2 === 0 ? 'border-right' : 'border-left';
        let color = this.getLineColor(elem);
        return `${border}:1px solid ${color};color:${color}`;
      },
      setLineStyle(elem, index) {
        let color = this.getLineColor(elem);
        let styleLeft = `border-top-color: ${color};
                     border-left-color: ${color};
                     border-bottom-color: ${color};`;
        let styleRight = `border-top-color: ${color};
                     border-right-color: ${color};
                     border-bottom-color: ${color};`;
        return index % 2 === 0 ? styleRight : styleLeft;
      },
      getLineColor(elem) {
        return this.colorMap[elem.gjlx];
      },
      setRowStyle(row, rowIndex) {
        return `color:${this.colorMap[row.gjlx]};`
      },
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
        this.tableData = []
        this.loadingDetail = true
        let target = this.queryCondition,
          queryForm = this.delEmpey({
            v_pageindex: target.pageindex || this.pageInfo.currentpage, // 页码  String  否
            v_pagesize: target.pagesize || this.pageInfo.limit // 分布大小  String  否
          })

        // 页面参数回填
        this.pageInfo.currentpage = queryForm.v_pageindex
        this.pageInfo.limit = queryForm.v_pagesize
        // 测试用
        setTimeout(() => {
          this.loadingDetail = false;
        }, 1000)
        // this.dispatch(FETCH_MY_TIMELINE_LIST, queryForm).then(() => {
        //   this.tableData = this.analysisTimeline.myTimelineList.map(d => {
        //     return d;
        //   })
        //   this.pageInfo.count = this.analysisTimeline.myTimelineList.TotalCount // 数据条数统计
        //   this.loadingDetail = false
        // }).catch(r => {
        //   this.loadingDetail = false
        // })
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
