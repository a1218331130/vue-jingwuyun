<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="dialogTitle === '新增'?'新增':'修改'" :visible.sync="dialog" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="姓名" placeholder="请输入姓名">
          <el-input v-model="editForm.name" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="gender" label="性别">
          <el-select v-model="editForm.gender">
            <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="zjhm" label="证件号码" placeholder="请输入证件号码">
          <el-input v-model="editForm.zjhm" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="policeNum" label="警号" placeholder="请输入警号">
          <el-input v-model="editForm.policeNum" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="手机号码" placeholder="请输入手机号码">
          <el-input v-model="editForm.cellphoneNum" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="单位名称" placeholder="请选择单位名称">
          <el-input v-model="editForm.dept" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位" placeholder="请输入职位">
          <el-input v-model="editForm.position" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="办公电话" placeholder="请输入办公电话">
          <el-input v-model="editForm.phoneNum" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="是否启用">
          <el-radio-group v-model="editForm.isEnable">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
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
  import { GET_RED_LIST_BY_ID, POST_RED_LIST, UPDATE_RED_LIST_BY_ID } from '../../../store/types'

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
          isEnable: '1'
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
        }
      }
    },
    props: ['dialog', 'id', 'dialogTitle'],
    computed: {
      ...mapState(['redList'])
    },
    watch: {},
    methods: {
      initDialog() {
        if (this.id && this.dialogTitle === '修改') {
          this.dispatch(GET_RED_LIST_BY_ID, { id: this.id }).then(() => {
            this.editForm = {
              name: this.redList.getRedListById.name,
              gender: this.redList.getRedListById.gender,
              zjhm: this.redList.getRedListById.zjhm,
              policeNum: this.redList.getRedListById.policeNum,
              cellphoneNum: this.redList.getRedListById.cellphoneNum,
              dept: this.redList.getRedListById.dept,
              position: this.redList.getRedListById.position,
              phoneNum: this.redList.getRedListById.phoneNum,
              isEnable: this.redList.getRedListById.isEnable.toString()
            }
          })
        } else {
          this.editForm = {
            name: '',
            gender: '',
            zjhm: '',
            policeNum: '',
            cellphoneNum: '',
            dept: '',
            position: '',
            phoneNum: '',
            isEnable: '1'
          }
        }
      },
      reset() {
        this.$refs.editForm.resetFields()
      },
      closeEvent(success = false) {
        this.reset()
        if (success === true) {
          this.$emit('success')
        } else {
          this.$emit('close')
        }
      },
      submit() {
        this.$refs.editForm.validate((valid) => {
          if (valid === true) {
            if (this.id && this.dialogTitle === '修改') {
              this.editForm.id = this.id
            }
            this.dispatch(this.id !== '' ? UPDATE_RED_LIST_BY_ID : POST_RED_LIST, this.id !== '' ? this.editForm : this.editForm).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功',
                showClose: true
              })
              this.closeEvent(true)
            })
          }
        })
      }
    }
  }

</script>
