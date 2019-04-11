<template>
  <div class="comparison_reult_content">
    <div class="filterDataCont">
      <div class="filterCriteria">
        <el-form :inline="true" :model="filterCriteriaArr[0]" :rules="rules" ref="ruleForm" class="filterData">
          <el-form-item prop="ColumnID">
            <el-select v-model="filterCriteriaArr[0].ColumnID" clearable size="small" style="width:100px;">
              <el-option v-for="(option,i) in filterArr.options" :key="i" :label="option.label" :value="option.prop"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OperatorType">
            <el-select v-model="filterCriteriaArr[0].OperatorType" clearable size="small" style="width:100px;">
              <el-option v-for="(option,i) in filterArr.gatherArr" :key="i" :label="option.label" :value="option.prop"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="Value">
            <el-input type="text" size="small" v-model="filterCriteriaArr[0].Value" placeholder="输入字段" style="width:100px;"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-for="(item,index) in filterCriteriaArr[0].SubFilters" :key="index" :inline="true" :model="item" class="filterData">
          <el-form-item prop="IsAnd">
            <el-select v-model="item.IsAnd" clearable size="small" style="width:100px;">
              <el-option v-for="(filter,i) in filterArr.filter" :key="i" :label="filter.label" :value="filter.prop"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ColumnID">
            <el-select v-model="item.ColumnID" clearable size="small" style="width:100px;">
              <el-option v-for="(option,i) in filterArr.options" :key="i" :label="option.label" :value="option.prop"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OperatorType">
            <el-select v-model="item.OperatorType" clearable size="small" style="width:100px;">
              <el-option v-for="(option,i) in filterArr.gatherArr" :key="i" :label="option.label" :value="option.prop"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="Value">
            <el-input type="text" size="small" v-model="item.Value" placeholder="输入字段" style="width:100px;"></el-input>
          </el-form-item>
        </el-form>
        <i v-if="filterCriteriaArr[0].SubFilters.length>0" class="el-icon-delete" style="color:#f6f6f6;cursor: pointer;padding-right:10px;" @click="deleted()"></i>
      </div>
      <el-button type="primary" icon="plus" class="btn" @click="add()"></el-button>
      <el-button type="primary" icon="search" class="btn" @click="ViewWdbdData('ruleForm')">查询</el-button>
      <!-- <el-button type="primary" icon="circle-close" class="btn" @click="close()">重置</el-button> -->
      <div class="switch">
        <el-switch v-if="resultData.contentList.length>0" v-model="status" :width="100" off-text="隐藏空字段" on-text="显示空字段" @change="isShowText"></el-switch>
      </div>
    </div>
    <div v-loading="this.resultData.loading" element-loading-text="拼命分析计算中……">
      <el-table @cell-mouse-enter="cellMouseEnter" border stripe :data="resultData.contentList" @row-dblclick="rowClick" height="865px"> 
        <el-table-column type="index" label="序号" align="center" width="50px" sortable>
          <template scope="scope">
            {{scope.$index + 1 + pageInfo.limit * (pageInfo.currentpage - 1)}}
          </template>
</el-table-column>
<el-table-column v-for="(item,i) in resultData.titleList" :key="i" :prop="item.prop" :label="item.label" align="center"></el-table-column>
</el-table>
<div class="app-toolbar footer">
  <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
</div>
</div>
</div>
</template>

<style lang="scss" scoped>
  .filterDataCont {
    min-height: 50px;
    display: flex;
    align-items: center;
    .filterCriteria {
      max-width: 455px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      position: relative;
      top: 5px;
      left: 5px;
    }
  }

  .btn {
    height: 32px;
  }

  .switch {
    position: absolute;
    right: 5px;
    top: 13px;
  }

</style>


<script>
  import { mapState } from 'vuex'
  import mixin from '../../../../utils/mixin'
  import { FETCH_VIEW_WDBD_DATA, FETCH_WDBD_DATA_DETAIL } from '../../../../store/types'
  import pagination from '../../../../widgets/pagination/pagination'
  export default {
    mixins: [mixin],
    props: ['comparisonData'],
    computed: {
      ...mapState(['dataComparison'])
    },
    components: {
      pagination
    },
    data() {
      return {
        type: '',
        status: true,
        id: '',
        resultData: {
          loading: false,
          titleList: '',
          contentList: [],
          totalCount: ''
        },
        filterCriteriaArr: [{
          ColumnID: '',
          OperatorType: 12,
          Value: '',
          IsAnd: true,
          SubFilters: []
        }],
        filterArr: {
          options: '',
          gatherArr: [{
            label: '包含',
            prop: 12
          }, {
            label: '等于空',
            prop: 2
          }, {
            label: '=',
            prop: 3
          }, {
            label: '!=',
            prop: 4
          }, {
            label: '>',
            prop: 5
          }, {
            label: '<',
            prop: 6
          }, {
            label: '>=',
            prop: 7
          }, {
            label: '<=',
            prop: 8
          }, {
            label: '不等于空',
            prop: 9
          }, {
            label: '左包含',
            prop: 10
          }, {
            label: '右包含',
            prop: 11
          }],
          filter: [{
            label: '并且',
            prop: true
          }, {
            label: '或者',
            prop: false
          }]
        },
        rules: {
          ColumnID: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          OperatorType: [
            { type: 'number', required: true, message: '请选择', trigger: 'change' }
          ],
          Value: [
            { required: true, message: '请填写', trigger: 'blur' }
          ]
        },
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 0,
          limit: 100,
          currentpage: 1
        }
      }
    },
    methods: {
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        if (this.type === 1) {
          this.initData();
        } else {
          this.ViewWdbdData('ruleForm')
        }
      },
      // 初始化
      init() {
        this.id = sessionStorage.getItem('id')
        this.dispatch(FETCH_WDBD_DATA_DETAIL, { ID: this.id }).then(() => {
          this.filterArr.options = this.dataComparison.GetWdbdDataDetail.Columns.map(d => {
            return {
              label: d.ColumnNameCn,
              prop: d.ID
            }
          })
        })
        this.initData()
      },
      initData() {
        this.resultData.loading = true
        this.dispatch(FETCH_VIEW_WDBD_DATA, {
          ID: this.id,
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        }).then(() => {
          this.type = 1
          this.resultData.loading = false
          this.resultData.titleList = this.dataComparison.ViewWdbdData.TableInfo.Columns.map(d => {
            return {
              label: d.NameCn,
              prop: d.Name
            }
          })
          this.resultData.contentList = this.dataComparison.ViewWdbdData.Source
          this.pageInfo.count = this.dataComparison.ViewWdbdData.TotalCount
          this.isShowText()
        })
      },
      // 添加查询条件
      add() {
        this.filterCriteriaArr[0].SubFilters.push({
          ColumnID: '',
          OperatorType: 12,
          Value: '',
          IsAnd: true
        })
      },
      // 删除动态添加的筛选条件
      deleted() {
        this.filterCriteriaArr[0].SubFilters.splice(this.filterCriteriaArr.length - 1, 1)
      },
      // 比对结果查询
      ViewWdbdData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.resultData.loading = true
            let formData = {
              ID: this.id,
              PageIndex: this.pageInfo.currentpage,
              PageSize: this.pageInfo.limit,
              Orders: [{
                ColumnID: this.filterCriteriaArr[0].ColumnID,
                IsDesc: true
              }],
              Filters: this.filterCriteriaArr
            }
            this.dispatch(FETCH_VIEW_WDBD_DATA, formData).then(() => {
              this.type = 2
              this.resultData.loading = false
              this.resultData.titleList = this.dataComparison.ViewWdbdData.TableInfo.Columns.map(d => {
                return {
                  label: d.NameCn,
                  prop: d.Name
                }
              })
              this.resultData.contentList = this.dataComparison.ViewWdbdData.Source
              this.pageInfo.count = this.dataComparison.ViewWdbdData.TotalCount
              this.isShowText()
            })
          }
        })
      },
      isShowText(e) {
        if (e) {
          let keyArr = Object.keys(this.resultData.contentList[0])
          keyArr.forEach(m => {
            if (this.resultData.contentList[0][m] === null || this.resultData.contentList[0][m] === '' || this.resultData.contentList[0][m] === undefined) {
              this.resultData.titleList.forEach((d, i) => {
                if (d.prop === m) {
                  this.resultData.titleList.splice(i, 1)
                }
              })
            }
          })
        } else {
          this.resultData.titleList = this.dataComparison.ViewWdbdData.TableInfo.Columns.map(d => {
            return {
              label: d.NameCn,
              prop: d.Name
            }
          })
        }
      },
      close() {
        this.filrerForm = {
          value: '',
          value1: '',
          value2: '',
          value3: '',
          value4: '',
          value5: '',
          value6: ''
        }
        this.initData()
      }
    },
    created() {},
    mounted() {
      this.init()
    }
  }

</script>
