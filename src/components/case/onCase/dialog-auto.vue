<template>
  <el-dialog v-draggable="dialogDraggableOptions" title="自动串并案" :visible.sync="dialog" :close-on-click-modal="false" size="large--fixed" @open="initDialog" :before-close="closeEvent">
    <el-form :model="form" style="padding:0 10px;">
      <el-form-item>
        请选择自动串并依据
      </el-form-item>
      <el-table :data="list" :show-header="false">
        <el-table-column type="index" label="序号" align="center" width="60">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
</el-table-column>
<el-table-column label="标题" prop="title"></el-table-column>
<el-table-column label="启用" align="right">
  <template scope="scope">
            <el-switch v-model="scope.row.action" on-text="启用" off-text="停用" @change="updateValues"></el-switch>
          </template>
</el-table-column>
<el-table-column label="操作" align="center" width="200">
  <template scope="scope">
            <el-radio-group v-model="scope.row.necessary" :disabled="scope.row.action===false" @change="updateValues">
              <el-radio label="0">可选</el-radio>
              <el-radio label="1">必要</el-radio>
            </el-radio-group>
          </template>
</el-table-column>
<el-table-column label="操作" align="left" width="300">
  <template scope="scope">
            <field-input @input="getData" :time="startTimeVal" v-if="scope.row.field1!==''" v-model="scope.row.val1" :disabled="scope.row.action===false" :label="scope.row.field1" :type="scope.row.type1"></field-input>
            <field-input @input="getData" :time="endTimeVal" v-if="scope.row.field2!==''" v-model="scope.row.val2" :disabled="scope.row.action===false" :label="scope.row.field2" :type="scope.row.type2"></field-input>
          </template>
</el-table-column>
</el-table>
<el-form-item label="可选项中满足依据">
  <el-input-number v-model="form.conditionCount" :min="0" :max="maxCondition" style="width:120px;" placeholder=""></el-input-number>条的案件将自动串并案
</el-form-item>

<el-form-item label="自动串并截止日期">
  <el-date-picker v-model="form.endTimeVal" @change="val=> {form.endTime=val;vals= [...list.filter(d => d.action === true)]}" :picker-options="datePickerOptions" placeholder="请选择"></el-date-picker>
</el-form-item>

<el-form-item v-if="isAction" label="最后串并日期">
  {{lastRunTime}}
</el-form-item>
<el-form-item v-if="isAction" label="预计下一次运行时间" prop="nextRunTime">
  <el-row>
    <el-col :span="12">
      <!-- <el-date-picker v-model="form.nextRunTime" :picker-options="pickerOptions" type="datetime" style="width: 100%" placeholder="请选择下次运行时间"></el-date-picker> -->
      {{form.nextRunTime}}
    </el-col>
  </el-row>
</el-form-item>

</el-form-item>

</el-form>

<div slot="footer" class="dialog-footer">
  <el-button @click="cancel">取 消</el-button>
  <el-button v-if="isAction" @click="submit(false)">停止</el-button>
  <el-button type="primary" @click="submit(true)">保存并启动</el-button>
</div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { GET_AUTO_SERIES_CASE_INFO, ADD_AUTO_SERIES_CASE_START, UPDATE_AUTO_SERIES_CASE_STOP } from '../../../store/types'
  import { clone } from '../../../utils/util'
  import mixin from '../../../utils/mixin'
  import fieldInput from './field-input'
  export default {
    mixins: [mixin],
    components: { fieldInput },
    data() {
      return {
        isAction: false,
        datePickerOptions: {
          disabledDate: (time) => {
            return time.getTime() <= Date.now()
          }
        },
        lastRunTime: '',
        form: {
          conditionCount: 0,
          endTimeVal: '',
          endTime: '',
          nextRunTime: ''
        },
        defaultYjCountMin: '',
        endTimeVal: '',
        startTimeVal: '',
        list: [],
        vals: [],
        maxCondition: 1
      }
    },
    props: ['dialog', 'caseId', 'isEdit'],
    computed: {
      ...mapState(['seriesCase'])
    },
    watch: {},
    methods: {
      initDialog() {
        this.getCaseAutoInfo();
      },
      closeEvent(reload = false) {
        this.$emit('close', reload)
      },
      getData(val) {
        this.list.forEach(item => {
          if (item.title === '作案时间范围') {
            if (val.diff === item.field1) {
              item.val1 = val.time ? val.time : this.startTimeVal
            } else if (val.diff === item.field2) {
              item.val2 = val.time ? val.time : this.endTimeVal
            }
          }
        })
        this.vals = [...this.list.filter(d => d.action === true)];
      },
      submit(runNow = false) {
        if (runNow) {
          this.vals = ((this.defaultYjCountMin !== this.form.conditionCount && this.vals.length === 0) || !(this.isAction)) ? [...this.list.filter(d => d.action === true)] : this.vals
          let params = {
            PzMxs: this.vals.map(d => {
              return {
                ID: d.id,
                Val1: d.val1,
                Val2: d.val2,
                Sfby: d.necessary
              }
            }),
            ID: null,
            Ajid: this.caseId,
            Cbmc: null,
            Sfqy: '1', // !runNow ? '0' : '1',
            YjCountMin: this.form.conditionCount,
            Yxq: this.form.endTime,
            ly: '1'
            // ,
            // NextRunTime: this.dateFormat(new Date(this.form.nextRunTime), 'yyyy-MM-dd hh:mm:ss')
          }
          this.dispatch(ADD_AUTO_SERIES_CASE_START, params).then(() => {
            this.$message('新增并启动自动串案成功')
            this.closeEvent(true)
            this.isAction = true;
            this.vals.length = 0;
          })
        } else if (this.isAction === true) {
          this.dispatch(UPDATE_AUTO_SERIES_CASE_STOP, { Ajid: this.caseId }).then(() => {
            this.$message('停止自动串案成功')
            this.isAction = false
            this.closeEvent(true)
          })
        }
      },
      cancel() {
        this.closeEvent()
      },
      updateValues() {
        this.vals = [...this.list.filter(d => d.action === true)]
        this.maxCondition = this.vals.filter(d => d.necessary === '0').length
        if (this.form.conditionCount > this.maxCondition) this.form.conditionCount = this.maxCondition
      },
      getCaseAutoInfo() {
        this.dispatch(GET_AUTO_SERIES_CASE_INFO, { Ajid: this.caseId }).then(() => {
          let d = this.seriesCase.autoSeriesCaseInfo;
          if (!d) { return false };
          this.isAction = d.Sfqy === '1'
          this.lastRunTime = d.LastRunTime || '未执行'
          this.form.nextRunTime = d.NextRunTime ? this.dateFormat(new Date(d.NextRunTime), 'yyyy-MM-dd hh:mm:ss') : '暂无设置';
          if (d.Yxq !== '0001-01-01 00:00:00') {
            this.form.endTimeVal = new Date(d.Yxq);
            this.form.endTime = d.Yxq.split(' ')[0]
          } else {
            let nowDate = new Date(),
              subDate = new Date();
            subDate.setDate(nowDate.getDate() + 30);
            this.form.endTimeVal = subDate;
            this.form.endTime = subDate.getFullYear() + '-' + (subDate.getMonth() + 1) + '-' + subDate.getDate()
          }
          this.list = d.PzMxs.map(d => {
            if (d.Title === '作案时间范围') {
              this.startTimeVal = d.Val1;
              this.endTimeVal = d.Val2;
            }
            return {
              id: d.ID,
              action: d.Sfqy === '1',
              title: d.Title,
              desc: d.Content,
              field1: d.Field1,
              field2: d.Field2,
              type1: d.Type1,
              type2: d.Type2,
              isDel: d.IsDelete === '1',
              val1: d.Type1 === 'number' && !d.Val1 ? 1 : d.Val1,
              val2: d.Val2,
              necessary: d.Sfby || '0'
            }
          })
          this.maxCondition = this.list.filter(items => { return items.action && items.necessary === '0' }).length;
          this.form.conditionCount = d.YjCountMin;
          this.defaultYjCountMin = clone(d.YjCountMin);
        })
      }
    },
    created() {
      this.getCaseAutoInfo();
      this.pickerOptions['disabledDate'] = (time) => { return time.getTime() < new Date().getTime() }
    }
  }

</script>
