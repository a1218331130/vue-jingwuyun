<template>
<el-dialog v-draggable="dialogDraggableOptions"
           :visible.sync="dialog"
           title="来源"
           :modal-append-to-body="true"
           :append-to-body="true"
           size="middle--fixed"
           :modal="true"
           :close-on-click-modal="false"
           @open="initDialog"
           :before-close="closeEvent">

  <el-form>
    <el-form-item label="添加人">测试人员</el-form-item>
    <el-form-item label="添加时间">2017-08-26 12:20:31</el-form-item>
    <el-form-item label="描述说明">测试</el-form-item>
  </el-form>

  <div slot="footer"
       class="dialog-footer">
    <el-button type=""
               @click="closeEvent">关闭</el-button>
  </div>
</el-dialog>
</template>
<style scoped>
</style>
<script>
import mixin from '../../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {}
  },
  props: ['dialog'],
  computed: {},
  methods: {
    initDialog() {},
    closeEvent() {
      this.$emit('close')
    }
  },
  created() {

  },
  mounted() {}
}
</script>
}
</script>
