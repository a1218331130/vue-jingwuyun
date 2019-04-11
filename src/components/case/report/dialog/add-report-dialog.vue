<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'报告操作'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;" v-loading="initLoading">

    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="24">
          <el-form-item label="报告名称" prop="name">
            <el-input v-model="editForm.name" placeholder="输入报告名称" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="describe">
            <el-input type="textarea" placeholder="请输入报告描述" v-model="editForm.describe" :rows="5" :maxlength="200"
                      :disabled="editForm.fileUrlId === ''"></el-input>
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
  import {
    ADD_CASE_REPORT_VERSION
  } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {},
    props: ['dialog', 'title', 'dataForm'],
    computed: {},
    data() {
      return {
        initLoading: false,
        editForm: {}, // 表单数据对象
        caseId: '',
        // 表单验证
        editFormRules: {
          name: [
            {required: true, message: '不能为空'}
          ],
          describe: [
            {required: true, message: '不能为空'}
          ]
        }
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
          name: '', // 车主
          describe: '' // 描述
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
            this.$emit('update:submit', 0)
            this.initLoading = true
            // 确认提交
            this.dispatch(ADD_CASE_REPORT_VERSION, {
              bgmc: this.editForm.name, // 报告名称 必填
              ms: this.editForm.describe,    // 报告说明 必填
              ajid: this.caseId // 案件id，必填
            }).then(su => {
              this.$emit('update:submit', 1)
            }).catch(er => {
              this.$emit('update:submit', -1)
            })
          } else {
            return false
          }
        })
      },
      livePercentage(val, immediate) {
        let self = this
        if (immediate === true) {
          clearTimer()
          self.percentage = val
        } else {
          if (self.timer !== null) {
            clearTimer()
          } else {
            self.timer = setInterval(() => {
              let randomInt = parseInt((Math.random() * 5) + 1),
                setVal = self.percentage + randomInt
              if (setVal < val) {
                self.percentage = setVal
              } else {
                setVal = val
                self.percentage = setVal
                clearTimer()
              }
            }, parseInt((Math.random() * 2) + 1) * 300)
          }
        }

        function clearTimer() {
          clearInterval(self.timer)
          self.timer = null
        }
      }
    },
    watch: {},
    mounted() {
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
    }
  }
</script>
