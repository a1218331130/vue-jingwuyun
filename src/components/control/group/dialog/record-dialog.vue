<template>
<el-dialog v-draggable="dialogDraggableOptions" title="流转记录" :visible.sync="dialogRecord" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent" size="bigest">
  <el-table @cell-mouse-enter="cellMouseEnter" :data="list" border height="500">
    <el-table-column label="序号" align="center" prop="id" width="80"></el-table-column>
    <el-table-column label="步骤名称" prop="title" width="100"></el-table-column>
    <!--<el-table-column label="发送人" prop="sender" width="80"></el-table-column>-->
    <el-table-column label="发送时间" prop="sendTime" width="200"></el-table-column>
    <el-table-column label="处理人" prop="handler" width="80"></el-table-column>
    <el-table-column label="处理时间" prop="handleTime" width="200"></el-table-column>
    <el-table-column label="状态" prop="state" width="80"></el-table-column>
    <el-table-column label="意见" prop="opinion"></el-table-column>
  </el-table>
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>
  <div :class="{'el-loading-mask':true,'action':loading}">
    <div class="el-loading-spinner loader--circular"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">关闭</el-button>
  </div>
</el-dialog>
</template>

<style scoped lang="scss">
.el-loading-mask {
    display: none;
    &.action {
        display: block;
    }
}
</style>
<script>
import mixin from '../../../../utils/mixin'
import { GET_PROCESS_DETAIL } from '../../../../store/types'
import pagination from '../../../../widgets/pagination/pagination'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {
    pagination
  },
  data() {
    return {
      dictList: null,
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      count: 0,
      list: [],
      keyId: ''
    }
  },
  props: ['dialogRecord', 'object'],
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    getGjState(v) {
      return this.dictList.LC_CLZT.find(d => d.value === v).label
    },
    initDialog() {
      this.dispatch(GET_PROCESS_DETAIL, {
        Lczbid: this.object.KeyId
      }).then(() => {
        let i = 0;
        this.list = this.process.processDetail.map(d => {
          i++;
          return {
            id: i,
            title: d.FromNodeName,
            // sender: '我', 2017-10-14 xiehuan 不要发送人栏位了
            sendTime: d.SendTime,
            handler: d.HandlerName,
            handleTime: d.HandleTime,
            state: this.getGjState(d.State),
            opinion: d.HandleNote
          }
        })
      })
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.$emit('close')
      // this.dialog = false
    }
  },
  watch: {
    pagenav: {
      handler() {
        this.initDialog()
      },
      deep: true
    }
  },
  mounted() {},
  created() {
    // this.getDict(['JJCD', 'LC_CLZT']).then(res => {
    //   this.dictList = res
    // })
  },
  computed: {
    ...mapState(['focusPersonAndCar', 'process'])
  }
}
</script>
