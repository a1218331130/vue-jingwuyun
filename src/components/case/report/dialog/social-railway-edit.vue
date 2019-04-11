<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="bigest" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="24">
          <el-form-item label="关联嫌疑人" prop="associatedSuspect" v-if="isGangs">
            <el-select placeholder="请选择案件当前状态" v-model="editForm.associatedSuspect" filterable style="width: 100%">
              <el-option :label="item.name" :value="item.id" :key="index"
                         v-for="(item,index) in theSuspectList" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" placeholder="输入姓名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号码" prop="IDCard">
            <el-input v-model="editForm.IDCard" placeholder="输入证件号码" :maxlength="18"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="票号" prop="ticketNumber">
            <el-input v-model="editForm.ticketNumber" placeholder="输入票号" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车次" prop="trains">
            <el-input v-model="editForm.trains" placeholder="输入车次" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发站" prop="startStation">
            <el-input v-model="editForm.startStation" placeholder="输入发站" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="到站" prop="arriveStation">
            <el-input v-model="editForm.arriveStation" placeholder="输入到站" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="乘车时间" prop="startTime">
            <el-date-picker v-model="editForm.startTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="到站时间" prop="arriveTime">
            <el-date-picker v-model="editForm.arriveTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="购票方式" prop="ticketMode">
            <el-input v-model="editForm.ticketMode" placeholder="输入购票方式" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="售票时间" prop="ticketTime">
            <el-date-picker v-model="editForm.ticketTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车厢号" prop="trainNo">
            <el-input v-model="editForm.trainNo" placeholder="输入起车厢号" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="席别" prop="seatLevel">
            <el-input v-model="editForm.seatLevel" placeholder="输入起席别" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="座位号" prop="seatNo">
            <el-input v-model="editForm.seatNo" placeholder="输入座位号" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="票种" prop="ticketType">
            <el-input v-model="editForm.ticketType" placeholder="输入票种" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="票价(元)" prop="fare">
            <el-input v-model="editForm.fare" placeholder="输入票价(元)" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="售票处" prop="ticketOffice">
            <el-input v-model="editForm.ticketOffice" placeholder="输入售票处" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="窗口" prop="seatWindow">
            <el-input v-model="editForm.seatWindow" placeholder="输入窗口" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="操作员" prop="operator">
            <el-input v-model="editForm.operator" placeholder="输入操作员" :maxlength="50"></el-input>
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
            {required: true, message: '不能为空'}
          ],
          IDCard: [
            {required: true, message: '不能为空'}
          ],
          associatedSuspect: [
            {required: true, message: '不能为空'}
          ],
          ticketNumber: [
            {required: true, message: '不能为空'}
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
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          name: '', // 姓名
          IDCard: '', // 证件号码
          ticketNumber: '', // 票号
          trains: '', // 车次
          startStation: '', // 发站
          arriveStation: '', // 到站
          startTime: '', // 乘车时间
          arriveTime: '', // 到站时间
          ticketMode: '', // 购票方式
          ticketTime: '', // 售票时间
          trainNo: '', // 车厢号
          seatLevel: '', // 席别
          seatNo: '', // 座位号
          ticketType: '', // 票种
          fare: '', // 票价(元)
          ticketOffice: '', // 售票处
          seatWindow: '', // 窗口
          operator: '' // 操作员
        }
        if (this.isGangs) {
          Object.assign(this.editForm, {
            associatedSuspect: this.theSuspectList[0].id // 关联嫌疑人
          })
        }
        if (this.dataForm) {
          let _df = this.dataForm
          this.editForm = {
            id: _df.id,
            name: _df.xm, // 姓名
            IDCard: _df.zjhm, // 证件号码
            associatedSuspect: _df.xyrid, // 关联嫌疑人
            ticketNumber: _df.ph, // 票号
            trains: _df.cc, // 车次
            startStation: _df.fz, // 发站
            arriveStation: _df.dz, // 到站
            startTime: _df.ccsj, // 乘车时间
            arriveTime: _df.dzsj, // 到站时间
            ticketMode: _df.gpfs, // 购票方式
            ticketTime: _df.spsj, // 售票时间
            trainNo: _df.cxh, // 车厢号
            seatLevel: _df.xb, // 席别
            seatNo: _df.zwh, // 座位号
            ticketType: _df.pz, // 票种
            fare: _df.pj, // 票价(元)
            ticketOffice: _df.spc, // 售票处
            seatWindow: _df.ck, // 窗口
            operator: _df.czy // 操作员
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
          if (vt) {
            // 确认提交
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
    created() {
    }
  }
</script>
