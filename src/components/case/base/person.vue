<!-- 涉案人员 -->
<template>
<el-row :gutter="10">
  <el-col :span="checkUserRuleCaseFolder.personnelList && checkUserRuleCaseFolder.suspectList?12:24" v-if="checkUserRuleCaseFolder.personnelList">
    <div class="person-box">
      <card-header title="报案人/受害人/证人" :tool="false"></card-header>
      <el-row>
        <el-col :span="24">
          <div class="person-box__person" v-for="(d,index) in victim">
            <div class="person-box__person__type-box">
              <div :key="dTindex" v-for="(dTip,dTindex) in d.peopleTypeMark" :class="{'person-box__person__type':true,'person-box__person__type--s':dTip && dTip.indexOf('受')!==-1}">
                {{dTip}}
              </div>
            </div>

            <div class="person-box__person__btn-box">
              <el-button type="text" title="删除" @click="remove(1,d,index)" v-if="checkUserRuleCase('ajgl/personnel/delete',caseId,true,cjrId)">
                <i class="iconfont icon-trash"></i></el-button>
              <el-button type="text" title="编辑" @click="edit(d,1)" v-if="checkUserRuleCase('ajgl/personnel/update',caseId,true,cjrId)" style="margin-left:0">
                <i class="iconfont icon-xinjianbiji"></i></el-button>
              <el-button type="text" title="笔录" @click="record(d,1)" style="margin-left:0">
                <i class="iconfont icon-bianji"></i></el-button>
              <el-button type="text" title="笔录列表" @click="goRecordList(d,1)" style="margin-left:0">
                <i class="iconfont icon-ranking"></i></el-button>
              <!-- <el-button type="text"><i class="iconfont icon-link"></i></el-button>-->
            </div>
            {{d.sfz}}
            <div class="person-box__person__img">
              <data-image class="person-box__person__image" v-show="d.imageId === null" :idCard="d.idCard"></data-image>
              <img class="person-box__person__image" v-show="d.imageId !== null" :src="d.imageURL" width="100px" alt="照片">
              <span class="person-box__person__name">{{d.name}}</span>
              <span class="ico-delete btn-action"></span>
            </div>
            <!--<el-button style="height: auto;margin-top: 125px" @click="record(d,1)">笔录制作</el-button>-->
          </div>
          <div v-if="checkUserRuleCase('ajgl/personnel/save',caseId,true,cjrId)" class="person-box__person person-box__person--empty" @click="add(1)"></div>
        </el-col>
      </el-row>
    </div>
  </el-col>

  <el-col :span="12" v-if="checkUserRuleCaseFolder.suspectList">
    <div class="person-box">
      <card-header title="嫌疑人" :tool="false"></card-header>
      <el-row>
        <el-col :span="24">
          <div class="person-box__person" v-for="(d,index) in criminal">
            <div>
              <div class="person-box__person__btn-box">
                <el-button type="text" title="删除" @click="remove(2,d,index)" v-if="checkUserRuleCase('ajgl/suspect/delete',caseId,true,cjrId)">
                  <i class="iconfont icon-trash"></i>
                </el-button>
                <el-button type="text" title="编辑" @click="edit(d,2)" v-if="checkUserRuleCase('ajgl/suspect/update',caseId,true,cjrId)" style="margin-left:0"><i class="iconfont icon-xinjianbiji"></i></el-button>
                <el-button type="text" title="笔录制作" @click="record(d,1)" style="margin-left:0">
                  <i class="iconfont icon-bianji"></i></el-button>
                <el-button type="text" title="笔录列表" @click="goRecordList(d,1)" style="margin-left:0">
                  <i class="iconfont icon-ranking"></i></el-button>
                <!--<el-button type="text"><i class="iconfont icon-link"></i></el-button>-->
              </div>
              <!-- @click="viewSuspectInfo(d,index)" -->
              <div class="person-box__person__img" @click="viewSuspectInfo(d,index)">
                <data-image class="person-box__person__image" v-show="d.imageId === null" :idCard="d.idCard"></data-image>
                <img class=" person-box__person__image" v-show="d.imageId !==null " :src="d.imageURL" width="100px" alt="照片">
                <span class="person-box__person__name ">{{d.name}}</span>
                <span class="ico-delete btn-action "></span>
              </div>
            </div>
            <!--<el-button style="height: auto;margin-top: 125px " @click="record(d,1)">笔录制作</el-button>-->
          </div>
          <div v-if="checkUserRuleCase( 'ajgl/suspect/save',caseId,true,cjrId) " class="person-box__person person-box__person--empty " @click="add(2) "></div>
        </el-col>
      </el-row>
    </div>
  </el-col>
  <dialog-people-info :dialog="peopleInfoDialog " :data="detail " @close="peopleInfoDialog=false "></dialog-people-info>
  <dialog-add-people :dialog="addPeopleDialog1" :type="1" :data="detail " @update:submit="submit " @close="addPeopleDialog1=false "></dialog-add-people>
  <dialog-add-people :dialog="addPeopleDialog2" :type="2" :data="detail " @update:submit="submit " @close="addPeopleDialog2=false "></dialog-add-people>
  <dialog-res-people :dialog="resPeopleDialog " @close="resPeopleDialog=false "></dialog-res-people>
  <!-- 查看嫌疑人信息 -->
  <dialog-view-people :dialog="viewSuspectDialog " :data="suspectInfo" @on-goRecordList-info="goRecordList" @on-apply-control="applyControl" @on-view-control="viewControlRes" @update-draft-list="refreshList" @close="viewSuspectDialog=false " @view-people="openViewPeople"></dialog-view-people>
  <!-- 编辑模态窗 large/tiny-->
  <penRecordList :dialog="penRecordListDialog" :message="message" @close="penRecordListDialog=false"></penRecordList>
  <!-- 添加布控 -->
  <!-- @call:change-update="loadData" -->
  <dialog-form :type="'people'" :peopleObj="suspectInfo" :dialog="formDialog" @close="closeControl" @update-draft-list="queryList" :hiddenBtn="true"></dialog-form>
  <!-- 查看布控结果  -->
  <dialog-contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="suspectInfo.controlId" :title="suspectInfo.name"></dialog-contrast-results>

</el-row>
</template>

<style scoped lang="scss">
  .person-box {
    background: #fff;
    padding: 10px;
    &__person {
      // cursor: pointer;
      background: #f2f2f2;
      text-align: center;
      width: 90px;
      height: 120px;
      margin: 10px 5px 0;
      border: 1px solid #ccc;
      display: inline-block;
      position: relative;
      z-index: 2;
      &__image {
        cursor: pointer;
        width: 80px;
        max-height: 95px;
        position: absolute;
        top: calc(50% - 10px);
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
      &__type-box {
        position: absolute;
        bottom: 17px;
        right: 3px;
        z-index: 3;
      }
      &__type {
        float: left;
        background: #69c2fd;
        color: #fff;
        width: 20px;
        height: 20px;
        margin-left: 3px;
        border-radius: 20px;
        &--s {
          background: #ff6f6f;
        }
      }
      &__name {
        font-size: 12px;
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }
      &__btn-box {
        width: 30px;
        border: 1px solid #ccc;
        border-left: 0;
        display: none;
        position: absolute;
        bottom: -1px;
        right: -31px;
        transition: 0.25s;
        .el-button {
          background: #e4e4e4;
          width: 100%;
          height: 28px;
          padding: 0;
          &+& {
            border-top: 1px solid #ccc;
          }
          .iconfont {
            color: #999999;
            margin: 0;
          }
          &:hover {
            background: #4db8ff;
            .iconfont {
              color: #fff;
            }
          }
        }
      }
      &:hover {
        z-index: 3;
        .person-box__person__btn-box {
          display: block;
        }
      }
      &--empty {
        background: transparent;
        border: 0;
        z-index: 1;
        &:before {
          content: '+';
          background: #efefef;
          font-size: 64px;
          color: #c9c9c9;
          vertical-align: top;
          text-align: center;
          width: 60px;
          height: 60px;
          line-height: 50px;
          border-style: dashed;
          display: block;
          z-index: 1;
          cursor: pointer;
          opacity: 0.8;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          &hover {
            opacity: 1;
          }
        }
      }
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import {
    FETCH_INVOLVED_CASE_PEOPLE_LIST,
    ADD_INVOLVED_CASE_PEOPLE,
    UPDATE_INVOLVED_CASE_PEOPLE,
    GET_INVOLVED_CASE_PEOPLE_INFO,
    REMOVE_INVOLVED_CASE_PEOPLE,

    FETCH_SUSPECT_CASE_PEOPLE_LIST,
    ADD_SUSPECT_CASE_PEOPLE,
    GET_SUSPECT_CASE_PEOPLE_INFO,
    UPDATE_SUSPECT_CASE_PEOPLE,
    REMOVE_SUSPECT_CASE_PEOPLE,
    GET_PEN_RECORD_CLIENT
  } from '../../../store/types'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  import bus from '../../../utils/bus'
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import cardHeader from './card-header.vue'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'
  import dialogAddPeople from '../involve/dialog-add-people'
  import dialogResPeople from '../involve/dialog-res-people'
  import dataImage from '../../../widgets/data-image/data-image'
  import penRecordList from './penRecord/penRecordList.vue'
  import dialogViewPeople from '../involve/dialog-view-people'
  import dialogForm from '../../controlManage/apply/dialog-form'
  import dialogContrastResults from '../../controlManage/supervise/contrastResults'

  export default {
    mixins: [mixin, infoDialogEvents],
    components: {
      penRecordList,
      'data-image': dataImage,
      cardHeader,
      'dialog-people-info': dialogInfo,
      'dialog-add-people': dialogAddPeople,
      'dialog-res-people': dialogResPeople,
      'dialog-view-people': dialogViewPeople,
      'dialogForm': dialogForm,
      'dialog-contrast-results': dialogContrastResults
    },
    computed: {
      ...mapState(['involvedCasePeople', 'suspectCasePeople', 'penRecord'])
    },
    data() {
      return {
        message: '',
        formDialog: false, // 申请布控
        penRecordListDialog: false, // 笔录列表
        checkUserRuleCaseFolder: { // 多个遍历一套权限
          suspectList: true, // ajgl/suspect/list
          personnelList: true // ajgl/personnel/list
        },
        addPeopleDialog1: false,
        ContrastDialog: false, // 布控结果
        addPeopleDialog2: false,
        resPeopleDialog: false,
        viewSuspectDialog: false,
        dialogType: 1,
        number: 0,
        peopleData: null,
        victim: [],
        criminal: [],
        detail: {},
        caseName: '', // 案件名称
        id: '', // 布控id
        caseId: '',
        cjrId: '',
        suspectInfo: {}, // 嫌疑人信息
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 100,
          currentpage: 1
        }
      }
    },
    methods: {
      openViewPeople(data) {
        this.peopleInfoDialog = true;
        this.detail = data;
      },
      dataMatch(handleType, DM) {
        // 数据匹配
        let _peopleTypeMap = {
          1: '报',
          2: '受',
          3: '证'
        }
        let _dataMatchs = {
          peopleTypeMark: [] // 1报案人 2受害人 3证人
        }
        let _peopleTypeMark = []
        if (handleType === 1) { // 报案人/受害人/证人
          _peopleTypeMark = DM.lb.map(dtt => {
            return _peopleTypeMap[dtt]
          })
          _dataMatchs = {
            id: DM.id,
            name: DM.xm,
            idCard: DM.sfz,
            imageId: DM.tpid,
            imageURL: DM.tpid === '' || !DM.tpid ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + DM.tpid,
            sex: DM.xb,
            sexText: DM.xbmc,
            birthday: DM.csrq,
            remark: DM.ms,
            peopleType: DM.lb, // 1报案人 2受害人 3证人
            peopleTypeText: DM.lbmc, // 1报案人 2受害人 3证人
            peopleTypeMark: _peopleTypeMark, // 1报案人 2受害人 3证人
            sourceTable: DM.table
          }
        } else if (handleType === 2) { // 嫌疑人
          _dataMatchs = {
            id: DM.id,
            name: DM.xm,
            idCard: DM.sfz,
            upPeople: DM.xyrsj,
            imageId: DM.pic,
            imageURL: DM.pic === '' || !DM.pic ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + DM.pic,
            age: DM.nl,
            crimeTrait: DM.zatd,
            crimeTraitText: DM.zatdmc,
            crimeCause: DM.zayy,
            crimeCauseText: DM.zayymc,
            crimeTool: DM.zagjmc,
            crimeMeans: DM.zasdmc,
            formTrait: DM.tmtz,
            stature: DM.sg,
            bodilyForm: DM.tx,
            nickname: DM.ch,
            sourceData: DM.ly,
            remark: DM.tjsm,
            sourceTable: DM.table,
            controlId: DM.bkid || '',
            controlState: DM.bkzt || '',
            resCount: DM.bksl,
            lylx: '4' // 来源类型
          }
        }

        return _dataMatchs
      },
      queryList() {
        // 查询列表
        const queryPaths = []
        if (this.checkUserRuleCaseFolder.personnelList) {
          queryPaths.push(FETCH_INVOLVED_CASE_PEOPLE_LIST) // 报案人/受害人/证人
        }
        if (this.checkUserRuleCaseFolder.suspectList) {
          queryPaths.push(FETCH_SUSPECT_CASE_PEOPLE_LIST) // 嫌疑人
        }
        for (let queryI in queryPaths) {
          this.dispatch(queryPaths[queryI], {
            ajid: this.caseId,
            PageIndex: this.pageInfo.currentpage,
            PageSize: this.pageInfo.limit
          })
        }
      },
      getQueryInfo(handleType, carId, callback = () => {}) {
        // 查询单条信息
        let __dispatch = GET_INVOLVED_CASE_PEOPLE_INFO
        if (handleType === 2) { // 嫌疑人操作
          __dispatch = GET_SUSPECT_CASE_PEOPLE_INFO
        }
        this.dispatch(__dispatch, {
          id: carId
        }).then(() => {
          callback()
        })
      },
      add(handleType) {
        this.dialogType = handleType
        this.detail = null
        if (handleType === 1) {
          this.addPeopleDialog1 = true
        } else if (handleType === 2) {
          this.addPeopleDialog2 = true
        }
      },
      edit(d, handleType) {
        // 编辑
        this.dialogType = handleType
        this.getQueryInfo(handleType, d.id, _ => {
          let _detailType = handleType === 1 ? this.involvedCasePeople.Model : this.suspectCasePeople.Model
          this.detail = this.dataMatch(handleType, _detailType)
          if (handleType === 1) {
            this.addPeopleDialog1 = true
          } else if (handleType === 2) {
            this.addPeopleDialog2 = true
          }
        })
      },
      record(d, handleType) {
        // 登录笔录系统
        this.$http.get('http://127.0.0.1:8189/Service/?Msg=bilu', {}, this.httpSettings).then(() => {
          this.dispatch(GET_PEN_RECORD_CLIENT).then(() => {
            window.location.href = this.penRecord.getPenRecordClient.source
          })
        }).catch(() => {
          this.$confirm('您尚未安装智能笔录客户端, 可通过下方按钮进入下载页面下载安装.', '温馨提示', {
            confirmButtonText: '前往下载',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.open('http://10.146.90.26:8080')
          }).catch(() => {});
        })
      },
      goRecordList(d, handleType) {
        // 笔录列表
        this.penRecordListDialog = true
        console.log('这是笔录列表的触发事件', this.penRecordListDialog)
        this.message = d
      },
      remove(handleType, item, index) {
        // 删除操作
        let __dispatch = REMOVE_INVOLVED_CASE_PEOPLE
        if (handleType === 2) { // 嫌疑人操作
          __dispatch = REMOVE_SUSPECT_CASE_PEOPLE
        }
        let removeCarId = item.id
        this.$confirm('确认删除该人员?', '温馨提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(__dispatch, {
            ids: removeCarId
          }, index).then(() => {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
          })
        }).catch(() => {});
      },
      submit(form) {
        let submitType, dataDetail
        // 当前操作类型
        if (form.handleType === 1) { // 涉案人员/受害人/证人
          submitType = ADD_INVOLVED_CASE_PEOPLE
          dataDetail = {
            xm: form.name,
            lb: form.peopleType,
            sfz: form.idCard,
            xb: form.sex,
            tpid: form.imageId,
            csrq: form.birthday,
            ms: form.remark
          }
        } else if (form.handleType === 2) { // 嫌疑人
          submitType = ADD_SUSPECT_CASE_PEOPLE
          dataDetail = {
            xm: form.name,
            sfz: form.idCard,
            xyrsj: form.upPeople,
            pic: form.imageId,
            nl: form.age,
            zatd: form.crimeTrait,
            zayy: form.crimeCause,
            zagj: form.crimeTool,
            zasd: form.crimeMeans,
            tmtz: form.formTrait,
            sg: form.stature,
            tx: form.bodilyForm,
            ch: form.nickname,
            tjsm: form.remark
          }
        }
        if (form.id !== '') { // 判断表单id是否为空，非空可判断为更新提交
          submitType = form.handleType === 1 ? UPDATE_INVOLVED_CASE_PEOPLE : UPDATE_SUSPECT_CASE_PEOPLE // 涉案人员/受害人/证人 : 嫌疑人
          dataDetail.id = form.id
        } else {
          dataDetail.ajid = this.$route.query.a // 新增数据赋值当前案件id
        }

        this.dispatch(submitType, dataDetail).then(d => {
          if (form.handleType === 1) {
            this.detail = this.involvedCasePeople.PageData[this.involvedCasePeople.PageData.length - 1]
          } else {
            this.detail = this.suspectCasePeople.PageData[this.suspectCasePeople.PageData.length - 1]
          }
          // 操作成功
          this.editCarDialog = false
          this.addPeopleDialog = false // 关闭窗口
          this.addPeopleDialog1 = false // 关闭窗口
          this.addPeopleDialog2 = false // 关闭窗口
          this.queryList()
        }).catch(err => {
          // 操作失败
          console.log('操作失败', err)
          this.editCarDialog = false
        });
      },
      /**
       * 刷新相关操作权限限制
       */
      refreshRule() {
        this.checkUserRuleCaseFolder = { // 多个遍历一套权限
          suspectList: this.checkUserRuleCase('ajgl/suspect/list', this.caseId, true, this.cjrId), // ajgl/suspect/list
          personnelList: this.checkUserRuleCase('ajgl/personnel/list', this.caseId, true, this.cjrId) // ajgl/personnel/list
        }
      },
      /**
       * 查看嫌疑人信息
       */
      viewSuspectInfo(d, index) {
        this.number = index
        this.suspectInfo = d
        this.viewSuspectDialog = true
      },
      // 申请布控
      applyControl() {
        this.formDialog = true
      },
      // 查看布控
      viewControlRes() {
        this.ContrastDialog = true
      },
      // 刷新列表
      refreshList() {
        this.queryList()
        this.viewSuspectDialog = false
        // this.$nextTick(() => {
        //   this.viewSuspectInfo(this.criminal[this.number], this.number)
        // })
        // setTimeout(function () {
        //   this.viewSuspectInfo(this.criminal[this.number], this.number)
        // }, 200)
      },
      //  关闭布控页面及刷新数据
      closeControl() {
        this.formDialog = false
        setTimeout(() => {
          this.refreshList()
        }, 300)
      }
    },
    mounted() {},
    watch: {
      'involvedCasePeople.PageData' (val) {
        this.victim = val.map(row => {
          return this.dataMatch(1, row)
        })
        this.pageInfo.count = this.involvedCasePeople.DataCount
      },
      'suspectCasePeople.PageData' (val) {
        this.criminal = val.map(row => {
          return this.dataMatch(2, row)
        })
        if (this.criminal.length >= 1) {
          for (let i = 0; i <= this.criminal.length; i++) {
            if (this.criminal[i].idCard) {
              bus.$emit('caseIdCard', this.criminal[i].idCard)
              return false;
            }
          }
        }
        this.pageInfo.count = this.suspectCasePeople.DataCount
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件创建人id
      this.queryList()
      this.refreshRule()
    }
  }

</script>
