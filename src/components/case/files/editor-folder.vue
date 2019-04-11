<!-- 文件夹操作 -->
<template>
  <div>
    <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改':'新增'" :modal-append-to-body="true" :append-to-body="true"
               size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog"
               :before-close="closeEvent">
      <!-- <div class="el-dialog__body__scroll-wrap"> -->
      <el-form v-if="editForm!==null" ref="editForm" :rules="editFormRules" :model="editForm" label-width="120px">
        <!-- id 插槽 -->
        <input v-model="editForm.id" type="hidden"></input>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="文件夹名称" prop="folderName">
              <el-input placeholder="请输入文件夹名称(50个字以内)" v-model="editForm.folderName" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="文件夹描述" prop="folderDescribe">
              <el-input type="textarea" placeholder="请输入文件夹描述(100个字以内)" :maxlength="200"
                        v-model="editForm.folderDescribe" :rows="6"></el-input>
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
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        editForm: {},
        // 表单验证
        editFormRules: {
          folderName: [
            {required: true, message: '不能为空'}
          ],
          folderDescribe: [
            {required: true, message: '不能为空'}
          ]
        }
      }
    },
    props: ['dialog', 'data', 'editmode'],
    computed: {
      dialogMode() {
        return this.editmode || 'add'
      }
    },
    methods: {
      /**
       *初始化编辑窗口
       */
      initDialog() {
        if (this.$refs['editForm']) this.$refs['editForm'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          folderName: '',
          folderDescribe: ''
        }
        // 填充表单基本数据
        if (this.editmode === 'edit') {
          // 修改
          if (this.data) {
            let _thisInfo = this.data
            this.editForm = {
              id: _thisInfo.id,
              folderName: _thisInfo.title,
              folderDescribe: _thisInfo.describe
            }
          }
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
        this.$refs['editForm'].validate(vt => {
          if (vt) {
            // 确认提交
            this.$emit('form:submit', this.editForm)
          } else {
            return false
          }
        })
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
        if (this.$refs['editForm']) {
          this.$refs['editForm'].resetFields()
        }
      }
    },
    created() {

    },
    mounted() {
    }
  }
</script>
