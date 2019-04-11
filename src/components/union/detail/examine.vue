<!-- 签收 -->
<template>
<el-form :model="form" label-width="80px" class="form-box">
  <el-row>
    <el-col :span="12">
      <el-form-item label="处理意见">
        <el-select v-model="form.handle" placeholder="">
          <el-option key="TY" value="TY" label="同意"></el-option>
          <el-option key="BTY" value="BTY" label="不同意"></el-option>
        </el-select>
      </el-form-item>
    </el-col>
    <!-- <el-col :span="12">
      <el-form-item label="审批人">
        <span>已到最后审批，下一步流程将结束！</span>
        <el-select placeholder="">
        <el-option :key="1" label="张某某"></el-option>
        <el-option :key="2" label="黄某某"></el-option>
        <el-option :key="3" label="刘某某"></el-option>
        </el-select>
      </el-form-item>
    </el-col> -->
    <el-col :span="24">
      <el-form-item label="审批意见">
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
import { POST_PROCESS_EXAMINE } from '../../../store/types'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      form: {
        handle: 'TY',
        remark: ''
      }
    }
  },
  props: ['assistId', 'processId'],
  computed: {

  },
  methods: {
    submit() {
      if (this.checkRule('Lcgl/GoNext') === true) {
        this.dispatch(POST_PROCESS_EXAMINE, {
          Lczbid: this.processId,
          HandleOpinion: this.form.handle, // 处理项(TY:同意,BTY:不同意)
          Note: this.form.remark
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
