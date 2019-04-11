<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'报告操作'" size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" style="text-align: left;">

  <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
    <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
      <el-col :span="24">
        <el-form-item label="报告名称" prop="name">
          <el-input v-model="editForm.name" placeholder="输入报告名称" :maxlength="25"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="描述" prop="describe">
          <el-input type="textarea" placeholder="请输入报告描述" v-model="editForm.describe" :rows="5" :maxlength="200" :disabled="editForm.fileUrlId === ''"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="是否共享" v-if="checkList.length >0">
      <el-switch v-model="editForm.isshare" on-text="是" on-value="1" off-text="否" off-value="0" ></el-switch>
    </el-form-item>
    <el-form-item label="选择共享人" v-show="parseInt(editForm.isshare) === 1">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-model= "checkListId" @change="handleCheckedPerson">
        <el-checkbox  v-for="item in checkList" :key="item.id" name="1" :label="item.id">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>

<style lang="scss" scoped>
  body {}

</style>

<script>
  import mixin from '../../../../utils/mixin'
  import { getAdminUser } from '../../../../utils/storage'
  import { mapState } from 'vuex'
  import {
    ADD_CASE_REPORT_VERSION,
    FECTH_QUERY_BARY_LIST
  } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {},
    props: ['dialog', 'title', 'dataForm'],
    computed: {
      ...mapState(['familyMenbers', 'users'])
    },
    data() {
      return {
        editForm: {}, // 表单数据对象
        checkList: [],
        checkListId: [],
        caseId: '',
        isIndeterminate: false,
        checkAll: false,
        // 表单验证
        editFormRules: {
          name: [
            { required: true, message: '不能为空' }
          ],
          describe: [
            { required: true, message: '不能为空' }
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
        this.fetchBaryList(this.caseId)
        this.editForm = {
          id: '',
          name: '', // 车主
          describe: '', // 描述
          isshare: 0
        }
      },
      handleCheckAllChange(event) {
        this.checkListId = event.target.checked ? this.checkList.map(item => { return item.id }) : []
        this.isIndeterminate = false;
      },
      handleCheckedPerson(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.checkList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length
      },
      fetchBaryList(val) {
        this.dispatch(FECTH_QUERY_BARY_LIST, { ajid: this.caseId }).then(su => {
          let list = this.familyMenbers.fecthQueryBaryListResult
          this.checkList = list.length > 0 ? list.filter(item => { return item.USER_ID !== getAdminUser().userId }).map(item => {
            return { id: item.USER_ID, label: item.MC }
          }) : [];
        })
      },
      /**
       * 关闭弹窗触发
       */
      closeEvent() {
        this.$emit('close')
      },
      submit() {
        this.$refs['editFormRef'].validate(vt => {
          if (this.editForm.isshare === 0) {
            this.checkListId = []
          }
          if (vt) {
            this.$emit('update:submit', 0)
            // 确认提交
            this.dispatch(ADD_CASE_REPORT_VERSION, {
              bgmc: this.editForm.name, // 报告名称 必填
              ms: this.editForm.describe, // 报告说明 必填
              ajid: this.caseId, // 案件id，必填
              gxry: this.checkListId.join() // 共享办案人员
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
    watch: {
      'editForm.isshare': {
        handler: function(newVal, oldVal) {
          console.log(newVal, 'newVal')
        },
        deep: true
      }
    },
    mounted() {

    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
    }
  }

</script>
