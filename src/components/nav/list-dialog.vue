<!-- 文件操作 -->
<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="添加我的常用" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
     <el-table :data="list" @selection-change="haveSelect" class="tableColle" ref="multipTable">
         <el-table-column type="selection" :selectable="checkboxInit"></el-table-column>
         <el-table-column label="系统名称" prop="nodeName">
            <!-- <template slot-scope="scope">{{scope.row.nodeName}}</template> -->
         </el-table-column>
     </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style>
    .reviewImg{
       width:300px;
       height:180px;
    }
    .tableColle td{
       text-align: center;
    }
    /* .wrap-box__content .el-upload-list__item-name{
        opacity: 0;
        height: 0px;
        display: none;
    }
    .wrap-box__content .el-upload-list__item .el-icon-upload-success{
        opacity: 0;
    } */
</style>
<script>
import mixin from '../../utils/mixin'
import { mapState } from 'vuex'
import upload from '../../widgets/upload/upload.vue'
import { GET_APPLICATION_LIST, APPLICATION_SAVE } from '../../store/types'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      list: [],
      multipleSelection: [],
      menuId: '',
      fileAdress: '',
      accept: '', // 上传文件类型限制
      isFormalSubmit: false,
      currentFiles: [], // 当前文件集合
      editForm: {},
      sendData: []
    }
  },
  props: ['dialog', 'data', 'editmode', 'fileAcceptType', 'ifSaveSystem'],
  watch: {
    dialog: function(val, oldval) {
      if(val) {
        this.fileAdress = '';
        this.editForm = {};
        this.$refs.multipTable.clearSelection();
      }
    }
  },
  computed: {
    ...mapState(['colleXtztc']),
    dialogMode() {
      return this.editmode || 'add'
    }
  },
  methods: {
    /**
     *初始化编辑窗口
     */
    haveSelect(val) {
      this.menuId = '';
      this.multipleSelection = val;
      for(var i = 0; i < this.multipleSelection.length; i++) {
        if(i === this.multipleSelection.length - 1) {
          this.menuId = this.menuId + this.multipleSelection[i].menuId
        }else{
          this.menuId = this.menuId + this.multipleSelection[i].menuId + ','
        }
      }
      console.log(this.menuId, 'valvalvalvalvalval');
    },
    checkboxInit(row, index) {
      if(row.nodeName === 'PGIS地图分析') {
        return 0;
      }else{
        return 1;
      }
      // console.log(row, 'rowrowrowrowrowrow');
      // console.log(index, 'indexindex');
    },
    initDialog() {
      // this.fileTypeMap()
      this.editForm = {
        systemUrl: '',
        systemName: '',
        folderId: this.data.folderId,
        id: '', // 文件id
        fileName: '', // 文件名称
        fileUrlId: '', // 文件路径id
        fileSuffix: '', // 文件后缀名
        fileUrl: '', // 文件路径
        isshare: '1', // 是否共享 1(默认):是 0否
        fileSource: '', // 文件来源
        videoTime: '', // 视频时长
        fileDescribe: '' // 涉案描述
      }
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
     * 提交编辑文章表单事件
     */
    submit() {
      console.log(this.editForm, 'this.editForm');
      // alert(this.editForm.fileUrlId);
      if(this.menuId === '') {
        this.$alert('请选择需要收藏的系统', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return;
      }
      this.dispatch(APPLICATION_SAVE, {menuIds: this.menuId}).then(() => {
        this.$message({
          type: 'success',
          message: this.colleXtztc.applicationSave,
          showClose: true
        })
        this.ifSaveSystem = true;
        this.$emit('returnSystem', this.ifSaveSystem)
        this.closeEvent();
        console.log(this.colleXtztc.outSyetemSave, 'ddd');
      })
    },
    /**
     * 编辑模态窗取消按钮事件
     * @return {[type]} [description]
     */
    cancel() {
      this.closeEvent()
    }
  },
  created() {
    this.dispatch(GET_APPLICATION_LIST, {}).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: this.colleXtztc.outSyetemSave,
        //   showClose: true
        // })
        // this.ifSaveSystem = true;
        // this.$emit('returnSystem', this.ifSaveSystem)
        // this.closeEvent();
      this.list = this.colleXtztc.getApplicationList;
      console.log(this.colleXtztc, 'GET_APPLICATION_LIST');
    })
  },
  mounted() {
  }
}
</script>
