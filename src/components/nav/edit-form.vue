<!-- 文件操作 -->
<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="编辑外部系统" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <el-form  v-if="editForm1!==null" ref="editForm1" :model="editForm1" label-width="120px">
      <!-- id 插槽 -->
      <input v-model="editForm1.id" type="hidden"></input>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="系统名称">
            <el-input placeholder="请输入系统名称" v-model="editForm1.systemName"></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="24">
          <el-form-item label="系统地址">
            <el-input placeholder="请输入系统地址" v-model="editForm1.systemUrl"></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="24">
          <el-form-item label="系统图片">
            <div class="wrap-box__content">
              <input type="hidden" v-model="editForm1.fileUrlId" />
              <input type="hidden" v-model="editForm1.fileSuffix" />
              <upload :isFormalSubmit="isFormalSubmit" uploadType="multiple" :currentFiles="currentFiles" :accept="accept" @upload:submit="uploadSubmit">
                <el-button slot="button" type="primary">上传系统图片</el-button>
              </upload> 
              <!-- <form id="form" action="http://10.146.92.92/fwzx/fwzx/call?id=safetyReview/whiteList/excelImport" method="POST">
                <input type="text" :value="token">
                <input type="file" @change="getFile($event)">
                <button type="submit" >确 定</button>
              </form> -->
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="">
            <img :src="editForm1.webLogo" style="" :class="editForm1.webLogo === '' ? '' : 'reviewImg'"></img>
          </el-form-item>
        </el-col> 
        <!-- <el-col :span="24">
          <el-form-item label="文件名称">
            <el-input placeholder="请输入文件名称(25个字以内)" v-model="editForm.fileName" :disabled="true" :maxlength="50"></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
    <!-- </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>
</style>
<script>
import mixin from '../../utils/mixin'
import { mapState } from 'vuex'
import upload from '../../widgets/upload/upload.vue'
import { clone } from '../../utils/util'
import { OUT_SYETEM_UPDATE } from '../../store/types'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      file: {},
      accept: '', // 上传文件类型限制
      isFormalSubmit: false,
      currentFiles: [], // 当前文件集合
      editForm1: {},
      sendData: []
    }
  },
  props: ['dialog', 'data', 'editmode', 'fileAcceptType', 'ifSaveSystem', 'systemEdit'],
  watch: {
    dialog: function(val, oldval) {
      console.log(this.systemEdit, 'systemEditsystemEdit');
      this.editForm1 = JSON.parse(JSON.stringify(this.systemEdit));
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
    initDialog() {
      this.reset() // 初始化重置表单
      // this.fileTypeMap()
      this.editForm1 = {
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

      // 填充表单基本数据
      if (this.editmode === 'edit') {
        // 修改
        if (this.data) {}
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.reset()
      this.$emit('close')
      // this.dialog = false
    },
    /**
     * 提交编辑文章表单事件
     */
    submit() {
      console.log(this.editForm1, 'this.editForm1');
      // alert(this.editForm.fileUrlId);
      if(this.editForm1.systemName === '' || this.editForm1.systemName === undefined) {
        this.$alert('系统名称不能为空', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return;
      }else if(this.editForm1.systemUrl === '' || this.editForm1.systemUrl === undefined) {
        this.$alert('系统地址不能为空', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        return;
      }
      // if (this.editForm1.fileUrlId !== '' && this.editForm1.fileUrlId !== undefined) {
      this.file.systemPic = this.editForm1.fileUrlId;
      this.file.systemUrl = this.editForm1.systemUrl;
      this.file.systemName = this.editForm1.systemName;
      this.file.id = this.editForm1.id;
      // this.file.Name = this.editForm.fileName + '.' + this.editForm.fileSuffix;
      this.dispatch(OUT_SYETEM_UPDATE, this.file).then(() => {
        this.$message({
          type: 'success',
          message: this.colleXtztc.outSyetemUpdate,
          showClose: true
        })
        this.ifSaveSystem = true;
        this.$emit('returnSystem', this.ifSaveSystem)
        this.closeEvent();
        // console.log(this.colleXtztc.outSyetemSave, 'ddd');
      })
      // } else {
      //   this.$alert('图片不能为空', {
      //     confirmButtonText: '确定',
      //     type: 'warning'
      //   })
      // }
    },
    getFile(e) {
      this.file = e.target.files[0];
      console.log(e, 'eee');
    },
    /**
     * 编辑模态窗取消按钮事件
     * @return {[type]} [description]
     */
    cancel() {
      this.closeEvent()
    },
    /**
     * 重置表单
     */
    reset() {
      this.currentFiles = [] // 上传文件列表 重置
      if (this.$refs['editForm1']) {
        this.$refs['editForm1'].resetFields()
      }
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      this.editForm1.fileUrlId = '';
      this.sendData = [];
      console.log(f, 'this.f')
      this.editForm1.webLogo = f.data.res.Data.FileUrl;
      if (f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = [],
          _fileSuffixArray = [],
          _fileNameArray = [],
          _fileVideoTimeArray = []
        for (let ii in f.data.fileList) {
          let transObj = {}
          transObj = clone(this.editForm1)
          let _thisFileii = f.data.fileList[ii]
          let __fFileId = _thisFileii.response ? _thisFileii.response.Data.ID : _thisFileii.url.split('?id=')[1]
          let __fFileSuffix = _thisFileii.response ? _thisFileii.response.Data.Extend : _thisFileii.raw.type.split('/')[1]
          let __fFileVideoTime = _thisFileii.response ? (_thisFileii.response.Data.video ? _thisFileii.response.Data.video.Time : '') : ''
          transObj.fileUrlId = __fFileId
          transObj.fileSuffix = __fFileSuffix
          transObj.fileName = _thisFileii.name.replace('.' + __fFileSuffix, '')
          transObj.videoTime = __fFileVideoTime
          _fileIdArray.push(__fFileId)
          _fileSuffixArray.push(__fFileSuffix)
          _fileVideoTimeArray.push(__fFileVideoTime)
          _fileNameArray.push(_thisFileii.name.replace('.' + __fFileSuffix, ''))
          this.sendData.push(transObj)
        }
        this.editForm1.fileUrlId = _fileIdArray.join()
        this.editForm1.fileSuffix = _fileSuffixArray.join()
        this.editForm1.fileName = _fileNameArray.join()
        this.editForm1.videoTime = _fileVideoTimeArray.join()
        console.log(this.editForm1, 'this.editForm1')
      }
      this.isFormalSubmit = false
    }
  },
  created() {
  },
  mounted() {
  }
}
</script>
