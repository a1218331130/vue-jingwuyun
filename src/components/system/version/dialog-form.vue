<template>
<el-dialog v-draggable="dialogDraggableOptions" title="新增版本" :visible.sync="dialog" :modal="false" :close-on-click-modal="false" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" label-width="100px">
    <el-row>
      <el-col :span="12" style="position: relative;">
        <span style="color:red;position: absolute;top: 5px;left: 25px;">*</span>
        <el-form-item prop="module" label="版本类型" placeholder="请选择版本类型">
          <el-select v-model="editForm.versionType" style="width:100%" @change="moudelChange">
            <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="position: relative;">
        <span style="color:red;position: absolute;top: 5px;left: 40px;">*</span>
        <el-form-item prop="questionType" label="版本号" placeholder="请输入版本号">
          <el-input v-model="editForm.versionNum"  placeholder="请输入内容" required="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="position: relative;">
        <span style="color:red;position: absolute;top: 5px;left: 25px;">*</span>
        <el-form-item prop="questionContent" label="更新内容">
          <el-input v-model="editForm.updateContent"  placeholder="请输入更新内容" required="true" type="textarea" :rows="3"></el-input>
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
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { VERSION_ADD } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        selectList: [{
          value: '开发版',
          label: '开发版'
        }, {
          value: '正式版',
          label: '正式版'
        }],
        editForm: {
          versionType: '',
          versionNum: '',
          updateContent: ''
        }
      }
    },
    props: ['dialog', 'id'],
    computed: {
      ...mapState(['version'])
    },
    watch: {},
    created() {
      // this.dispatch(VERSION_ADD, this.editForm).then(() => {
      //   this.moudelList = this.version.versionAdd;
      //   console.log(this.moudelList, 'this.moudelList');
      // })
    },
    methods: {
      questionChange(val) {
        // this.editForm.questionType = val;
      },
      moudelChange(val) {

      },
      reset() {
        this.editForm = {
          versionType: '',
          versionNum: '',
          questionContent: ''
        }
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
        if(this.editForm.versionType === '') {
          this.$message({
            type: 'error',
            message: '版本类型不能为空',
            showClose: true
          })
          return;
        }else if(this.editForm.versionNum === '') {
          this.$message({
            type: 'error',
            message: '版本号不能为空',
            showClose: true
          })
          return;
        }else if(this.editForm.updateContent === '') {
          this.$message({
            type: 'error',
            message: '更新内容不能为空',
            showClose: true
          })
          return;
        }
        this.dispatch(VERSION_ADD, this.editForm).then(() => {
          this.$message({
            type: 'success',
            message: '新增成功'
          });
          this.closeEvent(true)
          console.log(this.moudelList, 'this.moudelList');
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '新增失败'
          });
        })
      }
    }
  }

</script>
