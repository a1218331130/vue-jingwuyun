<template>
<div class="side-right-box_div control-manage-apply">
  <el-tabs v-model="currentTab" @tab-click="handleClick">
    <ul class="top-menu">
      <li style="margin-top: -35px;margin-right: 50px;">
        <el-button icon="plus" class="import-btn add" @click="newEdit" style="vertical-align: middle; height: 32px;line-height: 32px;padding: 0 15px;">申请</el-button>
      </li>
    </ul>
    <!-- 侧栏触发器 -->
    <span class="unfold-button iconfont icon-fold" @click="handleRightSide"></span>
      <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id.toString()" :label="tab.label">
      <div class="app-content-box">
<!-- 待审批 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===1" class="app-table" border :stripe="true" :data="pageData">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
</el-table-column>
<el-table-column label="布控名称" prop="bkmc"></el-table-column>
<el-table-column label="布控对象" prop="bkdx"></el-table-column>
<el-table-column align="center" label="申请类型" prop="bkzt" width="150">
  <template scope="scope">
    <span>{{scope.row.bkzt === '4'?'撤控':scope.row.bkzt === '3'?'新增':'续控'}}</span>
  </template>
</el-table-column>
<el-table-column align="center" label="布控开始时间" prop="kssj" width="150">
  <template scope="scope">
              <span>{{scope.row.kssj | dateFormat }}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="布控结束时间" prop="jssj" width="150">
  <template scope="scope">
              <span>{{scope.row.jssj | dateFormat }}</span>
            </template>
</el-table-column>
<el-table-column align="center" label="申请时间" prop="cjsj" width="150"></el-table-column>
<el-table-column align="center" label="申请人" prop="sqr" width="150"></el-table-column>
<el-table-column align="center" label="申请单位" prop="sqdw" width="150"></el-table-column>
<el-table-column align="center" label="操作" width="120">
  <template scope="scope">
              </el-button>
              <el-button type="primary" size="mini" @click="callDetailDialog(3,8,scope.row.bkid)" icon="icon iconfont icon-xiangqing">
                查看详情
              </el-button>
            </template>
</el-table-column>
</el-table>
<!-- 未开始 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===2" class="app-table" border :stripe="true" :data="pageData">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
        {{scope.$index + 1 + 30 * (1 - 1)}}
      </template>
  </el-table-column>
  <el-table-column label="布控名称" prop="bkmc" width="150"></el-table-column>
  <el-table-column label="布控对象" prop="bkdx"></el-table-column>
  <el-table-column align="center" label="布控开始时间" prop="kssj" width="150">
    <template scope="scope">
        <span>{{scope.row.kssj | dateFormat }}</span>
      </template>
  </el-table-column>
  <el-table-column align="center" label="布控结束时间" prop="jssj" width="150">
    <template scope="scope">
        <span>{{scope.row.jssj | dateFormat }}</span>
      </template>
  </el-table-column>
  <el-table-column align="center" label="申请时间" prop="cjsj" width="120"></el-table-column>
  <el-table-column align="center" label="申请人" prop="sqr" width="120"></el-table-column>
  <el-table-column align="center" label="申请单位" prop="sqdw" width="120"></el-table-column>
  <el-table-column align="center" label="操作" width="350">
    <template scope="scope">
        <el-button type="primary" size="mini" @click="callDetailDialog(3,8,scope.row.bkid)" icon="icon iconfont icon-xiangqing">
          查看详情
        </el-button>
        <el-button type="primary" size="mini" @click="callDetailDialog(6,8,scope.row.bkid)" icon="icon iconfont icon-undo">撤控
        </el-button>
        <el-button type="primary" size="mini" icon="icon iconfont icon-task" @click="callDetailDialog(5,8,scope.row.bkid)">
          续控
        </el-button>
      </template>
  </el-table-column>
</el-table>

<!-- 进行中 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===3" class="app-table" border :stripe="true" :data="pageData">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="布控名称" prop="bkmc" width="150"></el-table-column>
  <el-table-column label="布控对象" prop="bkdx"></el-table-column>
  <el-table-column align="center" label="布控开始时间" prop="kssj" width="150">
    <template scope="scope">
              <span>{{scope.row.kssj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="布控结束时间" prop="jssj" width="150">
    <template scope="scope">
              <span>{{scope.row.jssj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="申请时间" prop="cjsj" width="150">
    <template scope="scope">
              <span>{{scope.row.cjsj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="申请人" prop="sqr" width="120"></el-table-column>
  <el-table-column align="center" label="申请单位" prop="sqdw" width="120"></el-table-column>
  <el-table-column align="center" label="操作" width="350">
    <template scope="scope">
              <el-button type="primary" size="mini" @click="callDetailDialog(3,8,scope.row.bkid)" icon="icon iconfont icon-xiangqing">
                查看详情
              </el-button>
              <el-button type="primary" size="mini" @click="callDetailDialog(6,8,scope.row.bkid)" icon="icon iconfont icon-undo">撤控
              </el-button>
              <el-button type="primary" size="mini" icon="icon iconfont icon-task" @click="callDetailDialog(5,8,scope.row.bkid)">
                续控
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 已结束 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===4" class="app-table" border :stripe="true" :data="pageData">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="布控名称" prop="bkmc" width="150"></el-table-column>
  <el-table-column label="布控对象" prop="bkdx"></el-table-column>
  <el-table-column align="center" label="布控结束时间" prop="jssj" width="150">
    <template scope="scope">
              <span>{{scope.row.jssj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="申请时间" prop="cjsj" width="150">
    <template scope="scope">
              <span>{{scope.row.cjsj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="撤销时间" prop="cxsj" width="150">
    <template scope="scope">
              <span>{{scope.row.cxsj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="申请人" prop="sqr" width="150"></el-table-column>
  <el-table-column align="center" label="申请单位" prop="sqdw" width="150"></el-table-column>
  <el-table-column align="center" label="撤销类别" prop="bkztmc" width="120"></el-table-column>
  <el-table-column align="center" label="操作" width="120">
    <template scope="scope">
              <el-button type="primary" size="mini" @click="callDetailDialog(3,8,scope.row.bkid)" icon="icon iconfont icon-xiangqing">
                查看详情
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 草稿箱 -->
<el-table @cell-mouse-enter="cellMouseEnter" v-if="tab.id===5" class="app-table" border :stripe="true" :data="pageData">
  <el-table-column align="center" type="index" label="序号" width="50">
    <template scope="scope">
              {{scope.$index + 1 + 30 * (1 - 1)}}
            </template>
  </el-table-column>
  <el-table-column label="布控名称" prop="bkmc" width="200"></el-table-column>
  <el-table-column label="布控对象" prop="bkdx"></el-table-column>
  <el-table-column align="center" label="创建时间" prop="cjsj" width="150">
    <template scope="scope">
              <span>{{scope.row.kssj | dateFormat }}</span>
            </template>
  </el-table-column>
  <el-table-column align="center" label="申请人" prop="sqr" width="150"></el-table-column>
  <el-table-column align="center" label="申请单位" prop="sqdw" width="150"></el-table-column>
  <el-table-column align="center" label="操作" width="200">
    <template scope="scope">
              <el-button type="primary" size="mini" @click="callDetailDialog(7,8,scope.row.bkid)" icon="icon iconfont icon-brush">编辑
              </el-button>
              <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="detel(scope.row)">删除
              </el-button>
            </template>
  </el-table-column>
</el-table>
<!-- 布控申请 -->
<div v-if="tab.id===7" v-loading="saveFlag">
  <institution :rules="rules3" :status="1" @update:data="updateData" :flag="applyNum"></institution>
  <controlObj :rules="rules3" :status="1" @update:data="updateData" :flag="applyNum" @update:flag="updateFlag" style="margin-top:30px;"></controlObj>
  <controlInfo :rules="rules3" :status="1" @update:data="updateData" :flag="applyNum" @update:flag="updateFlag" style="margin-top:30px;"></controlInfo>
  <div class="index__foot">
    <el-button class="qiutBtn" @click="quitEvent">取消</el-button>
    <el-button class="draftBtn" @click="submitone(2,'apply')">保存草稿</el-button>
    <el-button class="sureBtn" @click="submitone(1,'apply')">提交</el-button>
  </div>
</div>
<!-- 查看详情 -->
<div v-if="tab.id===8">
  <institution :rules="rules3" :data="detailData" :status="3"></institution>
  <controlObj :rules="rules3" :data="detailData" :status="3" style="margin-top:30px;"></controlObj>
  <controlInfo :rules="rules3" :data="detailData" :status="3" style="margin-top:30px;"></controlInfo>
  <processInfo :data="detailData" style="margin-top:30px;"></processInfo>
  <el-button class="quitClass" @click="quitEvent">取消</el-button>
</div>
<!-- 续控 -->
<div v-if="tab.id === 10">
  <institution :rules="rules3" :data="xukongData" :status="3"></institution>
  <controlObj :rules="rules3" :data="xukongData" :status="3" style="margin-top:30px;"></controlObj>
  <controlInfo :rules="rules3" :data="xukongData" :status="3" style="margin-top:30px;"></controlInfo>
  <processInfo :data="xukongData" style="margin-top:30px;"></processInfo>
  <controlState :data="xukongData" :controlStatus="currentTab" @quit-event="quitEvent" style="margin-top:30px;"></controlState>
</div>
<!-- 撤控 -->
<div v-if="tab.id === 11">
  <institution :rules="rules3" :data="chekongData" :status="3"></institution>
  <controlObj :rules="rules3" :data="chekongData" :status="3" style="margin-top:30px;"></controlObj>
  <controlInfo :rules="rules3" :data="chekongData" :status="3" style="margin-top:30px;"></controlInfo>
  <processInfo :data="chekongData" style="margin-top:30px;"></processInfo>
  <controlState :data="chekongData" :controlStatus="currentTab" @quit-event="quitEvent" style="margin-top:30px;"></controlState>
</div>
<!-- 编辑 -->
<div v-if="tab.id === 12">
  <institution :rules="rules3" :data="editData" :status="2" @update:data="updateData" :flag="editNum" @update:flag="updateFlag"></institution>
  <controlObj :rules="rules3" :data="editData" :status="2" @update:data="updateData" :flag="editNum" @update:flag="updateFlag" style="margin-top:30px;"></controlObj>
  <controlInfo :rules="rules3" :data="editData" :status="2" @update:data="updateData" :flag="editNum" @update:flag="updateFlag" style="margin-top:30px;"></controlInfo>
  <div class="index__foot">
    <el-button class="qiutBtn" @click="quitEvent">取消</el-button>
    <el-button class="draftBtn" @click="submitone(2,'edit','save')">保存</el-button>
    <el-button class="sureBtn" @click="submitone(1,'edit')">提交</el-button>
  </div>
</div>
</div>
</el-tab-pane>
</el-tabs>
<div class="app-toolbar" v-if="paginationFlag">
  <pagination :count="dataCount" :pagenav="pagenav" @update:pagenav="handlePageChange"></pagination>
</div>
<!-- 申请弹窗 -->
<dialog-form :rad="rad" :url="formDialogUu" :editType="editType" @call:change-update="loadData" :dialog="formDialog" @close="formDialog=false" @update:selector="updatePerson" :personFeatures="personFeatures" @update-draft-list="loadData"></dialog-form>
<dialog-detail :url="uu" :lcid="lcid" :dialog="detailDialog" :type="detailType" :bktype="bklx" @close="detailDialog=false"></dialog-detail>
<!-- 申请弹窗-人员选择 -->
<object-selector-dialog :dialog="personDialog" type="person" v-model="personFeatures" @close="personDialog=false"></object-selector-dialog>

<contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="id" :title="caseName"></contrast-results>


<!-- 右侧栏 -->
<side-right-box :unfoldHandle="unfoldT" @unfoldState="sideState">
  <right-toolbar title="查询列表" :params="screen.queryForm" :options="screen.options" @packup="packup" @update:params="searchSubmit"></right-toolbar>
</side-right-box>


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
      background-color: #20a0ff;
    }
  }

</style>
<!-- 隐藏列表横向滚动条 -->
<style lang="scss">
  .side-right-box_div.control-manage-apply {
    .app-table {
      .el-table__body-wrapper {
        overflow-x: hidden;
        overflow-y: scroll;
      }
    }
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import pagination from '../../../widgets/pagination/pagination'
  import { tableFill } from '../../../utils/util'

  import dialogForm from './dialog-form'
  import dialogDetail from '../detail/dialog-detail'
  import objectselectordialog from '../../../widgets/object-selector-dialog/object-selector-dialog'

  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import '../../../utils/dateFormat'
  import contrastResults from '../supervise/contrastResults.vue'
  import institution from '../common/institution.vue'
  import controlObj from '../common/controlObj.vue'
  import controlInfo from '../common/controlInfo.vue'
  import processInfo from '../common/processInfo.vue'
  import controlState from '../common/controlState.vue'
  import {
    // GET_CONTROL_MANAGE_LIST,
    // GET_CONTROL_LIST_COUNT,
    // REMOVE_CONTROL_MANAGE_DRAFT,
    ADD_APPROVAL,
    REVOKE_APPROVAL,
    GET_CAR_SAVE_CONTROL,
    GET_CAR_LIST_CONTROL,
    GET_CAR_COUT_CONTROL,
    GET_CARDELETE_CONTROL, // 删除草稿
    GET_CAR_INFO_CONTROL
  } from '../../../store/types'
  import { mapState } from 'vuex'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      sideRightBox,
      rightToolbar,
      'dialog-form': dialogForm,
      'dialog-detail': dialogDetail,
      contrastResults,
      institution,
      controlObj,
      controlInfo,
      processInfo,
      controlState,
      'object-selector-dialog': objectselectordialog
    },
    data() {
      return {
        num: 0,
        personDialog: false,
        personFeatures: '',
        loading: true,
        saveFlag: false,
        allData: '',
        detailData: '',
        xukongData: '',
        chekongData: '',
        pageData: [],
        editData: '',
        applyNum: 0,
        editNum: 0,
        status: 1, // 1申请2编辑3查看详情
        id: '',
        dataCount: 0,
        editType: '',
        caseName: '',
        form: {
          Note: '',
          startTime: '',
          endTime: ''
        },
        form2: {
          Note: ''
        },
        paginationFlag: true,
        ajid: '',
        startTime: '',
        bklx: 0,
        lcid: '',
        endTime: '',
        jssj: '',
        ContrastDialog: false,
        showDialog: false,
        thisDialog: false,
        formDialog: false,
        formDialogUu: '',
        detailType: false,
        detailDialog: false,
        dataFlag: false, // 获取申请数据状态
        filter: {},
        bktype: 1,
        currentTab: '1',
        pagenav: {
          currentpage: 1,
          limit: 100
        },
        uu: '',
        rad: 0,
        tabs: [{
          id: 1,
          label: '待审批 (0)'
        }, {
          id: 2,
          label: '未开始 (0)'
        }, {
          id: 3,
          label: '进行中 (0)'
        }, {
          id: 4,
          label: '已结束(0) '
        }, {
          id: 5,
          label: '草稿箱 (0)'
        }],
        rules: {
          Note: [{ required: true, message: '请输入续控原因' }],
          startTime: [{ required: true, message: '请输入续控开始时间' }],
          endTime: [{ required: true, message: '请输入结束时间' }]
        },
        rules2: {
          Note: [{ required: true, message: '请输入撤控原因' }]
        },
        rules3: {
          idCard: { required: true, message: '请输入身份证号码', trigger: 'blur' },
          xm: { required: true, message: '请输入姓名', trigger: 'blur' },
          yjfz: { required: true, message: '请输入阀值', trigger: 'blur' },
          phone: { required: true, message: '请输入电话号码', trigger: 'blur' },
          jygk: { required: true, message: '请输简要概括', trigger: 'blur' },
          bkmc: { required: true, message: '请输入布控名称', trigger: 'blur' },
          kssj: { required: true, message: '请选择开始时间' },
          jssj: { required: true, message: '请选择结束时间' }
        },
        unfoldT: false, // 当前侧栏窗体是否展开状态中继
        screen: {
          queryForm: {
            keyword: '',
            applyTime: '',
            createTime: '',
            zcType: '',
            state: '',
            org: ''
          },
          options: [{
            title: '关键字',
            prop: 'keyword',
            type: 'input',
            subTitle: true
          }, {
            title: '布控时间',
            prop: 'applyTime',
            type: 'daterange'
          }, {
            title: '创建时间',
            prop: 'createTime',
            type: 'daterange'
          }]
        },
        formObj: {}
      }
    },
    computed: {
      ...mapState(['controlManage', 'surveillance'])
    },
    watch: {
      currentTab: function(newVal, oldVal) {
        if (newVal === '7' || newVal === '8' || newVal === '9' || newVal === '10' || newVal === '11' || newVal === '12') {
          this.unfoldT = false
          this.paginationFlag = false
        } else {
          this.paginationFlag = true
        }
      }
    },
    methods: {
      // 获取申请数据状态
      updateFlag(val) {
        if (!val) {
          this.dataFlag = false
        }
      },
      Contrast(val, data) {
        this.ContrastDialog = true
        this.id = val
        this.caseName = data
      },
      submitone(type, types, save) {
        this.dataFlag = true
        if (types === 'edit') {
          type = 3;
          if (save) {
            type = 2
          }
          this.editNum++
        } else {
          this.applyNum++
        }
        this.$nextTick(() => {
          if (this.dataFlag) {
            this.saveFlag = true
            let wjidArr = []
            let wjmcArr = []
            this.formObj.currentFiles.map(item => {
              wjidArr.push(item.id)
              wjmcArr.push(item.name)
            })
            let notifiedsArr = []
            this.formObj.noticePerson.map(item => {
              let jsonData = {
                tzrxm: item.label,
                lylx: 0,
                email: item.mailFlag ? item.mail : '',
                phone: item.messageFlag ? item.message : '',
                sfxttx: 1,
                sfdxtx: item.messageFlag ? 1 : 0,
                sfyjtx: item.mailFlag ? 1 : 0
              }
              notifiedsArr.push(jsonData)
            })
            let properValuesArr = []
            this.formObj.QQ.map(item => {
              if (item !== '') {
                let jsonData = {
                  tzlx: 6,
                  dxlx: 1,
                  tzxx: item,
                  lylx: 2
                }
                properValuesArr.push(jsonData)
              }
            })
            this.formObj.weixin.map(item => {
              if (item !== '') {
                let jsonData = {
                  tzlx: 7,
                  dxlx: 1,
                  tzxx: item,
                  lylx: 2
                }
                properValuesArr.push(jsonData)
              }
            })
            this.formObj.phone.map(item => {
              if (item.phone !== '') {
                let jsonData = {
                  tzlx: 3,
                  dxlx: 1,
                  tzxx: item.phone,
                  lylx: item.lylx ? item.lylx : 3,
                  lybid: item.lybid ? item.lybid : ''
                }
                if (item.IMEI) {
                  let jsonDatas = {
                    tzlx: 4,
                    dxlx: 1,
                    tzxx: item.IMEI,
                    lylx: item.lylx ? item.lylx : 3,
                    lybid: item.lybid ? item.lybid : '',
                    gldx: item.phone
                  }
                  properValuesArr.push(jsonDatas)
                }
                if (item.IMSI) {
                  let jsonDatas = {
                    tzlx: 5,
                    dxlx: 1,
                    tzxx: item.IMSI,
                    lylx: item.lylx ? item.lylx : 3,
                    lybid: item.lybid ? item.lybid : '',
                    gldx: item.phone
                  }
                  properValuesArr.push(jsonDatas)
                }
                properValuesArr.push(jsonData)
              }
            })
            let flags = true
            this.formObj.properValues.map(item => {
              if (item.tzlx === '1') {
                properValuesArr.push(item)
                flags = false
              } else if (item.tzlx === '2') {
                properValuesArr.push(item)
                flags = false
              }
            })
            if (flags) {
              properValuesArr.push({ tzlx: 1, dxlx: 1, tzxx: this.formObj.xm, lylx: 2, lybid: this.formObj.bklyid ? this.formObj.bklyid : '' })
              properValuesArr.push({ tzlx: 2, dxlx: 1, tzxx: this.formObj.idCard, lylx: 2, lybid: this.formObj.bklyid ? this.formObj.bklyid : '' })
            }
            let jsonData = {}
            jsonData = {
              bkzt: type,
              bkmc: this.formObj.bkmc,
              cjr: this.formObj.cjr,
              cjdw: this.formObj.cjdw,
              // cjsj: this.formObj.cjsj,
              // xgsj: this.formObj.cjsj,
              lxdh: this.formObj.lxdh,
              spjjcd: this.formObj.spjjcd,
              sjfw: this.formObj.sjfw.join(','),
              kssj: this.formObj.kssj,
              jssj: this.formObj.jssj,
              jygk: this.formObj.jygk,
              wjid: wjidArr.join(','),
              wjmc: wjmcArr.join(','),
              bkly: this.formObj.bkly,
              sftzbr: this.formObj.sftzbr,
              bklyid: this.formObj.bklyid,
              bklx: 1,
              sfbktp: 1,
              properValues: properValuesArr,
              notifieds: notifiedsArr,
              pictureWarns: { lylx: 1, yjfz: this.formObj.yjfz }
            };
            if (types === 'edit') {
              jsonData.id = this.formObj.id
            }
            this.saveFlag = false;
            this.dispatch(GET_CAR_SAVE_CONTROL, jsonData).then(() => {
              if (this.surveillance.getCarSaveControl === 'success') {
                if (type === 2) {
                  this.$message('保存草稿成功')
                } else if (type === 1) {
                  this.$message('布控申请提交成功')
                }
                setTimeout(this.quitEvent(), 500)
                this.saveFlag = false;
              }
            })
          }
        })
      },
      updateData(val) {
        this.formObj = Object.assign(this.formObj, val)
      },
      newEdit() {
        this.editType = 'newEdit'
        this.currentTab = '7'
        this.applyNum++;
        let flag = true
        this.tabs.map(item => {
          if (item.id === 7) {
            flag = false;
            return false
          }
        })
        if (flag) {
          this.tabs.push({ id: 7, label: '新增人员布控' })
        }
        this.rad = Math.random() * 100
      },
      getEdit(val) {
        this.editType = 'draftEdit'
        this.formDialog = true
        this.formDialogUu = val
      },
      openTwo(val) {
        this.form2.Note = ''
        this.thisDialog = true
        this.ajid = val.id
      },
      closeEventTwo() {
        this.thisDialog = false
        this.form2 = {
          Note: ''
        }
      },
      submitTwo() {
        this.$refs.form2.validate((valid) => {
          if (valid) {
            this.thisDialog = false
            this.dispatch(REVOKE_APPROVAL, {
              id: this.ajid,
              ckyy: this.form2.Note
            })
            this.form2 = {
              Note: ''
            }
          } else {
            this.$message({
              type: 'error',
              message: '请输入撤控理由',
              showClose: true
            })
            return false
          }
        })
      },
      closeEvent() {
        //        this.$refs.form.resetFields()
        this.form = {
          Note: '',
          startTime: '',
          endTime: ''
        }
        this.showDialog = false
      },
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
      },
      formatTime() {
        if (this.startTime === '') {
          this.$message({
            type: 'error',
            message: '请输入布控开始时间',
            showClose: true
          })
        } else this.startTime = this.formatDate(this.startTime)
        if (this.endTime === '') {
          this.$message({
            type: 'error',
            message: '请输入布控开始时间',
            showClose: true
          })
        } else this.endTime = this.formatDate(this.endTime)

        let date = new Date(this.startTime.replace(/-/g, '/'))
        let enddate = new Date(this.endTime.replace(/-/g, '/'))
        let jssj = new Date(this.jssj.replace(/-/g, '/'))

        if (jssj > date) {
          this.$message({
            type: 'error',
            message: '布控开始时间应该大于布控结束时间',
            showClose: true
          })
          this.startTime = '';
          this.jssj = ''
          this.ajid = ''
        }
        if (date > enddate) {
          this.$message({
            type: 'error',
            message: '布控开始时间应该小于结束时间，请重新输入',
            showClose: true
          })
          this.startTime = '';
          this.endTime = ''
          this.ajid = ''
        }
      },
      formatDate(date) {
        if (typeof date === 'string') {
          return date
        } else {
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + this.formatTen(month) + '-' + this.formatTen(day)
        }
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid === true) {
            this.startTime = this.formatDate(this.form.startTime)
            this.endTime = this.formatDate(this.form.endTime)
            this.formatTime()
            this.dispatch(ADD_APPROVAL, {
              id: this.ajid,
              kssj: this.startTime,
              jssj: this.endTime,
              xkyy: this.form.Note
            })
            this.showDialog = false
            this.form = {
              Note: '',
              startTime: '',
              endTime: ''
            }
            this.loadData()
          } else {
            this.$message({
              type: 'error',
              message: '请输入续控信息',
              showClose: true
            })
            return false
          }
        })
      },
      open(val) {
        this.jssj = val.jssj.substring(0, 10)
        this.ajid = val.id
        this.showDialog = true
      },
      callDetailDialog(type, num, value) {
        this.dispatch(GET_CAR_INFO_CONTROL, { id: value }).then(() => {
          this.allData = this.surveillance.getCarInfoControl
          if (type === 3) {
            this.detailData = this.allData
            this.currentTab = '8'
            let flag = true
            this.tabs.map(item => {
              if (item.id === 8) {
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 8, label: '查看详情' })
            }
          } else if (type === 4) {
            this.currentTab = '9'
            this.status = 3
            let flag = true
            this.tabs.map(item => {
              if (item.id === 9) {
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 9, label: '审批' })
            }
          } else if (type === 5) {
            this.currentTab = '10'
            this.xukongData = this.allData
            let flag = true
            this.tabs.map(item => {
              if (item.id === 10) {
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 10, label: '续控' })
            }
          } else if (type === 6) {
            this.currentTab = '11'
            this.chekongData = this.allData
            let flag = true
            this.tabs.map(item => {
              if (item.id === 11) {
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 11, label: '撤控' })
            }
          } else if (type === 7) {
            this.currentTab = '12'
            this.editData = this.allData;
            let flag = true
            this.tabs.map(item => {
              if (item.id === 12) {
                flag = false;
                return false
              }
            })
            if (flag) {
              this.tabs.push({ id: 12, label: '编辑' })
            }
          }
        })
      },
      detel(row) {
        this.$confirm('是否要删除本条草稿', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(GET_CARDELETE_CONTROL, {
            id: row.bkid
          }).then(() => {
            this.loadData({}, 5)
            this.$message('删除成功')
          })
        }).catch(() => {});
      },
      sideState(s) {
        // 窗体自身操作更新窗体状态
        this.unfoldT = s
      },
      handleClick(tab, event) {
        //  tab的点击触发事件
        if (tab.name === '7' || tab.name === '8' || tab.name === '9') {
          this.paginationFlag = false;
        } else {
          this.paginationFlag = true;
        }
        this.loadData(this.filter, parseInt(tab.name));
      },
      packup() {
        // 收起侧栏
        this.unfoldT = false
      },
      searchSubmit(obj) {
        // 条件筛选
        this.filter = {
          keyword: obj.keyword,
          kssj: obj.applyTime[0] ? this.dateFormat(new Date(obj.applyTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          jssj: obj.applyTime[1] ? this.dateFormat(new Date(obj.applyTime[1]), 'yyyy-MM-dd hh:mm:ss') : '',
          cjsj_begin: obj.createTime[0] ? this.dateFormat(new Date(obj.createTime[0]), 'yyyy-MM-dd hh:mm:ss') : '',
          cjsj_end: obj.createTime[1] ? this.dateFormat(new Date(obj.createTime[1]), 'yyyy-MM-dd hh:mm:ss') : ''
        }
        this.loadData(this.filter, this.currentTab, 1, 100)
        obj = {}
        this.packup()
      },
      handleRightSide() {
        // 右侧窗体状态操作
        if (parseInt(this.currentTab) > 5) {
          this.unfoldT = false
          return
        }
        this.unfoldT = !this.unfoldT
      },
      loadData(filter = {}, taptype = 1, PageIndex = 1, PageSize = 100) {
        let bklx = 1;
        this.dispatch(GET_CAR_COUT_CONTROL, { filter, bklx }).then(_ => {
          this.setTabs();
        });
        taptype = parseInt(this.currentTab)
        this.dispatch(GET_CAR_LIST_CONTROL, { ...filter, taptype, PageIndex, PageSize, bklx }).then(() => {
          this.pageData = this.surveillance.getCarListControl.PageData;
          this.dataCount = this.surveillance.getCarListControl.DataCount;
        })
      },
      setTabs() {
        const count = this.surveillance.getCarCoutControl;
        this.tabs.map(item => {
          switch (item.id) {
            case 1:
              item.label = '待审批 (' + count.dsp + ')';
              break;
            case 2:
              item.label = '未开始 (' + count.wks + ')';
              break;
            case 3:
              item.label = '进行中 (' + count.jxz + ')';
              break;
            case 4:
              item.label = '已结束 (' + count.yjs + ')';
              break;
            case 5:
              item.label = '草稿箱 (' + count.cgx + ')';
              break
          }
        })
      },
      handlePageChange(page) {
        this.pagenav = page;
        this.loadData(this.filter, this.currentTab, page.currentpage, page.limit);
      },
      updatePerson(val) {
        this.personDialog = true
        this.personFeatures = val
      },
      quitEvent() {
        this.tabs.map((item, index) => {
          if (item.id === parseInt(this.currentTab)) {
            this.tabs.splice(index, 1)
            this.currentTab = '1'
            this.loadData();
            return false
          }
        })
      }
    },
    mounted() {
      console.log(GET_CAR_SAVE_CONTROL)
      this.loadData();
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
