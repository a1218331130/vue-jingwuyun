<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">命案逃犯案件信息</h3>
  </div>

  <div>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="案件编号" prop="ajbh" label-width="106px">
          <el-autocomplete v-model="value.ajbh" :fetch-suggestions="fetchCaseInfoByNumber" name="caseNumberInputName" :trigger-on-focus="false" placeholder="根据案件编号(7个字符开始搜索) / 可以为空" style="width: 100%" :props="{value:'asjbh',label:'ajmc'}" @select="selelctCaseInfoAuto"
            :maxlength="50">
          </el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="案件名称" prop="ajmc" label-width="106px">
          <el-input :disabled="isSelectInput" :maxlength="50" v-model="value.ajmc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="案件类别" prop="ajlb" label-width="106px">
          <el-select :disabled="isSelectInput" v-model="value.ajlb" filterable style="width: 100%">
            <el-option style="height: auto" v-for="item in dictLists['AJLBDM']" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="立案单位" prop="ladw" label-width="106px">
          <el-select :disabled="isSelectInput" v-model="value.ladw" filterable style="width: 100%">
            <el-option style="height: auto" v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="抓获状态" prop="zhzt" label-width="106px">
          <el-select placeholder="请选择" v-model="value.zhzt" filterable style="width: 100%">
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['ZHZT']" style="width: 100%"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="6" label="工作抓手" prop="Address">
        <el-input :maxlength="50" v-model="form.Address"></el-input>
      </el-col> -->
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="简要案情" prop="jyaq" label-width="106px">
          <el-input :disabled="isSelectInput" type="textarea" placeholder="请输入简要案情" :autosize="{minRows: 12, maxRows: 50}" v-model="value.jyaq"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">

      <!-- <el-col :span="8">
        <el-form-item label="户籍地区划" prop="hjdqh" label-width="106px">
          <el-input :maxlength="50" v-model="value.hjdqh" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="户籍地详址" prop="hjdxz" label-width="106px">
          <el-input :maxlength="50" v-model="value.hjdxz" :maxlength="50"></el-input>
        </el-form-item>
      </el-col> -->
    </el-row>
  </div>

</div>
</template>
<style>
.addh3 {
  background: #eee;
  font-size: 14px;
  font-weight: normal;
  padding: 5px 0;
  margin: 0 -15px 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  text-align: center;
}
</style>
<script>
import mixin from '../../../../../utils/mixin'
import { mapState } from 'vuex'
import { clone } from '../../../../../utils/util'
import {
  FETCH_CASE_LIST,
  GET_DEPT_DICTS_LIST,
  FETCH_CASE_INFO_BY_NUMBER
} from '../../../../../store/types'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      dictLists: [],
      unitList: [],
      isSelectInput: false,
      caseList: [],
      newinfo: null
    }
  },
  computed: {
    ...mapState(['caseInfo', 'dict'])
  },
  methods: {
    initDialog() {
      // this.value = clone(this.dataForm)
      if(this.dictLists.length <= 0) {
        this.queryDictType()
      }
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['ZHZT', 'AJLBDM']).then(res => {
        this.dictLists = res
      })
    },
    /**
     * 通过案件编号远程搜索案件信息
     * @param keyWord
     * @param callback
     */
    fetchCaseInfoByNumber(keyWord, callback) {
      if(this.isSelectInput) {
        this.value.ajmc = ''
        this.value.jyaq = ''
        this.value.ajlb = ''
        this.value.ladw = ''
        this.value.ajbh = ''
        this.isRemote = false
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
                ajbh: rowC.asjbh, // 案件编号
                ajmc: rowC.ajmc, // 案件名称
                jyaq: rowC.jyaq, // 基本案情
                ladw: rowC.sldwdm, // 受理单位代码
                area: rowC.ajfsdd, // 案事件发生地点
                ajlb: rowC.ajlbdm, // 案件类别代码
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
      this.querySelectForm = item || clone(this.value)
      this.value = Object.assign(this.value, item)
      this.initSelectForm = false
    },
    /***
     * 案件编号失去焦点事件 清空
     * @param e
     */
    caseNumberInputBlur(e) {
      if(!this.isSelectInput) {
        //          this.reset()
        this.value.asjbh = ''
      }
      if(!this.value.asjbh) {
        this.reset()
        this.initSelectForm = false
      }
    },
    changeCase() {
      this.dispatch(FETCH_CASE_LIST, {
        data: {
          PageIndex: 1,
          PageSize: 10,
          ajmc: this.value.ajmc
        }
      }).then(_ => {
        this.caseList = this.caseInfo.PageData
      })
    },
    callLocationSelector() {
      this.showLocationSelector = true
    }
  },
  watch: {
    newinfo: {
      handle() {
        this.$emit('updata:value', this.newinfo)
      },
      deep: true
    }
  },
  props: ['value', 'form'],
  mounted() {
    this.initDialog()
    this.isSelectInput = false
    this.dispatch(GET_DEPT_DICTS_LIST).then(_ => { // 所属单位选择
      this.unitList = this.dict.GetDeptDictsList.map(d => {
        return {
          label: d.DictName,
          value: d.KeyId
        }
      })
    })
  },
  created() {}
}
</script>
