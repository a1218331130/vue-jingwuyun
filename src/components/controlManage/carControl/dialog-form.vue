<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title" :modal-append-to-body="true" :append-to-body="true" size="bigest--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" :top="booleanFlag?'250px':'50px'" class="tactics-apply">
  <el-row>
    <el-col :span="17">
      <el-row>
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <div class="base-box">
            <el-col :span="12">
              <el-form-item prop="title" label="策略名称">
                <el-input v-model="booleanFlag ? form.title = name : form.title" placeholder="请输入策略名称" required="true" :disabled="editFlag"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="frequency" label="策略频率">
                <el-select v-if="dictList!==null" v-model="booleanFlag?form.frequency=data.frequency:form.frequency" style="width:100px;" :disabled="editFlag" placeholder="请选择">
                  <el-option v-for="item in dictList['BK_CLPL']" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!booleanFlag">
              <el-form-item prop="startTime" label="开始时间" required >
                <el-date-picker type="date"  :disabled="editFlag" v-model="form.startTimeVal" @change="v=>form.startTime=v" placeholder="请输入策略开始时间" :picker-options="pickerOPtions"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-else>
              <el-form-item prop="startTime" label="开始时间" required >
                <el-date-picker type="date"  :disabled="editFlag" v-model="data.startTime" @change="changeTime1" placeholder="请输入策略开始时间" :picker-options="pickerOPtions"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!booleanFlag">
              <el-form-item prop="endTime" label="结束时间" >
                <el-date-picker type="date" :disabled="editFlag" v-model="form.endTimeVal" @change="v=>form.endTime=v" placeholder="请输入策略结束时间" :picker-options="pickerOPtions2"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-else>
              <el-form-item prop="endTime" label="结束时间" >
                <el-date-picker type="date" :disabled="editFlag" v-model="data.endTime" @change="changeTime2" placeholder="请输入策略结束时间" :picker-options="pickerOPtions2"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="紧急程度">
                <el-select v-model="spjjcd" placeholder="">
                  <el-option v-for="item in urgentArr" :label="item.label" :value="item.key" :key="item.key" required="true"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="desc" label="简要概况">
                <el-input :disabled="editFlag" type="textarea" v-model="booleanFlag?form.desc=data.survey:form.desc" :rows="3" placeholder="请输入策略概况" required="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="通知方式">
                <el-checkbox-group v-model="form.notifType" >
                  <el-checkbox label="系统消息" :disabled="editFlag"></el-checkbox>
                  <el-checkbox label="邮件提醒" :disabled="editFlag"></el-checkbox>
                  <el-checkbox label="短信提醒" :disabled="editFlag"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="booleanFlag && editFlag">
              <!-- 详情 -->
              <!-- <el-form-item label="通知方式" v-if="data.noticePersonList.length>0">
                  {{noticePerson}}
              </el-form-item> -->
            </el-col>
            <el-col :span="24" v-else-if="booleanFlag && !editFlag">
              <!-- 编辑 -->
              <el-form-item label="选择通知人">
                <div>
                  <el-tag ref="tag" @close="handlerClose(item)" style="margin-right:10px;" v-for="item in editNoticePerson":key="item.userId" :text="`${item.userId},${item.name}`" type="gray" :closable="true">{{`${item.province}${item.city}${item.name}`}}</el-tag>
                </div>
                <el-input v-model="notifPersonCount" readonly style="width:160px;" placeholder="点击选择通知人" icon="icon iconfont icon-plus" :on-icon-click="openNotifPersonDialog"></el-input>
                <el-input v-model="notifUnitCount" readonly style="width:160px;" placeholder="点击选择通知单位" icon="icon iconfont icon-plus" :on-icon-click="openNotifUnitDialog"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-else>
              <!-- 申请 -->
              <el-form-item label="选择通知人">
                <el-input v-model="notifPersonCount" readonly style="width:160px;" placeholder="点击选择通知人" icon="icon iconfont icon-plus" :on-icon-click="openNotifPersonDialog"></el-input> 
                <el-input v-model="notifUnitCount" readonly style="width:160px;" placeholder="点击选择通知单位" icon="icon iconfont icon-plus" :on-icon-click="openNotifUnitDialog"></el-input>
              </el-form-item>
            </el-col>
             <!-- 通知本人 -->
             <el-col :span="24">
                <el-form-item label="通知本人">
                  <el-radio-group :disabled="editFlag" v-model="noticeSelf" @change="handleChangeNotice">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="booleanFlag">
              <!-- 详情 -->
              <el-form-item v-if="data.wjmc" prop="upload" label="文件">
                {{data.wjmc}}
              </el-form-item>
            </el-col>
            <el-col :span="12" v-else>
              <!-- 申请 -->
              <el-form-item prop="upload" label="上传附件">
                <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit">
                  <el-button slot="button" type="primary">上传附件</el-button>
                </upload>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="booleanFlag">
              <el-form-item label="已选策略">{{applyName}}</el-form-item>
            </el-col>
            <el-col :span="24"v-if="tacticContition.length!==0&&(editFlag||booleanFlag)">
              <el-form-item label="战法条件" >
                <span v-for="item1 in tacticContition">
                    {{`${item1.name}&nbsp&nbsp:&nbsp&nbsp${item1.value?item1.name === '入住时间'?timeChange(item1.value):item1.value:'不限'}&nbsp&nbsp&nbsp&nbsp&nbsp`}}
                </span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24" v-if="booleanFlag">
              <right-side v-loading="loading" ref="rightSide" :id="data.zfInfo.ID" mode="surveillance" :hideButton="true" @call:list="submit"></right-side>
            </el-col> -->
            <el-col :span="24" v-if="!booleanFlag">
              <el-form-item label="选择策略" class="rel" v-loading="listLoading">
                <el-table @cell-mouse-enter="cellMouseEnter" border :data="list" :height="480" @row-click="rowClick" highlight-current-row class="tactics-apply__table">
                  <el-table-column type="index" label="序号" align="center" width="60">
                    <template scope="scope">
                      {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
                    </template>
</el-table-column>
<el-table-column label="标题" prop="title"></el-table-column>
<el-table-column label="分类" prop="tag" align="center" width="120"></el-table-column>
<!-- <el-table-column label="简介" prop="desc"></el-table-column> -->
<el-table-column label="创建者" prop="author" align="center" width="120"></el-table-column>
</el-table>
</el-form-item>
</el-col>
<el-col>
  <el-form-item lale></el-form-item>
</el-col>
</div>
</el-form>
</el-row>
</el-col>

<el-col :span="7" style="min-height:100px; position:relative;" v-if="!booleanFlag">
  <div v-if="!tacticsId" :class="{empty:true,'empty--tips':true}" style="position:absolute">
    <span>请先从左边选择策略</span>
  </div>
  <div v-if="tacticsId" v-loading="loading" class="desc">
    <div class="desc__title">策略说明</div>
    <div v-if="tacticsInfo!==null" class="desc__content">
      <el-row>
        <el-col :span="24">
          <div class="item" style="display:flex;">
            <div class="label" style="width: 80px; flex-grow:1;text-align:right;margin-right:5px;">简介</div>
            <div class="value" style="flex-shrink:1">{{tacticsInfo.content}}</div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="item">
            <div class="label">战法名称</div>
            <div class="value">{{tacticsInfo.title}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="label">提供人</div>
            <div class="value">{{tacticsInfo.author}}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="label">版本号</div>
            <div class="value">{{tacticsInfo.version}}</div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="item">
            <div class="label">创建时间</div>
            <div class="value">{{tacticsInfo.postTime}}</div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="item">
            <div class="label">单位</div>
            <div class="value">{{tacticsInfo.org}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <right-side v-if="tacticsId" v-loading="loading" ref="rightSide" :id='tacticsId' mode="surveillance" :hideButton="true" @call:list="submit"></right-side>
</el-col>
</el-row>
<div slot="footer" class="dialog-footer">
  <el-button type="" v-if="type === 3" @click="editorEvent">完成</el-button>
  <el-button type="" v-if="type === 1" @click="closeEvent">取消</el-button>
</div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .base-box {
    padding-left: 10px;
    padding-right: 10px;
  }

  .input-new-tag {
    width: auto;
  }

  .el-form-item .el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }

  .desc {
    width: 100%;
    &__title {
      background: #199ed8;
      color: #fff;
      text-align: center;
      height: 38px;
      line-height: 38px;
      border: 1px solid #1c7dc6;
    }
    &__content {
      padding: 0 10px;
      border: 1px solid #ccc;
      border-top: 0;
      border-bottom: 0;
      .item {
        line-height: 32px;
        .label {
          color: #999;
          display: inline-block;
          &:after {
            content: ':';
          }
        }
        .value {
          color: #000;
          display: inline-block;
        }
      }
    }
  }

</style>
<style lang="scss">
  .tactics-apply {
    &__table {
      .el-table {
        &__body-wrapper {
          .el-table__body {
            .el-table__row.current-row>td {
              background: #FF9900;
              color: #fff;
            }
          }
        }
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_TACTICS_LIST, APPLY_TACTICS, GET_TACTICS_DETAIL, APPLY_EDIT, ADD_TO_DRAFT, UPDATE_DRAFT } from '../../../store/types'
  import mixin from '../../../utils/mixin'

  import { clone } from '../../../utils/util'

  import rightSide from '../../tactics/apply/leftSide'
  import upload from '../../../widgets/upload/upload'

  import '../../../utils/dateFormat'

  import dialogchooseNotifPerson from './dialog-chooseNotifPerson'

  export default {
    mixins: [mixin],
    components: {
      upload,
      rightSide,
      'dialog-notif-person': dialogchooseNotifPerson
    },
    data() {
      return {
        noticeSelf: '1', // 否通是否通知自己
        tacticsId: '',
        tacticsInfo: null,
        listLoading: false,
        list: [],
        booleanFlag: false, // 填充数据
        editFlag: false, // 编辑状态
        caseData: {
          wjmc: '',
          wjid: ''
        },
        pagenav: { currentpage: 1, limit: 20 },
        count: 0,
        pickerOPtions: {
          disabledDate(time) {
            return new Date(time).getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOPtions2: {
          disabledDate(time) {
            return new Date(time).getTime() < Date.now() - 8.64e7;
          }
        },
        flag: false,
        judge: false,
        forNewSave: false,
        checkList: [],
        inputVisible: false,
        inputValue: '',
        isFormalSubmit: false,
        notifType: [],
        attachmentSource: {
          id: '',
          table: ''
        },
        spjjcd: 0,
        urgentArr: [{
          key: 0,
          label: '平急24小时'
        }, {
          key: 1,
          label: '加急6小时'
        }, {
          key: 2,
          label: '特急4小时'
        }, {
          key: 3,
          label: '特急2小时'
        }],
        form: {
          id: '',
          dynamicTags: [],
          title: '',
          frequency: '1',
          startTime: '',
          endTime: '',
          startTimeVal: '',
          endTimeVal: '',
          desc: '',
          spjjcd: '', // 审批紧急程度 （字典 SPJJCD）（0：平急24小时、1：加急6小时、2：特急4小时、3：特题 2小时）
          keyowrd: [],
          features: '',
          notifType: ['系统消息'],
          notifPerson: [],
          notifUnit: [],
          ifdraft: '0',
          object_info: [],
          FileNames: '',
          visitAccessory: '',
          currentFiles: [],
          objPerson: []
        },
        rules: {
          title: {
            required: true,
            message: '请输入策略名称',
            trigger: 'blur'
          },
          desc: {
            required: 'true',
            message: '请输入简要概述',
            trigger: 'blur'
          },
          startTimeVal: {
            type: 'date',
            required: true,
            message: '请输入开始时间',
            trigger: 'change'
          },
          endTimeVal: {
            required: false,
            message: '请输入大于开始时间'
          },
          notifPersonCount: {
            required: 'true',
            message: '请输入通知人',
            trigger: 'change'
          },
          notifUnitCount: {
            message: '请输入通知单位',
            trigger: 'change'
          }
        },
        extPersonType: ''
      }
    },
    props: {
      dialog: [String, Number, Object, Boolean],
      url: [String, Number, Object],
      rad: [String, Number, Object],
      notifPerson: [String, Number, Object, Array],
      notifUnit: [String, Number, Object, Array],
      data: {
        type: Object,
        default: function() {
          return {}
        }
      },
      type: [String, Number, Object]
    },
    computed: {
      notifPersonCount() {
        let count = this.form.notifPerson.length
        return count === 0 ? '' : '已选' + count + '人'
      },
      notifUnitCount() {
        let count = this.form.notifUnit.length
        return count === 0 ? '' : '已选' + count + '个单位'
      },
      noticePerson() {
        let arr = []
        if (this.flag) {
          this.data.noticePersonList.map(item => {
            arr.push(item.PROVINCE + item.CITY + item.NAME)
          })
        }
        return arr.join();
      },
      applyName() {
        if (this.flag) {
          return this.data.zfInfo['ZFBT']
        } else {
          return ''
        }
      },
      editNoticePerson() {
        let arr = []
        if (this.data.noticePersonList && this.data.noticePersonList.length > 0) {
          this.data.noticePersonList.map(item => {
            arr.push({ name: item.NAME, province: item.PROVINCE, city: item.CITY, userId: item.USERID })
          })
        }
        return arr
      },
      title() {
        let title = ''
        if (this.type === 1) {
          title = '新增策略布控'
        } else if (this.type === 2) {
          title = '策略布控详情'
        } else {
          title = '编辑策略布控'
        }
        return title
      },
      name() {
        return this.data.name
      },
      tacticContition() {
        if (JSON.stringify(this.data) !== '{}') {
          if (this.data.tj.length === 0) {
            return this.data.tj
          } else {
            return this.data.tj[0].TJ2;
          }
        } else {
          return []
        }
      },
      ...mapState(['tactics'])
    },
    methods: {
      timeChange(val) {
        let re = new RegExp('\\d{1,2}', 'g')
        let arr = [];
        val.split('T').map(item => {
          arr.push(item.match(re).join(':'))
        })
        return arr.join('-')
      },
      changeTime1(val) {
        this.data.startTime = val;
      },
      changeTime2(val) {
        this.data.endTime = val;
      },
      initDialog() {
        this.tacticsId = ''
        if (this.type === 2) {
          this.notifTypeMethod();
        } else if (this.type === 3) {
          this.notifTypeMethod();
          this.fetchList()
          this.booleanFlag = true;
          this.editFlag = false;
        } else {
          this.fetchList()
          this.booleanFlag = false;
          this.editFlag = false;
          this.initForm()
          this.reset()
        }
      },
      initForm() {
        this.form = {
          id: '',
          dynamicTags: [],
          title: '',
          frequency: '1',
          startTime: '',
          endTime: '',
          startTimeVal: '',
          endTimeVal: '',
          desc: '',
          keyowrd: [],
          features: '',
          notifType: ['系统消息'],
          notifPerson: [],
          notifUnit: [],
          ifdraft: '0',
          spjjcd: 0,
          object_info: [],
          FileNames: '',
          visitAccessory: '',
          currentFiles: [],
          objPerson: []
        }
      },
      notifTypeMethod() {
        let arr = [],
          arr1 = [{ key: 'emailMsg', label: '邮件提醒' }, { key: 'teleMsg', label: '短信提醒' }, { key: 'systemMsg', label: '系统消息' }];
        arr1.map(item => {
          if (this.data[item.key] === '1') {
            arr.push(item.label)
          };
        })
        arr.length > 0 ? this.form.notifType = arr : ''
      },
      fetchList() {
        if (this.checkRule('zfsc/library/getzflist') === true) {
          this.listLoading = true
          this.dispatch(FETCH_TACTICS_LIST, {
            keyword: '',
            zflx: '', // 战法类型
            type: '', // 警种
            starttime: '', // 开始时间
            endtime: '', // 结束时间
            sort: '', // 排序（1：次数升序；2：次数降序；3：日期升序；4：日期降序）
            PageIndex: 1,
            PageSize: 999
          }).then(() => {
            this.list = this.tactics.list.PageData.map((d, i) => {
              return {
                id: d.id || d.ID,
                icon: d.tbm || d.TBM,
                title: d.zfbt || d.ZFBT || d.zfmc || d.ZFMC || '暂无',
                desc: d.zfgy || d.ZFGY,
                img: (i < 10 ? '0' + (i + 1) : (i + 1)),
                tag: d.zfflmc || d.ZFFLMC || '暂无',
                count: d.sycs || d.SYCS,
                author: d.cjr || d.CJR,
                org: d.dwmc || d.DWMC,
                postTime: d.xgsj || d.XGSJ,
                type: d.SSLX,
                collectionCount: d.sccs || d.SCCS,
                praiseCount: d.dzcs || d.DZCS,
                commentCount: d.plcs || d.PLCS,
                isPraise: d.dzStatus ? d.dzStatus === '1' : d.DZSTATUS === '1',
                isCollection: d.scStatus ? d.scStatus === '1' : d.SCSTATUS === '1',
                newType: d.xslx === 'LB' || d.XSLX === 'LB'
              }
            })
            this.count = this.tactics.list.DataCount
            this.listLoading = false
          })
        }
      },
      rowClick(row) {
        this.tacticsId = row.id
        this.dispatch(GET_TACTICS_DETAIL, {
          zfid: row.id
        }).then(() => {
          let d = this.tactics.detail.tacticsLibraryEntity
          this.tacticsInfo = {
            title: d.zfbt || d.ZFBT,
            author: d.cjr || d.CJR,
            content: d.zfjs || d.ZFJS,
            postTime: d.xgsj || d.XGSJ,
            org: d.dwmc || d.DWMC,
            version: d.bbh || d.BBH,
            type: d.SSLX || '',
            collectionCount: d.sccs || d.SCCS,
            praiseCount: d.dzcs || d.DZCS,
            commentCount: d.plcs || d.PLCS,
            stPraise: d.DZSTATUS,
            stcomment: d.SCSTATUS
          }
        })
        this.$nextTick(() => {
          this.$refs.rightSide.getQueryForm()
        })
      },
      reset() {
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
      },
      transfw(val) {
        if (val === '1') {
          return '全市'
        } else if (val === '2') {
          return '全省'
        } else {
          return '全国'
        }
      },
      //      修改草稿需要发不同的请求
      // 上传附件
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
      submit(tacticsQuery) {
        let personArr = this.form.notifPerson.map(d => {
          return { tzrid: d.tzrid }
        })
        let unitArr = this.form.notifUnit.map(d => {
          return { orgid: d.tzdwid }
        })
        if (this.form.endTime) {
          if (new Date(this.form.startTime).getTime() > new Date(this.form.endTime).getTime()) {
            this.$message({
              message: '结束时间要大于开始时间',
              type: 'warning',
              duration: 2000
            })
            return
          }
        }
        this.$refs.form.validate((valid) => {
          if (valid === true) {
            // this.$confirm('确定新增策略预警', '请确认', {
            //   confirmButtonText: '确认',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
            // let query = [...tacticsQuery.query]
            // query.forEach(d => {
            //   d.csz = tacticsQuery.form[d.column]
            // })
            let arr1 = [],
              arr2 = [];
            this.form.currentFiles.map(item => {
              arr1.push(item.name);
              arr2.push(item.id)
            })
            let wjid = arr2.join();
            let wjmc = arr1.join();
            let emailMsg = 0,
              systemMsg = 0,
              teleMsg = 0;
            this.form.notifType.map(item => {
              if (item === '系统消息') {
                systemMsg = 1
              } else if (item === '邮件提醒') {
                emailMsg = 1
              } else {
                teleMsg = 1
              }
            })
            let query = Object.assign(clone(tacticsQuery.form), {
              clmc: this.form.title, // 策略名称
              clpl: this.form.frequency, // 策略平率（1：一小时；2：六小时；3：十二小时；4：一天）
              kssj: this.form.startTime.split(' ')[0], // 开始时间
              jssj: this.form.endTime.split(' ')[0], // 结束时间
              jygk: this.form.desc, // 简要概况
              sfxttx: systemMsg, // 是否系统提醒（1：是；0：否）
              sfdxtx: teleMsg, // 是否短信提醒（1：是；0：否）
              sfyjtx: emailMsg, // 是否邮件提醒（1：是；0：否）
              wjid: wjid, // 文件ID（多个ID用 ， 隔开）
              wjmc: wjmc, // 文件名称（多个名称用 | 隔开）
              zfid: this.tacticsId,
              spjjcd: this.spjjcd,
              // object_info: query, // 策略条件
              notice_people: personArr, // 通知人员的ID
              notice_org: unitArr, // 通知单位的ID
              sftzbr: this.noticeSelf
            })
            let url = '';
            tacticsQuery.type === 'draft' ? url = ADD_TO_DRAFT : url = APPLY_TACTICS;
            this.dispatch(url, query).then(() => {
              this.$emit('success', { type: tacticsQuery.type })
              this.initForm()
            }).catch((res) => {
              console.log('提交失败', res);
            })
            // }).catch(() => {});
          } else {
            return false
          }
        })
      },
      closeEvent() {
        this.personDialog = false
        this.carDialog = false
        this.$emit('close')
        this.initForm()
      },
      // 上面筛选的三个方法 第一个是根据lybid 任何是根据gjz
      toJudgeObjinfoForFree() {
        if (this.form.personFeatures.length > 0 || this.form.carFeatures.length > 0 || this.form.dynamicTags.length > 0) {
          this.judge = true
        } else {
          this.judge = false
        }
      },
      openNotifPersonDialog() {
        this.$emit('openNotifPersonDialog')
      },
      openNotifUnitDialog() {
        this.$emit('openNotifUnitDialog')
      },

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
        }
        this.isFormalSubmit = false
        this.geteEnclosure()
      },
      handlerClose(tag) {
        // 关闭标签
        this.data.noticePersonList = this.data.noticePersonList.filter(item => {
          return item.USERID !== tag.userId
        })
      },
      // 是否通知本人提示语
      handleChangeNotice() {
        if (this.noticeSelf === '0') {
          this.$message({
            showClose: true,
            message: '系统将不会向您推送布控预警消息！',
            type: 'success',
            duration: 4000
          })
        }
      },
      editorEvent() { // 编辑事件
        // this.closeEvent()
        let obj = this.$refs.tag
        let arr = []
        if (obj && obj.length > 0) {
          obj.map(item => {
            let userId = item.text.split(',')[0];
            let name = item.text.split(',')[1];
            arr.push({ label: name, userId: userId, tzrid: userId })
          })
        }
        let unObj = {}
        if (this.form.notifPerson.length > 0) {
          arr.push(...this.form.notifPerson)
        }
        arr.map(item => {
          unObj[item.userId] ? unObj[item.userId]++ : unObj[item.userId] = 1
        })
        let arr1 = [],
          arr2 = [];
        this.form.currentFiles.map(item => {
          arr1.push(item.name);
          arr2.push(item.id)
        })
        let wjid = arr2.join();
        let wjmc = arr1.join();
        let emailMsg = 0,
          systemMsg = 0,
          teleMsg = 0;
        this.form.notifType.map(item => {
          if (item === '系统消息') {
            systemMsg = 1
          } else if (item === '邮件提醒') {
            emailMsg = 1
          } else {
            teleMsg = 1
          }
        })
        let query = {
          clmc: this.form.title, // 策略名称
          clpl: this.form.frequency, // 策略平率（1：一小时；2：六小时；3：十二小时；4：一天）
          kssj: this.data.startTime, // 开始时间
          jssj: this.data.endTime, // 结束时间
          jygk: this.form.desc, // 简要概况
          sfxttx: systemMsg, // 是否系统提醒（1：是；0：否）
          sfdxtx: teleMsg, // 是否短信提醒（1：是；0：否）
          sfyjtx: emailMsg, // 是否邮件提醒（1：是；0：否）
          wjid: wjid, // 文件ID（多个ID用 ， 隔开）
          wjmc: wjmc, // 文件名称（多个名称用 | 隔开）
          zfid: this.tacticsId,
          spjjcd: this.spjjcd,
          // object_info: query, // 策略条件
          notice_people: this.notifPersonCount, // 通知人员的ID
          notice_org: this.notifUnitCount, // 通知单位的ID\
          sftzbr: this.noticeSelf
        }
        this.dispatch(UPDATE_DRAFT, query).then(() => {
          this.$emit('success')
          this.initForm()
        }).catch((res) => {
          console.log('提交失败', res);
        })
        this.$message('修改成功!')
        console.log(APPLY_EDIT)
      }
    },
    watch: {
      url(val) {
        this.loadData(val)
        this.forNewSave = true
      },
      rad(val) {
        this.reset()
        this.forNewSave = false
      },
      notifUnit(val) {
        this.form.notifUnit = this.notifUnit;
      },
      notifPerson(val) {
        this.form.notifPerson = this.notifPerson;
      },
      data(val) {
        if (JSON.stringify(val) !== '{}') {
          this.flag = true;
        }
      },
      type(newVal, oldVal) {
        if (newVal === 1) { // 申请入口
          this.booleanFlag = false;
          this.editFlag = false
        } else if (newVal === 2) { // 详情入口
          this.booleanFlag = true;
          this.editFlag = true
        } else { // 编辑入口
          this.form.startTimeVal = this.data.startTime
          this.booleanFlag = true;
          this.editFlag = false;
        }
      }
    },
    mounted() {},
    created() {
      // this.form.notifPerson = [];
      // this.form.notifUnit = [];
      this.getDict(['BK_CLPL']).then(res => {
        this.dictList = res
      })
    }
  }

</script>
