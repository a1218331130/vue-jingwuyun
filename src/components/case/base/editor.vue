<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="修改" :modal-append-to-body="true"
             :append-to-body="true" size="large--fixed"
             :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-form v-if="editForm!==null" ref="knowEditForm" :model="data" label-width="120px">
      <input type="hidden" v-model="editForm.id"/>
      <el-row :gutter="10" style="margin: 0 20px 0 0">
        <el-col :span="12">
          <el-form-item label="案件编号">
            <span class="hover-menu" data-type="case">{{editForm.caseNumber}}</span>
            <!--<el-input v-model="editForm.caseNumber" placeholder="请选择案件编号" disabled></el-input>-->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件名称">
            <el-input v-model="editForm.caseName" placeholder="输入案件名称(50个字符内)" :maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件状态">
            <el-select placeholder="请选择案件当前状态" v-model="editForm.caseStatusCode" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['XZAJZT']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报案时间">
            <el-date-picker v-model="editForm.createdTime" type="datetime" style="width: 100%" placeholder="报案时间"
                            :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发案地点">
            <el-input placeholder="请输入发案地点(100个字符内)" :maxlength="100" v-model="editForm.area"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="案件类别">
            <el-select placeholder="请选择案件类别" v-model="editForm.caseType" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['AJLBDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作案特点">
            <el-select placeholder="请选择作案手段" v-model="editForm.means" filterable style="width: 100%">
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in dictLists['ZATDDM']" style="width: 100%"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="受理单位">
            <el-select placeholder="请选择受理单位" v-model="editForm.unit" filterable style="width: 100%" v-loading="loading"> 
              <el-option :label="item.label" :value="item.value" :key="index"
                         v-for="(item,index) in unitList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发案时间上限">
            <el-date-picker v-model="editForm.startTime" type="datetime" style="width: 100%" placeholder="发案时间上限"
                            :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发案时间下限">
            <el-date-picker v-model="editForm.endTime" type="datetime" style="width: 100%" placeholder="发案时间下限"
                            :picker-options="disabledDateFun"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="简要案情">
            <el-input type="textarea" v-model="editForm.caseDetails" placeholder="简要案情(300个字符内)" :maxlength="300" :rows="6"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style scoped>


</style>
<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  import {
    GET_DEPT_DICTS_LIST,
    GET_CASE_INFO,
    UPDATE_CASE_INFO
  } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        transition: {},
        disabledDateFun: { // 日期选择范围
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        editForm: {
          unit: ''
        },
        unitList: {}, // 所属单位选择
        dictLists: [], // 字典集合
        page: {
          start: '',
          end: ''
        },
        options: {}
      }
    },
    props: ['dialog', 'type', 'data'],
    computed: {
      ...mapState(['dict', 'caseInfo'])
    },
    methods: {
      /**
       *  数据匹配
       */
      dataModel(val) {
        return {
          id: val.id,
          caseNumber: val.ajbh,
          caseName: val.ajmc,
          unit: val.badw,
          unitName: val.badwmc,
          means: val.zasd, // 作案特点
          meansName: val.zasdmc,
          area: val.fadd,
          caseType: val.ajlb,
          caseTypeName: val.ajlbmc,
          caseStatusCode: val.ajzt,
          caseStatusCodeName: val.ajztmc,
          createdTime: val.basj,
          startTime: val.fasjsx,
          endTime: val.fasjxx,
          caseDetails: val.jyaq
        }
      },
      /**
       * 初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        this.queryDictType()
        // 填充表单基本数据
        this.transition = this.dataModel(this.caseInfo.Model);
        this.editForm = clone(this.transition);
        this.editForm.means = this.editForm.meansName;
        this.editForm.caseType = this.editForm.caseTypeName;
        this.editForm.caseStatusCode = this.editForm.caseStatusCodeName;
        this.editForm.unit = this.editForm.unitName;
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.$emit('close')
        // this.dialog = false
      },
      /**
       * 提交编辑文章表单事件
       * @return {[type]} [description]
       */
      submit() {
        // 表单验证
        let eform = this.editForm
        let caseForm = {
          id: eform.id,
          ajbh: eform.caseNumber,
          ajmc: eform.caseName,
          ajlb: eform.caseType === this.transition.caseTypeName ? this.transition.caseType : eform.caseType, //
          ajzt: eform.caseStatusCode === this.transition.caseStatusCodeName ? this.transition.caseStatusCode : eform.caseStatusCode, //
          basj: eform.createdTime,
          badw: eform.unit === this.transition.unitName ? this.transition.unit : eform.unit, //
          fadd: eform.area,
          fasjsx: eform.startTime,
          fasjxx: eform.endTime,
          zasd: eform.means === this.transition.meansName ? this.transition.means : eform.means, //
          jyaq: eform.caseDetails
        }
        // 更新案件基本信息
        this.dispatch(UPDATE_CASE_INFO, { data: caseForm }).then(d => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$emit('call:submit', true)
        })
      },
      /**
       * 编辑模态窗取消按钮事件
       * @return {[type]} [description]
       */
      cancel() {
        this.closeEvent()
      },
      getCaseInfo(caseId) {
        // 查询案件基础信息
        this.dispatch(GET_CASE_INFO, { data: { id: caseId } })
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['AJLBDM', 'ZATDDM', 'XZAJZT'])
          .then(res => {
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
          this.editForm.unit = this.transition.unit
        })
        // Promise.all([dictStatus, fillStatus]).then(d => {
        // this.editForm = this.dataModel(this.caseInfo.Model)
        // })
      }
    },
    created() {

    },
    mounted() {}
  }

</script>
