<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="学历情况" :modal-append-to-body="true" :append-to-body="true" size="large" :modal="false" @open="initDialog" :before-close="closeEvent" style="width:700px;margin:0 auto">
  <el-form :model="form" ref="form" label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="beginTime" label="入学时间" style="width:100%">
          <el-date-picker v-model="form.beginTime" placeholder="请输入入学时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="endTime" label="毕业时间" style="width:100%;margin-left:10px">
          <el-date-picker v-model="form.endTime" placeholder="请输入毕业时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="学校" prop="school" style="width:100%">
          <el-input :maxlength="50" v-model="form.school" placeholder="请输入所在学校"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="学历" prop="education" style="width:100%;margin-left:10px">
          <el-input :maxlength="50" v-model="form.education" placeholder="请输入学历"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="专业" prop="major">
          <el-input :maxlength="50" v-model="form.major" placeholder="请输入专业"></el-input>
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
        beginTime: '',
        endTime: '',
        school: '',
        education: '',
        major: '',
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
          beginTime: this.init.beginTime,
          endTime: this.init.endTime,
          school: this.init.school,
          education: this.init.education,
          major: this.init.major,
          decs: this.init.decs,
          mark: this.mark
        }
      }
    },
    closeEvent() {
      this.$emit('close')
      this.form = {
        beginTime: '',
        endTime: '',
        school: '',
        education: '',
        major: '',
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
      this.$emit('close')
      this.form = {
        beginTime: '',
        endTime: '',
        school: '',
        education: '',
        major: '',
        decs: ''
      }
    },
    getRightTime(obj) {
      obj.beginTime = this.dateFormat(new Date(obj.beginTime), 'yyyy-MM-dd')
      obj.endTime = this.dateFormat(new Date(obj.endTime), 'yyyy-MM-dd')
    }
  },
  watch: {},
  created() {},
  mounted() {}
}
</script>
