<template>
  <div>
    <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :modal-append-to-body="false" :append-to-body="true" :modal="false" title="笔录列表" size="large--fixed"
               :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
      <div class="app-content-box">
        <el-table style="height: 500px" @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="pertionnelInfo">
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="title" label="案件名称"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="IDcard" label="身份证" width="180"></el-table-column>
          <el-table-column prop="time" label="时间" width="160"></el-table-column>
          <el-table-column prop="provider" label="录制人"></el-table-column>
          <el-table-column label="操作" width="80">
            <template scope="scope">
              <el-button type="primary" size="mini"
                         @click="detail(scope.row)" icon="icon iconfont icon-brush">详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <dialog-penRecord :dialog="resPeopleDialog" :ParamInfo="ParamInfo" @close="resPeopleDialog=false"></dialog-penRecord>
      </div>
      <div class="app-toolbar footer">
        <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}"
                    @update:pagenav="pagenavChange"></pagination>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
</style>
<script>
  import {
    FETCH_PEN_RECORD_LIST_BY_IDCARD
  } from '../../../../store/types'
  import {mapState} from 'vuex'
  import mixin from '../../../../utils/mixin'
  import '../../../../utils/dateFormat'
  import upload from '../../../../widgets/upload/upload.vue'
  import dialogPenRecord from './dialog-penRecord.vue'
  import pagination from '../../../../widgets/pagination/pagination'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      'dialog-penRecord': dialogPenRecord,
      upload
    },
    data() {
      return {
        ParamInfo: '',
        resPeopleDialog: false,
        pertionnelInfo: [{
          title: '测试标题',
          name: '测试名称',
          IDcard: '430333199009090909',
          time: '2017-12-12 10:12:15',
          provider: '系统管理员'
        }, {
          title: '测试标题',
          name: '测试名称',
          IDcard: '430333199009090909',
          time: '2017-12-12 10:12:15',
          provider: '系统管理员'
        }],
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 10,
          currentpage: 1
        }
      }
    },
    props: ['dialog', 'type', 'editmode', 'message'],
    computed: {
      dialogMode() {
        return this.editmode || 'add'
      },
      ...mapState(['penRecord'])
    },
    methods: {
      /**
       *初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        console.log('初始化窗口')
        this.dispatch(FETCH_PEN_RECORD_LIST_BY_IDCARD, {
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit,
          zjhm: this.message.idCard
        }).then(() => {
          this.pertionnelInfo = this.penRecord.fetchPenRecordListByIdcard.PageData.map(d => {
            return {
              id: d.id,
              title: d.ajmc,
              name: d.bldxxm,
              IDcard: d.bldxzjhm,
              time: d.xgsj.substring(0, 4) + '-' + d.xgsj.substring(4, 6) + '-' + d.xgsj.substring(6, 8) + ' ' + d.xgsj.substring(8, 10) + ':' + d.xgsj.substring(10, 12) + ':' + d.xgsj.substring(12, 14),
              provider: d.gzry1xm
            }
          })
          console.log('笔录列表', this.penRecord.fetchPenRecordListByIdcard.PageData)
        })
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.$emit('close')
        // this.dialog = false
      },
      /**
       * 编辑模态窗取消按钮事件
       * @return {[type]} [description]
       */
      cancel() {
        this.closeEvent()
      },
      detail(row) {
        this.resPeopleDialog = true
        this.ParamInfo = row
        console.log('这是详情', row)
      },
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.initDialog()
      }
    },
    created() {
      console.log('弹窗', this.message)
    },
    mounted() {
    }
  }
</script>
