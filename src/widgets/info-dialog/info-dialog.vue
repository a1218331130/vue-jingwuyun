<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title" :modal-append-to-body="modalAppendToBody" :append-to-body="true" size="info-fixed" :modal="showModal" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" v-loading="loading">
  <!-- {{data}} -->
<el-row v-if="this.data!==null&&type===2" v-for="(item, idx) in carObject" :key="idx" class="carClass">
  <el-col :span="24">
    <el-row :gutter="10" class="info">
      <el-col :span="5" class="info__image-box" v-if="type===1 || type===2 || type===3">
          <data-image class="iconfont icon-addressbook_fill" v-if="type===1" :idCard="keyword" ref="headImg"></data-image>
          <span v-if="type===2" class="avatar-pic iconfont"><img :src="getCarImage(item.brand, item.clxh)" onerror="this.src='/static/img/default-car.jpg'" style="width:100%" alt=" ">
          </span>
          <i class="iconfont icon-dianhuadingdan " v-if="type===3 "></i>
        </el-col>
        <el-col :span="19">
           <!-- 车辆-->
          <el-form >
            <el-row :gutter="10 ">
              <el-col :span="24 " class="info__sign ">
                {{item.carNum || '暂无'}}
                <!-- <span class="info__sign__mark--blue ">{{item.state || '暂无'}}</span> -->
              </el-col>
              <!-- <el-col :span="12 ">
                <el-form-item label="使用性质 ">{{item.nature || '暂无'}}</el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="所有人 ">{{item.carOwner || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="身份证 ">
                  <span class="info-base__item--point " @click="callOtherDialog(1,item.idCard) ">{{item.idCard || '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="品牌 "> {{item.brand || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="登记时间 ">{{item.registerTime | dateFormat}}</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="颜色 ">{{item.color || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="排量 ">{{item.displacement || '暂无'}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  <el-col :span="24">
    <tags class="tags" :keyword="keyword" :type="type" :isOpenDialog="isOpenDialog"></tags>
  </el-col>
<el-col :span="24">
  <hr>
    <el-row :gutter="20" class="entery">
      <el-col :span="4">
        <a :href="'/#/dossier/car?key=' + keyword+'|'+item.jdcfdjddjh+'|'+item.clxh" target="_blank">
          <i class="iconfont icon-xiaoqiche iconfont__c1"></i>车辆档案
        </a>
      </el-col>
      <el-col :span="4">
        <a :href="`/#/search/result?key=${keyword}`" target="_blank">
          <i class="iconfont icon-chaxun iconfont__c5"></i>
          <span style="padding-left:14px">慧搜</span>
        </a>
      </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-row v-if="this.data!==null&&type!==2">
    <!-- <el-row v-if="this.data!==null"> -->
    <!-- 信息 -->
    <el-col :span="24">
      <el-row :gutter="10" class="info">
        <el-col :span="5" class="info__image-box" v-if="type===1 || type===2 || type===3">
          <data-image class="iconfont icon-addressbook_fill" v-if="type===1" :idCard="keyword" ref="headImg"></data-image>
          <span v-if="type===2" class="avatar-pic iconfont"><img :src="getCarImage(carObject.brand, carObject.clxh)" onerror="this.src='/static/img/default-car.jpg'" style="width:100%" alt=" ">
          </span>
          <i class="iconfont icon-dianhuadingdan " v-if="type===3 "></i>
        </el-col>
        <el-col :span="type===1||type===2||type===3?19:24 ">
          <!-- 人员 -->
          <el-form v-if="type===1 " v-loading="loading ">
            <el-row :gutter="10 ">
              <el-col :span="24 " class="info__sign ">
                {{peopelObject.name || '暂无'}}
                <span v-if="peopelObject.sex!=='' " class="info__sign__mark--blue ">
                  {{peopelObject.sex}}
                </span>
              </el-col>
              <el-col :span="24 " class="info__secondary ">
                {{peopelObject.idCard || '暂无'}}
                <span v-if="peopelObject.domicile!=='' ">[{{peopelObject.domicile || '暂无'}}]</span>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="9 ">
                <el-form-item label="出生日期 "> {{peopelObject.birthday | dateFormat}}</el-form-item>
              </el-col>
              <el-col :span="7 ">
                <el-form-item label="身高 ">{{peopelObject.height || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="8 ">
                <el-form-item label="民族 ">{{peopelObject.nation || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="24 ">
                <el-form-item label="现住地址 "> {{peopelObject.native || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="24 ">
                <el-form-item label="户口所在地 ">{{peopelObject.residence || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="8 ">
                <el-form-item label="婚姻状况 ">{{peopelObject.service || '暂无'}}</el-form-item>
              </el-col>

              <el-col :span="16 ">
                <el-form-item label="文化程度 ">{{peopelObject.education || '暂无'}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 车辆-->
          <el-form v-if="type===2 " v-loading="loading ">
            <el-row :gutter="10 ">
              <el-col :span="24 " class="info__sign ">
                {{carObject.carNum || '暂无'}}
                <!-- <span class="info__sign__mark--blue ">{{carObject.state || '暂无'}}</span> -->
              </el-col>
              <!-- <el-col :span="12 ">
                <el-form-item label="使用性质 ">{{carObject.nature || '暂无'}}</el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="所有人 ">{{carObject.carOwner || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="身份证 ">
                  <span class="info-base__item--point " @click="callOtherDialog(1,carObject.idCard) ">{{carObject.idCard || '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="品牌 "> {{carObject.brand || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="登记时间 ">{{carObject.registerTime | dateFormat}}</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="颜色 ">{{carObject.color || '暂无'}}</el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="排量 ">{{carObject.displacement || '暂无'}}</el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 手机 -->
          <el-form v-if="type===3 ">
            <el-row :gutter="10 ">
              <el-col :span="24 " class="info__sign ">
                {{phoneObject.phone}}
              </el-col>
              <el-col :span="24 " class="info__secondary ">
                {{phoneObject.ascription}} {{phoneObject.province}} {{phoneObject.telType}}
              </el-col>
            </el-row>
            <el-row :gutter="10 " class="info__mobile-master " v-for="elem in ownerList " :key="elem.key ">
              <el-col :span="4 ">
                <div class="info__mobile-master__label ">
                  可能机主
                </div>
                <div class="info__mobile-master__label seat "></div>
              </el-col>
              <el-col :span="20 ">
                <div class="info__mobile-master__value ">
                  <span class="info__mobile-master__people " @click="callOtherDialog(1,elem.idCard) ">{{elem.name}} {{elem.idCard}}</span>
                  <span class="info__mobile-master__score "><label>来源: </label> {{elem.source}}</span>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <!-- 案件-->
          <el-form v-if="type===4 " v-loading="loading ">
            <el-row :gutter="10 ">
              <el-col :span="24 " class="info__sign ">
                {{caseObject.Ajmc || '暂无'}}
                <!-- <span class="info__sign__mark--blue ">案件编号:{{caseObject.Asjbh || '暂无'}}</span> -->
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="24 ">
                <el-form-item label="案件编号 ">
                  <span class="case_content ">{{caseObject.Asjbh || '暂无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="受理时间 ">
                  <span class="case_content ">{{caseObject.Slsj || '暂无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="立案日期 ">
                  <span class="case_content ">{{caseObject.Larq || '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="12 ">
                <el-form-item label="案事件发生开始时间 ">
                  <span class="case_content ">{{caseObject.Ajkssj || '暂无'}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12 ">
                <el-form-item label="案事件发生结束时间 ">
                  <span class="case_content ">{{caseObject.Ajjssj || '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10 ">
              <el-col :span="24 ">
                <el-form-item label="案事件发生地点 ">
                  <span class="case_content ">{{caseObject.Ajfsdd || '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 ">
              <el-col :span="24 ">
                <el-form-item label="案件概况 ">
                  <span class="case_content ">{{caseObject.Jyaq || '暂无'}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10 " v-if="caseObject.recordPersons&&caseObject.recordPersons.length>0">
              <el-col :span="24">
                <el-form-item label="涉案人员">
                  <div class="relation-img">
                    <el-tooltip placement="top" v-for="(item, index) in caseObject.recordPersons" :key="index">
                      <div slot="content">
                        <!-- 手机:{{item.Xyry_sj}}<br/>  -->
                        姓名:{{item.Xm}}<br/> 身份证号:
                        <span class="hover-menu" data-type="idCard">{{item.Zjhm}}</span><br/> 涉案情况:{{item.Saqk}}
                      </div>
                      <div class="relation-item cursor--pointer" @click="callOtherDialog(1,item.Zjhm)">
                        <img :src="`${personImagePath}${item.Zjhm}`" onerror="this.src='/static/img/default_person.jpg'" alt=""> {{item.Xm}}
                        <span>前科</span>
                      </div>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
    </el-col>

    <!-- 标签 -->
    <el-col v-if="type && type!==4" :span="24">
      <tags class="tags" :keyword="keyword" :type="type" :isOpenDialog="isOpenDialog"></tags>
    </el-col>
    <!-- 入口 -->
    <el-col v-if="type!==4" :span="24">
      <hr>
      <el-row :gutter="20" class="entery" v-if="type===1">
        <el-col :span="4">
          <a :href="'/#/dossier/people?key=' + keyword" target="_blank">
              <i class="iconfont icon-icon_gerendangan_normal iconfont__c1"></i>人员档案
            </a>
        </el-col>
        <el-col :span="4">
          <a :href="'/#/analysis/locus?key=' + keyword" target="_blank">
          <i class="iconfont icon-guiji iconfont__c2"></i>人员轨迹
          </a>
        </el-col>
        <el-col :span="4">
          <a :href="'/#/analysis/relation?key=' + keyword" target="_blank">
          <i class="iconfont icon-guanlian1 iconfont__c3"></i>
          <span style="padding-left:7px">关系分析</span>
          </a>
        </el-col>
        <el-col :span="4">
          <a :href="'/#/analysis/timeline?key=' + keyword" target="_blank">
          <i class="iconfont icon-fenxi iconfont__c4"></i>
          <span style="padding-left:7px">时光轴</span>
          </a>
        </el-col>
        <el-col :span="4">
          <a :href="`/#/search/result?key=${keyword}`" target="_blank">
            <i class="iconfont icon-chaxun iconfont__c5"></i>
            <span style="padding-left:14px">慧搜</span>
          </a>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="entery" v-if="type===2">
        <el-col :span="4">
          <a :href="'/#/dossier/car?key=' + keyword" target="_blank">
              <i class="iconfont icon-xiaoqiche iconfont__c1"></i>车辆档案
            </a>
        </el-col>
        <!-- <el-col :span="4">
          <i class="iconfont icon-guiji iconfont__c2"></i>车辆轨迹
        </el-col> -->
        <el-col :span="4">
          <a :href="`/#/search/result?key=${keyword}`" target="_blank">
            <i class="iconfont icon-chaxun iconfont__c5"></i>
            <span style="padding-left:14px">慧搜</span>
          </a>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="entery" v-if="type===3">
        <!-- <el-col :span="4">
          <a href="/#/analysis/telList" target="_blank">
          <i class="iconfont icon-dianhuadingdan iconfont__c1"></i>话单分析
          </a>
        </el-col> -->
        <el-col :span="4">
          <a :href="`/#/search/result?key=${keyword}`" target="_blank">
            <i class="iconfont icon-chaxun iconfont__c5"></i>
            <span style="padding-left:14px">慧搜</span>
          </a>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</el-dialog>
</template>
<style lang="scss" scoped>
  .carClass {
    border-bottom: 15px solid #ccc;
    padding-bottom: 15px;
    margin-top: 15px;
  }

  .carClass:nth-last-child(1) {
    border-bottom: none;
    padding-bottom: 0;
  }

  .carClass:nth-child(1) {
    margin-top: 0;
  }

  .info {
    transition: 0.25s;
    &__image-box {
      background: #dff1ff; // height: 160px;
      overflow: hidden;
      display: flex;
      align-items: center;
      align-content: center;
      position: relative;
      &__image {
        width: auto;
        height: 100%;
        display: block;
        border: 0;
      }
      .iconfont {
        font-size: 42px;
        color: #b9dfff;
        text-align: center;
        width: 100%;
        margin: 5px 0;
      }
    }
    &__sign {
      font-size: 20px;
      color: #1e1e1e;
      &__mark {
        font-size: 12px;
        color: #fff;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
        margin-left: 5px;
        display: inline-block;
        &--blue {
          font-size: 12px;
          color: #fff;
          height: 18px;
          line-height: 18px;
          padding: 0 3px;
          margin-left: 5px;
          display: inline-block;
          background: #199ed8;
        }
        &--red {
          font-size: 12px;
          color: #fff;
          height: 18px;
          line-height: 18px;
          padding: 0 3px;
          margin-left: 5px;
          display: inline-block;
          background: #ff3b62;
        }
      }
    }
    &__secondary {
      color: #1e1e1e;
    }
    &__mobile-master {
      margin-top: 3px;
      &__label {
        text-align: center; // width: 60px;
        height: 15px;
        line-height: 15px;
        padding-right: 10px;
        position: relative;
        border-right: 1px solid #d7d7d7;
        &:after {
          content: '';
          background: #49a3ff;
          width: 8px;
          height: 8px;
          border-radius: 10px;
          display: block;
          position: absolute;
          top: 50%;
          right: -5px;
          margin-top: -4px;
        }
        &.seat {
          &:after {
            display: none;
          }
        }
      }
      &__value {
        height: 21px;
        line-height: 21px;
      }
      &__people {
        color: #53a9ff;
        margin-right: 10px;
        opacity: 0.9;
        cursor: pointer;
        &:hover {
          opacity: 1;
        }
      }
      &__score {
        color: #000;
        label {
          color: #656565;
        }
      }
    }
    .el-form-item {
      margin: 0;
    }
  }

  .entery {
    .iconfont {
      font-size: 32px;
      color: #fff;
      text-align: center;
      width: 60px;
      height: 60px;
      line-height: 60px;
      display: block;
      border-radius: 5px;
      opacity: 0.9;
      cursor: pointer;
      transition: 0.25s;
      &:hover {
        opacity: 1;
        box-shadow: 0 2px 2px #c2c2c2;
      }
      &__c1 {
        background-color: #C54E59;
      }
      &__c2 {
        background-color: #FF9400;
      }
      &__c3 {
        background-color: #706DF2;
      }
      &__c4 {
        background-color: #2072F7;
      }
      &__c5 {
        background-color: #3C9EF0;
      }
      &__c6 {
        background-color: #009458;
      }
    }
  }

  .case_content {
    color: #000;
  }

  .relation-item {
    position: relative;
    display: inline-block;
    font-size: 12px;
    margin: 0 3px;
    text-align: center;
    cursor: pointer;
    img {
      display: block;
      width: 50px;
      border: 1px solid #f1f1f1;
    }
    span {
      height: 20px;
      line-height: 20px;
      position: absolute;
      right: 0;
      top: 0;
      background: #0e90d2;
      color: #fff;
    }
  }

  .relation-img {
    overflow-x: scroll;
    overflow-y: hidden;
    width: 620px;
    max-height: 120px;
    white-space: nowrap;
  } // 图片信息
  .relation-info-right {
    .el-form-item {
      margin: 0;
    }
    .info-base__item--point {
      color: #1e8ffd;
      cursor: pointer;
    }
  } //  重点信息
  .info-base__item--point {
    color: #1e8ffd;
    cursor: pointer;
  }

</style>
<style media="screen">
  .el-dialog--info-fixed {
    width: 650px;
  }

</style>
<script>
  import { mapState } from 'vuex'
  // FETCH_CASE_INFO_BY_NUMBER FETCH_SUSPECT_PERSONS
  import { GET_NUMBET_DETAIL, GET_CASE_BASE_INFO, FETCH_RECORD_PERSONS, CAR_INFO_SB } from '../../store/types'

  import { FWZX_PATH } from '../../config'

  import mixin from '../../utils/mixin'
  import { clone } from '../../utils/util'

  import '../../utils/dateFormat'
  import dataImage from '../data-image/data-image'
  import tags from '../tags/tags'

  /**
   * @module InfoDialog
   * @desc 对象信息模态窗
   *
   * `*`注:依赖 infoDialogEvents('../../utils/infoDialogEvents'), 使用本组件时必需引入infoDialogEvents
   *
   * @example <info-dialog :dialog="dialog" :data="data" @close="dialog=false"></info-dialog>
   */
  export default {
    mixins: [mixin],
    components: {
      tags,
      'data-image': dataImage
    },
    data() {
      return {
        title: '',
        keyword: '',
        type: null,
        tags: [],
        peopelObject: {},
        carObject: [],
        phoneObject: {},
        caseObject: {},
        ownerList: [],
        isOpenDialog: false,
        tagsOptions: [],
        loading: true
      }
    },
    /**
     * 接收参数
     * @prop {Boolean} dialog 是否打开窗口 @default false
     * @prop {Boolean} showModal 是否显示遮罩 @default true
     * @prop {Object} data 数据对象 @default null
     * @prop {Number} data.contentType 索求信息类型, (1:人, 2:车, 3:手机, 4:案件)
     * @prop {String} data.keyId 信息关键字(通过该关键字查找对应信息), 对应data.contentType, (人:身份证, 车:车牌号码, 手机:手机号码, 案件:案件ID)
     * @prop {Boolean} modalAppendToBody 遮罩是否插入body(参考elementUI el-dialog 'modal-append-to-body' 项说明) @default true
     */
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      showModal: {
        type: Boolean,
        default: true
      },
      data: {
        type: Object,
        default: null
      },
      modalAppendToBody: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState(['dossier', 'analysisTelList', 'caseInfo', 'baseData'])
    },
    methods: {
      initDialog() {
        this.peopelObject = {}
        this.carObject = []
        this.caseObject = {}
        this.phoneObject = {}
        this.type = this.data.contentType
        this.isOpenDialog = true // 打开弹窗
        switch (this.type) {
          case 1:
            this.showPeople();
            break;
          case 2:
            this.showCar();
            break;
          case 3:
            this.showMobile();
            break;
          case 4:
            this.showCase();
            break;
        }
      },
      showPeople() {
        this.title = '个人信息'
        this.keyword = this.data.keyId || ''
        this.$http.post(FWZX_PATH + 'query/getperson/info', {
          c: 0,
          token: this.userData.UserToken,
          data: JSON.stringify({ sfzh: this.keyword, token: this.userData.UserToken }),
          id: 'query/getperson/info'
        }, this.httpSettings).then((res) => {
          let data = res.body.Data.xp
          // 判断信息是否为空，以免报错
          if (!data) {
            data = {}
          }
          this.peopelObject = {
            //           city: data
            name: data.XM,
            idCard: data.SFZH,
            sex: data.XBMC,
            birthday: data.CSRQ,
            nation: data.MZMC,
            native: data.ZZXZ,
            residence: data.CSD,
            domicile: data.HKSZD, // data
            service: data.HYZK, // data
            education: data.WHCD,
            height: data.SG
          }
          this.loading = false
        })
      },
      showCar() {
        this.title = '车辆信息'
        this.keyword = this.data.keyId ? this.data.keyId : ''
        this.dispatch(CAR_INFO_SB, { cphm: this.keyword }).then(d => {
          if (!this.dossier.CarInfoSB) {
            this.carObject.push({
              carNum: this.data.keyId, // 车牌号码
              city: '', // 所在城市
              brand: '', // 品牌
              color: '', // 颜色
              registerTime: '', // 登记时间
              displacement: '', // 排量
              state: '', // 状态
              carOwner: '', // 车主
              idCard: '', // 车主身份证
              native: '', // 户籍地
              clxh: '' // 车辆型号
            })
          } else {
            let jsonData = {}
            this.dossier.CarInfoSB.map(item => {
              jsonData = {
                carNum: item.jdchphm, // 车牌号码
                brand: item.zwppmc, // 品牌
                color: item.jdccsysdm, // 颜色
                registerTime: item.ccdjrq, // 登记时间
                displacement: item.jdcfdjpl, // 排量
                state: '正在使用', // 状态
                carOwner: item.jdcsyr, // 车主
                idCard: item.jdcsyr_jtglywdxsfzmhm, // 车主身份证
                nature: item.xdh_mc_jdcsyxzdm, // 使用性质
                clxh: item.clxh, // 车辆型号
                jdcfdjddjh: item.jdcfdjddjh // 发动机号
              }
              this.carObject.push(jsonData)
              jsonData = {}
            })
          }
          this.loading = false
        })
      },
      showMobile() {
        this.title = '手机信息'
        this.keyword = this.data.keyId ? this.data.keyId : ''
        this.dispatch(GET_NUMBET_DETAIL, { dhhm: this.keyword }).then(d => {
          if (this.analysisTelList.numbetDetail === null) {
            this.phoneObject = {
              phone: this.keyword, // 电话号码
              province: '', // 省份
              ascription: '', // 归属地
              telType: '' // 号码类型
            }
            this.ownerList = [] // 可能机主列表
          } else {
            let province = this.analysisTelList.numbetDetail.gsdxx.telarea.split(' ')
            this.phoneObject = {
              phone: this.keyword, // 电话号码
              province: province[0], // 省份
              ascription: this.analysisTelList.numbetDetail.gsdxx.telarea, // 归属地
              telType: this.analysisTelList.numbetDetail.gsdxx.teltype // 号码类型
            }
            this.ownerList = this.analysisTelList.numbetDetail.zjhmlist.map(d => {
              return {
                name: d.xm,
                idCard: d.zjhm,
                source: d.tablename // d.tableInfoList[0].tablename
              }
            })
          }
          this.loading = false
        })
      },
      showCase() {
        this.title = '案件信息'
        this.keyword = this.data.keyId ? this.data.keyId : ''
        // 获取案件基本信息
        // this.dispatch(FETCH_CASE_INFO_BY_NUMBER, { ajbh: this.keyword }).then(() => {
        this.dispatch(GET_CASE_BASE_INFO, { Asjbh: this.keyword }).then(() => {
          this.caseObject = this.baseData.caseBaseInfo ? clone(this.baseData.caseBaseInfo) : {
            Asjbh: this.keyword
          }
          // 获取嫌疑人
          // this.dispatch(FETCH_SUSPECT_PERSONS, { Asjbh: this.keyword }).then(() => {
          //   this.caseObject['suspectPersons'] = [...this.baseData.suspectPersons]
          // })
          // 获取前科人员
          this.dispatch(FETCH_RECORD_PERSONS, { Asjbh: this.keyword }).then(() => {
            this.caseObject['recordPersons'] = [...this.baseData.recordPersons]
          })
          this.loading = false
        })
      },
      closeEvent() {
        // 把头像清空，否则下次进来会显示上次的头像
        this.$refs.headImg && this.$refs.headImg.clearImage();
        /**
         * 要求更新
         * @event module:InfoDialog~call:change-update
         */
        this.$emit('call:change-update')
        /**
         * 关闭窗口
         * @event module:InfoDialog~close
         */
        this.$emit('close')
        this.isOpenDialog = false // 关闭弹窗
      },
      callOtherDialog(targetType, key) {
        if (key) {
          /**
           * 要求同时打开其他infoDialog
           * @event module:InfoDialog~call:dialog
           * @param {Object} a 要求对象
           * @param {Number} a.type 要求信息窗的类型 (1:人, 2:车, 3:手机, 4:案件)
           * @param {String} a.key 信息关键字
           */
          this.$emit('call:dialog', { type: targetType, key: key })
        }
      }
    },
    created() {},
    mounted() {}
  }

</script>
