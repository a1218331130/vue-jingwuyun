<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="form.id?'信息采集':'重点场所登记'" :visible.sync="dialogVisible" size="middle-fiexd" @open="start" :close-on-click-modal="false">
  <el-tabs v-model="activeName" @tab-click="handleTabClick" class="control__group-handle" style="margin:-15px;min-height:350px">
    <el-tab-pane label="基本信息" name="Info" style="background:#ebf5fc;padding-right:15px;padding-top:10px;padding-bottom:10px">
      <el-form class="control__group-handle" label-width="100px" ref="infoForm" :rules="rules" v-loading="dictLoading" style=" margin:-15px; background:#ebf5fc;  padding-bottom:10px;padding-right:15px;">
        <baseplace v-model="baseplaceform" :flag="flag" :form="form" :dataType="dataType" v-if="parentType === 'zdcs'"></baseplace>
        <online-position v-model="baseplaceform" :flag="flag" :form="form" :dataType="dataType" :defaultArea="defaultArea" v-if="parentType === 'wszd'"></online-position>
        <traffic-safety v-model="baseplaceform" :flag="flag" :form="form" :dataType="dataType" v-if="parentType === 'jtaqgl'&&dataType !== 'zdldpc'"></traffic-safety>
        <control-org v-model="baseplaceform" :flag="flag" :form="form" :dataType="dataType" v-if="parentType === 'jgcs'"></control-org>
        <rual v-model="baseplaceform" :flag="flag" :form="form" :dataType="dataType" v-if="dataType === 'zdldpc'"></rual>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-if="baseplaceform.id" :label="form.RyTypeName? form.RyTypeName + '隐患排查': '隐患排查'" name="workform" style="background:#ebf5fc;padding-right:15px;padding-left:15px;">
      <el-form :model="yhform" label-width="100px" ref="workform" style="padding:0 10px;" v-loading="dictLoading">
        <el-row :gutter="5">
          <el-col :span="24">
            <el-row :gutter="5">
              <el-col :span="24" v-for='(items, index) in yhform.checkNr' :key='index'>
                <div>
                  <h3 class="addh3" style='margin:0 -27px; margin-bottom:0px'>{{items.yhxlmc}}</h3>
                </div>
                <el-form-item class="checkArrbg " label-width="0px">
                  <el-checkbox-group style="padding:5px 5px;margin-top:10px;margin-bottom:10px">
                    <el-row :gutter="5">
                      <el-col :span="24">
                        <el-col class="fjx" :span="24" v-for='(item, index, key) in items.pcxlxx' :key='index'>
                          <el-col :span="24" v-if="item.yhxslx === '1'" style="display: flex;align-items: center">
                            <el-col :span="14">
                              <el-form-item label-width="400px" :label="item.yhxlmc" style="position:relative;line-height:16px;">
                                <el-radio-group v-model="item.nr.nr1">
                                  <el-radio label="1">是</el-radio>
                                  <el-radio label="0">否</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                            <el-col :span="10">
                              <el-form-item label="补充说明" prop="nr5" class="inlineform">
                                <el-input v-model="item.nr.nr2" :maxlength="50" style=""></el-input>
                              </el-form-item>
                            </el-col>
                          </el-col>
                          <el-col :span="24" v-if="item.yhxslx === '2'">
                            <el-form-item label-width="300px" :label="item.yhxlmc" style="position:relative;line-height:16px;">
                              <el-input type="textarea" :autosize="{minRows: 3, maxRows: 50}" v-model="item.nr.nr1" class="inlineform"></el-input>
                              <div class="el-form-item__error" v-if="item.nr.nr1 ==='' && vailbj">必填</div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24" v-if="item.yhxslx === '3'">
                            <el-form-item label-width="300px" :label="item.yhxlmc" prop="nr1" class="inlineform">
                              <el-radio-group v-model="item.nr.nr1" class="radiogroup-style">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                              </el-radio-group>
                              <el-form-item label="是否完好" prop="nr2" class="inlineform">
                                <el-radio-group v-model="item.nr.nr2" class="radiogroup-style">
                                  <el-radio label="1">是</el-radio>
                                  <el-radio label="0">否</el-radio>
                                </el-radio-group>
                              </el-form-item>
                              <el-form-item label="是否缺少" prop="nr3" class="inlineform">
                                <el-radio-group v-model="item.nr.nr3" class="radiogroup-style">
                                  <el-radio label="1">是</el-radio>
                                  <el-radio label="0">否</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24" v-if="item.yhxslx === '4'">
                            <el-form-item label-width="300px" :label="item.yhxlmc" prop="nr4" style="position:relative;line-height:16px;">
                              <el-radio-group v-model="item.nr.nr1">
                                <el-radio label="1">是</el-radio>
                                <el-radio label="0">否</el-radio>
                              </el-radio-group>
                            </el-form-item>
                          </el-col>
                        </el-col>
                      </el-col>
                    </el-row>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label="安防状况" prop="afzk" label-width="100px" :rules="[{required: true, message: '必填', trigger: 'blur'}]">
                  <el-radio-group v-model="yhform.afzk">
                    <el-radio :label="item.value" v-for="item in zdcslxArr['AFZK']" :key='item.value'>{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label="安防状况说明" label-width="100px">
                  <el-input type="textarea" placeholder="请输入安防状况说明" :autosize="{minRows: 3, maxRows: 50}" v-model="yhform.afzksm"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label="整改措施" prop="zgcs" label-width="100px">
                  <el-input type="textarea" placeholder="请输入整改措施" :autosize="{minRows: 3, maxRows: 50}" v-model="yhform.zgcs"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5">
              <el-col :span="24">
                <el-form-item label="整改情况" label-width="100px">
                  <el-radio-group v-model="yhform.zgqk">
                    <el-radio v-for="(item,i) in zdcslxArr['ZGQK']" :key="i" :label="item.value">{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <el-table ref="tableform" class="app-table" @cell-mouse-enter="cellMouseEnter" border stripe :data="yhlistform.PageData" @row-click="upDtatList">
        <el-table-column type="index" label="序号" align="center">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
</el-table-column>
<el-table-column label="安防状况" prop="afzkmc" align="center">

</el-table-column>
<el-table-column label="整改情况" prop="afzksm" align="center">

</el-table-column>
<el-table-column label="登记人" prop="cjrxm" align="center">

</el-table-column>
<el-table-column label="登记时间" prop="cjsj" align="center">

</el-table-column>

<el-table-column label="创建单位名称" prop="cjdwmc" align="center">

</el-table-column>
<el-table-column label="是否注销" align="center">
  <template scope="scope">
            {{scope.row.sfzx === '1'? '已注销':'正常'}}
          </template>
</el-table-column>
</el-table>

<pagination :pagenav="pagenav" :count='counts' @update:pagenav="pagenavChange" align="right"></pagination>

</el-tab-pane>
</el-tabs>
<div v-if="!flag" slot="footer" class="dialog-footer">
  <el-button @click="dialogVisible = false">取消</el-button>
  <!--<el-button @click="reset('form')">重置</el-button>-->
  <el-button type="primary" @click="submitForm('infoForm')">确定</el-button>
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
    margin: 0 -15px 15px;
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

  .control__group-handle .inlineform {
    position: relative;
    line-height: 16px;
    display: inline-block;
    vertical-align: middle;
  }

  .control__group-handle .checkArrbg .inlineform .radiogroup-style {
    position: relative;
    top: 0;
    transform: translateY(0)
  }

  .el-form .checkArr .el-form-item__label {
    line-height: 16px;
  }

  .control-box_div .el-dialog {
    min-width: 960px;
  }

  .control-box_div .el-dialog__body {
    overflow-x: hidden;
  }

  .checkArrbg .el-form-item .el-form-item__label {
    line-height: 30px;
  }

  .checkArrbg .el-form-item__content {
    position: relative;
  }

  .checkArrbg .el-form-item__content .el-radio-group {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .checkArrbg .fjx {
    border-bottom: 1px solid #ddd;
    margin-bottom: 5px
  }

  .checkArrbg .fjx:last-child {
    border-bottom: 1px solid #fff;
    margin-bottom: 0px
  }

</style>

<script>
  import pagination from '../../../widgets/pagination/pagination.vue'
  import mixin from '../../../utils/mixin'
  import '../../../utils/dateFormat'
  import baseplace from '../../control/industry/childInfo/manufacturer/index'
  import onlinePosition from '../../control/industry/childInfo/onlineposition/index'
  import trafficSafety from '../../control/industry/childInfo/trafficsafety/index'
  import controlOrg from '../../control/industry/childInfo/controlOrg/index'
  import rual from '../../control/industry/childInfo/rual/index'
  import upload from '../../../widgets/upload/upload.vue'
  import dataImage from '../../../widgets/data-image/data-image'
  import {
    FXPCGK_BASEPLACE_INFO,
    FXPCGK_BASEPLACE_SAVE,
    FXPCGK_BASEPLACE_UPDATE,
    GET_PERSON_BY_ID,
    FETCH_SYS_ORG_BY_CURRY_ORG,
    PLACE_CHECKLIST, // 隐患排查业务信息
    PLACE_CHECKSAVE // 新增隐患排查业务信息
  } from '../../../store/types'
  import { mapState } from 'vuex'
  import { listToTree } from '../../../utils/listToTree'
  import { getTopNexus, clone } from '../../../utils/util'
  import bus from '../../../utils/bus'
  export default {
    mixins: [mixin],
    components: {
      clone,
      'data-image': dataImage,
      upload,
      baseplace,
      onlinePosition,
      'control-org': controlOrg,
      trafficSafety,
      rual,
      pagination
    },
    data() {
      return {
        flag: false,
        vailbj: false,
        zdcslxArr: [],
        pagenav: {
          currentpage: 1,
          limit: 5
        },
        counts: 0,
        yhpatitle: '', // 排查大类名称
        yhlistform: {},
        yhform: {
          checkNr: [],
          id: '',
          afzk: '',
          afzksm: '',
          zgcs: '',
          zgqk: '',
          fjid: '',
          fjlx: '', // 父级表单所属类型
          cjr: '', // 创建（排查）人警号
          cjsj: '', // 创建（排查）时间
          sfsc: '0', // 是否删除
          cjrxm: '', // 创建（排查）人姓名
          cjdwid: '', // 创建（排查）单位ID
          cjdwmc: '', // 创建（排查）单位名称
          sfzx: '' // 是否注销（传空）
        },
        updataform: {
          checkNr: [],
          id: '',
          afzk: '',
          afzksm: '',
          zgcs: '',
          zgqk: '',
          fjid: '',
          fjlx: '', // 父级表单所属类型
          cjr: '', // 创建（排查）人警号
          cjsj: '', // 创建（排查）时间
          sfsc: '0', // 是否删除
          // cjrxm: '', // 创建（排查）人姓名
          cjdwid: '', // 创建（排查）单位ID
          // cjdwmc: '', // 创建（排查）单位名称
          sfzx: '' // 是否注销（传空）
        },
        activeName: 'Info',
        defaultPropsCascader: {
          value: 'value',
          label: 'label',
          children: 'Children'
        },
        tabName: 'Info',
        formmarket: true,
        baseplaceform: {
          zdcslx: '',
          aqzrdwid: [],
          aqzrdwmc: '',
          aqzrrjh: '',
          aqzrrxm: '',
          aqzrrzw: '',
          aqzrrdh: '',
          dwfzrxm: '',
          dwfzrsfz: '',
          dwfzrdh: '',
          csmc: '',
          csdh: '',
          csdz: '',
          csjd: '',
          cdwd: '',
          bz: '',
          pcsj: '',
          // 大型广场人员密集场所
          aqrl: '',
          mz: '',
          rymd: '',
          jcjbhdqk: '',
          // 旅游景区
          jqdj: '',
          jds: '',
          rjdyks: '',
          // 关注人员聚集场所
          cslx: '',
          gm: '',
          dwzrr: '',
          zrrdh: '',
          zrrzw: '',
          qtrs: '',
          zylyd: '',
          cyqk: '',
          // 高层建筑
          jcry: '',
          jcdw: '', // 农村团寨共有
          jcrq: '', // 农村团寨共有
          syhgldw: '',
          jcnf: '',
          jzmz: '',
          jzcs1: '',
          jzcs2: '',
          jzgd: '',
          sygn: '',
          jzyt: '',
          // 大型室内市场 dxsnsc
          jcyjh: '',
          jcyxm: '',
          jcdwmc: '',
          jcdwid: [],
          jcsj: '',
          cscs: '',
          yymz: '',
          trsysj: '',
          // 农村团寨  nctz
          jcryjh: '',
          jcryxm: '',
          hs: '',
          czrk: '',
          // 大型商场及金银珠宝店 dxsczb
          yyzz: '',
          spsj: '',
          // 大型活动 dxhd
          jbsj: '',
          cyrs: '',
          xklx: '',
          spjg: '',
          // 网上阵地
          yyzt: '',
          tysj: '',
          ym: '',
          mc: '',
          lx: '',
          kbzxm: '',
          lxfs: '',
          fwsmc: '',
          wzkbd: [],
          wzjrdz: '',
          qymc: '',
          szqx: '',
          jfwldz: '',
          ptkbd: [],
          ptjrd: '',
          // 机制落实
          dwzrrjh: '',
          dwzrrxm: '',
          dwmc: '',
          // 交通管理
          syxz: '',
          hphm: '',
          clsyr: '',
          // 重点交通违法
          wfsj: '',
          wfdd: '',
          jdr: '',
          cphm: '',
          wfxw: [],
          cqcs: [],
          zlbf: [],
          // 重点路段
          lm: '',
          lh: '',
          ldlx: '',
          dllb: '',
          jsdj: '',
          xzqk: '',
          gxjjddmc: '',
          gxjjddid: '',
          xzhq: '',
          dlqk: '',
          zlqk: '',
          zgwcsj: '',
          sgqymc: '',
          sgkssj: '',
          sgjssj: '',
          ygjxsm: '',
          zlhxgpg: '',
          zlhxgqtqk: '',
          zlzrdwid: '',
          zlzrdwmc: '',
          sfzfgp: '',
          zfgpjb: ''
        },
        onlineform: {
          zdcslx: '',
          yyzt: '',
          tysj: '',
          ym: '',
          mc: '',
          lx: '',
          kbzxm: '',
          lxfs: '',
          fwsmc: '',
          wzkbd: '',
          wzjrdz: '',
          qymc: '',
          szqx: '',
          jfwldz: '',
          ptkbd: [],
          ptjrd: '',
          // 机制落实
          dwzrrjh: '',
          dwzrrxm: '',
          dwmc: ''
        },
        trafficform: {
          zdcslx: '',
          syxz: '',
          hphm: '',
          clsyr: '',
          // 重点交通违法
          wfsj: '',
          wfdd: '',
          jdr: '',
          cphm: '',
          wfxw: [],
          cqcs: [],
          zlbf: [],
          // 重点路段
          lm: '',
          lh: '',
          ldlx: '',
          dllb: '',
          jsdj: '',
          xzqk: '',
          gxjjddmc: '',
          gxjjddid: ''
        },
        safeData: [],
        keyId: '',
        isFormalSubmit: false,
        isPrivateForm: false,
        formItem: {},
        defaultArea: [],
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
        MaritalStatusList: [
          { label: '已婚', value: '1' },
          { label: '未婚', value: '2' },
          { label: '离异', value: '3' },
          { label: '再婚', value: '4' },
          { label: '丧偶', value: '5' },
          { label: '未知', value: '6' }
        ], // 婚姻状况
        sexList: [{ label: '男', value: '1' }, {
          label: '女',
          value: '2'
        }, { label: '未知', value: '3' }], // 性别列表
        BuyCarList: [{ label: '未购车', value: '0' }, { label: '已购车', value: '1' }, { label: '未知', value: '2' }], // 是否购车
        BuyHouseList: [{ label: '未置业', value: '0' }, { label: '已置业', value: '1' }, { label: '未知', value: '2' }], // 是否置业
        form: {},
        PlaceType: '',
        Contry: [],
        Political: [],
        rules: {
          jzmz: [
            { type: 'number', message: '必须为数字' }
          ],
          jzgd: [
            { type: 'number', message: '必须为数字', trigger: 'blur' }
          ],
          zgqk: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          afzk: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          nr0: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          nr1: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          nr2: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          nr3: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          nr4: [
            { required: true, message: '必填', trigger: 'blur' }
          ]
        }
      }
    },
    props: ['dataType', 'parentType'],
    methods: {
      queryDictType() {
        // 表单字典初始化
        this.getDict(['AFZK', 'ZGQK']).then(res => {
          this.zdcslxArr = res
        })
      },
      handleTabClick(tab, event) {
        this.tabName = tab.name
        if (tab.name === 'workform') {
          this.initWorkform()
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
      start() {
        this.tabName === 'Info'
        this.activeName = 'Info'
        // this.initWorkform()
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
        }
        this.queryDictType()
        this.form.CollectDept = this.userOrgInfo.mainOrg.DeptNo
        this.GetSysOrgDictTree(this.userOrgInfo.mainOrg.DeptNo)
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
      submitForm(formName) {
        if (this.parentType === 'jtaqgl' && this.dataType !== 'zdldpc') {
          let cphm = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
          if (this.baseplaceform.hphm === '') {
            this.$message({
              message: '请输入车牌号码',
              type: 'warning'
            })
            return false
          } else if (!cphm.test(this.baseplaceform.hphm) && this.activeName === 'Info') {
            this.$message({
              message: '请输入正确车牌号码格式',
              type: 'warning'
            })
            return false
          }
        } else if (this.parentType === 'zdcs' && this.baseplaceform.csmc === '') {
          this.$message({
            message: '请输入场所名称',
            type: 'warning'
          })
          return false
        } else if (this.parentType === 'jgcs' && this.baseplaceform.csmc === '') {
          this.$message({
            message: '请输入监管场所名称',
            type: 'warning'
          })
          return false
        } else if (this.parentType === 'wszd' && this.baseplaceform.ym === '') {
          this.$message({
            message: '请输入域名',
            type: 'warning'
          })
          return false
        }
        let submitForm = clone(this.baseplaceform)
        submitForm.aqzrdwid = (submitForm.aqzrdwid || '').join(',')
        submitForm.wfxw = (submitForm.wfxw || '').join(',')
        submitForm.cqcs = (submitForm.cqcs || '').join(',')
        submitForm.zlbf = (submitForm.zlbf || '').join(',')
        submitForm.ptkbd = (submitForm.ptkbd || '').join(',')
        submitForm.jcdwid = (submitForm.jcdwid || '').join(',')
        if (this.baseplaceform.id) { // 编辑基本或排查信息
          if (this.activeName === 'Info') { // 基本信息
            try {
              submitForm.jcsj = this.dateFormat(submitForm.jcsj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.trsysj = this.dateFormat(submitForm.trsysj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.spsj = this.dateFormat(submitForm.spsj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.jbsj = this.dateFormat(submitForm.jbsj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.pcsj = this.dateFormat(submitForm.pcsj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.tysj = this.dateFormat(submitForm.tysj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.wfsj = this.dateFormat(submitForm.wfsj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.zgwcsj = this.dateFormat(submitForm.zgwcsj, 'yyyy-MM-dd hh:mm:ss')
              submitForm.sgjssj = this.dateFormat(submitForm.sgkssj[1], 'yyyy-MM-dd hh:mm:ss')
              submitForm.sgkssj = this.dateFormat(submitForm.sgkssj[0], 'yyyy-MM-dd hh:mm:ss')
            } catch (e) {
              submitForm.sgjssj = submitForm.sgkssj[1]
              submitForm.sgkssj = submitForm.sgkssj[0]
            }
            this.dispatch(FXPCGK_BASEPLACE_UPDATE,
              submitForm
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else { // 排查信息
            let err = true
            this.vailbj = true
            this.yhform.checkNr.map(a => {
              a.pcxlxx.map(d => {
                if (d.yhxslx === '2' && d.nr.nr1 === '') {
                  err = false
                  return
                }
              })
            })
            // 验证
            this.updataform.fjid = this.baseplaceform.id
            this.updataform.fjlx = this.PlaceType // 父级表单所属类型
            this.updataform.cjr = this.users.UserLogin.UserData.UserId // 创建（排查）人警号
            this.updataform.cjsj = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') // 创建（排查）时间
            // this.updataform.cjrxm = this.users.UserLogin.UserData.UserName // 创建（排查）人姓名
            this.updataform.cjdwid = this.users.UserLogin.UserData.DeptNo // 创建（排查）单位ID
            // this.updataform.cjdwmc = this.users.UserLogin.UserData.DeptName // 创建（排查）单位名称
            this.updataform.afzk = this.yhform.afzk
            this.updataform.afzksm = this.yhform.afzksm
            this.updataform.zgcs = this.yhform.zgcs
            this.updataform.zgqk = this.yhform.zgqk
            let nr1 = []
            this.yhform.checkNr.map(d => {
              d.pcxlxx.map(c => {
                if (c.yhdldm !== null) {
                  for (let x in c.nr) {
                    // alert(d.nr[x])
                    nr1.push(c.nr[x])
                  }
                  this.updataform.checkNr.push({
                    dxid: '',
                    yhid: c.yhxldm,
                    nr: '[' + nr1.toString() + ']'
                  })
                  nr1 = []
                }
              })
            })
            this.$refs['workform'].validate((valiad) => {
              if (valiad && err) {
                this.dispatch(PLACE_CHECKSAVE,
                  this.updataform
                ).then(d => {
                  this.$message('提交成功！')
                  this.vailbj = false
                  this.dialogVisible = false
                  this.updataform.afzk = ''
                  this.updataform.afzksm = ''
                  this.updataform.zgcs = ''
                  this.updataform.zgqk = ''
                  this.updataform.checkNr = []
                  this.$emit('call:change-update')
                })
              } else {
                this.updataform.afzk = ''
                this.updataform.afzksm = ''
                this.updataform.zgcs = ''
                this.updataform.zgqk = ''
                this.updataform.checkNr = []
                return false
              }
            })
          }
        } else { // 新增基本信息
          try {
            submitForm.jcsj = this.dateFormat(submitForm.jcsj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.trsysj = this.dateFormat(submitForm.trsysj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.spsj = this.dateFormat(submitForm.spsj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.jbsj = this.dateFormat(submitForm.jbsj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.pcsj = this.dateFormat(submitForm.pcsj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.tysj = this.dateFormat(submitForm.tysj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.wfsj = this.dateFormat(submitForm.wfsj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.zgwcsj = this.dateFormat(submitForm.zgwcsj, 'yyyy-MM-dd hh:mm:ss')
            submitForm.sgjssj = this.dateFormat(submitForm.sgkssj[1], 'yyyy-MM-dd hh:mm:ss')
            submitForm.sgkssj = this.dateFormat(submitForm.sgkssj[0], 'yyyy-MM-dd hh:mm:ss')
            // submitForm.aqzrdwid = (submitForm.aqzrdwid || '').join(',')
            // submitForm.ptkbd = (submitForm.ptkbd || '').join(',')
            // submitForm.wfxw = (submitForm.wfxw || '').join(',')
            // submitForm.cqcs = (submitForm.cqcs || '').join(',')
            // submitForm.zlbf = (submitForm.zlbf || '').join(',')
            // submitForm.jcdwid = (submitForm.jcdwid || '').join(',')
          } catch (e) {
            submitForm.sgjssj = submitForm.sgkssj[1]
            submitForm.sgkssj = submitForm.sgkssj[0]
          }
          this.dispatch(FXPCGK_BASEPLACE_SAVE,
            submitForm
          ).then(d => {
            this.$message('提交成功！')
            this.dialogVisible = false
            this.$emit('call:change-update')
          })
        }
      },
      /**
       * [分页切换操作 description]
       */
      pagenavChange(obj) {
        // 分页切换操作
        this.pagenav = obj
        // 刷新列表
        this.initWorkform()
      },
      /**
       * [更新列表 description]
       */
      updatePeopleData(id, type, btnType) {
        if (btnType === 'details') {
          this.flag = true
        } else {
          this.flag = false
        }
        this.PlaceType = type
        if (id) {
          this.dispatch(FXPCGK_BASEPLACE_INFO, { id: id, zdcslx: type }).then(d => {
            let infoForm = clone(this.focusPerson.fxpcgkBaseplaceInfo)
            infoForm.aqzrdwid = (this.focusPerson.fxpcgkBaseplaceInfo.aqzrdwid || '').split(',')
            infoForm.ptkbd = (this.focusPerson.fxpcgkBaseplaceInfo.ptkbd || '').split(',')
            this.defaultArea = (this.focusPerson.fxpcgkBaseplaceInfo.ptkbd || '').split(',')
            infoForm.wfxw = (this.focusPerson.fxpcgkBaseplaceInfo.wfxw || '').split(',')
            infoForm.cqcs = (this.focusPerson.fxpcgkBaseplaceInfo.cqcs || '').split(',')
            infoForm.zlbf = (this.focusPerson.fxpcgkBaseplaceInfo.zlbf || '').split(',')
            infoForm.jcdwid = (this.focusPerson.fxpcgkBaseplaceInfo.jcdwid || '').split(',')
            this.baseplaceform = infoForm
            this.baseplaceform.sgkssj = [this.baseplaceform.sgkssj, this.baseplaceform.sgjssj]
            this.dialogVisible = true
          })
        }
      },
      /**
       * [隐患列表初次加载 description]
       * @return {[type]} [description]
       */
      initWorkform() {
        this.yhform.afzk = ''
        this.yhform.afzksm = ''
        this.yhform.zgcs = ''
        this.yhform.zgqk = ''
        this.yhform.checkNr = []
        this.dispatch(PLACE_CHECKLIST, { fjid: this.baseplaceform.id, fjlx: this.PlaceType, PageIndex: this.pagenav.currentpage, PageSize: this.pagenav.limit }).then(d => {
          this.yhlistform = clone(this.focusPerson.placeChecklist)
          if (this.yhlistform.PageData) {
            this.counts = this.yhlistform.DataCount
            let thisData = this.yhlistform.PageData
            thisData.map(a => {
              a.troubleDict.map(d => {
                d.pcxlxx.map(c => {
                  var nrarr = []
                  if (c.nr !== null) {
                    nrarr = c.nr.substring(1, c.nr.length - 1).split(',')
                  } else {
                    nrarr[0] = ''
                    nrarr[1] = ''
                    nrarr[2] = ''
                  }
                  if (c.yhxslx === '1') {
                    c.nr = { nr1: nrarr[0], nr2: nrarr[1] }
                  } else if (c.yhxslx === '2' || c.yhxslx === '4') {
                    c.nr = { nr1: nrarr[0] }
                  } else if (c.yhxslx === '3') {
                    c.nr = { nr1: nrarr[0], nr2: nrarr[1], nr3: nrarr[2] }
                  }
                  if (c.yhdldm === null) {
                    this.yhpatitle = c.ms
                  }
                })
              })
              // this.yhform.checkNr = []
              // this.yhform.checkNr = a.troubleDict
              // this.yhform.afzk = a.afzk
              // this.yhform.afzksm = a.afzksm
              // this.yhform.zgcs = a.zgcs
              // this.yhform.zgqk = a.zgqk
            })
            this.yhform.checkNr = []
            this.yhform.checkNr = this.yhlistform.PageData[0].troubleDict
            this.yhform.checkNr = this.yhlistform.PageData[0].troubleDict
            this.yhform.afzk = this.yhlistform.PageData[0].afzk
            this.yhform.afzksm = this.yhlistform.PageData[0].afzksm
            this.yhform.zgcs = this.yhlistform.PageData[0].zgcs
            this.yhform.zgqk = this.yhlistform.PageData[0].zgqk
          } else {
            this.yhlistform.map(a => {
              a.pcxlxx.map(d => {
                if (d.yhxslx === '1') {
                  d.nr = { nr1: '0', nr2: '' }
                } else if (d.yhxslx === '2' || d.yhxslx === '4') {
                  d.nr = { nr1: '0' }
                } else if (d.yhxslx === '3') {
                  d.nr = { nr1: '0', nr2: '0', nr3: '0' }
                }
              })
              this.yhform.afzk = a.afzk
              this.yhform.afzksm = a.afzksm
              this.yhform.zgcs = a.zgcs
              this.yhform.zgqk = a.zgqk
            })
            this.yhform.checkNr = []
            this.yhform.checkNr = this.yhlistform
            // this.yhlistform[0].pcxlxx.forEach(d => {
            //   if(d.yhxslx === '1') {
            //     d.nr = { nr1: '', nr2: '' }
            //   } else if(d.yhxslx === '2' || d.yhxslx === '4') {
            //     d.nr = { nr1: '' }
            //   } else if(d.yhxslx === '3') {
            //     d.nr = { nr1: '', nr2: '', nr3: '' }
            //   }
            // })
            // let arr = []
            // this.yhform.checkNr = []
            // this.yhlistform.forEach(a => {
            //   arr.push(a)
            // })
            // this.yhform.checkNr = arr
          }
        })
      },
      /**
       * [表格行数据点击 description]
       * @return {[type]} [description]
       */
      upDtatList(row, event, column) {
        this.yhform.checkNr = []
        this.yhform.checkNr = row.troubleDict
        this.yhform.afzk = row.afzk
        this.yhform.afzksm = row.afzksm
        this.yhform.zgcs = row.zgcs
        this.yhform.zgqk = row.zgqk
      },
      /**
       * [handleAdd 新增]
       * @return {[type]} [description]
       */
      handleAdd(type) {
        this.keyId = ''
        this.FocusType = type
        this.dialogMode = false
        this.resetfrom(this.baseplaceform)
        this.baseplaceform.zdcslx = type
        this.dialogVisible = true
      },
      /**
       * [表单清空 description]
       * @param  {[type]} d [description]
       * @return {[type]}   [description]
       */
      resetfrom(d) {
        for (let item in d) {
          if (d[item] instanceof Array) {
            d[item] = []
          } else {
            d[item] = ''
          }
        }
      }
    },
    watch: {},
    mounted() {
      bus.$on('control.addHandle', data => {
        this.keyId = ''
        this.FocusType = data
        this.dialogMode = false
        this.resetfrom(this.baseplaceform)
        this.baseplaceform.zdcslx = data
        this.dialogVisible = true
      })
      bus.$on('add', d => {
        this.flag = d
      })
    },
    created() {},
    computed: {
      ...mapState(['dict', 'focusPerson', 'dossier', 'users', 'orgs'])
    }
  }

</script>
