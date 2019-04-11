<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title||'添加'"
             size="large--fixed" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
             style="text-align: left;">
    <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="150px">
      <el-row :gutter="10" style="margin: 10px 20px 10px 0;">
        <el-col :span="10">
          <el-form-item label="房产证号" prop="number">
            <el-input v-model="editForm.number" placeholder="输入房产证号" :maxlength="30"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房屋地址" prop="address">
            <el-input v-model="editForm.address" placeholder="输入房屋地址" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房屋用途" prop="use">
            <el-select placeholder="请选择" v-model="editForm.useCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['FWYTDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房屋类型" prop="type">
            <el-select placeholder="请选择" v-model="editForm.typeCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['FWLBDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="住房面积" prop="area">
            <el-input v-model="editForm.area" placeholder="输入住房面积（㎡）" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="市场价值" prop="marketPrice">
            <el-input v-model="editForm.marketPrice" placeholder="输入市场价值" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房主姓名" prop="nowBelongsPeople">
            <el-input v-model="editForm.nowBelongsPeople" placeholder="房主姓名" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="房主证件号码" prop="nowBelongsPeopleIDCard">
            <el-input v-model="editForm.nowBelongsPeopleIDCard" placeholder="输入房主证件号码" :maxlength="18"></el-input>
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
          address: [
            { required: true, message: '不能为空' }
          ],
          nowBelongsPeople: [
            { required: true, message: '不能为空' }
          ],
          nowBelongsPeopleIDCard: [
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
          number: '', // 产权证_证件号码 房产证号
          address: '', // 房屋地址 地址
          use: '', // 用途_简要情况 房屋用途
          useCode: '', // 用途_简要情况 房屋用途
          type: '', // 房屋类型 房屋类型
          typeCode: '', // 房屋类型 房屋类型
          area: '', // 建筑面积_面积（平方米) 住房面积
          nowBelongsPeople: '', // 现权利人_姓名
          nowBelongsPeopleIDCard: '', // 现权利人_证件号码
          marketPrice: '', // 市场价值
          sourceCode: 0
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
            this.editForm.type = this.editForm.typeCode && this.dictLists['FWLBDM'].filter(fr => fr.value === this.editForm.typeCode)[0].label
            this.editForm.use = this.editForm.useCode && this.dictLists['FWYTDM'].filter(fr => fr.value === this.editForm.useCode)[0].label
            this.$emit('update:submit', this.editForm)
            this.isFormalSubmit = true
          } else {
            return false
          }
        })
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['FWYTDM', 'FWLBDM']).then(res => {
          this.dictLists = res
        })
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
