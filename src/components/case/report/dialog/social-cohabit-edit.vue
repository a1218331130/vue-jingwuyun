<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
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
          <el-form-item label="出生日期" prop="birthdate">
            <el-date-picker v-model="editForm.birthdate" :editable="false" type="date" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
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
        <el-col :span="12">
          <el-form-item label="暂住地址" prop="temporaryAddress">
            <el-input v-model="editForm.temporaryAddress" placeholder="输入暂住地址" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来本地日期" prop="toLocalTime">
            <el-date-picker v-model="editForm.toLocalTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房主姓名" prop="houseOwnerName">
            <el-input v-model="editForm.houseOwnerName" placeholder="输入房主姓名" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="与房主关系" prop="houseOwnerRalation">
            <el-select placeholder="请选择与房主关系" v-model="editForm.houseOwnerRalation" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['SARYGXDM']" style="width: 100%"></el-option>
            </el-select>
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
//          ],
//          associatedSuspect: [
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
//          householdAddress: [
//            {required: true, message: '不能为空'}
//          ],
//          temporaryAddress: [
//            {required: true, message: '不能为空'}
//          ],
//          toLocalTime: [
//            {required: true, message: '不能为空'}
//          ],
//          houseOwnerRalation: [
//            {required: true, message: '不能为空'}
//          ],
//          houseOwnerName: [
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
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          name: '', // 姓名
          IDCard: '', // 证件号码

          sex: '0', // 性别代码
          householdNumber: '', // 户号
          birthdate: '', // 出生日期
          householdAddress: '', // 户籍详细地址
          temporaryAddress: '', // 暂住地址
          toLocalTime: '', // 来本地日期
          houseOwnerRalation: '', // 与房主关系
          houseOwnerName: '' // 房主姓名
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
            IDCard: _df.sfz, // 证件号码
            associatedSuspect: _df.xyrid, // 关联嫌疑人

            sex: _df.xbdm, // 性别代码
            householdNumber: _df.hh, // 户号
            birthdate: _df.csrq, // 出生日期
            householdAddress: _df.hjxxdz, // 户籍详细地址
            temporaryAddress: _df.zzdz, // 暂住地址
            toLocalTime: _df.lbdrq, // 来本地日期
            houseOwnerRalation: _df.yfzgx, // 与房主关系
            houseOwnerName: _df.fzxm // 房主姓名
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
        this.getDict(['SARYGXDM']).then(res => {
          this.dictLists = res
        })
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
