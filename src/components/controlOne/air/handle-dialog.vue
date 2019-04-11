<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="form.id?'信息采集':'无人机登记'" :visible.sync="dialogVisible" size="middle-fiexd" @open="start" :close-on-click-modal="false">
  <el-form class="control__group-handle" label-width="100px" :model="ruleForm" ref="workform" v-loading="dictLoading" style=" margin:-15px; background:#ebf5fc;  padding-bottom:10px;padding-right:15px;">
    <manufacturer v-model="ruleForm.manuform" :flag="flag" v-show="dataType==='sccj'" :defaultArea="defaultArea" :form="form"></manufacturer>
    <seller v-model="ruleForm.sellerform" :flag="flag" v-show="dataType==='xss'" :defaultArea="defaultArea" :form="form"></seller>
    <training v-model="ruleForm.trailform" :flag="flag" v-show="dataType==='pxjg'" :defaultArea="defaultArea" :form="form"></training>
    <hobbyer v-model="ruleForm.hobbyform" :flag="flag" v-show="dataType==='wrjahz'" :defaultArea="defaultArea" :form="form"></hobbyer>
    <production v-model="ruleForm.productform" :flag="flag" v-show="dataType==='wrjgl'" :defaultArea="defaultArea" :form="form"></production>
  </el-form>
  <div v-if="!flag" slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <!--<el-button @click="reset('form')">重置</el-button>-->
    <el-button type="primary" @click="submitForm('workform')">确定</el-button>
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

  .control__group-handle {}

  .control-box_div .el-dialog {
    min-width: 960px;
  }

  .control-box_div .el-dialog__body {
    overflow-x: hidden;
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import manufacturer from '../../control/air/childInfo/manufacturer/index'
  import seller from '../../control/air/childInfo/seller/index'
  import training from '../../control/air/childInfo/training/index'
  import production from '../../control/air/childInfo/production/index'
  import hobbyer from '../../control/air/childInfo/hobbyer/index'
  import upload from '../../../widgets/upload/upload.vue'
  import dataImage from '../../../widgets/data-image/data-image'
  import {
    UAV_MANUFACTURER_UPDATE,
    UAV_MANUFACTURER_SAVE,
    UAV_MANUFACTURER_INFO,
    UAV_HOBBYER_INFO,
    UAV_SELLER_INFO,
    UAV_PRODUCTION_INFO,
    UAV_TRAINING_INFO,
    FXPCGK_ECONOMICRIME_INFO,
    UAV_SELLER_UPDATE,
    UAV_SELLER_SAVE,
    UAV_PRODUCTION_SAVE,
    UAV_PRODUCTION_UPDATE,
    UAV_TRAINING_UPDATE,
    UAV_TRAINING_SAVE,
    UAV_HOBBYER_UPDATE,
    UAV_HOBBYER_SAVE,
    // GET_PERSON_BY_ID,
    FETCH_SYS_ORG_BY_CURRY_ORG
  } from '../../../store/types'
  import { mapState } from 'vuex'
  import { listToTree } from '../../../utils/listToTree'
  import { clone } from '../../../utils/util'
  import bus from '../../../utils/bus'
  export default {
    mixins: [mixin],
    components: {
      clone,
      'data-image': dataImage,
      upload,
      manufacturer,
      seller,
      training,
      production,
      hobbyer
    },
    data() {
      return {
        flag: false,
        defaultPropsCascader: {
          value: 'value',
          label: 'label',
          children: 'Children'
        },
        tabName: 'workform',
        activeName: 'workform',
        formmarket: true,
        ruleForm: {
          manuform: {
            id: '',
            sccjmc: '',
            sccjdz: '',
            sssz: '',
            gsdjsj: '',
            fadb: '',
            fasfz: '',
            lxfw: '',
            jyfw: '',
            sczk: '',
            bz1: '',
            djr: '',
            djsj: '',
            djdw: '',
            sfpc: '',
            zxzt: '',
            zxsj: '',
            cjsj: '',
            cjr: '',
            xgsj: '',
            xgr: '',
            sfsc: '',
            djrxm: '',
            djdwmc: '',
            pcsj: '',
            gkyy: '',
            wrjlx: ''
          },
          sellerform: {
            id: '',
            xssmc: '',
            sssz: '',
            gsdjsj: '',
            fadb: '',
            fasfz: '',
            lxfs: '',
            xxdz: '',
            jyfw: '',
            sczk: '',
            bz1: '',
            djr: '',
            djdw: '',
            djsj: '',
            sfpc: '',
            zxzt: '',
            zxsj: '',
            cjsj: '',
            cjr: '',
            xgsj: '',
            xgr: '',
            sfsc: '',
            djrxm: '',
            djdwmc: '',
            pcsj: '',
            gkyy: '',
            wrjlx: ''
          },
          trailform: {
            id: '',
            xssmc: '',
            sssz: '',
            gsdjsj: '',
            fadb: '',
            fasfz: '',
            lxfs: '',
            xxdz: '',
            sqfw: '',
            sqqk: '',
            bz1: '',
            djr: '',
            djdw: '',
            djsj: '',
            sfpc: '',
            zxzt: '',
            zxsj: '',
            cjsj: '',
            cjr: '',
            xgsj: '',
            xgr: '',
            sfsc: '',
            djrxm: '',
            djdwmc: '',
            pcsj: '',
            gkyy: '',
            wrjlx: ''
          },
          hobbyform: {
            id: '',
            xssmc: '',
            sssz: '',
            gsdjsj: '',
            fadb: '',
            fasfz: '',
            lxfs: '',
            xxdz: '',
            djr: '',
            djdw: '',
            sycn: '',
            djsj: '',
            sfpc: '',
            zxzt: '',
            zxsj: '',
            cjsj: '',
            cjr: '',
            xgsj: '',
            xgr: '',
            sfsc: '',
            djrxm: '',
            djdwmc: '',
            pcsj: '',
            gkyy: '',
            wrjlx: ''
          },
          productform: {
            id: '',
            wrjpp: '',
            wrjxh: '',
            szdw: '',
            xm: '',
            lxdh: '',
            sssz: '',
            yywrjsl: '',
            cxqk: '',
            zjqx: '',
            cnqk: '',
            dwmc: '',
            zrr: '',
            lxfs: '',
            dwsycn: '',
            djr: '',
            djdw: '',
            djsj: '',
            sfpc: '',
            zxzt: '',
            zxsj: '',
            bz1: '',
            cjsj: '',
            cjr: '',
            xgsj: '',
            xgr: '',
            sfsc: '',
            djrxm: '',
            djdwmc: '',
            pcsj: '',
            gkyy: '',
            wrjlx: ''
          }
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
        defaultArea: [],
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
        Contry: [],
        Political: []
      }
    },
    props: ['dataType'],
    methods: {
      handleTabClick(tab, event) {
        this.tabName = tab.name
        if (tab.name === 'workform') { this.initWorkform() }
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
      initWorkform() {
        if (this.form.RyType === 'RQ005002') { // 脱管失控吸毒人员
        } else if (this.form.RyType === 'RQ003014') { // 涉众经济犯罪
          for (let item in this.economicrimefrom) {
            if (item instanceof Array) {
              this.economicrimefrom[item] = []
            } else {
              this.economicrimefrom[item] = ''
            }
          }
          if (this.form.id) {
            this.dispatch(FXPCGK_ECONOMICRIME_INFO, { fjid: this.form.id }).then(d => {
              if (this.focusPerson.fxpcgkEconomicrimeInfo) {
                this.economicrimefrom = clone(this.focusPerson.fxpcgkEconomicrimeInfo)
              }
            })
          }
          this.isPrivateForm = true
        }
      },
      start() {
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
          /**
           * [res 系统通用字典]
           * @type {[type]}
           */
          this.getDict(['MZDM']).then(res => {
            this.NationList = res['MZDM'] // 民族
          })
        } else {
          if (this.keyId !== '') {
            this.getObj()
          }
        }
        this.form.CollectDept = this.userOrgInfo.mainOrg.DeptNo
        this.GetSysOrgDictTree(this.userOrgInfo.mainOrg.DeptNo)
      },
      /**
       * [handleAdd 新增]
       * @return {[type]} [description]
       */
      handleAdd(type) {
        this.keyId = ''
        this.FocusType = type
        this.dialogMode = false
        this.defaultArea = []
        if (this.dataType === 'sccj') {
          for (let item in this.ruleForm.manuform) {
            if (item instanceof Array) {
              this.ruleForm.manuform[item] = []
            } else {
              this.ruleForm.manuform[item] = ''
            }
          }
        }
        if (this.dataType === 'xss') {
          for (let item in this.ruleForm.sellerform) {
            if (item instanceof Array) {
              this.ruleForm.sellerform[item] = []
            } else {
              this.ruleForm.sellerform[item] = ''
            }
          }
        }
        if (this.dataType === 'pxjg') {
          for (let item in this.ruleForm.trailform) {
            if (item instanceof Array) {
              this.ruleForm.trailform[item] = []
            } else {
              this.ruleForm.trailform[item] = ''
            }
          }
        }
        if (this.dataType === 'wrjgl') {
          for (let item in this.ruleForm.productform) {
            if (item instanceof Array) {
              this.ruleForm.productform[item] = []
            } else {
              this.ruleForm.productform[item] = ''
            }
          }
        }
        if (this.dataType === 'wrjahz') {
          for (let item in this.ruleForm.hobbyform) {
            if (item instanceof Array) {
              this.ruleForm.hobbyform[item] = []
            } else {
              this.ruleForm.hobbyform[item] = ''
            }
          }
        }
        this.dialogVisible = true
      },
      /**
       * 重置表单
       */
      reset() {
        if (this.$refs['workform']) {
          this.$refs['workform'].resetFields()
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
      // 通过id来判断是新增还是编辑,提交表单
      submitForm(formName) {
        if (this.dataType === 'sccj') {
          if (this.ruleForm.manuform.sccjmc === '') {
            this.$message({
              message: '请输入生产厂家名称',
              type: 'warning'
            })
            return false
          }
          let submitData = clone(this.ruleForm.manuform)
          submitData.sssz = submitData.sssz !== '' ? submitData.sssz.join(',') : ''
          submitData.wrjlx = this.FocusType
          if (this.ruleForm.manuform.id) {
            this.dispatch(UAV_MANUFACTURER_UPDATE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(UAV_MANUFACTURER_SAVE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          }
        } else if (this.dataType === 'xss') {
          if (this.ruleForm.sellerform.xssmc === '') {
            this.$message({
              message: '请输入销售商名称',
              type: 'warning'
            })
            return false
          }
          let submitData = clone(this.ruleForm.sellerform)
          submitData.sssz = submitData.sssz !== '' ? submitData.sssz.join(',') : ''
          submitData.wrjlx = this.FocusType
          if (this.ruleForm.sellerform.id) {
            this.dispatch(UAV_SELLER_UPDATE,
              this.sellerform
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(UAV_SELLER_SAVE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          }
        } else if (this.dataType === 'pxjg') {
          if (this.ruleForm.trailform.xssmc === '') {
            this.$message({
              message: '请输入培训机构名称',
              type: 'warning'
            })
            return false
          }
          let submitData = clone(this.ruleForm.trailform)
          submitData.sssz = submitData.sssz !== '' ? submitData.sssz.join(',') : ''
          submitData.wrjlx = this.FocusType
          if (this.ruleForm.trailform.id) {
            this.dispatch(UAV_TRAINING_UPDATE,
              this.trailform
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(UAV_TRAINING_SAVE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          }
        } else if (this.dataType === 'wrjgl') {
          if (this.ruleForm.productform.wrjpp === '') {
            this.$message({
              message: '请输入无人机品牌',
              type: 'warning'
            })
            return false
          }
          let submitData = clone(this.ruleForm.productform)
          submitData.sssz = submitData.sssz !== '' ? submitData.sssz.join(',') : ''
          submitData.wrjlx = this.FocusType
          if (this.ruleForm.productform.id) {
            this.dispatch(UAV_PRODUCTION_UPDATE,
              this.productform
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(UAV_PRODUCTION_SAVE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          }
        } else if (this.dataType === 'wrjahz') {
          if (this.ruleForm.hobbyform.xssmc === '') {
            this.$message({
              message: '请输入姓名',
              type: 'warning'
            })
            return false
          }
          let submitData = clone(this.ruleForm.hobbyform)
          submitData.sssz = submitData.sssz !== '' ? submitData.sssz.join(',') : ''
          submitData.wrjlx = this.FocusType
          if (this.ruleForm.hobbyform.id) {
            this.dispatch(UAV_HOBBYER_UPDATE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(UAV_HOBBYER_SAVE,
              submitData
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          }
        }
      },
      updatePeopleData(id, btnType) {
        if (btnType === 'details') {
          this.flag = true
        } else {
          this.flag = false
        }
        if (this.dataType === 'sccj') {
          if (id) {
            this.dispatch(UAV_MANUFACTURER_INFO, { id: id }).then(d => {
              let infoData = clone(this.focusPerson.uavManufacturerInfo)
              infoData.sssz = (infoData.sssz || '').split(',')
              this.defaultArea = infoData.sssz
              this.ruleForm.manuform = infoData
              this.dialogVisible = true
            })
          }
        } else if (this.dataType === 'xss') {
          if (id) {
            this.dispatch(UAV_SELLER_INFO, { id: id }).then(d => {
              let infoData = clone(this.focusPerson.uavSellerInfo)
              infoData.sssz = (infoData.sssz || '').split(',')
              this.defaultArea = infoData.sssz
              this.ruleForm.sellerform = infoData
              this.dialogVisible = true
            })
          }
        } else if (this.dataType === 'pxjg') {
          if (id) {
            this.dispatch(UAV_TRAINING_INFO, { id: id }).then(d => {
              let infoData = clone(this.focusPerson.uavTrainingInfo)
              infoData.sssz = (infoData.sssz || '').split(',')
              this.defaultArea = infoData.sssz
              this.ruleForm.trailform = infoData
              this.dialogVisible = true
            })
          }
        } else if (this.dataType === 'wrjgl') {
          if (id) {
            this.dispatch(UAV_PRODUCTION_INFO, { id: id }).then(d => {
              let infoData = clone(this.focusPerson.uavProductionInfo)
              infoData.sssz = (infoData.sssz || '').split(',')
              this.defaultArea = infoData.sssz
              this.ruleForm.productform = infoData
              this.dialogVisible = true
            })
          }
        } else if (this.dataType === 'wrjahz') {
          if (id) {
            this.dispatch(UAV_HOBBYER_INFO, { id: id }).then(d => {
              let infoData = clone(this.focusPerson.uavHobbyerInfo)
              infoData.sssz = (infoData.sssz || '').split(',')
              this.defaultArea = infoData.sssz
              this.ruleForm.hobbyform = infoData
              this.dialogVisible = true
            })
          }
        }
      }
    },
    watch: {},
    mounted() {},
    created() {
      bus.$on('add', d => {
        this.flag = d
      })
    },
    computed: {
      ...mapState(['dict', 'focusPerson', 'dossier', 'users', 'orgs'])
    }
  }

</script>
