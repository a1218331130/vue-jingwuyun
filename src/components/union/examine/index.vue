<template>
<div class="side-right-box_div unit-apply">
  <el-tabs v-model="listType" @tab-click="changeList">
    <ul class="top-menu">
      <!-- <li style="margin-top: -35px;margin-right: 10px;">
        <el-button size="mini" icon="icon iconfont icon-refresh" class="import-btn" @click="reload">刷新</el-button>
      </li> -->
      <li style="margin-top: -35px;margin-right: 50px;">
        <!-- <el-button size="mini" icon="plus" class="import-btn add" @click="add">申请</el-button> -->
        <!-- <el-button size="mini" icon="plus" class="import-btn add" @click="newApply('新增申请', '7')">申请</el-button> -->
      </li>
    </ul>
    <!-- 侧栏触发器 -->
    <!-- <span class="unfold-button iconfont icon-fold" @click="switchRightBar"></span> -->

    <el-tab-pane v-for="tab in tabs" :name="tab.id.toString()" :key="tab.id" :label="tab.label">
      <!-- 审批 -->
       <div class="app-content-box" v-if="tab.id===8">
          <do-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe" :xtObjs="xtObjShen" :applyType="'view'"></do-apply> 
      </div> 
      <!-- 查看详情 -->
       <div class="app-content-box" v-if="tab.id===9">
          <add-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe" :xtObjs="xtObj" :applyType="'viewmore'"></add-apply> 
      </div> 
      <!-- 编辑 -->
      <!-- <div class="app-content-box" v-if="tab.id===9">
          <add-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe" :xtObjs="xtObj" :applyType="'edit'"></add-apply> 
      </div> -->
      <div class="app-content-box" v-if="5>tab.id">
        <!-- 待审批 -->
         <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="lists">
            <el-table-column align="center" type="index" label="序号" width="50">
              <template scope="scope">
                {{scope.$index + 1 + 30 * (1 - 1)}}
              </template>
              </el-table-column>
              <el-table-column align="center" label="协同名称" prop="title" width="250"></el-table-column>
              <el-table-column align="center" label="申请人" prop="applyUsername" width="150"></el-table-column>
              <el-table-column align="center" label="申请单位" prop="applyDeptname"></el-table-column>
              <el-table-column align="center" label="协办单位" prop="xbDeptname"></el-table-column>
              <el-table-column align="center" label="申请时间" prop="applyTime" width="200"></el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
                <template scope="scope">
                      <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="查看"  @click="newApply('审批', '8', scope.row)" v-if="tab.id===1">
                        审批
                      </el-button>
                      <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="查看详情" @click="newApply('查看详情', '9', scope.row)" v-if="tab.id===2">
                        查看详情
                      </el-button>
                </template>
              </el-table-column>
            </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
  <div class="app-toolbar" v-if="5 > parseInt(listType)">
      <pagination :count="counts" :pagenav="sendData" @update:pagenav="updatePage"></pagination>
  </div>
  <dialog-form :id="itemId" :dialog="formDialog" @close="formDialog=false" @call:reload="reload"></dialog-form>
  <dialog-detail :dialog="detailDialog" :id="detailId" :type="detailType" @close="detailDialog=false"></dialog-detail>

  <!-- 右侧栏 -->
  <side-right-box class="side-right-box" :unfoldHandle="showRightBar">
    <right-toolbar title="查询列表" :params="screen.queryForm" :options="screen.options" @packup="showRightBar = false" @update:params="searchSubmit"></right-toolbar>
  </side-right-box>

  <div :class="{'el-loading-mask':true,'action':loading}">
    <div class="el-loading-spinner loader--circular"><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg></div>
  </div>
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
    label {
        color: #99a9bf;
    }

    span {
        color: #000;
    }
}
.el-loading-mask {
    display: none;
    &.action {
        display: block;
    }
}
.yellowcolor {
    color: #FFC107;
}
.redcolor {
    color: red;
}
.app-content-box {
  height: calc(100vh - 210px);
}
</style>
<script>
import mixin from '../../../utils/mixin'
import listMixin from '../listMixin'
import { XT_APPROVAL_LIST, XT_APPROVAL_COUNT, XT_DELETE_DRAFT } from '../../../store/types'
import addApply from './add-apply'
import doApply from './do-apply'
// import { clone } from '../../../utils/util'
import '../../../utils/dateFormat'
import { mapState } from 'vuex'
import pagination from '../../../widgets/pagination/pagination'

import dialogForm from '../unionApply/dialog-form'
import dialogDetail from '../detail/dialog-detail'

import sideRightBox from '../../control/side-right-box.vue'
import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'

export default {
  mixins: [mixin, listMixin],
  components: {
    pagination,
    sideRightBox,
    rightToolbar,
    addApply,
    doApply,
    'dialog-form': dialogForm,
    'dialog-detail': dialogDetail
  },
  data() {
    return {
      itemId: null,
      xtTitleByMe: '',
      xtObj: {},
      xtObjShen: {},
      listType: '0',
      counts: 0,
      lists: [],
      sendData: {
        PageIndex: 1,
        PageSize: 50,
        approvalStatus: 0
      },
      tabs: [{
        id: 1,
        label: '待审批',
        sourceLabel: '待审批'
      }, {
        id: 2,
        label: '已审批',
        sourceLabel: '已审批'
      }]
    }
  },
  watch: {
    '$route' (to, from) {
      this.fetchList();
      this.getCounts();
    }
  },
  computed: {
    ...mapState(['union'])
  },
  created() {
    this.fetchList();
  },
  methods: {
    closeTab(val) {
      for(var i = 0; i < this.tabs.length; i++) {
        if(this.tabs[i].label === val) {
          this.tabs.splice(i, 1);
          this.listType = '1';
          this.fetchList();
          this.getCounts();
          return;
        }
      }
    },
    changeList(val) {
      if(val.name > 7) {
        this.xtTitleByMe = val.label;
      }
      if(parseInt(this.listType) >= 7) {
        return;
      }
      this.fetchList();
    },
    // 获取列表
    fetchList() {
      this.sendData.approvalStatus = parseInt(this.listType) - 1;
      this.dispatch(XT_APPROVAL_LIST, this.sendData).then(() => {
        console.log(this.union, 'this.union');
        this.lists = this.union.xtApprovalList.PageData.map(d => {
          return {
            id: d.id,
            detailid: d.id,
            applyId: d.applyId,
            attachmentId: d.attachmentId,
            title: d.title,
            applyUsername: d.applyUsername,
            applyDeptname: d.applyDeptname,
            xbDeptname: d.xbDeptname,
            applyTime: d.applyTime,
            createTime: d.createTime,
            caseId: d.caseId,
            caseJyaq: d.caseJyaq,
            caseNum: d.caseNum,
            emergency: parseInt(d.emergency),
            existClue: d.existClue,
            approvalNode: d.approvalNode,
            approvalPersonid: d.approvalPersonid,
            approvalPersonname: d.approvalPersonname,
            approvalStatus: d.approvalStatus
          }
        })
        this.counts = this.lists.length;
      })
    },
    // add() {
    //   if(this.checkRule('Xtbg/Add') === true) {
    //     this.itemId = null
    //     this.formDialog = true
    //   }
    // },
        // 新增布控
    newApply(name, num, obj) {
      var tab = {
        id: parseInt(num),
        label: name,
        sourceLabel: name
      };
      for(var i = 0; i < this.tabs.length; i++) {
        if(this.tabs[i].label === name) {
          this.xtTitleByMe = name;
          if(name === '查看详情') {
            this.xtObj = obj;
          }else if(name === '审批') {
            this.xtObjShen = obj;
          }
          this.listType = num;
          return;
        }
      }
      this.tabs.push(tab);
      this.xtTitleByMe = name;
      if(name === '查看详情') {
        this.xtObj = obj;
        console.log(this.xtObj, 'this.xtObjsthis.xtObjs121212');
      }else if(name === '审批') {
        this.xtObjShen = obj;
      }
      this.listType = num;
    },
    xtDelete(item) {
      this.$confirm('确定要删除此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.dispatch(XT_DELETE_DRAFT, { id: item.detailid }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
            showClose: true
          })
          this.reload()
        })
      })
    },
    getCounts() {
      this.dispatch(XT_APPROVAL_COUNT).then(() => {
        console.log(this.union.xtApplyCount, 'this.union.xtApplyCount');
        this.tabs[0].label = `${this.tabs[0].sourceLabel}(${this.union.xtApprovalCount[0]})`
        this.tabs[1].label = `${this.tabs[1].sourceLabel}(${this.union.xtApprovalCount[1]})`
      })
    }
  }
}
</script>
