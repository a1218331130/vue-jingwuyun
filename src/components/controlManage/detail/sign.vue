<template>
<div style="padding: 4% 5%">
  <el-form :model="approvalForm" label-width="100px" :rules="rules" ref="approvalForm">
    <el-row :gutter="10">
      <!--<el-col :span="24">-->
      <!--<el-form-item label="审批情况">-->
      <!--<el-radio-group v-model="approvalForm.select">-->
      <!--<el-radio label="同意">同意</el-radio>-->
      <!--<el-radio label="不同意">不同意</el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <row>
        <el-col :span="6">
          <el-form-item label="处理意见" prop="select">
            <el-select v-model="approvalForm.select" placeholder="" style="width:100%">
              <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </row>
      <el-col :span="12">
        <el-form-item label="审批人">
          <span>已到最后审批，下一步流程将结束！</span>
          <!--<el-select placeholder="">-->
          <!--<el-option :key="1" label="张某某"></el-option>-->
          <!--<el-option :key="2" label="黄某某"></el-option>-->
          <!--<el-option :key="3" label="刘某某"></el-option>-->
          <!--</el-select>-->
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="审批意见" prop="reason">
          <el-input type="textarea" v-model="approvalForm.reason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div class="text-center">
    <el-button @click="closeEvent">关闭</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</div>
</template>

<style scoped>
  .a {}

</style>

<script>
  import { POST_PROCESS_EXAMINE } from '../../../store/types';
  import mixin from '../../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        selectList: [{
          value: 'TY',
          label: '同意'
        }, {
          value: 'BTY',
          label: '不同意'
        }],
        approvalForm: {
          select: '',
          reason: ''
        },
        rules: {
          select: {
            required: 'true',
            message: '处理意见'
          },
          reason: {
            required: 'true',
            message: '请输入审批意见'
          }
        }
      }
    },
    props: ['lcid'],
    methods: {
      approval() {
        this.$refs.approvalForm.validate(valid => {
          if (valid) {
            this.dispatch(POST_PROCESS_EXAMINE, {
              Lczbid: this.lcid,
              HandleOpinion: this.approvalForm.select,
              Note: this.approvalForm.reason,
              NextNode: ''
            }).then(() => {
              this.$message({
                type: 'success',
                message: '操作已成功提交',
                showClose: true
              })
              this.closeEvent()
              // setTimeout(() => {
              //   window.location.reload()
              // }, 500)
            })
          } else {
            return false
          }
        })
      },
      submit() {
        this.approval()
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
