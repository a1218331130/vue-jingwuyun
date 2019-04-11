<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'" size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" style="text-align: left;">
  <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
    <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
      <el-col :span="24">
        <el-form-item label="关联嫌疑人" prop="associatedSuspect" v-if="isGangs">
          <el-select placeholder="请选择嫌疑人" v-model="editForm.associatedSuspect" filterable style="width: 100%">
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
        <el-form-item label="证件号码" prop="IDCard":rules="[{required: true, message: '必须输入证件号码'},{pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确', trigger: 'blur'}]">
          <el-input v-model="editForm.IDCard" placeholder="输入证件号码" :maxlength="18" ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="旅馆编码" prop="hotelCode">
          <el-input v-model="editForm.hotelCode" placeholder="旅馆编码" :maxlength="25"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="旅馆名称" prop="hotelName">
          <el-input v-model="editForm.hotelName" placeholder="输入旅馆名称" :maxlength="25"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="旅馆地址" prop="hotelAddress">
          <el-input v-model="editForm.hotelAddress" placeholder="输入旅馆地址" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入住房号" prop="hotelRoomNumber">
          <el-input v-model="editForm.hotelRoomNumber" placeholder="输入入住房号" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="入住时间" prop="hotelCheckinTime">
          <el-date-picker v-model="editForm.hotelCheckinTime" :editable="false" type="datetime" style="width: 100%" placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="退房时间" prop="hotelCheckoutTime">
          <el-date-picker v-model="editForm.hotelCheckoutTime" :editable="false" type="datetime" style="width: 100%" placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
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
          ],
          hotelName: [
            { required: true, message: '不能为空' }
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
          hotelCode: '', // 旅馆编码
          hotelName: '', // 旅馆名称
          hotelAddress: '', // 旅馆地址
          hotelRoomNumber: '', // 入住房号
          hotelCheckinTime: '', // 入住时间
          hotelCheckoutTime: '' // 退房时间
        }
        console.log(this.theSuspectList, 3333);
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
            hotelCode: _df.lgbm, // 旅馆编码
            hotelName: _df.lgmc, // 旅馆名称
            hotelAddress: _df.lgdz, // 旅馆地址
            hotelRoomNumber: _df.rzfh, // 入住房号
            hotelCheckinTime: _df.rzsj, // 入住时间
            hotelCheckoutTime: _df.tfsj // 退房时间
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
            console.log(this.editForm, 45646);
            this.$emit('update:submit', this.editForm)
            this.isFormalSubmit = true
            console.log(11111111111);
          } else {
            return false
          }
        })
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
