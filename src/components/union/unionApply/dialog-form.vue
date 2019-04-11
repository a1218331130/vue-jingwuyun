<template>
<div class="collApply">
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="协作申请" :modal-append-to-body="true" :append-to-body="true" size="bigest" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <div class="apply-box">
      <el-row>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <div class="base-box">
            <el-col :span="24">
              <el-form-item prop="type" label="流程类型">
                <el-radio-group v-model="form.type">
                  <el-radio label="1">指令下发</el-radio>
                  <el-radio label="2">请求协助</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="core" label="数据范围" v-if="showDept">
                <el-checkbox-group v-model="form.core" :min="1">
                  <el-checkbox label="情报指挥"></el-checkbox>
                  <el-checkbox label="侦查实战"></el-checkbox>
                  <el-checkbox label="治安防控"></el-checkbox>
                  <el-checkbox label="执法监督"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="title" label="信息标题">
                <el-input v-model="form.title" placeholder="请输入信息标题" required="true" style="width:90%"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="phone" label="联系电话">
                <el-input v-model="form.phone" placeholder="请输入联系电话" required="true" style="width:90%"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="bigCategory" label="信息类别">
                <span class="tags">大类</span>
                <el-select v-model="form.bigCategory" style="width:310px;" placeholder="" @change="selectBigCategory">
                  <el-option v-for="dept in bigCategoryOps" :key="dept.value" :label="dept.label" :value="dept.value">
                    {{dept.label}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="smallCategory" label-width="22px">
                <span class="tags">细类</span>
                <el-select v-model="form.smallCategory" style="width:310px;" placeholder="">
                  <el-option v-for="dept in smallCategoryOps" :key="dept.value" :label="dept.label" :value="dept.value">
                    {{dept.label}}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="level" label="信息级别" class="infoRank">
                <el-radio-group v-model="form.level" @change="changRadio">
                  <el-radio label="1">一级</el-radio>
                  <el-radio label="2">二级</el-radio>
                  <el-radio label="3">三级</el-radio>
                  <el-radio label="4">四级</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item prop="lssuedTime" label-width="70px" label="时间条件">
                <span class="tags" style="background:#673AB7;color:white">下发</span>
                <el-date-picker type="datetime" v-model="form.lssuedTime" placeholder="" style="width:72%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="sginTime" label-width="0px" label="">
                <span class="tags" style="background:#CF5CE2;color:white">签收</span>
                <el-date-picker type="datetime" v-model="form.sginTime" placeholder="" style="width:72%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="feedbackTime" label-width="0px" label="">
                <span class="tags" style="background:#F788AE;color:white">反馈</span>
                <el-date-picker type="datetime" v-model="form.feedbackTime" placeholder="" style="width:72%;"></el-date-picker>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-tabs style=" background: #f6f6f6 ;border-top: 1px solid #d7d7d7;" v-if="intelligence">
              <el-tab-pane label="情报指挥">
                <el-col :span="12" style="margin-top: 15px;" v-if="showDept">
                  <el-form-item prop="deptOne" label="协办单位">
                    <el-select v-model="form.deptOne" style="width:310px;" placeholder="">
                      <el-option v-for="dept in deptOpsOne" :key="dept.key" :label="dept.value" :value="dept.key">
                        {{dept.value}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="margin-top: 15px;">
                  <el-form-item prop="templateOne" label="协作模板">
                    <el-select v-show="form.deptOne!==''" v-model="form.templateOne" @change="chenageTempleOne" style="width:310px;" placeholder="">
                      <el-option v-for="item in templateOpsOne" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                        <span class="mouldType">{{item.type==="0"?'(通用模板)':'(单位模板)'}}</span>
                      </el-option>
                    </el-select>
                    <span v-show="form.deptOne===''" style="color:red">请先选择协办单位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="contentOne" label="指令内容">
                    <!-- <quill-editor :options="editorOptions" v-model="form.contentOne" :content="contentOne" style="width:93%"></quill-editor> -->
                    <UE :ref="unionApplyEditor_1" elementId="unionApplyEditor_1" v-model="form.contentOne" :width="680" :height="300" :transcode="true"></UE>
                  </el-form-item>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24">
            <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-if="spy">
              <el-tab-pane label="侦查实战">
                <el-col :span="12" style="margin-top: 15px;" v-if="showDept">
                  <el-form-item prop="deptTwo" label="协办单位">
                    <el-select v-model="form.deptTwo" style="width:310px;" placeholder="">
                      <el-option v-for="dept in deptOpsTwo" :key="dept.key" :label="dept.value" :value="dept.key">
                        {{dept.value}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="margin-top: 15px;">
                  <el-form-item prop="templateTwo" label="协作模板">
                    <el-select v-show="form.deptTwo!==''" v-model="form.templateTwo" @change="chenageTempleTwo" style="width:310px;" placeholder="">
                      <el-option v-for="item in templateOpsTwo" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                        <span class="mouldType">{{item.type==="0"?'(通用模板)':'(单位模板)'}}</span>
                      </el-option>
                    </el-select>
                    <span v-show="form.deptTwo===''" style="color:red">请先选择协办单位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="contentTwo" label="指令内容">
                    <UE :ref="unionApplyEditor_2" elementId="unionApplyEditor_2" v-model="form.contentTwo" :height="300" :transcode="true"></UE>
                    <!-- <quill-editor :options="editorOptions" v-model="form.contentTwo" :content="contentTwo" style="width:93%"></quill-editor> -->
                  </el-form-item>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24">
            <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-if="publicSecurity">
              <el-tab-pane label="治安防控">
                <el-col :span="12" style="margin-top: 15px;" v-if="showDept">
                  <el-form-item prop="deptThree" label="协办单位">
                    <el-select v-model="form.deptThree" style="width:310px;" placeholder="">
                      <el-option v-for="dept in deptOpsThree" :key="dept.key" :label="dept.value" :value="dept.key">
                        {{dept.value}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="margin-top: 15px;">
                  <el-form-item prop="templateThree" label="协作模板">
                    <el-select v-show="form.deptThree !== ''" v-model="form.templateThree" @change="chenageTempleThree" style="width:310px;" placeholder="">
                      <el-option v-for="item in templateOpsThree" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                        <span class="mouldType">{{item.type==="0"?'(通用模板)':'(单位模板)'}}</span>
                      </el-option>
                    </el-select>
                    <span v-show="form.deptThree===''" style="color:red">请先选择协办单位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="contentThree" label="指令内容">
                    <UE :ref="unionApplyEditor_3" elementId="unionApplyEditor_3" v-model="form.contentThree" :height="300" :transcode="true"></UE>
                    <!-- <quill-editor :options="editorOptions" v-model="form.contentThree" :content="contentThree" style="width:93%"></quill-editor> -->
                  </el-form-item>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="24">
            <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-if="supervise">
              <el-tab-pane label="执法监督">
                <el-col :span="12" style="margin-top: 15px;" v-if="showDept">
                  <el-form-item prop="deptFour" label="协办单位">
                    <el-select v-model="form.deptFour" style="width:310px;" placeholder="">
                      <el-option v-for="dept in deptOpsFour" :key="dept.key" :label="dept.value" :value="dept.key">
                        {{dept.value}}
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" style="margin-top: 15px;">
                  <el-form-item prop="templateFour" label="协作模板">
                    <el-select v-show="form.deptFour !== ''" v-model="form.templateFour" @change="chenageTempleFour" style="width:310px;" placeholder="">
                      <el-option v-for="item in templateOpsFour" :key="item.value" :label="item.label" :value="item.value">
                        {{item.label}}
                        <span class="mouldType">{{item.type==="0"?'(通用模板)':'(单位模板)'}}</span>
                      </el-option>
                    </el-select>
                    <span v-show="form.deptFour===''" style="color:red">请先选择协办单位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="contentFour" label="指令内容">
                    <UE :ref="unionApplyEditor_4" elementId="unionApplyEditor_4" v-model="form.contentFour" :height="300" :transcode="true"></UE>
                    <!-- <quill-editor :options="editorOptions" v-model="form.contentFour" :content="contentFour" style="width:93%"></quill-editor> -->
                  </el-form-item>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="8">
            <el-form-item label="附件列表" prop="upload">
              <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="form.files">
                <el-button slot="button" type="primary">上传附件（300M）</el-button>
              </upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联警踪平台" label-width="120px">
              <div class="markTags">
                <span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联警踪平台数据</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联其它平台" label-width="120px">
              <div class="markTags">
                <span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联其它平台数据</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联刑专平台" label-width="120px">
              <div class="markTags">
                <span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联刑专平台数据</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联治安防控" label-width="120px">
              <div class="markTags">
                <span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联治安防控数据</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="remarks" label="指令备注" label-width="120px">
              <el-input style="width:93%;margin-bottom: 31px;" v-model="form.remarks" placeholder="请输入指令备注" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div class="contentBox__button">
      <el-button type="" @click="closeEvent">返回</el-button>
      <el-button type="" @click="save">暂存草稿</el-button>
      <el-button style="background: #4da5e6;" type="primary" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
.apply-box {
    padding: 0 10%;
    .el-row {
        border: 1px solid #d7d7d7;
    }
}
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
    // padding: 10px;
}
.el-input {
    width: 81%;
}
.markTags {
    span {
        display: inline-block;
        width: 180px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #d7d7d7;
        border-radius: 15px;
        background: #f2f2f2;
        color: #0683ff;
        text-align: center;
    }
}
.bottom-button {
    .el-button {
        position: relative;
        left: 41%;
        top: 15%;
        width: 84px;
    }
}
.tags {
    display: inline-block;
    width: 50px;
    height: 28px;
    line-height: 28px;
    background: #d7d7d7;
    position: relative;
    left: 4px;
    border-radius: 5px 0 0 5px;
    border: 1px solid #d7d7d7;
    text-align: center;
    color: #666666;
}
.contentBox__button {
    position: absolute;
    left: 0;
    bottom: 5px;
    border: 1px solid #d7d7d7;
    height: 60px;
    width: 100%;
    background-color: white;
    z-index: 9999;
    .el-button {
        position: relative;
        left: 37%;
        top: 15%;
        width: 84px;
    }
}
.mouldType {
    float: right;
    padding-right: 10px;
}
</style>
<style lang="scss">
.collApply {
    .el-form-item.infoRank {
        > .el-form-item__content {
            .el-radio-group {
                .el-radio:nth-child(1) {
                    .el-radio__input.is-checked {
                        .el-radio__inner {
                            border-color: red;
                            background: red;
                        }
                    }
                }
                .el-radio:nth-child(2) {
                    .el-radio__input.is-checked {
                        .el-radio__inner {
                            border-color: green;
                            background: green;
                        }
                    }
                }
                .el-radio:nth-child(3) {
                    .el-radio__input.is-checked {
                        .el-radio__inner {
                            border-color: #eca428;
                            background: #eca428;
                        }
                    }
                }
            }
        }
    }
}
</style>
<script>
import mixin from '../../../utils/mixin'
import upload from '../../../widgets/upload/upload.vue'
import { SYS_ZX_ORG, ADD_UNION, POST_UNION_DRAFT, GET_UNION_DETAIL, FETCH_ORG_MOULD_LIST } from '../../../store/types'
import { mapState } from 'vuex'
import '../../../utils/dateFormat'
import UE from '../../../widgets/UEeditor/editor'
// fetchOrgMouldList

export default {
  mixins: [mixin],
  components: {
    upload,
    UE
  },
  data() {
    return {
      unionApplyEditor_1: 'unionApplyEditor_1',
      unionApplyEditor_2: 'unionApplyEditor_2',
      unionApplyEditor_3: 'unionApplyEditor_3',
      unionApplyEditor_4: 'unionApplyEditor_4',
      showDept: true,
      intelligence: true,
      spy: false,
      publicSecurity: false,
      supervise: false,
      isFormalSubmit: false,
      contentOne: '',
      contentTwo: '',
      contentThree: '',
      contentFour: '',
      form: {
        type: '1',
        core: ['情报指挥'],
        title: '',
        phone: '',
        bigCategory: '',
        smallCategory: '',
        level: '1',
        lssuedTime: '',
        sginTime: '',
        feedbackTime: '',
        contentOne: '',
        contentTwo: '',
        contentThree: '',
        contentFour: '',
        templateOne: '',
        templateTwo: '',
        templateThree: '',
        templateFour: '',
        remarks: '',
        deptOne: '',
        deptTwo: '',
        deptThree: '',
        deptFour: '',
        visitAccessory: '',
        FileNames: '',
        currentFiles: [],
        files: []
      },
      deptOpsOne: [],
      deptOpsTwo: [],
      deptOpsThree: [],
      deptOpsFour: [],
      deptOps: [{
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '3',
        label: '3'
      }, {
        value: '4',
        label: '4'
      }],
      templateOps: [{
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '3',
        label: '3'
      }, {
        value: '4',
        label: '4'
      }],
      templateOpsOne: [],
      templateOpsTwo: [],
      templateOpsThree: [],
      templateOpsFour: [],
      bigCategoryOps: [{
        value: '情报指挥中心',
        label: '情报指挥中心'
      }, {
        value: '侦查实战中心',
        label: '侦查实战中心'
      }, {
        value: '治安防控中心',
        label: '治安防控中心'
      }, {
        value: '执法监督中心',
        label: '执法监督中心'
      }],
      smallCategoryOps: [],
      attachmentSource: {
        id: '',
        table: ''
      },
      rules: {
        title: [{
          required: 'true',
          message: '请输入布控名称',
          trigger: 'blur'
        }],
        deptOne: [{
          required: 'true',
          message: '请输入协助单位',
          trigger: 'change'
        }],
        deptTwo: [{
          required: 'true',
          message: '请输入协助单位',
          trigger: 'change'
        }],
        deptThree: [{
          required: 'true',
          message: '请输入协助单位',
          trigger: 'change'
        }],
        deptFour: [{
          required: 'true',
          message: '请输入协助单位',
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    ...mapState(['union', 'orgs', 'cooperative', 'users'])
  },
  props: ['dialog', 'id'],
  methods: {
    uploadSubmit(file) {
      if(!file.data.fileList) {

      } else {
        this.form.files = file.data.fileList.map(d => {
          return { ID: d.response.Data.ID, name: d.response.Data.Name, id: d.response.Data.ID }
        })
      }
    },
    openMessage() {
      this.$message({
        message: '正在建设中'
      })
    },
    chenageTempleOne(data) {
      this.templateOpsOne.forEach(d => {
        if(d.value === data) {
          this.contentOne = d.content
          if(this.$refs.unionApplyEditor_1) this.$refs.unionApplyEditor_1.setContent(this.contentOne)
        }
      })
    },
    chenageTempleTwo(data) {
      this.templateOpsTwo.forEach(d => {
        if(d.value === data) {
          this.contentTwo = d.content
          if(this.$refs.unionApplyEditor_2) this.$refs.unionApplyEditor_2.setContent(this.contentTwo)
        }
      })
    },
    chenageTempleThree(data) {
      this.templateOpsThree.forEach(d => {
        if(d.value === data) {
          this.contentThree = d.content
          if(this.$refs.unionApplyEditor_3) this.$refs.unionApplyEditor_3.setContent(this.contentThree)
        }
      })
    },
    chenageTempleFour(data) {
      this.templateOpsFour.forEach(d => {
        if(d.value === data) {
          this.contentFour = d.content
          if(this.$refs.unionApplyEditor_4) this.$refs.unionApplyEditor_4.setContent(this.contentFour)
        }
      })
    },
    changRadio(val) {
      const data = new Date()
      if(val === '1') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 2)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 5)
      }
      if(val === '2') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 5)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 10)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 15)
      }
      if(val === '3') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 24)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 48)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 72)
      }
      if(val === '4') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 48)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 96)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 120)
      }
    },
    backToList() {
      this.$router.push('/union/myApply')
    },
    closeEvent() {
      this.form.files = []
      this.$emit('close')
      this.form.title = ''
      this.form.phone = ''
      this.form.bigCategory = ''
      this.form.smallCategory = ''
      this.form.level = '0'
      this.form.lssuedTime = ''
      this.form.sginTime = ''
      this.form.feedbackTime = ''
      this.form.contentOne = ''
      this.form.contentTwo = ''
      this.form.contentThree = ''
      this.form.contentFour = ''
      this.form.templateOne = ''
      this.form.templateTwo = ''
      this.form.templateThree = ''
      this.form.templateFour = ''
      this.form.remarks = ''
      this.form.deptOne = ''
      this.form.deptTwo = ''
      this.form.deptThree = ''
      this.form.deptFour = ''
      if(this.$refs.unionApplyEditor_1) this.$refs.unionApplyEditor_1.setContent('')
      if(this.$refs.unionApplyEditor_2) this.$refs.unionApplyEditor_2.setContent('')
      if(this.$refs.unionApplyEditor_3) this.$refs.unionApplyEditor_3.setContent('')
      if(this.$refs.unionApplyEditor_4) this.$refs.unionApplyEditor_4.setContent('')
      this.$refs.form.resetFields()
    },
    initDialog() {
      this.form.level = '1'
      if(this.id) {
        this.dispatch(GET_UNION_DETAIL, { KeyId: this.id }).then(() => {
          this.form.title = this.union.unionDetail.Title
          this.form.phone = this.union.unionDetail.Tel
          this.form.bigCategory = this.returnBigCategory(this.union.unionDetail.BigCategory)
          this.form.smallCategory = this.union.unionDetail.SmallCategory
          this.form.level = this.union.unionDetail.Level
          this.form.lssuedTime = this.union.unionDetail.IssuedTime
          this.form.sginTime = this.union.unionDetail.SignTime
          this.form.feedbackTime = this.union.unionDetail.FeedbackTime
          this.form.remarks = this.union.unionDetail.CaseNote
          this.form.files = this.union.unionDetail.FileInfos.map(f => {
            return { name: f.Name, id: f.ID }
          })
          // this.form.core = this.union.unionDetail.XcxxList.map(d => d.JzlxMc)
          this.getXccContent(this.union.unionDetail.XcxxList)
        })
      }
    },
    getBigCategory(val) {
      if(val === '情报指挥中心') {
        return '1'
      }
      if(val === '侦查实战中心') {
        return '2'
      }
      if(val === '治安防控中心') {
        return '3'
      }
      if(val === '执法监督中心') {
        return '4'
      }
    },
    save() {
      this.$confirm('请确认提交协同草稿', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // window.location.reload()
        let formData = {
          XcxxList: [],
          Title: this.form.title,
          Tel: this.form.phone,
          CaseNo: '',
          CaseName: '',
          CaseNote: this.form.remarks,
          Level: this.form.level,
          FileInfos: this.form.files,
          IssuedTime: this.dateFormat(new Date(this.form.lssuedTime), 'yyyy-MM-dd hh:mm:ss'),
          SignTime: this.dateFormat(new Date(this.form.sginTime), 'yyyy-MM-dd hh:mm:ss'),
          FeedbackTime: this.dateFormat(new Date(this.form.feedbackTime), 'yyyy-MM-dd hh:mm:ss'),
          BigCategory: this.form.bigCategory ? this.getBigCategory(this.form.bigCategory) : '',
          SmallCategory: this.form.smallCategory
        }
        this.form.core.forEach(d => {
          if(d === '情报指挥') {
            formData.XcxxList.push({
              OrgId: this.form.deptOne,
              OrgName: this.deptOpsOne.find(p => p.key === this.form.deptOne).value,
              MbId: this.form.templateOne,
              Note: this.form.contentOne
            })
          }
          if(d === '侦查实战') {
            formData.XcxxList.push({
              OrgId: this.form.deptTwo,
              OrgName: this.deptOpsTwo.find(p => p.key === this.form.deptTwo).value,
              MbId: this.form.templateTwo,
              Note: this.form.contentTwo
            })
          }
          if(d === '治安防控') {
            formData.XcxxList.push({
              OrgId: this.form.deptThree,
              OrgName: this.deptOpsThree.find(p => p.key === this.form.deptThree).value,
              MbId: this.form.templateThree,
              Note: this.form.contentThree
            })
          }
          if(d === '执法监督') {
            formData.XcxxList.push({
              OrgId: this.form.deptFour,
              OrgName: this.deptOpsFour.find(p => p.key === this.form.deptFour).value,
              MbId: this.form.templateFour,
              Note: this.form.contentFour
            })
          }
        })
        this.dispatch(POST_UNION_DRAFT, formData).then(() => {
          window.location.reload()
        })
      }).catch(() => {});
    },
    submit() {
      this.$refs.form.validate(valid => {
        if(valid === true) {
          this.$confirm('请确认提交协同申请', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // window.location.reload()
            // console.log(this.form, 6666);
            const formData = {
              XcxxList: [],
              Title: this.form.title,
              Tel: this.form.phone,
              CaseNo: '',
              CaseName: '',
              CaseNote: this.form.remarks,
              Level: this.form.level,
              FileInfos: this.form.files,
              IssuedTime: this.dateFormat(new Date(this.form.lssuedTime), 'yyyy-MM-dd hh:mm:ss'),
              SignTime: this.dateFormat(new Date(this.form.sginTime), 'yyyy-MM-dd hh:mm:ss'),
              FeedbackTime: this.dateFormat(new Date(this.form.feedbackTime), 'yyyy-MM-dd hh:mm:ss'),
              BigCategory: this.form.bigCategory ? this.getBigCategory(this.form.bigCategory) : '',
              SmallCategory: this.form.smallCategory
            }
            this.form.core.forEach(d => {
              if(d === '情报指挥') {
                formData.XcxxList.push({
                  OrgId: this.form.deptOne,
                  OrgName: this.form.deptOne ? this.deptOpsOne.find(p => p.key === this.form.deptOne).value : '',
                  MbId: this.form.templateOne,
                  Note: this.form.contentOne
                })
              }
              if(d === '侦查实战') {
                formData.XcxxList.push({
                  OrgId: this.form.deptTwo,
                  OrgName: this.form.deptTwo ? this.deptOpsTwo.find(p => p.key === this.form.deptTwo).value : '',
                  MbId: this.form.templateTwo,
                  Note: this.form.contentTwo
                })
              }
              if(d === '治安防控') {
                if(this.deptOpsThree.length > 0) {
                  formData.XcxxList.push({
                    OrgId: this.form.deptThree,
                    OrgName: this.form.deptThree ? this.deptOpsThree.find(p => p.key === this.form.deptThree).value : '',
                    MbId: this.form.templateThree,
                    Note: this.form.contentThree
                  })
                }
              }
              if(d === '执法监督') {
                if(this.deptOpsFour.length > 0) {
                  formData.XcxxList.push({
                    OrgId: this.form.deptFour,
                    OrgName: this.form.deptFour ? this.deptOpsFour.find(p => p.key === this.form.deptFour).value : '',
                    MbId: this.form.templateFour,
                    Note: this.form.contentFour
                  })
                }
              }
            })
            this.dispatch(ADD_UNION, formData).then(() => {
              this.$message({
                message: '提交成功！',
                onClose: function () {
                  window.location.reload()
                }
              })
            })
          }).catch(() => {});
        } else {
          return false
        }
      })
    },
    returnBigCategory(data) {
      let core
      switch(data) {
        case '1':
          core = '情况指挥中心'
          break;
        case '2':
          core = '侦查实战中心'
          break;
        case '3':
          core = '治安防控中心'
          break;
        default:
          core = '执法监督中心'
          break;
      }
      return core
    },
    selectBigCategory(data) {
      console.log(data);
      // this.form.smallCategory = ''
    },
    getXccContent(data) {
      data.forEach(d => {
        if(d.JzlxMc === '情况指挥') {
          if(this.form.core.includes('情况指挥')) {

          } else {
            this.form.core.push('情况指挥')
          }
          this.form.deptOne = d.OrgId
          this.contentOne = d.Note
          this.form.templateOne = d.MbId
          if(this.$refs.unionApplyEditor_1) this.$refs.unionApplyEditor_1.setContent(this.contentOne)
        }
        if(d.JzlxMc === '侦查实战') {
          if(this.form.core.includes('侦查实战')) {

          } else {
            this.form.core.push('侦查实战')
          }
          this.form.deptTwo = d.OrgName
          this.contentTwo = d.Note
          this.form.templateTwo = d.MbId
          if(this.$refs.unionApplyEditor_2) this.$refs.unionApplyEditor_2.setContent(this.contentTwo)
        }
        if(d.JzlxMc === '治安防控') {
          if(this.form.core.includes('治安防控')) {

          } else {
            this.form.core.push('治安防控')
          }
          this.form.deptThree = d.OrgName
          this.contentThree = d.Note
          this.form.templateThree = d.MbId
          if(this.$refs.unionApplyEditor_3) this.$refs.unionApplyEditor_3.setContent(this.contentThree)
        }
        if(d.JzlxMc === '执法监督') {
          if(this.form.core.includes('执法监督')) {

          } else {
            this.form.core.push('执法监督')
          }
          this.form.deptFour = d.OrgName
          this.contentFour = d.Note
          this.form.templateFour = d.MbId
          if(this.$refs.unionApplyEditor_4) this.$refs.unionApplyEditor_4.setContent(this.contentFour)
        }
      })
    }
  },
  watch: {
    'form.level' (val) {
      const data = new Date()
      if(val === '1') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 2)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 5)
      }
      if(val === '2') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 5)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 10)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 15)
      }
      if(val === '3') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 24)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 48)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 72)
      }
      if(val === '4') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 48)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 96)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 120)
      }
    },
    'form.type' (val) {
      if(val === '1') {
        this.showDept = true
      } else {
        this.showDept = false
      }
    },
    'form.core' (val) {
      // console.log(val);
      if(val.includes('情报指挥')) {
        this.intelligence = true
      } else {
        this.intelligence = false
      }
      if(val.includes('侦查实战')) {
        this.spy = true
      } else {
        this.spy = false
      }
      if(val.includes('治安防控')) {
        this.publicSecurity = true
      } else {
        this.publicSecurity = false
      }
      if(val.includes('执法监督')) {
        this.supervise = true
      } else {
        this.supervise = false
      }
    },
    'form.bigCategory' (val) {
      if(val === '情报指挥中心') {
        this.smallCategoryOps = [{
          value: '行政类1',
          label: '行政类1'
        }, {
          value: '警务类1',
          label: '警务类1'
        }, {
          value: '其它类1',
          label: '其它类1'
        }]
        if(!this.smallCategoryOps.includes(this.form.smallCategory)) {
          this.form.smallCategory = ''
        }
      }
      if(val === '侦查实战中心') {
        this.smallCategoryOps = [{
          value: '行政类2',
          label: '行政类2'
        }, {
          value: '警务类2',
          label: '警务类2'
        }, {
          value: '其它类2',
          label: '其它类2'
        }]
        if(!this.smallCategoryOps.includes(this.form.smallCategory)) {
          this.form.smallCategory = ''
        }
      }
      if(val === '治安防控中心') {
        this.smallCategoryOps = [{
          value: '行政类3',
          label: '行政类3'
        }, {
          value: '警务类3',
          label: '警务类3'
        }, {
          value: '其它类3',
          label: '其它类3'
        }]
        if(!this.smallCategoryOps.includes(this.form.smallCategory)) {
          this.form.smallCategory = ''
        }
      }
      if(val === '执法监督中心') {
        this.smallCategoryOps = [{
          value: '行政类4',
          label: '行政类4'
        }, {
          value: '警务类4',
          label: '警务类4'
        }, {
          value: '其它类4',
          label: '其它类4'
        }]
        if(!this.smallCategoryOps.includes(this.form.smallCategory)) {
          this.form.smallCategory = ''
        }
      }
    },
    'form.deptOne' (val) {
      this.form.templateOne = ''
      if(this.$refs.unionApplyEditor_1) this.$refs.unionApplyEditor_1.setContent('')
      this.dispatch(FETCH_ORG_MOULD_LIST, { orgid: val })
        .then(() => {
          this.templateOpsOne = this.cooperative.orgMouldList.map((d, i) => {
            return { index: i, label: d.bt, value: d.id, content: d.nr, type: d.type }
          })
        })
    },
    'form.deptTwo' (val) {
      this.form.templateTwo = ''
      if(this.$refs.unionApplyEditor_2) this.$refs.unionApplyEditor_2.setContent('')
      this.dispatch(FETCH_ORG_MOULD_LIST, { orgid: val })
        .then(() => {
          this.templateOpsTwo = this.cooperative.orgMouldList.map((d, i) => {
            return { index: i, label: d.bt, value: d.id, content: d.nr, type: d.type }
          })
        })
    },
    'form.deptThree' (val) {
      this.form.templateThree = ''
      if(this.$refs.unionApplyEditor_3) this.$refs.unionApplyEditor_3.setContent('')
      this.dispatch(FETCH_ORG_MOULD_LIST, { orgid: val })
        .then(() => {
          this.templateOpsThree = this.cooperative.orgMouldList.map((d, i) => {
            return { index: i, label: d.bt, value: d.id, content: d.nr, type: d.type }
          })
        })
    },
    'form.deptFour' (val) {
      this.form.templateFour = ''
      if(this.$refs.unionApplyEditor_4) this.$refs.unionApplyEditor_4.setContent('')
      this.dispatch(FETCH_ORG_MOULD_LIST, { orgid: val })
        .then(() => {
          this.templateOpsFour = this.cooperative.orgMouldList.map((d, i) => {
            return { index: i, label: d.bt, value: d.id, content: d.nr, type: d.type }
          })
        })
    }
  },
  created() {
    this.dispatch(SYS_ZX_ORG, {
      zx: '1'
    }).then(() => {
      this.deptOpsOne = this.orgs.centerOrg
    })
    this.dispatch(SYS_ZX_ORG, {
      zx: '2'
    }).then(() => {
      this.deptOpsTwo = this.orgs.centerOrg
    })
    this.dispatch(SYS_ZX_ORG, {
      zx: '3'
    }).then(() => {
      this.deptOpsThree = this.orgs.centerOrg
    })
    this.dispatch(SYS_ZX_ORG, {
      zx: '4'
    }).then(() => {
      this.deptOpsFour = this.orgs.centerOrg
    })
    // if (this.templateOps.length === 0) {
    // this.dispatch(FETCH_UNION_TEMP).then(() => {
    //   this.templateOps = this.union.unionTempList.map((d, i) => {
    //     return { index: i, label: d.Title, value: d.KeyId, content: d.Content }
    //   })
    // })
    // }
  },
  mounted() {
    this.form.phone = this.users.UserLogin.UserData.PhoneNum
    const data = new Date()
    this.form.lssuedTime = (data.getTime() + 3600 * 1000)
    this.form.sginTime = (data.getTime() + 3600 * 1000 * 2)
    this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 5)
  }
}
</script>
