<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="布控详情" :modal-append-to-body="true" :append-to-body="true" size="bigest" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" v-loading="loading">
  <el-row>
    <el-col :span="24">
      <div :class="{'detail-box':true,'detail-box--m':showCtrl === true}">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="title" label="布控名称">
                {{form.title}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="range" label="数据范围">
                {{form.range}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="startTime" label="开始时间">
                {{form.startTime}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="endTime" label="结束时间">
                {{form.endTime}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="desc" label="布控频率">
                {{form.frequency}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="desc" label="创建时间">
                {{form.createTime}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="desc" label="紧急程度">
                {{spjjcd}}
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item prop="desc" label="简要概况">
                {{form.desc}}
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="bktype!=='0'&&bktype!=='1'">
              <el-form-item prop="controlCount" label="布控申请次数">
                {{form.controlCount}}
              </el-form-item>
            </el-col>

            <el-col :span="24" v-if="bktype!=='0'&&bktype!=='1'">
              <el-form-item prop="continuReason" label="续控原因">
                {{form.continuReason}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="upload" label="上传附件" v-if="(form.currentFiles.length>0)">
                <a v-for="file in form.currentFiles" :href="downloadFilePath+file.id" class="accessory">{{file.name}}</a>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="布控对象" class="rel" v-if="bktype === '3'">
                <el-tabs>
                  <el-tab-pane label="人员">
                    <person :value="form.objPerson" :detail="detailperson"></person>

                    <!-- <el-form-item class="features-dispatchd" label="布控特征">
                      {{form.features || '无'}}
                    </el-form-item> -->
                  </el-tab-pane>
                  <el-tab-pane label="车辆">
                    <car :value="form.carObj" :detail="detailcar"></car>

                    <!-- <el-form-item class="features-dispatchd" label="布控特征">
                      {{form.carFeatures || '无'}}
                    </el-form-item> -->
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="关键字" v-if="bktype === '3'">
                <!-- {{form.tags || '无'}} -->
                <span v-html="form.tags.length?form.tags:'无'" style="margin-right:10px"></span>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="布控条件" v-if="bktype !== '3'">
                <!-- <div class="app-table" style="padding:5px;box-sizing:border-box;overflow:hidden" v-if="bktj.length>0">
                  <el-col :span="12" v-for="elem in bktj" :key="elem.label">
                    <el-form-item :prop="elem.csz" :label="elem.label">{{elem.csz}}</el-form-item>
                  </el-col>
                </div> -->
                <span v-for="item1 in tacticContition">
                    {{`${item1.name}&nbsp&nbsp:&nbsp&nbsp${item1.value?item1.name === '入住时间'?timeChange(item1.value):item1.value:'不限'}&nbsp&nbsp&nbsp&nbsp&nbsp`}}
                </span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="通知方式">
                <el-checkbox-group v-model="form.notifType">
                  <el-checkbox label="系统消息" key="系统消息" disabled>系统消息</el-checkbox>
                  <el-checkbox label="邮件提醒" key="邮件提醒" disabled>邮件提醒</el-checkbox>
                  <el-checkbox label="短信提醒" key="短信提醒" disabled>短信提醒</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="通知人" v-if="form.notifPersonCount">
                <el-table @cell-mouse-enter="cellMouseEnter" :data="form.notifPersonCount" border>
                  <el-table-column align="center" prop="xm" label="姓名"></el-table-column>
                  <el-table-column align="center" prop="name" label="部门"></el-table-column>
                  <el-table-column align="center" prop="mobile" label="电话"></el-table-column>
                  <el-table-column align="center" prop="email" label="邮箱"></el-table-column>
                </el-table>
              </el-form-item>
            </el-col>

            <!-- 审批流程明细 -->
            <!-- <el-col :span="24">
              <el-form-item label="审批流程明细">
                <el-table @cell-mouse-enter="cellMouseEnter" :data="form.mapgj" border>
                  <el-table-column align="center" type="index" label="序号"></el-table-column>
                  <el-table-column align="center" prop="CJDMC" label="流程步骤"></el-table-column>
                  <el-table-column align="center" prop="CLRMC" label="处理人"></el-table-column>
                  <el-table-column align="center" prop="CLSJ" label="处理时间"></el-table-column>
                  <el-table-column align="center" prop="CLYJ" label="意见"></el-table-column>
                </el-table>
              </el-form-item>
            </el-col> -->

            <!-- 审批流程明细 -->
            <el-col :span="24" style="overflow:hidden">
              <div class="detail-box__title" style="margin-left:15px">审批流程明细</div>
              <div class="detail-box__content" v-for="(item,index) in form.maplc" :key="index">
                <div class="detail-box__subtitle">{{item.SQZT}}</div>
                <el-table @cell-mouse-enter="cellMouseEnter" class="detail-box__table" :data="item.mapgj" border>
                  <el-table-column align="center" prop="CJDMC" label="流程步骤"></el-table-column>
                  <el-table-column align="center" prop="CLRMC" label="处理人"></el-table-column>
                  <el-table-column align="center" prop="CLSJ" label="处理时间"></el-table-column>
                  <el-table-column align="center" prop="CLZT" label="处理状态"></el-table-column>
                  <el-table-column align="center" prop="CLYJ" label="意见"></el-table-column>
                </el-table>
              </div>
            </el-col>

            <!-- <el-col :span="12">
              <el-form-item label="审批人">
                {{form.spr || '暂无'}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="审批时间">
                {{form.spsj || '暂无'}}
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="审批意见">
                {{form.spyj || '暂无'}}
              </el-form-item>
            </el-col> -->

            <!-- <el-col :span="12">
              <el-form-item label="撤控人">
                {{form.ckr || '暂无'}}
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="撤控时间">
                {{form.cksj || '暂无'}}
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="撤控意见">
                {{form.ckyj || '暂无'}}
              </el-form-item>
            </el-col> -->

            <!-- 测控明细 -->
            <el-col :span="24" style="overflow:hidden">
              <div class="detail-box__title" style="margin-left:15px">撤控明细</div>
              <div class="detail-box__subtitle" v-if="form.ckr">{{form.ckr}}于{{form.cksj}}全部撤控</div>
              <div class="detail-box__content">
                <el-table @cell-mouse-enter="cellMouseEnter" class="detail-box__table" :data="objInfo" border>
                  <el-table-column align="center" prop="gjz" label="关键字"></el-table-column>
                  <el-table-column align="center" prop="ckrxm" label="撤控人"></el-table-column>
                  <el-table-column align="center" prop="cksj" label="撤控时间"></el-table-column>
                  <el-table-column align="center" prop="ckyy" label="撤控原因"></el-table-column>
                </el-table>
              </div>
            </el-col>

          </el-row>
        </el-form>
      </div>
      <div :class="{'ctrl-box':true,'ctrl-box--m':showCtrl===true}" v-if="!type===false">
        <el-button type="text" class="btn-switch" @click="switchCtrl"><i :class="{iconfont:true, 'icon-unfold1':showCtrl === true,  'icon-packup-2':showCtrl === false}"></i>
        </el-button>
        <div class="ctrl-box__content">
          <sign v-show="type===1" :lcid="lcid" ref='sign' @close='closeEvent'></sign>
          <examine v-show="type===2" :ajid="this.url" ref='sign' :itemInfo="objInfo" :person="form.objPerson" :car="form.carObj" :tags="form.tagList" @close='closeEvent'></examine>
          <assign v-show="type===3" :ajid="this.url" ref='sign' @close='closeEvent'></assign>
        </div>
      </div>
    </el-col>
  </el-row>
</el-dialog>
</template>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 0;
  }

  .detail-box {
    height: calc(65vh - 30px);
    padding: 0 15px;
    overflow-y: auto;
    &--m {
      height: calc(40vh - 30px);
    }
  }

  .el-tab-pane {
    padding-top: 10px;
  }

  .ctrl-box {
    background: #F8F8F8;
    width: 100%;
    height: 1px;
    border-top: 1px solid #ccc;
    position: relative; // transition: 0.3s;
    &--m {
      height: calc(25vh - 0px);
    }
    &__content {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .btn-switch {
      background: #fff;
      text-align: center;
      width: 80px;
      height: 30px;
      line-height: 30px;
      padding: 0;
      border: 1px solid #ccc;
      border-bottom: 0;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      opacity: 0.8;
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      &:hover {
        opacity: 1;
      }
      .iconfont {
        margin: 0;
      }
    }
  }

  .car-box {
    height: auto;
  }

  .person-box {
    height: auto;
  }

  .el-tabs {
    margin-bottom: 0;
  }

  .el-form-item .el-form-item {
    margin-bottom: 0;
    margin-top: 5px;
  } // element.style {
  //     margin-left: 0;
  // }
  .features-dispatchd {
    margin-left: -25px;
  }

  .detail-box__title {
    font-size: 16px;
    color: #46bdfd;
    height: 38px;
    line-height: 38px;
    margin-bottom: 10px;
    border-bottom: 2px solid #4db8ff;
    position: relative;
  }

  .detail-box__content {
    .detail-box__subtitle {
      padding-left: 20px;
    }
    .detail-box__table {
      margin: 10px 20px;
    }
  }

  .detail-box__subtitle {
    padding-left: 20px;
  }

  .accessory {
    padding-right: 15px;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import tags from '../../../widgets/tags/tags'

  import '../../../utils/dateFormat'
  // getSurveillanceContent
  import { GET_DISPATCH, GET_SURVEILLANCE_CONTENT } from '../../../store/types'
  import { mapState } from 'vuex'
  import person from '../apply/person'
  import car from '../apply/car'
  import sign from './sign.vue'
  import examine from './examine.vue'
  import assign from './assign.vue'
  import { getOnlyArray } from '../../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      tags,
      person,
      sign,
      examine,
      assign,
      car
    },
    // type 0为普通查看详情  1为审批 2为撤控 3为续控
    props: ['dialog', 'type', 'url', 'lcid', 'bktype'],
    data() {
      return {
        detailperson: false,
        detailcar: false,
        showCtrl: false,
        personDialog: false,
        carDialog: false,
        chooseNotifPersonDialog: false,
        tagsOptions: [],
        bktj: [],
        spjjcd: '',
        objInfo: [],
        data: [],
        form: {
          title: '3-11特大案件布控',
          range: '全省',
          startTime: '2017-09-02',
          endTime: '2017-09-15',
          createTime: '2017-09-01',
          frequency: '一天',
          desc: '根据XX案件需要对以下人员进行布控，布控结果将用于抓捕嫌疑人',
          file: '附件',
          people: '',
          tags: '',
          tagList: [],
          FileNames: '',
          visitAccessory: '',
          currentFiles: [],
          spsj: '',
          features: '',
          carFeatures: '',
          spyj: '',
          ckr: '',
          cksj: '',
          ckyj: '',
          carObj: [],
          notifType: [],
          objPerson: [],
          notifPersonCount: [{
            name: '张副局长',
            section: '怀化市侦查局',
            tel: '153********',
            email: 'zhangjuzhang@110.net.cn'
          }, {
            name: '张副局长',
            section: '怀化市侦查局',
            tel: '153********',
            email: 'zhangjuzhang@110.net.cn'
          }],
          notifPerson: [],
          controlCount: '', // 布控申请次数
          continuReason: '' // 续控原因
        }
      }
    },
    computed: {
      tacticContition() {
        if (JSON.stringify(this.data) !== '{}') {
          if (this.data.length === 0) {
            return this.data
          } else {
            return this.data[0].TJ2;
          }
        } else {
          return []
        }
      },
      ...mapState(['surveillance'])
    },
    watch: {},
    methods: {
      timeChange(val) {
        let re = new RegExp('\\d{1,2}', 'g')
        let arr = [];
        val.split('T').map(item => {
          arr.push(item.match(re).join(':'))
        })
        return arr.join('-')
      },
      spjjcdHandle(val) {
        if (val === '0') {
          this.spjjcd = '平急24小时';
        } else if (val === '1') {
          this.spjjcd = '加急6小时';
        } else if (val === '2') {
          this.spjjcd = '特急4小时';
        } else if (val === '3') {
          this.spjjcd = '特急2小时';
        }
      },
      initDialog() {
        this.loadData(this.url)
        this.showCtrl = !this.type === false
        if (this.bktype !== '3') {
          this.loadList()
        }
      },
      save() {
        this.$message({
          type: 'success',
          message: '保存草稿成功',
          showClose: true
        })
      },
      submit() {
        this.closeEvent()
      },
      closeEvent() {
        if (this.$refs.sign) {
          this.$refs.sign.resetForm()
        }
        this.$emit('close')
      },
      loadData(url) {
        if (url) {
          this.dispatch(GET_DISPATCH, {
            id: url
          }).then(() => {
            this.objInfo = this.surveillance.detail.object_info
            if (this.surveillance.detail.tjlist && this.surveillance.detail.tjlist.length > 0) {
              this.data = this.surveillance.detail.tjlist
            }
            this.spjjcdHandle(this.surveillance.detail.spjjcd)
            this.form.title = this.surveillance.detail.bkmc ? this.surveillance.detail.bkmc : ''
            this.form.range = this.getRighttype(this.surveillance.detail.sjfw)
            this.form.startTime = this.dateFormat(new Date(this.surveillance.detail.kssj), 'yyyy-MM-dd') // this.surveillance.detail.kssj
            this.form.endTime = this.dateFormat(new Date(this.surveillance.detail.jssj), 'yyyy-MM-dd') // this.surveillance.detail.jssj
            this.form.frequency = this.getRightfre(this.surveillance.detail.bkpl)
            this.form.desc = this.surveillance.detail.jygk
            this.form.controlCount = this.surveillance.detail.bkcs // 布控申请次数
            this.form.continuReason = this.surveillance.detail.xkyy // 续控原因
            this.form.createTime = this.surveillance.detail.cjsj
            this.form.tags = this.getTags(this.surveillance.detail.object_info)
            this.form.tagList = this.getTagsList(this.surveillance.detail.object_info)
            this.form.notifType = this.getNotice(this.surveillance.detail)
            this.form.notifPersonCount = this.surveillance.detail.notice_people
            this.form.carFeatures = this.getCarFeature(this.surveillance.detail.object_info)
            this.form.features = this.getFeature(this.surveillance.detail.object_info)
            this.form.objPerson = this.getObjPerson(this.surveillance.detail.object_info)
            this.form.carObj = this.getCarObj(this.surveillance.detail.object_info)
            this.form.spsj = this.surveillance.detail.spsj
            this.form.spr = this.surveillance.detail.spr
            this.form.spyj = this.surveillance.detail.spyj
            this.form.ckr = this.surveillance.detail.ckr
            this.form.cksj = this.surveillance.detail.cksj
            this.form.ckyj = this.surveillance.detail.ckyj
            this.form.visitAccessory = this.surveillance.detail.wjid ? this.surveillance.detail.wjid : ''
            this.form.FileNames = this.surveillance.detail.wjmc ? this.surveillance.detail.wjmc : ''
            this.form.maplc = this.surveillance.detail.maplc ? this.surveillance.detail.maplc : [] // 审批流程
            this.geteEnclosure()
          })
        }
      },
      // 个人策略;通用策略
      loadList() {
        this.dispatch(GET_SURVEILLANCE_CONTENT, {
          clid: this.bktype
        }).then(() => {
          this.bktj = this.surveillance.surveillanceContent.zftj
        })
      },
      //      附件列表
      geteEnclosure() {
        let fileId = this.form.visitAccessory ? this.form.visitAccessory.split(',') : []
        let fileName = this.form.FileNames ? this.form.FileNames.split('|') : []
        // 附件列表数据回填
        this.form.currentFiles = [] // 上传文件列表 重置
        for (let fi in fileId) {
          this.form.currentFiles.push({
            name: fileName[fi] ? fileName[fi] : '',
            id: fileId[fi] ? fileId[fi] : ''
          })
        }
      },
      getRighttype(val) {
        if (val === '1') {
          return '全市'
        } else if (val === '2') {
          return '全省'
        } else {
          return '全国'
        }
      },
      getRightfre(val) {
        if (val === '1') {
          return '1小时'
        } else if (val === '2') {
          return '6小时'
        } else if (val === '3') {
          return '1天'
        } else {
          return '1周'
        }
      },
      getTagsList(val) {
        let array = []
        array = val.filter(d => d.dxlx === '3').map(d => {
          return {
            id: d.id,
            lybid: d.lybid,
            ckyy: d.ckyy,
            dxlx: '3',
            gjz: d.gjz,
            sfck: d.sfck
          }
        })
        return array
      },
      getTags(val) {
        let array = ''
        for (let i = 0; i < val.length; i++) {
          if (val[i].dxlx === '3') {
            // array += val[i].gjz + ' '
            if (val[i].sfck === '1') {
              array += val[i].gjz + '<span style=' + 'color:red;font-weight:700' + '>' + '(已撤控)' + '</span>' + '   '
            } else {
              array += val[i].gjz + '  '
            }
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
      getObjPerson(arr) {
        let controlResult = [];
        let oneperson = []
        let personobj = []
        let dxlx = arr.filter(d => d.dxlx === '1')
        let arr1 = dxlx.filter(d => d.tzlx === '1')
        arr1.forEach((d, i) => {
          controlResult[i] = {}
          controlResult[i].keywordList = [];
          dxlx.map(item => {
            if (item.lybid === d.lybid && item.tzlx === '1') {
              controlResult[i].xm = item.gjz
              controlResult[i].keywordList.push(item)
            } else if (item.lybid === d.lybid && item.tzlx === '2') {
              controlResult[i].sfz = item.gjz
              controlResult[i].keywordList.push(item)
            } else if (item.lybid === d.lybid && item.tzlx !== '2' && item.tzlx !== '1') {
              controlResult[i].keywordList.push(item)
            }
          })
          // oneperson.push(dxlx.filter(c => c.lybid === d.lybid));
        })
        oneperson.forEach((d, i) => {
          if (d.length === 1) {
            d.forEach((e, i) => {
              if (e.tzlx === '2') {
                personobj.push({
                  idCard: e.gjz,
                  lybid: e.lybid,
                  dxlx: '1',
                  cardId: e.id,
                  ckyy: e.ckyy, // 撤控原因
                  sfck: e.sfck, // "1" 为已撤控 （是否撤控）
                  name: e.sfzxm
                })
              }
            })
          }
          if (d.length > 1) {
            let obj = {}
            d.forEach((e, i) => {
              if (e.tzlx === '2') {
                obj.idCard = e.gjz
                obj.lybid = e.lybid
                obj.dxlx = '1'
                obj.cardId = e.id
                obj.ckyy = e.ckyy // 撤控原因
                obj.sfck = e.sfck // "1" 为已撤控 （是否撤控）
                obj.name = e.sfzxm
              }
            })
            personobj.push(obj)
          }
        })
        return controlResult;
        // return this.getMyonlyArray(personobj)
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
                  dxlx: '2',
                  id: e.id,
                  ckyy: e.ckyy, // 撤控原因
                  sfck: e.sfck // 1 为已撤控 （是否撤控）
                })
              }
              if (e.tzlx === '8') {
                carobj.push({
                  brand: e.gjz,
                  lybid: e.lybid,
                  dxlx: '2',
                  id: e.id,
                  ckyy: e.ckyy, // 撤控原因
                  sfck: e.sfck // 1 为已撤控 （是否撤控）
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
                obj.dxlx = '2'
                obj.id = e.id
                obj.ckyy = e.ckyy // 撤控原因
                obj.sfck = e.sfck // "1" 为已撤控 （是否撤控）
              }
              if (e.tzlx === '8') {
                obj.brand = e.gjz
                obj.lybid = e.lybid
                obj.dxlx = '2'
                obj.id = e.id
                obj.ckyy = e.ckyy // 撤控原因
                obj.sfck = e.sfck // "1" 为已撤控 （是否撤控）
              }
            })
            carobj.push(obj)
          }
        })
        return this.getMyonlyArray(carobj)
      },
      gethim(val) {
        if (val === '') {
          return '未命名'
        } else {
          return val
        }
      },
      getFeature(val) {
        let array = []
        val.forEach((d, i) => {
          if (d.tzlx === '2') {
            array.push('身份证')
          }
          if (d.tzlx === '1') {
            array.push('姓名')
          }
        })
        array = getOnlyArray(array)
        return array.join(' ')
      },
      getCarFeature(val) {
        let array = []
        for (let i = 0; i < val.length; i++) {
          if (val[i].tzlx === '7') {
            array.push('车牌号')
          }
          if (val[i].tzlx === '8') {
            array.push('车辆识别号')
          }
        }
        array = getOnlyArray(array)
        return array.join(' ')
      },
      getNoticPerson(val) {},
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
      switchCtrl() {
        this.showCtrl = this.showCtrl === false
      }
    },
    created() {},
    mounted() {
      this.loadData()
    }
  }

</script>
