<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="主要业绩" :modal-append-to-body="false" :append-to-body="true" size="large" :modal="false" @open="initDialog" :before-close="closeEvent" style="width:700px;margin:0 auto">
  <el-form :model="form" ref="form" label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="标题" prop="title" style="width:100%">
          <el-input :maxlength="50" v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="机关单位" prop="company" style="width:100%">
          <el-input :maxlength="50" v-model="form.company" placeholder="请输入机关单位"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item prop="time" label="时间" style="width:100%">
          <el-date-picker v-model="form.time" placeholder="请输入时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item prop="decs" label="专业描述">
          <el-input type="textarea" v-model="form.decs" placeholder="请输入专业描述"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
// .el-dialog--full--auto {
//     width: 300px;
// }
.el-dialog {
    height: 300px;
    width: 300px;
}
</style>
<script>
import mixin from '../../../../utils/mixin'
import '../../../../utils/dateFormat'
export default {
  mixins: [mixin],
  components: {},
  props: ['dialog', 'value', 'mark'],
  data() {
    return {
      form: {
        time: '',
        company: '',
        title: '',
        decs: ''
      }
    }
  },
  computed: {},
  methods: {
    initDialog() {
      this.init = this.value
      if (this.init !== '') {
        this.form = {
          time: this.init.time,
          company: this.init.company,
          title: this.init.title,
          decs: this.init.decs,
          mark: this.mark
        }
      }
    },
    closeEvent() {
      this.$emit('close')
      this.form = {
        time: '',
        company: '',
        title: '',
        decs: ''
      }
      this.init = ''
    },
    submit() {
      this.getRightTime(this.form)
      if (this.init !== '') {
        this.$emit('remove', this.form)
      } else {
        this.$emit('workExp', this.form)
      }
      this.form = {
        time: '',
        company: '',
        title: '',
        decs: ''
      }
      this.$emit('close')
    },
    getRightTime(obj) {
      obj.time = this.dateFormat(new Date(obj.time), 'yyyy-MM-dd')
    }
  },
  watch: {},
  created() {},
  mounted() {}
}
</script>
