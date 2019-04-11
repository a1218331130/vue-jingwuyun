<template>
<el-dialog v-draggable="dialogDraggableOptions" :title="dialogMode===true?'重点人员编辑':'重点人员注册'" :visible.sync="dialogVisible" size="bigest" @open="start">
  <el-form :model="form" label-width="100px" ref="form" :rules="rules" style="padding:0 10px" v-loading="dictLoading">
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="照片" prop="PhotosId">
          <div class="wrap-box__content">
            <input type="hidden" v-model="form.PhotosId" />
            <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="RyName">
              <el-input :maxlength="50" v-model="form.RyName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="Sfz">
              <el-input :maxlength="50" @blur="GetPersonInfo()" v-model="form.Sfz"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="人员类型" prop="RyType">
              <el-select :maxlength="50" v-model="form.RyType" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in RyTypeList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="人员等级" prop="Level">
              <el-select :maxlength="50" v-model="form.Level" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="item in LevelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采集单位" prop="CollectDep">
              <el-select :maxlength="50" @change="GetSysOrgDictTree(form.CollectDept)" v-model="form.CollectDept" filterable placeholder="请选择" style="width: 100%">
                <el-option v-for="(item,index) in ruleDeptList" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管辖单位" prop="CollectDeptArr">
              <el-cascader :maxlength="50" :show-all-levels="false" :filterable="true" v-model="form.CollectDeptArr" :options="CollectDeptList" :clearable="true" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true" expand-trigger="click"
                style="width: 100%"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="绰号" prop="ByName">
          <el-input :maxlength="50" v-model="form.ByName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="民族" prop="Nation">
          <el-select :maxlength="50" v-model="form.Nation" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in NationList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="户籍地址" prop="CensusAddr">
          <el-input :maxlength="50" v-model="form.CensusAddr"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="管控状态" prop="CtrlStatus">
          <el-select :maxlength="50" v-model="form.CtrlStatus" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="(item,index) in CtrlStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="性别" prop="Sex">
          <el-select :maxlength="50" v-model="form.Sex" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in sexList" :label="item.label" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="PhoneNum">
          <el-input :maxlength="50" v-model="form.PhoneNum"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="人员籍贯" prop="NativeArr">
          <el-cascader :maxlength="50" :show-all-levels="false" :filterable="true" v-model="NativeArr" :options="NativeList" :props="{children:'children',value:'id',label:'label'}" :clearable="true" :change-on-select="true" expand-trigger="click" style="width: 100%"></el-cascader>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="职业" prop="Career">
          <el-input :maxlength="50" v-model="form.Career"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="现住地址" prop="LivingAddr">
          <el-input :maxlength="50" v-model="form.LivingAddr"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="婚姻状况" prop="MaritalStatus">
          <el-select :maxlength="50" v-model="form.MaritalStatus" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in MaritalStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="出生日期" prop="Birthday">
          <el-date-picker :maxlength="50" v-model="form.Birthday" placeholder="请选择" style="width: 100%"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="出生地址" prop="BornAddr">
          <el-input :maxlength="50" v-model="form.BornAddr"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="体貌特征" prop="PhyCharacter">
          <el-input :maxlength="50" v-model="form.PhyCharacter"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="是否置业" prop="BuyHouse">
          <el-select :maxlength="50" v-model="form.BuyHouse" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in BuyHouseList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="置业地址" prop="HouseAddr">
          <el-input :maxlength="50" v-model="form.HouseAddr"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="8">
        <el-form-item label="是否购车" prop="BuyCar">
          <el-select :maxlength="50" v-model="form.BuyCar" filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in BuyCarList" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="车牌号码" prop="PlateNo">
          <el-input :maxlength="50" v-model="form.PlateNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="经济状况" prop="EconomicStatus">
          <el-input :maxlength="50" v-model="form.EconomicStatus"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="走访内容" prop="VisitTask">
          <el-input type="textarea" placeholder="限制500个字符" :maxlength="500" v-model="form.VisitTask"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="管控事由" prop="CtrlReason">
          <el-input type="textarea" placeholder="限制500个字符" :maxlength="500" v-model="form.CtrlReason"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="备注" prop="Note">
          <el-input type="textarea" placeholder="限制500个字符" :maxlength="500" v-model="form.Note"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button @click="reset('form')">重置</el-button>
    <el-button type="primary" @click="submitForm('form')">确定</el-button>
  </div>
</el-dialog>
</template>

<style scoped>


</style>
<script>
// 姓名、证件号码（必填）、绰号、性别、民族、户籍地、联系电话、职业、现住地址、婚姻状况、人员类型、人员等级、管辖单位、管控等级、
// 现居地经度、现居地纬度、人员籍贯、人员照片附件ID、户籍地址、出生日期、出生地址、是否购车、是否置业、民警走访内容、
// 经济状况、体貌特征、车牌号码、置业地址、管控事由、备注。
import mixin from '../../../utils/mixin'
import upload from '../../../widgets/upload/upload.vue'
import {
  ADD_FOCUS_PERSON,
  EDIT_FOCUS_PERSON,
  GET_PERSON_BY_ID,
  PERSON_INFO,
  GET_CHECK_PERSON_BY_SFZ,
  FETCH_SYS_ORG_BY_CURRY_ORG
} from '../../../store/types'
import { mapState } from 'vuex'
import { listToTree } from '../../../utils/listToTree'
import { getTopNexus } from '../../../utils/util'
import bus from '../../../utils/bus'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      keyId: '',
      isFormalSubmit: false,
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
      CtrlStatusList: [ // 管控状态，0：正常在控，1：撤销管控，2：失控，3：其它
        { label: '正常在控', value: '0' },
        { label: '失控', value: '1' },
        { label: '其它', value: '2' }
      ], // 管控等级
      RyTypeList: [], // 人员类型
      LevelList: [], // 人员等级
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
        Sfz: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        RyType: [
          { required: true, message: '选择人员类型', trigger: 'blur' }
        ],
        Level: [
          { required: true, message: '选择人员等级', trigger: 'blur' }
        ]
      }
    }
  },
  props: {},
  methods: {
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
      if(this.form.Sfz !== '') {
        /**
         * [Sfz 判断重点人员是否存在]
         * @type {[type]}
         */
        this.dispatch(GET_CHECK_PERSON_BY_SFZ, { Sfz: this.form.Sfz }).then(d => {
          /**
           * [Sfz 获取重点人员基本信息]
           * @type {[type]}
           */
          this.dispatch(PERSON_INFO, { zjhm: this.form.Sfz }).then(d => {
            if(this.dossier.PersonInfo !== null) {
              this.form = {
                CollectDeptArr: [], // 选中管辖单位
                Sfz: this.dossier.PersonInfo.zjhm, // 身份证
                RyName: this.dossier.PersonInfo.xm, // 姓名
                ByName: this.dossier.PersonInfo.bmch, // 绰号
                Sex: this.dossier.PersonInfo.xbdm, // 性别
                Nation: this.dossier.PersonInfo.mzdm, // 民族
                CensusAddr: this.dossier.PersonInfo.hjdz_xzqh, // 户籍地址
                PhoneNum: '', // 联系电话
                Career: this.dossier.PersonInfo.zy, // 职业
                LivingAddr: this.dossier.PersonInfo.xzz_dzmc, // 现住地址
                MaritalStatus: this.dossier.PersonInfo.jyzk, // 婚姻状况
                RyType: this.FocusType, // 人员类型
                Level: '100003', // 人员等级
                RyTypeName: '', // 人员类型名称
                LevelName: '', // 人员等级名称
                CollectDept: this.userOrgInfo.mainOrg.DeptNo, // 采集单位
                GxDept: '', // 管辖单位
                CtrlStatus: '0', // 管控状态
                Longitude: '', // 现居地经度
                Latitude: '', // 现居地纬度
                Native: this.dossier.PersonInfo.jgdm, // 人员籍贯
                PhotosId: '', // 人员照片附件ID（多个用逗号分隔）
                Birthday: this.dossier.PersonInfo.csrq, // 出生日期
                BornAddr: '', // 出生地址
                BuyCar: '', // 是否购车
                BuyHouse: '', // 是否置业
                VisitTask: '', // 民警走访内容
                EconomicStatus: '', // 经济状况
                PhyCharacter: '', // 体貌特征
                PlateNo: '', // 车牌号码
                HouseAddr: '', // 置业地址
                CtrlReason: '', // 管控事由
                Note: '' // 备注
              }
            }
          })
        })
      }
    },
    start() {
      /**
       * 获取字典列表
       */
      if(this.LevelList.length === 0) {
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
          if(this.keyId !== '') {
            this.getObj()
          }
        })
        /**
         * [res 系统通用字典]
         * @type {[type]}
         */
        this.getDict(['MZDM', 'RYLX', 'RYDJ']).then(res => {
          this.NationList = res['MZDM'] // 民族
          this.RyTypeList = res['RYLX'] // 人员类型
          this.LevelList = res['RYDJ'] // 人员等级
        })
      } else {
        if(this.keyId !== '') {
          this.getObj()
        }
      }
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
        if(this.form.PhotosId !== null && this.form.PhotosId !== '') {
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
      if(this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if(f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = []
        for(let ii in f.data.fileList) {
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
      this.$refs[d].validate(v => {
        if(v) {
          /**
           * [附件上传 description]
           * @param  {[type]} this [description]
           * @return {[type]}      [description]
           */
          // 确认提交[附件]
          if(this.currentFiles.length <= 0) {
            this.form.PhotosId = '' // 重置上传文件id
          }
          this.form.Native = this.NativeArr[this.NativeArr.length - 1]
          this.form.RyTypeName = this.RyTypeList.find(d => d.value === this.form.RyType).label // 人员类型名称
          this.form.LevelName = this.LevelList.find(d => d.value === this.form.Level).label // 人员等级名称
          this.form.GxDept = this.form.CollectDeptArr[this.form.CollectDeptArr.length - 1]
          if(this.form.KeyId) {
            this.dispatch(EDIT_FOCUS_PERSON,
              this.form
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          } else {
            this.dispatch(ADD_FOCUS_PERSON,
              this.form
            ).then(d => {
              this.$message('提交成功！')
              this.dialogVisible = false
              this.$emit('call:change-update')
            })
          }
        } else {
          console.log('请求错误', v)
          return false
        }
      })
    }
  },
  watch: {},
  mounted() {},
  created() {
    bus.$on('control.addHandle', data => {
      this.keyId = ''
      this.FocusType = data
      this.dialogMode = false
      this.form = {
        CollectDeptArr: [], // 选中管辖单位
        RyName: '', // 姓名
        Sfz: '', // 证件号码
        ByName: '', // 绰号
        Sex: '', // 性别
        Nation: '', // 民族
        CensusAddr: '', // 户籍地址
        PhoneNum: '', // 联系电话
        Career: '', // 职业
        LivingAddr: '', // 现住地址
        MaritalStatus: '', // 婚姻状况
        RyType: this.FocusType, // 人员类型
        Level: '100003', // 人员等级
        RyTypeName: '', // 人员类型名称
        LevelName: '', // 人员等级名称
        CollectDept: '', // 采集单位
        GxDept: '', // 管辖单位
        CtrlStatus: '0', // 管控状态
        Longitude: '', // 现居地经度
        Latitude: '', // 现居地纬度
        Native: '', // 人员籍贯
        PhotosId: '', // 人员照片附件ID（多个用逗号分隔）
        Birthday: '', // 出生日期
        BornAddr: '', // 出生地址
        BuyCar: '', // 是否购车
        BuyHouse: '', // 是否置业
        VisitTask: '', // 民警走访内容
        EconomicStatus: '', // 经济状况
        PhyCharacter: '', // 体貌特征
        PlateNo: '', // 车牌号码
        HouseAddr: '', // 置业地址
        CtrlReason: '', // 管控事由
        Note: '' // 备注
      }
      this.dialogVisible = true
    })
    bus.$on('getPeopleXm', data => {
      console.log(data)
    })
  },
  computed: {
    ...mapState(['dict', 'focusPerson', 'dossier', 'users', 'orgs'])
  }
}
</script>
