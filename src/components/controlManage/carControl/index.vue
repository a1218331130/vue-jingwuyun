<template>
<div class="side-right-box_div control-manage-apply" v-loading="loading">
  <el-tabs v-model="currentTab" @tab-click="changeList">
    <ul class="top-menu">
      <li style="margin-top: -35px;margin-right: 50px;">
        <el-button icon="plus" class="import-btn add" @click="newAdd('新增车辆布控', '7')" title="申请" style="vertical-align: middle; height: 32px;line-height: 32px;padding: 0 15px;">新增车辆布控</el-button>
      </li>
    </ul>
    <!-- 侧栏触发器 -->
    <!-- <span class="unfold-button iconfont icon-fold" @click="handleRightSide"></span> -->

    <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id.toString()">
      <span slot="label">{{tab.label}}</span>
      <div class="app-content-box">
<!-- 草稿 -->
<el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="carList" v-if="7 > parseInt(currentTab)">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
<el-table-column align="center" label="布控名称" prop="bkmc" width="250"></el-table-column>
<el-table-column align="center" label="布控对象" prop="bkdx"></el-table-column>
<el-table-column align="center" label="申请类型" prop="sqlx" width="150" v-if="tab.id===1">
   <template scope="scope">
        <span v-if="scope.row.sqlx==='1'">新增</span>
        <span v-if="scope.row.sqlx==='2'">续控</span>
        <span v-if="scope.row.sqlx==='3'">撤控</span>
  </template>
</el-table-column>
<el-table-column align="center" label="起始时间" prop="kssj" width="150" v-if="tab.id!==5 && tab.id!==4">
     <template scope="scope">
              <span>{{scope.row.kssj | dateFormat }}</span>
    </template>
</el-table-column>
<el-table-column align="center" label="截止时间" prop="jssj" width="150" v-if="tab.id!==5">
  <template scope="scope">
              <span>{{scope.row.jssj | dateFormat }}</span>
    </template>
</el-table-column>
<el-table-column align="center" label="申请时间" prop="xgsj" width="150" v-if="tab.id===4">
  <template scope="scope">
              <span>{{scope.row.xgsj | dateFormat }}</span>
    </template>
</el-table-column>
<el-table-column align="center" label="申请时间" prop="sqsj" width="150" v-if="tab.id!==5 && tab.id!==4">
  <template scope="scope">
              <span>{{scope.row.sqsj | dateFormat }}</span>
    </template>
</el-table-column>
<!-- <el-table-column align="center" label="审批时间" prop="spsj" width="150" v-if="tab.id===2 || tab.id===3"></el-table-column> -->
<!-- <el-table-column align="center" label="最后对比时间" prop="zxyjsj" width="150" v-if="tab.id===2 || tab.id===3"></el-table-column> -->
<el-table-column align="center" label="创建时间" prop="cjsj" width="150" v-if="tab.id===5">
   <template scope="scope">
              <span>{{scope.row.cjsj | dateFormat }}</span>
    </template>
</el-table-column>
<el-table-column align="center" label="撤销时间" prop="cxsj" width="150" v-if="tab.id===4">
  <template scope="scope">
              <span>{{scope.row.cxsj | dateFormat }}</span>
    </template>
</el-table-column>
<el-table-column align="center" label="撤销类型" prop="bkztmc" width="100" v-if="tab.id===4"></el-table-column>
<el-table-column align="center" label="申请人" prop="sqr" width="150">
</el-table-column>
<el-table-column align="center" label="申请单位" prop="sqdw" width="200"></el-table-column>
<el-table-column align="center" label="操作" width="250">
    <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
    <template scope="scope">
              <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="编辑" @click="newAdd('编辑车辆布控', '8', scope.row.bkid)" v-if="tab.id===5">
                编辑
              </el-button>
              <el-button type="primary" size="mini" icon="icon iconfont icon-export" title="删除" @click="deleteCar(scope.row.bkid)" v-if="tab.id===5">
                删除
              </el-button>
              <el-button type="primary" size="mini" icon="icon iconfont icon-export" title="撤控" @click="newAdd('撤控', '12', scope.row.bkid)" v-if="tab.id===2 || tab.id===3">
                撤控
              </el-button>
              <el-button type="primary" size="mini" icon="icon iconfont icon-export" title="续控" @click="newAdd('续控', '10', scope.row.bkid)" v-if="tab.id===2 || tab.id===3">
                续控
              </el-button>
              <el-button type="primary" size="mini" icon="icon iconfont icon-export" title="查看详情"  @click="newAdd('查看详情', '9', scope.row.bkid)" v-if="tab.id!==5">
                查看
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 新增布控 -->
<add-control v-if="tab.id===7" @closeTabs="closeTab"></add-control>
<!-- 编辑 -->
<edit-control v-if="tab.id===8" @closeTabs="closeTab" :carId="carIdsEdit" :carTitle="carTitles"></edit-control>
<!-- 查看 -->
<view-control v-if="tab.id===9" @closeTabs="closeTab" :carId="carIdsView" :carTitle="carTitles"></view-control>
<!-- 续控 -->
<xu-control v-if="tab.id===10" @closeTabs="closeTab" :carId="carIdsXu" :carTitle="carTitles"></xu-control>
<!-- 撤控 -->
<ce-control v-if="tab.id===12" @closeTabs="closeTab" :carId="carIdsCe" :carTitle="carTitles"></ce-control>
</div>
</el-tab-pane>
</el-tabs>
<!-- @update:pagenav="handlePageChange" -->
<div class="app-toolbar" style="position:absolute;width:100%;bottom:0;padding:12px 0;" v-if="7 > parseInt(currentTab)">
  <pagination :count="carCount" :pagenav="sendData"></pagination>
</div>
<!-- 申请 -->
<dialog-form :dialog="formDialog" @close="dialogFormClose" @success="applySuccess" @openNotifPersonDialog="openNotifPersonDialog" @openNotifUnitDialog="openNotifUnitDialog" :notifPerson="dialogData.notifPerson" :notifUnit="dialogData.notifUnit" :data="detailData"
  :type="statusType">
</dialog-form>
<!-- 查看详情 -->
<dialog-form :dialog="detailFormDialog" @close="dialogFormClose" @success="applySuccess" @openNotifPersonDialog=" openNotifPersonDialog" @openNotifUnitDialog="openNotifUnitDialog" :notifPerson="dialogData.notifPerson" :notifUnit="dialogData.notifUnit"
  :data="detailData" :type="statusType">
</dialog-form>
<!-- 编辑 -->
<dialog-form :dialog="editFormDialog" @close="dialogFormClose" @success="applySuccess" @openNotifPersonDialog=" openNotifPersonDialog" @openNotifUnitDialog="openNotifUnitDialog" :notifPerson="dialogData.notifPerson" :notifUnit="dialogData.notifUnit" :data="detailData"
  :type="statusType">
</dialog-form>

<user-selector :dialog="chooseNotifPersonDialog" @update:value="updateNotifPerson" size="middle--user" @close="chooseNotifPersonDialog=false"></user-selector>

<unit-selector :dialog="chooseNotifUnitDialog" @update:value="val=>dialogData.notifUnit=val" size="middle--user" @close="chooseNotifUnitDialog=false"></unit-selector>

<!-- 右侧栏 -->
<!-- <side-right-box :unfoldHandle="unfoldT">
  <right-toolbar title="查询列表" :diffrent="1" :params="screen.queryForm" :options="screen.options" @packup="packup" @update:params="updateData"></right-toolbar>
</side-right-box> -->

</div>
</template>
<style lang="scss" scoped>

  .apply-query-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .log-expand {
    font-size: 0;
  }

  .log-expand label {
    color: #99a9bf;
  }

  .log-expand span {
    color: #000;
  }

  .app-content-box {
    overflow-y: auto;
  }

  .el-tabs {
    margin-bottom: 10px;
  }

  .el-dialog .el-dialog--large .el-dialog__body {
    padding: 15px;
    max-height: calc(75vh - 150px);
    overflow: auto;
    background-color: #F5F5F5;
  }

</style>
<!-- 申请按钮样式 -->
<style lang="scss">
  /* .tactics-apply {
    .app-toolbar {
      .text-right {
        .el-button:active,
        .el-button:focus,
        .el-button:hover {
          background-color: #FF9900;
          color: #fff;
          border-color: #FF9900;
        }
      }
    }
  } */

  .side-right-box_div.control-manage-apply {
    .app-table {
      .el-table__body-wrapper {
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: 700px;
      }
    }
  }

</style>
<script>
  import pagination from '../../../widgets/pagination/pagination'
  import { mapState } from 'vuex'
  import { GET_CAR_LIST_CONTROL, GET_CAR_COUT_CONTROL, GET_SURVEILLANCE_COUNT, GET_CARDELETE_CONTROL } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  // import { clone } from '../../../utils/util'
  import dialogForm from './dialog-form'
  import addControl from './add-control'
  import editControl from './edit-control'
  import viewControl from './view-control'
  import xuControl from './xu-control'
  import ceControl from './ce-control'
  import userselector from '../../../widgets/user-selector/user-selector'
  import unitselector from '../../../widgets/unit-selector/unit-selector'
  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      editControl,
      xuControl,
      ceControl,
      viewControl,
      dialogForm,
      addControl,
      sideRightBox,
      rightToolbar,
      'user-selector': userselector,
      'unit-selector': unitselector
    },
    data: () => ({
      currentTab: '1',
      carIdsEdit: '',
      carIdsView: '',
      carIdsCe: '',
      carIdsXu: '',
      carTitles: '',
      tabCar: '',
      dialogData: {
        notifPerson: [],
        notifUnit: []
      },
      current: 0,
      pagenav: {
        currentpage: 1,
        limit: 100,
        bklx: 2,
        taptype: 1
      },
      tabs: [{
        bkflag: 'dsp',
        bkzt: 2,
        id: 1,
        label: '待审批 (0)'
      }, {
        bkflag: 'wks',
        bkzt: 3,
        id: 2,
        label: '未开始 (0)'
      }, {
        bkflag: 'jxz',
        bkzt: 3,
        id: 3,
        label: '进行中 (0)'
      }, {
        bkflag: 'yjs',
        bkzt: 3,
        id: 4,
        label: '已结束(0) '
      }, {
        bkflag: 'cg',
        bkzt: 1,
        id: 5,
        label: '草稿箱 (0)'
      }],
      statusType: 1, // 1是申请按钮进入,2详情按钮进入,3编辑按钮
      unfoldT: false,
      detailData: {},
      sendData: {
        PageIndex: 1,
        PageSize: 50,
        bklx: 2,
        taptype: 1
      },
      count: 0,
      carCount: 0,
      formDialog: false,
      editFormDialog: false,
      detailFormDialog: false,
      carList: [],
      chooseNotifPersonDialog: false,
      chooseNotifUnitDialog: false
    }),
    computed: {
      ...mapState(['surveillance'])
    },
    methods: {
      // 删除车辆布控
      deleteCar(id) {
        this.$confirm('确定要删除此项?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(GET_CARDELETE_CONTROL, { id: id }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.sendData.taptype = '5';
            this.fetchList();
            this.fetchCount();
          })
        })
      },
      updateNotifPerson(val) {
        this.dialogData.notifPerson = val
      },
      fetchList() {
        this.dispatch(GET_CAR_LIST_CONTROL, this.sendData).then(() => {
          console.log(this.surveillance.getCarListControl.PageData, 'this.surveillance.getCarListControl.PageData');
          this.carList = this.surveillance.getCarListControl.PageData;
          // this.list = this.surveillance.getCarListControl.PageData.map(d => {
          //   return {
          //     id: d.bkid,
          //     bkmc: d.bkmc,
          //     kssj: d.kssj,
          //     jssj: d.jssj,
          //     sqr: d.sqr,
          //     sqdw: d.sqdw,
          //     bkdx: d.bkdx
          //   }
          // })
          if (this.carList.length > 0) {
            this.carCount = this.carList.length
          }
        })
      },
      // 关闭窗口
      closeTab(val) {
        for(var i = 0; i < this.tabs.length; i++) {
          if(this.tabs[i].label === val) {
            this.tabs.splice(i, 1);
            this.currentTab = '1';
            this.sendData.taptype = '1';
            this.fetchList();
            this.fetchCount();
            return;
          }
        }
      },
      // 新增布控
      newAdd(name, num, myId) {
        var tab = {
          bkflag: 'cg',
          bkzt: 1,
          id: parseInt(num),
          label: name
        };
        for(var i = 0; i < this.tabs.length; i++) {
          if(this.tabs[i].label === name) {
            this.currentTab = num;
            if(name === '编辑车辆布控') {
              this.carIdsEdit = myId;
            }else if(name === '查看详情') {
              this.carIdsView = myId;
            }else if(name === '撤控') {
              this.carIdsCe = myId;
            }else if(name === '续控') {
              this.carIdsCe = myId;
            }
            // this.carIdsEdit = myId;
            // this.carIdsView = myId;
            // this.carIdsXu = myId;
            // this.carIdsCe = myId;
            this.carTitles = name;
            return;
          }
        }
        this.tabs.push(tab);
        if(name === '编辑车辆布控') {
          this.carIdsEdit = myId;
        }else if(name === '查看详情') {
          this.carIdsView = myId;
        }else if(name === '撤控') {
          this.carIdsCe = myId;
        }else if(name === '续控') {
          this.carIdsXu = myId;
        }
        this.carTitles = name;
        this.currentTab = num;
      },
      lookDetail(val) { // 查看详情
        this.detailFormDialog = true;
        this.statusType = 2
      },
      applySuccess(val) {
        this.formDialog = false
        this.count++;
      },
      dialogFormClose() {
        this.formDialog = false
        this.detailFormDialog = false
        this.editFormDialog = false
        this.chooseNotifPersonDialog = false
        this.chooseNotifUnitDialog = false
      },
      // 判断下我们的对象策略是否为空
      openNotifPersonDialog() {
        this.chooseNotifPersonDialog = true
      },
      openNotifUnitDialog() {
        this.chooseNotifUnitDialog = true
      },
      changeList(val) {
        // alert(val);
        this.sendData.taptype = this.currentTab;
        console.log(this.currentTab, 'valvalvalvalval');
        this.fetchList()
      },
      fetchCount() {
        this.dispatch(GET_CAR_COUT_CONTROL, {bklx: '2'}).then(() => {
          let getCount = this.surveillance.getCarCoutControl;
          this.tabs[4].label = this.tabs[4].label.substr(0, 3) + '(' + getCount.cgx + ')';
          this.tabs[3].label = this.tabs[3].label.substr(0, 3) + '(' + getCount.yjs + ')';
          this.tabs[2].label = this.tabs[2].label.substr(0, 3) + '(' + getCount.jxz + ')';
          this.tabs[1].label = this.tabs[1].label.substr(0, 3) + '(' + getCount.wks + ')';
          this.tabs[0].label = this.tabs[0].label.substr(0, 3) + '(' + getCount.dsp + ')';
        })
      }
    },
    created() {
      this.fetchCount()
      this.fetchList()
      this.dispatch(GET_SURVEILLANCE_COUNT).then(() => {
        this.count = this.surveillance.surveillanceCount.cltotal || 0
      })
    }
  }

</script>
