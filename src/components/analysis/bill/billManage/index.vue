<!-- 基本账户分析 -->
<template>
<div class="bill-list" v-loading="loading" element-loading-text="拼命分析计算中……">
<el-row class="el-row analysis-topbar">
  <el-col :span="20">
<div class="tabs">
<div class="tabs__item" :title="datas.billNumber+'  '+datas.name">
 {{datas && datas.billNumber ? (datas.billNumber+'&nbsp&nbsp['+datas.name+']'):''}}
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
    <list :list="listData" :pagenav="pageInfo" :tab="tabList" H="180"></list>
    <div class="app-toolbar footer">
      <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="pagenavChange"></pagination>
    </div>
  </div>
</div>
</div>
</template>

<style lang="scss" scoped>
  .bill-list {
    height: 100%;
  }

  .tabs__item {
    color: rgba(32, 160, 225, 1);
    border: none;
    background-color: transparent;
  }

</style>

<script>
  import { FETCH_BILL_PERSON_LIST } from '../../../../store/types'
  import billMixin from '../billMixin'
  import list from './list'
  // import searchBox from '../../search-tool'
  import pagination from '../../../../widgets/pagination/pagination'
  export default {
    mixins: [billMixin],
    components: { pagination, list },
    data() {
      return {
        commName: 'basic',
        singleTab: true,
        detailGuid: 0,
        listData: [], // 获取的个人账单数据
        title: '',
        subtext: '',
        pageInfo: { // 页面分页信息相关配置 默认限制每页十条
          count: 10,
          limit: 50,
          currentpage: 1
        },
        tabList: [
          { label: '姓名', prop: 'khm' },
          { label: '主账号', prop: 'zzh' },
          { label: '对方开户名', prop: 'dfkhm' },
          { label: '对方账号', prop: 'dfzh' },
          { label: '对方身份证号码', prop: 'dfsfzhm' },
          { label: '交易金额', prop: 'jyje' },
          { label: '对方账户所属行', prop: 'dfzhssh' },
          { label: '单位名称', prop: 'dwmc' },
          { label: '交易日期', prop: 'jyrq' }
        ]
      }
    },
    props: ['datas'],
    computed: {},
    watch: {
      'datas.billNumber': {
        handler: function(val) { this.fetchBillList(val) },
        deep: true
      }
    },
    methods: {
      pagenavChange(obj) { // 分页切换操作
        this.pageInfo.limit = obj.limit
        this.pageInfo.currentpage = obj.currentpage
        this.query()
      },
      fetchBillList(val) {
        this.dispatch(FETCH_BILL_PERSON_LIST, { v_zzh: val, v_pageindex: this.pageInfo.currentpage, v_pageSize: this.pageInfo.limit }).then(() => {
          this.listData = this.analysisBill.billPersonList.DetailList;
          this.pageInfo.count = this.analysisBill.billPersonList.totalcount
        });
      },
      query() {
        this.fetchBillList(this.billNumber)
      }
    },
    created() {},
    mounted() {}
  }

</script>
