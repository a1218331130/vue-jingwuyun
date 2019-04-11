<template>
<el-dialog v-draggable="dialogDraggableOptions" title="签收" :visible.sync="dialogSign" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <el-form :model="form" ref="form" :rules="rules" label-width="100px">
    <!-- <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="指派来源">
            长沙县泉塘派出所
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="指派人员">
            刘队&nbsp;|&nbsp;13678946321
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="被指派对象">
            张二狗&nbsp;|&nbsp;452363198801011234
          </el-form-item>
        </el-col>
      </el-row> -->
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="签收情况" prop="State">
          <el-radio-group v-model="form.State">
            <el-radio label="1" value='1'>签收</el-radio>
            <el-radio label="2" value='2'>退回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="签收意见" prop="AcceptNote">
          <el-input type="textarea" :maxlength="300" placeholder="限制300个字符" v-model="form.AcceptNote"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  </div>
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
import { UPDATE_ACCEPT_TRANSFER } from '../../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      form: {
        KeyId: '',
        State: '1',
        AcceptNote: ''
      },
      rules: {
        AcceptNote: [
          { required: true, message: '请输入指派接收单位', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['dialogSign', 'keyId'],
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.form.KeyId = this.keyId
    },
    /**
     * 重置表单
     */
    reset() {
      if(this.$refs['form']) {
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
      // this.dialog = false
    },
    submitForm(d) {
      this.$refs[d].validate(v => {
        if(v) {
          this.dispatch(UPDATE_ACCEPT_TRANSFER, this.form).then(d => {
            this.$message('提交成功！')
            this.closeEvent()
            this.$emit('call:change-update')
          })
        } else {
          return false
        }
      })
    }
  },
  watch: {},
  mounted() {},
  created() {},
  computed: {
    ...mapState(['focusPersonAndCar'])
  }
}
</script>
