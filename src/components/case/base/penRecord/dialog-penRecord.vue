<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="详情" :modal="false" :modal-append-to-body="false" :append-to-body="true" size="middle--fixed"
             :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form :model="pertionnelInfo">
      <!--<el-form-item label="录入时间" prop="wtsj" ><el-input placeholder="请输入录入时间" v-model="pertionnelInfo.wtsj" :maxlength="50"></el-input></el-form-item>-->
      <!--<el-form-item label="笔录内容" prop="wdnr" ><el-input placeholder="请输入笔录内容" v-model="pertionnelInfo.wdnr" :maxlength="50"></el-input></el-form-item>-->
      <el-form-item label="笔录内容" prop="wdnr" >{{pertionnelInfo.wdnr}}</el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">关闭</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>
</style>
<script>
  import {mapState} from 'vuex'
  import {
    FETCH_PEN_RECORD_LIST_BY_ID
  } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        pertionnelInfo: {wtsj: '默认值', wdnr: '默认值'}
      }
    },
    props: ['dialog', 'ParamInfo'],
    computed: {
      ...mapState(['penRecord'])
    },
    methods: {
      initDialog() {
        console.log('初始化窗口')
        this.dispatch(FETCH_PEN_RECORD_LIST_BY_ID, {
          blid: this.ParamInfo.id
        }).then(() => {
          this.pertionnelInfo = this.penRecord.fetchPenRecordListByID
          console.log('笔录详情', this.penRecord.fetchPenRecordListByID)
        })
      },
      closeEvent() {
        this.$emit('close')
      }
    },
    watch: {
      ParamInfo(val) {
        console.log('子窗口的sss', val)
      }
    },
    created() {
      console.log('子窗口的', this.ParamInfo)
    },
    mounted() {
    }
  }
</script>

