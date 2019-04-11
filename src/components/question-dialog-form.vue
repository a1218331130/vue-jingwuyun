<template>
<el-dialog v-draggable="dialogDraggableOptions" title="问题反馈" :visible.sync="dialog" :modal="false" :close-on-click-modal="false" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="module" label="系统模块" placeholder="请选择系统模块">
          <el-select v-model="editForm.module" style="width:100%" @change="moudelChange">
            <el-option v-for="item in moudelList" :key="item.nodeName" :label="item.nodeName" :value="item.nodeName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="questionType" label="问题类型" placeholder="请选择问题类型">
          <el-select v-model="editForm.questionType" style="width:100%" @change="questionChange">
            <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item prop="questionContent" label="内容">
          <el-input v-model="editForm.questionContent"  placeholder="请输入内容" required="true" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
         <el-form-item prop="attachmentIds" label="文件">
              <upload :isFormalSubmit="isFormalSubmit" uploadType="multiple" :currentFiles="currentFiles" @upload:submit="uploadSubmit">
                <el-button slot="button" type="primary">上传附件</el-button>
              </upload> 
        </el-form-item> 
      </el-col>
    </el-row>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
  </div>
</el-dialog>
</template>
<style scoped>
  .app-toolbar .el-form-item {
    margin-bottom: 0;
  }

</style>
<script>
  import mixin from '../utils/mixin'
  import { mapState } from 'vuex'
  import { QGET_APPLICATION_LIST, SUBMIT_QUESTION } from '../store/types'
  import upload from '../widgets/upload/upload'
  export default {
    mixins: [mixin],
    components: {upload},
    data() {
      return {
        isFormalSubmit: false,
        moudelList: [],
        currentFiles: [],
        selectList: [{
          value: '0',
          label: '功能需求'
        }, {
          value: '1',
          label: '数据需求'
        }, {
          value: '2',
          label: 'BUG'
        }, {
          value: '3',
          label: '其它'
        }],
        editForm: {
          module: '',
          questionType: '0',
          questionContent: '',
          attachmentIds: [],
          fileNames: []
        },
        rules: {
          module: [{
            required: true,
            message: '请选择系统模块',
            tigger: 'blur'
          }],
          questionType: [{
            required: true,
            message: '请输入问题类型',
            tigger: 'blur'
          }],
          questionContent: [{
            required: true,
            message: '请输入内容',
            tigger: 'blur'
          }],
          attachmentIds: [{
            required: true,
            message: '请上传附件',
            tigger: 'blur'
          }]
        }
      }
    },
    props: ['dialog', 'id'],
    computed: {
      ...mapState(['question'])
    },
    watch: {},
    created() {
      this.dispatch(QGET_APPLICATION_LIST).then(() => {
        this.moudelList = this.question.qgetApplicationList;
        console.log(this.question.qgetApplicationList, 'questionquestionquestionquestionquestion');
        // this.closeEvent(true)
      })
      // .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '保存失败'
      //     });
      //  })
    },
    methods: {
      questionChange(val) {
        // this.editForm.questionType = val;
      },
      moudelChange(val) {

      },
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        console.log(f, 'this.f')
        this.editType = true;
        if (f.Status === 1) { // 文件更新保存成功后提交
          let _fileIdArray = []
          let _fileNameArray = []
          for (let ii in f.data.fileList) {
            let _thisFileii = f.data.fileList[ii]
            // let __fFileSuffix = _thisFileii.response ? _thisFileii.response.Data.Extend : _thisFileii.raw.type.split('/')[1]
            let __fFileId = _thisFileii.response ? _thisFileii.response.Data.ID : _thisFileii.url.split('?id=')[1]
            _fileIdArray.push(__fFileId)
            _fileNameArray.push(_thisFileii.name)
          }
          this.isFormalSubmit = false;
          this.editForm.attachmentIds = _fileIdArray.join()
          this.editForm.fileNames = _fileNameArray.join()
          console.log(this.editForm, 'this.controlFormcontrolFormcontrolFormcontrolForm')
        }
      },
      reset() {
        this.currentFiles = [] // 上传文件列表 重置
        if (this.$refs['editForm']) {
          this.$refs['editForm'].resetFields()
        }
        this.editForm.attachmentIds = [];
        this.editForm.attachmentIds = [];
      },
      closeEvent(success = false) {
        this.reset()
        if (success === true) {
          this.$emit('close')
        } else {
          this.$emit('close')
        }
      },
      submit() {
        this.$refs.editForm.validate((valid) => {
          if (valid === true) {
            this.editForm.id = this.id
            this.dispatch(SUBMIT_QUESTION, this.editForm).then(() => {
              this.$message({
                type: 'success',
                message: '保存成功,请前往中心顶部进入查看',
                showClose: true
              })
              this.closeEvent(true)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '保存失败'
              });
            })
          }
        })
      }
    }
  }

</script>
