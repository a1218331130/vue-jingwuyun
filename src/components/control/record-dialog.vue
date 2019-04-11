<template>
<el-dialog v-draggable="dialogDraggableOptions" title="操作记录" :visible.sync="dialogVisible" size="middle-fiexd" @open="start" :close-on-click-modal="false" :before-close="closeEvent">
  <el-table :data="list" :border="true" @cell-mouse-enter="cellMouseEnter">
    <el-table-column type="index" align="center" width="50px" label="序号">
      <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
</el-table-column>
<el-table-column align="center" width="160px" label="操作单位" prop="czdwmc"> </el-table-column>
<el-table-column align="center" width="120px" label="操作类型" prop="czlxmc"> </el-table-column>
<el-table-column align="center" label="操作描述" prop="czms"> </el-table-column>
<el-table-column align="center" width="120px" label="操作人" prop="czrxm"> </el-table-column>
<el-table-column align="center" width="160px" label="操作时间" prop="czsj"> </el-table-column>
</el-table>
<pagination :pagenav="pagenav" :count='counts' @update:pagenav="pagenavChange" align="right"></pagination>
</el-dialog>
</template>


<style>


</style>

<script>
  import pagination from '../../widgets/pagination/pagination.vue'
  import mixin from '../../utils/mixin'
  import {
    FXPCGK_QUERY_LIST
  } from '../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    data() {
      return {
        dialogVisible: false,
        pagenav: {
          currentpage: 1,
          limit: 10
        },
        counts: 0,
        listid: '',
        list: []
      }
    },
    // props: ['dataType', 'parentType'],
    methods: {
      start() {

      },
      showRecord(id) {
        this.list = []
        this.counts = 0
        this.listid = id
        this.dispatch(FXPCGK_QUERY_LIST, { czdx: this.listid, PageIndex: this.pagenav.currentpage, PageSize: this.pagenav.limit }).then(() => {
          this.list = this.focusPerson.fxpcgkQueryList.PageData
          this.counts = this.focusPerson.fxpcgkQueryList.DataCount
        })
        this.dialogVisible = true
      },
      /**
       * [分页切换操作 description]
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pagenav = obj
        // 刷新列表
        this.showRecord(this.listid)
      },
      closeEvent() {
        this.dialogVisible = false
      }
    },
    watch: {},
    mounted() {},
    created() {},
    computed: {
      ...mapState(['focusPerson'])
    }
  }

</script>
