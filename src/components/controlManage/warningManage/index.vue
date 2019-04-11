<template>
  <div class="side-right-box_div control-manage-examine">
    <div class="packClass"><span class="unfoldBtn iconfont icon-fold" @click="handleRightSide"></span></div>
    <div class="tabClass">
      <el-table :data="tableData" border class="app-table">
        
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
      {{scope.$index + 1 + 30 * (1 - 1)}}
    </template>
</el-table-column>
<el-table-column label="布控名称" align="center" prop="bkmc" width="150"></el-table-column>
<el-table-column label="布控类型" align="center" prop="bklx" width="120">
  <template scope="scope">
    <span>{{scope.row.bklx === '1'?'人员布控':scope.row.bklx === '2'?'车辆布控':'图片布控'}}</span>
  </template>
</el-table-column>
<el-table-column label="预警结果" align="center" prop="yjjg"></el-table-column>
<el-table-column label="预警对象" align="center" prop="yjx"></el-table-column>
<el-table-column label="出现位置" align="center" prop="cxwz"></el-table-column>
<el-table-column label="行政区划" align="center" prop="xzqh"></el-table-column>
<el-table-column label="经过时间" align="center" prop="jgsj"></el-table-column>
<el-table-column label="预警时间" align="center" prop="yjsj"></el-table-column>
</el-table>
</div>
<div class="app-toolbar" style="position:absolute;bottom:0;width:100%;padding:12px 0;">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="handlePageChange"></pagination>
</div>
<!-- 右侧栏 -->
<side-right-box :unfoldHandle="unfoldT" @unfoldState="sideState">
  <right-toolbar title="查询列表" :params="screen.queryForm" :options="screen.options" @packup="packup" @update:params="searchSubmit"></right-toolbar>
</side-right-box>
</div>
</template>
<style lang="scss" scoped>
  .unfoldBtn {
    position: absolute;
    right: 15px;
    z-index: 999;
    color: #666666;
    font-size: 22px;
    cursor: pointer;
    top: 10px;
  }

  .tabClass {
    padding: 16px;
  }

  .packClass {
    height: 39px;
    border-bottom: 1px solid #ccc;
    margin-bottom: -1px;
  }

</style>

<script>
  import { tableFill } from '../../../utils/util'
  import { FETCH_RESULT_LIST } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import '../../../utils/dateFormat'
  import { mapState } from 'vuex'
  import pagination from '../../../widgets/pagination/pagination'
  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      sideRightBox,
      rightToolbar
    },
    data() {
      return {
        pagenav: {
          PageIndex: 1,
          PageSize: 15
        },
        count: null,
        unfoldT: false,
        tableData: [],
        obj: {
          applyTime: '',
          createTime: '',
          keyword: '',
          org: '',
          spTime: '',
          state: '',
          zcType: ''
        },
        screen: {
          queryForm: {
            keyword: '',
            applyTime: '',
            createTime: '',
            zcType: '',
            state: '',
            org: [],
            spTime: ''
          },
          options: [{
            title: '关键字',
            prop: 'keyword',
            type: 'input'
          }, {
            title: '申请单位',
            prop: 'org',
            props: {
              id: 'orgId',
              label: 'name',
              parentId: 'parentId',
              children: 'children',
              'node-key': 'orgId'
            },
            type: 'select',
            children: []
          }, {
            title: '布控时间',
            prop: 'applyTime',
            type: 'daterange'
          }, {
            title: '申请时间',
            prop: 'createTime',
            type: 'daterange'
          }, {
            title: '审批时间',
            prop: 'spTime',
            type: 'daterange'
          }]
        }
      }
    },
    computed: {
      ...mapState(['surveillance'])
    },
    methods: {
      packup() {
        this.unfoldT = false
      },
      searchSubmit(val) {
        this.obj = val;
        this.loadData(this.pagenav.PageIndex, this.pagenav.PageSize, this.obj)
        this.unfoldT = !this.unfoldT
      },
      sideState(val) {
        console.log(val, 'sideState 2222222222222')
      },
      handleRightSide() {
        this.unfoldT = !this.unfoldT
      },
      loadData(pageIndex = this.pagenav.PageIndex, pageSize = this.pagenav.PageSize, obj = {}) {
        this.dispatch(FETCH_RESULT_LIST, {
          PageIndex: pageIndex,
          PageSize: pageSize,
          keyword: obj ? obj.keyword : '',
          kssj: obj.applyTime[0] ? this.dateFormat(new Date(obj.applyTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          jssj: obj.applyTime[1] ? this.dateFormat(new Date(obj.applyTime[1]), 'yyyy-MM-dd hh:mm:ss') : '',
          cjsj_begin: obj.createTime[0] ? this.dateFormat(new Date(obj.createTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          cjsj_end: obj.createTime[1] ? this.dateFormat(new Date(obj.createTime[1]), 'yyyy-MM-dd hh:mm:ss') : '',
          cjrbmmc: '',
          spsj_begin: obj.spTime[0] ? this.dateFormat(new Date(obj.createTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          spsj_end: obj.spTime[1] ? this.dateFormat(new Date(obj.createTime[1]), 'yyyy-MM-dd hh:mm:ss') : ''
        }).then(() => {
          this.tableData = this.surveillance.fetchResultList.PageData
          this.count = parseInt(this.surveillance.fetchResultList.DataCount)
        })
      },
      handlePageChange(page) {
        this.loadData(page.currentpage, page.limit, this.obj);
      }
    },
    mounted() {
      this.loadData(this.pagenav.PageIndex, this.pagenav.PageSize, this.obj)
      this.getRuleOrgTree('', true).then(d => {
        this.screen.options[1].children = d.map
        this.screen.options[1].children = this.screen.options[1].children[0].children.map(d => {
          return {
            label: d.name,
            value: d.name,
            id: d.orgId
          }
        })
      })
      tableFill(this.$, false, false, this.$(window).height() - 60 - 40 - 68)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 60 - 40 - 68)
      })
    }
  }

</script>
