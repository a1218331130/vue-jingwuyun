<!-- 概况(统计) -->
<template>
<div class="union-apply">
  <div class="union-apply__box">
    <div class="union-apply__box__title">
      <span>怀化市4+X请求协助申请</span>
    </div>
    <div class="union-apply__box__content">
      <div class="contentBox">
        <div class="contentBox__main">
          <div class="contentBox__main__top">
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
                    <el-form-item prop="core" label="数据范围">
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
                      <el-select v-model="form.bigCategory" style="width:310px;" placeholder="">
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
                    <el-form-item prop="level" label="信息级别">
                      <el-radio-group v-model="form.level" @change="changRadio">
                        <el-radio label="1">一级</el-radio>
                        <el-radio label="2">二级</el-radio>
                        <el-radio label="3">三级</el-radio>
                        <el-radio label="4">四级</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>

                  <el-col :span="9">
                    <el-form-item prop="lssuedTime" label="时间条件">
                      <span class="tags">下发</span>
                      <el-date-picker type="datetime" v-model="form.lssuedTime" placeholder="" style="width:72%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="sginTime" label-width="0px" label="">
                      <span class="tags">签收</span>
                      <el-date-picker type="datetime" v-model="form.sginTime" placeholder="" style="width:72%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="7">
                    <el-form-item prop="feedbackTime" label-width="0px" label="">
                      <span class="tags">反馈</span>
                      <el-date-picker type="datetime" v-model="form.feedbackTime" placeholder="" style="width:72%;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </div>
                <el-col :span="24">
                  <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-show="intelligence">
                    <el-tab-pane label="情报指挥">
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="dept" label="协办单位">
                          <el-select v-model="form.deptOne" style="width:310px;" placeholder="">
                            <el-option v-for="dept in deptOpsOne" :key="dept.key" :label="dept.value" :value="dept.value">
                              {{dept.value}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="templateOne" label="协作模板">
                          <el-select v-model="form.templateOne" @change="chenageTempleOne" style="width:310px;" placeholder="">
                            <el-option v-for="item in templateOps" :key="item.value" :label="item.label" :value="item.value">
                              {{item.label}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item prop="template" label="指令内容">
                          <quill-editor :options="editorOptions" v-model="form.contentOne" :content="contentOne" style="width:93%"></quill-editor>
                        </el-form-item>
                      </el-col>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
                <el-col :span="24">
                  <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-show="spy">
                    <el-tab-pane label="侦查实战">
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="dept" label="协办单位">
                          <el-select v-model="form.deptTwo" style="width:310px;" placeholder="">
                            <el-option v-for="dept in deptOpsTwo" :key="dept.key" :label="dept.value" :value="dept.value">
                              {{dept.value}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="templateTwo" label="协作模板">
                          <el-select v-model="form.templateTwo" @change="chenageTempleTwo" style="width:310px;" placeholder="">
                            <el-option v-for="item in templateOps" :key="item.value" :label="item.label" :value="item.value">
                              {{item.label}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item prop="template" label="指令内容">
                          <quill-editor :options="editorOptions" v-model="form.contentTwo" :content="contentTwo" style="width:93%"></quill-editor>
                        </el-form-item>
                      </el-col>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
                <el-col :span="24">
                  <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-show="publicSecurity">
                    <el-tab-pane label="治安防控">
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="dept" label="协办单位">
                          <el-select v-model="form.deptThree" style="width:310px;" placeholder="">
                            <el-option v-for="dept in deptOpsThree" :key="dept.key" :label="dept.value" :value="dept.value">
                              {{dept.value}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="templateThree" label="协作模板">
                          <el-select v-model="form.templateThree" @change="chenageTempleThree" style="width:310px;" placeholder="">
                            <el-option v-for="item in templateOps" :key="item.value" :label="item.label" :value="item.value">
                              {{item.label}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item prop="template" label="指令内容">
                          <quill-editor :options="editorOptions" v-model="form.contentThree" :content="contentThree" style="width:93%"></quill-editor>
                        </el-form-item>
                      </el-col>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
                <el-col :span="24">
                  <el-tabs style="background: #f6f6f6;border-top: 1px solid #d7d7d7;" v-show="supervise">
                    <el-tab-pane label="执法监督">
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="deptFour" label="协办单位">
                          <el-select v-model="form.deptFour" style="width:310px;" placeholder="">
                            <el-option v-for="dept in deptOpsFour" :key="dept.key" :label="dept.value" :value="dept.value">
                              {{dept.value}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" style="margin-top: 15px;">
                        <el-form-item prop="templateFour" label="协作模板">
                          <el-select v-model="form.templateFour" @change="chenageTempleFour" style="width:310px;" placeholder="">
                            <el-option v-for="item in templateOps" :key="item.value" :label="item.label" :value="item.value">
                              {{item.label}}
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item prop="template" label="指令内容">
                          <quill-editor :options="editorOptions" v-model="form.contentFour" :content="contentFour" style="width:93%"></quill-editor>
                        </el-form-item>
                      </el-col>
                    </el-tab-pane>
                  </el-tabs>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="附件列表" prop="upload">
                    <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="form.currentFiles">
                      <el-button slot="button" type="primary">上传附件</el-button>
                    </upload>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="关联警踪平台" label-width="120px">
                    <div class="markTags"><span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联警踪平台数据</span></div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="关联其它平台" label-width="120px">
                    <div class="markTags"><span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联其它平台数据</span></div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="关联刑专平台" label-width="120px">
                    <div class="markTags"><span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联刑专平台数据</span></div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="关联治安防控" label-width="120px">
                    <div class="markTags"><span :plain="true" @click="openMessage"><i class="icon iconfont icon-move"></i>点击关联治安防控数据</span></div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="remarks" label="指令备注" label-width="120px">
                    <el-input style="width:93%;margin-bottom: 31px;" v-model="form.remarks" placeholder="请输入指令备注" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="24">
                  <div class="bottom-button">
                    <el-button type="" @click="backToList">返回</el-button>
                    <el-button type="">暂存草稿</el-button>
                    <el-button style="background: #4da5e6;" type="primary" @click="submit">提交</el-button>
                  </div>
                </el-col> -->
              </el-form>
            </el-row>
          </div>
        </div>
        <div class="contentBox__button">
          <el-button type="" @click="backToList">返回</el-button>
          <el-button type="">暂存草稿</el-button>
          <el-button style="background: #4da5e6;" type="primary" @click="submit">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.union-apply {
    height: calc(100vh - 78px);
    padding: 16px 16px 0;
    display: block;
    &__box {
        height: 100%;
        border: 1px solid #d7d7d7;
        background-color: white;
        &__title {
            height: 37px;
            background: #4da5e6;
            span {
                position: relative;
                left: 2%;
                display: inline-block;
                height: 37px;
                line-height: 37px;
                font-size: 14px;
                color: white;
            }
        }
        &__content {
            height: calc(100% - 53px);
            .contentBox {
                // overflow: scroll;
                position: relative;
                margin: 16px auto 0;
                border: 1px solid #d7d7d7;
                height: calc(100% - 12px);
                width: 78%;
                &__main {
                    &__top {
                        position: absolute;
                        top: 0;
                        // border-bottom: 1px solid #d7d7d7;
                        // height: 323px;
                        width: 100%;
                        overflow: scroll;
                        height: 100%;
                    }
                }
                &__button {
                    position: absolute;
                    bottom: 0;
                    border: 1px solid #d7d7d7;
                    height: 49px;
                    width: 100%;
                    background-color: white;
                    .el-button {
                        position: relative;
                        left: 33%;
                        top: 15%;
                        width: 84px;
                    }
                }
            }
        }
    }
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
</style>

<script>
import mixin from '../../../utils/mixin'
import { quillEditor } from 'vue-quill-editor'
import editor from '../../../utils/editorOptions'
import upload from '../../../widgets/upload/upload.vue'
import { SYS_ZX_ORG, FETCH_UNION_TEMP } from '../../../store/types'
import { mapState } from 'vuex'

export default {
  mixins: [mixin, editor],
  components: {
    quillEditor,
    upload
  },
  data() {
    return {
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
        currentFiles: []
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
        // title: {
        //   required: 'true',
        //   message: '请输入布控名称',
        //   trigger: 'blur'
        // }
      }
    }
  },
  computed: {
    ...mapState(['union', 'orgs'])
  },
  methods: {
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if (f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = [],
          _fileNameArray = []
        for (let ii in f.data.fileList) {
          let __fFileId = f.data.fileList[ii].response ? f.data.fileList[ii].response.Data.ID : f.data.fileList[ii].url.split('?id=')[1]
          _fileIdArray.push(__fFileId)
          _fileNameArray.push(f.data.fileList[ii].name)
        }
        this.form.visitAccessory = _fileIdArray.join()
        this.form.FileNames = _fileNameArray.join('|')
        console.log('this.form.FileNames', this.form.FileNames);
      }
      this.isFormalSubmit = false
      this.geteEnclosure()
    },
    geteEnclosure() {
      let _fId = this.form.visitAccessory ? this.form.visitAccessory.split(',') : this.form.visitAccessory
      let _fName = this.form.FileNames ? this.form.FileNames.split('|') : this.form.FileNames
      // 附件列表数据回填
      this.form.currentFiles = [] // 上传文件列表 重置
      for (let fi in _fId) {
        this.form.currentFiles.push({
          name: _fName[fi],
          id: _fId[fi]
        })
      }
    },
    openMessage() {
      this.$message({
        message: '此处正在施工中'
      })
    },
    chenageTempleOne(data) {
      this.templateOps.forEach(d => {
        if (d.value === data) {
          this.contentOne = d.content
        }
      })
    },
    chenageTempleTwo(data) {
      this.templateOps.forEach(d => {
        if (d.value === data) {
          this.contentTwo = d.content
        }
      })
    },
    chenageTempleThree(data) {
      this.templateOps.forEach(d => {
        if (d.value === data) {
          this.contentThree = d.content
        }
      })
    },
    chenageTempleFour(data) {
      this.templateOps.forEach(d => {
        if (d.value === data) {
          this.contentFour = d.content
        }
      })
    },
    changRadio(val) {
      const data = new Date()
      if (val === '1') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 2)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 5)
      }
      if (val === '2') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 5)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 10)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 15)
      }
      if (val === '3') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 24)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 48)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 72)
      }
      if (val === '4') {
        this.form.lssuedTime = (data.getTime() + 3600 * 1000 * 48)
        this.form.sginTime = (data.getTime() + 3600 * 1000 * 96)
        this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 120)
      }
    },
    backToList() {
      this.$router.push('/union/myApply')
    },
    submit() {
      this.$confirm('请确认提交协同申请', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // window.location.reload()
        console.log(this.form, 6666);
      }).catch(() => {});
    }
  },
  watch: {
    'form.core' (val) {
      console.log(val);
      if (val.includes('情报指挥')) {
        this.intelligence = true
      } else {
        this.intelligence = false
      }
      if (val.includes('侦查实战')) {
        this.spy = true
      } else {
        this.spy = false
      }
      if (val.includes('治安防控')) {
        this.publicSecurity = true
      } else {
        this.publicSecurity = false
      }
      if (val.includes('执法监督')) {
        this.supervise = true
      } else {
        this.supervise = false
      }
    },
    'form.bigCategory' (val) {
      if (val === '情报指挥中心') {
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
      }
      if (val === '侦查实战中心') {
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
      }
      if (val === '治安防控中心') {
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
      }
      if (val === '执法监督中心') {
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
      }
    }
  },
  created() {
    this.dispatch(SYS_ZX_ORG, {
      zx: '1'
    }).then(() => {
      this.deptOpsOne = this.orgs.centerOrg
      // console.log(this.orgs.centerOrg);
    })
    this.dispatch(SYS_ZX_ORG, {
      zx: '2'
    }).then(() => {
      this.deptOpsTwo = this.orgs.centerOrg
      // console.log(this.orgs.centerOrg);
    })
    this.dispatch(SYS_ZX_ORG, {
      zx: '3'
    }).then(() => {
      this.deptOpsThree = this.orgs.centerOrg
      // console.log(this.orgs.centerOrg);
    })
    this.dispatch(SYS_ZX_ORG, {
      zx: '4'
    }).then(() => {
      this.deptOpsFour = this.orgs.centerOrg
      console.log(this.orgs.centerOrg);
    })
    // if (this.templateOps.length === 0) {
    this.dispatch(FETCH_UNION_TEMP).then(() => {
      this.templateOps = this.union.unionTempList.map((d, i) => {
        return { index: i, label: d.Title, value: d.KeyId, content: d.Content }
      })
    })
    // }
  },
  mounted() {
    const data = new Date()
    this.form.lssuedTime = (data.getTime() + 3600 * 1000)
    this.form.sginTime = (data.getTime() + 3600 * 1000 * 2)
    this.form.feedbackTime = (data.getTime() + 3600 * 1000 * 5)
  }
}
</script>
