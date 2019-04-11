<template>
<!--话单管理-->
<div class="tel-list" v-loading="loading" element-loading-text="数据加载中……">
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div class="tabs__item" :title="datas.phone+'  '+datas.name">
          {{datas && datas.phone ? (datas.phone+'&nbsp&nbsp['+datas.name+']'):''}}
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>
  <div class="tabs-box">
    <div class="tabs-box__item">
      <!-- 查询结果 -->
        <!-- :h="440" -->
        <list :list="listData" :tab="tabList" :pagenav="pageInfo"></list>
        <div class="app-toolbar footer">
          <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
        </div>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .tel-list {
    height: 100%;
  }

  .tabs__item {
    color: rgba(32, 160, 225, 1);
    border: none;
    background-color: transparent;
  }

</style>
<script>
  import telListMixin from '../telListMixin'
  import { FETCH_PERSON_COMMUNICATE_LIST } from '../../../../store/types'
  import list from './list'
  import pagination from '../../../../widgets/pagination/pagination'
  export default {
    mixins: [telListMixin],
    components: {
      list,
      pagination
    },
    data() {
      return {
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 50,
          currentpage: 1
        },
        listData: [],
        commName: 'listManage',
        resBox: false,
        tabList: [
          { label: '主叫号码', prop: 'zjhm' },
          { label: '对方姓名', prop: 'xm' },
          { label: '对方身份证号', prop: 'DFSFZHM' },
          { label: '对方号码', prop: 'dfhm' },
          { label: '对方职位', prop: 'zw' },
          { label: '对方号码归属地', prop: 'gsd' },
          { label: '通话地点', prop: 'thd' },
          { label: '通话地址', prop: 'thdd' },
          { label: '呼叫类型', prop: 'hjlx' },
          { label: '通话日期', prop: 'thrq' },
          { label: '通话时间', prop: 'thsj' },
          { label: '时长(秒)', prop: 'thsc' },
          { label: '星期', prop: 'xq' }
        ]
      }
    },
    props: ['datas'],
    watch: {
      'datas.phone': {
        handler: function(val) {
          this.fecthCommunicateList(val)
        },
        deep: true
      }
    },
    methods: {
      fecthCommunicateList(val) {
        this.dispatch(FETCH_PERSON_COMMUNICATE_LIST, { V_SJHM: val, V_PAGEINDEX: this.pageInfo.currentpage, V_PAGESIZE: this.pageInfo.limit }).then(() => {
          this.listData = this.analysisTelList.communicateList.THMXModelList;
          this.pageInfo.count = this.analysisTelList.communicateList.TotalCount
        });
      },
      /**
       * 分页操作
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.query()
      },
      query() {
        this.fecthCommunicateList(this.datas.phone)
      }
    },
    created() {},
    mounted() {}
  }

</script>
