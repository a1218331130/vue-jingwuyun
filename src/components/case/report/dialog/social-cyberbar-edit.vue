<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="24">
          <el-form-item label="关联嫌疑人" prop="associatedSuspect" v-if="isGangs">
            <el-select placeholder="请选择相关嫌疑人" v-model="editForm.associatedSuspect" filterable style="width: 100%">
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
          <el-form-item label="网吧编码" prop="internetBarCode">
            <el-input v-model="editForm.internetBarCode" placeholder="输入网吧编码" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网吧名称" prop="internetBarName">
            <el-input v-model="editForm.internetBarName" placeholder="输入网吧名称" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="网吧地址" prop="internetBarAddress">
            <el-input v-model="editForm.internetBarAddress" placeholder="输入网吧地址" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上网时间" prop="onlineStartTime">
            <el-date-picker v-model="editForm.onlineStartTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下线时间" prop="onlineEndTime">
            <el-date-picker v-model="editForm.onlineEndTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
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
            { required: true, message: '不能为空' }
            //          ],
            //          IDCard: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          associatedSuspect: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          internetBarCode: [
            //            {required: true, message: '不能为空'}
          ],
          internetBarName: [
            { required: true, message: '不能为空' }
            //          ],
            //          internetBarAddress: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          onlineStartTime: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          onlineEndTime: [
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
          internetBarCode: '', // 网吧编码
          internetBarName: '', // 网吧名称
          internetBarAddress: '', // 网吧地址
          onlineStartTime: '', // 上网时间
          onlineEndTime: '' // 下线时间
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
            internetBarCode: _df.wbbm, // 网吧编码
            internetBarName: _df.wbmc, // 网吧名称
            internetBarAddress: _df.wbdz, // 网吧地址
            onlineStartTime: _df.swsj, // 上网时间
            onlineEndTime: _df.xxsj // 下线时间
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
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
