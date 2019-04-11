<template>
<el-dialog v-draggable="dialogDraggableOptions" title="加入研判" :visible.sync="dialogStudy" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <div class="updateStudyData">
    <el-form :model="studyForm" ref="studyForm" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="案件名称" prop="state4">
            <el-autocomplete :maxlength="150" v-model="state4" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="加入原因" prop="Describe">
            <el-input placeholder="限制300个字符" :maxlength="300" type="textarea" v-model="studyForm.Describe"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitForm('studyForm')">加入</el-button>
    <el-button @click="closeEvent">取 消</el-button>
  </div>
</el-dialog>
</template>

<style scoped>
</style>
<script>
import mixin from '../../../../utils/mixin'
import { FETCH_CASE_ID_AND_NAME, PERSON_TO_CASE, CAR_TO_CASE } from '../../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      restaurants: [],
      state4: '',
      timeout: null,
      caseList: [],
      FocusType: 1,
      studyForm: {
        SrcId: '',
        CaseId: '',
        FocusId: '',
        Describe: ''
      }
    }
  },
  props: ['dialogStudy', 'object'],
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.FocusType = this.object.FocusType
      this.studyForm.SrcId = this.object.KeyId
      this.studyForm.FocusId = this.object.FocusId
    },
    /**
     * 重置表单
     */
    reset() {
      if (this.$refs['studyForm']) {
        this.$refs['studyForm'].resetFields()
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.reset()
      this.$emit('close')
    },
    submitForm(d) {
      if (this.FocusType === 1) {
        /**
         * [重点人员加入研判]
         * @param  {[type]} this.studyForm [description]
         * @return {[type]}      [description]
         */
        this.dispatch(PERSON_TO_CASE, {
          SrcId: this.studyForm.SrcId,
          CaseId: this.studyForm.CaseId,
          Describe: this.studyForm.Describe
        }).then(d => {
          this.$message('提交成功！')
          this.closeEvent()
          this.$emit('call:change-update')
        })
      } else {
        /**
         * [重点车辆加入研判]
         * @param  {[type]} this.studyForm [description]
         * @return {[type]}      [description]
         */
        this.dispatch(CAR_TO_CASE, {
          SrcId: this.studyForm.SrcId,
          CaseId: this.studyForm.CaseId,
          PlateNo: this.studyForm.FocusId,
          Describe: this.studyForm.Describe
        }).then(d => {
          this.$message('提交成功！')
          this.closeEvent()
          this.$emit('call:change-update')
        })
      }
    },
    /**
     * [querySearchAsync 异步获取案件名称]
     * @param  {[type]}   queryString [description]
     * @param  {Function} cb          [description]
     * @return {[type]}               [description]
     */
    querySearchAsync(queryString, cb) {
      this.dispatch(FETCH_CASE_ID_AND_NAME, { AJMC: this.state4 }).then(d => {
        this.caseList = this.caseInfo.fetchCaseIdAndName.map(d => {
          return {
            value: d.value,
            key: d.key
          }
        })
      })
      var results = this.caseList
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      this.studyForm.CaseId = item.key
    }
  },
  watch: {},
  mounted() {},
  created() {},
  computed: {
    ...mapState(['dict', 'focusPerson', 'caseInfo'])
  }
}
</script>
