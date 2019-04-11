<!-- 文件操作 -->
<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="新增" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
    <!-- <div class="el-dialog__body__scroll-wrap"> -->
    <el-form v-if="editForm!==null" ref="editForm" :model="editForm" label-width="120px">
      <!-- id 插槽 -->
      <input v-model="editForm.id" type="hidden"></input>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="附件">
            <div class="wrap-box__content">
              <upload :isFormalSubmit="isFormalSubmit" uploadType="multiple" :currentFiles="currentFiles" :accept="accept" @upload:submit="uploadSubmit">
                <el-button slot="button" :disabled="editForm.FileID !== ''" type="primary">上传附件</el-button>
              </upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述">
            <el-input type="textarea" placeholder="请输入描述(100个字以内)" v-model="editForm.MS" :rows="5" :maxlength="200"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style scoped>


</style>
<script>
  import mixin from '../../../../utils/mixin'
  import { mapState } from 'vuex'
  import upload from '../../../../widgets/upload/upload.vue'
  import { SAVE_HDGL_HDZH } from '../../../../store/types'
  import { DOWNLOAD_FILE_PATH } from '../../../../config'
  export default {
    mixins: [mixin],
    components: {
      upload
    },
    data() {
      return {
        accept: 'xls', // 上传文件类型限制
        isFormalSubmit: false,
        currentFiles: [], // 当前文件集合
        editForm: {
          FileID: '',
          MS: ''
        },
        sendData: [],
        loading: false
      }
    },
    props: ['dialog'],
    computed: {
      ...mapState(['improt'])
    },
    methods: {
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.$emit('close')
      },
      /**
       * 提交编辑文章表单事件
       */
      submit() {
        if (this.editForm.FileID !== '') {
          this.isFormalSubmit = true
          this.loading = true
          this.dispatch(SAVE_HDGL_HDZH, this.editForm).then(() => {
            console.log('test', this.improt.saveHdglHdzh)
            this.loading = false
            this.$confirm('是否立马下载该文件?', '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              window.location.href = DOWNLOAD_FILE_PATH + this.improt.saveHdglHdzh.NewFileId
              this.$emit('success')
            }).catch(() => {
              this.$emit('success')
            })
          })
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
        this.editForm.FileID = f.data.file.response.Data.ID
        this.isFormalSubmit = false
      }
    },
    created() {

    },
    mounted() {}
  }

</script>
