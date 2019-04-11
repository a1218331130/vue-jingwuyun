<template>
<el-dialog v-draggable="dialogDraggableOptions" title="走访记录" :visible.sync="dialogVisit" :before-close="close" @open="start()" size="bigest">
  <el-table @cell-mouse-enter="cellMouseEnter" :data="visitList" border @row-dblclick="rowDblclick" height="500" v-loading="loading">
    <el-table-column type="index" align="center" label="序号" width="80">
      <template scope="scope">
        {{scope.$index + 1}}
      </template>
    </el-table-column>
    <el-table-column prop="visitName" label="核实民警"></el-table-column>
    <el-table-column prop="visitTime" label="走访时间"></el-table-column>
    <el-table-column prop="visitAddress" label="去往何处"></el-table-column>
    <el-table-column prop="visitDescribe" label="走访描述"></el-table-column>
    <el-table-column label="是否可疑">
      <template scope="scope">
        <span v-if="scope.row.visitDoubtful==='0'">否</span>
        <span v-if="scope.row.visitDoubtful==='1'">是</span>
        <span v-if="scope.row.visitDoubtful==='2'">评估依据不足</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150" v-if="checkRule(personPower[5].methods,true)">
      <template scope="scope">
        <el-button type="primary" size="mini" @click="edit(scope.row)" icon="icon iconfont icon-xiangqing">编辑</el-button>
        <el-button type="danger" size="mini" @click="del(scope.row)" icon="icon iconfont icon-trash">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>
  <div class="visit-add" v-if="isEdit===true">
    <hr>
    <el-form :model="form" label-width="110px" ref="form" :rules="rules" style="padding:10px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="人员姓名" prop="visitName">
            <el-input :maxlength="50" v-model="form.visitName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="visitIdCard">
            <el-input :maxlength="50" v-model="form.visitIdCard" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="核实单位" prop="visitUnit">
            <input type="hidden" v-model="form.visitUnit" />
            <el-cascader @change="GetUserDicts(dictsArr)" :show-all-levels="false" :filterable="true" v-model="dictsArr" :options="getDeptDictsList" :change-on-select="true" :props="{children:'children',value:'code',label:'name'}" expand-trigger="click" style="width:100%"
              :clearable="true"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核实民警" prop="visitPolice">
            <el-select @change="findDictByUser" v-model="form.visitPolice" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in userDictsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="核实地点">
            <el-input :maxlength="50" v-model="form.visitVerifyAddress"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="核实时间">
            <el-date-picker type="date" :maxlength="50" placeholder="选择离开时间" v-model="form.visitTime" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="活动状态">
            <el-select v-model="form.visitActiveState" style="width: 100%">
              <el-option v-for="item in ActStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离开时间">
            <el-date-picker type="date" :maxlength="50" placeholder="选择离开时间" v-model="form.visitLeaveTime" style="width: 100%"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否可疑">
            <el-select v-model="form.visitDoubtful" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in IsSuspiciousList" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="判断依据">
            <el-input type="textarea" placeholder="限制500个字符" :maxlength="500" v-model="form.visitDoubtfulGist"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="走访情况">
            <el-input type="textarea" placeholder="限制500个字符" :maxlength="500" v-model="form.visitDescribe"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="去往何处">
            <el-input type="textarea" placeholder="限制500个字符" :maxlength="500" v-model="form.visitAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="添加附件">
            <div class="wrap-box__content">
              <input type="hidden" v-model="form.visitAccessory" />
              <upload :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles">
                <el-button slot="button" type="primary">上传附件</el-button>
              </upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close" v-if="isEdit===false">关闭</el-button>
    <el-button @click="reset" v-if="isEdit===true">取消</el-button>
    <el-button v-if="checkRule(personPower[5].methods,true)&&isEdit===false" type="primary" @click="edit()">新增</el-button>
    <el-button type="primary" v-if="isEdit===true" @click="submitForm('form')">保存</el-button>
  </div>
</el-dialog>
</template>
<style scoped lang='scss'>
.visit-add {
    margin-top: 30px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 80px);
    background: #fff;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { getTopNexus } from '../../../utils/util'
import {
  GET_PERSON_VISIT_INFO,
  ADD_PERSON_VISIT,
  EDIT_PERSON_VISIT,
  FETCH_USER_DICTS,
  DEL_PERSON_VISIT
} from '../../../store/types'
import { mapState } from 'vuex'
import upload from '../../../widgets/upload/upload.vue'
import pagination from '../../../widgets/pagination/pagination'
export default {
  mixins: [mixin],
  components: {
    pagination,
    upload
  },
  data() {
    return {
      isFormalSubmit: false,
      formItem: {},
      filesObj: {},
      currentFiles: [], // 当前文件集合
      count: 0,
      userDictsList: [], // 采集人员
      getDeptDictsList: [], // 采集单位[树列表]
      getDeptDictsOldList: [], // 采集单位[树列表]
      dictsArr: [], // 采集单位[选中列表]
      ActStatusList: [{ label: '在本县市区', value: '1' }, { label: '离开本县市区', value: '2' }],
      IsSuspiciousList: [{ label: '否', value: '0' }, { label: '是', value: '1' }, { label: '评估依据不足', value: '2' }],
      isEdit: false,
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      listIdUpadate: false,
      rules: {
        visitName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        visitIdCard: [
          { required: true, message: '请输入证件号码', trigger: 'blur' }
        ],
        visitPolice: [
          { required: true, message: '请输入核实民警', trigger: 'blur' }
        ],
        visitUnit: [
          { required: true, message: '请输入核实单位', trigger: 'blur' }
        ]
      },
      form: {},
      visitList: []
    }
  },
  props: ['dialogVisit', 'object', 'personPower'],
  methods: {
    start() {
      this.loading = true
      this.form.visitName = this.object.RyName
      this.form.visitIdCard = this.object.Sfz
      this.form.RyId = this.object.KeyId
      this.dispatch(GET_PERSON_VISIT_INFO, {
        RyId: this.object.KeyId,
        PageIndex: this.pagenav.currentpage,
        PageSize: this.pagenav.limit
      }).then(d => {
        this.visitList = this.personVisit.PageData.map(c => {
          return {
            RyId: c.RyId,
            visitName: c.RyName,
            visitIdCard: c.RySfz,
            visitActiveState: c.ActStatus,
            visitLeaveTime: c.LeavedTime,
            visitDoubtful: c.IsSuspicious,
            visitDoubtfulGist: c.AccordingTo,
            visitPolice: c.VerifyPolice,
            visitUnit: c.VerifyDept,
            visitTime: c.VerifyTime,
            visitAddress: c.GoAddr,
            visitDescribe: c.VisitDescribe,
            visitAccessory: c.FileIds,
            KeyId: c.KeyId,
            FileNames: c.FileNames,
            visitVerifyAddress: c.VerifyAddr
          }
        })
        this.count = this.personVisit.DataCount
        this.loading = false
      })
    },
    close() {
      this.$emit('close')
      this.$emit('call:change-update')
      this.isEdit = false
    },
    findDictByUser(item) {
      if(!item) {} else {
        let keyId = this.userDictsList.find(d => d.value === item).code
        this.dictsArr = getTopNexus(this.getDeptDictsOldList, keyId, {
          id: 'code',
          children: 'children',
          parentId: 'parentId'
        })
        this.form.visitUnit = this.dictsArr[this.dictsArr.length - 1]
      }
    },
    /**
     * [GetUserDicts 获取用户列表]
     * @param {[type]} item [description]
     */
    GetUserDicts(item) {
      let deptNo = this.userOrgInfo.mainOrgId
      if(item) {
        deptNo = item[item.length - 1]
      }
      /**
       * 取用户字典列表
       */
      this.form.visitPolice = ''
      this.dispatch(FETCH_USER_DICTS, { DeptNo: deptNo }, null, true).then(d => {
        this.userDictsList = this.dict.fetchUserDicts.map(c => {
          return {
            label: c.DictName,
            value: c.KeyId,
            code: c.Temp2
          }
        })
      })
      this.form.visitUnit = this.dictsArr[this.dictsArr.length - 1]
    },
    edit(form) {
      /**
       * [getCascaderDict 获取单位列表]
       *
       * @return {[d[0]]} [原始数据列表]
       * @return {[d[1]]} [树列表]
       */
      this.getRuleOrgTree('', true).then(d => {
        this.getDeptDictsList = d.map
        this.getDeptDictsOldList = d.list
      })
      this.GetUserDicts()
      if(form) {
        this.form = form
        let _fId = this.form.visitAccessory ? this.form.visitAccessory.split(',') : this.form.visitAccessory
        let _fName = this.form.FileNames ? this.form.FileNames.split(',') : this.form.FileNames
        // 附件列表数据回填
        this.currentFiles = [] // 上传文件列表 重置
        for(let fi in _fId) {
          this.currentFiles.push({
            name: _fName[fi],
            id: _fId[fi]
          })
        }
        this.dictsArr = getTopNexus(this.getDeptDictsOldList, this.form.visitUnit, {
          id: 'code',
          children: 'children',
          parentId: 'parentId'
        });
      } else {
        this.currentFiles = [] // 上传文件列表 重置
        this.dictsArr = []
        this.form = {
          KeyId: '',
          RyId: this.object.KeyId,
          visitName: this.object.RyName,
          visitIdCard: this.object.Sfz,
          visitActiveState: '',
          visitLeaveTime: '',
          visitDoubtful: '',
          visitDoubtfulGist: '',
          visitPolice: '',
          visitUnit: '',
          visitTime: '',
          visitAddress: '',
          visitVerifyAddress: '',
          visitDescribe: '',
          visitAccessory: '',
          FileNames: ''
        }
      }
      this.isEdit = true
    },
    /**
     * 重置表单
     */
    reset() {
      if(this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.isEdit = false
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if(f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = [],
          _fileNameArray = []
        for(let ii in f.data.fileList) {
          let __fFileId = f.data.fileList[ii].response ? f.data.fileList[ii].response.Data.ID : f.data.fileList[ii].url.split('?id=')[1]
          _fileIdArray.push(__fFileId)
          _fileNameArray.push(f.data.fileList[ii].name)
        }
        this.form.visitAccessory = _fileIdArray.join()
        this.form.FileNames = _fileNameArray.join('|')
      }
      this.isFormalSubmit = false
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
          this.submitFormLoading()
          this.form = {
            RySfz: this.form.visitIdCard, //  重点人员身份证
            RyName: this.form.visitName, // 重点人员姓名
            ActStatus: this.form.visitActiveState, //  活动状态， 1： 在本县市区， 2： 离开本县市区;
            LeavedTime: this.form.visitLeaveTime, //  离开时间
            GoAddr: this.form.visitAddress, //  去往何处
            VisitDescribe: this.form.visitDescribe, // 走访状况描述
            IsSuspicious: this.form.visitDoubtful, // 是否可疑， 0： 否， 1： 是， 2： 评估依据不足
            AccordingTo: this.form.visitDoubtfulGist, // 可疑判断依据
            VerifyPolice: this.form.visitPolice, // 核实民警
            VerifyDept: this.form.visitUnit, // 核实单位
            VerifyAddr: this.form.visitVerifyAddress, // 核实地点
            VerifyTime: this.form.visitTime, // 核实时间
            FileIds: this.form.visitAccessory, // 附件ID,多个用逗号分隔
            FileNames: this.form.FileNames, // 附件名称,多个用逗号分隔
            KeyId: this.form.KeyId, // 走访唯一编号
            RyId: this.form.RyId // 人员id
          }
          if(this.form.KeyId) {
            this.dispatch(EDIT_PERSON_VISIT, this.form).then(d => {
              this.$message('修改成功！')
              this.start()
              this.submitLoading = false
              this.isEdit = false
            }).catch(e => {
              this.submitLoading = false
            })
          } else {
            this.dispatch(ADD_PERSON_VISIT, this.form).then(d => {
              this.$message('提交成功！')
              this.start()
              this.submitLoading = false
              this.isEdit = false
            }).catch(e => {
              this.submitLoading = false
            })
          }
        } else {
          return false
        }
      })
    },
    del(item) {
      this.$confirm('确定要删除该条数据', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dispatch(DEL_PERSON_VISIT, { KeyId: item.KeyId }).then(d => {
          this.$message('删除成功!')
          this.start()
        })
      }).catch(() => {});
    },
    rowDblclick(r, e) {
      // 双击表格行
      // this.isEdit = true
    }
  },
  watch: {
    pagenav: {
      handler() {
        this.start()
      },
      deep: true
    }
  },
  mounted() {},
  created() {},
  computed: {
    ...mapState(['dict', 'personVisit'])
  }
}
</script>
