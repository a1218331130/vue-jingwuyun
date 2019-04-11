<!-- 签收 -->
<template>
<el-form label-width="80px" class="form-box">
  <el-row>
    <el-col :span="12">
      <el-form-item label="质量">
        <el-rate v-model="form.qualityScore" allow-half show-text></el-rate>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="效率">
        <el-rate v-model="form.efficiencyScore" allow-half show-text></el-rate>
      </el-form-item>
    </el-col>
    <el-col :span="24">
      <el-form-item label="评价">
        <el-input type="textarea" v-model="form.content" placeholder=""></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="战果">
        <el-radio-group v-model="form.res">
          <el-radio :label="1">有</el-radio>
          <el-radio :label="0">无</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="抓获人数">
        <el-input-number v-model="form.victoryPerson" placeholder="" :min="0" :disabled="form.res===0"></el-input-number>
      </el-form-item>
    </el-col>
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
import { POST_UNION_COMMENT } from '../../../store/types'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      form: {
        content: '',
        victoryPerson: '',
        res: 0,
        qualityScore: 3,
        efficiencyScore: 3
      }
    }
  },
  props: ['assistId', 'processId'],
  computed: {

  },
  methods: {
    submit() {
      if (this.checkRule('Xtbg/Evaluate') === true) {
        if (this.form.content === '') {
          this.$alert('必需填写评论内容', '温馨提示');
        } else {
          this.dispatch(POST_UNION_COMMENT, {
            XcId: this.assistId,
            QualityScore: this.form.qualityScore * 2,
            EfficiencyScore: this.form.efficiencyScore * 2,
            IsVictory: this.form.res,
            VictoryPersonNum: this.form.victoryPerson,
            EvaluativeInfo: this.form.content
          }).then(() => {
            this.$alert('评价提交成功', '操作成功', {
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
