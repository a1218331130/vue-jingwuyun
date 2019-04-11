<template>
  <div>
      <el-form ref="controlForm" :model="controlForm" label-width="100px" :rules="rules" :inline="true">
         <el-card class="carControl firstCard">
             <div class="clearfix" slot="header">
                <span>单位信息</span>
             </div>
              <el-row>
                  <el-col :span="6">
                    <el-form-item label="申请人">
                      <el-input v-model="controlForm.applyUsername" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="申请单位">
                      <el-input v-model="controlForm.applyDeptname" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                  <!-- <el-col :span="6">
                    <el-form-item prop="title" label="申请时间">
                       <el-input v-model="booleanFlag" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col> -->
                  <el-col :span="6">
                    <el-form-item label="联系电话">
                      <el-input v-model="controlForm.mobile" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
         </el-card>  
         <el-card class="carControl cars">
            <div class="clearfix" slot="header">
              <span>案件信息</span>
            </div>
             <el-row>
                 <el-col :span="6">
                     <el-form-item prop="caseName" label="案件名称">
                       <el-select  v-model="controlForm.caseId" :disabled="editFlag" placeholder="请选择" clearable filterable @change="caseChange">
                        <el-option v-for="item in caseArray" :label="item.VALUE" :value="item.ID" :key="item.ID" required="true"></el-option>
                      </el-select> 
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item prop="title" label="案件编号">
                      <el-input v-model="caseObj.caseNum" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col>
                 <!-- <el-col :span="6">
                    <el-form-item prop="title" label="接处警编号">
                      <el-input v-model="booleanFlag" required="true" :disabled="true"></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="6">
                    <el-form-item prop="title" label="案发时间">
                     <el-input v-model="caseObj.caseTime" required="true" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                  <el-col :span="24">
                    <el-form-item prop="title" label="简要案情">
                      <el-input v-model="caseObj.caseJyaq" required="true" :disabled="true" type="textarea" style="width:1200px" :rows="3"></el-input>
                    </el-form-item>
                  </el-col>
            </el-row>
             <!-- <el-row>
                  <el-col :span="24">
                    <el-form-item prop="title" label="添加附件">
                      <upload @upload:submit="uploadSubmit">
                        <el-button slot="button" type="primary">上传附件</el-button>
                      </upload>
                    </el-form-item>
                  </el-col>
            </el-row> -->
        </el-card>
        <el-card class="carControl cars">
            <div class="clearfix" slot="header">
              <span>协同信息</span>
            </div>
            <el-row class="applyMessage">
                <el-col :span="2" class="title" style="width:80px">
                  <span style="color: #ff4949;">*</span>协同名称：
                </el-col>
                <el-col :span="8">
                  <el-form-item prop="xtTitle" label=""> 
                    <el-input v-model="controlForm.title" required="true" :disabled="editFlag"></el-input>
                  </el-form-item> 
                </el-col>
            </el-row> 
            <el-row class="applyMessage">
                <el-col :span="2" class="title">
                  <span style="color: #ff4949;">*</span>法律文件/佐证：
                </el-col>
                <el-col :span="8" class="title">
                  <a :href="uploadId">{{controlForm.fileName}}</a>
                </el-col>
                <el-col :span="3" style=" opacity: 0">
                   <upload @upload:submit="uploadSubmit" uploadType="multiple"> 
                      <el-button slot="button" type="primary" :disabled="editFlag">上传附件</el-button>
                     </upload> 
                </el-col>
                <!-- <el-col :span="19" class="rightTitle" >
                  最大字数1000字
                </el-col> -->
            </el-row> 
            <!-- <el-row>
                  <el-col :span="24">
                     <el-form-item prop="title" label=""> 
                      <el-input v-model="controlForm" placeholder="请输入法律文件/佐证材料" required="true" :disabled="editFlag" type="textarea" style="width:1620px" :rows="3"></el-input>
                     </el-form-item> 
                  </el-col>
            </el-row> -->
             <el-row class="applyMessage">
              <el-col :span="2" class="title">
                现有线索：
              </el-col>
              <!-- <el-col :span="3">
                <upload @upload:submit="uploadSubmit">
                    <el-button slot="button" type="primary">上传附件</el-button>
                  </upload>
              </el-col> -->
               <el-col :span="22" class="rightTitle" >
                 最大字数1000字
              </el-col> 
            </el-row> 
            <el-row>
                  <el-col :span="24">
                     <el-form-item prop="title" label=""> 
                      <el-input v-model="controlForm.existClue" placeholder="请输入现有线索" required="true" :disabled="editFlag" type="textarea" style="width:1620px" :rows="3"></el-input>
                     </el-form-item> 
                  </el-col>
            </el-row>
             <el-row class="applyMessage">
              <el-col :span="2" class="title">
                <span style="color: #ff4949;">*</span>合成请求：
              </el-col>
               <el-col :span="22" class="rightTitle" >
                 最大字数1000字
              </el-col> 
            </el-row>
             <el-row>
                  <el-col :span="24">
                     <el-form-item prop="title" label=""> 
                      <el-input v-model="controlForm.hcRequest" placeholder="请输入合成请求" required="true" :disabled="editFlag" type="textarea" style="width:1620px" :rows="3"></el-input>
                     </el-form-item> 
                  </el-col>
            </el-row> 
             <el-row class="applyMessage">
                <el-col :span="2" class="title" style="width:110px">
                  <span style="color: #ff4949;">*</span>审批紧急程序：
                </el-col>
                <el-col :span="8">
                   <el-select  v-model="controlForm.emergency" :disabled="editFlag" placeholder="请选择" clearable filterable>
                        <el-option v-for="item in urgentArr" :label="item.label" :value="item.key" :key="item.key" required="true"></el-option>
                      </el-select> 
                </el-col>
                <el-col :span="2" class="title" style="width:80px">
                  <span style="color: #ff4949;">*</span>协办单位：
                </el-col>
                 <el-col :span="8">
                    <el-input v-model="controlForm.xbDeptname" required="true" @focus="departMent" :disabled="editFlag"></el-input>
                </el-col>             
            </el-row> 
        </el-card>
        <el-card class="carControl cars carDetail">
            <div class="clearfix" slot="header">
              <span>流程明细</span>
            </div>
            <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border :stripe="true" :data="dataList">
              <el-table-column align="center" type="index" label="序号" width="50">
                  <template scope="scope">
                    {{scope.$index + 1 + 30 * (1 - 1)}}
                  </template>
              </el-table-column>
              <el-table-column align="center" label="流程步骤" prop="approvalNode"></el-table-column>
              <el-table-column align="center" label="审批人" prop="approvalPersonname"></el-table-column>
              <el-table-column align="center" label="审批时间" prop="approvalTime"></el-table-column>
              <el-table-column align="center" label="审批状态" prop="isAgree">
                   <template scope="scope">
                    <span v-if="scope.row.isAgree!==null">{{scope.row.isAgree === '1'?'同意':'不同意'}}</span>
                  </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="是否同意" prop="isAgree"></el-table-column>
              <el-table-column align="center" label="是否签收" prop="isSign"></el-table-column>
              <el-table-column align="center" label="签收状态" prop="signStatus"></el-table-column>
              <el-table-column align="center" label="签收时间" prop="signTime"></el-table-column>
              <el-table-column align="center" label="办理时间" prop="handleTime"></el-table-column> -->
              <el-table-column align="center" label="审批意见" prop="approvalAdvice"></el-table-column>
              </el-table>
        </el-card>
        <el-card class="carControl cars" v-if="xtTitles==='审批' && applyType==='view'">
            <div class="clearfix" slot="header">
              <span>审批结果</span>
            </div>
             <el-row>
                 <el-col :span="6">
                     <el-form-item prop="caseName" label="审批结果">
                       <el-select  v-model="isAgree" placeholder="请选择" clearable filterable @change="approveSelect">
                        <el-option v-for="item in agreeArr" :label="item.label" :value="item.key" :key="item.key" required="true"></el-option>
                      </el-select> 
                    </el-form-item>
                  </el-col>
            </el-row>
            <el-row>
                  <el-col :span="24">
                    <el-form-item prop="title" label="审批意见">
                      <el-input v-model="approveData.approvalAdvice" required="true" type="textarea" style="width:1200px" :rows="3"></el-input>
                    </el-form-item>
                  </el-col>
            </el-row>
        </el-card>
        <el-row class="footerBtn" v-if="xtTitles!=='查看详情'">
             <el-button type="default" @click="resetForm('审批')">
                取消
              </el-button>
              <el-button type="primary" @click="submitForm('审批')">
                提交审批
              </el-button>
        </el-row>
        <el-row class="footerBtn" v-if="xtTitles==='查看详情'">
          <el-button type="default" @click="resetForm('查看详情')">
            取消
          </el-button>
        </el-row>
     </el-form>
     <unit-selector :dialog="chooseNotifUnitDialog" @update:value="updateNotifPerson" size="middle--user" @close="chooseNotifUnitDialog=false"></unit-selector>
  </div>
</template>
<style>
  .footerBtn .el-button{
    padding: 10px 30px;
  }
  .applyMessage .el-button{
    padding: 5px 30px;
  }
  .bkfw .el-checkbox-button .el-checkbox-button__inner{
     border-left: 1px solid #bfcbd9;
  }
  .bkfw .el-checkbox-button{
     margin-right: 5px;
  }
  .carDetail .el-table th.is-leaf{
    background: #85C0e8;
  }
  .carDetail .el-table th.is-leaf .cell{
    background: #85C0e8;
  }
  .carControl .el-card__header{
    padding: 10px 20px;
    background: #85C0e8;
    color: white;
    font-weight: bold;
    font-size: 15px;
  }
  .carControl .el-input{
     width: 250px;
   }
</style>
<style lang="scss" scoped>
  .applyMessage .title{
    color: #9c9c9c;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .applyMessage .rightTitle{
    color: #9c9c9c;
    text-align: right;
  }
  .footerBtn{
    padding: 30px 0;
    text-align: center;
  }
   .cars{
      margin-top: 10px;
   }
   .controlObject{
      position: relative;
   }
   .controlObject .imageDiv{
      position: absolute;
      top: 60px;
      right: 20px;
   }
   .controlObject .imageDiv .imageText{
     color: #9c9c9c;
     float: left;
     background: #f8f8f8;
     border: 1px solid #bfcbd9;
     height: 110px;
     text-align: center;
     margin-right: 20px;
     width: 30px;
     font-size: 16px;
     padding-top: 20px;
   }
   .controlObject .imageDiv img{
      width: 300px;
      height: 130px;
   }
</style>
<script>
  // libraryResultSearch
  import { mapState } from 'vuex'
  import upload from '../../../widgets/upload/upload'
  import unitselector from './unit-selector'
  // GET_SURVEILLANCE_TACTICS_RESULT_BY_ID,
  import { GET_APPLY_PERSON_INFO, GET_CUR_USER_CASE_LIST, XT_GET_CASE_INFO, XT_VIEW_DETAIL, XT_APPROVAL } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  // import { clone } from '../../../utils/util'
  import list from '../../tactics/apply/list'
  import sideRightBox from '../../control/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
  import TopBar from '../../common/topbar/index.vue'
  // import dialogNotifPerson from './dialog-chooseNotifPerson'
  // import userselector from '../../../widgets/user-selector/user-selector'
  export default {
    mixins: [mixin],
    components: {
      sideRightBox,
      rightToolbar,
      list,
      TopBar,
      upload,
      'unit-selector': unitselector
    },
    data() {
      return {
        chooseNotifUnitDialog: false,
        rules: {
          caseName: [
             {required: true, message: '请选择案件名称', trigger: 'blur'}
          ]
        },
        urgentArr: [{
          key: 0,
          label: '平急24小时'
        }, {
          key: 1,
          label: '加急6小时'
        }, {
          key: 2,
          label: '特急4小时'
        }, {
          key: 3,
          label: '特急2小时'
        }],
        agreeArr: [{
          key: 0,
          label: '不同意'
        }, {
          key: 1,
          label: '同意'
        }],
        dataList: [],
        sqrFormData: {},
        caseObj: {},
        caseFormData: {
        },
        uploadId: '',
        isAgree: '',
        caseArray: [],
        editFlag: false,
        booleanFlag: '',
        approveData: {
          isAgree: 0
        },
        controlForm: {
          applyUserid: '',
          applyDeptid: '',
          attachmentId: '',
          existClue: '',
          hcRequest: '',
          xbDeptid: '',
          xbDeptname: '',
          flag: '',
          caseId: '',
          caseName: '',
          emergency: 0,
          title: ''
        },
        title: '',
        data: null
      }
    },
    props: ['xtTitles', 'applyType', 'xtObjs'],
    computed: {
      ...mapState(['union'])

    },
    watch: {
      xtTitles(val) {
        if(val) {
          this.xtTitles = val;
        }
      },
      xtObjs (val) {
        if(val) {
          if(this.xtTitles === '审批') {
            this.editFlag = true;
            this.approveData = {
              id: this.xtObjs.id,
              applyId: this.xtObjs.applyId,
              approvalNode: this.xtObjs.approvalNode,
              approvalPersonid: this.xtObjs.approvalPersonid,
              approvalPersonname: this.xtObjs.approvalPersonname
            }
            this.getDetail(this.xtObjs.applyId);
          }else if(this.xtTitles === '查看详情') {
            // var ipList = location.href.split('/');
            // var myIp = ipList[2]
            this.editFlag = true;
            this.uploadId = '/jwy/DownFile.ashx?id=' + this.xtObjs.attachmentId;
            this.getDetail(this.xtObjs.applyId);
          }
        }
      }
    },
    methods: {
      // 提交申请
      submitForm(title) {
        if(this.approveData.isAgree === '' || this.approveData.isAgree === undefined) {
          this.$message({
            message: '请选择审批状态',
            type: 'error'
          });
        }else{
          this.postAdd(title);
        }
      },
      // 提交申请
      postAdd(title) {
        this.dispatch(XT_APPROVAL, this.approveData).then(() => {
          this.$message({
            message: '审批成功',
            type: 'success'
          });
          this.$emit('closeTabs', title)
        })
      },
      // 重置
      resetForm(title) {
        this.$emit('closeTabs', title)
      },
      uploadSubmit(f) {
        console.log(f, 'this.f')
        if (f.Status === 1) {
          let _fileIdArray = []
          for (let ii in f.data.fileList) {
            let _thisFileii = f.data.fileList[ii]
            let __fFileId = _thisFileii.response ? _thisFileii.response.Data.ID : _thisFileii.url.split('?id=')[1]
            _fileIdArray.push(__fFileId)
          }
          this.controlForm.attachmentId = _fileIdArray.join()
          console.log(this.controlForm, 'this.controlFormcontrolFormcontrolFormcontrolForm')
        }
      },
      // 选择单位
      updateNotifPerson(val) {
        this.controlForm.xbDeptname = val.name;
        this.controlForm.xbDeptid = val.code;
        // this.notifPerson = val
        console.log(val, 'this.notifPerson');
      },
      departMent() {
        this.chooseNotifUnitDialog = true;
      },
      approveSelect(val) {
        this.approveData.isAgree = val;
      },
      caseChange(val) {
        this.dispatch(XT_GET_CASE_INFO, {caseId: val}).then(() => {
          this.caseObj = this.union.xtGetCaseInfo;
          this.controlForm.caseId = val;
          this.controlForm.title = this.caseObj.caseName + '的协同办公工单';
          // Object.assign(this.controlForm, this.caseObj);
        })
        console.log(val, 'caseChange');
      },
      getPersonInfo() {
        this.dispatch(GET_APPLY_PERSON_INFO, {}).then(() => {
          console.log(this.union, 'this.union');
          this.sqrFormData = this.union.getApplyPersonInfo;
          Object.assign(this.controlForm, this.sqrFormData);
        })
        this.dispatch(GET_CUR_USER_CASE_LIST, {}).then(() => {
          this.caseArray = this.union.userCaseList;
        })
      },
      getDetail(ids) {
        this.dispatch(XT_VIEW_DETAIL, {applyId: ids}).then(() => {
          this.controlForm = this.union.xtViewDetail;
          this.controlForm.emergency = parseInt(this.controlForm.emergency);
          this.dataList = this.union.xtViewDetail.xtbgnewApproval;
        })
      }
    },
    created() {
      document.title = '策略布控结果-智慧警务'
      this.getPersonInfo();
    },
    mounted() {
      if(this.xtTitles === '审批') {
        this.editFlag = true;
        console.log(this.xtObjs, 'this.xtObjsthis.xtObjs');
        this.approveData = {
          id: this.xtObjs.id,
          applyId: this.xtObjs.applyId,
          approvalNode: this.xtObjs.approvalNode,
          approvalPersonid: this.xtObjs.approvalPersonid,
          approvalPersonname: this.xtObjs.approvalPersonname
        }
        this.getDetail(this.xtObjs.applyId);
      }else if(this.xtTitles === '查看详情') {
        // var ipList = location.href.split('/');
        // var myIp = ipList[2]
        this.editFlag = true;
        this.uploadId = '/jwy/DownFile.ashx?id=' + this.xtObjs.attachmentId;
        this.getDetail(this.xtObjs.applyId);
      }
    }
  }

</script>
