<template>
<el-dialog v-draggable="dialogDraggableOptions" title="审批" :visible.sync="dialogApproval" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <div>
    <el-form :model="approvalForm" :rules="rules" ref="approvalForm" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="人员" v-if="FocusType===1">
            {{approvalForm.RyName}}&nbsp;-&nbsp;{{approvalForm.idcard}}
          </el-form-item>
          <el-form-item label="车辆" v-if="FocusType===2">
            {{approvalForm.OwnerName}}&nbsp;-&nbsp;{{approvalForm.PlateNo}}
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="申请理由">

          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="审批情况" prop="HandleOpinion">
            <el-radio-group v-model="approvalForm.HandleOpinion">
              <el-radio label="TY">同意</el-radio>
              <el-radio label="BTY">不同意</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="审批意见" prop="Note">
            <el-input type="textarea" :maxlength="500" placeholder="限制500个字符" v-model="approvalForm.Note"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitForm('approvalForm')">加入</el-button>
    <el-button @click="closeEvent">取 消</el-button>
  </div>
</el-dialog>
</template>

<style scoped>
</style>
<script>
import mixin from '../../../../utils/mixin'
import { POST_PROCESS_EXAMINE } from '../../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      FocusType: 1,
      approvalForm: {
        RyName: '',
        idcard: '',
        OwnerName: '',
        PlateNo: '',
        HandleOpinion: 'TY',
        Lczbid: '',
        Note: ''
      },
      rules: {
        HandleOpinion: [
          { required: true, message: '选择是否同意', trigger: 'change' }
        ],
        Note: [
          { required: true, message: '请输入审批意见', trigger: 'change' }
        ]
      }
    }
  },
  props: ['dialogApproval', 'object'],
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.approvalForm.Lczbid = this.object.FlowId
      if (this.object.Sfz) {
        this.FocusType = 1
      } else {
        this.FocusType = 2
      }
      console.log('this.FocusType', this.FocusType);
      // 人员
      // this.dispatch(GET_PERSON_JUDGE_HIS, {
      //   Sfz: this.object.Sfz
      // }).then(() => {
      //   this.process.GetPersonJudgeHis
      // })
      this.approvalForm.RyName = this.object.RyName
      this.approvalForm.idcard = this.object.Sfz
      // 车辆
      this.approvalForm.OwnerName = this.object.OwnerName
      this.approvalForm.PlateNo = this.object.PlateNo
    },
    /**
     * 重置表单
     */
    reset() {
      if (this.$refs['approvalForm']) {
        this.$refs['approvalForm'].resetFields()
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.reset()
      this.$emit('close')
      // this.dialog = false
    },
    submitForm(d) {
      this.$confirm('确定要通过审核?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dispatch(POST_PROCESS_EXAMINE, {
          Lczbid: this.approvalForm.Lczbid,
          HandleOpinion: this.approvalForm.HandleOpinion,
          Note: this.approvalForm.Note
        }).then(d => {
          this.$message('审核成功!')
          this.closeEvent()
          this.$emit('call:change-update')
        })
      })
    }
  },
  watch: {},
  mounted() {},
  created() {},
  computed: {
    ...mapState(['process'])
  }
}
</script>
