<template>
  <div>
    <div class="app-toolbar clearfix">
      <transition enter-active-class="animated slideInUp">
        <el-form :inline="true" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作人" prop="name">
            <el-select v-model="logItem.UserId" @change="selectUserInfo" filterable remote clearable :remote-method="nameRemoteScreen" :loading="selectQueryLoading" style="width: 100%" placeholder="输入姓名关键字搜索">
              <el-option style="height: auto" v-for="(item,ik) in userList" :key="ik" :label="item.name" :value="item.userId">
                <div class="select-option_div">
                  <b>{{item.name}}</b><br/>
                  <span style="font-size: 12px;line-height: 1">{{item.num}}<br/></span>
                  <span style="font-size: 12px;line-height: 1">{{item.unitText}}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
            </el-col>
          <el-col :span="8">
<el-form-item prop="menuId" label="菜单名称">
            <el-select v-model="logItem.FristMenuId" placeholder="请选择" @change="handleChange" filterable clearable>
              <el-option label="查询" value="1" v-for="(item,index) in FristMenuList" :key="index" :label="item.name" :value="item.menuId"></el-option>
            </el-select>
            <el-select v-model="logItem.SecendMenuId" placeholder="请选择" filterable clearable>
              <el-option label="查询" value="1" v-for="(item,index) in SecendMenuList" :key="index" :label="item.BBH ? item.ZFBT : item.NAME" :value="item.BBH ? item.ID : item.MENU_ID"></el-option>
            </el-select>
          </el-form-item>
          </el-col :span="8">
            <el-form-item prop="logType" label="操作类型">
              <el-select v-model="logItem.HandleType" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="查询" value="1"></el-option>
                <el-option label="新增" value="2"></el-option>
                <el-option label="修改" value="3"></el-option>
                <el-option label="删除" value="4"></el-option>
                <el-option label="导出" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="描述">
                <el-input v-model="logItem.KeyWord" placeholder="搜索描述关键字"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="beginDate" label="起始日期">
                <el-date-picker v-model="dateBE" format="yyyy-MM-dd HH:mm:ss" @change="dateChange" type="datetimerange" placeholder="选择时间范围" :picker-options="limitDateFun"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </transition>
    </div>
    <div class="app-content-box logTable">
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="logLoading" element-loading-text="数据加载中..." border :stripe="true"
                :data="handleLogList" style="width:99%;" @sort-change="sortChange">
        <el-table-column type="index" label="序号" align="center" width="50">
          <template scope="scope">
            {{scope.$index + 1 + logItem.PageSize * (logItem.PageIndex - 1)}}
          </template>
</el-table-column>
<!-- 用户名称、警号、操作类型、菜单名称、服务总线名称、操作时间、内容、IP	 -->
<el-table-column prop="fristMenuName" label="一级菜单" align="center" width="100"></el-table-column>
<el-table-column prop="secendMenuName" label="二级菜单" align="center" width="200"></el-table-column>
<el-table-column prop="handleTypeName" label="操作类型" align="center" width="80"></el-table-column>
<el-table-column prop="loginIp" label="访问IP" align="center" width="150" sortable="'custom'"></el-table-column>
<el-table-column prop="detail" label="操作描述" align="center"></el-table-column>
<el-table-column prop="userName" label="操作人" align="center" width="100" sortable="'custom'"></el-table-column>
<el-table-column prop="userOrgName" label="所属单位" align="center" width="200" sortable="'custom'"></el-table-column>
<el-table-column prop="createdTime" label="操作时间" align="center" width="180" sortable="'custom'"></el-table-column>
</el-table>
</div>
<div class="app-toolbar">
  <pagination :count="Number(count)" :pagenav="{limit: logItem.PageSize,currentpage: logItem.PageIndex}" @update:pagenav="handlePageChange"></pagination>
</div>
</div>
</template>
<style>
  .logTable .el-table__body-wrapper {
    overflow-x: hidden;
  }

</style>
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

  .el-date-editor--datetimerange.el-input {
    width: 320px;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import { GET_SYS_HANDLE_LOG_BY_PAGE, FETCH_USER_LIST_BY_KEYWORD, GET_MENU_FOR_SELECT } from '../../store/types'
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
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end])
            }
          }]
        },
        dateBE: '',
        logItem: {
          UserId: '',
          KeyWord: '',
          FristMenuId: '',
          SecendMenuId: '',
          HandleType: '',
          StartTime: '',
          EndTime: '',
          PageIndex: 1,
          PageSize: 100
        },
        currentTableListUser: [], // 当前列表存在的用户
        selectQueryLoading: false, // 远程搜索loading
        userList: [],
        FristMenuList: [],
        SecendMenuList: [],
        handleLogList: null,
        logLoading: true,
        count: ''
      }
    },
    computed: {
      ...mapState(['users', 'log', 'currentTabelList', 'handleLog'])
    },
    methods: {
      // 排序
      sortChange(column) {
        // console.log(column);
        // this.queryForm.sortField = column.prop;
        // if(column.order === 'ascending') {
        //   this.queryForm.sortBy = 'asc';
        // } else {
        //   this.queryForm.sortBy = 'desc';
        // }
        // this.query();
      },
      initData() {
        this.dispatch(GET_MENU_FOR_SELECT).then(() => {
          this.FristMenuList = this.handleLog.getMenuForSelect
          this.logList()
        })
      },
      logList() {
        this.logLoading = true
        this.dispatch(GET_SYS_HANDLE_LOG_BY_PAGE, this.logItem).then(() => {
          this.handleLogList = this.handleLog.getSysHandleLogByPage.PageData
          this.count = this.handleLog.getSysHandleLogByPage.DataCount
          if (this.handleLogList.length > 0) {
            this.logLoading = false
          }
        })
      },
      handleChange() {
        this.logItem.SecendMenuId = ''
        this.FristMenuList.forEach(d => {
          if (this.logItem.FristMenuId === d.menuId) {
            this.SecendMenuList = d.secendMenu
          }
        })
      },
      handleSearch() {
        !this.loading && this.logList()
      },
      dateChange(val) {
        let timeArr = val.split(' - ')
        this.logItem.StartTime = timeArr[0]
        this.logItem.EndTime = timeArr[1]
      },
      handlePageChange(obj) {
        this.logItem.PageIndex = obj.currentpage;
        this.logItem.PageSize = obj.limit;
        !this.loading && this.logList()
      },
      handlePageSizeChange(size) {
        this.logItem.PageSize = size;
        !this.loading && this.logList()
      },
      /**
       * 填充关联信息
       * @param item
       */
      selectUserInfo(item) {
        this.userList.map(ri => {
          if (ri.userId === item) {
            let _te = this.editForm
            this.editForm = Object.assign(_te, ri)
          }
        })
      },
      /**
       * 根据关键条件查询民警信息列表
       */
      queryPoliceInfo(condition, callback = () => {}) {
        this.dispatch(FETCH_USER_LIST_BY_KEYWORD, condition).then(d => {
          callback()
        })
      },
      /**
       * 姓名远程筛选
       * @param keyword
       */
      nameRemoteScreen(keyword) {
        if (keyword !== '' && this.dialogMode !== 'edit') {
          this.selectQueryLoading = false
          this.queryPoliceInfo({
            name: keyword
          }, () => {
            this.userList = this.users.fetchUserListByKeyword.filter(rf => !this.currentTableListUser.includes(rf.userId)).map(r => {
              return {
                userId: r.userId,
                name: r.xm, // 姓名
                num: r.code, // 警号
                unit: r.orgId, // 单位id
                mobile: r.mobile, // 职位
                unitText: r.orgname // 单位名称
              }
            })
            this.selectQueryLoading = false
          })
        } else {
          this.userList = []
        }
      }
    },
    mounted() {
      this.initData()
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    created() {}
  }

</script>
