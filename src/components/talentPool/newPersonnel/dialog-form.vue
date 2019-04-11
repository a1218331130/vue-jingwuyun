<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="警务人才录入" :loading="loading" :modal-append-to-body="true" :append-to-body="true" size="large" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-form :model="form" ref="form" label-width="100px" :rules="rules">
    <el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="" prop="PhotosId" style="margin-left=0px">
            <div class="wrap-box__content">
              <input type="hidden" v-model="form.PhotosId" />
              <upload uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" prop="RyName" style="width:100%">
                <el-input :maxlength="50" v-model="form.RyName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="身份证" prop="Sfz">
                <el-input :maxlength="50" placeholder="请输入身份证" v-model="form.Sfz"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="Sex">
                <el-select v-model="form.Sex" placeholder="请选择性别" style="width:100%">
                  <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="单位" prop="Org">
                <el-input :maxlength="50" v-model="form.Org" placeholder="请输入所在单位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门" prop="Dept">
                <el-input :maxlength="50" v-model="form.Dept" placeholder="请输入所在部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="职务" prop="Post">
                <el-input :maxlength="50" v-model="form.Post" placeholder="请输入当前职务"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="法律职务" prop="Duty">
                <el-select v-model="form.Duty" placeholder="请选择法律职务" style="width:100%">
                  <el-option v-for="(item,i) in dictList['JZLX']" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检察官等级" prop="Level">
                <el-select v-model="form.Level" placeholder="请选择检察官等级" filterable style="width:100%">
                  <el-option v-for="item in dictList['JWDJ']" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="学历" prop="Education">
                <el-select v-model="form.Education" placeholder="请选择学历" filterable style="width:100%">
                  <el-option v-for="item in dictList['XL']" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="侦查技能" prop="skill">
                <el-input :maxlength="50" v-model="form.skill" placeholder="请输入当前职务"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="地区" prop="Area">
                <el-select v-model="form.Area" placeholder="请选择地区" filterable style="width:100%">
                  <el-option v-for="item in dictList['XZQHDM']" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="Birthday" label="出生日期" style="width:100%">
                <el-date-picker v-model="form.Birthday" placeholder="请输入出生日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="telPhone" label="手机号码">
            <el-input v-model="form.telPhone" placeholder="请输入手机号码，如多个请用逗号隔开"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="email" label="Email">
            <el-input v-model="form.email" placeholder="请输入邮箱地址，如多个请用逗号隔开"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item prop="decs" label="基本情况">
            <el-input type="textarea" v-model="form.decs" placeholder="请输入基本情况"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-row>
    <el-row>
      <el-col :span="24">技能图谱</el-col>
    </el-row>
    <el-row style="padding:10px">
      <el-table :data="tableData" style="width:100%">
        <el-table-column align="center" label="序号" prop="index" width="100px"></el-table-column>
        <el-table-column align="center" label="技能名称" prop="skillname" style="width:35%"></el-table-column>
        <el-table-column align="center" label="技能最大值" prop="max" style="width:30%"></el-table-column>
        <el-table-column align="center" label="技能评分" prop="score" style="width:25%">
          <template scope="scope">
              <el-input-number v-model="scope.row.score" placeholder="0~max" type="num" :step="1":min="0" :max="parseInt(scope.row.max)"  @change=""></el-input-number>
            </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="padding:5px 0px;margin-top:10px">
      <el-col :span="23">工作经历</el-col>
      <el-col :span="1">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="newEdit(1)">申请
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="experience" style="width:100%">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="开始时间" prop="startTime" style="width:10%"></el-table-column>
        <el-table-column align="center" label="结束时间" prop="endTime" style="width:10%"></el-table-column>
        <el-table-column align="center" label="工作单位" prop="company" style="width:10%"></el-table-column>
        <el-table-column align="center" label="部门" prop="department" style="width:10%"></el-table-column>
        <el-table-column align="center" label="职务" prop="dept" style="width:10%"></el-table-column>
        <el-table-column align="center" label="工作内容" prop="jobcontent" width="309px"></el-table-column>
        <el-table-column align="center" label="操作" style="width:10%">
          <template scope="scope">
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="openDialog(1,scope.row,scope.$index)">编辑
              </el-button>
              <el-button type="primary" size="mini" @click="remove(experience,[scope.row])" icon="icon iconfont icon-brush" ref="delete">删除
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="padding:5px 0px;margin-top:10px">
      <el-col :span="23">学历情况</el-col>
      <el-col :span="1">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="newEdit(2)">申请
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="EducationBackground" style="width:100%">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="入学时间" prop="beginTime" style="width:10%"></el-table-column>
        <el-table-column align="center" label="毕业时间" prop="endTime" style="width:10%"></el-table-column>
        <el-table-column align="center" label="学校" prop="school" style="width:10%"></el-table-column>
        <el-table-column align="center" label="学历" prop="education" style="width:10%"></el-table-column>
        <el-table-column align="center" label="专业" prop="major" style="width:10%"></el-table-column>
        <el-table-column align="center" label="专业描述" prop="decs" width="309px"></el-table-column>
        <el-table-column align="center" label="操作" style="width:10%">
          <template scope="scope">
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="openDialog(2,scope.row,scope.$index)">编辑
              </el-button>
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="remove(EducationBackground,[scope.row])">删除
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row style="padding:5px 0px;margin-top:10px">
      <el-col :span="23">主要业绩</el-col>
      <el-col :span="1">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="newEdit(3)">申请
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="achievement" style="width:100%">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="标题" prop="title" style="width:18%"></el-table-column>
        <el-table-column align="center" label="机关单位" prop="company" style="width:18%"></el-table-column>
        <el-table-column align="center" label="时间" prop="time" style="width:18%"></el-table-column>
        <el-table-column align="center" label="专业描述" prop="decs" width="409px"></el-table-column>
        <el-table-column align="center" label="操作" style="width:18%">
          <template scope="scope">
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="openDialog(3,scope.row,scope.$index)">编辑
              </el-button>
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="remove(achievement,[scope.row])">删除
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row style="padding:5px 0px;margin-top:10px">
      <el-col :span="23">主要奖惩情况</el-col>
      <el-col :span="1">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="newEdit(4)">申请
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="rewardpunishment" style="width:100%">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="标题" prop="title" style="width:18%"></el-table-column>
        <el-table-column align="center" label="机关单位" prop="company" style="width:18%"></el-table-column>
        <el-table-column align="center" label="时间" prop="time" style="width:18%"></el-table-column>
        <el-table-column align="center" label="专业描述" prop="decs" width="409px"></el-table-column>
        <el-table-column align="center" label="操作" style="width:18%">
          <template scope="scope">
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="openDialog(4,scope.row,scope.$index)">编辑
              </el-button>
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="remove(rewardpunishment,[scope.row])">删除
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="padding:5px 0px;margin-top:10px">
      <el-col :span="23">主要奖惩情况</el-col>
      <el-col :span="1">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="newEdit(4)">申请
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="rewardpunishment" style="width:100%">
        <el-table-column align="center" label="序号" type="index" width="80px"></el-table-column>
        <el-table-column align="center" label="标题" prop="title" style="width:18%"></el-table-column>
        <el-table-column align="center" label="机关单位" prop="company" style="width:18%"></el-table-column>
        <el-table-column align="center" label="时间" prop="time" style="width:18%"></el-table-column>
        <el-table-column align="center" label="专业描述" prop="decs" width="409px"></el-table-column>
        <el-table-column align="center" label="操作" style="width:18%">
          <template scope="scope">
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="openDialog(4,scope.row,scope.$index)">编辑
              </el-button>
              <el-button type="primary" size="mini" @click="" icon="icon iconfont icon-brush" @click="remove(rewardpunishment,[scope.row])">删除
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-row>

  </el-form>

  <workExperience :dialog="workExperiencedialog" @close="workExperiencedialog=false" @workExp="getExperience" @remove='removeThisRow' :value="work" :mark="workmark"></workExperience>
  <educationalDialog :dialog="educationDialog" @close="educationDialog=false" @workExp="getEduc" @remove='removeEduc' :value="educ" :mark="educMark"></educationalDialog>
  <performance :dialog="performanceDialog" @close="performanceDialog=false" @workExp="getPerfero" @remove='removePerfero' :value="perfor" :mark="perforMark"></performance>
  <rewardAndPunishment :dialog="rewardAndPunishmentDialog" @close="rewardAndPunishmentDialog=false" @workExp="getRaP" @remove="removeRaP" :value="rap" :mark="rapMark"></rewardAndPunishment>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.wrap-box__content {
    width: 200px;
}
.el-form-item__content {
    margin-left: 0;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { arrayGetRid } from '../../../utils/util'
import '../../../utils/dateFormat'
import upload from '../../../widgets/upload/upload.vue'
import workExperience from './detailtable/workExperience'
import educationalDialog from './detailtable/educationalDialog'
import performance from './detailtable/performance'
import rewardAndPunishment from './detailtable/rewardAndPunishment'
import { GET_TALENT_POOL_SKILL_LIST, ADD_TALENT_POOL } from '../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {
    upload,
    workExperience,
    educationalDialog,
    performance,
    rewardAndPunishment
  },
  props: ['dialog'],
  data() {
    return {
      workExperiencedialog: false,
      work: [],
      workmark: '',
      performanceDialog: false,
      perfor: [],
      perforMark: '',
      educationDialog: false,
      educ: [],
      educMark: '',
      rewardAndPunishmentDialog: false,
      rap: [],
      rapMark: '',
      isFormalSubmit: true,
      currentFiles: [],

      tableData: [{
        index: '0',
        skillname: '抄罚单',
        max: '100',
        score: 1
      }],
      experience: [{
        startTime: '2017-11-20',
        endTime: '2017-11.21',
        company: '怀化市公安',
        department: '侦查部',
        dept: '刑警',
        jobcontent: '抄罚单'
      }],
      EducationBackground: [{
        beginTime: '2017-11-20',
        endTime: '2017-11-20',
        education: '出租',
        school: '湖南警校',
        major: '交通管理',
        decs: '抄罚单'
      }],
      achievement: [{
        title: '日抄罚单200张',
        company: '怀化市公安局',
        time: '2017-11-20',
        decs: '一天之内抄了200张罚单'
      }],
      rewardpunishment: [{
        title: '抄罚单冠军',
        company: '怀化市公安局',
        time: '2017-11-20',
        decs: '破记录啦'
      }],
      dictList: [],
      sexList: [{
        value: '1',
        label: '男'
      }, {
        value: '0',
        label: '女'
      }],
      rules: {
        RyName: {
          required: 'true',
          message: '请输入姓名'
        },
        Sfz: {
          required: 'true',
          message: '请输入身份证号'
        }
      },
      form: {
        RyName: '',
        Sfz: '',
        Sex: '',
        Org: '',
        Dept: '',
        Duty: '',
        Area: '',
        Education: '',
        Level: '',
        Post: '',
        PhotosId: '',
        skill: '',
        Birthday: '',
        telPhone: '',
        email: '',
        decs: '',
        Thumb: '',
        ThumbModel: '',
        skilltree: [],
        SubYjList: [],
        SubJcqkList: [],
        SubGzjlList: [],
        SubXlList: []
      }
    }
  },
  computed: {
    ...mapState(['talentPoolSkill'])
  },
  methods: {
    initDialog() {
      // this.getSkillList()
      this.form = {
        RyName: '',
        Sfz: '',
        Sex: '',
        Org: '',
        Dept: '',
        Duty: '',
        Area: '',
        Education: '',
        Level: '',
        Post: '',
        PhotosId: '',
        skill: '',
        Birthday: '',
        telPhone: '',
        email: '',
        decs: '',
        Thumb: '',
        ThumbModel: '',
        skilltree: [],
        SubYjList: [],
        SubJcqkList: [],
        SubGzjlList: [],
        SubXlList: []
      }
      this.experience = []
      this.EducationBackground = []
      this.achievement = []
      this.rewardpunishment = []
      this.currentFiles = []
    },
    newEdit(type) {
      if (type === 1) {
        this.workExperiencedialog = true
        this.work = ''
      }
      if (type === 2) {
        this.educationDialog = true
        this.educ = ''
      }
      if (type === 3) {
        this.performanceDialog = true
        this.perfor = ''
      }
      if (type === 4) {
        this.rewardAndPunishmentDialog = true
        this.rap = ''
      }
    },
    submit() {
      // console.log(this.form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '操作成功',
            showClose: true
          })
          this.getTreeData()
          this.dispatch(ADD_TALENT_POOL, {
            Name: this.form.RyName,
            Org: this.form.Org,
            Dept: this.form.Dept,
            ZwLevel: this.form.Level,
            Post: this.form.Duty,
            Xl: this.form.Education,
            Area: this.form.Area,
            BirthDay: this.dateFormat(new Date(this.form.Birthday), 'yyyy-MM-dd'),
            Info: this.form.decs,
            // Thumb: this.form.Thumb,
            Sfzh: this.form.Sfz,
            Sex: this.form.Sex,
            By1: '',
            By2: '',
            By3: '',
            ThumbModel: '',
            SubJnpfList: this.form.skilltree,
            SubPxList: [{
              Title: '标题222',
              BeginDate: '2017-02-02',
              EndDate: '2017-03-03',
              TrainOrg: '培训单位11',
              TrainInfo: '培训简介'
            }],
            SubDyList: [{
              Title: '标题111',
              SurveyDate: '2017-05-01',
              Journal: '发表刊物',
              Content: '刊物内容哈哈哈'
            }],
            SubYjList: this.form.SubYjList,
            SubJcqkList: this.form.SubJcqkList,
            SubGzjlList: this.form.SubGzjlList,
            SubXlList: this.form.SubXlList,
            SubLxfsList: [{
              Gldm: '',
              GlValue: ''
            }],
            SubJnbList: [{
              Hzdm: '001'
            }, {
              Hzdm: '002'
            }]
          }).then(() => {
            this.$alert('操作已成功提交', '操作成功', {
              confirmButtonText: '确定',
              callback: action => {
                window.location.reload()
              }
            });
          })
          this.closeEvent()
        } else {
          return false
        }
      })
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if (f.Status === 1) { // 文件更新保存成功后提交
        // let fileIdArray = []
        // for (let ii in f.data.fileList) {
        //   fileIdArray.push(f.data.fileList[ii].response.Data.ID)
        //   this.currentFiles.push({
        //     name: f.data.fileList[ii].name,
        //     id: f.data.fileList[ii].response.Data.ID
        //   })
        // }
        // this.form.PhotosId = fileIdArray.join()
        this.form.Thumb = f.data.file.url
        this.form.ThumbModel = f.data.file.name
      }
    },
    closeEvent() {
      this.$emit('close')
    },
    // 警务技能回填table
    getSkillList() {
      this.dispatch(GET_TALENT_POOL_SKILL_LIST, {
        Jnmc: '',
        BeginDate: '',
        EndDate: '',
        PageIndex: 1,
        PageSize: 10
      }).then(() => {
        this.tableData = this.talentPoolSkill.sysSkillList.PageData.map((d, i) => {
          return {
            index: i + 1,
            skillname: d.Jnmc,
            max: d.Pffw,
            score: 0,
            JnId: d.KeyId
          }
        })
      })
    },
    // 小表单数据回填
    getExperience(val) {
      this.experience.push(val)
    },
    removeThisRow(val) {
      // this.$refs.delete.click()
      for (let i = 0; i < this.experience.length; i++) {
        if (i === val.mark) {
          this.experience[i].jobcontent = val.jobcontent
          this.experience[i].startTime = val.startTime
          this.experience[i].endTime = val.endTime
          this.experience[i].department = val.department
          this.experience[i].dept = val.dept
          this.experience[i].jobcontent = val.jobcontent
        }
      }
    },
    getEduc(val) {
      this.EducationBackground.push(val)
    },
    removeEduc(val) {
      for (let i = 0; i < this.EducationBackground.length; i++) {
        if (i === val.mark) {
          this.EducationBackground[i].education = val.education
          this.EducationBackground[i].beginTime = val.beginTime
          this.EducationBackground[i].endTime = val.endTime
          this.EducationBackground[i].school = val.school
          this.EducationBackground[i].major = val.major
          this.EducationBackground[i].decs = val.decs
        }
      }
    },
    getPerfero(val) {
      this.achievement.push(val)
    },
    removePerfero(val) {
      for (let i = 0; i < this.achievement.length; i++) {
        if (i === val.mark) {
          this.achievement[i].title = val.title
          this.achievement[i].company = val.company
          this.achievement[i].time = val.time
          this.achievement[i].decs = val.decs
        }
      }
    },
    getRaP(val) {
      this.rewardpunishment.push(val)
    },
    removeRaP(val) {
      for (let i = 0; i < this.achievement.length; i++) {
        if (i === val.mark) {
          this.rewardpunishment[i].title = val.title
          this.rewardpunishment[i].company = val.company
          this.rewardpunishment[i].time = val.time
          this.rewardpunishment[i].decs = val.decs
        }
      }
    },
    // parent 父级 item一定是个数组
    remove(parent, item) {
      console.log(parent, item)
      this.$confirm('确认删除该人员?', '温馨掘进', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arrayGetRid(parent, item)
      }).catch(() => {});
    },
    // 编辑子列表  定义了四种类型的弹窗
    openDialog(type, val, val2) {
      if (type === 1) {
        this.workExperiencedialog = true
        this.work = val
        this.workmark = val2
      }
      if (type === 2) {
        this.educationDialog = true
        this.educ = val
        this.educMark = val2
      }
      if (type === 3) {
        this.performanceDialog = true
        this.perfor = val
        this.perforMark = val2
      }
      if (type === 4) {
        this.rewardAndPunishmentDialog = true
        this.rap = val
        this.rapMark = val2
      }
    },
    // 获取技能列表
    getTreeData() {
      this.form.skilltree = this.tableData.map(d => {
        return {
          JnId: d.JnId,
          Jnpf: d.score
        }
      })
      this.form.SubYjList = this.achievement.map(d => {
        return {
          Title: d.title,
          BeginDate: d.time,
          Organs: d.company,
          Content: d.decs
        }
      })
      this.form.SubJcqkList = this.rewardpunishment.map(d => {
        return {
          Title: d.title,
          JcDate: d.time,
          Orangs: d.company,
          Content: d.decs
        }
      })
      this.form.SubGzjlList = this.experience.map(d => {
        return {
          BeginDate: d.startTime,
          EndDate: d.endTime,
          Org: d.company,
          Dept: d.department,
          Zw: d.dept,
          Content: d.jobcontent
        }
      })
      this.form.SubXlList = this.EducationBackground.map(d => {
        return {
          BeginDate: d.startTime,
          EndDate: d.endTime,
          School: d.school,
          Xl: d.education,
          Zy: d.major,
          Content: d.decs
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  },
  watch: {},
  created() {
    this.getDict(['XL', 'JWDJ', 'JZLX', 'XZQHDM'], true).then(res => {
      this.dictList = res
    })
    this.getSkillList()
  },
  mounted() {}
}
</script>
