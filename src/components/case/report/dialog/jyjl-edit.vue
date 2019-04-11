<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="12">
          <el-form-item label="开户名" prop="khm">
            <el-input v-model="editForm.khm" placeholder="输入开户名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="sfzhm">
            <el-input v-model="editForm.sfzhm" placeholder="输入开户身份证号" :maxlength="18"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主帐号" prop="zzh">
            <el-input v-model="editForm.zzh" placeholder="输入主帐号" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号所属行" prop="zzhssh">
            <el-input v-model="editForm.zzhssh" placeholder="输入主账号所属行" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易卡号" prop="jykh">
            <el-input v-model="editForm.jykh" placeholder="输入交易卡号" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方帐号" prop="zzh">
            <el-input v-model="editForm.dfzh" placeholder="输入对方帐号" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方开户名" prop="dfkhm">
            <el-input v-model="editForm.dfkhm" placeholder="输入对方开户名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对方帐号所属行" prop="dfzhssh">
            <el-input v-model="editForm.dfzhssh" placeholder="输入对方帐号所属行" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易时间" prop="jysj">
            <el-date-picker v-model="editForm.jysj" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易类型" prop="jylx">
            <el-select placeholder="请选择" v-model="editForm.jylx" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['JYLX']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易金额" prop="jyje">
            <el-input v-model="editForm.jyje" placeholder="输入交易金额" type="number"
                      @blur="jyjeChange"
                      :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="摘要信息" prop="zy">
            <el-input v-model="editForm.zy" placeholder="输入摘要信息" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="即时余额" prop="jsye">
            <el-input v-model="editForm.jsye" placeholder="输入即时余额" type="number"
                      @blur="jsyeChange"
                      :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易网点代码" prop="jywddm">
            <el-input v-model="editForm.jywddm" placeholder="输入交易网点代码" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="交易网点名称" prop="jywdmc">
            <el-input v-model="editForm.jywdmc" placeholder="输入交易网点名称" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="交易备注" prop="bz">
            <el-input type="textarea" v-model="editForm.bz" placeholder="输入交易备注" :maxlength="100"></el-input>
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
    props: ['dialog', 'title', 'dataForm'],
    computed: {},
    data() {
      return {
        editForm: {}, // 表单数据对象
        // 表单验证
        editFormRules: {
          khm: [
            {required: true, message: '不能为空'}
          ], // 开户名
          sfzhm: [
            {required: true, message: '不能为空'}
          ], // 身份证号码
          zzh: [
            {required: true, message: '不能为空'}
          ], // 主帐号
          zzhssh: [
            {required: true, message: '不能为空'}
          ], // 主账号所属行
          jykh: [
            {required: true, message: '不能为空'}
          ], // 交易卡号
          dfzh: [
            {required: true, message: '不能为空'}
          ], // 对方账号
          dfzhssh: [
            {required: true, message: '不能为空'}
          ], // 对方账号所属行
          jysj: [
            {required: true, message: '不能为空'}
          ], // 交易时间
          jylx: [
            {required: true, message: '不能为空'}
          ], // 交易类型  （字典表类型：JYLX）
          jyje: [
            {required: true, message: '不能为空'}
          ], // 交易金额
//          zy: [
//            {required: true, message: '不能为空'}
//          ], // 摘要
          dfkhm: [
            {required: true, message: '不能为空'}
          ], // 对方开户名
          jsye: [
            {required: true, message: '不能为空'}
          ], // 即时余额
          jywddm: [
            {required: true, message: '不能为空'}
          ], // 交易网点代码
          jywdmc: [
            {required: true, message: '不能为空'}
          ] // , // 交易网点名称
//          bz: [
//            {required: true, message: '不能为空'}
//          ] // 交易备注信息
        },
        disabledDateFun: {
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
          id: '', // 账单guid
          khm: '', // 开户名
          sfzhm: '', // 身份证号码
          zzh: '', // 主帐号
          zzhssh: '', // 主账号所属行
          jykh: '', // 交易卡号
          dfzh: '', // 对方账号
          dfzhssh: '', // 对方账号所属行
          jysj: '', // 交易时间
          jylx: '', // 交易类型  （字典表类型：JYLX）
          jyje: '', // 交易金额
          zy: '', // 摘要
          dfkhm: '', // 对方开户名
          jsye: '', // 即时余额
          jywddm: '', // 交易网点代码
          jywdmc: '', // 交易网点名称
          bz: '' // 交易备注信息
        }
        if (this.dataForm) {
          this.editForm = this.dataForm
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
        this.getDict(['JYLX']).then(res => {
          this.dictLists = res
        })
      },
      /**
       * 金额保留两位数小数
       */
      jsyeChange() {
        this.editForm.jsye = parseFloat(this.editForm.jsye).toFixed(2)
      },
      /**
       * 金额保留两位数小数
       */
      jyjeChange() {
        this.editForm.jyje = parseFloat(this.editForm.jyje).toFixed(2)
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
