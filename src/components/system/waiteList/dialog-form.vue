<template>
<el-dialog v-draggable="dialogDraggableOptions" title="白名单" :visible.sync="dialog" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="name" label="姓名" placeholder="请输入姓名">
          <el-input v-model="editForm.name" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="gender" label="性别" placeholder="请输入性别">
          <el-select v-model="editForm.gender" style="width:100%">
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
  import { GET_WAITE_LIST_BY_ID, POST_WAITE_LIST, UPDATE_WAITE_LIST_BY_ID } from '../../../store/types'

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
    props: ['dialog', 'id'],
    computed: {
      ...mapState(['waiteList'])
    },
    watch: {},
    methods: {
      initDialog() {
        if (this.id) {
          this.dispatch(GET_WAITE_LIST_BY_ID, { id: this.id }).then(() => {
            this.editForm = {
              name: this.waiteList.getWaiteListById.name,
              gender: this.waiteList.getWaiteListById.gender,
              zjhm: this.waiteList.getWaiteListById.zjhm,
              policeNum: this.waiteList.getWaiteListById.policeNum,
              cellphoneNum: this.waiteList.getWaiteListById.cellphoneNum,
              dept: this.waiteList.getWaiteListById.dept,
              position: this.waiteList.getWaiteListById.position,
              phoneNum: this.waiteList.getWaiteListById.phoneNum,
              isEnable: this.waiteList.getWaiteListById.isEnable.toString()
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
            this.editForm.id = this.id
            this.dispatch(this.id !== '' ? UPDATE_WAITE_LIST_BY_ID : POST_WAITE_LIST, this.id !== '' ? this.editForm : this.editForm).then(() => {
              this.$message({
                type: 'success',
                message: '保存成功',
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
