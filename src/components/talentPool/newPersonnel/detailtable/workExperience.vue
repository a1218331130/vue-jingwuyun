<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="工作经历录入" :modal-append-to-body="false" :append-to-body="true" size="large" :modal="false" @open="initDialog" :before-close="closeEvent" style="width:700px;margin:0 auto">
  <el-form :model="form" ref="form" label-width="80px">
    <el-row>
      <el-col :span="12">
        <el-form-item prop="startTime" label="开始时间" style="width:100%">
          <el-date-picker v-model="form.startTime" placeholder="请输入开始时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="endTime" label="结束时间" style="width:100%;margin-left:10px">
          <el-date-picker v-model="form.endTime" placeholder="请输入开始时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="单位" prop="company" style="width:100%">
          <el-input :maxlength="50" v-model="form.company" placeholder="请输入所在单位"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="部门" prop="department" style="width:100%;margin-left:10px">
          <el-input :maxlength="50" v-model="form.department" placeholder="请输入所在部门"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="职务" prop="dept">
          <el-input :maxlength="50" v-model="form.dept" placeholder="请输入当前职务"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item prop="jobcontent" label="工作内容">
          <el-input type="textarea" v-model="form.jobcontent" placeholder="请输入工作内容"></el-input>
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
      init: '',
      form: {
        startTime: '',
        endTime: '',
        company: '',
        department: '',
        dept: '',
        jobcontent: '',
        mark: ''
      }
    }
  },
  computed: {},
  methods: {
    initDialog() {
      this.init = this.value
      console.log(this.init)
      if (this.init !== '') {
        this.form = {
          startTime: this.init.startTime,
          endTime: this.init.endTime,
          company: this.init.company,
          department: this.init.department,
          dept: this.init.dept,
          jobcontent: this.init.jobcontent,
          mark: this.mark
        }
      }
    },
    closeEvent() {
      this.$emit('close')
      this.form = {
        startTime: '',
        endTime: '',
        company: '',
        department: '',
        dept: '',
        jobcontent: '',
        mark: ''
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
        startTime: '',
        endTime: '',
        company: '',
        department: '',
        dept: '',
        jobcontent: ''
      }
      this.$emit('close')
    },
    getRightTime(obj) {
      obj.startTime = this.dateFormat(new Date(obj.startTime), 'yyyy-MM-dd')
      obj.endTime = this.dateFormat(new Date(obj.endTime), 'yyyy-MM-dd')
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  },
  watch: {
    // 'value' (val) {
    //   if (val) {
    //     this.init = val
    //   }
    // }
  },
  created() {},
  mounted() {}
}
</script>
