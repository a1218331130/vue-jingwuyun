<template>
<el-dialog v-draggable="dialogDraggableOptions" title="管控流转" :visible.sync="dialogControlFlow" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <el-form :model="form" ref="form" :rules="rules" label-width="120px">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="采集单位" prop="SqDept">
          <el-select :maxlength="50" @change="changeTree(form.SqDept)" v-model="form.SqDept" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in ruleDeptList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="管辖单位" prop="CollectDeptArr">
          <el-cascader :maxlength="50" :show-all-levels="false" :filterable="true" v-model="form.CollectDeptArr" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click"
            style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="指派说明" prop="Content">
          <el-input type="textarea" :maxlength="500" placeholder="限制500个字符" v-model="form.Content"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitForm('form')">加入</el-button>
    <el-button @click="closeEvent">取 消</el-button>
  </div>
</el-dialog>
</template>

<style scoped>
</style>
<script>
import mixin from '../../../../utils/mixin'
import { mapState } from 'vuex'
import { ADD_FOCUS_TRANSFER_PERSON, ADD_FOCUS_TRANSFER_CAR } from '../../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      FocusType: 1,
      ruleDeptList: [], // 采集单位[树列表]
      CollectDeptList: [], // 管辖单位[原始列表]
      form: {
        CollectDeptArr: [],
        name: '', // 重点人员名称
        Content: '', // 指派说明
        DxID: '', // 重点人员id
        LzDept: '', // 接收单位
        SqDept: '' // 申请单位
      },
      rules: {
        CollectDeptArr: [
          { type: 'array', required: true, message: '请选择接收单位', trigger: 'blur' }
        ],
        SqDept: [
          { required: true, message: '请选择接收人员', trigger: 'blur' }
        ],
        Content: [
          { required: true, message: '请输入指派说明', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['dialogControlFlow', 'object'],
  methods: {
    changeTree(keyId) {
      this.getRuleOrgTree(keyId).then(d => {
        this.CollectDeptList = d
      })
    },
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.form.DxID = this.object.KeyId
      this.FocusType = this.object.FocusType
      this.form.name = this.object.FocusName
      /**
       * 采集单位
       */
      /**
       * [getCascaderDict 获取单位列表]
       *
       * @return {[d[0]]} [原始数据列表]
       * @return {[d[1]]} [树列表]
       */
      this.ruleDeptList = this.userOrgInfo.orgList.map(c => {
        return {
          label: c.DeptName,
          value: c.KeyId,
          code: c.ParentId
        }
      })
      this.form.SqDept = this.userOrgInfo.mainOrgId
      this.changeTree(this.userOrgInfo.mainOrgId)
    },
    /**
     * 重置表单
     */
    reset() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.reset()
      this.$emit('close')
    },
    submitForm(d) {
      this.$refs[d].validate(v => {
        this.form.LzDept = this.form.CollectDeptArr[this.form.CollectDeptArr.length - 1]
        if (v) {
          if (this.FocusType === 1) {
            this.dispatch(ADD_FOCUS_TRANSFER_PERSON, this.form).then(d => {
              this.$message('提交成功！')
              this.closeEvent()
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(ADD_FOCUS_TRANSFER_CAR, this.form).then(d => {
              this.$message('提交成功！')
              this.closeEvent()
              this.$emit('call:change-update')
            })
          }
        } else {
          console.log('请求错误', v)
          return false
        }
      })
    }
  },
  watch: {},
  mounted() {},
  created() {},
  computed: {
    ...mapState(['dict', 'users', 'focusPerson'])
  }
}
</script>
