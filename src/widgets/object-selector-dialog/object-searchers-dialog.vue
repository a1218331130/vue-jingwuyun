<!-- 对象检索组件 -->
<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="mode==='caseOnly'?'选择案件':'选择对象'" :modal-append-to-body="true" :append-to-body="true" :size="size||'bigest'" :modal="size!=='full'" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <div class="object-searcher" v-loading="loading">
      <div class="objsearch-box">
        <form :class="{'case-mode':mode==='caseOnly'}" v-on:submit.prevent>
          <el-input :class="{'search-box__objselect':true,'case':mode==='caseOnly'}" size="large" v-model="keyword" :placeholder="mode==='caseOnly'?'请输入案件编号或案件名称进行搜索':'请输入搜索内容'" :icon="(false)?'icon iconfont icon-zhiding cursor--pointer':''">

            <div v-if="typeOps.length > 0 || (dictList && dictList.AJLBDM.length > 0)" :class="{'prepend-box':mode==='caseOnly'}" slot="prepend">
              <el-select v-model="type" :class="{case:mode==='caseOnly'}" filterable :placeholder="mode==='caseOnly'?'请选择案件类别':'请选择'">
                <el-option v-for="(item,i) in (mode==='caseOnly'?dictList.AJLBDM:typeOps) " :key="i" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-date-picker v-if="mode==='caseOnly'" type="daterange" v-model="dateRange" range-separator=" 至 " :editable="false" :picker-options="pickerOptions" @change="updateDateRangeVal" style="width:220px; font-size:12px; margin-left:15px;" placeholder="请选择立案时间范围"></el-date-picker>
            </div>

            <el-button class="search-box__button" native-type="submit" icon="icon iconfont icon-sousuo" @click="reload" slot="append">搜索</el-button>
            <!-- <div v-if="needSearchMask===true" class="search-box__mask" @click=""></div> -->
          </el-input>
        </form>
      </div>

      <div class="objresult-box" style="min-height:300px;">
        <div class="" style="position:absolute; top:10px; left:15px;">
          <!-- <el-checkbox label="全选" @change="selectAll" v-model="checked"></el-checkbox> -->
        </div>
        <el-tabs v-model="currentTab" style="position:relative;">
          <el-tab-pane v-if="(mode!=='caseOnly' && tabs.length > 0) || mode==='caseOnly'" v-for="item in tabs" :key="item.id" :name="item.id.toString()" :label="item.label">
            <el-table v-if="item.list.length > 0" height="300" :show-header="false" border :data="item.list" stripe ref="multipleTable" @selection-change="selectionChange">
              <el-table-column width="50px" align="center">
                <template scope="scope">
                  <!-- <el-checkbox v-model="multipleSelection" :label="scope.row"></el-checkbox> -->
                  <el-button type="primary" icon="plus" @click="add(scope.row, item.columns)"></el-button>
                </template>
</el-table-column>
<!-- <el-table-column width="80px" align="left">
                    <template scope="scope">
                      <img src="../../../static/img/testPersonImg.jpg" alt="" style="height:90px;width:70px">
                    </template>
                  </el-table-column> -->
<el-table-column>
  <template scope="scope">
                  <div class="compact__wrap">
                    <div class="compact__box">
                      <div v-if="mode!=='caseOnly'" class="compact__objtitle">
                        采集时间: {{scope.row['csrq']}}
                        <!-- 来源: {{scope.row.score}} -->
                      </div>
                      <div class="compact__objitem" v-for="column in item.columns.filter(c=>c.label!=='类型')">
                        <label>{{column.FieldCn}}</label> {{scope.row[column.FieldEn]}}
                      </div>
                    </div>
                  </div>
                </template>
</el-table-column>
</el-table>
<div v-if="item.list.length === 0" class="empty">
</div>
<pagination v-if="mode==='caseOnly' && item.list.length > 0" :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</el-tab-pane>
</el-tabs>
</div>
</div>

<!-- <div slot="footer" class="dialog-footer">
        <el-button type="" @click="closeEvent">取消</el-button>
        <el-button type="primary" @click="submit">添加</el-button>
      </div> -->
</el-dialog>
</template>
<style lang="scss" scoped>
  .search-box__objselect {
    &.case {
      width: 80%;
      margin: 0 auto;
      position: relative;
      left: auto;
      transform: translateX(8%);
    }
  }

  .object-searcher {
    position: relative;
    .objsearch-box {
      position: relative;
      .check-checkedallbox {
        display: inline-block;
        position: absolute;
        width: 100px;
        top: 48px;
        left: 200px;
      }
      .check-box {
        position: relative;
        width: 600px;
        left: 27%;
        margin-top: 14px;
      }
      .prepend-box {
        width: 420px;
        >div {
          display: inline-block;
        }
      }
    }
    .objresult-box {
      position: relative;
      border: 1px solid #D1DBE5;
      margin: 20px 10px 10px;
    }
    .empty {
      margin-top: 100px;
    }
  }

</style>
<style lang="scss">
  .object-searcher {
    .el-input-group__prepend .el-select {
      width: 120px;
      &.case {
        width: 200px;
      }
    }
    .el-tabs__nav {
      float: right;
    }
    .el-table__body {
      .cell {
        .el-checkbox {
          &__label {
            display: none;
          }
        }
      }
    }
    .cell {
      .el-button {
        padding: 0;
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
    }
  }

  .case-mode {
    .el-input-group__prepend {
      border: 0;
      vertical-align: baseline;
      .el-select {
        &:hover {
          .el-input__inner {
            border: 1px solid #ccc;
          }
        }
        .el-input__inner {
          border: 1px solid #ccc;
          margin-right: 5px;
        }
      }
    }
    .el-input-group__append {
      .el-button {
        top: 2px;
        height: 34.5px;
        line-height: 34.5px;
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { SEARCH_RESULT, FETCH_RESULT_OBJECT_TYPE_LIST, FETCH_SERIES_CASE_OPTIONS } from '../../store/types'

  import mixin from '../../utils/mixin'
  import bus from '../../utils/bus'
  import pagination from '../../widgets/pagination/pagination.vue'
  import { clone } from '../../utils/util'

  /**
   * @module ObjectSearcherDialog
   * @desc 对象查询选择模态窗
   *
   *    返回值: {Object} 选中的结果对象
   *
   * @example <object-searcher-dialog :dialog="dialog" @close="dialog=false"></object-searcher-dialog>
   */
  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    data() {
      let categoryToType = {
        place: 8,
        tel: 2,
        car: 3,
        user: 4,
        case: 6
      }
      return {
        dataTypeToNodeType: {
          8: categoryToType['place'], // 单位名称
          2: categoryToType['tel'], // 电话号码
          3: categoryToType['car'], // 车牌号码
          4: categoryToType['user'], // 身份证
          5: categoryToType['car'], // 车辆车牌号码
          6: categoryToType['case'] // 案件编号
        },
        dictList: null,
        checkAll: false,
        checked: false,
        count: 0,
        dateRange: '',
        dateValue: ['', ''],
        pagenav: {
          currentpage: 1,
          limit: 10
        },
        idCard: '',
        keyword: '',
        showTableHeader: false,
        border: true,
        typeOps: [],
        type: '4',
        typeString: '',
        isIndeterminate: true,
        currentTab: '',
        tabs: [],
        flag: false,
        multipleSelection: [],
        tableList: []
      }
    },
    /**
     * 接收参数
     * @prop {Array} dialog 是否显示窗口 @default false
     * @prop {Array} size 窗口大小,详情请参考当前项目对应elementUI客化样式文件 @default 'bigest'
     * @prop {String} mode 使用纯案件模式 ('caseOnly'|'')  @default ''
     *
     */
    props: ['dialog', 'size', 'value', 'mode'],
    computed: {
      ...mapState(['analysisRelation', 'seriesCase', 'search'])
    },
    watch: {
      pagenav: {
        handler: function(val, oldVal) {
          this.fetchList()
        },
        deep: true
      },
      multipleSelection(val) {
        if (val.length === this.tableList.length) {
          this.checked = true
        } else {
          this.checked = false
        }
      },
      type(val) {
        if (this.typeOps && this.typeOps.length !== 0) {
          this.typeString = this.typeOps.find(d => d.value === val).node;
        }
      },
      idCard(newVal, oldVal) {
        if (newVal) {
          this.keyword = newVal
          this.dispatch(FETCH_RESULT_OBJECT_TYPE_LIST).then(() => {
            if (this.analysisRelation.resultObjectTypeList && this.analysisRelation.resultObjectTypeList.length > 0) {
              this.typeOps = this.analysisRelation.resultObjectTypeList.map(d => {
                return {
                  key: d.KEY,
                  label: d.NAME,
                  node: d.NODE,
                  value: d.TYPE
                }
              })
              this.type = this.typeOps.find(d => d.key === 'zjhm').value
              this.$nextTick(() => {
                this.fetchList();
              })
            }
          })
        }
      }
    },
    methods: {
      initDialog() {
        if (this.mode === 'caseOnly') {
          this.currentTab = '1'
          this.tabs = [{
            id: 1,
            label: '案件',
            columns: [{
              label: '案件编号',
              prop: 'asjbh'
            }, {
              label: '案件类别代码',
              prop: 'ajlbdm'
            }, {
              label: '案件类别名称',
              prop: 'ajlbmc，'
            }, {
              label: '案件名称',
              prop: 'ajmc'
            }, {
              label: '发案行政区划名称',
              prop: 'xzqmc'
            }, {
              label: '发现案事件地点_地址名称',
              prop: 'fxasjdd_dzmc'
            }, {
              label: '简要情况',
              prop: 'jyqk'
            }, {
              label: '事由',
              prop: 'sy_jyqk'
            }, {
              label: '立案单位_公安机关名称',
              prop: 'ladw_gajgmc'
            }, {
              label: '立案时间',
              prop: 'larq'
            }, {
              label: '立案单位_公安机关代码',
              prop: 'ladw_gajgjgdm'
            }, {
              label: '案事件发生时间_案事件发生开始时间',
              prop: 'asjfssj'
            }, {
              label: '案事件发生时间_案事件发生结束时间',
              prop: 'asjjssj'
            }],
            list: []
          }]
        } else {
          this.tabs = []
        }
        this.keyword = ''
      },
      closeEvent() {
        /**
         * 关闭窗口
         * @event module:ObjectSearcherDialog~close
         */
        this.$emit('close')
      },
      add(data, columns) {
        /**
         * 选中并提交返回数据
         * @event module:ObjectSearcherDialog~call:addObject
         * @param {Object} a 返回对象
         * @param {Object} a.data 数据实体
         * @param {Array} a.columns 数据字段对标数组
         */
        let type = this.dataTypeToNodeType[this.type];
        this.$emit('call:addObject', {
          data: data,
          columns: columns,
          nodeType: type,
          dataType: this.type,
          typeString: this.typeString,
          keyword: this.keyword
        })
        if (this.mode !== 'caseOnly') this.closeEvent()
      },
      submit() {
        if (this.multipleSelection.length === 0) {
          this.$alert('最少选择一个对象进行分析', '温馨提示')
        } else {
          this.$emit('call:addObject', this.multipleSelection)
          this.closeEvent()
        }
      },
      reload() {
        if (this.mode !== 'caseOnly' && this.keyword === '') {
          this.$alert('关键字不能为空', '温馨提示');
          return false;
        } else if (this.mode !== 'caseOnly' && !this.validKeyword(this.type, this.keyword)) {
          return false;
        } else {
          if (this.mode !== 'caseOnly') this.tabs = []
          if (this.pagenav.currentpage === 1) {
            this.fetchList()
          } else {
            this.pagenav.currentpage = 1
          }
        }
      },
      validKeyword(type, keyword) {
        let regx = {
          zjhm: { reg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, msg: '请输入正确的身份证号码' }
        }
        let valid = true;
        this.typeOps.forEach((item, idx) => {
          if (item.value === type) {
            if (regx[item.key] && !regx[item.key].reg.test(keyword)) {
              this.$message({ type: 'warning', message: regx[item.key].msg })
              valid = false;
            }
          }
        })
        return valid;
      },
      fetchList() {
        if (this.mode === 'caseOnly') {
          this.dispatch(FETCH_SERIES_CASE_OPTIONS, {
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit,
            asjbh: (new RegExp('[\\u4E00-\\u9FFF]+', 'g')).test(this.keyword) ? '' : this.keyword, // /[^/u4e00-/u9fa5]/
            ajmc: this.keyword,
            ajlbdm: this.type,
            kssj: this.dateValue[0] ? `${this.dateValue[0]} 00:00:00` : undefined,
            jssj: this.dateValue[1] ? `${this.dateValue[1]} 00:00:00` : undefined
          }).then(() => {
            if (this.seriesCase.seriesCaseOptions && this.seriesCase.seriesCaseOptions.PageData) {
              this.tabs[0].list = this.seriesCase.seriesCaseOptions.PageData
              this.count = this.seriesCase.seriesCaseOptions.DataCount
            } else {
              this.tabs[0].list = []
            }
          })
        } else {
          let queryData = {},
            searchWhere = [{
              Keyword: this.keyword,
              KeywordType: 0,
              Name: '全部',
              SearchType: 1
            }]
          let typeObj = null;
          this.typeOps.forEach(d => {
            // 证件号码
            if (d.value === this.type) {
              typeObj = d
            }
          })
          queryData = {
            TableName: typeObj.node, // 指定表名
            RowIndex: 0, // 开始行数下标（把当前行数提交回来就可以）
            TypeId: 0, // 要素类型，选择的要素ID
            SearchType: 0, // 检索类型，全部 = 0,要素 = 1, 找人专题 = 2,案件专题 = 3,车辆专题 = 4,旅业专题 = 5,高危专题 = 6
            SearchWhere: searchWhere, // 查询条件
            ScrollID: null,
            IsSearchAggregations: false // 是否需要聚类(默认false)
          }
          this.dispatch(SEARCH_RESULT, queryData).then(() => {
            let data;
            if (this.search.searchResult) {
              data = clone(this.search.searchResult)
              data.Source.forEach(c => {
                this.$set(c, 'type', 4);
              })
              data.TableInfo.Columns.forEach(d => {
                if (d.FieldEn === 'xm') {
                  d.title = true;
                } else {
                  d.title = false;
                }
                if (d.FieldEn === 'zjhm') {
                  d.key = true;
                } else {
                  d.key = false;
                }
              })
              if (data.Source && data.TableInfo.Columns) {
                this.tabs.push({
                  id: 1,
                  label: typeObj.label,
                  columns: data.TableInfo.Columns,
                  list: data.Source
                })
              }
              if (this.idCard && !this.flag) {
                this.flag = true;
                this.add(this.tabs[0].list[0], this.tabs[0].columns)
              }
              if (this.tabs.length > 0) this.currentTab = this.tabs[0].id + ''
            }
          })
        }
      },
      selectAll(elm) {
        this.multipleSelection = elm.srcElement.checked === true ? [...this.tableList] : []
      },
      selectionChange(val) {
        // table内checkbox
        this.multipleSelection = val
      },
      // setKeyword() {
      //   if (this.keyword === '431225199201093611') this.keyword = '430703198006020015'
      //   else this.keyword = '431225199201093611'
      // },
      updateDateRangeVal(val) {
        this.dateValue = val.split(' 至 ')
      }
    },
    created() {
      if (this.typeOps.length === 0 && this.mode !== 'caseOnly') {
        this.type = 0
        this.dispatch(FETCH_RESULT_OBJECT_TYPE_LIST).then(() => {
          if (this.analysisRelation.resultObjectTypeList && this.analysisRelation.resultObjectTypeList.length > 0) {
            this.typeOps = this.analysisRelation.resultObjectTypeList.map(d => {
              return {
                key: d.KEY,
                label: d.NAME,
                node: d.NODE,
                value: d.TYPE
              }
            })
            this.type = this.typeOps.find(d => d.key === 'zjhm').value
            // this.typeOps.unshift({
            //   key: 0,
            //   label: '全部',
            //   node: 0,
            //   value: 0
            // })
          }
        })
      }

      if (this.mode === 'caseOnly') {
        this.getDict(['AJLBDM']).then(res => {
          res.AJLBDM.unshift({ label: '其他', value: undefined })
          this.dictList = res
          this.type = undefined; // 默认选项是不限
        })
      }
      // 默认日期
      this.dateRange = [undefined, undefined];
      // 日期段组件时间限制
      this.pickerOptions['disabledDate'] = (time) => {
        return time.getTime() > Date.now()
      }
    },
    mounted() {
      bus.$on('update:idCard', d => {
        this.idCard = d;
      })
    }
  }

</script>
