<template>
<el-dialog class="title-icon-edit" v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="(form.id === ''?'新增':'编辑')+'物品'" :modal-append-to-body="true" :append-to-body="true" :size="dialogLevel === 2?'bigest':'middle--fixed'" :modal="dialogLevel === 2?false:true"
  :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="peopleFormRef" :rules="peopleFormRules" :model="form" label-width="120px">
    <!-- id 插槽 -->
    <input v-model="form.id" type="hidden"></input>
    <!-- 编辑物品 -->
    <el-row class="form-box" :gutter="10">
      <el-row>
        <el-col :span="12">
          <el-form-item label="物品名称" prop="name">
            <el-input v-model="form.name" placeholder="输入涉案物品名称(20个字符内)" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物品类型" prop="itemType">
            <el-select placeholder="物品类型" v-model="form.itemType" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in itemTypeList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物品特征" prop="sign">
            <el-input v-model="form.sign" placeholder="输入物品特征(100个字符内)" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="涉案类型" prop="caseType">
            <el-select placeholder="涉案类型" v-model="form.caseType" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in involvedTypeList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="物品数量" prop="sl">
            <el-input type="number" v-model="form.sl" placeholder="输入物品数量" :min='0' :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="物品描述" prop="desc">
            <el-input v-model="form.desc" placeholder="输入物品描述(100个字符内)" :maxlength="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="涉案说明" prop="remark">
            <el-input type="textarea" v-model="form.remark" placeholder="描述限制50个字符" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit" :disabled="loading">确定</el-button>
  </div>
</el-dialog>
</template>
<style scoped>

</style>
<script>
import { mapState } from 'vuex'
import { GET_SYS_DICT_BY_TYPE } from '../../../store/types'
import mixin from '../../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      // 表单验证
      peopleFormRules: {
        name: [
          { required: true, message: '物品名称不能为空' }
        ],
        itemType: [
          { required: true, message: '物品类型不能为空' }
        ],
        caseType: [
          { required: true, message: '涉案类型不能为空' }
        ]
      },
      form: {},
      involvedTypeList: {}, // 涉案类型选项
      itemTypeList: {} // 涉案物品类型选项
    }
  },
  props: ['dialog', 'data', 'detail', 'dialogLevel'],
  computed: {
    ...mapState(['dict'])
  },
  methods: {
    initDialog() {
      // 初始化选项
      this.queryCluesTypeList()
      this.reset()
      this.form = {
        id: '',
        name: '',
        desc: '',
        remark: '',
        no: '',
        sign: '',
        itemType: '',
        caseType: ''
      }
      if(this.data !== null) {
        this.form = this.data
      }
    },
    closeEvent() {
      this.$emit('close')
    },
    queryCluesTypeList() {
      // 取字典表填充选项
      this.dispatch(GET_SYS_DICT_BY_TYPE, {
        DictType: 'SAWPLX' // 涉案物品类型
      }).then(_ => {
        this.involvedTypeList = this.dict.GetSysDictByType.map(d => {
          return {
            label: d.DictName,
            value: d.Code
          }
        })
      })
      this.dispatch(GET_SYS_DICT_BY_TYPE, {
        DictType: 'XZWPDM' // 物品类型
      }).then(_ => {
        this.itemTypeList = this.dict.GetSysDictByType.map(d => {
          return {
            label: d.DictName,
            value: d.Code
          }
        })
      })
    },
    submit() {
      this.$refs['peopleFormRef'].validate(vt => {
        if(vt) {
          // 翻译物品类型选择文本
          this.form.itemTypeText = ''
          for(let iu in this.itemTypeList) {
            if(this.itemTypeList[iu].value === this.form.itemType) {
              this.form.itemTypeText = this.itemTypeList[iu].label
            }
          }
          // 翻译涉案类型选择文本
          this.form.caseTypeText = ''
          for(let iu in this.involvedTypeList) {
            if(this.involvedTypeList[iu].value === this.form.caseType) {
              this.form.caseTypeText = this.involvedTypeList[iu].label
            }
          }
          this.$emit('form:submit', this.form)
        } else {
          return false
        }
      })
    },
    /**
     * 重置表单
     */
    reset() {
      if(this.$refs['peopleFormRef']) {
        this.$refs['peopleFormRef'].resetFields()
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
