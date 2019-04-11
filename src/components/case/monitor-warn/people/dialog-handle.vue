<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title" :modal-append-to-body="true" :append-to-body="true" size="small"
             :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form :model="data" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="姓名">
            <el-input :value="data.name" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="身份证">
            <el-input :value="data.idCard" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="户籍地址">
            <el-input :value="data.add" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="预警描述">
            <el-input type="textarea" :autosize="{minRows:2,maxRows:8}" :value="data.ms" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="submitQS">签收</el-button>
      <el-button type="primary" @click="submit">核查</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>
</style>
<script>
  export default {
    components: {},
    data() {
      return {}
    },
    props: ['dialog', 'type', 'title', 'data'],
    computed: {
      dialogMode() {
        return this.editmode || 'add'
      }
    },
    methods: {
      /**
       * 初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        // 填充表单基本数据
        if (this.dialogMode === 'edit' && this.id !== '') {
          // 修改
          this.getDetail(this.id)
        } else {
          // (默认)新增
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
       * @return {[type]} [description]
       */
      submitQS() {
        // 表单验证
        console.log('签收')
        this.$message({
          message: '签收完成！'
        })
        this.closeEvent()
      },
      submit() {
        // 表单验证
        console.log('核查')
        this.$message({
          message: '核查确认！'
        })
        this.closeEvent()
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

    },
    mounted() {
    }
  }
</script>
