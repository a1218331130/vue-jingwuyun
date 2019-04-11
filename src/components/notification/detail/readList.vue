<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="签收列表" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <el-table @cell-mouse-enter="cellMouseEnter" :data="list" v-loading.body="loading" height="450">
    <el-table-column v-if="!id.RcvDeptList.length>0" label="姓名" prop="userName" align="center"></el-table-column>
    <el-table-column v-if="id.RcvDeptList.length > 0" label="部门" prop="orgName" align="center"></el-table-column>
    <el-table-column label="签收时间" prop="signTime" align="center"></el-table-column>
  </el-table>

  <pagination style="float: right;" class="pagenav" :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>

  <!-- </div> -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">关闭</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.form-box {
    padding: 0 10px;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { mapState } from 'vuex'
import { GET_USER_READ_DATA } from '../../../store/types'

import pagination from '../../../widgets/pagination/pagination.vue'

export default {
  mixins: [mixin],
  components: {
    pagination
  },
  data() {
    return {
      count: 0,
      pagenav: { limit: 20, currentpage: 1 },
      list: []
    }
  },
  props: ['dialog', 'id'],
  computed: {
    ...mapState(['message'])
  },
  watch: {
    pagenav: {
      handler() {
        this.fetchList()
      },
      deep: true
    }
  },
  methods: {
    /**
     *初始化窗口
     */
    initDialog() {
      this.fetchList()
    },
    /**
     * 窗关闭事件
     */
    closeEvent() {
      this.$emit('close')
      this.list = []
    },
    resetList() {
      this.pagenav.currentpage = 1
      this.count = 0
      this.list = []
    },
    fetchList() {
      this.dispatch(GET_USER_READ_DATA, {
        KeyId: this.id.key,
        PageIndex: this.pagenav.currentpage,
        PageSize: this.pagenav.limit
      }).then(() => {
        console.log(this.message.UserReadData, 666666666);
        this.list = this.message.UserReadData.PageData.map(d => {
          return {
            userName: d.Xm,
            orgName: d.OrgName,
            signTime: d.QSZT === '0' ? '未签收' : (d.QSSJ || '')
          }
        })
      })
    }
  },
  created() {

  },
  mounted() {}
}
</script>
