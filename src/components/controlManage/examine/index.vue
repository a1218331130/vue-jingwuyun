<template>
<div class="side-right-box_div control-manage-examine">
  <el-tabs v-model="currentTab">
    <!-- 侧栏触发器 -->
    <span class="unfold-button iconfont icon-fold" @click="handleRightSide"></span>

    <el-tab-pane v-for="tab in tabs" :key="tab.id" :label="tab.label" loading="loading">

      <div class="app-content-box">
        <!-- 待审批 -->
        <el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id==1" class="app-table" v-loading.body="loading" border :stripe="true" :data="surveillance.fetchApprovalListResult.PageData">
          <el-table-column align="center" type="index" label="序号" width="50">
            <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
</el-table-column>
<el-table-column label="布控名称" prop="bkmc" width="150" align="center"></el-table-column>
<el-table-column label="布控对象" prop="bkdx"></el-table-column>
<el-table-column align="center" label="布控类型" prop="bklx" width="100">
  <template scope="scope">
              <span>{{scope.row.bklx==='3'?"图片布控":scope.row.bklx==='1'?'人员布控':'车辆布控'}}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="申请类型" prop="sqlx" width="80">
  <template scope="scope">
    <span>{{scope.row.sqlx === '3'?'撤控':scope.row.sqlx === '1'?'新增':'续控'}}</span>
  </template>
</el-table-column>
<el-table-column align="center" label="申请人" prop="sqr" width="80"></el-table-column>
<el-table-column align="center" label="申请单位" prop="sqdw" width="150"></el-table-column>
<el-table-column align="center" label="申请时间" prop="sqsj" width="100">
  <template scope="scope">
              <span>{{scope.row.sqsj | dateFormat}}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="布控开始时间" prop="kssj" width="120">
  <template scope="scope">
              <span>{{scope.row.kssj | dateFormat }}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="布控结束时间" prop="jssj" width="120">
  <template scope="scope">
              <span>{{scope.row.jssj | dateFormat }}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="操作" width="120">
  <template scope="scope">
              <el-button type="primary" size="mini" @click="callDetailDialog(1,scope.row.bkid,scope.row.lcid,scope.row.bklx)" icon="icon iconfont icon-shenqing">
                审批
              </el-button>
            </template>
</el-table-column>
</el-table>
<!-- 已审批 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id==2" class="app-table" v-loading.body="loading" border :stripe="true" :data="surveillance.fetchApprovalListResult.PageData">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="布控名称" prop="bkmc" width="150"></el-table-column>
  <el-table-column label="布控对象" prop="bkdx"></el-table-column>
  <el-table-column align="center" label="布控类型" prop="bklx" width="100">
    <template scope="scope">
              <span>{{scope.row.bklx==='3'?"图片布控":scope.row.bklx==='1'?'人员布控':'车辆布控'}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="申请类型" prop="sqlx" width="80">
    <template scope="scope">
    <span>{{scope.row.sqlx === '3'?'撤控':scope.row.sqlx === '1'?'新增':'续控'}}</span>
  </template>
  </el-table-column>
  <el-table-column align="center" label="申请人" prop="sqr" width="80"></el-table-column>
  <el-table-column align="center" label="申请单位" prop="sqdw" width="150"></el-table-column>
  <el-table-column align="center" label="申请时间" prop="sqsj" width="100">
    <template scope="scope">
              <span>{{scope.row.sqsj | dateFormat}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="布控开始时间" prop="kssj" width="100">
    <template scope="scope">
              <span>{{scope.row.kssj | dateFormat}}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="布控结束时间" prop="jssj" width="120"></el-table-column>
  <el-table-column align="center" label="审批时间" prop="spsj" width="120">
    <template scope="scope">
              <span>{{scope.row.spsj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="操作" width="120">
    <template scope="scope">
              <el-button type="primary" size="mini" @click="callDetailDialog(2,scope.row.bkid,scope.row.lcid,scope.row.bklx)" icon="icon iconfont icon-xiangqing">
                查看详情
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 审核 -->
<div v-if="tab.id === 3">
  <institution :data="reviewData" :status="3"></institution>
  <controlObj :data="reviewData" :status="3" style="margin-top:30px;" v-if="reviewData.bklx==='1'"></controlObj>
  <controlObjCar :data="reviewData" :status="3" style="margin-top:30px;" v-if="reviewData.bklx==='2'"></controlObjCar>
  <controlInfo :data="reviewData" :status="3" style="margin-top:30px;"></controlInfo>
  <processInfo :data="reviewData" style="margin-top:30px;"></processInfo>
  <sign :lcid="reviewData.lcid" ref='sign' @close='quitEvent'></sign>
</div>
<!-- 查看详情 -->
<div v-if="tab.id === 4">
  <institution :data="detailData" :status="3"></institution>
  <controlObj :data="detailData" :status="3" style="margin-top:30px;" v-if="detailData.bklx==='1'"></controlObj>
  <controlObjCar :data="detailData" :status="3" style="margin-top:30px;" v-if="detailData.bklx==='2'"></controlObjCar>
  <controlInfo :data="detailData" :status="3" style="margin-top:30px;"></controlInfo>
  <processInfo :data="detailData" style="margin-top:30px;"></processInfo>
  <el-button class="quitClass" @click="quitEvent">取消</el-button>
</div>
</div>
<div class="app-toolbar" v-if="tab.id===1||tab.id === 2">
  <pagination :count="dataCount" :pagenav="pagenav" @update:pagenav="handlePageChange"></pagination>
</div>
</el-tab-pane>
</el-tabs>


<!-- 右侧栏 -->
<side-right-box :unfoldHandle="unfoldT" @unfoldState="sideState">
  <right-toolbar title="查询列表" :params="screen.queryForm" :options="screen.options" @packup="packup" @update:params="searchSubmit"></right-toolbar>
</side-right-box>

<dialog-detail :url="uu" :lcid="lcid" :dialog="detailDialog" :type="detailType" :bktype="bkType" @close="detailDialog=false"></dialog-detail>
</div>
</template>

<style lang="scss" scoped>
  .apply-query-form {
    .el-form-item {
      margin-bottom: 0;
    }
  }

  .quitClass {
    position: relative;
    left: 50%;
    width: 80px;
    top: 20px;
    margin-left: -40px;
  }

  .index__foot {
    width: 330px;
    position: relative;
    left: 50%;
    margin-top: 50px;
    margin-left: -165px;
    .qiutBtn {
      float: left;
      width: 90px;
    }
    .draftBtn {
      position: absolute;
      width: 90px;
      left: 50%;
      margin-left: -45px;
    }
    .sureBtn {
      float: right;
      width: 90px;
      color: white;
      background-color: #85c2e7;
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

</style>

<!-- 隐藏列表横向滚动条 -->
<style lang="scss">
  .side-right-box_div.control-manage-examine {
    .app-table {
      .el-table__body-wrapper {
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }
  }

</style>

<script>
  import {
    // GET_APPROVAL_LIST,
    // GET_APPROVAL_LIST_COUNT,
    GET_CAR_INFO_CONTROL,
    // FETCH_QUERY_PEOPLE_LIST,
    // FXPCGK_APPROVAL_LIST,
    POST_PROCESS_EXAMINE, // 审核接口
    FETCH_APPROVAL_LIST, // 获取待我审批列表
    FETCH_APPROVAL_LIST_COUNT // 获取待审批已审批总数
  } from '../../../store/types'
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import bus from '../../../utils/bus'
  import pagination from '../../../widgets/pagination/pagination'
  import { tableFill } from '../../../utils/util'
  // import { listToTree } from '../../../utils/listToTree'
  import person from '../apply/person'
  import car from '../apply/car'
  import dialogDetail from '../detail/dialog-detail'

  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import ElDialog from '../../../../node_modules/element-ui/packages/dialog/src/component';
  import ElRadio from '../../../../node_modules/element-ui/packages/radio/src/radio';
  import institution from '../common/institution.vue'
  import controlObj from '../common/controlObj.vue'
  import controlObjCar from '../common/controlObjCar.vue'
  import controlInfo from '../common/controlInfo.vue'
  import processInfo from '../common/processInfo.vue'
  import controlState from '../common/controlState.vue'
  import sign from '../detail/sign.vue'
  import '../../../utils/dateFormat';
  export default {
    mixins: [mixin],
    components: {
      ElRadio,
      ElDialog,
      pagination,
      sideRightBox,
      rightToolbar,
      'dialog-detail': dialogDetail,
      person,
      car,
      institution,
      controlObj,
      controlObjCar,
      controlInfo,
      processInfo,
      controlState,
      sign
    },
    data() {
      return {
        loading: true,
        uu: '',
        form: {
          Note: '',
          radio: '同意'
        },
        rules: {
          Note: [{ required: true, message: '请输入审批理由' }]
        },
        ifty: '',
        lcid: '',
        dataCount: 0,
        showDialog: false,
        detailDialog: false,
        detailType: 0,
        bkType: 0,
        list: [],
        list2: [],
        currentTab: '0',
        allData: '',
        reviewData: '',
        detailData: '',
        pagenav: {
          currentpage: 1,
          limit: 1000
        },
        tabs: [{
          id: 1,
          label: '待审批'
        }, {
          id: 2,
          label: '已审批'
        }],
        form2: {
          title: '3-11特大案件布控',
          range: '全省',
          startTime: '2017-09-02',
          endTime: '2017-09-15',
          createTime: '2017-09-01',
          frequency: '一天',
          desc: '根据XX案件需要对以下人员进行布控，布控结果将用于抓捕嫌疑人',
          file: '附件',
          people: '张副局长',
          tags: '',
          FileNames: '',
          visitAccessory: '',
          currentFiles: [],
          spsj: '',
          features: '',
          carFeatures: '',
          spyj: '',
          ckr: '',
          cksj: '',
          ckyj: '',
          carObj: [],
          notifType: [],
          objPerson: [],
          notifPersonCount: [{
            name: '张副局长',
            section: '怀化市侦查局',
            tel: '153********',
            email: 'zhangjuzhang@110.net.cn'
          }, {
            name: '张副局长',
            section: '怀化市侦查局',
            tel: '153********',
            email: 'zhangjuzhang@110.net.cn'
          }],
          notifPerson: []
        },
        unfoldT: false, // 当前侧栏窗体是否展开状态中继
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
    watch: {
      currentTab(val) {
        if (parseInt(val) > 1) {
          this.unfoldT = false
        } else {
          this.loadData((parseInt(val) + 1))
        }
      }
    },
    computed: {
      ...mapState(['controlManage', 'userSelector', 'surveillance'])
    },
    methods: {
      reset() {
        this.form = {
          Note: '',
          radio: '同意'
        }
      },
      setTabs() {
        const count = this.surveillance.fetchApprovalListCountResult;
        this.tabs.map(item => {
          switch (item.id) {
            case 1:
              item.label = '待审批 (' + count.dsp + ')';
              break;
            case 2:
              item.label = '已审批 (' + count.ysp + ')';
              break;
          }
        })
      },
      thisdateil(row) {
        this.detailDialog = true
        this.uu = row
      },
      closeEvent(val) {
        this.showDialog = false
      },
      submit() {
        this.$refs.form.validate((valid) => {

        })
        if (this.form.radio === '同意') {
          this.ifty = 'TY'
        } else {
          this.ifty = 'BTY'
        }
        this.dispatch(POST_PROCESS_EXAMINE, {
          Lczbid: this.lcid,
          HandleOpinion: this.ifty,
          Note: this.form.Note,
          NextNode: ''
        })
        this.showDialog = false
      },
      open(val1, val2) {
        this.lcid = val1
        this.reset()
        this.showDialog = true
        this.loadforDetail(val2)
      },
      callDetailDialog(type, value, lcid, bktype) {
        this.lcid = lcid
        this.dispatch(GET_CAR_INFO_CONTROL, { id: value }).then(() => {
          this.allData = this.surveillance.getCarInfoControl
          if (type === 2) {
            this.detailData = this.allData
            this.currentTab = this.tabs.length + ''
            let flag = true
            this.tabs.map((item, index) => {
              if (item.id === 4) {
                this.currentTab = index + ''
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 4, label: '查看详情' })
            }
          } else {
            this.currentTab = this.tabs.length + ''
            this.reviewData = this.allData
            let flag = true
            this.tabs.map((item, index) => {
              if (item.id === 3) {
                this.currentTab = index + ''
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 3, label: '审核' })
            }
          }
        })
      },
      sideState(s) {
        // 窗体自身操作更新窗体状态
        this.unfoldT = s
      },
      packup() {
        // 收起侧栏
        this.unfoldT = false
        this.screen.queryForm = {
          keyword: '',
          applyTime: '',
          createTime: '',
          zcType: '',
          state: '',
          org: '',
          spTime: ''
        }
      },
      searchSubmit(obj) {
        this.loadData((parseInt(this.currentTab) + 1), 1, 100, obj);
        this.packup()
      },
      handleRightSide() {
        // 右侧窗体状态操作
        if (parseInt(this.currentTab) > 1) {
          this.unfoldT = false
          return
        }
        this.unfoldT = !this.unfoldT
        // this.getOrg()
      },
      handlePageChange(page) {
        this.pagenav = page;
        this.loadData((parseInt(this.currentTab) + 1), page.currentpage, page.limit);
      },
      loadData(bktype = 1, PageIndex = 1, PageSize = 100, obj = { keyword: '', org: '', applyTime: '', createTime: '', spTime: '' }) {
        this.dispatch(FETCH_APPROVAL_LIST_COUNT, {
          keyword: '',
          cjrbmmc: '',
          kssj: '',
          jssj: '',
          cjsj_begin: '',
          cjsj_end: '',
          spsj_begin: '',
          spsj_end: ''
        }).then(() => {
          this.setTabs()
        })
        this.dispatch(FETCH_APPROVAL_LIST, {
          PageIndex: PageIndex,
          PageSize: PageSize,
          taptype: bktype,
          keyword: obj ? obj.keyword : '',
          cjrbmmc: obj.org ? obj.org : '',
          kssj: obj.applyTime ? this.dateFormat(new Date(obj.applyTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          jssj: obj.applyTime ? this.dateFormat(new Date(obj.applyTime[1]), 'yyyy-MM-dd hh:mm:ss') : '',
          cjsj_begin: '',
          cjsj_end: obj.createTime ? this.dateFormat(new Date(obj.createTime[1]), 'yyyy-MM-dd hh:mm:ss') : '',
          spsj_begin: obj.spTime ? this.dateFormat(new Date(obj.spTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          spsj_end: obj.spTime ? this.dateFormat(new Date(obj.spTime[1]), 'yyyy-MM-dd hh:mm:ss') : ''
        }).then(() => {
          this.list = this.surveillance.fetchApprovalListResult.PageData
          this.dataCount = this.surveillance.fetchApprovalListResult.DataCount
        })
      },
      submitone() {
        this.$refs.approvalForm.validate(valid => {
          if (valid) {
            this.dispatch(POST_PROCESS_EXAMINE, {
              Lczbid: this.allData.id,
              HandleOpinion: this.approvalForm.select,
              Note: this.approvalForm.reason,
              NextNode: ''
            }).then(() => {
              this.$message({
                type: 'success',
                message: '操作已成功提交',
                showClose: true
              })
              setTimeout(() => {
                window.location.reload()
              }, 500)
            })
          } else {
            return false
          }
        })
      },
      quitEvent() {
        this.tabs.splice(parseInt(this.currentTab), 1)
        this.currentTab = '0'
        this.loadData();
        return false
      }
    },
    created() {
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
      bus.$on('NoticeFeaturesName', m => {
        if (m === '布控预警申请') {
          this.currentTab = '0'
        } else {
          this.currentTab = '1'
        }
      })
    },
    mounted() {
      this.loadData()
      tableFill(this.$, false, false, this.$(window).height() - 60 - 40 - 68)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 60 - 40 - 68)
      })
    }
  }

</script>
