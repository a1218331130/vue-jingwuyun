<template>
<div style="padding: 4% 5%">
  <el-form :model="approvalForm" label-width="100px" :rules="rules" ref="approvalForm">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="时间范围" prop="stateTime">
          <el-date-picker v-model="approvalForm.stateTime" type="daterange" :picker-options="picker" placeholder="选择日期范围" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="续控原因" prop="reason">
          <el-input type="textarea" v-model="approvalForm.reason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="text-center">
    <el-button @click=closeEvent>关闭</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</div>
</template>

<style scoped>

</style>

<script>
import '../../../utils/dateFormat';
import mixin from '../../../utils/mixin';
import { ADD_APPROVAL } from '../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      picker: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      approvalForm: {
        stateTime: '',
        reason: ''
      },
      rules: {
        stateTime: {
          required: 'true',
          message: '续控时间'
        },
        reason: {
          required: 'true',
          message: '请输入续控原因'
        }
      }
    }
  },
  props: ['ajid'],
  methods: {
    submit() {
      this.$refs.approvalForm.validate(valid => {
        if(valid) {
          this.dispatch(ADD_APPROVAL, {
            id: this.ajid,
            kssj: this.dateFormat(new Date(this.approvalForm.stateTime[0]), 'yyyy-MM-dd hh:mm:ss'),
            jssj: this.dateFormat(new Date(this.approvalForm.stateTime[1]), 'yyyy-MM-dd hh:mm:ss'),
            xkyy: this.approvalForm.reason
          }).then(() => {
            this.$message({
              type: 'success',
              message: '操作已成功提交',
              showClose: true
            })
            setTimeout(() => {
              window.location.reload()
            }, 500)
          })
        } else {
          return false
        }
      })
    },
    closeEvent() {
      this.$emit('close')
      this.resetForm()
    },
    resetForm() {
      this.$refs.approvalForm.resetFields()
    }
  },
  watch: {},
  mounted() {},
  created() {}
}
</script>
