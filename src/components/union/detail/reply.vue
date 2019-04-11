<!-- 签收 -->
<template>
<el-form :model="form" label-width="80px" class="form-box">
  <el-row>
    <!-- <el-col :span="12">
      <el-form-item label="处理意见">
        <el-select v-model="form.handle" placeholder="">
          <el-option key="TY" value="TY" label="同意"></el-option>
          <el-option key="BTY" value="BTY" label="不同意"></el-option>
        </el-select>
      </el-form-item>
    </el-col> -->
    <el-col :span="24">
      <el-form-item label="意见回复" style="margin-top:25px">
        <el-input type="textarea" v-model="form.remark" placeholder=""></el-input>
      </el-form-item>
    </el-col>
    <!--<el-col :span="12">-->
    <!--<el-form-item label="附件">-->
    <!--<el-upload action="">-->
    <!--<el-button type="primary">上传</el-button>-->
    <!--</el-upload>-->
    <!--</el-form-item>-->
    <!--</el-col>-->
  </el-row>
  <div class="text-center">
    <el-button type="primary" @click="close">返回</el-button>
    <el-button type="primary" @click="submit">提交</el-button>
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
import { SAVE_UNION_STEERING_OPINION } from '../../../store/types'
import { mapState } from 'vuex'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      form: {
        remark: ''
      }
    }
  },
  props: ['assistId', 'processId', 'steer'],
  computed: {
    ...mapState(['union'])
  },
  methods: {
    submit() {
      console.log(this.steer, 7484264);
      if (this.checkRule('Lcgl/GoNext') === true) {
        this.dispatch(SAVE_UNION_STEERING_OPINION, {
          V_XCID: this.steer.SourceId,
          V_CONTENT: this.form.remark,
          V_TYPE: 0,
          V_OPTLX: this.steer.By1,
          V_OPTNAME: this.steer.By2
        }).then(() => {
          this.$alert('操作已成功提交', '操作成功', {
            confirmButtonText: '确定',
            callback: action => {
              window.location.reload()
            }
          });
        })
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
