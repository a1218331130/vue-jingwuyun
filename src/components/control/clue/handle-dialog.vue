<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="'信息采集'" :visible.sync="dialogVisible" size="middle-fiexd" @open="start" :close-on-click-modal="false">
  <el-form class="control__group-handle" label-width="100px" :model="clueform" ref="workform" :rules="rules" v-loading="dictLoading" style="background:#ebf5fc;padding-right:15px;padding-bottom:10px;margin-top:-15px;margin:-15px;">
    <clue v-model="clueform" :flag="flag" :form="form"></clue>
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

</style>

<script>
  import mixin from '../../../utils/mixin'
  import clue from '../../control/clue/childInfo/base/index'
  import {
    FXPCGK_CLUE_INFO,
    FXPCGK_CLUE_UPDATE,
    FXPCGK_CLUE_SAVE,
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
      clue
    },
    data() {
      return {
        flag: false,
        defaultPropsCascader: {
          value: 'value',
          label: 'label',
          children: 'Children'
        },
        rules: {
          bt: [
            { required: true, message: '必填', trigger: 'blur' }
          ],
          shdw: [
            { type: 'array', required: true, message: '请选择', trigger: 'blur' }
          ]
        },
        tabName: 'workform',
        activeName: 'workform',
        formmarket: true,
        clueform: {
          id: '',
          fjid: '',
          bt: '',
          xxzl: '',
          xxly: '',
          xxzsx: '',
          xxyjx: '',
          sjsj: '',
          xgr: '',
          xgsj: '',
          cjr: '',
          cjsj: '',
          sfsc: '',
          fssj: [],
          xgrxm: '',
          xgdw: '',
          xgdwmc: '',
          cjrxm: '',
          cjdw: '',
          cjdwmc: '',
          zdzt: '',
          shxxr: '',
          shdw: [],
          fsdy: '',
          xxshsj: '',
          xxnr: '',
          cppgjg: '',
          xxbq: '',
          sfsjsx: '',
          sfsjxx: '',
          sjbq: '',
          fsxz: '',
          gxdw: [],
          gxjz: '',
          djsj: '',
          cjrjh: '',
          gxdwmc: '',
          gxjzmc: '',
          shdwmc: '',
          shxxrmc: '',
          sjbqmc: '',
          xxbqmc: '',
          zdztmc: '',
          xxkkx: '',
          xxkkxmc: '',
          gkyy: ''
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
        CtrlStatusList: [ // 管控状态，0：正常在控，1：撤销管控，2：失控，3：其它
          { label: '正常在控', value: '0' },
          { label: '失控', value: '1' },
          { label: '其它', value: '2' }
        ], // 管控等级
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
      start() {
        this.clueform.cjrxm = this.users.UserLogin.UserData.UserName
        this.clueform.cjrjh = this.users.UserLogin.UserData.UserCode
        this.clueform.cjsj = this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.clueform.cjdw = this.users.UserLogin.UserData.DeptName
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
      /**
       * [handleAdd 新增]
       * @return {[type]} [description]
       */
      handleAdd(type) {
        this.keyId = ''
        this.FocusType = type
        this.dialogMode = false
        this.clueform = {
          id: '',
          fjid: '',
          bt: '',
          xxzl: '',
          xxly: '',
          xxzsx: '',
          xxyjx: '',
          sjsj: '',
          xgr: '',
          xgsj: '',
          cjr: '',
          cjsj: '',
          sfsc: '',
          fssj: [],
          xgrxm: '',
          xgdw: '',
          xgdwmc: '',
          cjrxm: '',
          cjdw: '',
          cjdwmc: '',
          zdzt: '',
          shxxr: '',
          shdw: '',
          fsdy: '',
          xxshsj: '',
          xxnr: '',
          cppgjg: '',
          xxbq: '',
          sfsjsx: '',
          sfsjxx: '',
          sjbq: '',
          fsxz: '',
          gxdw: [],
          gxjz: '',
          djsj: '',
          cjrjh: '',
          gxdwmc: '',
          gxjzmc: '',
          shdwmc: '',
          shxxrmc: '',
          sjbqmc: '',
          xxbqmc: '',
          zdztmc: '',
          xxkkx: '',
          xxkkxmc: '',
          gkyy: ''
        }
        this.dialogVisible = true
      },
      submitForm(d) {
        this.$refs[d].validate((valid) => {
          if (valid) {
            let cform = clone(this.clueform)
            cform.czsj = this.dateFormat(cform.czsj, 'yyyy-MM-dd hh:mm:ss')
            cform.gxdw = cform.gxdw !== '' ? cform.gxdw.join(',') : ''
            cform.shdw = cform.shdw !== '' ? cform.shdw.join(',') : ''
            cform.qqlx = '0'
            if (this.clueform.id) {
              this.dispatch(FXPCGK_CLUE_UPDATE,
                cform
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            } else {
              this.dispatch(FXPCGK_CLUE_SAVE,
                cform
              ).then(d => {
                this.$message('提交成功！')
                this.dialogVisible = false
                this.$emit('call:change-update')
              })
            }
          } else {
            return false
          }
        })
      },
      updatePeopleData(id, btnType) {
        if (btnType === 'details') {
          this.flag = true
        } else {
          this.flag = false
        }
        this.clueform = {
          id: '',
          fjid: '',
          bt: '',
          xxzl: '',
          xxly: '',
          xxzsx: '',
          xxyjx: '',
          sjsj: '',
          xgr: '',
          xgsj: '',
          cjr: '',
          cjsj: '',
          sfsc: '',
          fssj: [],
          xgrxm: '',
          xgdw: '',
          xgdwmc: '',
          cjrxm: '',
          cjdw: '',
          cjdwmc: '',
          zdzt: '',
          shxxr: '',
          shdw: [],
          fsdy: '',
          xxshsj: '',
          xxnr: '',
          cppgjg: '',
          xxbq: '',
          sfsjsx: '',
          sfsjxx: '',
          sjbq: '',
          fsxz: '',
          gxdw: [],
          gxjz: '',
          djsj: '',
          cjrjh: '',
          gxdwmc: '',
          gxjzmc: '',
          shdwmc: '',
          shxxrmc: '',
          sjbqmc: '',
          xxbqmc: '',
          zdztmc: '',
          xxkkx: '',
          xxkkxmc: '',
          gkyy: ''
        }
        if (id) {
          this.dispatch(FXPCGK_CLUE_INFO, { id: id }).then(d => {
            let reclueform = clone(this.focusPerson.fxpcgkClueInfo)
            reclueform.fssj = [reclueform.sfsjsx || '', reclueform.sfsjxx || '']
            reclueform.gxdw = (reclueform.gxdw || '').split(',')
            reclueform.shdw = (reclueform.shdw || '').split(',')
            this.clueform = clone(reclueform)
            this.dialogVisible = true
          })
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
