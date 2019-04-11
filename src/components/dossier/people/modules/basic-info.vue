<!-- 人员基本信息 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="基础信息" tool='share'>
    <dd slot="export" v-if="exportWordShow" style="width: 100px;color: #fff;">
      <el-button type="text" class="export-text iconfont icon-word" @click="$emit('call:exportWord')">导出word
      </el-button>
    </dd>
  </card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="info-box">
    <!-- 图像 -->
    <el-col :span="3">
      <div class="users-image" @contextmenu="saveImage" >
        <data-image :idCard="this.$route.query.key"></data-image>
      </div>
      <div class="attention-button" v-if="false">关注 </div>
    </el-col>
    <!-- 信息 -->

    <el-col :span="21" v-if="basicData !== null">
      <el-row>
        <el-col :span="24" class="info-text-name">
          <span class="name">{{basicData.XM || '暂无'}}</span>
          <span class="namesfz" v-if="basicData.SFZH">{{basicData.SFZH || '暂无'}}</span>
          <span class="namesfz" v-else>{{caseKey || '暂无'}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" class="info-text-box">
          <label>性别</label>
          <span class="lable-text-input">{{basicData.XBMC || '暂无'}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>曾用名</label>
          <span class="lable-text-input">{{basicData.CYM || '暂无'}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>职业</label>
          <span class="lable-text-input">{{basicData.ZY || '暂无'}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" class="info-text-box">
          <label>民族</label>
          <span class="lable-text-input">{{basicData.MZMC || '暂无'}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>出生日期</label>
          <span class="lable-text-input">{{basicData.CSRQ || '暂无'}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>更新时间</label>
          <span class="lable-text-input">{{basicData.GXSJ || '暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="info-text-box">
          <label>户籍地址</label>
          <!-- <span class="lable-text-input">{{basicData.HKSZD || '暂无'}}</span> -->
          <span class="lable-text-input">{{basicData.ZZXZ || '暂无'}}</span>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="24" class="info-text-box">
          <label>现住地址</label>
          <span class="lable-text-input">{{basicData.ZZXZ || '暂无'}}</span>
        </el-col>
      </el-row>


      <el-row v-if="this.checkRule('SysLabel/GetSysLabels') === true">
        <el-col :span="24" class="info-text-box label-box info-flex-wrap">
          <label @click="arrydata">标签</label>
          <el-tag :key="item.LabelName" v-for="item in tages">{{item.LabelName}}</el-tag>

        </el-col>
      </el-row>
    </el-col>

    <el-col :span="21" v-else>
      <el-row>
        <el-col :span="24" class="info-text-name">
          <span class="name">暂无</span>
          <span class="namesfz">{{caseKey}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" class="info-text-box">
          <label>性别</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>曾用名</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>绰号</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8" class="info-text-box">
          <label>民族</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>出生日期</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>婚姻状况</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="info-text-box">
          <label>工作单位</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
        <el-col :span="16" class="info-text-box">
          <label>户籍地址</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="24" class="info-text-box">
          <label>现住地址</label>
          <span class="lable-text-input">暂无</span>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="24" class="info-text-box label-box info-flex-wrap">
          <label @click="arrydata">标签</label>
          <el-tag :key="item.LabelName" v-for="item in tages">{{item.LabelName}}</el-tag>

        </el-col>
      </el-row>
    </el-col>
  </el-row>
  <el-row class="info-box-hr" v-if="this.checkRule('Person/GetReleteSource', true) && resources.length > 0">
    <div class="info-line"></div>
    <span class="info-line-title">相关资源表</span>
  </el-row>
  <el-row v-if="this.checkRule('Person/GetReleteSource', true) && resources.length > 0">
    <el-col :span="24" class="info-table-list">
      <a href="javascript:void(0)" :key="item.comments" v-for="item in resources">{{item.comments}}</a>
    </el-col>
  </el-row>
  <!-- <div id="contextmenu"  @mouseleave="contextMouseOut" class="contextmenu" v-show="contextmenuFlag">
    <ul>
      <li :ref="'ulLi'+idx"  v-for="(item,idx) in menuData.menu" @click="doThing(item, idx)" @mouseover="mouseoverMethod(item.disabled, idx)" @mouseout="mouseoutMethod(item.disabled, idx)" :class="item.disabled?'disabledClass':''">{{item.name}}</li>
    </ul>
  </div> -->
  <contextMenu :menuData="menuDatas" v-show="contextmenuFlag" @callBack="callBack" @changeMenuStatus="changeStatus"></contextMenu>
  </div>

</div>
</template>

<style scoped lang="scss">
  label {
    margin-right: 10px;
    width: 70px;
    text-align: justify;
    text-align-last: justify;
  }

  .info-box {
    margin-top: 13px;
    .users-image {
      height: 145px;
      border: 1px solid #D7D7d7;
      text-align: center;
      background-color: #F2F2F2;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(0) translateY(0);
      }
    }
    .attention-button {
      width: 98%;
      height: 30px;
      line-height: 30px;
      color: #fff;
      background-color: #5BABE6;
      text-align: center;
      margin: 12px auto 0;
      cursor: pointer;
      &:hover {
        background-color: #FF9900;
      }
    }
    .empty {}
    .info-text-name {
      margin-bottom: 12px;
      margin-left: 10px;
      .name {
        font-size: 22px;
        color: #1E1E1E;
      }
      .namesfz {
        font-size: 22px;
        color: #1E1E1E;
        margin-left: 15px;
      }
    }
    .info-text-box {
      display: flex;
      &.info-flex-wrap {
        flex-wrap: wrap;
      }
      label {
        min-height: 28px;
        line-height: 28px;
        padding: 0 8px;
        background-color: #F2F2F2;
        margin-bottom: 2px;
      }
      span.lable-text-input {
        line-height: 28px;
        width: 65%;
      }
      &.label-box {
        label {
          height: 38px;
          line-height: 38px;
        }
        span {
          line-height: 22px;
          padding: 0 10px;
          margin-top: 7px;
          height: 25px;
          margin-right: 6px;
          background-color: #FF9900;
        }
      }
    }
  }

  .contextMenu {
    position: fixed;
    width: 120px;
    background-color: #e6e6e6;
    border-radius: 3px;
    padding: 10px 4px;
    box-shadow: 4px 4px 25px #d2d2d2;
    consor: pointer;
    &>ul li {
      list-style: none;
      padding: 0 10px;
    }
    z-index:1000;
  }

  .hightHover {
    background-color: #97cbff;
    color: white;
  }

  .disabledClass {
    color: #888787;
  }

  .info-box-hr {
    padding-top: 10px;
    height: 25px;
    .info-line {
      width: 100%;
      height: 4px;
      background-color: #F2F2F2;
    }
    .info-line-title {
      position: absolute;
      margin-top: -14px;
      padding-right: 10px;
      background-color: #fff;
    }
  }

  .info-table-list {
    padding-left: 10px;
    line-height: 35px;
    a {
      margin-right: 15px;
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import {
    RELETE_SOURCE,
    SYS_LABEL_GET_SYS_LABELS_KEYWORD,
    GET_PERSON_INFO_FROM_MAIN_DATA
  } from '../../../../store/types'
  import contextMenu from '../../../analysis/common/contextMenu.vue'
  import dossierMixin from '../../dossierMixin'
  import cardHeader from './card-header.vue'
  import dataImage from '../../../../widgets/data-image/data-image'
  import bus from '../../../../utils/bus'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [dossierMixin, mixin],
    components: {
      cardHeader,
      'data-image': dataImage,
      'contextMenu': contextMenu
    },
    data() {
      return {
        contextmenuFlag: false,
        imageUrl: '',
        dossierLoading: false,
        basicData: [],
        tages: [],
        resources: [],
        count: 0,
        menuDatas: {
          menu: [{
            name: '保存照片',
            method: 'callBack',
            sendData: {
              v_guid: '',
              v_zzh: '',
              v_type: ''
            }
          }],
          types: 'billManage',
          clientY: '',
          clientX: '',
          id: 'billIndex'
        }
      }
    },
    props: ['caseKey', 'mz', 'exportWordShow'],
    methods: {
      arrydata: function() {},
      mouseoverMethod(val, index) {
        if (val) {
          return
        } else {
          let oLi = this.$refs['ulLi' + index][0];
          oLi.className = 'hightHover';
        }
      },
      mouseoutMethod(val, index) {
        if (val) {
          return
        } else {
          let oLi = this.$refs['ulLi' + index][0];
          oLi.className = '';
        }
      },
      loadData() {
        let self = this,
          compCount = 0
        self.dossierLoading = true
        //  表单字典初始化
        if (this.checkRule('query/getperson/info', true) === true) {
          this.dispatchDossier(GET_PERSON_INFO_FROM_MAIN_DATA, { sfzh: this.caseKey }).then(() => {
            this.basicData = this.baseData.personInfo.xp
            console.log(this.baseData.personInfo.xp, 'xp');
            bus.$emit('getPeopleXm', this.basicData.XM)
            bus.$emit('allLoading')
            compCount++
            checkLoading()
          })
        } else {
          bus.$emit('getPeopleXm', this.basicData.XM)
          bus.$emit('allLoading')
          compCount++
          checkLoading()
        }
        if (this.checkRule('Person/GetReleteSource', true) === true) {
          this.dispatchDossier(RELETE_SOURCE, { zjhm: this.caseKey }).then(() => {
            this.resources = this.dossier.ReleteSource
            bus.$emit('allLoading')
            compCount++
            checkLoading()
          })
        } else {
          bus.$emit('allLoading')
          compCount++
          checkLoading()
        }
        if (this.checkRule('SysLabel/GetSysLabels', true) === true) {
          this.dispatchDossier(SYS_LABEL_GET_SYS_LABELS_KEYWORD, { Keyword: this.caseKey, LabelType: '1' }).then(() => {
            this.tages = this.sysLabel.SysLabelGetSysLabelsKeyword
            bus.$emit('allLoading')
            compCount++
            checkLoading()
          })
        } else {
          bus.$emit('allLoading')
          compCount++
          checkLoading()
        }

        function checkLoading() {
          if (compCount === 3) self.dossierLoading = false
        }
      },
      saveImage(e) {
        this.contextmenuFlag = true;
        this.menuDatas.clientY = e.clientY;
        this.menuDatas.clientX = e.clientX;
      },
      downloadImage() {
        let obj = document.createElement('a')
        obj.setAttribute('href', this.imageUrl);
        obj.setAttribute('download', '');
        let evObj = document.createEvent('MouseEvents');
        evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null)
        obj.dispatchEvent(evObj)
      },
      changeStatus() {
        this.contextmenuFlag = false;
      },
      callBack(idx) {
        if (idx === 0) {
          this.downloadImage()
        }
      }
      // 获取民族数据字典
      //    getNationLabel(val) {
      //      let res = !this.mz.MZDM ? false : this.mz.MZDM.find(d => d.value === val)
      //      if (!res) {
      //        return val
      //      } else {
      //        return res.label
      //      }
      //    }
    },
    created() {
      this.loadData();
      this.imageUrl = `${this.personImagePath}${this.$route.query.key}`
    },
    computed: {
      ...mapState(['dossier', 'sysLabel', 'baseData'])
    }
  }

</script>
