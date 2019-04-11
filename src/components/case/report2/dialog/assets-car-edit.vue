<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="12">
          <el-form-item label="车主姓名" prop="name">
            <el-input v-model="editForm.name" placeholder="输入车主姓名" :maxlength="25"></el-input>
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
          <el-form-item label="现住地址" prop="address">
            <el-input v-model="editForm.address" placeholder="输入现住地址" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机动车牌号" prop="carLicence">
            <el-input v-model="editForm.carLicence" placeholder="输入机动车牌号" :maxlength="15"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="中文品牌" prop="brand">
            <el-input v-model="editForm.brand" placeholder="输入中文品牌" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆类型" prop="carModelCode">
            <el-select placeholder="请选择" v-model="editForm.carModelCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['JDCCLLXDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车身颜色" prop="carColorCode">
            <el-select placeholder="请选择" v-model="editForm.carColorCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['JDCCSYSDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="机动车状态" prop="carStateCode">
            <el-select placeholder="请选择" v-model="editForm.carStateCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['JDCZTDM']" style="width: 100%"></el-option>
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
    props: ['dialog', 'title', 'dataForm'],
    computed: {},
    data() {
      return {
        editForm: {}, // 表单数据对象
        // 表单验证
        editFormRules: {
          name: [
            { required: true, message: '不能为空' }
          ],
          //          IDCard: [
          //            {required: true, message: '不能为空'}
          //          ],
          carLicence: [
            { required: true, message: '不能为空' }
          ],
          carStateCode: [
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
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          name: '', // 车主
          IDCard: '', // 证件号码
          birthdate: '', // 出生日期
          address: '', // 车主住址
          carLicence: '', // 机动车牌号
          brand: '', // 中文品牌
          carModelCode: '', // 车辆类型代码
          carColorCode: '', // 车身颜色代码
          carStateCode: '', // 机动车状态代码
          sourceCode: '0'
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
            this.editForm.carModelText = this.editForm.carModelCode && this.dictLists['JDCCLLXDM'].find(r => r.value === this.editForm.carModelCode).label;
            this.editForm.carColorText = this.editForm.carColorCode && this.dictLists['JDCCSYSDM'].find(r => r.value === this.editForm.carColorCode).label;
            console.log(this.editForm.carColorText, this.editForm.carColorCode, this.dictLists['JDCCSYSDM'])
            this.editForm.carStateText = this.editForm.carStateCode && this.dictLists['JDCZTDM'].find(r => r.value === this.editForm.carStateCode).label;
            this.$emit('update:submit', this.editForm)
            this.isFormalSubmit = true
          } else {
            return false
          }
        })
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['JDCCLLXDM', 'JDCZTDM', 'JDCCSYSDM']).then(res => {
          this.dictLists = res
        })
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
