<template>
<div class="side-right-box_div unit-apply">
  <el-tabs v-model="listType" @tab-click="changeList">
    <ul class="top-menu">
      <!-- <li style="margin-top: -35px;margin-right: 10px;">
        <el-button size="mini" icon="icon iconfont icon-refresh" class="import-btn" @click="reload">刷新</el-button>
      </li> -->
      <li style="margin-top: -35px;margin-right: 50px;">
        <!-- <el-button size="mini" icon="plus" class="import-btn add" @click="add">申请</el-button> -->
        <el-button size="mini" icon="plus" class="import-btn add" @click="newApply('新增申请', '7')">申请</el-button>
      </li>
    </ul>
    <!-- 侧栏触发器 -->
    <!-- <span class="unfold-button iconfont icon-fold" @click="switchRightBar"></span> -->

    <el-tab-pane v-for="tab in tabs" :name="tab.id.toString()" :key="tab.id" :label="tab.label">
      <!-- 新增申请 -->
      <div class="app-content-box" v-if="tab.id===7">
          <add-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe"></add-apply> 
      </div>
      <!-- 查看申请 -->
      <div class="app-content-box" v-if="tab.id===8">
          <add-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe" :xtObjs="xtObj" :applyType="'view'"></add-apply> 
      </div>
      <!-- 编辑 -->
      <div class="app-content-box" v-if="tab.id===9">
          <do-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe" :xtObjs="xtObjEdit" :applyType="'edit'"></do-apply> 
      </div>
      <!-- 评论 -->
      <div class="app-content-box" v-if="tab.id===10">
          <ping-apply @closeTabs="closeTab" :xtTitles="xtTitleByMe" :xtObjs="xtObjComment" :applyType="'commit'"></ping-apply> 
      </div>
      <div class="app-content-box" v-if="7>tab.id">
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
              <el-table-column align="center" label="协办单位" prop="xbDeptname" v-if="tab.id===1 || tab.id===6"></el-table-column>
              <el-table-column align="center" label="协办人" prop="applyUsername" width="150" v-if="tab.id===2 || tab.id===4 || tab.id===5"></el-table-column>
              <el-table-column align="center" label="申请时间" prop="applyTime" width="200"></el-table-column>
               <el-table-column align="center" label="完成状态" prop="isAgree" v-if="tab.id===5">
                   <template scope="scope">
                    <span>{{scope.row.applyStatus === '5'?'通过':'不通过'}}</span>
                  </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="审批时间" prop="approvalTime" width="200" v-if="tab.id===2"></el-table-column>
              <el-table-column align="center" label="签收时间" prop="signTime" width="200" v-if="tab.id===3 || tab.id===4"></el-table-column>
              <el-table-column align="center" label="反馈时间" prop="handleTime" width="200" v-if="tab.id===4"></el-table-column> 
              <el-table-column align="center" label="完成时间" prop="finishTime" width="200" v-if="tab.id===5"></el-table-column>
              <el-table-column align="center" label="草稿时间" prop="applyTime" width="200" v-if="tab.id===6"></el-table-column> -->
              <el-table-column align="center" label="操作" width="250">
                <!-- @click="callDetailDialog(0,scope.row.id,scope.row.lcid,scope.row.bktype)" -->
                <template scope="scope">
                      <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="查看"  @click="newApply('查看详情', '8', scope.row)" v-if="tab.id!==4 && tab.id!==6">
                        查看详情
                      </el-button>
                      <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="评价" @click="newApply('评论', '10', scope.row)" v-if="tab.id===4">
                        评价
                      </el-button>
                      <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="编辑" @click="newApply('编辑', '9', scope.row)" v-if="tab.id===6">
                        编辑
                      </el-button>
                      <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="删除" @click="xtDelete(scope.row)" v-if="tab.id===6">
                        删除
                      </el-button>
                       <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="评价" @click="upApply(scope.row)" v-if="tab.id===6">
                        提交
                      </el-button>
                      <!-- <el-button type="primary" size="mini" icon="icon iconfont icon-xiangqing" title="评价" @click="newApply('评论', '10', scope.row)" v-if="tab.id===6">
                        评论
                      </el-button> -->
                </template>
              </el-table-column>
            </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
  <div class="app-toolbar" v-if="7 > parseInt(listType)">
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
/* .yellowcolor {
    color: #FFC107;
} */
.redcolor {
    color: red;
}
.app-content-box {
  height: calc(100vh - 210px);
}
</style>
<!-- 隐藏横向滚动条 -->
<style lang="scss">
/* // .side-right-box_div.unit-apply {
//     .el-table__body-wrapper {
//         overflow-x: hidden;
//         overflow-y: scroll;
//     }
// } */
</style>

<script>
import mixin from '../../../utils/mixin'
import listMixin from '../listMixin'
import { FETCH_UNION_LIST_DRAFT, XT_APPLY_COUNT, XT_DELETE_DRAFT, XT_DRAFT_TO_APPLY } from '../../../store/types'
import addApply from './add-apply'
import doApply from './do-apply'
import pingApply from './ping-apply'
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
    pingApply,
    'dialog-form': dialogForm,
    'dialog-detail': dialogDetail
  },
  data() {
    return {
      itemId: null,
      xtTitleByMe: '',
      xtObj: {},
      xtObjEdit: {},
      xtObjComment: {},
      listType: '1',
      counts: 0,
      lists: [],
      sendData: {
        PageIndex: 1,
        PageSize: 50,
        applyStatus: 1
      },
      tabs: [{
        id: 1,
        label: '审批中',
        sourceLabel: '审批中'
      }, {
        id: 2,
        label: '待签收',
        sourceLabel: '待签收'
      }, {
        id: 3,
        label: '待反馈',
        sourceLabel: '待反馈'
      }, {
        id: 4,
        label: '待评价',
        sourceLabel: '待评价'
      }, {
        id: 5,
        label: '已完成',
        sourceLabel: '已完成'
      }, {
        id: 6,
        label: '草稿箱',
        sourceLabel: '草稿箱'
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
      if(val.name >= 7) {
        this.xtTitleByMe = val.label;
      }
      if(parseInt(this.listType) >= 7) {
        return;
      }
      this.fetchList();
    },
    // 获取列表
    fetchList() {
      if(this.listType === '6') {
        this.sendData.applyStatus = 0;
      }else {
        this.sendData.applyStatus = this.listType;
      }
      this.dispatch(FETCH_UNION_LIST_DRAFT, this.sendData).then(() => {
        console.log(this.union, 'this.union');
        this.lists = this.union.listDraft.PageData.map(d => {
          return {
            id: d.id,
            detailid: d.id,
            applyStatus: d.applyStatus,
            attachmentId: d.attachmentId,
            title: d.title,
            applyUsername: d.applyUsername,
            applyDeptname: d.applyDeptname,
            xbDeptname: d.xbDeptname,
            applyTime: d.applyTime,
            approvalTime: d.approvalTime,
            handleTime: d.handleTime,
            signTime: d.signTime,
            createTime: d.createTime,
            finishTime: d.finishTime,
            caseId: d.caseId,
            caseJyaq: d.caseJyaq,
            caseNum: d.caseNum,
            emergency: parseInt(d.emergency),
            existClue: d.existClue,
            hcRequest: d.hcRequest,
            fileName: d.fileName,
            zcAttachmentid: d.zcAttachmentid,
            zcAttachmentname: d.zcAttachmentname,
            zcResult: d.zcResult,
            efficiencyScore: d.efficiencyScore,
            evaluativeInfo: d.evaluativeInfo,
            qualityScore: d.qualityScore
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
          }else if(name === '编辑') {
            this.xtObjEdit = obj;
          }else if(name === '评论') {
            this.xtObjComment = obj;
          }
          this.listType = num;
          return;
        }
      }
      this.tabs.push(tab);
      this.xtTitleByMe = name;
      if(name === '查看详情') {
        this.xtObj = obj;
      }else if(name === '编辑') {
        this.xtObjEdit = obj;
      }else if(name === '评论') {
        this.xtObjComment = obj;
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
    upApply(item) {
      this.$confirm('确定要提交此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.dispatch(XT_DRAFT_TO_APPLY, { id: item.detailid }).then(() => {
          this.$message({
            type: 'success',
            message: '提交成功',
            showClose: true
          })
          this.reload()
        })
      })
    },
    getCounts() {
      this.dispatch(XT_APPLY_COUNT).then(() => {
        console.log(this.union.xtApplyCount, 'this.union.xtApplyCount');
        this.tabs[0].label = `${this.tabs[0].sourceLabel}(${this.union.xtApplyCount[1]})`
        this.tabs[1].label = `${this.tabs[1].sourceLabel}(${this.union.xtApplyCount[2]})`
        this.tabs[2].label = `${this.tabs[2].sourceLabel}(${this.union.xtApplyCount[3]})`
        this.tabs[3].label = `${this.tabs[3].sourceLabel}(${this.union.xtApplyCount[4]})`
        this.tabs[4].label = `${this.tabs[4].sourceLabel}(${this.union.xtApplyCount[5]})`
        this.tabs[5].label = `${this.tabs[5].sourceLabel}(${this.union.xtApplyCount[0]})`
      })
    }
  }
}
</script>
