<!-- 签收 -->
<template>
<el-form label-width="80px" class="form-box">
  <el-row>
    <el-col :span="24">
      <el-form-item label="意见">
        <el-input type="textarea" v-model="remark" placeholder="" :rows="4"></el-input>
      </el-form-item>
    </el-col>
  </el-row>
  <div class="text-center">
    <el-button type="primary" @click="close">返回</el-button>
    <el-button type="" @click="submit(1)">拒绝</el-button>
    <el-button type="primary" @click="submit(0)">签收</el-button>
  </div>
</el-form>
</template>
<style lang="scss"  scoped>
.form-box {
    padding: 15px;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { POST_UNION_SIGN_REJECT } from '../../../store/types'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      remark: ''
    }
  },
  props: ['assistId', 'processId'],
  methods: {
    submit(type) {
      if (this.checkRule('Xtbg/SignReject') === true) {
        if (this.remark === '') {
          this.$alert('必需填写意见', '温馨提示');
        } else {
          this.dispatch(POST_UNION_SIGN_REJECT, {
            XcId: this.assistId,
            Lczbid: this.processId,
            Note: this.remark,
            Opinon: type
          }).then(() => {
            this.$alert('"' + (type === 0 ? '签收' : '拒绝') + '"操作已成功提交', '操作成功', {
              confirmButtonText: '确定',
              callback: action => {
                window.location.reload()
              }
            });
          })
        }
      }
    },
    close() {
      this.$emit('close')
    }
  },
  mounted() {

  }
}
</script>
