<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="dialogMode==='edit'?'修改研判':'新增研判'" :modal-append-to-body="true" :append-to-body="true" size="bigest" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent"
    class="title-icon-edit">
    <div v-loading="dictLoading||sumTLoading" :element-loading-text="sumTLoadingText">
      <el-form v-if="editForm!==null" :rules="knowEditFormRules" ref="knowEditForm" :model="editForm" label-width="110px">
        <el-row :gutter="10" style="margin: 0 20px 0 0">
          <el-col :span="8">
            <el-form-item label="案件编号" prop="CaseNumber">
              <el-autocomplete v-model="editForm.CaseNumber" :fetch-suggestions="fetchCaseInfoByNumber" name="caseNumberInputName" :trigger-on-focus="false" placeholder="根据案件编号(7个字符开始搜索) / 可以为空" style="width: 100%" :props="{value:'CaseNumber',label:'CaseName'}" @select="selelctCaseInfoAuto"
                :maxlength="50">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件名称" prop="CaseName">
              <el-input :disabled="Boolean(querySelectForm.CaseName)||initSelectForm" v-model="editForm.CaseName" placeholder="案件名称(50个字符内)" :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报案时间" prop="CreatedTime">
              <el-date-picker :disabled="Boolean(querySelectForm.CreatedTime)||initSelectForm" v-model="editForm.CreatedTime" type="datetime" style="width: 100%" placeholder="报案时间" :picker-options="disabledDateFun"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件状态" prop="status">
              <el-select clearable placeholder="请选择案件状态" :disabled="Boolean(querySelectForm.status)||initSelectForm" v-model="editForm.status" filterable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['XZAJZT']" style="width: 100%"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案件类别" prop="caseType">
              <el-select clearable placeholder="请选择案件类别" :disabled="Boolean(querySelectForm.caseType)||initSelectForm" v-model="editForm.caseType" filterable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['AJLBDM']" style="width: 100%"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作案特点" prop="means">
              <el-select clearable placeholder="请选择作案特点" :disabled="Boolean(querySelectForm.means)||initSelectForm" v-model="editForm.means" filterable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['ZATDDM']" style="width: 100%"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="受理单位" prop="unit" v-if="unitList">
              <el-select clearable placeholder="请选择受理单位" :disabled="Boolean(querySelectForm.unit)||initSelectForm" v-model="editForm.unit" filterable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in unitList"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发案时间上限" prop="startTime">
              <el-date-picker :disabled="Boolean(querySelectForm.startTime)||initSelectForm" v-model="editForm.startTime" type="datetime" style="width: 100%" placeholder="发案时间上限" :picker-options="disabledDateFun"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发案时间下限" prop="endTime">
              <el-date-picker :disabled="Boolean(querySelectForm.endTime)||initSelectForm" v-model="editForm.endTime" type="datetime" style="width: 100%" placeholder="发案时间下限" :picker-options="disabledDateFun"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="案发地点" prop="area">
              <el-input placeholder="发案地点(100个字符内)" :maxlength="100" :disabled="Boolean(querySelectForm.area)||initSelectForm" v-model="editForm.area" icon="icon iconfont icon-coordinates_fill" :on-icon-click="callLocationSelector"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="经度" prop="long">
              <el-input v-model="editForm.long" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="纬度" prop="lat">
              <el-input v-model="editForm.lat" placeholder="" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="简要案情" prop="CaseDetails">
              <el-input type="textarea" :disabled="Boolean(querySelectForm.CaseDetails)||initSelectForm" v-model="editForm.CaseDetails" placeholder="简要案情(300个字符内)" :maxlength="300" :rows="6"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="title-box" v-if="querySelectForm.CaseNumber||!initSelectForm">案件基本信息</div>
        <el-row :gutter="0">
          <el-col :span="24" style="position: relative">
            <!-- 案件基本信息 切换表格 -->
            <relevantBasic @update:table="basicTableDate" :isInitDialog="isInitDialog" v-if="querySelectForm.CaseNumber||!initSelectForm"></relevantBasic>

          </el-col>
        </el-row>

      </el-form>

      <div class="el-dialog__footer">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <!--<el-button @click="reset">重置</el-button>-->
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
  <!-- 编辑模态窗 large/tiny-->
  <sunEditor :dialog="sunEditDialog" @close="sunEditDialog=false" :data="sunObj"></sunEditor>
  <location-selector layer="" :pointMode="true" :dialog="showLocationSelector" @close="showLocationSelector=false" @on-select="handleSelect"></location-selector>

</div>
</template>
<style scoped>
.title-box {
  height: 28px;
  width: calc(100% - 0px);
  line-height: 28px;
  text-align: center;
  color: #666666;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  background-color: #f6f6f6;
}
</style>
<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import relevantBasic from './relevantBasic/index'
import { clone } from '../../../utils/util'
import {
  GET_DEPT_DICTS_LIST,
  ADD_CASE_SAVE_ALL,
  FETCH_PEOPLE_CASE_LIST,
  FETCH_INVOLVED_CASE_PEOPLE_LIST,
  FETCH_INVOLVED_ITEM_LIST,
  FETCH_INVOLVED_CAR_LIST,
  FETCH_CASE_INFO_BY_NUMBER
} from '../../../store/types'
import sunEditor from './sunEditor'
import locationSelector from '../../../widgets/location-selector/location-selector'

export default {
  mixins: [mixin],
  components: {
    sunEditor,
    relevantBasic,
    locationSelector
  },
  data() {
    return {
      showLocationSelector: false,
      sumTLoading: false,
      sumTLoadingText: '正在加载中',
      dictIsQuery: true,
      disabledDateFun: { // 日期选择范围
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      // 表单验证
      knowEditFormRules: {
        CaseName: [
          { required: true, message: '不能为空' }
        ],
        caseType: [
          { required: true, message: '不能为空' }
        ]
      },
      isSelectInput: false, // 输入
      initSelectForm: false, // 初始化表格输入
      sunEditDialog: false,
      isInitDialog: true, // 是否初始化
      sunObj: {
        alarm: '',
        name: '',
        unit: '',
        status: '',
        post: '',
        power: ''
      },
      unitList: {}, // 所属单位选择
      dictLists: [], // 字典集合
      caseId: '',
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 10,
        currentpage: 1
      },
      querySelectForm: {},
      editForm: {
        CaseNumber: '',
        CaseName: '',
        CaseDetails: '',
        unit: '',
        status: '',
        means: '',
        area: '',
        caseType: '',
        CaseStatus: '',
        CaseStatusCode: '',
        CreatedTime: '',
        startTime: '',
        endTime: '',
        long: '',
        lat: ''
      },
      dataCaseArray: [], // 案件相关信息
      page: {
        start: '',
        end: ''
      },
      options: {}
    }
  },
  props: ['dialog', 'type', 'data'],
  computed: {
    dialogMode() {
      return this.editmode || 'add'
    },
    ...mapState(['dict', 'caseInfo'])
  },
  methods: {
    handleSelect(selected) {
      this.editForm.long = selected.x + ''
      this.editForm.lat = selected.y + ''
      // this.editForm.long = selected.customs.X + ''
      // this.editForm.lat = selected.customs.Y + ''
      // this.editForm.CaseNumber = selected.customs.AJBH || ''
      // this.fetchCaseInfoByNumber(this.editForm.CaseNumber, (res) => {
      //   this.selelctCaseInfoAuto(res[0])
      //   this.$nextTick(() => {
      //     this.editForm.area = this.editForm.area || selected.address || '' // PGIS地址信息为空, selected.x + ',' + selected.y
      //   })
      // })
      this.showLocationSelector = false
    },
    queryList() {
      // 查询列表
      let _queryType = [
        FETCH_PEOPLE_CASE_LIST, // 获取办案人员列表
        FETCH_INVOLVED_CASE_PEOPLE_LIST, // 获取涉案人员列表
        FETCH_INVOLVED_ITEM_LIST, // 获取涉案物品列表
        FETCH_INVOLVED_CAR_LIST // 获取涉案车辆列表
      ]
      for(let qti in _queryType) {
        this.dispatch(_queryType[qti], {
          data: {
            ajid: this.caseId,
            PageIndex: this.pageInfo.currentpage,
            PageSize: this.pageInfo.limit
          }
        }).then(r => {})
      }
    },
    add(addType) {
      //        this.targetId = ''
      //        this.sunEditMode = 'add'
      //        this.sunEditDialog = true
      if(addType === 1) { // 办案人员
        this.transactEditDialog = true
      }
      if(addType === 2) { // 涉案人员
        this.personDetail = null
        this.addPeopleDialog = true
      }
    },
    basicTableDate(d) {
      // 基础表格信息数据
      this.dataCaseArray = d
    },
    addCaseInfo() {
      let eform = this.editForm
      let caseForm = {
        ajbh: eform.CaseNumber,
        ajmc: eform.CaseName,
        ajlb: eform.caseType,
        basj: eform.CreatedTime,
        badw: eform.unit,
        ajzt: eform.status,
        fadd: eform.area,
        fasjsx: eform.startTime,
        fasjxx: eform.endTime,
        zasd: eform.means,
        ly: '1',
        jyaq: eform.CaseDetails,
        jd: eform.long,
        wd: eform.lat
      }
      this.dataCaseArray.caseInfos = caseForm // 添加案件基本信息
      this.dispatch(ADD_CASE_SAVE_ALL, this.dataCaseArray).then(r => {
        this.$message({
          type: 'success',
          message: '添加成功！'
        })
        this.cancel()
        this.sumTLoading = false
        this.sumTLoadingText = '正在加载中...'
        this.$emit('submit', 'success')
      }).catch(r => {
        this.sumTLoading = false
        this.sumTLoadingText = '正在加载中...'
      })
    },
    remove() {
      this.$confirm('确定要删除?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功',
          showClose: true
        })
      })
    },
    /**
     * 初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.isInitDialog = true
      this.initSelectForm = false
      this.querySelectForm = {}
      this.reset()
      if(this.dictIsQuery) {
        this.queryDictType()
        this.dictIsQuery = false
      }
      // 填充表单基本数据
      if(this.dialogMode === 'edit' && this.id !== '') {
        // 修改
        this.getDetail(this.id)
        this.caseId = this.id
        // 初始化相关信息列表
        this.queryList()
      } else {
        // (默认)新增
        this.reset()
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      // this.reset()
      this.$emit('close')
      this.isInitDialog = false
      // this.dialog = false
    },
    /**
     * 提交编辑文章表单事件
     * @return {[type]} [description]
     */
    submit() {
      // 确认提交
      this.sumTLoading = true
      this.$refs['knowEditForm'].validate(vt => {
        if(vt) {
          this.sumTLoadingText = '正在提交中...'
          // 表单验证
          this.addCaseInfo() // 案件信息
        } else {
          this.sumTLoading = false
          return false
        }
      })
    },
    /**
     * 编辑模态窗取消按钮事件
     * @return {[type]} [description]
     */
    cancel() {
      this.closeEvent()
    },
    /**
     * 重置表单
     */
    reset() {
      if(this.$refs['knowEditForm']) {
        this.$refs['knowEditForm'].resetFields()
        this.initSelectForm = false
      }
    },
    queryDictType() {
      //  表单字典初始化
      console.time('dict')
      this.getDict(['AJLBDM', 'ZATDDM', 'XZAJZT']).then(res => {
        console.log(res)
        this.dictLists = res
        console.timeEnd('dict')
        document.getElementsByName('caseNumberInputName')[0].addEventListener('blur', e => {
          this.caseNumberInputBlur(e)
        })
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
    },
    /**
     * 时间格式转
     */
    dateFormatTo(d) {
      let _d = ''
      if(d && d !== '') {
        _d = d.substr(0, 4) +
          '-' + d.substr(4, 2) +
          '-' + d.substr(6, 2) +
          ' ' + d.substr(8, 2) +
          ':' + d.substr(10, 2) +
          ':' + d.substr(12, 2)
      }
      return _d
    },
    /**
     * 通过案件编号远程搜索案件信息
     * @param keyWord
     * @param callback
     */
    fetchCaseInfoByNumber(keyWord, callback) {
      if(this.isSelectInput) {
        this.reset()
      }
      this.initSelectForm = false
      callback([]) // 初始化进程
      if(keyWord.length > 6) {
        this.initSelectForm = true
        this.isSelectInput = false
        this.dispatch(FETCH_CASE_INFO_BY_NUMBER, {
          ajbh: keyWord
        }).then(_ => {
          if(this.caseInfo.FetchCaseInfoByNumber.ajList) {
            callback(this.caseInfo.FetchCaseInfoByNumber.ajList.map(rowC => {
              // rowC.larq;  //立案日期
              return {
                CaseNumber: rowC.asjbh, // 案件编号
                CaseName: rowC.ajmc, // 案件名称
                CaseDetails: rowC.jyaq, // 基本案情
                unit: rowC.sldwdm, // 受理单位代码
                area: rowC.ajfsdd, // 案事件发生地点
                caseType: rowC.ajlbdm, // 案件类别代码
                CreatedTime: rowC.slsj, // 受理时间
                startTime: rowC.ajkssj, // 案事件发生开始时间
                endTime: rowC.ajjssj // 案事件发生结束时间
              }
            }))
          }
        })
      }
    },
    /**
     * 选中的研判案件项目
     * @param item
     */
    selelctCaseInfoAuto(item) {
      this.isSelectInput = true
      this.querySelectForm = item || clone(this.editForm)
      this.editForm = Object.assign(this.editForm, item)
      this.initSelectForm = false
    },
    /***
     * 案件编号失去焦点事件 清空
     * @param e
     */
    caseNumberInputBlur(e) {
      if(!this.isSelectInput) {
        //          this.reset()
        this.editForm.CaseNumber = ''
      }
      if(!this.editForm.CaseNumber) {
        this.reset()
        this.initSelectForm = false
      }
    },
    callLocationSelector() {
      this.showLocationSelector = true
    }
  },
  watch: {},
  created() {},
  mounted() {}
}
</script>
