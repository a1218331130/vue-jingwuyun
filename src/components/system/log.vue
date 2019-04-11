<template>
  <div>
    <tabs :tab="tab"></tabs>
    <div class="app-toolbar clearfix">
      <transition enter-active-class="animated slideInUp">
        <el-form :inline="true" label-position="right" label-width="80px">
          <el-form-item prop="beginDate" label="起始日期">
            <el-date-picker v-model="dateBE" type="daterange" placeholder="请选择"
                            :picker-options="limitDateFun"></el-date-picker>
          </el-form-item>
          <el-form-item prop="keyword" label="关键字">
            <el-input v-model="logItem.Keyword"></el-input>
          </el-form-item>
          <el-form-item prop="logType" label="操作类型">
            <el-select v-model="logItem.LogType" placeholder="请选择">
              <el-option label="登录" value="0"></el-option>
              <el-option label="查询" value="1"></el-option>
              <el-option label="新增" value="2"></el-option>
              <el-option label="修改" value="3"></el-option>
              <el-option label="删除" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="menuId" label="菜单名称">
            <tree-dialog :onlyShowCount="true" :data="$store.getters.menuTree" :defaultProps="defaultProps"
                         :value="checked" @check-change="handleChange"> {{checked.length > 0 ? '查看已选' : '选择菜单'}}
            </tree-dialog>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </transition>
    </div>
    <div class="app-content-box">
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true"
                :data="log.PageData">
        <el-table-column type="index" label="序号" align="center" width="60">
          <template scope="scope">
            {{scope.$index + 1 + logItem.PageSize * (logItem.PageIndex - 1)}}
          </template>
</el-table-column>
<!-- 用户名称、警号、操作类型、菜单名称、服务总线名称、操作时间、内容、IP	 -->
<el-table-column prop="UserName" label="用户名称" align="center" width="150"></el-table-column>
<el-table-column prop="UserCode" label="警号" align="center" width="150"></el-table-column>
<el-table-column prop="LogType" label="操作类型" align="center" width="80">
  <template scope="scope">
            {{scope.row.LogType == 0 ? '登录' : scope.row.LogType == 1 ? '查询' : scope.row.LogType == 2 ? '新增' : scope.row.LogType == 3 ? '修改' : scope.row.LogType == 4 ? '删除' : '未知动作 - ' + scope.row.LogType}}
          </template>
</el-table-column>
<el-table-column prop="MenuName" label="菜单名称"></el-table-column>
<el-table-column prop="ActionName" label="服务总线名称"></el-table-column>
<el-table-column prop="CreatedTime" label="操作时间" align="center" width="150"></el-table-column>
<el-table-column prop="Detail" label="内容"></el-table-column>
<el-table-column prop="LoginIp" label="IP" align="center" width="120"></el-table-column>
</el-table>
</div>
<div class="app-toolbar">
  <pagination :count="log.DataCount" :pagenav="{limit: logItem.PageSize,currentpage: logItem.PageIndex}" @update:pagenav="handlePageChange"></pagination>
</div>
</div>
</template>

<style scoped>
  .log-expand {
    font-size: 0;
  }

  .log-expand label {
    color: #99a9bf;
  }

  .log-expand span {
    color: #000;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import { FETCH_LOG, FETCH_SYS_MENU } from '../../store/types'
  import mixin from '../../utils/mixin'
  import TreeDialog from '../../widgets/tree-dialog/tree-dialog.vue'
  import pagination from '../../widgets/pagination/pagination'
  import { tableFill } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      Tabs,
      TreeDialog
    },
    data() {
      return {
        limitDateFun: { // 日期选择范围
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        dateBE: '',
        tab: null,
        logItem: {
          UserID: '',
          Keyword: '',
          LogType: '',
          MenuId: '',
          BeginDate: '',
          EndDate: '',
          PageIndex: 1,
          PageSize: 10
        },
        checked: [],
        defaultProps: {
          children: 'children',
          label: 'name',
          id: 'menuId'
        }
      }
    },
    computed: {
      ...mapState(['users', 'log', 'menus'])
    },
    methods: {
      logList() {
        this.dispatch(FETCH_LOG, this.logItem)
      },
      fetchMenu() {
        this.dispatch(FETCH_SYS_MENU)
      },
      handleChange(val) {
        this.checked = val;
      },
      handleSearch() {
        let checkedArry = [];
        this.checked.forEach(item => {
          checkedArry.push(item.menuId)
        });
        this.logItem.MenuId = checkedArry.join(',');
        this.logItem.BeginDate = this.dateBE[0]; // dateFormat(new Date(this.dateBE[0]), 'yyyy-MM-dd')
        this.logItem.EndDate = this.dateBE[1]; // dateFormat(new Date(this.dateBE[1]), 'yyyy-MM-dd')
        !this.loading && this.logList();
      },
      handlePageChange(obj) {
        this.logItem.PageIndex = obj.currentpage;
        this.logItem.PageSize = obj.limit;
        !this.loading && this.logList()
      },
      handlePageSizeChange(size) {
        this.logItem.PageSize = size;
        !this.loading && this.logList()
      }
    },
    mounted() {
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.tab = {
        label: '系统日志',
        name: this.$route.path
      }
      this.logList();
      this.fetchMenu();
    }
  }

</script>
