<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="editForm.name" placeholder="输入姓名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="IDCard" :rules="[{required: true, message: '必须输入证件号码'},{pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确', trigger: 'blur'}]">
            <el-input v-model="editForm.IDCard" placeholder="输入证件号码" :maxlength="18" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birthdate">
            <el-date-picker v-model="editForm.birthdate" :editable="false" type="date" style="width: 100%"placeholder="请选择":picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="editForm.sex">
              <el-radio label="0">未知</el-radio>
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="户号" prop="householdNumber">
            <el-input v-model="editForm.householdNumber" placeholder="输入户号" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="辖区单位" prop="PSBCode">
            <el-select placeholder="请选择" v-model="editForm.PSBCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in unitList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="现住址" prop="address">
            <el-input v-model="editForm.address" placeholder="输入现住址" :maxlength="50"></el-input>
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
  import { mapState } from 'vuex'
  import {
    GET_DEPT_DICTS_LIST
  } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {},
    props: ['dialog', 'title', 'dataForm'],
    computed: {
      ...mapState(['dict'])
    },
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
            //          ],
            //          sex: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          householdNumber: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          birthdate: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          address: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          PSBCode: [
            //            {required: true, message: '不能为空'}
          ]
        },
        disabledDateFun: { // 出生日期选择范围
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        unitList: [], // 单位
        dictLists: [] // 字典集合
      }
    },
    methods: {
      /**
       * 弹窗初始化
       */
      initDialog() {
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          name: '',
          IDCard: '', // 证件号码
          sex: '0', // 性别代码
          birthdate: '', // 出生日期
          address: '', // 现住址
          householdNumber: '', // 户号
          PSBCode: '' // 公安局代码
        }
        if (this.dataForm) {
          let _df = this.dataForm
          this.editForm = {
            id: _df.id,
            name: _df.xm,
            IDCard: _df.zjhm, // 证件号码
            sex: _df.xbdm, // 性别代码
            birthdate: _df.csrq, // 出生日期
            address: _df.xzz, // 现住址
            householdNumber: _df.hh, // 户号
            PSBCode: _df.gajdm // 公安局代码
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
            this.editForm.PSBName = this.editForm.PSBCode && this.unitList.find(r => r.value === this.editForm.PSBCode).label
            this.$emit('update:submit', this.editForm)
            this.isFormalSubmit = true
          } else {
            return false
          }
        })
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['SARYGXDM']).then(res => {
          this.dictLists = res
        })
        // 取字典表填充选项
        this.dispatch(GET_DEPT_DICTS_LIST).then(_ => { // 所属单位选择
          this.unitList = this.dict.GetDeptDictsList.map(d => {
            return {
              label: d.DictName,
              value: d.KeyId
            }
          })
        })
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
