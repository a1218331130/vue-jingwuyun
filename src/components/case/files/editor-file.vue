<!-- 文件操作 -->
<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <el-form v-if="editForm!==null" ref="editForm" :model="editForm" label-width="120px">
      <!-- id 插槽 -->
      <input v-model="editForm.id" type="hidden"></input>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="附件">
            <div class="wrap-box__content">
              <input type="hidden" v-model="editForm.fileUrlId" />
              <input type="hidden" v-model="editForm.fileSuffix" />
              <upload :isFormalSubmit="isFormalSubmit" uploadType="multiple" :currentFiles="currentFiles" :accept="accept" @upload:submit="uploadSubmit">
                <el-button slot="button" type="primary">上传附件12</el-button>
              </upload>
              <span v-if="fileAcceptType === '3' && !(editForm.fileSuffix === 'mp4')">
                  只能上传后缀为 *.mp4 文件
                  <a href="/static/video/FormatFactory.rar" download="视频格式转换工具">视频格式转换工具<br></a>
                </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="视频时长" v-if="fileAcceptType === '3' && editForm.fileSuffix === 'mp4'">
            {{editForm.videoTime}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件名称">
            <el-input placeholder="请输入文件名称(25个字以内)" v-model="editForm.fileName" :disabled="true" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否共享">
            <el-switch v-model="editForm.isshare" on-text="是" on-value="1" off-text="否" off-value="0" :disabled="editForm.fileUrlId === ''"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件来源">
            <el-input placeholder="请输入文件来源(50个字以内)" v-model="editForm.fileSource" :disabled="editForm.fileUrlId === ''" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="涉案描述">
            <el-input type="textarea" placeholder="请输入涉案描述(100个字以内)" v-model="editForm.fileDescribe" :rows="5" :maxlength="200" :disabled="editForm.fileUrlId === ''"></el-input>
          </el-form-item>
        </el-col>
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
import mixin from '../../../utils/mixin'
import upload from '../../../widgets/upload/upload.vue'
import { clone } from '../../../utils/util'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      accept: '', // 上传文件类型限制
      isFormalSubmit: false,
      currentFiles: [], // 当前文件集合
      editForm: {},
      sendData: []
    }
  },
  props: ['dialog', 'data', 'editmode', 'fileAcceptType'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    }
  },
  methods: {
    /**
     *  获取当前上传文件类型
     */
    fileTypeMap() {
      switch (this.fileAcceptType) {
        case '1':
          // 文件
          // xlsx application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
          // docx application/vnd.openxmlformats-officedocument.wordprocessingml.document
          // zip application/octet-stream application/x-msdownload
          // this.accept = 'text/*,application/*,,aplication/*,application/octet-stream,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          this.accept = ''
          break;
        case '2':
          // 图片
          this.accept = 'image/gif,image/jpg,image/png,image/jpeg'
          break;
        case '3':
          // 视频
          this.accept = 'video/mp4'
          break;
      }
    },
    /**
     *初始化编辑窗口
     */
    initDialog() {
      this.reset() // 初始化重置表单
      this.fileTypeMap() // 初始化文件类型上传限制

      this.editForm = {
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
      this.$emit('call:close')
      // this.dialog = false
    },
    /**
     * 提交编辑文章表单事件
     */
    submit() {
      console.log(this.editForm, 'this.editForm')
      alert(this.editForm.fileSource);
      if (this.editForm.fileUrlId !== '') {
        this.isFormalSubmit = true
        for(var i = 0; i < this.sendData.length; i++) {
          this.sendData[i].isshare = this.editForm.isshare
          this.sendData[i].fileSource = this.editForm.fileSource
          this.sendData[i].fileDescribe = this.editForm.fileDescribe
        }
        console.log(this.sendData, 'this.sendData')
        this.$emit('form:submit', this.sendData)
      } else {
        this.$alert('附件不能为空', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
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
      if (this.$refs['editForm']) {
        this.$refs['editForm'].resetFields()
      }
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      this.sendData = [];
      console.log(f, 'this.f')
      if (f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = [],
          _fileSuffixArray = [],
          _fileNameArray = [],
          _fileVideoTimeArray = []
        for (let ii in f.data.fileList) {
          let transObj = {}
          transObj = clone(this.editForm)
          let _thisFileii = f.data.fileList[ii]
          let __fFileId = _thisFileii.response ? _thisFileii.response.Data.ID : _thisFileii.url.split('?id=')[1]
          let __fFileSuffix = _thisFileii.response ? _thisFileii.response.Data.Extend : _thisFileii.raw.type.split('/')[1]
          let __fFileVideoTime = _thisFileii.response ? (_thisFileii.response.Data.video ? _thisFileii.response.Data.video.Time : '') : ''
          transObj.fileUrlId = __fFileId
          transObj.fileSuffix = __fFileSuffix
          transObj.fileName = _thisFileii.name.replace('.' + __fFileSuffix, '')
          transObj.videoTime = __fFileVideoTime
          // transObj.isshare = this.editForm.isshare
          // transObj.fileSource = this.editForm.fileSource
          // transObj.fileDescribe = this.editForm.fileDescribe
          _fileIdArray.push(__fFileId)
          _fileSuffixArray.push(__fFileSuffix)
          _fileVideoTimeArray.push(__fFileVideoTime)
          _fileNameArray.push(_thisFileii.name.replace('.' + __fFileSuffix, ''))
          this.sendData.push(transObj)
        }
        this.editForm.fileUrlId = _fileIdArray.join()
        this.editForm.fileSuffix = _fileSuffixArray.join()
        this.editForm.fileName = _fileNameArray.join()
        this.editForm.videoTime = _fileVideoTimeArray.join()
        console.log(this.editForm, 'this.editForm')
      }
      this.isFormalSubmit = false
    }
  },
  created() {

  },
  mounted() {}
}
</script>
