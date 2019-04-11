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
          <el-form-item label="曾用名" prop="formerName">
            <el-input v-model="editForm.formerName" placeholder="输入曾用名" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绰号" prop="nickname">
            <el-input v-model="editForm.nickname" placeholder="输入绰号" :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件名称" prop="caseName">
            <el-input v-model="editForm.caseName" placeholder="输入案件名称" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件编号" prop="caseNumber">
            <el-input v-model="editForm.caseNumber" placeholder="输入案件编号" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件类型" prop="caseType">
            <el-select placeholder="请选择" v-model="editForm.caseType" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['AJLBDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件性质" prop="caseNature">
            <el-select placeholder="请选择" v-model="editForm.caseNature" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['AJXZ']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="简要案情" prop="caseBrief">
            <el-input type="textarea" :rows="3" v-model="editForm.caseBrief" placeholder="输入简要案情"
                      :maxlength="300"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采集时间" prop="collectTime">
            <el-date-picker v-model="editForm.collectTime" :editable="false" type="datetime" style="width: 100%"
                            placeholder="请选择" :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采集人姓名" prop="collectName">
            <el-input v-model="editForm.collectName" placeholder="输入采集人姓名" :maxlength="25"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采集人警号" prop="collectPoliceNumber">
            <el-input v-model="editForm.collectPoliceNumber" placeholder="输入采集人警号" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="采集单位" prop="collectUnitCode">
            <el-select placeholder="请选择" v-model="editForm.collectUnitCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in unitList"></el-option>
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
        unitList: [], // 所属单位选择
        // 表单验证
        editFormRules: {
          name: [
            { required: true, message: '不能为空' }
          ],
          IDCard: [
            { required: true, message: '不能为空' }
            //          ],
            //          formerName: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          nickname: [
            //            {required: true, message: '不能为空'}
          ],
          caseName: [
            { required: true, message: '不能为空' }
            //          ],
            //          caseNumber: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          caseBrief: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          caseType: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          caseNature: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          collectUnitCode: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          collectTime: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          collectName: [
            //            {required: true, message: '不能为空'}
            //          ],
            //          collectPoliceNumber: [
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
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
        if (this.$refs['editFormRef']) this.$refs['editFormRef'].resetFields() // 重置表单
        this.editForm = {
          id: '',
          name: '',
          IDCard: '', // 证件号码
          formerName: '', // 曾用名
          nickname: '', // 绰号

          caseName: '', // 案件名称
          caseNumber: '', // 案件名称
          caseBrief: '', // 简要案情
          caseType: '', // 案件类别
          caseNature: '', // 案件性质
          collectUnitCode: '', // 采集单位代码
          collectTime: '', // 采集时间
          collectName: '', // 采集人姓名
          collectPoliceNumber: '' // 采集人警号
        }
        if (this.dataForm) {
          let _df = this.dataForm
          this.editForm = {
            id: _df.id,
            name: _df.xm,
            IDCard: _df.sfzhm, // 证件号码
            formerName: _df.cym, // 曾用名
            nickname: _df.ch, // 绰号

            caseName: _df.ajmc, // 案件名称
            caseNumber: _df.ajbh, // 案件名称
            caseBrief: _df.jyaq, // 简要案情
            caseType: _df.ajlb, // 案件类别
            caseNature: _df.ajxz, // 案件性质
            caseNatureText: _df.ajxzmc, // 案件性质
            collectUnitCode: _df.cjdwdm, // 采集单位代码
            collectTime: _df.cjsj, // 采集时间
            collectName: _df.cjrxm, // 采集人姓名
            collectPoliceNumber: _df.cjrjh // 采集人警号
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
            this.editForm.caseNatureText = this.editForm.caseNature && this.dictLists['AJXZ'].find(r => r.value === this.editForm.caseNature).label;
            this.editForm.caseTypeText = this.editForm.caseType && this.dictLists['AJLBDM'].find(r => r.value === this.editForm.caseType).label;
            this.editForm.collectUnitName = this.editForm.collectUnitCode && this.unitList.find(r => r.value === this.editForm.collectUnitCode).label;
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
        this.getDict(['AJLBDM', 'AJXZ']).then(res => {
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
