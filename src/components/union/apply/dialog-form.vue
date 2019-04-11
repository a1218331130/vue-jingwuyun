<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="协作申请" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row v-loading="loading">
    <el-form ref="editForm" :model="form" :rules="rules" label-width="100px">
      <div class="base-box">
        <el-col :span="24">
          <el-form-item prop="org" label="配侦部门">
            <el-checkbox-group v-model="form.org" @change="checkOrgs">
              <el-checkbox v-for="(org,i) in orgOps" :label="org.title" :key="i">{{org.title}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="caseNo" label="案件编号">
            <el-input v-model="form.caseNo" placeholder="请输入案件编号"></el-input>
            <!-- <el-select v-model="form.caseNo" remote filterable placeholder="请输入案件编号" :remote-method="filterCase" style="width:100%">
                <el-option v-for="ops in caseOps" :key="ops.value" :label="ops.label" :value="ops.value"></el-option>
              </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="tel" label="联系电话">
            <el-input v-model="form.tel" placeholder="请输入联系人电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title" label="协查标题">
            <el-input v-model="form.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span="12">-->
        <!--<el-form-item label="案件名称">-->
        <!--<el-select v-model="form.case" remote filterable placeholder="请输入案件名称" :remote-method="filterCase" style="width:100%">-->
        <!--<el-option v-for="ops in caseOps" :key="ops.id" :label="ops.name" :value="ops.id"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-form-item prop="desc" label="案件摘要">
            <el-input type="textarea" v-model="form.desc" placeholder="请输入摘要"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dictList" prop="level" label="紧急程度">
            <el-radio-group v-model="form.level">
              <el-radio v-for="item in dictList.JJCD" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dictList" prop="collectOrg" label="发起单位">
            <el-select v-model="form.collectOrg" style="width:310px;" placeholder="">
              <el-option v-for="org in currentOrgOps" :key="org.value" :label="org.label" :value="org.value">
                {{org.label}}
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件列表">
            <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="form.files">
              <el-button slot="button" type="primary">上传附件</el-button>
            </upload>
          </el-form-item>
        </el-col>
      </div>
      <el-col :span="24" v-if="tabs.length > 0">
        <div class="org-title">协作单位</div>
        <el-tabs>
          <el-tab-pane v-for="tab in tabs" :key="tab.id" :label="tab.title+'分局'">
            <el-col :span="12">
              <el-form-item prop="dept" label="协办单位">
                <el-select v-if="tab.deptOps.length > 0" v-model="tab.dept" style="width:310px;" placeholder="">
                  <el-option v-for="dept in tab.deptOps" :key="dept.value" :label="dept.label" :value="dept.value">
                    {{dept.label}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="template" label="协作模板">
                <el-select v-model="tab.template" @change="chenageTemple" style="width:310px;" placeholder="">
                  <el-option v-for="item in templateOps" :key="item.value" :label="item.label" :value="item.value">
                    {{item.label}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <quill-editor :options="editorOptions" v-model="tab.content" :content="content" style="margin-bottom:20px;"></quill-editor>
            </el-col>
            <el-col :span="12">
              <el-form-item label="附件列表">
                <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSubSource" @upload:submit="file=>uploadSubSubmit(file,tab)" :currentFiles="tab.files">
                  <el-button slot="button" type="primary">上传附件</el-button>
                </upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="反馈期限">
                <el-input-number v-model="tab.acceptDay" size="small" @change="handleChange" :min="1" :max="365"></el-input-number>
                <span style="margin-left: 10px;">天</span>
                <!--<el-date-picker type="datetime" placeholder=""></el-date-picker>-->
              </el-form-item>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-form>
  </el-row>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="" @click="save(true)">保存草稿</el-button>
    <el-button type="primary" @click="submit(false)">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.el-dialog__body {
    padding: 0;
}

.org-title {
    background: #f6f6f6;
    color: #858585;
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
}

.base-box {
    padding-left: 10px;
    padding-right: 10px;
}

.el-tab-pane {
    padding: 10px;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { mapState } from 'vuex'

import {
  GET_SYS_ORG_TREE_BY_TYPE,
  FETCH_UNION_TEMP,
  ADD_UNION,
  POST_UNION_DRAFT,
  GET_UNION_DETAIL
} from '../../../store/types'

import { quillEditor } from 'vue-quill-editor'
import editor from '../../../utils/editorOptions'
import '../../../utils/dateFormat'

import upload from '../../../widgets/upload/upload.vue'

export default {
  mixins: [mixin, editor],
  components: {
    quillEditor,
    upload
  },
  data() {
    return {
      dictList: null,
      caseOps: [],
      templateOps: [],
      orgOps: [],
      files: [],
      currentOrgOps: [],
      content: '',
      isFormalSubmit: false,
      treeProps: {
        children: 'children',
        label: 'name',
        value: 'orgId'
      },
      attachmentSource: {
        id: '',
        table: ''
      },
      attachmentSubSource: {
        id: '',
        table: ''
      },
      form: {
        caseNo: '',
        caseName: '',
        collectOrg: '',
        tel: '',
        title: '',
        desc: '',
        attachments: [],
        level: '1',
        files: [],
        org: []
      },
      rules: {
        org: [{ type: 'array', required: true, message: '必填选择配侦部门', trigger: 'change' }],
        caseNo: [{ required: true, message: '案件编号不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '协查标题不能为空', trigger: 'blur' }],
        desc: [{ required: true, message: '案件摘要不能为空', trigger: 'blur' }],
        collectOrg: [{ required: true, message: '必填选发起单位', trigger: 'blur' }]
      }
    }
  },
  props: ['dialog', 'id'],
  computed: {
    tabs() {
      return this.form.org.map(m => {
        return this.orgOps.find(d => d.title === m)
      })
    },
    cases() {
      let res = []
      return res
    },
    ...mapState(['union', 'orgs'])
  },
  methods: {
    initDialog() {
      this.isFormalSubmit = false
      if(this.templateOps.length === 0) {
        this.dispatch(FETCH_UNION_TEMP).then(() => {
          this.templateOps = this.union.unionTempList.map((d, i) => {
            return { index: i, label: d.Title, value: d.KeyId, content: d.Content }
          })
        })
      }
      if(this.orgOps.length === 0) {
        this.getDict(['JZLX', 'JJCD']).then(res => {
          this.dictList = res
          res['JZLX'].forEach(d => {
            this.orgOps.push({
              id: d.value,
              title: d.label,
              dept: '',
              template: '',
              content: '',
              acceptDay: 1,
              files: [],
              deptOps: []
            })
          })

          this.initData()
        })
      } else {
        this.initData()
      }
    },
    initData() {
      this.form.collectOrg = this.currentOrgOps[0].value
      if(this.id !== null) {
        this.attachmentSource = {
          id: this.id,
          table: ''
        }
        this.dispatch(GET_UNION_DETAIL, { KeyId: this.id }).then(() => {
          let res = this.union.unionDetail
          // 合并初始化数据
          Object.assign(this.form, {
            caseNo: res.CaseNo,
            caseName: res.CaseName,
            tel: res.Tel,
            title: res.Title,
            desc: res.CaseNote,
            attachments: [],
            level: res.Level,
            files: res.FileInfos.map(f => {
              return { name: f.Name, id: f.ID }
            }),
            org: [] // res.XcxxList.map(d => d.JzlxMc)
          })
          this.form.collectOrg = this.currentOrgOps[0].value

          if(res.XcxxList.length > 0) {
            this.orgOps.forEach(d => {
              let data = res.XcxxList.find(c => c.JzlxDm === d.id)
              if(!data) {

              } else {
                d.dept = data.OrgId
                d.template = data.MbId
                d.content = decodeURI(data.Note) // #13483 URI编码上传比数据库,原样输出给前端续解码
                d.acceptDay = data.AcceptDay
                d.files = data.FileInfos.map(f => {
                  return { name: f.Name, id: f.ID }
                })
                d.deptOps = []
                this.getSubOrg(d, d.title)
              }
            })
          }
        })
      }
    },
    checkOrgs() {
      if(this.tabs.length > 0) {
        this.tabs.forEach(d => this.getSubOrg(d))
      }
    },
    getSubOrg(data, title) {
      if(data.deptOps.length === 0) {
        this.dispatch(GET_SYS_ORG_TREE_BY_TYPE, { jzlx: data.id }).then(() => {
          this.orgOps.find(c => c.id === data.id).deptOps = this.orgs.sysOrgTreeFromType.map(d => {
            return {
              label: d.value,
              value: d.key
            }
          })
          if(title) this.form.org.push(title)
        })
      }
    },
    save() {
      this.submit(true)
    },
    submit(draft = false) {
      let self = this
      this.$refs.editForm.validate(valid => {
        if(valid === true) {
          if(!this.tabs.find(t => t.dept === '' || t.template === '')) {
            action()
          } else {
            this.$alert('所有配侦部门对应的"协办单位"和"协作模板"都不能为空', '温馨提示')
            return false
          }
        } else {
          return false
        }
      })

      function action() {
        self.loading = true
        let source = !draft ? ADD_UNION : POST_UNION_DRAFT,
          formData = {
            KeyId: self.id,
            // CollectDept: self.form.collectOrg[self.form.collectOrg.length - 1],
            CreatorDept: self.form.collectOrg,
            XcxxList: [],
            Title: self.form.title,
            Tel: self.form.tel,
            CaseNo: self.form.caseNo,
            CaseName: self.form.caseName,
            CaseNote: self.form.desc,
            Level: self.form.level,
            FileInfos: self.form.files,
            DraftFlag: !draft ? '0' : '1'
          }

        self.tabs.forEach(d => {
          formData.XcxxList.push({
            OrgId: d.dept,
            OrgName: d.deptOps.find(p => p.value === d.dept).label,
            MbId: d.template,
            Note: encodeURI(d.content),
            FileInfos: d.files,
            AcceptDay: d.acceptDay
          })
        })

        self.dispatch(source, formData).then(() => {
          self.loading = false
          self.isFormalSubmit = true
          if(!draft) {
            self.$alert('申请提交成功', '操作成功');
            self.$emit('call:reload')
            self.closeEvent()
          } else {
            self.$alert('保存草稿成功', '操作成功');
            self.$emit('call:reload')
          }
        })
      }
    },
    closeEvent() {
      this.$refs.editForm.resetFields()
      this.form.files = []
      this.$emit('close')
    },
    filterCase(query) {
      if(query !== '') {
        this.caseOps = this.cases.filter(c => {
          return c.id.indexOf(query) !== -1 || c.name.indexOf(query) !== -1
        })
      } else {
        this.caseOps = []
      }
    },
    chenageTemple(data) {
      this.templateOps.forEach(d => {
        if(d.value === data) {
          this.content = d.content
        }
      })
    },
    handleChange(value) {

    },
    uploadSubmit(file) {
      if(!file.data.fileList) {

      } else {
        this.form.files = file.data.fileList
        this.form.files = file.data.fileList.map(d => {
          return { ID: d.response.Data.ID, name: d.response.Data.Name, id: d.response.Data.ID }
        })
      }
    },
    uploadSubSubmit(file, box) {
      if(!file.data.fileList) {

      } else {
        this.tabs.find(d => d.id === box.id).files = file.data.fileList.map(d => {
          return { ID: d.response.Data.ID, name: d.response.Data.Name, id: d.response.Data.ID }
        })
      }
    }
  },
  created() {
    this.currentOrgOps = this.userOrgInfo.orgList.map(d => {
      return { label: d.DeptName, value: d.DeptNo }
    })
  },
  mounted() {}
}
</script>
