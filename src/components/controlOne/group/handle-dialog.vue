<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="form.id?'信息采集':'人员登记'" :visible.sync="dialogVisible" size="middle-fiexd" @open="start" :close-on-click-modal="false">
  <el-tabs v-model="activeName" @tab-click="handleTabClick" class="control__group-handle" style="margin:-15px;" v-loading="dialogLoading">
    <el-tab-pane v-if="isUpdate!=='change'" label="基本信息" name="Info" style="background:#ebf5fc;padding-right:15px;padding-top:10px;padding-bottom:10px;height:850px">
      <el-form :model="form" ref="form" class="control__group-handle" :rules="rules">
        <el-row :gutter="5">
          <el-col :span="21">
            <el-row>
              <el-col :span="8">
                <el-form-item label="证件号码" prop="Sfz" label-width="100px">
                  <el-input :maxlength="18" @blur="GetPersonInfo()" v-model="form.Sfz" :disabled="formDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="姓名" prop="RyName" label-width="100px">
                  <el-input :maxlength="50" :disabled="(IDcardChange && form.RyName !==null) || formDisabled" v-model="form.RyName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系电话" prop="Phone" label-width="100px">
                  <el-input :maxlength="50" v-model="form.Phone" :disabled="formDisabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="民族" prop="Nation" label-width="100px">
                  <el-select :disabled="(IDcardChange&&form.Nation!==null) || formDisabled" :maxlength="50" v-model="form.Nation" filterable placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in NationList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别" prop="Sex" label-width="100px">
                  <el-select :disabled="(IDcardChange&&form.Sex!==null) || formDisabled" :maxlength="50" v-model="form.Sex" filterable placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in sexList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="人群类别" prop="RyType" label-width="100px">
                  <el-select :maxlength="50" v-model="form.RyType" :disabled="true" filterable placeholder="请选择" style="width: 100%">
                    <el-option v-for="item in RyTypeList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="国籍" prop="Contry" label-width="100px">
                  <el-select :maxlength="50" v-model="form.Contry" filterable placeholder="请选择" style="width: 100%" :disabled="formDisabled">
                    <el-option v-for="item in ContryList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="政治面貌" prop="Political" label-width="100px">
                  <el-select :maxlength="50" v-model="form.Political" filterable placeholder="请选择" style="width: 100%;" :disabled="formDisabled">
                    <el-option v-for="item in PoliticalList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="宗教信仰" prop="Faith" label-width="100px">
                  <el-select :maxlength="50" v-model="form.Faith" filterable placeholder="请选择" style="width: 100%" :disabled="formDisabled">
                    <el-option v-for="item in FaithList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="出生日期" prop="Birthday" label-width="100px">
                  <el-date-picker :disabled="(IDcardChange&&form.Birthday!==null) || formDisabled" :maxlength="50" v-model="form.Birthday" placeholder="请选择" style="width: 100%"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="曾用名" prop="OldName" label-width="100px">
                  <el-input :maxlength="50" v-model="form.OldName" :disabled="formDisabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="别名绰号" prop="ByName" label-width="100px">
                  <el-input :maxlength="50" v-model="form.ByName" :disabled="formDisabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="10" prop="PhotosId">
              <div class="wrap-box__content" style="height:126px;width:113px;margin-left:-3px">
                <input v-if="(form.Sfz||'').length!==18" type="hidden" v-model="form.PhotosId" />
                <data-image v-if="(form.Sfz||'').length===18" :idCard="form.Sfz"></data-image>
                <upload style="height:126px;width:113px;margin-left:-3px" v-if="(form.Sfz||'').length!==18" uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles" :disabled="formDisabled"></upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="7">
            <el-form-item label="外文姓名" prop="ForeignName" label-width="100px">
              <el-input :maxlength="50" v-model="form.ForeignName" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="身份/职业" prop="Job" label-width="100px">
              <el-input :maxlength="50" v-model="form.Job" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="文化程度" prop="Diploma" label-width="100px">
              <el-select :maxlength="50" v-model="form.Diploma" filterable placeholder="请选择" style="width: 100%" :disabled="formDisabled">
                <el-option v-for="item in DiplomaList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="7">
            <el-form-item label="服务场所" prop="ServicePlace" label-width="100px">
              <el-input :maxlength="50" v-model="form.ServicePlace" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="场所地址" prop="ServicePlaceAddress" label-width="100px">
              <el-input :maxlength="50" v-model="form.ServicePlaceAddress" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="职务/职位" prop="Duty" label-width="100px">
              <el-select :maxlength="50" v-model="form.Duty" filterable placeholder="请选择" style="width: 100%" :disabled="formDisabled">
                <el-option v-for="item in DutyList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="风险等级" prop="Level" label-width="100px">
              <el-select :maxlength="50" v-model="form.Level" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in LevelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人员等级" prop="PeopleLevel" label-width="100px">
              <el-select :maxlength="50" v-model="form.PeopleLevel" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in PeopleLevelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="毕业时间" prop="GraduatTime" label-width="100px">
              <el-date-picker :maxlength="50" v-model="form.GraduatTime" placeholder="请选择" style="width: 100%" :disabled="formDisabled"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业院校" prop="GraduatSchool" label-width="100px">
              <el-input :maxlength="50" v-model="form.GraduatSchool" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="主要经济来源" prop="Income" label-width="100px">
              <el-input :maxlength="50" v-model="form.Income" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接收资助情况" prop="IsFunde" label-width="100px">
              <el-input :maxlength="50" v-model="form.IsFunde" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="指纹信息" prop="Fingerprint" label-width="100px">
              <el-input :maxlength="50" v-model="form.Fingerprint" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="DNA信息" prop="DNAmessage" label-width="100px">
              <el-input :maxlength="50" v-model="form.DNAmessage" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="体貌特征" prop="Character" label-width="100px">
              <el-input :maxlength="100" v-model="form.Character" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="特长嗜好" prop="Specialty" label-width="100px">
              <el-input :maxlength="100" v-model="form.Specialty" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="境外住所" prop="Outside" label-width="100px">
              <el-input :maxlength="100" v-model="form.Outside" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="户籍地区划" prop="DomicileArea" label-width="100px">
              <area-selector :disabled="(IDcardChange && form.DomicileArea!==null) || formDisabled" v-model="form.DomicileArea" :defaultArea="defaultArea"></area-selector>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="户籍地详址" prop="DomicileAddress" label-width="100px">
              <el-input :disabled="formDisabled" :maxlength="150" v-model="form.DomicileAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="现住址区划" prop="Area" label-width="100px">
              <area-selector v-model="form.Area" :defaultArea="defaultArea2" :disabled="formDisabled"></area-selector>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="现住址详址" prop="Address" label-width="100px">
              <el-input :maxlength="150" v-model="form.Address" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="24">
            <el-form-item label="管控原因" prop="ControlReason" label-width="100px">
              <el-input type="textarea" :rows="5" :maxlength="500" v-model="form.ControlReason" :disabled="formDisabled"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-if="form.id" :label="form.RyTypeName? form.RyTypeName + '管控信息': '管控信息'" name="workform" style="background:#ebf5fc;padding-right:15px;height:570px">
      <el-form :model="workform" class="control__group-handle" label-width="100px" ref="workform" :rules="rules2">
        <!-- 子表单 -->
        <people v-model="workform" v-if="!isPrivateForm" :form="form"></people>
        <drug v-model="drugform" v-if="form.RyType==='RQ005001'" :form="form"></drug>
        <druguncontrol v-model="uncondrugform" v-if="form.RyType==='RQ005002'" :form="form"></druguncontrol>
        <extreme v-model="extremeform" v-if="form.RyType==='RQ006001'" :form="form"></extreme>
        <spirit v-model="spiritform" v-if="form.RyType==='RQ006002'" :form="form"></spirit>
        <murder v-model="murderfrom" v-if="form.RyType==='RQ006003'" :form="form"></murder>
        <policesafe v-model="policesafefrom" v-if="form.RyType==='RQ003010'" :form="form"></policesafe>
        <CasePetition v-model="CasePetitionfrom" v-if="form.RyType==='RQ003011'" :form="form"></CasePetition>
        <trafficaccident v-model="trafficaccidentfrom" v-if="form.RyType==='RQ003012'" :form="form"></trafficaccident>
        <economicrime v-model="economicrimefrom" v-if="form.RyType==='RQ003014'" :form="form"></economicrime>
        <soldiers v-model="soldiersfrom" v-if="form.RyType==='RQ004009'" :form="form"></soldiers>
        <petition v-model="petitionfrom" v-if="form.RyType==='RQ004009'" :form="form"></petition>
        <socontrol v-model="socontrolfrom" v-if="form.RyType==='RQ004009'" :form="form"></socontrol>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-if="isUpdate!=='change'&&form.id" :label="form.RyTypeName? form.RyTypeName + '登记信息': '登记信息'" name="worklist" style="width:960px;background:#ebf5fc;">
      <h3 class="addh3" style="margin:0px">{{form.RyTypeName}}信息列表</h3>
      <el-form :model="workListform" label-width="100px" ref="workListform" :rules="rules" style="padding:0 10px;">
        <!-- 子列表 -->
        <safe v-if="ifWorkList" :mainId="form.id" :readonly="readonly"></safe>
        <relationer v-if="ifWorkList" :mainId="form.id" :readonly="readonly"></relationer>
        <traject v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></traject>
        <clue v-if="ifWorkList" :mainId="form.id" :readonly="readonly"></clue>
        <family v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></family>
        <personalcar v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></personalcar>
        <socialrecord v-if="ifWorkList" :mainId="form.id" :readonly="readonly"></socialrecord>
        <concarts v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></concarts>
        <bankcount v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></bankcount>
        <assets v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></assets>
        <unassets v-if="ifWorkList" :IDcard="form.Sfz" :mainId="form.id" :readonly="readonly"></unassets>
        <unlaw v-if="ifWorkList" :mainId="form.id" :readonly="readonly"></unlaw>
        <punish v-if="ifWorkList" :mainId="form.id" :readonly="readonly"></punish>
        <feedback v-if="form.RyType==='RQ004009'&&tabName==='worklist'" :mainId="form.id" :readonly="readonly"></feedback>
        <history v-if="form.RyType==='RQ004009'&&tabName==='worklist'" :mainId="form.id" :readonly="readonly"></history>
      </el-form>
    </el-tab-pane>
  </el-tabs>
  <div slot="footer" class="dialog-footer">
    <el-button v-if="(activeName!=='worklist')&&!(isUpdate==='change'&&activeName==='Info')&&!(isUpdate==='look')" @click="dialogVisible = false">取消</el-button>
    <!--<el-button @click="reset('form')">重置</el-button>-->
    <el-button v-if="(activeName!=='worklist')&&!(isUpdate==='change'&&activeName==='Info')&&!(isUpdate==='look')" type="primary" @click="submitForm('form')">确定</el-button>
  </div>
</el-dialog>
</template>


<style>
  .control__group-handle .wrap-box__content img {
    background: #eee;
    height: 100%;
    margin: 1px;
    padding: 3px;
    border: 1px solid #ccc;
  }

  .addh2 {
    background: #ebf5fc;
    width: 99%;
  }

  .addh3 {
    background: #eee;
    font-size: 14px;
    font-weight: normal;
    padding: 5px 0;
    margin: 0 -15px 15px -15px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    text-align: center;
  }

  .control__group-handle .el-form-item {
    margin-bottom: 3px;
  }

  .control__group-handle .el-upload--picture-card {
    height: 126px;
    width: 113px;
    margin-left: 10px;
  }

  .control-box_div .el-dialog {
    min-width: 960px;
  }

  .control-box_div .el-dialog__body {
    overflow-x: hidden;
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import bus from '../../../utils/bus'
  import safe from '../../control/group/childList/safe/index'
  import assets from '../../control/group/childList/assets/index'
  import bankcount from '../../control/group/childList/bankcount/index'
  import clue from '../../control/group/childList/clue/index'
  import concarts from '../../control/group/childList/concart/index'
  import family from '../../control/group/childList/family/index'
  import feedback from '../../control/group/childList/feedback/index'
  import history from '../../control/group/childList/history/index'
  import personalcar from '../../control/group/childList/personalcar/index'
  import punish from '../../control/group/childList/punish/index'
  import relationer from '../../control/group/childList/relationer/index'
  import socialrecord from '../../control/group/childList/socialrecord/index'
  import traject from '../../control/group/childList/traject/index'
  import unassets from '../../control/group/childList/unassets/index'
  import unlaw from '../../control/group/childList/unlaw/index'
  import people from '../../control/group/childInfo/people/index'
  import drug from '../../control/group/childInfo/drug/index'
  import druguncontrol from '../../control/group/childInfo/druguncontrol/index'
  import extreme from '../../control/group/childInfo/extreme/index'
  import spirit from '../../control/group/childInfo/spirit/index'
  import murder from '../../control/group/childInfo/murder/index'
  import policesafe from '../../control/group/childInfo/policesafe/index'
  import CasePetition from '../../control/group/childInfo/CasePetition/index'
  import trafficaccident from '../../control/group/childInfo/trafficaccident/index'
  import economicrime from '../../control/group/childInfo/economicrime/index'
  import soldiers from '../../control/group/childInfo/soldiers/soldiers'
  import petition from '../../control/group/childInfo/soldiers/petition'
  import socontrol from '../../control/group/childInfo/soldiers/socontrol'
  import upload from '../../../widgets/upload/upload.vue'
  import dataImage from '../../../widgets/data-image/data-image'
  import areaSelector from '../../../widgets/area-selector/area-selector'
  import {
    FXPCGK_SAVE,
    FXPCGK_INFO,
    FXPCGK_ANJXX_UPDATE,
    FXPCGK_ANJXX_SAVE,
    FXPCGK_DRUGER_UPDATE,
    FXPCGK_DRUGER_SAVE,
    FXPCGK_SPI_INFO,
    FXPCGK_DRUGUNCON_UPDATE,
    FXPCGK_DRUGUNCON_SAVE,
    FXPCGK_DRUGER_INFO,
    FXPCGK_EXT_INFO,
    FXPCGK_DRUGUNCON_INFO,
    FXPCGK_EXT_UPDATE,
    FXPCGK_EXT_SAVE,
    FXPCGK_SPI_UPDATE,
    FXPCGK_SOLDIERSALL_INFO,
    FXPCGK_SPI_SAVE,
    FXPCGK_SOLDIERSALL_UPDATE,
    FXPCGK_SOLDIERSALL_SAVE,
    FXPCGK_ECONOMICRIME_INFO,
    FXPCGK_CRIME_SAVE,
    FXPCGK_CRIME_UPDATE,
    FXPCGK_POLICESAFE_SAVE,
    FXPCGK_CASEPETITION_INFO,
    FXPCGK_CRIME_INFO,
    FXPCGK_POLICESAFE_UPDATE,
    FXPCGK_POLICESAFE_INFO,
    FXPCGK_CASEPETITION_SAVE,
    FXPCGK_TRAFFICN_INFO,
    FXPCGK_CASEPETITION_UPDATE,
    FXPCGK_TRAFFICN_SAVE,
    FXPCGK_TRAFFICN_UPDATE,
    FXPCGK_ECONOMICRIME_SAVE,
    FXPCGK_ECONOMICRIME_UPDATE,
    FXPCGK_UPDATE,
    FXPCGK_ANJXX_INFO,
    GET_PERSON_BY_ID,
    GET_PERSON_INFO_FROM_MAIN_DATA,
    FXPCGK_LIST,
    // PERSON_INFO,
    // GET_CHECK_PERSON_BY_SFZ,
    FETCH_SYS_ORG_BY_CURRY_ORG
  } from '../../../store/types'
  import { mapState } from 'vuex'
  import { listToTree } from '../../../utils/listToTree'
  import { getTopNexus, clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {
      clone,
      safe,
      assets,
      bankcount,
      clue,
      concarts,
      family,
      history,
      areaSelector,
      feedback,
      personalcar,
      punish,
      relationer,
      socialrecord,
      traject,
      unassets,
      unlaw,
      'data-image': dataImage,
      upload,
      people,
      drug,
      druguncontrol,
      extreme,
      spirit,
      murder,
      policesafe,
      CasePetition,
      trafficaccident,
      economicrime,
      soldiers,
      petition,
      socontrol
    },
    data() {
      var validatepass = (rule, value, callback) => {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (reg.test(value) === false) {
          callback(new Error('身份证不正确'))
        } else {
          callback()
        }
      };
      return {
        ifWorkList: false,
        defaultPropsCascader: {
          value: 'value',
          label: 'label',
          children: 'Children'
        },
        dialogLoading: true,
        defaultArea: [],
        defaultArea2: [],
        tabName: 'Info',
        activeName: 'Info',
        formmarket: true,
        workListform: {},
        isUpdate: 'add',
        readonly: true, // 子列表新增按钮
        formDisabled: false,
        workform: { id: '', fjid: '', gkjb: '', whpg: '', gkcs: '', gzzs: '', zkdw: [], zkzrmj: '', zklxfs: '', xkdw: [], xkzrmj: '', xklxfs: '' },
        drugform: { fjid: '', nrxt: '', gfxdm: [], zfxdm: [], dfxdm: [], gkcs: [], gkzt: [], gkdw: [], zrmj: '', lxfs: '', xkdw: [], xkzrmj: '', xklxfs: '' },
        uncondrugform: { fjid: '', tgskyy: [], czqk: [], gkxz: [], gkdw: [], zrmj: '', lxfs: '', xkdw: [], xkzrmj: '', xklxfs: '' },
        extremeform: {
          fjid: '',
          fzxwfs: [],
          yyfx: [],
          xsly: [],
          sysd: [],
          sycs: [],
          sfmqzrld: '',
          jczfzrld: '',
          pcsld: '',
          wkfs: '',
          sfsszb: '',
          skyy: '',
          sftbzrbm: '',
          zrr2: '',
          zrr1: '',
          zrmj1: '',
          zrmj2: '',
          zkzt: '',
          ypzc: '',
          ypzcsz: '',
          ypzcxj: '',
          fxyhms: '',
          fxdj: '',
          czmj: '',
          czdw: '',
          czsj: '',
          djmj: '',
          djdw: '',
          djsj: ''
        },
        spiritform: { fjid: '', jhrsfzh: '', jhrxm: '', jhrdh: '', sflrqgzx: '', hzzt: '', jhqk: '', dbqk: '', ybqk: '', jhjljf: '', fyqk: '', jqfb: '', fxdj: '', fxyhms: '', czmj: '', czdw: '', czsj: '', djmj: '', djdw: '', djsj: '' },
        murderfrom: { fjid: '', ajmc: '', ajlb: '', ladw: '', jyaq: '', zhzt: '', hjdqh: '', hjdxz: '', ajbh: '' },
        policesafefrom: {
          fjid: '',
          jbsq: '',
          blqk: '',
          xscf: '',
          xzcf: '',
          gjfdd: [],
          gjfxw: [],
          xgpz: '',
          gdsr: '',
          fxjb: [],
          yjnr: [],
          yjbz: '',
          rjnr: [],
          rjbz1: '',
          rjbz2: '',
          sjnr: [],
          sjbz1: '',
          sjbz2: '',
          sfzk: '',
          hjzrdw: [],
          hjzrbm: '',
          wkzrdw: [],
          wkzrbm: '',
          wkzrld: '',
          wkzrmj: '',
          sfcg: ''
        },
        economicrimefrom: {
          fjid: '',
          jcjzdz: '',
          ajlb: '',
          zbmj: '',
          zbmjdh: '',
          badw: [],
          ssaj: '',
          sajyqk: '',
          xzzcd: '',
          xzzcdsm: '',
          clrwk: '',
          clrwksm: '',
          sjjf: '',
          sjjfsm: '',
          swyq: '',
          swyqsm: '',
          jdsj: '',
          jdsjsm: '',
          ggtt: '',
          ggttsm: '',
          qtxs: '',
          qtxssm: '',
          wla: '',
          wlasm: '',
          djcl: '',
          djclsm: '',
          dxbmy: '',
          dxbmysm: '',
          zcbk: '',
          zcbksm: '',
          zzbm: '',
          zzbmsm: '',
          gtbf: '',
          gtbfsm: '',
          bmdj: '',
          bmdjsm: '',
          wzdly: '',
          wzdlysm: '',
          qtyy: '',
          qtyysm: '',
          bgdwzf: '',
          bgdwzfsm: '',
          tbwwbm: '',
          tbwwbmsm: '',
          cqwkcs: '',
          cqwkcssm: '',
          wkbd: '',
          wkbdsm: '',
          snslg: '',
          snslgsm: '',
          szswk: '',
          szswksm: '',
          sk: '',
          sksm: '',
          dzfwk: '',
          dzfwksm: '',
          jcqzwk: '',
          jcqzwksm: '',
          szdwwk: '',
          szdwwksm: '',
          jtxzwk: '',
          jtxzwksm: '',
          qygxwk: '',
          qygxwksm: '',
          smjd: '',
          smjdsm: '',
          dhwk: '',
          dhwksm: '',
          djnsz: '',
          djnszsm: '',
          qtfs: '',
          qtfssm: '',
          lxbs: '',
          lxbssm: '',
          bfwk: '',
          bfwksm: '',
          wlyjj: '',
          wlyjjsm: '',
          ymhd: '',
          ymhdsm: '',
          skqtyy: '',
          skqtyysm: '',
          tgyp: '',
          tgypsm: '',
          zrld: '',
          zrmj: ''
        },
        soldiersfrom: { fjid: '', nl: '', rylbbq: '', yrwlx: '', yrwnf: '', tynf: '', ybdfh: '', sfcz: '', jun: '', shi: '', lv: '', tuan: '', sctylb: '', sfwby: '', sfgg: '', ggcylb: '', ggzzrlb: '' },
        petitionfrom: {
          fjid: '',
          sfsjfry: '',
          sqsfjj: '',
          sfyxf: '',
          sflx: '',
          sfsfjl: '',
          sfjtgj: '',
          bljjqf: '',
          bljjfs: '',
          jqsffx: '',
          sfyy: '',
          sfsq: '',
          swdxtt: [],
          swdxhy: [],
          swdxgz: []
        },
        socontrolfrom: {
          fjid: '',
          xgr: '',
          xgsj: '',
          cjr: '',
          cjsj: '',
          sfsc: '',
          jzzrmj: '',
          jzlxfs: '',
          jzbmmc: '',
          jzbmld: '',
          jzbmlddh: '',
          pcszrmj: '',
          pcszrmjdh: '',
          pcsmc: '',
          pcsld: '',
          pcslddh: ''
        },
        CasePetitionfrom: {
          fjid: '',
          gkqk: '',
          gkdj: '',
          zrr: '',
          zrdw: [],
          zrrlxfs: '',
          lgsy: '',
          gkcs: '',
          djmj: '',
          djdw: '',
          cjsj: ''
        },
        trafficaccidentfrom: {
          fjid: '',
          dwhdz: '',
          xffs: '',
          xfsj: '',
          xflx: '',
          cbbm: '',
          xfgzjd: '',
          bljl: '',
          bjsj: '',
          sfcf: '',
          jtsgjbqk: '',
          xfsq: '',
          xftcqk: '',
          wkcs: '',
          dbqk: []
        },
        safeData: [],
        keyId: '',
        isFormalSubmit: false,
        isPrivateForm: false,
        formItem: {},
        filesObj: {},
        ruleDeptList: [], // 采集单位列表
        CollectDeptList: [], // 管辖单位[树列表]
        currentFiles: [], // 当前文件集合
        FocusType: '',
        dialogMode: false,
        dialogVisible: false,
        oldNativeList: [], // 人员籍贯[原始列表]
        NativeList: [], // 人员籍贯[树列表]
        NativeArr: [], // 人员籍贯[选中列表]
        NationList: [], // 民族列表
        ContryList: [],
        CtrlStatusList: [ // 管控状态，0：正常在控，1：撤销管控，2：失控，3：其它
          { label: '正常在控', value: '0' },
          { label: '失控', value: '1' },
          { label: '其它', value: '2' }
        ], // 管控等级
        RyTypeList: [], // 人员类型
        LevelList: [], // 风险等级
        PeopleLevelList: [], // 风险等级
        PoliticalList: [], // 政治面貌
        FaithList: [], // 宗教信仰
        DiplomaList: [], // 文化程度
        DutyList: [], // 职务/职位
        AreaList: [], // 区划
        IDcardChange: false,
        MaritalStatusList: [
          { label: '已婚', value: '1' },
          { label: '未婚', value: '2' },
          { label: '离异', value: '3' },
          { label: '再婚', value: '4' },
          { label: '丧偶', value: '5' },
          { label: '未知', value: '6' }
        ], // 婚姻状况
        sexList: [], // 性别列表
        BuyCarList: [{ label: '未购车', value: '0' }, { label: '已购车', value: '1' }, { label: '未知', value: '2' }], // 是否购车
        BuyHouseList: [{ label: '未置业', value: '0' }, { label: '已置业', value: '1' }, { label: '未知', value: '2' }], // 是否置业
        form: {},
        Contry: [],
        Political: [],
        rules: {
          CollectDeptArr: [
            { type: 'array', required: true, message: '请选择管辖单位', trigger: 'blur' }
          ],
          CollectDept: [
            { required: true, message: '请选择采集单位', trigger: 'blur' }
          ],
          RyName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          // Phone: [
          //   { required: true, message: '请输入联系电话', trigger: 'blur' }
          // ],
          Sfz: [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
            { validator: validatepass, trigger: 'blur' }
          ],
          RyType: [
            { required: true, message: '请选择人群类别', trigger: 'blur' }
          ],
          Sex: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          Nation: [
            { required: true, message: '请选择民族', trigger: 'blur' }
          ]
        },
        rules2: {
          zkdw: [
            { type: 'array', required: true, message: '请选择主控单位', trigger: 'blur' }
          ]
        }
      }
    },
    props: ['dataType'],
    methods: {
      handleTabClick(tab, event) {
        this.tabName = tab.name
        if (tab.name === 'workform') {
          this.initWorkform()
        } else if (tab.name === 'worklist') {
          this.ifWorkList = true
        }
      },
      GetSysOrgDictTree(keyId) {
        this.dispatch(FETCH_SYS_ORG_BY_CURRY_ORG, {
          jzlx: '',
          orgId: keyId
        }).then(() => {
          this.CollectDeptList = listToTree(this.orgs.orgByCurryOrg, keyId, 0, {
            id: 'orgId',
            parentId: 'parentId',
            children: 'children'
          });
        })
      },
      GetPersonInfo() {
        if (this.form.Sfz && this.form.Sfz.length === 18) {
          this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, {
            sfzh: this.form.Sfz
          }).then(d => {
            this.form.RyName = this.baseData.personInfo.xp.XM
            this.form.Birthday = this.baseData.personInfo.xp.CSRQ
            this.form.Nation = this.baseData.personInfo.xp.MZDM
            this.form.Sex = this.baseData.personInfo.xp.XBDM
            this.form.DomicileAddress = this.baseData.personInfo.xp.ZZXZ
            this.form.ServicePlace = this.baseData.personInfo.xp.FWCS
            this.form.OldName = this.baseData.personInfo.xp.CYM
            let jgssx = []
            jgssx.push(this.baseData.personInfo.xp.JGSSX.substring(0, 2) + '0000')
            jgssx.push(this.baseData.personInfo.xp.JGSSX.substring(0, 4) + '00')
            jgssx.push(this.baseData.personInfo.xp.JGSSX)
            this.defaultArea = jgssx
            this.form.Diploma = this.baseData.personInfo.xp.WHCD
            this.form.Contry = 'CHN'
            this.IDcardChange = true
          })
          this.dispatch(FXPCGK_LIST, { rqlb: this.form.RyType, keyword: this.form.Sfz, PageIndex: 1, PageSize: 20 }).then(d => {
            console.log(this.focusPerson.fxpcgkList.PageData);
            if (this.focusPerson.fxpcgkList.PageData.length > 0) {
              this.$confirm('该人员已由' + (this.focusPerson.fxpcgkList.PageData[0].cjrdwmc || '其他') + '等单位管控，确定要管控该人员', '温馨提示', {
                confirmButtonText: '重新编辑',
                cancelButtonText: '确认',
                type: 'warning'
              }).then(() => {
                this.IDcardChange = false
              }).catch(() => { return false });
            }
          })
        } else {
          this.IDcardChange = false
        }
      },
      initWorkform() {
        if (this.form.RyType === 'RQ005002') { // 脱管失控吸毒人员
          // 重置表单
          this.uncondrugform.tgskyy = []
          this.uncondrugform.czqk = []
          this.uncondrugform.zfgkxzxdm = []
          this.uncondrugform.gkdw = []
          this.uncondrugform.zrmj = ''
          this.uncondrugform.lxfs = ''
          this.uncondrugform.xkdw = []
          this.uncondrugform.xkzrmj = ''
          this.uncondrugform.xklxfs = ''
          if (this.form.id) {
            this.dispatch(FXPCGK_DRUGUNCON_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkDrugunconInfo) {
                this.uncondrugform.id = this.focusPerson.fxpcgkDrugunconInfo.id
                this.uncondrugform.fjid = this.focusPerson.fxpcgkDrugunconInfo.fjid
                this.uncondrugform.tgskyy = (this.focusPerson.fxpcgkDrugunconInfo.tgskyy || '').split(',')
                this.uncondrugform.czqk = (this.focusPerson.fxpcgkDrugunconInfo.czqk || '').split(',')
                this.uncondrugform.gkxz = (this.focusPerson.fxpcgkDrugunconInfo.gkxz || '').split(',')
                this.uncondrugform.gkdw = (this.focusPerson.fxpcgkDrugunconInfo.gkdw || '').split(',')
                this.uncondrugform.zrmj = this.focusPerson.fxpcgkDrugunconInfo.zrmj || ''
                this.uncondrugform.lxfs = this.focusPerson.fxpcgkDrugunconInfo.lxfs || ''
                this.uncondrugform.xkdw = (this.focusPerson.fxpcgkDrugunconInfo.xkdw || '').split(',')
                this.uncondrugform.xkzrmj = this.focusPerson.fxpcgkDrugunconInfo.xkzrmj || ''
                this.uncondrugform.xklxfs = this.focusPerson.fxpcgkDrugunconInfo.xklxfs || ''
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ005001') { // 社会面吸毒人员
          // 重置表单
          this.drugform.nrxt = ''
          this.drugform.gfxdm = []
          this.drugform.zfxdm = []
          this.drugform.dfxdm = []
          this.drugform.gkcs = []
          this.drugform.gkzt = []
          this.drugform.gkdw = []
          this.drugform.zrmj = ''
          this.drugform.lxfs = ''
          this.drugform.xkdw = []
          this.drugform.xkzrmj = ''
          this.drugform.xklxfs = ''
          if (this.form.id) {
            // 获取工作信息
            this.dispatch(FXPCGK_DRUGER_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkDrugerInfo) {
                this.drugform.id = this.focusPerson.fxpcgkDrugerInfo.id
                this.drugform.fjid = this.focusPerson.fxpcgkDrugerInfo.fjid || ''
                this.drugform.nrxt = this.focusPerson.fxpcgkDrugerInfo.nrxt || ''
                this.drugform.gfxdm = this.focusPerson.fxpcgkDrugerInfo.gfxdm ? this.focusPerson.fxpcgkDrugerInfo.gfxdm.split(',') : []
                this.drugform.zfxdm = this.focusPerson.fxpcgkDrugerInfo.zfxdm ? this.focusPerson.fxpcgkDrugerInfo.zfxdm.split(',') : []
                this.drugform.dfxdm = this.focusPerson.fxpcgkDrugerInfo.dfxdm ? this.focusPerson.fxpcgkDrugerInfo.dfxdm.split(',') : []
                this.drugform.gkcs = (this.focusPerson.fxpcgkDrugerInfo.gkcs || '').split(',')
                this.drugform.gkzt = (this.focusPerson.fxpcgkDrugerInfo.gkzt || '').split(',')
                this.drugform.gkdw = (this.focusPerson.fxpcgkDrugerInfo.gkdw || '').split(',')
                this.drugform.zrmj = this.focusPerson.fxpcgkDrugerInfo.zrmj || ''
                this.drugform.lxfs = this.focusPerson.fxpcgkDrugerInfo.lxfs || ''
                this.drugform.xkdw = (this.focusPerson.fxpcgkDrugerInfo.xkdw || '').split(',')
                this.drugform.xkzrmj = this.focusPerson.fxpcgkDrugerInfo.xkzrmj || ''
                this.drugform.xklxfs = this.focusPerson.fxpcgkDrugerInfo.xklxfs || ''
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ006001') { // 个人极端行为
          // 重置表单
          this.extremeform.fzxwfs = []
          this.extremeform.yyfx = []
          this.extremeform.xsly = []
          this.extremeform.sysd = []
          this.extremeform.sycs = []
          this.extremeform.sfmqzrld = ''
          this.extremeform.jczfzrld = ''
          this.extremeform.pcsld = ''
          this.extremeform.wkfs = ''
          this.extremeform.sfsszb = ''
          this.extremeform.skyy = ''
          this.extremeform.sftbzrbm = ''
          this.extremeform.zrr1 = ''
          this.extremeform.zrmj1 = ''
          this.extremeform.zrr2 = ''
          this.extremeform.zrmj2 = ''
          this.extremeform.zkzt = ''
          this.extremeform.ypzc = ''
          this.extremeform.ypzcsz = ''
          this.extremeform.ypzcxj = ''
          this.extremeform.fxyhms = ''
          this.extremeform.fxdj = ''
          this.extremeform.czmj = ''
          this.extremeform.czdw = ''
          this.extremeform.czsj = ''
          this.extremeform.djmj = ''
          this.extremeform.djdw = ''
          this.extremeform.djsj = ''
          if (this.form.id) {
            this.dispatch(FXPCGK_EXT_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkExtInfo) {
                this.extremeform.id = this.focusPerson.fxpcgkExtInfo.id
                this.extremeform.fjid = this.focusPerson.fxpcgkExtInfo.fjid || ''
                this.extremeform.fzxwfs = (this.focusPerson.fxpcgkExtInfo.fzxwfs || '').split(',')
                this.extremeform.yyfx = (this.focusPerson.fxpcgkExtInfo.yyfx || '').split(',')
                this.extremeform.xsly = (this.focusPerson.fxpcgkExtInfo.xsly || '').split(',')
                this.extremeform.sysd = (this.focusPerson.fxpcgkExtInfo.sysd || '').split(',')
                this.extremeform.sycs = (this.focusPerson.fxpcgkExtInfo.sycs || '').split(',')
                this.extremeform.sfmqzrld = this.focusPerson.fxpcgkExtInfo.sfmqzrld || ''
                this.extremeform.jczfzrld = this.focusPerson.fxpcgkExtInfo.jczfzrld || ''
                this.extremeform.pcsld = this.focusPerson.fxpcgkExtInfo.pcsld || ''
                this.extremeform.wkfs = this.focusPerson.fxpcgkExtInfo.wkfs || ''
                this.extremeform.sfsszb = this.focusPerson.fxpcgkExtInfo.sfsszb || ''
                this.extremeform.skyy = this.focusPerson.fxpcgkExtInfo.skyy || ''
                this.extremeform.sftbzrbm = this.focusPerson.fxpcgkExtInfo.sftbzrbm || ''
                this.extremeform.zrr1 = this.focusPerson.fxpcgkExtInfo.zrr1 || ''
                this.extremeform.zrmj1 = this.focusPerson.fxpcgkExtInfo.zrmj1 || ''
                this.extremeform.zrr2 = this.focusPerson.fxpcgkExtInfo.zrr2 || ''
                this.extremeform.zrmj2 = this.focusPerson.fxpcgkExtInfo.zrmj2 || ''
                this.extremeform.zkzt = this.focusPerson.fxpcgkExtInfo.zkzt || ''
                this.extremeform.ypzc = this.focusPerson.fxpcgkExtInfo.ypzc || ''
                this.extremeform.ypzcsz = this.focusPerson.fxpcgkExtInfo.ypzcsz || ''
                this.extremeform.ypzcxj = this.focusPerson.fxpcgkExtInfo.ypzcxj || ''
                this.extremeform.fxyhms = this.focusPerson.fxpcgkExtInfo.fxyhms || ''
                this.extremeform.fxdj = this.focusPerson.fxpcgkExtInfo.fxdj || ''
                this.extremeform.czmj = this.focusPerson.fxpcgkExtInfo.czmj || ''
                this.extremeform.czdw = this.focusPerson.fxpcgkExtInfo.czdw || ''
                this.extremeform.czsj = this.focusPerson.fxpcgkExtInfo.czsj || ''
                this.extremeform.djmj = this.focusPerson.fxpcgkExtInfo.djmj || ''
                this.extremeform.djdw = this.focusPerson.fxpcgkExtInfo.djdw || ''
                this.extremeform.djsj = this.focusPerson.fxpcgkExtInfo.djsj || ''
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ006002') { // 肇事肇祸精神病人
          // 重置表单
          this.spiritform.jhrsfzh = ''
          this.spiritform.jhrxm = ''
          this.spiritform.jhrdh = ''
          this.spiritform.sflrqgzx = ''
          this.spiritform.hzzt = ''
          this.spiritform.jhqk = ''
          this.spiritform.dbqk = ''
          this.spiritform.jhjljf = ''
          this.spiritform.fyqk = ''
          this.spiritform.jqfb = ''
          this.spiritform.fxdj = ''
          this.spiritform.fxyhms = ''
          this.spiritform.czmj = ''
          this.spiritform.czdw = ''
          this.spiritform.czsj = ''
          this.spiritform.djmj = ''
          this.spiritform.ybqk = ''
          this.spiritform.djdw = ''
          this.spiritform.djsj = ''
          if (this.form.id) {
            this.dispatch(FXPCGK_SPI_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkSpiInfo) {
                this.spiritform.id = this.focusPerson.fxpcgkSpiInfo.id
                this.spiritform.fjid = this.focusPerson.fxpcgkSpiInfo.fjid || ''
                this.spiritform.jhrsfzh = this.focusPerson.fxpcgkSpiInfo.jhrsfzh || ''
                this.spiritform.jhrxm = this.focusPerson.fxpcgkSpiInfo.jhrxm || ''
                this.spiritform.jhrdh = this.focusPerson.fxpcgkSpiInfo.jhrdh || ''
                this.spiritform.sflrqgzx = this.focusPerson.fxpcgkSpiInfo.sflrqgzx || ''
                this.spiritform.hzzt = this.focusPerson.fxpcgkSpiInfo.hzzt || ''
                this.spiritform.jhqk = this.focusPerson.fxpcgkSpiInfo.jhqk || ''
                this.spiritform.dbqk = this.focusPerson.fxpcgkSpiInfo.dbqk || ''
                this.spiritform.jhjljf = this.focusPerson.fxpcgkSpiInfo.jhjljf || ''
                this.spiritform.fyqk = this.focusPerson.fxpcgkSpiInfo.fyqk || ''
                this.spiritform.jqfb = this.focusPerson.fxpcgkSpiInfo.jqfb || ''
                this.spiritform.fxdj = this.focusPerson.fxpcgkSpiInfo.fxdj || ''
                this.spiritform.fxyhms = this.focusPerson.fxpcgkSpiInfo.fxyhms || ''
                this.spiritform.czmj = this.focusPerson.fxpcgkSpiInfo.czmj || ''
                this.spiritform.czdw = this.focusPerson.fxpcgkSpiInfo.czdw || ''
                this.spiritform.czsj = this.focusPerson.fxpcgkSpiInfo.czsj || ''
                this.spiritform.djmj = this.focusPerson.fxpcgkSpiInfo.djmj || ''
                this.spiritform.ybqk = this.focusPerson.fxpcgkSpiInfo.ybqk || ''
                this.spiritform.djdw = this.focusPerson.fxpcgkSpiInfo.djdw || ''
                this.spiritform.djsj = this.focusPerson.fxpcgkSpiInfo.djsj || ''
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ006003') { // 命案逃犯
          // 重置表单
          this.murderfrom.ajmc = ''
          this.murderfrom.ajbh = ''
          this.murderfrom.ajlb = ''
          this.murderfrom.ladw = ''
          this.murderfrom.jyaq = ''
          this.murderfrom.zhzt = ''
          this.murderfrom.hjdqh = ''
          this.murderfrom.hjdxz = ''
          if (this.form.id) {
            this.dispatch(FXPCGK_CRIME_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkCrimeInfo) {
                this.murderfrom.id = this.focusPerson.fxpcgkCrimeInfo.id
                this.murderfrom.fjid = this.focusPerson.fxpcgkCrimeInfo.fjid || ''
                this.murderfrom.ajbh = this.focusPerson.fxpcgkCrimeInfo.ajbh || ''
                this.murderfrom.ajmc = this.focusPerson.fxpcgkCrimeInfo.ajmc || ''
                this.murderfrom.ajlb = this.focusPerson.fxpcgkCrimeInfo.ajlb || ''
                this.murderfrom.ladw = this.focusPerson.fxpcgkCrimeInfo.ladw || ''
                this.murderfrom.jyaq = this.focusPerson.fxpcgkCrimeInfo.jyaq || ''
                this.murderfrom.zhzt = this.focusPerson.fxpcgkCrimeInfo.zhzt || ''
                this.murderfrom.hjdqh = this.focusPerson.fxpcgkCrimeInfo.hjdqh || ''
                this.murderfrom.hjdxz = this.focusPerson.fxpcgkCrimeInfo.hjdxz || ''
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ003010') { // 涉警安全隐患
          if (this.form.id) {
            this.dispatch(FXPCGK_POLICESAFE_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkPolicesafeInfo) {
                let infoPoliceSafeForm = clone(this.focusPerson.fxpcgkPolicesafeInfo)
                infoPoliceSafeForm.gjfdd = (this.focusPerson.fxpcgkPolicesafeInfo.gjfdd || '').split(',')
                infoPoliceSafeForm.gjfxw = (this.focusPerson.fxpcgkPolicesafeInfo.gjfxw || '').split(',')
                infoPoliceSafeForm.yjnr = (this.focusPerson.fxpcgkPolicesafeInfo.yjnr || '').split(',')
                infoPoliceSafeForm.rjnr = (this.focusPerson.fxpcgkPolicesafeInfo.rjnr || '').split(',')
                infoPoliceSafeForm.sjnr = (this.focusPerson.fxpcgkPolicesafeInfo.sjnr || '').split(',')
                infoPoliceSafeForm.hjzrdw = (this.focusPerson.fxpcgkPolicesafeInfo.hjzrdw || '').split(',')
                infoPoliceSafeForm.wkzrdw = (this.focusPerson.fxpcgkPolicesafeInfo.wkzrdw || '').split(',')
                this.policesafefrom = clone(infoPoliceSafeForm)
              } else {
                for (let item in this.policesafefrom) {
                  if (this.policesafefrom[item] instanceof Array) {
                    this.policesafefrom[item] = []
                  } else {
                    this.policesafefrom[item] = ''
                  }
                }
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ003011') { // 非正常上访
          this.CasePetitionfrom.gkqk = ''
          this.CasePetitionfrom.gkdj = ''
          this.CasePetitionfrom.zrr = ''
          this.CasePetitionfrom.zrdw = []
          this.CasePetitionfrom.zrrlxfs = ''
          this.CasePetitionfrom.lgsy = ''
          this.CasePetitionfrom.gkcs = ''
          this.CasePetitionfrom.hjdxz = ''
          this.CasePetitionfrom.djmj = ''
          this.CasePetitionfrom.djdw = ''
          this.CasePetitionfrom.cjsj = ''
          if (this.form.id) {
            this.dispatch(FXPCGK_CASEPETITION_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkCasepetitionInfo) {
                this.CasePetitionfrom.id = this.focusPerson.fxpcgkCasepetitionInfo.id
                this.CasePetitionfrom.fjid = this.focusPerson.fxpcgkCasepetitionInfo.fjid || ''
                this.CasePetitionfrom.gkqk = this.focusPerson.fxpcgkCasepetitionInfo.gkqk || ''
                this.CasePetitionfrom.gkdj = this.focusPerson.fxpcgkCasepetitionInfo.gkdj || ''
                this.CasePetitionfrom.zrr = this.focusPerson.fxpcgkCasepetitionInfo.zrr || ''
                this.CasePetitionfrom.zrdw = (this.focusPerson.fxpcgkCasepetitionInfo.zrdw || '').split(',')
                this.CasePetitionfrom.zrrlxfs = this.focusPerson.fxpcgkCasepetitionInfo.zrrlxfs || ''
                this.CasePetitionfrom.lgsy = this.focusPerson.fxpcgkCasepetitionInfo.lgsy || ''
                this.CasePetitionfrom.gkcs = this.focusPerson.fxpcgkCasepetitionInfo.gkcs || ''
                this.CasePetitionfrom.hjdxz = this.focusPerson.fxpcgkCasepetitionInfo.hjdxz || ''
                this.CasePetitionfrom.djmj = this.focusPerson.fxpcgkCasepetitionInfo.djmj || ''
                this.CasePetitionfrom.djdw = this.focusPerson.fxpcgkCasepetitionInfo.djdw || ''
                this.CasePetitionfrom.cjsj = this.focusPerson.fxpcgkCasepetitionInfo.cjsj || ''
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ003012') { // 交通事故
          this.trafficaccidentfrom.dwhdz = ''
          this.trafficaccidentfrom.xffs = ''
          this.trafficaccidentfrom.xfsj = ''
          this.trafficaccidentfrom.xflx = ''
          this.trafficaccidentfrom.sfcf = ''
          this.trafficaccidentfrom.cbbm = ''
          this.trafficaccidentfrom.xfgzjd = ''
          this.trafficaccidentfrom.bljl = ''
          this.trafficaccidentfrom.bjsj = ''
          this.trafficaccidentfrom.jtsgjbqk = ''
          this.trafficaccidentfrom.xfsq = ''
          this.trafficaccidentfrom.xftcqk = ''
          this.trafficaccidentfrom.wkcs = ''
          this.trafficaccidentfrom.dbqk = []
          if (this.form.id) {
            this.dispatch(FXPCGK_TRAFFICN_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkTrafficnInfo) {
                this.trafficaccidentfrom.id = this.focusPerson.fxpcgkTrafficnInfo.id
                this.trafficaccidentfrom.fjid = this.focusPerson.fxpcgkTrafficnInfo.fjid || ''
                this.trafficaccidentfrom.dwhdz = this.focusPerson.fxpcgkTrafficnInfo.dwhdz || ''
                this.trafficaccidentfrom.xffs = this.focusPerson.fxpcgkTrafficnInfo.xffs || ''
                this.trafficaccidentfrom.xfsj = this.focusPerson.fxpcgkTrafficnInfo.xfsj || ''
                this.trafficaccidentfrom.xflx = this.focusPerson.fxpcgkTrafficnInfo.xflx || ''
                this.trafficaccidentfrom.sfcf = this.focusPerson.fxpcgkTrafficnInfo.sfcf || ''
                this.trafficaccidentfrom.cbbm = this.focusPerson.fxpcgkTrafficnInfo.cbbm || ''
                this.trafficaccidentfrom.xfgzjd = this.focusPerson.fxpcgkTrafficnInfo.xfgzjd || ''
                this.trafficaccidentfrom.bljl = this.focusPerson.fxpcgkTrafficnInfo.bljl || ''
                this.trafficaccidentfrom.bjsj = this.focusPerson.fxpcgkTrafficnInfo.bjsj || ''
                this.trafficaccidentfrom.jtsgjbqk = this.focusPerson.fxpcgkTrafficnInfo.jtsgjbqk || ''
                this.trafficaccidentfrom.xfsq = this.focusPerson.fxpcgkTrafficnInfo.xfsq || ''
                this.trafficaccidentfrom.xftcqk = this.focusPerson.fxpcgkTrafficnInfo.xftcqk || ''
                this.trafficaccidentfrom.wkcs = this.focusPerson.fxpcgkTrafficnInfo.wkcs || ''
                this.trafficaccidentfrom.dbqk = (this.focusPerson.fxpcgkTrafficnInfo.dbqk || '').split(',')
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ003014') { // 涉众经济犯罪
          for (let item in this.economicrimefrom) {
            if (item instanceof Array) {
              this.economicrimefrom[item] = []
            } else {
              this.economicrimefrom[item] = ''
            }
          }
          this.economicrimefrom.badw = []
          if (this.form.id) {
            this.dispatch(FXPCGK_ECONOMICRIME_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkEconomicrimeInfo) {
                let infoForm = clone(this.focusPerson.fxpcgkEconomicrimeInfo)
                infoForm.badw = (infoForm.badw || '').split(',')
                this.economicrimefrom = infoForm
              }
            })
          }
          this.isPrivateForm = true
        } else if (this.form.RyType === 'RQ004009') { // 涉军人员
          // 重置表单(三个子表单分别重置)
          for (let item in this.soldiersfrom) {
            if (item instanceof Array) {
              this.soldiersfrom[item] = []
            } else {
              this.soldiersfrom[item] = ''
            }
          }
          for (let item in this.petitionfrom) {
            if (item instanceof Array) {
              this.petitionfrom[item] = []
            } else {
              this.petitionfrom[item] = ''
            }
          }
          this.petitionfrom.swdxtt = []
          this.petitionfrom.swdxhy = []
          this.petitionfrom.swdxgz = []
          for (let item in this.socontrolfrom) {
            if (item instanceof Array) {
              this.socontrolfrom[item] = []
            } else {
              this.socontrolfrom[item] = ''
            }
          }
          if (this.form.id) {
            this.dispatch(FXPCGK_SOLDIERSALL_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkSoldiersallInfo) {
                if (this.focusPerson.fxpcgkSoldiersallInfo.soldiersfrom) {
                  this.soldiersfrom = clone(this.focusPerson.fxpcgkSoldiersallInfo.soldiersfrom)
                }
                if (this.focusPerson.fxpcgkSoldiersallInfo.socontrolfrom) {
                  this.socontrolfrom = clone(this.focusPerson.fxpcgkSoldiersallInfo.socontrolfrom)
                }
                if (this.focusPerson.fxpcgkSoldiersallInfo.petitionfrom) {
                  this.petitionfrom = clone(this.focusPerson.fxpcgkSoldiersallInfo.petitionfrom)
                  // 多选的字符串切割转数组
                  this.petitionfrom.swdxtt = (this.petitionfrom.swdxtt || '').split(',')
                  this.petitionfrom.swdxhy = (this.petitionfrom.swdxhy || '').split(',')
                  this.petitionfrom.swdxgz = (this.petitionfrom.swdxgz || '').split(',')
                }
              }
            })
          }
          this.isPrivateForm = true
        } else {
          this.isPrivateForm = false //  工作信息组件显示
          // 重置表单
          this.workform.id = ''
          this.workform.fjid = ''
          this.workform.gkjb = ''
          this.workform.whpg = ''
          this.workform.gkcs = ''
          this.workform.gzzs = ''
          this.workform.zkdw = []
          this.workform.zkzrmj = ''
          this.workform.zklxfs = ''
          this.workform.xkdw = []
          this.workform.xklxfs = ''
          this.workform.xkzrmj = ''
          if (this.form.id) {
            // 获取工作信息
            this.dispatch(FXPCGK_ANJXX_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkAnjxxInfo) {
                this.workform.id = this.focusPerson.fxpcgkAnjxxInfo.id
                this.workform.fjid = this.focusPerson.fxpcgkAnjxxInfo.fjid || ''
                this.workform.gkjb = this.focusPerson.fxpcgkAnjxxInfo.gkjb || ''
                this.workform.whpg = this.focusPerson.fxpcgkAnjxxInfo.whpg || ''
                this.workform.gkcs = this.focusPerson.fxpcgkAnjxxInfo.gkcs || ''
                this.workform.gzzs = this.focusPerson.fxpcgkAnjxxInfo.gzzs || ''
                this.workform.zkdw = (this.focusPerson.fxpcgkAnjxxInfo.zkdw || '').split(',')
                this.workform.zkzrmj = this.focusPerson.fxpcgkAnjxxInfo.zkzrmj || ''
                this.workform.zklxfs = this.focusPerson.fxpcgkAnjxxInfo.zklxfs || ''
                this.workform.xkdw = (this.focusPerson.fxpcgkAnjxxInfo.xkdw || '').split(',')
                this.workform.xklxfs = this.focusPerson.fxpcgkAnjxxInfo.xklxfs || ''
                this.workform.xkzrmj = this.focusPerson.fxpcgkAnjxxInfo.xkzrmj || ''
              }
            })
          }
        }
      },
      queryDictType() {
        /**
         * [res 系统通用字典]
         * @type {[type]}
         */
        this.getDict(['MZDM', 'RQFL', 'RYDJ', 'GJHDQDM', 'ZZMMDM', 'ZJXYDM', 'XLDM', 'ZYLBDM', 'XBDM']).then(res => {
          this.NationList = res['MZDM'] // 民族
          this.ContryList = res['GJHDQDM'] // 国籍
          this.RyTypeList = res['RQFL'] // 人群分类
          // this.LevelList = res['FXDJ'] // 风险等级
          this.PeopleLevelList = res['RYDJ'] // 人员等级
          this.PoliticalList = res['ZZMMDM'] // 政治面貌
          this.FaithList = res['ZJXYDM'] // 宗教信仰
          this.DiplomaList = res['XLDM'] // 文化程度
          this.DutyList = res['ZYLBDM'] // 职务/职位3
          this.sexList = res['XBDM'] // 职务/职位
          // this.AreaList = listToTree(res['XZQHDM'], '', 0, {
          //   id: 'value',
          //   parentId: 'parentId',
          //   children: 'children'
          // }, null, false); // 区划
        })
      },
      start() {
        this.initWorkform()
        if (this.isUpdate === 'add') {
          this.tabName = 'Info'
          this.activeName = 'Info'
          this.readonly = true
          this.formDisabled = false
        } else if (this.isUpdate === 'change') {
          this.tabName = 'workform'
          this.activeName = 'workform'
          this.readonly = true
        } else if (this.isUpdate === 'update') {
          this.tabName = 'Info'
          this.activeName = 'Info'
          this.readonly = false
        } else {
          this.tabName = 'Info'
          this.activeName = 'Info'
        }
        this.IDcardChange = false
        /**
         * 获取字典列表
         */
        if (this.LevelList.length === 0) {
          /**
           * [getCascaderDict 获取接收单位列表]
           *
           * @return {[d[0]]} [原始数据列表]
           * @return {[d[1]]} [树列表]
           */
          /**
           * [d 管辖单位列表]
           * @type {[type]}
           */
          this.ruleDeptList = this.userOrgInfo.orgList.map(c => {
            return {
              label: c.DeptName,
              value: c.KeyId,
              code: c.ParentId
            }
          })
          this.form.CollectDept = this.userOrgInfo.mainOrgId
          /**
           * 人员籍贯
           */
          this.getCascaderNative().then(d => {
            this.oldNativeList = d[0]
            this.NativeList = d[1]
            if (this.keyId !== '') {
              this.getObj()
            }
          })
        } else {
          if (this.keyId !== '') {
            this.getObj()
          }
        }
        this.form.CollectDept = this.userOrgInfo.mainOrg.DeptNo
        this.GetSysOrgDictTree(this.userOrgInfo.mainOrg.DeptNo)
      },
      listToTreedata() {
        this.getDict(['XZQHDM']).then(res => {
          this.AreaList = listToTree(res['XZQHDM'], '', 0, {
            id: 'value',
            parentId: 'parentId',
            children: 'children'
          }, null, false); // 区划
        })
      },
      /**
       * [getObj 获取编辑对象]
       * @return {[type]} [description]
       */
      getObj() {
        this.dispatch(GET_PERSON_BY_ID, {
          KeyId: this.keyId
        }).then(d => {
          this.form = { ...this.focusPerson.Model }
          if (this.form.PhotosId !== null && this.form.PhotosId !== '') {
            this.currentFiles = [{
              name: this.form.RyName,
              id: this.form.PhotosId
            }]
          } else {
            this.currentFiles = []
          }
          this.NativeArr = getTopNexus(this.oldNativeList, this.form.Native, {
            id: 'id',
            children: 'children',
            parentId: 'parentId'
          });
          this.form.CollectDeptArr = getTopNexus(this.orgs.orgByCurryOrg, this.form.GxDept, {
            id: 'orgId',
            children: 'children',
            parentId: 'parentId'
          });
        }).catch(r => {
          this.currentFiles = []
        })
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['form']) {
          this.$refs['form'].resetFields()
        }
      },
      uploadSubmit(f) {
        // 获取当前上传文件列表文件id
        if (f.Status === 1) { // 文件更新保存成功后提交
          let _fileIdArray = []
          for (let ii in f.data.fileList) {
            _fileIdArray.push(f.data.fileList[ii].response.Data.ID)
            this.currentFiles.push({
              name: f.data.fileList[ii].name,
              id: f.data.fileList[ii].response.Data.ID
            })
          }
          this.form.PhotosId = _fileIdArray.join()
        }
      },
      submitForm(d) {
        /**
         * [附件上传 description]
         * @param  {[type]} this [description]
         * @return {[type]}      [description]
         */
        // 确认提交[附件]
        if (this.currentFiles.length <= 0) {
          this.form.PhotosId = '' // 重置上传文件id
        }
        let arr = this.delEmpey({
          id: this.form.id,
          xm: this.form.RyName, // 姓名
          lxdh: this.form.Phone, // 联系电话
          sfz: this.form.Sfz, // 证件号码
          xb: this.form.Sex, // 性别
          rqlb: this.form.RyType, // 人群类别
          mz: this.form.Nation, // 民族
          gj: this.form.Contry, // 国籍
          zzmm: this.form.Political, // 政治面貌
          zjxy: this.form.Faith, // 宗教信仰
          csrq: this.form.Birthday, // 出生日期
          cym: this.form.OldName, // 曾用名
          bmch: this.form.ByName, // 别名绰号
          wwxm: this.form.ForeignName, // 外文姓名
          sfzy: this.form.Job, // 身份/职业
          whcd: this.form.Diploma, // 文化程度
          bysj: this.form.GraduatTime, // 毕业时间
          byyx: this.form.GraduatSchool, // 毕业院校
          ffcs: this.form.ServicePlace, // 服务场所
          fcsdz: this.form.ServicePlaceAddress, // 场所地址
          zwzw: this.form.Duty, // 职务/职位
          zyjjly: this.form.Income, // 主要经济来源
          jszzqk: this.form.IsFunde, // 接收资助情况
          zpxx: this.form.PhotosId, // 人员照片附件ID（多个用逗号分隔）
          zwxx: this.form.Fingerprint, // 指纹信息
          dnaxx: this.form.DNAmessage, // DNA信息
          tmtz: this.form.Character, // 体貌特征
          tcsh: this.form.Specialty, // 特长嗜好
          jwzs: this.form.Outside, // 境外住所
          hzdqh: this.form.DomicileArea.join(','), // 户籍地区划
          hzdxz: this.form.DomicileAddress, // 户籍地详址
          xzzhq: this.form.Area.join(','), // 现住址区划
          fxdj: this.form.Level, // 风险等级
          rydj: this.form.PeopleLevel, // 人员等级
          xzzxz: this.form.Address, // 现住址详址
          gkyy: this.form.ControlReason // 管控原因
        })
        if (this.tabName === 'Info') {
          this.$refs[d].validate(v => {
            if (v) {
              if (this.form.id) {
                this.dispatch(FXPCGK_UPDATE,
                  arr
                ).then(d => {
                  this.$message('提交成功！')
                  this.dialogVisible = false
                  this.$emit('call:change-update')
                })
              } else {
                this.dispatch(FXPCGK_SAVE,
                  arr
                ).then(d => {
                  this.$message('提交成功！')
                  this.dialogVisible = false
                  this.$emit('call:change-update')
                })
              }
            }
          })
        } else if (this.tabName === 'workform') {
          if (this.form.RyType === 'RQ005001') {
            if (this.drugform.id) {
              this.dispatch(FXPCGK_DRUGER_UPDATE, {
                id: this.drugform.id,
                fjid: this.drugform.fjid,
                nrxt: this.drugform.nrxt,
                gfxdm: this.drugform.gfxdm.join(','),
                zfxdm: this.drugform.zfxdm.join(','),
                dfxdm: this.drugform.dfxdm.join(','),
                gkcs: this.drugform.gkcs.join(','),
                gkzt: this.drugform.gkzt.join(','),
                gkdw: this.drugform.gkdw.join(','),
                zrmj: this.drugform.zrmj,
                lxfs: this.drugform.lxfs,
                xkdw: this.drugform.xkdw.join(','),
                xkzrmj: this.drugform.xkzrmj,
                xklxfs: this.drugform.xklxfs
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.drugform.fjid = this.form.id
              this.dispatch(FXPCGK_DRUGER_SAVE, {
                id: this.drugform.id,
                fjid: this.drugform.fjid,
                nrxt: this.drugform.nrxt,
                gfxdm: this.drugform.gfxdm.join(','),
                zfxdm: this.drugform.zfxdm.join(','),
                dfxdm: this.drugform.dfxdm.join(','),
                gkcs: this.drugform.gkcs.join(','),
                gkzt: this.drugform.gkzt.join(','),
                gkdw: this.drugform.gkdw.join(','),
                zrmj: this.drugform.zrmj,
                lxfs: this.drugform.lxfs,
                xkdw: this.drugform.xkdw.join(','),
                xkzrmj: this.drugform.xkzrmj,
                xklxfs: this.drugform.xklxfs
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ005002') {
            if (this.uncondrugform.id) {
              this.dispatch(FXPCGK_DRUGUNCON_UPDATE, {
                id: this.uncondrugform.id,
                fjid: this.uncondrugform.fjid,
                tgskyy: this.uncondrugform.tgskyy.join(','),
                czqk: this.uncondrugform.czqk.join(','),
                gkxz: this.uncondrugform.gkxz.join(','),
                gkdw: this.uncondrugform.gkdw.join(','),
                zrmj: this.uncondrugform.zrmj,
                lxfs: this.uncondrugform.lxfs,
                xkdw: this.uncondrugform.xkdw.join(','),
                xkzrmj: this.uncondrugform.xkzrmj,
                xklxfs: this.uncondrugform.xklxfs
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.uncondrugform.fjid = this.form.id
              this.dispatch(FXPCGK_DRUGUNCON_SAVE, {
                fjid: this.uncondrugform.fjid,
                tgskyy: this.uncondrugform.tgskyy.join(','),
                czqk: this.uncondrugform.czqk.join(','),
                gkxz: this.uncondrugform.gkxz.join(','),
                gkdw: this.uncondrugform.gkdw.join(','),
                zrmj: this.uncondrugform.zrmj,
                lxfs: this.uncondrugform.lxfs,
                xkdw: this.uncondrugform.xkdw.join(','),
                xkzrmj: this.uncondrugform.xkzrmj,
                xklxfs: this.uncondrugform.xklxfs
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ006001') {
            if (this.extremeform.id) {
              this.dispatch(FXPCGK_EXT_UPDATE, {
                id: this.extremeform.id,
                fjid: this.extremeform.fjid || '',
                fzxwfs: this.extremeform.fzxwfs.join(','),
                yyfx: this.extremeform.yyfx.join(','),
                xsly: this.extremeform.xsly.join(','),
                sysd: this.extremeform.sysd.join(','),
                sycs: this.extremeform.sycs.join(','),
                sfmqzrld: this.extremeform.sfmqzrld || '',
                jczfzrld: this.extremeform.jczfzrld || '',
                pcsld: this.extremeform.pcsld || '',
                wkfs: this.extremeform.wkfs || '',
                sfsszb: this.extremeform.sfsszb || '',
                skyy: this.extremeform.skyy || '',
                sftbzrbm: this.extremeform.sftbzrbm || '',
                zrr1: this.extremeform.zrr1 || '',
                zrmj1: this.extremeform.zrmj1 || '',
                zrr2: this.extremeform.zrr2 || '',
                zrmj2: this.extremeform.zrmj2 || '',
                zkzt: this.extremeform.zkzt || '',
                ypzc: this.extremeform.ypzc || '',
                ypzcsz: this.extremeform.ypzcsz || '',
                ypzcxj: this.extremeform.ypzcxj || '',
                fxyhms: this.extremeform.fxyhms || '',
                fxdj: this.extremeform.fxdj || '',
                czmj: this.extremeform.czmj || '',
                czdw: this.extremeform.czdw || '',
                czsj: this.extremeform.czsj || '',
                djmj: this.extremeform.djmj || '',
                djdw: this.extremeform.djdw || '',
                djsj: this.extremeform.djsj || ''
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.extremeform.fjid = this.form.id
              this.dispatch(FXPCGK_EXT_SAVE, {
                fjid: this.extremeform.fjid,
                fzxwfs: this.extremeform.fzxwfs.join(','),
                yyfx: this.extremeform.yyfx.join(','),
                xsly: this.extremeform.xsly.join(','),
                sysd: this.extremeform.sysd.join(','),
                sycs: this.extremeform.sycs.join(','),
                sfmqzrld: this.extremeform.sfmqzrld || '',
                jczfzrld: this.extremeform.jczfzrld || '',
                pcsld: this.extremeform.pcsld || '',
                wkfs: this.extremeform.wkfs || '',
                sfsszb: this.extremeform.sfsszb || '',
                skyy: this.extremeform.skyy || '',
                sftbzrbm: this.extremeform.sftbzrbm || '',
                zrr1: this.extremeform.zrr1 || '',
                zrmj1: this.extremeform.zrmj1 || '',
                zrr2: this.extremeform.zrr2 || '',
                zrmj2: this.extremeform.zrmj2 || '',
                zkzt: this.extremeform.zkzt || '',
                ypzc: this.extremeform.ypzc || '',
                ypzcsz: this.extremeform.ypzcsz || '',
                ypzcxj: this.extremeform.ypzcxj || '',
                fxyhms: this.extremeform.fxyhms || '',
                fxdj: this.extremeform.fxdj || '',
                czmj: this.extremeform.czmj || '',
                czdw: this.extremeform.czdw || '',
                czsj: this.extremeform.czsj || '',
                djmj: this.extremeform.djmj || '',
                djdw: this.extremeform.djdw || '',
                djsj: this.extremeform.djsj || ''
              }).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ006002') { // 无多选，不需要转换格式
            if (this.spiritform.id) {
              this.dispatch(FXPCGK_SPI_UPDATE,
                this.spiritform
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.spiritform.fjid = this.form.id
              this.dispatch(FXPCGK_SPI_SAVE,
                this.spiritform
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ006003') {
            if (this.murderfrom.id) {
              this.dispatch(FXPCGK_CRIME_UPDATE,
                this.murderfrom
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.murderfrom.fjid = this.form.id
              this.dispatch(FXPCGK_CRIME_SAVE,
                this.murderfrom
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ003010') {
            let subPolicesafeForm = clone(this.policesafefrom)
            subPolicesafeForm.gjfdd = this.policesafefrom.gjfdd.join(',')
            subPolicesafeForm.gjfxw = this.policesafefrom.gjfxw.join(',')
            subPolicesafeForm.yjnr = this.policesafefrom.yjnr.join(',')
            subPolicesafeForm.rjnr = this.policesafefrom.rjnr.join(',')
            subPolicesafeForm.sjnr = this.policesafefrom.sjnr.join(',')
            subPolicesafeForm.wkzrdw = this.policesafefrom.wkzrdw.join(',')
            subPolicesafeForm.hjzrdw = this.policesafefrom.hjzrdw.join(',')
            subPolicesafeForm.fjid = this.form.id
            if (this.policesafefrom.id) {
              this.dispatch(FXPCGK_POLICESAFE_UPDATE,
                subPolicesafeForm
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.dispatch(FXPCGK_POLICESAFE_SAVE,
                subPolicesafeForm
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ003011') {
            let submitForm = clone(this.CasePetitionfrom)
            submitForm.zrdw = (this.CasePetitionfrom.zrdw || '').join(',')
            submitForm.fjid = this.form.id
            if (this.CasePetitionfrom.id) {
              this.dispatch(FXPCGK_CASEPETITION_UPDATE,
                submitForm
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.CasePetitionfrom.fjid = this.form.id
              this.dispatch(FXPCGK_CASEPETITION_SAVE,
                submitForm
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ003012') {
            if (this.trafficaccidentfrom.id) {
              this.trafficaccidentfrom.dbqk = this.trafficaccidentfrom.dbqk.join(',')
              this.dispatch(FXPCGK_TRAFFICN_UPDATE,
                this.trafficaccidentfrom
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              this.trafficaccidentfrom.dbqk = this.trafficaccidentfrom.dbqk.join(',')
              this.trafficaccidentfrom.fjid = this.form.id
              this.dispatch(FXPCGK_TRAFFICN_SAVE,
                this.trafficaccidentfrom
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ003014') {
            let submitForm = clone(this.economicrimefrom)
            submitForm.badw = submitForm.badw.join(',')
            if (this.economicrimefrom.id) {
              this.dispatch(FXPCGK_ECONOMICRIME_UPDATE,
                submitForm
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              submitForm.fjid = this.form.id
              this.dispatch(FXPCGK_ECONOMICRIME_SAVE,
                submitForm
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else
          if (this.form.RyType === 'RQ004009') {
            let soldier = { soldiersfrom: this.soldiersfrom, petitionfrom: this.petitionfrom, socontrolfrom: this.socontrolfrom }
            if (this.soldiersfrom.id) {
              this.petitionfrom.swdxtt = this.petitionfrom.swdxtt.join(',')
              this.petitionfrom.swdxhy = this.petitionfrom.swdxhy.join(',')
              this.petitionfrom.swdxgz = this.petitionfrom.swdxgz.join(',')
              this.soldiersfrom.fjid = this.form.id
              this.petitionfrom.fjid = this.form.id
              this.socontrolfrom.fjid = this.form.id
              this.dispatch(FXPCGK_SOLDIERSALL_UPDATE,
                soldier
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else if (this.form.id) {
              let soldier = { soldiersfrom: this.soldiersfrom, petitionfrom: this.petitionfrom, socontrolfrom: this.socontrolfrom }
              this.soldiersfrom.fjid = this.form.id
              this.petitionfrom.fjid = this.form.id
              this.socontrolfrom.fjid = this.form.id
              this.dispatch(FXPCGK_SOLDIERSALL_SAVE,
                soldier
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else if (this.workform.id && this.workform.id !== '') {
            this.$refs['workform'].validate(v => {
              if (v) {
                let workdata = clone(this.workform)
                workdata.zkdw = workdata.zkdw.join(',')
                workdata.xkdw = workdata.xkdw.join(',')
                workdata.fjid = this.form.id
                this.dispatch(FXPCGK_ANJXX_UPDATE,
                  workdata
                ).then(d => {
                  this.$message('提交成功！')
                  this.dialogVisible = false
                  this.$emit('call:change-update')
                })
              }
            })
          } else if (this.form.id) {
            this.$refs['workform'].validate(v => {
              if (v) {
                if (this.workform.zkdw === '') {
                  this.$message('主控单位不能为空')
                } else {
                  let workdata = clone(this.workform)
                  workdata.zkdw = workdata.zkdw.join(',')
                  workdata.xkdw = workdata.xkdw.join(',')
                  workdata.fjid = this.form.id
                  this.dispatch(FXPCGK_ANJXX_SAVE,
                    workdata
                  ).then(d => {
                    this.$message('提交成功！')
                    this.dialogVisible = false
                    this.$emit('call:change-update')
                  })
                }
              }
            })
          } else {
            this.$message('请先保存基本信息！')
          }
        } else {
          return false
        }
      },
      updatePeopleData(id, activeName, disabled) {
        this.isUpdate = activeName
        this.formDisabled = disabled
        this.readonly = !disabled
        this.dispatch(FXPCGK_INFO, { id: id }).then(() => {
          this.form = {
            // CollectDeptArr: [], // 选中管辖单位
            id: this.focusPerson.fxpcgkInfo.id || '',
            RyName: this.focusPerson.fxpcgkInfo.xm, // 姓名
            Phone: this.focusPerson.fxpcgkInfo.lxdh, // 联系电话
            Sfz: this.focusPerson.fxpcgkInfo.sfz, // 证件号码
            Sex: this.focusPerson.fxpcgkInfo.xb, // 性别
            RyType: this.focusPerson.fxpcgkInfo.rqlb, // 人群类别
            RyTypeName: this.focusPerson.fxpcgkInfo.rqlbmc, // 人群类别名称
            Nation: this.focusPerson.fxpcgkInfo.mz, // 民族
            Contry: this.focusPerson.fxpcgkInfo.gj, // 国籍
            Political: this.focusPerson.fxpcgkInfo.zzmm, // 政治面貌
            Faith: this.focusPerson.fxpcgkInfo.zjxy, // 宗教信仰
            Birthday: this.focusPerson.fxpcgkInfo.csrq, // 出生日期
            OldName: this.focusPerson.fxpcgkInfo.cym, // 曾用名
            ByName: this.focusPerson.fxpcgkInfo.bmch, // 别名绰号
            ForeignName: this.focusPerson.fxpcgkInfo.wwxm, // 外文姓名
            Job: this.focusPerson.fxpcgkInfo.sfzy, // 身份/职业
            Diploma: this.focusPerson.fxpcgkInfo.whcd, // 文化程度
            GraduatTime: this.focusPerson.fxpcgkInfo.bysj, // 毕业时间
            GraduatSchool: this.focusPerson.fxpcgkInfo.byyx, // 毕业院校
            ServicePlace: this.focusPerson.fxpcgkInfo.ffcs, // 服务场所
            ServicePlaceAddress: this.focusPerson.fxpcgkInfo.fcsdz, // 场所地址
            Duty: this.focusPerson.fxpcgkInfo.zwzw, // 职务/职位
            Income: this.focusPerson.fxpcgkInfo.zyjjly, // 主要经济来源
            IsFunde: this.focusPerson.fxpcgkInfo.jszzqk, // 接收资助情况
            PhotosId: this.focusPerson.fxpcgkInfo.zpxx, // 人员照片附件ID（多个用逗号分隔）
            Fingerprint: this.focusPerson.fxpcgkInfo.zwxx, // 指纹信息
            DNAmessage: this.focusPerson.fxpcgkInfo.dnaxx, // DNA信息
            Character: this.focusPerson.fxpcgkInfo.tmtz, // 体貌特征
            Specialty: this.focusPerson.fxpcgkInfo.tcsh, // 特长嗜好
            Outside: this.focusPerson.fxpcgkInfo.jwzs, // 境外住所
            DomicileArea: (this.focusPerson.fxpcgkInfo.hzdqh || '').split(','), // 户籍地区划
            DomicileAddress: this.focusPerson.fxpcgkInfo.hzdxz, // 户籍地详址
            Area: (this.focusPerson.fxpcgkInfo.xzzhq || '').split(','), // 现住址区划
            Level: this.focusPerson.fxpcgkInfo.fxdj, // 风险等级
            PeopleLevel: this.focusPerson.fxpcgkInfo.rydj, // 人员等级
            Address: this.focusPerson.fxpcgkInfo.xzzxz, // 现住址详址
            ControlReason: this.focusPerson.fxpcgkInfo.gkyy // 管控原因
          }
          this.defaultArea = this.form.DomicileArea
          this.defaultArea2 = this.form.Area
          this.dialogVisible = true
          setTimeout(() => {
            this.dialogLoading = false
          }, 1500);
        })
      },
      /**
       * [handleAdd 新增]
       * @return {[type]} [description]
       */
      handleAdd(type) {
        this.dialogLoading = false
        this.isUpdate = 'add'
        this.keyId = ''
        this.FocusType = type
        this.dialogMode = false
        this.defaultArea = []
        this.form = {
          id: '',
          // CollectDeptArr: [], // 选中管辖单位
          RyName: '', // 姓名
          Phone: '', // 联系电话
          Sfz: '', // 证件号码
          Sex: '', // 性别
          RyType: this.FocusType, // 人群类别
          Nation: '', // 民族
          Contry: '', // 国籍
          Political: '', // 政治面貌
          Faith: '', // 宗教信仰
          Birthday: '', // 出生日期
          OldName: '', // 曾用名
          ByName: '', // 别名绰号
          ForeignName: '', // 外文姓名
          Job: '', // 身份/职业
          Diploma: '', // 文化程度
          GraduatTime: '', // 毕业时间
          GraduatSchool: '', // 毕业院校
          ServicePlace: '', // 服务场所
          ServicePlaceAddress: '', // 场所地址
          Duty: '', // 职务/职位
          Income: '', // 主要经济来源
          IsFunde: '', // 接收资助情况
          PhotosId: [], // 人员照片附件ID（多个用逗号分隔）
          Fingerprint: '', // 指纹信息
          DNAmessage: '', // DNA信息
          Character: '', // 体貌特征
          Specialty: '', // 特长嗜好
          Outside: '', // 境外住所
          DomicileArea: [], // 户籍地区划
          DomicileAddress: '', // 户籍地详址
          Area: [], // 现住址区划
          Level: '', // 风险等级
          PeopleLevel: '', // 人员等级
          Address: '', // 现住址详址
          ControlReason: '' // 管控原因
        }
        this.dialogVisible = true
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.queryDictType()
      bus.$on('add', d => {
        this.flag = d
      })
    },
    computed: {
      ...mapState(['baseData', 'focusPerson', 'orgs'])
    }
  }

</script>
