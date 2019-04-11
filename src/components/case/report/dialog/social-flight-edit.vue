<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'" size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" style="text-align: left;">
  <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
    <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
      <el-col :span="24">
        <el-form-item label="关联嫌疑人" prop="associatedSuspect" v-if="isGangs">
          <el-select placeholder="请选择案件当前状态" v-model="editForm.associatedSuspect" filterable style="width: 100%">
            <el-option :label="item.name" :value="item.id" :key="index" v-for="(item,index) in theSuspectList" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="输入姓名" :maxlength="25"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="证件号码" prop="IDCard">
          <el-input v-model="editForm.IDCard" placeholder="输入证件号码" :maxlength="18"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="航空" prop="airlines">
          <el-input v-model="editForm.airlines" placeholder="输入航空" :maxlength="25"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="机场" prop="airfield">
          <el-input v-model="editForm.airfield" placeholder="输入机场" :maxlength="25"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="起飞地点" prop="takeOffSite">
          <el-input v-model="editForm.takeOffSite" placeholder="输入起飞地点" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="落地地点" prop="landingSite">
          <el-input v-model="editForm.landingSite" placeholder="输入落地地点" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="起飞地机场" prop="takeOffSiteAirfield">
          <el-input v-model="editForm.takeOffSiteAirfield" placeholder="输入起飞地机场" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="落地地机场" prop="landingSiteAirfield">
          <el-input v-model="editForm.landingSiteAirfield" placeholder="输入落地地机场" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="起飞时间" prop="takeOffTime">
          <el-date-picker v-model="editForm.takeOffTime" :editable="false" type="datetime" style="width: 100%" placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="到达时间" prop="landingTime">
          <el-date-picker v-model="editForm.landingTime" :editable="false" type="datetime" style="width: 100%" placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="订票时间" prop="bookingTime">
          <el-date-picker v-model="editForm.bookingTime" :editable="false" type="datetime" style="width: 100%" placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
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
Error: Source sample is missing.
</style>

<script>
import mixin from '../../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {},
  props: ['dialog', 'title', 'dataForm', 'isGangs', 'theSuspectList'],
  computed: {},
  data() {
    return {
      editForm: {}, // 表单数据对象
      // 表单验证
      editFormRules: {
        name: [
          { required: true, message: '不能为空' }
//          ],
//          IDCard: [
//            {required: true, message: '不能为空'}
          ],
        associatedSuspect: [
          { required: true, message: '不能为空' }
          ],
        airlines: [
          { required: true, message: '不能为空' }
//          ],
//          airfield: [
//            {required: true, message: '不能为空'}
//          ],
//          takeOffSite: [
//            {required: true, message: '不能为空'}
//          ],
//          landingSite: [
//            {required: true, message: '不能为空'}
//          ],
//          takeOffSiteAirfield: [
//            {required: true, message: '不能为空'}
//          ],
//          landingSiteAirfield: [
//            {required: true, message: '不能为空'}
//          ],
//          takeOffTime: [
//            {required: true, message: '不能为空'}
//          ],
//          landingTime: [
//            {required: true, message: '不能为空'}
//          ],
//          bookingTime: [
//            {required: true, message: '不能为空'}
          ]
      },
      disabledDateFun: { // 出生日期选择范围
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dictLists: [] // 字典集合
    }
  },
  methods: {
    /**
     * 弹窗初始化
     */
    initDialog() {
      if(this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
      this.editForm = {
        id: '',
        name: '', // 姓名
        IDCard: '', // 证件号码
        airlines: '',
        airfield: '',
        takeOffSite: '',
        landingSite: '',
        takeOffSiteAirfield: '',
        landingSiteAirfield: '',
        bookingTime: '',
        takeOffTime: '',
        landingTime: ''
      }
      if(this.isGangs) {
        Object.assign(this.editForm, {
          associatedSuspect: this.theSuspectList[0].id // 关联嫌疑人
        })
      }
      if(this.dataForm) {
        let _df = this.dataForm
        this.editForm = {
          id: _df.id,
          name: _df.xm, // 姓名
          IDCard: _df.zjhm, // 证件号码
          associatedSuspect: _df.xyrid, // 关联嫌疑人
          airlines: _df.hk,
          airfield: _df.jc,
          takeOffSite: _df.qfdd,
          landingSite: _df.lddd,
          takeOffSiteAirfield: _df.qfdjc,
          landingSiteAirfield: _df.lddjc,
          bookingTime: _df.dpsj,
          takeOffTime: _df.qfsj,
          landingTime: _df.ddsj
        }
      }
    },
    /**
     * 关闭弹窗触发
     */
    closeEvent() {
      this.$emit('close')
    },
    submit() {
      this.$refs['editFormRef'].validate(vt => {
        if(vt) {
          // 确认提交
          this.$alert('12345648874', 'title', {
            confirmButtonText: 'confirm',
            callback: action => {

            }
          });
          this.$emit('update:submit', this.editForm)
          this.isFormalSubmit = true
        } else {
          return false
        }
      })
    },
    queryDictType() {
      //  表单字典初始化
      //        this.getDict(['SARYGXDM']).then(res => {
      //          this.dictLists = res
      //        })
    }
  },
  watch: {},
  mounted() {
    this.queryDictType()
  },
  created() {}
}
</script>
