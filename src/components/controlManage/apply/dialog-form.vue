<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="新增布控" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <div class="base-box">
        <el-row>
        <el-col :span="12">
          <el-form-item prop="title" label="布控名称">
            <el-input v-model="form.title" placeholder="请输入布控名称" required="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="range" label="数据范围">
            <el-radio-group v-model="form.range">
              <el-radio label="全市"></el-radio>
              <el-radio label="全省"></el-radio>
              <el-radio label="全国"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        </el-row>
        
        <el-row>
        <el-col :span="12">
          <el-form-item label="紧急程度">
            <el-select v-model="spjjcd" placeholder="">
              <el-option v-for="item in urgentArr" :label="item.label" :value="item.key" :key="item.key" required="true"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="frequency" label="布控频率">
            <el-radio-group v-model="form.frequency" placeholder="">
              <el-radio key="1" label="1小时"></el-radio>
              <el-radio key="2" label="6小时"></el-radio>
              <el-radio key="3" label="12小时"></el-radio>
              <el-radio key="4" label="一天"></el-radio>
              <!--<el-radio key="5" label="一周"></el-radio>--> 
              <!--<el-radio key="6" label="一月"></el-radio>-->
            </el-radio-group>
          </el-form-item>
        </el-col>
        
  </el-row>


        <el-col :span="12">
          <el-form-item prop="startTime" label="开始时间">
            <el-date-picker v-model="form.startTime" placeholder="请输入布控开始时间" :picker-options="pickerOPtions"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="endTime" label="结束时间">
            <el-date-picker v-model="form.endTime" placeholder="请输入布控结束时间" :picker-options="pickerOPtions2"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item prop="desc" label="简要概况">
            <el-input type="textarea" v-model="form.desc" placeholder="请输入布控概况" required="true"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="upload" label="上传附件">
            <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="form.currentFiles">
              <el-button slot="button" type="primary">上传附件</el-button>
            </upload>
          </el-form-item>
        </el-col>

        <!--<el-col :span="24">-->
        <!--<el-form-item label="审核人">-->
        <!--<el-select v-model="extPersonType" placeholder="请选择审核人类型">-->
        <!--<el-option key="1" value="上级审批"></el-option>-->
        <!--<el-option key="2" value="选项二"></el-option>-->
        <!--</el-select>-->
        <!--<el-checkbox-group v-if="extPersonType!==''" v-model="form.extPerson">-->
        <!--<el-checkbox v-for="(item,i) in extPersonOps" :key="i" :label="item"></el-checkbox>-->
        <!--</el-checkbox-group>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-form-item label="布控对象" class="rel">
            <el-tabs :value="tabsType">
              <el-tab-pane label="人员" name="people">
                <el-button type="primary" class="btn-add-obj" size="small" icon="plus" @click="sorry()" v-if="!hiddenBtn">
                  添加人员
                </el-button>
                <person @checkedValue="checkedValue" :value="form.personFeatures" :detail="detaildeltel" class="person-box"></person>

                <!-- <el-form-item class="features-dispatchd"
                              label="布控特征">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="(item,i) in personFeaturesOps"
                                 :label="item"
                                 :key="i"
                                 disabled></el-checkbox>
                  </el-checkbox-group>
                </el-form-item> -->
              </el-tab-pane>
              <el-tab-pane label="车辆" name="car">
                <!-- carDialog=true -->
                <el-button type="primary" class="btn-add-obj" size="small" icon="plus" @click="forcar()" v-if="!hiddenBtn">添加车辆
                </el-button>
                <car :value="form.carFeatures" :detail="detaildeltel" class="car-box"></car>
                <!-- <el-form-item class="features-dispatchd" label="布控特征">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox v-for="(item,i) in carFeaturesOps" :label="item" :key="i" disabled></el-checkbox>
                  </el-checkbox-group>
                </el-form-item> -->
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="关键字">
            <!--<words v-model="form.keyword" :options="wordsOps"></words>-->
            <el-tag :key="tag" v-for="tag in form.dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)" type="primary">{{tag}}
            </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" @key.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
            <el-button v-else size="small" @click="showInput">+关键字</el-button>
          </el-form-item>
        </el-col>

        <el-col :span="11">
          <el-form-item label="通知方式">
            <el-checkbox-group v-model="form.notifType">
              <el-checkbox label="系统消息"></el-checkbox>
              <el-checkbox label="邮件提醒"></el-checkbox>
              <el-checkbox label="短信提醒"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <el-col :span="7">
          <el-form-item label="选择通知人">
            <el-input v-model="notifPersonCount" readonly style="width:150px;" placeholder="点击选择通知人" icon="icon iconfont icon-plus" :on-icon-click="openNotifPersonDialog"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="通知本人">
            <el-radio-group v-model="form.noticeSelf" @change="handleChangeNotice">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </div>
    </el-form>
  </el-row>

  <img src="" alt="">
  <!-- 草稿编辑 -->
  <div slot="footer" class="dialog-footer" v-if="editType==='draftEdit'">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="" @click="save">保存草稿</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
  <!-- 申请 -->
  <div slot="footer" class="dialog-footer" v-if="editType !=='draftEdit'">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="" @click="editSave">保存草稿</el-button>
    <el-button type="primary" @click="editSubmit">确定</el-button>
  </div>


  <!--<dialog-person :dialog="personDialog" type="person" @close="personDialog=false"></dialog-person>-->

  <!-- <object-selector-dialog :dialog="personDialog" type="person" size="full" v-model="form.personFeatures" @close="personDialog=false"></object-selector-dialog> -->

  <object-selector-dialog-car :dialog="carDialog" type="car" size="middle--user" v-model="form.carFeatures" @close="carDialog=false"></object-selector-dialog-car>

  <!--<dialog-car :dialog="carDialog" type="car" @close="carDialog=false"></dialog-car>-->
  <!--<dialog-notif-person :dialog="chooseNotifPersonDialog" @update:value="val=>form.notifPerson=val"-->
  <!--@close="chooseNotifPersonDialog=false"></dialog-notif-person>-->
  <user-selector :dialog="chooseNotifPersonDialog" @update:value="val=>form.notifPerson=val" size="middle--user" @close="chooseNotifPersonDialog=false"></user-selector>

</el-dialog>
</template>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0;
  }

  .btn-add-obj {
    position: absolute;
    top: -35px;
    right: 0;
    z-index: 2;
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
    padding-top: 10px;
    height: auto;
  }

  .el-form-item .el-tag {
    margin-right: 10px;
  }

  .input-new-tag {
    width: auto;
  }

  .car-box {
    height: auto;
    overflow: auto;
  }

  .person-box {
    height: auto;
    overflow: auto;
  }

  .el-tabs {
    margin-bottom: 5px;
  }

  .el-form-item .el-form-item {
    margin-bottom: 0;
    margin-top: 10px;
  }

  .features-dispatchd {
    margin-left: -25px;
  }

</style>
<script>
  import upload from '../../../widgets/upload/upload.vue'
  import mixin from '../../../utils/mixin'
  import words from '../../../widgets/words/words'
  import objectselectordialog from '../../../widgets/object-selector-dialog/object-selector-dialog'
  import userselector from '../../../widgets/user-selector/user-selector'

  import '../../../utils/dateFormat'

  import person from './person'
  import car from './car'

  import dialogChoose from './dialog-choose'
  import dialogchooseNotifPerson from './dialog-chooseNotifPerson'

  import { ADD_CONTROL_MANAGE, GET_DISPATCH, UPDATE_CONTROL_MANAGE_DRAFT } from '../../../store/types'
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input';
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button';
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    components: {
      ElButton,
      ElInput,
      person,
      car,
      words,
      upload,
      'dialog-person': dialogChoose,
      'dialog-car': dialogChoose,
      'dialog-notif-person': dialogchooseNotifPerson,
      // 'object-selector-dialog': objectselectordialog,
      'object-selector-dialog-car': objectselectordialog,
      'user-selector': userselector
    },
    data() {
      return {
        pickerOPtions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOPtions2: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
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
        unCheckedValue: [],
        tips: '',
        tabsType: 'people',
        judge: false,
        forNewSave: false,
        detaildeltel: true,
        checkList: [],
        inputVisible: false,
        inputValue: '',
        isFormalSubmit: false,
        attachmentSource: {
          id: '',
          table: ''
        },
        rules: {
          title: {
            required: 'true',
            message: '请输入布控名称',
            trigger: 'blur'
          },
          desc: {
            required: 'true',
            message: '请输入简要概述',
            trigger: 'blur'
          },
          startTime: {
            required: 'true',
            message: '请输入开始时间'
          },
          endTime: {
            required: 'true',
            message: '请输入大于开始时间'
          },
          notifPersonCount: {
            required: 'true',
            message: '请输入通知人',
            trigger: 'change'
          }
        },
        personDialog: false,
        carDialog: false,
        chooseNotifPersonDialog: false,
        tagsOptions: [],
        extPersonType: '',
        personFeaturesOps: ['姓名', '身份证', '邮箱', '手机号', '银行账号', '座机号码'],
        carFeaturesOps: ['车牌号', '车辆识别号'],
        wordsOps: ['团伙', '杀人'],
        spjjcd: 0, // 审批紧急程度 （字典 SPJJCD）（0：平急24小时、1：加急6小时、2：特急4小时、3：特题 2小时）
        form: {
          id: '',
          bkly: '',
          dynamicTags: [],
          title: '',
          noticeSelf: '1', // 是否通知自己
          range: '全国',
          frequency: '1小时',
          startTime: this.formatDate(new Date(), 'yyyy-MM-dd'),
          endTime: this.formatDate(new Date(new Date().valueOf() + 3600 * 1000 * 24 * 30), 'yyyy-MM-dd'),
          desc: '',
          extPerson: [],
          personFeatures: [],
          carFeatures: [],
          keyowrd: [],
          features: '',
          notifType: ['系统消息'],
          notifPerson: [],
          ifdraft: '0',
          object_info: [],
          FileNames: '',
          visitAccessory: '',
          currentFiles: [],
          objPerson: []
        },
        notifPerson: []
      }
    },
    // type 是用来区分布控人员还是车辆的
    props: ['dialog', 'url', 'rad', 'peopleObj', 'type', 'personFeatures', 'editType', 'hiddenBtn'],
    computed: {
      notifPersonCount() {
        let count = this.form.notifPerson.length
        return count === 0 ? '' : '已选' + count + '人'
      },
      ...mapState(['surveillance']),
      extPersonOps() {
        let ops
        switch (this.extPersonType) {
          case '上级审批':
            ops = ['张高峻', '礼志国', '典明伟']
            break;
          case '选项二':
            ops = ['李德运', '江昆鹏']
            break;
          default:
            ops = []
        }
        this.form.extPerson = []
        return ops
      }
    },
    methods: {
      sorry() {
        this.$emit('update:selector', this.form.personFeatures)
      },
      forcar() {
        this.carDialog = true
      },
      reset() {
        this.form = {
          id: '',
          dynamicTags: [],
          title: '',
          range: '全国',
          frequency: '1小时',
          startTime: this.formatDate(new Date(), 'yyyy-MM-dd'),
          endTime: this.formatDate(new Date(new Date().valueOf() + 3600 * 1000 * 24 * 30), 'yyyy-MM-dd'),
          desc: '',
          noticeSelf: '1', // 默认通知本人
          extPerson: [],
          personFeatures: [],
          carFeatures: [],
          keyowrd: [],
          features: '',
          notifType: ['系统消息'],
          notifPerson: [],
          ifdraft: '0',
          object_info: [],
          FileNames: '',
          visitAccessory: '',
          currentFiles: [],
          objPerson: []
        };
        if (this.$refs.form) {
          this.$refs.form.resetFields()
        }
      },
      loadData(url) {
        if (url) {
          this.dispatch(GET_DISPATCH, {
            id: url
          }).then(() => {
            this.form.id = this.surveillance.detail.id
            this.form.title = this.surveillance.detail.bkmc
            this.form.range = this.surveillance.detail.sjfw
            this.form.noticeSelf = this.surveillance.detail.sftzbr
            this.form.frequency = this.getRightfre(this.surveillance.detail.bkpl)
            this.form.startTime = this.surveillance.detail.kssj
            this.form.endTime = this.surveillance.detail.jssj
            this.form.desc = this.surveillance.detail.jygk
            this.form.personFeatures = this.getObjPerson(this.surveillance.detail.object_info)
            this.form.carFeatures = this.getCarObj(this.surveillance.detail.object_info)
            this.getFeature(this.surveillance.detail.object_info)
            this.form.dynamicTags = this.getTags(this.surveillance.detail.object_info)
            this.form.notifType = this.getNotice(this.surveillance.detail)
            this.form.wjid = this.surveillance.detail.wjid
            this.form.notifPerson = this.surveillance.detail.notice_people
            this.form.visitAccessory = this.surveillance.detail.wjid
            this.form.FileNames = this.surveillance.detail.wjmc
            this.geteEnclosure()
          }).then(() => {})
        } else {
          this.reset()
        }
      },
      dynamicTags() { // 检查关键字是否重复添加
        let tipsKeyword = []
        if (this.form.dynamicTags.length > 0) {
          let arr = this.form.dynamicTags;
          let obj = {}
          arr.map(item => {
            obj[item] ? obj[item]++ : obj[item] = 1
          })
          for (let item in obj) {
            if (obj[item] > 1) {
              tipsKeyword.push(`关键字"${item}"已添加`);
            }
          }
          this.form.dynamicTags = Object.keys(obj)
        }
        return tipsKeyword.join()
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
      getObjPerson(arr) {
        let oneperson = []
        let personobj = []
        let dxlx = arr.filter(d => d.dxlx === '1')
        dxlx.forEach((d, i) => {
          oneperson.push(dxlx.filter(c => c.lybid === d.lybid));
        })
        oneperson.forEach((d, i) => {
          if (d.length === 1) {
            d.forEach((e, i) => {
              // if(e.tzlx === '1') {
              //   personobj.push({
              //     name: e.gjz,
              //     lybid: e.lybid
              //   })
              // }
              if (e.tzlx === '2') {
                personobj.push({
                  idCard: e.gjz,
                  lybid: e.lybid,
                  name: e.sfzxm,
                  lylx: e.lylx
                })
              }
            })
          }
          if (d.length > 1) {
            let obj = {}
            d.forEach((e, i) => {
              // if(e.tzlx === '1') {
              //   obj.name = e.gjz
              //   obj.lybid = e.lybid
              // }
              if (e.tzlx === '2') {
                obj.idCard = e.gjz
                obj.lybid = e.lybid
                obj.name = e.sfzxm
                obj.lylx = e.lylx
              }
            })
            personobj.push(obj)
          }
        })
        return this.getMyonlyArray(personobj)
      },
      getCarObj(arr) {
        let onecar = []
        let carobj = []
        let dxlx = arr.filter(d => d.dxlx === '2')
        dxlx.forEach((d, i) => {
          onecar.push(dxlx.filter(c => c.lybid === d.lybid));
        })
        onecar.forEach((d, i) => {
          if (d.length === 1) {
            d.forEach((e, i) => {
              if (e.tzlx === '7') {
                carobj.push({
                  carNum: e.gjz,
                  lybid: e.lybid,
                  lylx: e.lylx
                })
              }
              if (e.tzlx === '8') {
                carobj.push({
                  brand: e.gjz,
                  lybid: e.lybid,
                  lylx: e.lylx
                })
              }
            })
          }
          if (d.length > 1) {
            let obj = {}
            d.forEach((e, i) => {
              if (e.tzlx === '7') {
                obj.carNum = e.gjz
                obj.lybid = e.lybid
                obj.lylx = e.lylx
              }
              if (e.tzlx === '8') {
                obj.brand = e.gjz
                obj.lybid = e.lybid
                obj.lylx = e.lylx
              }
            })
            carobj.push(obj)
          }
        })
        return this.getMyonlyArray(carobj)
      },
      getFeature(val) {
        for (let i = 0; i < val.length; i++) {
          val[i].index = i
          if (val[val[i].index].tzlx === '2') {
            this.checkList.push('身份证')
            //            return this.checkList
          }
          if (val[val[i].index].tzlx === '1') {
            this.checkList.push('姓名')
          }
        }
      },
      getTags(val) {
        let array = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].dxlx === '3') {
            array.push(val[i].gjz)
          }
        }
        return array
      },
      getNotice(obj) {
        let not = []
        if (obj.sfxttx === '1') {
          not.push('系统消息')
        }
        if (obj.sfyjtx === '1') {
          not.push('邮件提醒')
        }
        if (obj.sfdxtx === '1') {
          not.push('短信提醒')
        }
        return not
      },
      getRightfre(val) {
        if (val === '1') {
          return '1小时'
        } else if (val === '2') {
          return '6小时'
        } else if (val === '3') {
          return '12小时'
        } else {
          return '一天'
        }
      },

      // 上面是接入的
      updateDraft(obj) {
        this.getThisType(this.form)
        this.itsRange(this.form)
        this.itsFrequency(this.form)
        this.getNoticPerson(this.form)
        this.getobjtype(this.form)
        this.formatTime(this.form)
        this.dispatch(UPDATE_CONTROL_MANAGE_DRAFT, {
          id: obj.id,
          bkmc: obj.title === '' ? (this.$alert('请输入布控名称', '温馨提示')) : obj.title,
          sjfw: obj.range,
          sftzbr: obj.noticeSelf,
          bkpl: this.itsFrequency(obj),
          kssj: this.dateFormat(new Date(obj.startTime), 'yyyy-MM-dd'),
          jssj: this.dateFormat(new Date(obj.endTime), 'yyyy-MM-dd'),
          jygk: obj.desc,
          sfxttx: obj.sfxttx,
          sfdxtx: obj.sfdxtx,
          sfyjtx: obj.sfyjtx,
          draft: obj.ifdraft,
          wjid: obj.visitAccessory,
          wjmc: obj.FileNames,
          object_info: this.getObjInfo(),
          notice_people: obj.notifPerson
        }).then(() => {
          // window.location.reload()
          // this.$emit('call:change-update')
          // 更新草稿箱
          this.$emit('update-draft-list', {}, 6)
        })
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
      handleClose(tag) {
        this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1)
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        })
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.tips = '';
          this.form.dynamicTags.push(...inputValue.split(','))
          this.tips = this.dynamicTags();
          if (this.tips) {
            this.$message(this.tips)
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      initDialog() {
        if (this.form.personFeatures.length) {
          this.tabsType = 'people'
        } else if (this.form.carFeatures.length && !this.form.personFeatures.length) {
          this.tabsType = 'car'
        } else {
          this.tabsType = 'people'
        }
        if (this.peopleObj !== undefined && this.type !== 'car') {
          this.form.personFeatures = []
          this.form.title = (this.peopleObj.xm || this.peopleObj.name) + '的布控'
          this.form.range = '全市'
          this.itsRange(this.form)
          this.form.personFeatures.push({
            city: this.peopleObj.cjrdwmc || this.peopleObj.city || '',
            id: this.peopleObj.id || this.peopleObj.id || '',
            idCard: this.peopleObj.sfz || this.peopleObj.idCard || '',
            lybid: this.peopleObj.lybid || this.peopleObj.id || '',
            lylx: this.peopleObj.lylx || this.peopleObj.lylx || '',
            mark: '',
            name: this.peopleObj.xm || this.peopleObj.name || '',
            sex: this.peopleObj.xbmc || this.peopleObj.sex || ''
          })
        }
        if (this.type === 'car') {
          this.form.carFeatures = []
          this.form.title = (this.peopleObj.cphm || this.peopleObj.no) + '的布控'
          this.form.range = '全市'
          this.itsRange(this.form)
          this.form.carFeatures.push({
            carNum: this.peopleObj.cphm || this.peopleObj.no,
            carColor: this.peopleObj.clysmc || this.peopleObj.sign,
            brand: this.peopleObj.pp,
            xm: '',
            mark: '',
            lybid: this.peopleObj.lybid || this.peopleObj.id || '',
            lylx: this.peopleObj.lylx,
            tpid: ''
          })
        }
      },
      checkedValue(val) {
        this.unCheckedValue = val
      },
      // 草稿箱保存按钮
      save() {
        this.toJudgeObjinfoForFree()
        this.form.ifdraft = '1'
        this.$refs.form.validate((valid) => {
          if (valid === true && this.judge === true) {
            this.$confirm('确认修改布控预警草稿', '请确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.getMyonlyArray(this.form.object_info)
              this.updateDraft(this.form)
              this.closeEvent()
            }).catch(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '请输入布控内容',
              showClose: true
            })
            return false
          }
        })
      },
      addData(obj) {
        this.getThisType(this.form)
        this.itsRange(this.form)
        this.itsFrequency(this.form)
        this.getNoticPerson(this.form)
        this.getobjtype(this.form)
        this.formatTime(this.form)
        this.dispatch(ADD_CONTROL_MANAGE, {
          bkmc: obj.title,
          sjfw: obj.range,
          bkpl: this.itsFrequency(obj),
          sftzbr: obj.noticeSelf,
          kssj: this.dateFormat(new Date(obj.startTime), 'yyyy-MM-dd'),
          jssj: this.dateFormat(new Date(obj.endTime), 'yyyy-MM-dd'),
          jygk: obj.desc,
          sfxttx: obj.sfxttx,
          sfdxtx: obj.sfdxtx,
          sfyjtx: obj.sfyjtx,
          draft: obj.ifdraft,
          wjid: obj.visitAccessory,
          wjmc: obj.FileNames,
          spjjcd: this.spjjcd,
          object_info: this.getObjInfo(),
          notice_people: obj.notifPerson
        }).then(d => {
          this.$emit('call:change-update')
          this.$emit('update-draft-list')
          this.$message({
            message: '布控成功！',
            type: 'success'
          })
        })
      },
      // 草稿箱确认按钮
      submit() {
        this.toJudgeObjinfoForFree()
        this.form.ifdraft = '0'
        this.$refs.form.validate((valid) => {
          if (valid === true && this.judge === true) {
            this.$confirm('确定新增布控预警', '请确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.closeEvent()
              // this.addData(this.form)
              this.updateDraft(this.form)
              this.$message({
                message: '布控成功！',
                type: 'success'
              })
            }).catch(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '请输入布控内容',
              showClose: true
            })
            return false
          }
        })
      },
      formatTen(num) {
        return num > 9 ? (num + '') : ('0' + num);
      },
      formatDate(date) {
        if (typeof date === 'string') {
          return date
        } else {
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + this.formatTen(month) + '-' + this.formatTen(day)
        }
      },
      itsRange(obj) {
        let range = ''
        if (obj.range === '全省') {
          range = '2'
        }
        if (obj.range === '全市') {
          range = '1'
        }
        if (obj.range === '全国') {
          range = '3'
        }
        return range
      },
      itsFrequency(obj) {
        let frequency = ''
        if (obj.frequency === '1小时') {
          frequency = '1'
        }
        if (obj.frequency === '6小时') {
          frequency = '2'
        }
        if (obj.frequency === '12小时') {
          frequency = '3'
        }
        if (obj.frequency === '一天') {
          frequency = '4'
        }
        return frequency
      },
      formatTime(obj) {
        let date = new Date(obj.startTime)
        let enddate = new Date(obj.endTime)

        if (date > enddate) {
          this.$alert('布控开始时间应该小于结束时间，请重新输入', '温馨提示');
          obj.startTime = '';
          obj.endTime = ''
        }
      },
      closeEvent() {
        this.personDialog = false
        this.carDialog = false
        this.chooseNotifPersonDialog = false
        this.$emit('close')
      },
      getObjInfo() {
        let arr = [];
        this.form.personFeatures.map(item => {
          item.keywordList.map(item1 => {
            let jsonData = {}
            jsonData.tzlx = item1.tzlx
            jsonData.dxlx = item1.dxlx
            jsonData.gjz = item1.gjz
            jsonData.lybid = item1.lybid
            jsonData.lylx = item1.lylx
            arr.push(jsonData)
          })
        })
        arr = arr.filter(item => {
          return !this.unCheckedValue.some(item1 => {
            return item1.tzlx === item.tzlx && item.lybid === item.lybid && item.gjz === item1.gjz
          })
        })
        return arr
      },
      getThisType(obj) {
        if (obj.notifType.indexOf('系统消息') > -1) {
          obj.sfxttx = '1'
        } else {
          obj.sfxttx = '0'
        }
        if (obj.notifType.indexOf('邮件提醒') > -1) {
          obj.sfyjtx = '1'
        } else {
          obj.sfyjtx = '0'
        }
        if (obj.notifType.indexOf('短信提醒') > -1) {
          obj.sfdxtx = '1'
        } else {
          obj.sfdxtx = '0'
        }
        return obj
      },
      getcheckList() {
        this.checkList = []
        this.form.personFeatures.map(d => {
          if (d.name) {
            this.checkList.push('姓名')
          }
          if (d.idCard) {
            this.checkList.push('身份证')
          }
        })
        this.form.carFeatures.map(d => {
          if (d.carNum) {
            this.checkList.push('车牌号')
          }
        })
      },
      // todo 这里要delete掉其他key，只剩下一个id
      getNoticPerson(obj) {
        if (!obj.notifPerson) {
          this.$message({
            type: 'error',
            message: '请输入布控联系人',
            showClose: true
          })
        }
        for (let i = 0; i < obj.notifPerson.length; i++) {
          delete obj.notifPerson[i].label
          delete obj.notifPerson[i].key
        }
        return obj
      },
      //  todo  这里要加入人员的部分还有关键字的部分  还差车辆的部分   这里现在还差一些具体的选择
      getobjtype(obj) {
        obj.object_info = []
        for (let i = 0; i < obj.personFeatures.length; i++) {
          if (obj.personFeatures[i].idCard) {
            obj.object_info.push({
              tzlx: '2',
              dxlx: '1',
              gjz: obj.personFeatures[i].idCard,
              lybid: obj.personFeatures[i].lybid,
              lylx: obj.personFeatures[i].lylx
            })
          }
          // 不传姓名只传身份证
          // if(obj.personFeatures[i].name) {
          //   obj.object_info.push({
          //     tzlx: '1',
          //     dxlx: '1',
          //     gjz: obj.personFeatures[i].name,
          //     lybid: obj.personFeatures[i].lybid,
          //     lylx: obj.personFeatures[i].lylx
          //   })
          // }
          // 不传备注
          // if(obj.personFeatures[i].mark) {
          //   obj.object_info.push({
          //     tzlx: '6',
          //     dxlx: '1',
          //     gjz: obj.personFeatures[i].mark,
          //     lybid: obj.personFeatures[i].lybid,
          //     lylx: obj.personFeatures[i].lylx
          //   })
          // }
        }
        // todo:车
        for (let i = 0; i < obj.carFeatures.length; i++) {
          if (obj.carFeatures[i].carNum) {
            obj.object_info.push({
              tzlx: '7',
              dxlx: '2',
              gjz: obj.carFeatures[i].carNum,
              lybid: obj.carFeatures[i].lybid,
              lylx: obj.carFeatures[i].lylx
            })
          }
          // 不传品牌
          // if(obj.carFeatures[i].brand) {
          //   obj.object_info.push({
          //     tzlx: '8',
          //     dxlx: '2',
          //     gjz: obj.carFeatures[i].brand,
          //     lybid: obj.carFeatures[i].lybid,
          //     lylx: obj.carFeatures[i].lylx
          //   })
          // }
        }
        //
        for (let i = 0; i < obj.dynamicTags.length; i++) {
          obj.object_info.push({
            tzlx: '',
            dxlx: '3',
            gjz: obj.dynamicTags[i],
            lybid: ''
          })
        }
        return this.getMyonlyArray(obj.object_info)
      },
      getMyonlyArray(array) {
        let newArray = []
        for (let i = 0; i < array.length; i++) {
          let flag = true
          // let n = newArray.length
          for (let j = 0; j < newArray.length; j++) {
            if (array[i].lybid === newArray[j].lybid) {
              flag = false
            }
          }
          if (flag) {
            newArray.push(array[i])
          }
        }
        return newArray
      },
      // 上面筛选的三个方法 第一个是根据lybid 任何是根据gjz
      toJudgeObjinfoForFree() {
        if (this.form.personFeatures.length > 0 || this.form.carFeatures.length > 0 || this.form.dynamicTags.length > 0) {
          this.judge = true
        } else {
          this.judge = false
        }
      },
      // 判断下我们的对象布控是否为空
      openNotifPersonDialog() {
        this.chooseNotifPersonDialog = true
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
      // 申请保存草稿
      editSave() {
        this.toJudgeObjinfoForFree()
        this.form.ifdraft = '1'
        this.$refs.form.validate((valid) => {
          if (valid === true && this.judge === true) {
            this.$confirm('确定新增布控预警草稿？', '请确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.getMyonlyArray(this.form.object_info)
              this.addData(this.form)
              this.closeEvent()
            }).catch(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '请输入布控内容',
              showClose: true
            })
            return false
          }
        })
      },
      // 申请确认按钮
      editSubmit() {
        this.toJudgeObjinfoForFree()
        this.form.ifdraft = '0'
        this.$refs.form.validate((valid) => {
          if (valid === true && this.judge === true) {
            this.$confirm('确定新增布控预警', '请确认', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.addData(this.form)
              this.closeEvent()
            }).catch(() => {});
          } else {
            this.$message({
              type: 'error',
              message: '请输入布控内容',
              showClose: true
            })
            return false
          }
        })
      },
      // 是否通知本人提示语
      handleChangeNotice() {
        if (this.form.noticeSelf === '0') {
          this.$message({
            showClose: true,
            message: '系统将不会向您推送布控预警消息！',
            type: 'success',
            duration: 4000
          })
        }
      }
    },
    watch: {
      'form.personFeatures' (val) {
        if (val) {
          this.getcheckList()
        }
      },
      'form.carFeatures' (val) {
        if (val) {
          this.getcheckList()
        }
      },
      url(val) {
        this.loadData(val)
        this.forNewSave = true
      },
      rad(val) {
        this.reset()
        this.forNewSave = false
      },
      personFeatures(val) {
        this.form.personFeatures = val
      }
    },
    mounted() {
      if (this.type) {
        this.tabsType = this.type
      }
    }
  }

</script>
