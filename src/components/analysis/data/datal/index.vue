<template>
<!--数据分析-->
<div class="tel-list" v-loading="loading" element-loading-text="拼命分析计算中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="24" class="collap-col">
      <div class="upData">
        <el-button type="primary" size="small" icon="upload2" @click="importFile" style="margin-bottom:4px;">上传数据</el-button>
        <input v-if="fileInput===true" type="file" ref="importUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="v=>fileChange(v,1)">
      </div>
    </el-col>
    <el-col :span="0" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn" @click="switchRightBar"></slot>
      </div>
    </el-col>
  </el-row>
  <div class="tabs-box">
    <div class="tabs-box__item">
      <!-- 查询结果 -->
      <div class="app-content-box">
        <list v-if="!loading" :list="table.resData" :tab="table.tabList" @listenToListIndex="getListIndex" :pagenav="pageInfo" v-height-fix="200"></list>
        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
        </div>
      </div>
    </div>
  </div>
  <import-dialog :dialog="dislogImport" :title="fileInfo.title" :file="fileInfo.file" :type="1" @close="clearFileInput"></import-dialog>
</div>
</template>
<style lang="scss" scoped>
  .analysis-topbar {
    display: flex;
    justify-content: flex-end;
  }

  .app-content-box {
    padding: 5px 10px 16px 10px;
  }

  .filterDataCont {
    display: flex;
  }

  .filterData {
    padding-left: 16px;
  }

  .upData {
    display: flex;
    justify-content: flex-end;
    padding: 5px 16px 0px 0px;
  }

  .primary-btn {
    position: relative;
    top: 1px;
    left: 0;
  }

  .tel-list {
    height: 100%;
    .tabs-box {
      height: 95%;
    }
  }

  .btn {
    padding: 5px 5px;
    height: 32px;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_MY_DATA_LIST, FETCH_VIEW_WDBD_DATA } from '../../../../store/types'
  import list from '../list'
  import pagination from '../../../../widgets/pagination/pagination'
  import { clone } from '../../../../utils/util'
  import bus from '../../../../utils/bus'
  import baseDialogMixin from '../baseDialogMixin'
  export default {
    mixins: [baseDialogMixin],
    components: {
      list,
      pagination
    },
    computed: {
      ...mapState(['dataComparison'])
    },
    data() {
      return {
        tableHeight: '0',
        listIndex: '',
        tabIndex: '-1',
        loading: false,
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 0,
          limit: 18,
          currentpage: 1
        },
        form: {
          input: ''
        },
        commName: 'detail',
        detailBox: false,
        table: {
          tabList: [
            { label: '数据名称', prop: 'Name' },
            { label: '条数', prop: 'Count' },
            { label: '数据类型', prop: 'SourceType' },
            { label: '创建时间', prop: 'CreateTime' }
          ],
          resData: []
        },
        resultData: {
          ID: '',
          isLoad: false,
          isShowResult: false,
          titleList: [],
          contentList: [],
          totalCount: ''
        }
      }
    },
    methods: {
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.fetchMainList();
      },
      /**
       * 获取列表
       */
      fetchMainList(key, index) {
        let FormData = {
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit,
          SourceType: index === null ? undefined : index,
          Keyword: key === null ? '' : key
        }
        this.dispatch(FETCH_MY_DATA_LIST, FormData).then(() => {
          this.pageInfo.count = this.dataComparison.myDataList.DataCount;
          this.table.resData = clone(this.dataComparison.myDataList.PageData);
          this.table.resData.forEach(el => {
            this.$set(el, 'deleteStatus', false)
            this.$set(el, 'resultStstus', false)
            this.$set(el, 'comparisonStatus', false)
            switch (Number(el.SourceType)) {
              case 1:
                el.SourceType = '上传数据'
                break;
              case 2:
                el.SourceType = '交叉对比'
                break;
              case 3:
                el.SourceType = '排除对比'
                break;
              case 4:
                el.SourceType = '表单运算'
                break;
              case 5:
                el.SourceType = '索引结果'
                break;
            }
          })
        })
      },
      /**
       * 获取列表的index
       */
      getListIndex(data) {
        let obj = {
          limit: this.pageInfo.limit,
          currentpage: this.pageInfo.currentpage
        };
        this.listIndex = data;
        this.table.resData.splice(data, 1);
        this.pagenavChange(obj);
      },
      // addFilter() {
      //   this.filterArr.push({});
      //   console.log(this.filterArr[this.filterArr.length - 1])
      //   delete this.filterArr[this.filterArr.length - 1].filter;
      // },
      // 比对结果查询
      ViewWdbdData() {
        let formData = {
          ID: this.filrerForm.ID,
          PageIndex: '1',
          PageSize: '100',
          Orders: [{
            ColumnID: this.filrerForm.value,
            IsDesc: true
          }],
          Filters: [{
            ColumnID: this.filrerForm.value,
            OperatorType: this.filrerForm.value1,
            Value: this.filrerForm.value2,
            IsAnd: this.filrerForm.value3
          }]
        }
        this.dispatch(FETCH_VIEW_WDBD_DATA, formData).then(() => {
          this.resultData.isShowResult = true
          this.resultData.isLoad = true
          this.close()
          this.resultData.titleList = this.dataComparison.ViewWdbdData.TableInfo.Columns.map(d => {
            return {
              label: d.NameCn,
              prop: d.ByNamed
            }
          })
          this.resultData.contentList = this.dataComparison.ViewWdbdData.TableInfo.Source
        })
      }
    },
    created() {
      bus.$on('comparisonReult', d => {
        this.resultData.ID = d.ID
        this.resultData.isShowResult = d.isShowResult
        this.resultData.titleList = d.result.TableInfo.Columns.map(d => {
          return {
            label: d.NameCn.substring(0, d.NameCn.lastIndexOf('0')),
            prop: d.Name
          }
        })
        this.resultData.contentList = d.result.Source
        this.resultData.totalCount = d.result.TotalCount
      })
      bus.$on('parmasData', n => {
        this.fetchMainList(n.keyword, n.cat);
      })
    },
    mounted() {
      this.fetchMainList(null, null);
    }
  }

</script>
