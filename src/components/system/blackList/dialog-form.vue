<template>
<el-dialog v-draggable="dialogDraggableOptions" title="提交申请" :visible.sync="dialog" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="姓名">
          <el-input v-model="editForm.name" :disabled="flag" placeholder="请输入姓名" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="gender" label="性别">
          <el-select v-model="editForm.gender" :disabled="flag">
            <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="zjhm" label="证件号码">
          <el-input v-model="editForm.zjhm" :disabled="flag" placeholder="请输入证件号码" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="policeNum" label="警号">
          <el-input v-model="editForm.policeNum" :disabled="flag" placeholder="请输入警号" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号码">
          <el-input v-model="editForm.cellphoneNum" :disabled="flag" placeholder="请输入手机号码" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单位名称">
          <el-input v-model="editForm.dept" :disabled="flag" placeholder="请选择单位名称" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位">
          <el-input v-model="editForm.position" :disabled="flag" placeholder="请输入职位" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="办公电话">
          <el-input v-model="editForm.phoneNum" :disabled="flag" placeholder="请输入办公电话" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请原因">
          <el-input v-model="editForm.applyReason" :disabled="flag" type="textarea" :rows="3" placeholder="请输入申请原因" :maxlength="300"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="" @click="submitApply">确定</el-button>
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
  import { GET_BLACK_LIST_BY_ID, BLACK_LIST_UPDATE_DRAFT, DRAFT_TO_APPLY } from '../../../store/types'

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        editForm: {
          name: '',
          gender: '',
          zjhm: '',
          policeNum: '',
          cellphoneNum: '',
          dept: '',
          position: '',
          phoneNum: '',
          applyReason: ''
        },
        selectList: [{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
        rules: {
          name: [{
            required: true,
            message: '请输入姓名',
            tigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请输入性别',
            tigger: 'blur'
          }],
          zjhm: [{
            required: true,
            message: '请输入证件号码',
            tigger: 'blur'
          }],
          policeNum: [{
            required: true,
            message: '请输入警号',
            tigger: 'blur'
          }]
        },
        flag: ''
      }
    },
    props: ['dialog', 'id', 'title'],
    computed: {
      ...mapState(['blackList'])
    },
    watch: {},
    methods: {
      initDialog() {
        if (this.id) {
          if (this.title === 'edit') {
            this.flag = false
          } else {
            this.flag = true
          }
          this.dispatch(GET_BLACK_LIST_BY_ID, { id: this.id }).then(() => {
            this.editForm = {
              name: this.blackList.getBlackListById.name,
              gender: this.blackList.getBlackListById.gender,
              zjhm: this.blackList.getBlackListById.zjhm,
              policeNum: this.blackList.getBlackListById.policeNum,
              cellphoneNum: this.blackList.getBlackListById.cellphoneNum,
              dept: this.blackList.getBlackListById.dept,
              position: this.blackList.getBlackListById.position,
              phoneNum: this.blackList.getBlackListById.phoneNum,
              applyReason: this.blackList.getBlackListById.applyReason
            }
          })
        }
      },
      reset() {
        this.$refs.editForm.resetFields()
      },
      closeEvent(success = false) {
        this.reset()
        if (success === true) {
          this.$emit('submit')
        } else {
          this.$emit('close')
        }
      },
      submitApply() {
        if (this.title === 'edit') {
          this.$refs.editForm.validate((valid) => {
            if (valid === true) {
              this.editForm.id = this.id
              this.dispatch(BLACK_LIST_UPDATE_DRAFT, this.editForm).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  showClose: true
                })
                this.closeEvent(true)
              })
            }
          })
        } else {
          this.$refs.editForm.validate((valid) => {
            if (valid === true) {
              this.dispatch(DRAFT_TO_APPLY, { id: this.id }).then(() => {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  showClose: true
                })
                this.closeEvent(true)
              })
            }
          })
        }
      }
    }
  }

</script>
