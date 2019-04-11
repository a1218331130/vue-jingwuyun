<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="用户管理" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form class="user-form" ref="editForm" :model="editForm" :rules="rules" label-width="100px" v-if="!dictLoading">
    <el-row>
      <el-col :span="14">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="editForm.username" placeholder="" @change="checkUserName()" @blur="remoteCheckUserName()" :maxlength="16">
            <!-- <el-button title="清空" v-if="!isSubmitName" @click="editForm.username='';checkArr.text='';isSubmitName=false" size="mini" slot="append" icon="close"></el-button> -->
            <el-button :title="isSubmitName?'该用户名可用':'清空'" @click="editForm.username='';checkArr.text='';isSubmitName=false" size="mini" :style="isSubmitName?'color: green':''" slot="append" :icon="isSubmitName?'check':'close'"></el-button>
          </el-input>
          <span v-show="!isSubmitName" :style="checkArr.color">{{checkArr.text}}</span>
        </el-form-item>
        <el-form-item prop="xm" label="姓名">
          <el-input v-model="editForm.xm" placeholder="" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="gmsfhm" label="身份证">
          <el-input v-model="editForm.gmsfhm" placeholder="" @change="checkIDcard()" @blur="remoteCheckIDcard()" :maxlength="18">
            <el-button :title="isSubmitIDcard?'该身份证可用':'清空'" @click="editForm.gmsfhm='';checkArr2.text='';isSubmitIDcard=false" size="mini" :style="isSubmitIDcard?'color: green':''" slot="append" :icon="isSubmitIDcard?'check':'close'"></el-button>
          </el-input>
          <span :style="checkArr2.color">{{checkArr2.text}}</span>
        </el-form-item>
        <el-form-item prop="code" label="警员编号">
          <el-input v-model="editForm.code" placeholder="" :maxlength="20"></el-input>
        </el-form-item>
      </el-col>

      <!-- 后端有默认密码提供 -->
      <!-- <el-col :span="12">
            <el-form-item v-show="this.id === ''" prop="password" label="密码">
              <el-input type="password" v-model="editForm.password" placeholder="" :maxlength="16"></el-input>
            </el-form-item>
          </el-col> -->

      <!-- 照片 -->
      <el-col :span="10" style="height:180px;">
        <data-image class="face" style="margin-left:75px" v-if="isPhoto&&editForm.face===''" :idCard="editForm.gmsfhm"></data-image>
        <upload class="face" v-if="!(isPhoto&&editForm.face==='')" uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
        <div class="text-center" style="font-size:12px;">
          上传照片,不能删除,只能修改.
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item class="other-org-box" prop="status" label="所属单位" style="margin-bottom:0;"></el-form-item>
        <el-button size="mini" icon="plus" @click="addOrg" style="position:absolute;top:45px;right:32px; z-index:5; padding-right: 5px;"></el-button>
        <el-table :data="editForm.otherOrgList" style="width:515px; margin:0 auto 20px auto;">
          <el-table-column align="center" width="80" label="主单位">
            <template scope="scope">
              <el-switch v-model="scope.row.isMain" :title="scope.row.orgIds.length===0?'请先选择单位':''" on-text="" off-text="" @change="updateMainOrg(scope.row.orgIds[scope.row.orgIds.length-1])"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" label="中心">
            <template scope="scope">
              <el-switch v-model="scope.row.isCenter" :title="scope.row.orgIds.length===0?'请先选择单位':''" on-text="" off-text="" @change="updateCenter(scope.row.orgIds[scope.row.orgIds.length-1])"></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="选择单位">
            <template scope="scope">
              <el-cascader :options="orgTree" v-model="scope.row.orgIds" :props="treeProps" filterable change-on-select placeholder="选择单位" @change="updateOrgItem(scope.row.orgIds[scope.row.orgIds.length-1], scope.$index)"></el-cascader>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" label="选择职务">
            <template scope="scope">
              <el-select v-model="scope.row.zwjb" placeholder="选择职务" v-if="dictList &&　dictList[ 'ZJ']">
                <el-option v-for="(item,i) in dictList['ZJ']" :key="i" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" width="50" label="">
            <template scope="scope">
              <el-button size="mini" icon="close" :disabled="editForm.otherOrgList.length===1" @click="removeOrg(scope.row)" style="padding-right: 5px;"></el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item prop="loginauthorities" label="登录方式">
          <el-select v-model="editForm.loginauthorities" placeholder="请选择">
            <el-option v-for="(item,i) in loginTypeOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="mobile" label="手机号">
          <el-input v-model="editForm.mobile" placeholder="" :maxlength="11"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="dllx" label="登录类型">
          <el-select v-model="editForm.dllx" placeholder="请选择">
            <el-option label="多机登录" value="1"></el-option>
            <el-option label="单机登录（强制下线其他用户）" value="2"></el-option>
            <el-option label="单机登录（非强制下线其他用户）" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email" placeholder="" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="24">
            <el-form-item prop="dlrk" label="所属中心">

            </el-form-item>
          </el-col> -->

      <el-col :span="12">
        <el-form-item prop="dlrk" label="登录入口">
          <el-select v-model="editForm.dlrk" @change="changeIndex()" placeholder="请选择">
            <el-option v-for="(item,i) in entryOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="menuId" label="默认中心">
          <el-select v-model="editForm.menuId" :disabled="editForm.dlrk!=='DLRK_PT'" placeholder="请选择">
            <el-option v-for="(item,i) in menuOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item prop="sjqxkz" label="数据等级">
          <el-select v-model="editForm.sjqxkz" placeholder="请选择">
            <el-option v-for="(item,i) in leveOps" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <!-- <el-col :span="12" v-if="dictList &&　dictList['SLZX']">
    <el-form-item prop="slzx" label="所属中心">
      <el-select v-model="editForm.slzx" placeholder="请选择">
        <el-option v-for="(item,i) in dictList['SLZX']" :key="i" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
  </el-col> -->

      <el-col :span="12">
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.user-form {
    .other-org-box {
        &:before {
            content: '*';
            color: #ff4949;
            margin-right: 4px;
            position: absolute;
            top: 10px;
            left: 10px;
        }
        .el-select,
        span {
            margin-right: 10px;
        }
        .el-button {
            padding: 3px;
        }
    }
    .face {
        width: 120px;
        height: 150px;
        margin: 0 auto;
        .el-upload--picture-card {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
<style lang="scss">
.face {
    .el-upload--picture-card {
        width: 120px;
        height: 150px;
        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { FETCH_SYS_MENU, GET_SYS_USER_INFO, ADD_SYS_USER, UPDATE_SYS_USER, CHECK_USER, GET_PERSON_INFO_FROM_MAIN_DATA } from '../../../store/types'
import dataImage from '../../../widgets/data-image/data-image'
import mixin from '../../../utils/mixin'
import upload from '../../../widgets/upload/upload.vue'

import { arrayGetRid, clone, getTopNexus } from '../../../utils/util'

export default {
  mixins: [mixin],
  components: {
    'data-image': dataImage,
    upload
  },
  data: () => ({
    checkArr: { color: '', text: '' },
    checkArr2: { color: '', text: '' },
    isFormalSubmit: false,
    isSubmitName: false,
    isSubmitIDcard: false,
    isPhoto: false,
    currentFiles: [], // 当前文件集合
    editForm: {
      face: '',
      zxid: '',
      username: '',
      password: '',
      code: '',
      gwbs: '',
      zwjb: '',
      loginauthorities: '3',
      email: '',
      xm: '',
      gmsfhm: '',
      mobile: '',
      orgname: '',
      dllx: '1',
      roleIdList: [],
      orgIdList: [],
      orgId: '',
      status: '1',
      sjqxkz: '4',
      slzx: '',
      dlrk: 'DLRK_4X',
      menuId: '',
      otherOrgList: []
    },
    rules: {
      username: [{
        required: true,
        message: '请输入用户名'
      }],
      password: [{
        required: true,
        message: '请输入密码'
      }],
      xm: [{
        required: true,
        message: '请输入姓名'
      }],
      //      email: [{
      //        required: true,
      //        message: '请输入电子邮箱'
      //      }],
      gmsfhm: [{
        required: true,
        message: '请输入身份证号码'
      }],
      //      mobile: [{
      //        required: true,
      //        message: '请输入手机号码'
      //      }],
      org: [{
        required: true,
        message: '请选择组织'
      }],
      loginauthorities: [{
        required: true,
        message: '请选择登录方式'
      }],
      menuId: [{
        required: false,
        message: '请选择默认中心'
      }],
      dlrk: [{
        required: true,
        message: '请选择登录入口'
      }],
      sjqxkz: [{
        required: true,
        message: '请选择数据等级'
      }],
      dllx: [{
        required: true,
        message: '请选登录类型'
      }]
    },
    loginTypeOps: [
      { value: '1', label: '用户名登录' }, { value: '2', label: 'PKI登录' }, { value: '3', label: '用户名或PKI登录' }
    ],
    leveOps: [
      { value: '1', label: '一级' }, { value: '2', label: '二级' }, { value: '3', label: '三级' }, { value: '4', label: '四级' }
    ],
    entryOps: [
      { value: 'DLRK_4X', label: '中心首页' }, { value: 'DLRK_PT', label: '工作平台' }, { value: 'DLRK_HT', label: '后台管理' }
    ],
    menuOps: [],
    roleTree: [],
    orgTree: [],
    orgTreeList: [],
    treeProps: {
      children: 'children',
      label: 'name',
      value: 'orgId'
    }
  }),
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['users', 'orgs', 'baseData'])
  },
  methods: {
    initDialog() {
      this.isSubmitIDcard = false
      this.isSubmitName = false
      this.isPhoto = false
      // if(!this.dictList) {
      // }
      this.reset()
      if(this.id !== '') {
        this.dispatch(GET_SYS_USER_INFO, { userId: this.id }).then(() => {
          let resForm = clone(this.users.sysUserInfo)
          if(!resForm.roleIdList) {
            resForm.roleIdList = []
          }
          if(resForm.otherorgList && resForm.otherorgList.length > 0) {
            resForm['otherOrgList'] = [...resForm.otherorgList]
            resForm.otherOrgList.forEach(o => {
              o.zx = '3'
              if(o.orgIds !== '') {
                o.orgIds = JSON.parse(o.orgIds)
                o.isMain = o.orgid === resForm.orgId
                o.isCenter = o.orgid === resForm.zxid
                if(o.isMain) { // 主单位
                  o.zx = '1'
                } else if(o.isCenter) { // 主中心
                  o.zx = '2'
                } else { // 其他
                  o.zx = '3'
                }
              } else {

              }
            })
          } else {
            resForm.otherOrgList = []
          }
          if(resForm.otherOrgList.length === 0) {
            resForm.otherOrgList.unshift({
              isMain: true,
              isCenter: false,
              orgIds: getTopNexus(this.orgTreeList, resForm.orgId, {
                id: 'orgId',
                children: 'children',
                parentId: 'parentId'
              }), // [resForm.orgId],
              orgId: resForm.orgId || '',
              zwjb: resForm.zwjb || '',
              zwjbmc: ''
            })
          }
          if(resForm.dlrk !== 'DLRK_PT') {
            resForm.menuId = ''
          }
          if(resForm.face !== '' && resForm.face !== null) {
            this.currentFiles.push({ id: resForm.face, name: '' })
          }
          this.editForm = clone(resForm)
          // this.editForm.zxid = resForm.zxid || ''
          // console.log(this.editForm.Center, '初始化');
        })
      } else {
        this.addOrg()
      }
    },
    addOrg() {
      this.editForm.otherOrgList.push({
        isMain: false,
        isCenter: false,
        orgIds: [], // [this.userOrgInfo.mainOrgId],
        orgId: '',
        zwjb: '',
        zwjbmc: ''
      })
    },
    updateOrgItem(orgId, index) {
      this.editForm.otherOrgList.forEach(d => {
        if(d.orgIds[d.orgIds.length - 1] === orgId && d !== this.editForm.otherOrgList[index]) {
          this.$message('该单位已被选择，请选择其它单位', '温馨提示')
          this.editForm.otherOrgList[index].orgIds = []
          return false
        }
      })
      //        this.updateMainOrg(orgId)
      //        this.updateCenter(orgId)
    },
    updateMainOrg(orgId) {
      //        console.log('修改', this.editForm.otherOrgList)
      this.editForm.otherOrgList.filter(d => d.orgIds[d.orgIds.length - 1] !== orgId).forEach(d => {
        d.isMain = false
      })
    },
    updateCenter(orgId) {
      this.editForm.otherOrgList.filter(d => d.orgIds[d.orgIds.length - 1] !== orgId).forEach(d => {
        d.isCenter = false
      })
    },
    removeOrg(item) {
      arrayGetRid(this.editForm.otherOrgList, [item])
    },
    reset() {
      this.checkArr = { color: '', text: '' }
      this.checkArr2 = { color: '', text: '' }
      this.isFormalSubmit = false
      this.currentFiles = []
      this.editForm.face = ''
      this.editForm.roleIdList = []
      this.editForm.otherOrgList = []
      if(this.$refs.editForm) {
        this.$refs.editForm.resetFields()
      }
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if(f.Status === 1) { // 文件更新保存成功后提交
        this.currentFiles.push({
          name: f.data.fileList[0].name,
          id: f.data.fileList[0].response.Data.ID
        })
        this.editForm.face = f.data.res.Data.ID
      }
    },
    closeEvent() {
      this.reset()
      this.$emit('close')
    },
    submit() {
      console.log('保存标志', this.editForm.id);
      let checkOrgList = true
      this.$refs.editForm.validate((valid) => {
        if(valid === true) {
          if(!(this.isSubmitName && this.isSubmitIDcard) && this.editForm.id) {
            this.$alert('请正确填写用户名及身份证格式', '温馨提示')
            return false
          }
          this.editForm.zxid = ''
          this.editForm.orgId = ''
          this.editForm.orgIdList = []
          this.editForm.otherorgList = []
          this.editForm.userId = this.id
          this.editForm.otherOrgList.forEach((d, i) => {
            if(d.orgIds.length > 0) {
              if(d.zwjb === '') {
                checkOrgList = false
                return false
              } else {
                d.orgId = d.orgIds[d.orgIds.length - 1]
                d.zwjbmc = this.dictList['ZJ'].find(z => z.value === d.zwjb).label

                if(d.isMain === true) {
                  this.editForm.orgId = d.orgId
                  this.editForm.orgIdList = [d.orgId]
                }

                if(d.isCenter === true) {
                  this.editForm.zxid = d.orgId
                }
              }
            } else {
              checkOrgList = false
              return false
            }
          })
          if(checkOrgList === false) {
            this.$alert('必需同时选择 单位 和 职务级别', '温馨提示');
            return false
          }
          // if (this.editForm.zxid === '' || this.editForm.orgId === '') {
          //   this.$alert('必需选择 主单位 和 中心', '温馨提示')
          //   return false
          // }
          if(this.editForm.orgId === '') {
            this.$alert('必需选择 主单位', '温馨提示')
            return false
          }
          if(this.editForm.dlrk === 'DLRK_4X') {
            this.editForm.menuId = 'D572AF92ED9340EE992286CDF71607DA'
          } else if(this.editForm.dlrk === 'DLRK_HT') {
            this.editForm.menuId = '1'
          }

          this.editForm.otherorgList = this.editForm.otherOrgList

          this.dispatch(this.id !== '' ? UPDATE_SYS_USER : ADD_SYS_USER, this.editForm).then(() => {
            this.$alert('保存成功', '操作成功')
            this.$emit('success')
          })
        }
      })
    },
    checkUserName() {
      if(/^[a-zA-Z0-9_]{4,16}$/.test(this.editForm.username)) {
        this.isSubmitName = false
      } else {
        this.isSubmitName = false
        this.checkArr.color = 'color: #E6A23C'
        this.checkArr.text = '请输入4-16位字母、数字、下划线组成的用户名'
      }
    },
    remoteCheckUserName() {
      if(/^[a-zA-Z0-9_]{4,16}$/.test(this.editForm.username)) {
        this.dispatch(CHECK_USER, { username: this.editForm.username }).then(() => {
          if(this.users.checkUser === 0) {
            // this.checkArr.color = 'color: #67C23A'
            // this.checkArr.text = '用户名可用'
            this.isSubmitName = true
          } else {
            this.checkArr.color = 'color: #F56C6C'
            this.checkArr.text = '该用户名已存在'
            this.isSubmitName = false
          }
        })
      } else {
        this.isSubmitName = false
        this.checkArr.color = 'color: #E6A23C'
        this.checkArr.text = '请输入4-16位字母、数字、下划线组成的用户名'
      }
    },
    checkIDcard() {
      if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.editForm.gmsfhm)) {
        this.checkArr2.color = ''
        this.checkArr2.text = ''
        this.isSubmitIDcard = false
      } else {
        this.isPhoto = false
        this.checkArr2.color = 'color: #99A9BF'
        this.checkArr2.text = '请输入15或18位有效身份证号'
        this.isSubmitIDcard = false
      }
    },
    remoteCheckIDcard() {
      if(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.editForm.gmsfhm)) {
        this.dispatch(CHECK_USER, { sfz: this.editForm.gmsfhm }).then(() => {
          this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, { sfzh: this.editForm.gmsfhm }).then(() => {
            if(this.baseData.personInfo) {
              this.editForm.xm = this.baseData.personInfo.xp.XM
              if(this.users.checkUser === 0) {
                this.isPhoto = true
                this.isSubmitIDcard = true
              } else {
                this.checkArr2.color = 'color: #F56C6C'
                this.checkArr2.text = '该身份证已绑定其他用户'
                this.isSubmitIDcard = false
              }
            } else {
              this.isPhoto = false
              this.checkArr2.color = 'color: #E6A23C'
              this.checkArr2.text = '该证件号缺少有效数据'
              this.isSubmitIDcard = true
            }
          })
        })
      } else {
        this.checkArr2.color = 'color: #99A9BF'
        this.checkArr2.text = '请输入15或18位有效身份证号'
        this.isSubmitIDcard = false
      }
    },
    changeIndex() {
      console.log('登录入口改变', this.editForm.dlrk)
      if(this.editForm.dlrk === 'DLRK_PT') {
        this.rules.menuId[0].required = true
      } else {
        this.rules.menuId[0].required = false
      }
    }
  },
  mounted() {
    this.getRuleOrgTree('', true).then(d => {
      this.orgTree = d.map
      this.orgTreeList = d.list
    })

    this.dispatch(FETCH_SYS_MENU).then(() => {
      this.menuOps = this.$store.getters.menuTree[0].children.filter(d => d.type === 0).map(d => {
        return { value: d.menuId, label: d.name }
      })
    })
  },
  created() {
    this.getDict(['GW', 'ZJ', 'SLZX'], true).then(res => {
      this.dictList = res;
    })
  }
}
</script>
