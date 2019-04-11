<template>
<el-dialog class="title-icon-edit" v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="'添加 '+title" :modal-append-to-body="true" :append-to-body="true" :size="dialogLevel === 2?'bigest':'large--fixed'" :modal="dialogLevel === 2?false:true"
  :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form ref="peopleForm" :rules="peopleFormRules" :model="formItem" label-width="100px">
    <!-- 车辆id 插槽 -->
    <input v-model="formItem.id" type="hidden"></input>
    <!-- 报案人/受害人 -->
    <el-row class="form-box" v-if="this.type===1||this.type===3" :gutter="10" :style="dialogLevel === 2?'':'margin: 0 20px'">
      <el-col>
        <el-row>
          <el-col :span="8">
            <el-form-item label="照片" prop="imageId">
              <div class="wrap-box__content">
                <input type="hidden" v-model="formItem.imageId" />
                <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col :span="24">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formItem.name" placeholder="请输入" :maxlength="20" :disabled="editFlag.name===1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="身份证号" prop="idCard">
                  <el-input v-model="formItem.idCard" placeholder="请输入" icon="search" :on-icon-click="getPersonInfo" :minlength="18" :maxlength="18"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="formItem.sex">
                    <el-radio label="0" :disabled="editFlag.sex===1">未知</el-radio>
                    <el-radio label="1" :disabled="editFlag.sex===1">男</el-radio>
                    <el-radio label="2" :disabled="editFlag.sex===1">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker v-model="formItem.birthday" :editable="false" type="date" style="width: 100%" placeholder="请选择" :picker-options="disabledDateFun" format="yyyy-MM-dd" :disabled="editFlag.birthday===1"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="人员类型" prop="peopleType">
              <el-checkbox-group :min="1" v-model="formItem.peopleType">
                <el-checkbox label="1">报案人</el-checkbox>
                <el-checkbox label="2">受害人</el-checkbox>
                <el-checkbox label="3">证人</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="添加说明">
              <el-input type="textarea" v-model="formItem.remark" placeholder="描述限制150个字符" :maxlength="150" :rows="5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>


    <!-- 嫌疑人 -->
    <el-row class="form-box" v-if="this.type===2" :gutter="10" :style="dialogLevel === 2?'':'margin: 0 20px'">
      <el-col>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="照片">
              <div class="wrap-box__content">
                <input type="hidden" v-model="formItem.imageId" />
                <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formItem.name" placeholder="请输入" :maxlength="20" :disabled="editFlag.name===1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="绰号">
                  <el-input v-model="formItem.nickname" placeholder="请输入" :maxlength="20"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model="formItem.age" type="number" min="0" max="200" placeholder="请输入" :disabled="editFlag.age===1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身高">
                  <el-input v-model="formItem.stature" placeholder="请输入" :maxlength="10" :disabled="editFlag.stature===1"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="身份证号">
                  <el-input v-model="formItem.idCard" placeholder="请输入" icon="search" :on-icon-click="getPersonInfo" :minlength="18" :maxlength="18"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="上级成员">
                  <el-select placeholder="请选择" v-model="formItem.upPeople" :clearable="true" filterable style="width: 100%">
                    <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in upPeopleDictLists" v-if="item.value !== formItem.id" style="width: 100%"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="作案特点" prop="crimeTrait">
              <el-select placeholder="请选择" v-model="formItem.crimeTrait" filterable style="width: 100%">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['ZATDDM']" style="width: 100%"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作案原因" prop="crimeCause">
              <el-select placeholder="请选择" v-model="formItem.crimeCause" filterable style="width: 100%">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['XYRZAYYDM']" style="width: 100%"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作案工具" prop="crimeTool">
              <el-select placeholder="请选择" v-model="formItem.crimeTool" filterable style="width: 100%">
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item,index) in dictLists['ZAGJDM']" style="width: 100%"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="12">
              <el-form-item label="作案手段" prop="crimeMeans">
                <el-select placeholder="请选择" v-model="formItem.crimeMeans" filterable style="width: 100%">
                  <el-option :label="item.label" :value="item.value" :key="index"
                             v-for="(item,index) in dictLists['ZASDLX']" style="width: 100%"></el-option>
                </el-select>
              </el-form-item>
            </el-col>-->
          <el-col :span="12">
            <el-form-item label="体貌特征" prop="formTrait">
              <el-input v-model="formItem.formTrait" placeholder="请输入" :maxlength="100"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="体型">
              <el-input v-model="formItem.bodilyForm" placeholder="请输入" :maxlength="30"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="添加说明">
              <el-input type="textarea" v-model="formItem.remark" placeholder="描述限制50个字符" :maxlength="50" :rows="5"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit" :disabled="loading">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.form-box {
    position: relative;
    &__image {
        width: 110px;
        height: auto;
        position: absolute;
        top: 0;
        right: 30px;
    }
}

.cus-item {
    .el-button {
        font-size: 32px;
        text-align: center;
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding: 0;
        display: block;
    }
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { mapState } from 'vuex'
import upload from '../../../widgets/upload/upload.vue'
import { BASE_64_IMAGE_SAVER } from '../../../config'
import { FETCH_SUSPECT_CASE_PEOPLE_LIST, GET_PERSON_INFO_FROM_MAIN_DATA } from '../../../store/types'
export default {
  mixins: [mixin],
  components: {
    upload
  },
  data() {
    return {
      editFlag: { // 是否可以编辑
        name: 0, // 姓名
        sex: 0, // 性别
        birthday: 0, // 生日
        stature: 0, // 身高
        age: 0 // 年龄
      },
      caseId: '',
      disabledDateFun: { // 出生日期选择范围
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dictLists: [], // 字典集合
      upPeopleDictLists: [], // 嫌疑人列表
      // 表单验证
      peopleFormRules: {
        name: [
          { required: true, message: '姓名不能为空' }
        ],
        sex: [
          { required: true, message: '性别不能为空' }
        ],
        idCard: [
          { required: true, message: '证件号码不能为空' }
        ],
        peopleType: [
          { required: true, message: '人员类型不能为空' }
        ]
      },
      isFormalSubmit: false,
      formItem: {},
      filesObj: {},
      currentFiles: [] // 当前文件集合
    }
  },
  props: ['dialog', 'type', 'data', 'dialogLevel'],
  computed: {
    title() {
      let res = ''
      switch(this.type) {
        case 1:
          res = '报案人/受害人/证人'
          break;
        case 2:
          res = '嫌疑人'
          break;
        case 3: // 案件列表添加使用
          res = '涉案人'
          break;
      }
      return res
    },
    ...mapState(['suspectCasePeople', 'baseData'])
  },
  methods: {
    initDialog() {
      this.loading = false
      this.reset()
      this.isFormalSubmit = false; // 初始化图片上传状态
      this.editFlag = { // 是否可以编辑
        name: 0, // 姓名
        sex: 0, // 性别
        birthday: 0, // 生日
        stature: 0, // 身高
        age: 0 // 年龄
      }
      this.queryDictType()
      this.formItem = {
        id: '',
        name: '',
        idCard: '',
        imageId: '',
        birthday: '',
        remark: '',
        peopleType: ['1'],
        sex: '0'
      }
      if(this.type === 2) {
        this.formItem = {
          id: '',
          name: '',
          upPeople: '',
          idCard: '',
          imageId: '',
          age: '',
          remark: '',
          crimeTrait: '',
          crimeCause: '',
          crimeTool: '',
          crimeMeans: '',
          formTrait: '',
          stature: '',
          bodilyForm: '',
          nickname: ''
        }
      }
      if(this.data !== null) {
        this.formItem = this.data
        if(this.formItem.imageId !== null && this.formItem.imageId !== '') {
          this.currentFiles = [
            {
              name: this.formItem.name,
              id: this.formItem.imageId
            }
          ]
        } else {
          this.currentFiles = []
        }
      } else {
        this.currentFiles = []
      }
    },
    closeEvent() {
      this.$emit('close')
    },
    submit() {
      this.$refs['peopleForm'].validate(vt => {
        if(vt) {
          // 确认提交
          if(this.currentFiles.length <= 0) {
            this.formItem.imageId = '' // 重置上传文件id
          }
          this.formItem.handleType = this.type
          this.loading = true
          this.$emit('update:submit', this.formItem)
        } else {
          return false
        }
      })
    },
    getPersonInfo() {
      let idCard = this.formItem.idCard
      if(!(/\d{17}[\d|x]|\d{15}/).test(idCard) || (idCard.length !== 15 && idCard.length !== 18)) {
        this.$message({
          type: 'error',
          message: '您输入的身份证号码有误，请重新输入。',
          showClose: true
        })
        return false
      }
      this.dispatch(GET_PERSON_INFO_FROM_MAIN_DATA, {
        sfzh: idCard
      }).then(() => {
        let data = this.baseData.personInfo.xp
        console.log(this.baseData.personInfo, 'personInfo');
        this.$http.post(BASE_64_IMAGE_SAVER, {
          data: JSON.stringify({
            Base64: data.XP,
            Filename: data.XM + '_的照片',
            token: this.userData.UserToken
          })
        }, this.httpSettings).then((res) => {
          this.formItem.imageId = ''
          this.currentFiles = []
          if(res.body.Status === 1) {
            this.formItem.imageId = res.body.Data.ID
            this.currentFiles = [
              {
                name: data.XM + '_的照片',
                id: res.body.Data.ID
              }
            ]
          }
        })

        this.formItem.name = data.XM
        this.editFlag.name = data.XM ? 1 : 0 // 判断姓名是否为空
        this.editFlag.sex = data.XB ? 1 : 0 // 判断性别是否为空
        this.editFlag.birthday = data.CSRQ ? 1 : 0 // 判断出生日期是否为空
        this.editFlag.stature = data.SG ? 1 : 0 // 判断身高是否为空
        this.editFlag.age = data.AGE ? 1 : 0 // 判断身高是否为空
        if(this.type === 1 || this.type === 2 || this.type === 3) {
          this.formItem.birthday = data.CSRQ
          this.formItem.sex = data.XB
          this.formItem.age = data.AGE || ''
          this.formItem.stature = data.SG || ''
        } else {
          this.formItem.upPeople = ''
          this.formItem.age = ''
          this.formItem.remark = ''
          this.formItem.crimeTrait = ''
          this.formItem.crimeCause = ''
          this.formItem.crimeTool = ''
          this.formItem.crimeMeans = ''
          this.formItem.formTrait = ''
          this.formItem.stature = ''
          this.formItem.bodilyForm = ''
          this.formItem.nickname = ''
        }
      })
    },
    queryDictType() {
      //  表单字典初始化
      this.getDict(['ZATDDM', 'XYRZAYYDM', 'ZAGJDM', 'ZASDLX']).then(res => {
        this.dictLists = res
      })
      if(!this.suspectCasePeople.PageData || this.suspectCasePeople.PageData.length === 0) {
        this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
          ajid: this.caseId,
          PageIndex: 1,
          PageSize: 10000
        })
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
        this.formItem.imageId = _fileIdArray.join()
      }
    },
    /**
     * 重置表单
     */
    reset() {
      if(this.$refs['peopleFormRules']) {
        this.$refs['peopleFormRules'].resetFields()
      }
    }
  },
  watch: {
    data(val) {
      if(val) {
        this.isFormalSubmit = true;
      }
    },
    'suspectCasePeople.PageData' (val) {
      if(val) {
        this.upPeopleDictLists = val.map(row => {
          return {
            label: row.xm,
            value: row.id
          }
        })
      }
    }
  },
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
  },
  mounted() {}
}
</script>
