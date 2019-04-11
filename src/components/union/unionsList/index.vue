<template>
<div class="side-right-box_div unit-list">
  <el-tabs>

    <span class="unfold-button iconfont icon-fold" @click="switchRightBar"></span>

    <el-tab-pane>
      <div class="app-content-box">
        <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="tableList" :height="'100%'">
          <el-table-column type="index" label="序号" align="center" width="60" >
            <template scope="scope">
              {{scope.row.index}}
            </template>
          </el-table-column>
          <!--我的申请你列表-->
          <!-- <el-table-column label="协查编号" prop="无对应字段" width="100"></el-table-column> -->
          <el-table-column label="紧急" prop="LevelName" align="center" width="60"></el-table-column>
          <el-table-column label="标题" prop="Title" width="320"></el-table-column>
          <!--<el-table-column label="申请人" prop="JbxxModel.Creator"></el-table-column>-->
          <!--<el-table-column label="申请单位" prop="JbxxModel.CreatorDept"></el-table-column>-->
          <el-table-column label="协查单位" prop="OrgName"></el-table-column>
          <!--<el-table-column label="案件编号" prop="JbxxModel.CaseNo"></el-table-column>-->
          <el-table-column label="协查类型" prop="type" align="center" width="80"></el-table-column>
          <el-table-column label="协查状态" prop="unstate" align="center" width="80">
            <template scope="scope">
              <span :class="[ scope.row.OVERSTATE==='JG' ? 'yellowcolor':scope.row.OVERSTATE==='YGQ'?'redcolor':'']">{{scope.row.unstate}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="逾期状态" prop="OVERSTATE" align="center" width="120"></el-table-column> -->
          <el-table-column label="申请时间" align="center" width="110">
            <template scope="scope">{{scope.row.CreateTime|dateFormat}}</template>
          </el-table-column>
          <el-table-column label="预审批时间" prop="IssuedTime" align="center"></el-table-column>
          <el-table-column label="预签收时间" prop="SignTime" align="center"></el-table-column>
          <el-table-column label="预反馈时间" prop="FeedbackTime" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template scope="scope">
              <el-button type="primary" size="mini" @click="callDetailDialog(6,scope.row.KeyId,scope.row)" icon="icon iconfont icon-xiangqing">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div class="app-toolbar">
        <pagination :count="pagenav.count" :pagenav="pagenav" @update:pagenav="updatePage"></pagination>
      </div>
    </el-tab-pane>
  </el-tabs>
  <!-- <dialog-form :id="itemId" :dialog="formDialog" @close="formDialog=false" @call:reload="reload"></dialog-form> -->
  <dialog-detail :dialog="detailDialog" :id="detailId" :type="detailType" @close="detailDialog=false" :due="steer"></dialog-detail>

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
<!-- 隐藏横向滚动条 -->
<style lang="scss">
// .side-right-box_div.unit-list {
//     .el-table__body-wrapper {
//         overflow-x: hidden;
//         overflow-y: scroll;
//     }
// }
</style>

<script>
import mixin from '../../../utils/mixin'
import listMixin from '../listMixin'
import { GET_UNION_ALL_LIST } from '../../../store/types'

// import { clone } from '../../../utils/util'
import '../../../utils/dateFormat'

import pagination from '../../../widgets/pagination/pagination'

import dialogForm from '../apply/dialog-form'
import dialogDetail from '../detail/dialog-detail'

import sideRightBox from '../../control/side-right-box.vue'
import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'

export default {
  mixins: [mixin, listMixin],
  components: {
    pagination,
    sideRightBox,
    rightToolbar,
    'dialog-form': dialogForm,
    'dialog-detail': dialogDetail
  },
  data() {
    return {
      itemId: null,
      tableList: [{
        LevelName: '',
        Title: '',
        OrgName: '',
        type: '',
        CreateTime: '',
        unstate: '',
        overdue: ''
      }],
      pagenav: {
        count: 0,
        currentpage: 1,
        limit: 100
      },
      screen: {
        queryForm: {
          keyword: '',
          time: '',
          degree: '',
          center: '',
          area: []
        },
        options: [{
          title: '关键字',
          prop: 'keyword',
          type: 'input'
        }, {
          title: '受理中心',
          prop: 'center',
          type: 'select',
          children: [{
            value: '情报指挥中心',
            label: '情报指挥中心'
          }, {
            value: '侦查实战中心',
            label: '侦查实战中心'
          }, {
            value: '治安防控中心',
            label: '治安防控中心'
          }, {
            value: '执法监督中心',
            label: '执法监督中心'
          }]
        }, {
          title: '紧急程度',
          prop: 'degree',
          type: 'select',
          children: [{
            value: '一级',
            label: '一级'
          }, {
            value: '二级',
            label: '二级'
          }, {
            value: '三级',
            label: '三级'
          }, {
            value: '四级',
            label: '四级'
          }]
        }, {
          title: '创建时间',
          prop: 'time',
          type: 'daterange'
        }]
      }
    }
  },
  computed: {
    state() {
      let res
      // 1:待审批,2:待签收,3:待反馈,4:待评论,5:已完成)
      switch(this.listType) {
        case '1':
          res = '待审批'
          break;
        case '2':
          res = '待签收'
          break;
        case '3':
          res = '待反馈'
          break;
        case '4':
          res = '待评论'
          break;
        case '5':
          res = '已完成'
          break;
        default:
          res = '草稿'
      }
      return res
    }
  },
  methods: {
    loadData() {
      this.dispatch(GET_UNION_ALL_LIST, {
        V_YHID: '',
        V_CJSJ: '',
        V_JJCD: '',
        V_DQDM: '',
        V_PAGEINDEX: 1,
        V_PAGESIZE: 100,
        V_ZXLX: ''
      }).then(() => {
        this.tableList = this.union.AllList.xtDetailModelList.map(d => {
          return {
            index: d.r,
            LevelName: d.XXJB,
            Title: d.BT,
            OrgName: d.DWJC,
            type: d.CENTERNAME,
            CreateTime: d.CJSJ,
            KeyId: d.ID,
            unstate: d.ZT,
            LCZBID: d.LCZBID,
            OPTLX: d.OPTLX,
            OPTNAME: d.OPTNAME,
            OVERSTATE: d.OVERSTATE,
            IssuedTime: d.IssuedTime,
            SignTime: d.SignTime,
            FeedbackTime: d.FeedbackTime
          }
        })
        this.pagenav.count = this.union.AllList.totalCount
        console.log();
      })
    },
    getCounts(a) {
      console.log(a);
    },
    fetchList() {},
    getType(obj) {
      if(obj.degree === '一级') {
        return '1'
      }
      if(obj.degree === '二级') {
        return '2'
      }
      if(obj.degree === '三级') {
        return '3'
      }
      if(obj.degree === '四级') {
        return '4'
      }
    },
    getcenter(obj) {
      if(obj.center === '情报指挥中心') {
        return '1'
      }
      if(obj.center === '侦查实战中心') {
        return '2'
      }
      if(obj.center === '治安防控中心') {
        return '3'
      }
      if(obj.center === '执法监督中心') {
        return '4'
      }
    },
    updatePage(obj) {
      this.dispatch(GET_UNION_ALL_LIST, {
        V_YHID: '1',
        V_CJSJ: obj.time ? this.dateFormat(new Date(obj.time[0]), 'yyyy-MM-dd') : '',
        V_JJCD: this.getType(obj),
        V_DQDM: '',
        V_PAGEINDEX: obj.currentpage,
        V_PAGESIZE: obj.limit,
        V_ZXLX: this.getcenter(obj)
      }).then(() => {
        this.tableList = this.union.AllList.xtDetailModelList.map(d => {
          return {
            index: d.r,
            LevelName: d.XXJB,
            Title: d.BT,
            OrgName: d.DWJC,
            type: d.CENTERNAME,
            CreateTime: d.CJSJ,
            KeyId: d.ID,
            unstate: d.ZT,
            LCZBID: d.LCZBID,
            OPTLX: d.OPTLX,
            OPTNAME: d.OPTNAME,
            OVERSTATE: d.OVERSTATE,
            IssuedTime: d.IssuedTime,
            SignTime: d.SignTime,
            FeedbackTime: d.FeedbackTime
          }
        })
        this.pagenav.count = this.union.AllList.totalCount
      })
    },
    searchSubmit(obj) {
      this.dispatch(GET_UNION_ALL_LIST, {
        V_YHID: '',
        V_CJSJ: obj.time ? this.dateFormat(new Date(obj.time[0]), 'yyyy-MM-dd') : '',
        V_JJCD: this.getType(obj),
        V_DQDM: '',
        V_PAGEINDEX: 1,
        V_PAGESIZE: 100,
        V_ZXLX: this.getcenter(obj)
      }).then(() => {
        this.tableList = this.union.AllList.xtDetailModelList.map(d => {
          return {
            index: d.r,
            LevelName: d.XXJB,
            Title: d.BT,
            OrgName: d.DWJC,
            type: d.CENTERNAME,
            CreateTime: d.CJSJ,
            KeyId: d.ID,
            unstate: d.ZT,
            LCZBID: d.LCZBID,
            OPTLX: d.OPTLX,
            OPTNAME: d.OPTNAME,
            OVERSTATE: d.OVERSTATE,
            IssuedTime: d.IssuedTime,
            SignTime: d.SignTime,
            FeedbackTime: d.FeedbackTime
          }
        })
        this.pagenav.count = this.union.AllList.totalCount
      })
    },
    getOverState(val) {
      if(val === 'JG') {
        return '警告，即将过期'
      } else {
        return '已过期'
      }
    }
  },
  created() {
    this.loadData()
    // this.dispatch(GET_UNION_AREA_LIST, { V_DSDM: '' }).then(() => {})
  }
}
</script>
