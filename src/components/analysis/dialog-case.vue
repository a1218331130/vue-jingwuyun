<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="选择案件" :modal-append-to-body="true" :append-to-body="true" size="small--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form :inline="true" label-width="100">
    <el-form-item prop="caseId" label="选择案件">
      <case-selector :width="170" @update:value="updateCase"></case-selector>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submit" :disabled="this.caseId===''">确认</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.case-selector {}
</style>
<script>
import mixin from '../../utils/mixin'
import caseSelector from '../../widgets/case-selector/case-selector'

export default {
  mixins: [mixin],
  components: {
    caseSelector
  },
  data: () => ({
    case: null,
    caseId: ''
  }),
  props: ['dialog'],
  methods: {
    initDialog() {
      this.case = null
      this.caseId = ''
    },
    closeEvent() {
      if (this.caseId === '') {
        this.$message({
          type: 'error',
          message: '必需选择一个案件作为分析入口',
          showClose: true
        })
      } else {
        this.$emit('update:case', this.case)
        this.$emit('update:caseId', this.caseId)
      }
    },
    submit() {
      this.closeEvent()
    },
    updateCase(val) {
      this.case = val
      this.caseId = val.caseId
    }
  }
}
</script>
