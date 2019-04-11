<!-- 人员基本信息 -->
<template>
<div class="basic-box">
  <!-- 标题 -->
  <card-header title="基础信息" :tranInfo="tranInfo" :tool="checkUserRuleCase('ajgl/lawcase/update',caseId,true,this.cjrId)?baseInfoTool:false" @call:edit="basicEdit">
    <dd slot="export" v-if="exportWordShow" style="width: 100px;color: #fff;">
      <el-button type="text" class="export-text iconfont icon-word" @click="$emit('call:exportWord')">导出word
      </el-button>
    </dd>
    <dd slot="export" v-if="tranInfo.exportSnapshot">
      <el-button type="text" class="export-text iconfont icon-daochu" @click="$emit('call:exportSnapshot')">快照
      </el-button>
    </dd>
    <dd slot="export" v-if="tranInfo.print">
      <print-button btnType="text" class="print-text iconfont icon-dayin" printRange="report-content-ref"></print-button>
    </dd>
  </card-header>
  <!-- 内容 -->
  <el-row :gutter="15" :class="{'info-box':true}">
    <!-- 信息 -->
    <el-col :span="24">
      <el-row>
        <el-col :span="8" class="info-text-box">
          <label>案件编号</label>
          <span class="lable-text-input">
            <span class="hover-menu" data-type="case">{{form.caseNo}}</span>
          </span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>案件名称</label>
          <span class="lable-text-input">{{form.caseName}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>案件状态</label>
          <span class="lable-text-input">{{form.caseState}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>案件类别</label>
          <span class="lable-text-input">{{form.reportTypeText}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>报案时间</label>
          <span class="lable-text-input">{{form.reportTime}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>作案特点</label>
          <span class="lable-text-input">{{form.means}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>作案时间上限</label>
          <span class="lable-text-input">{{form.upTime}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>发案时间下限</label>
          <span class="lable-text-input">{{form.downTime}}</span>
        </el-col>
        <el-col :span="8" class="info-text-box">
          <label>发案地点</label>
          <span class="lable-text-input">{{form.area}}
            <span v-if="!form.area&&(form.longitude||form.latitude)">
              <span>经度：{{parseInt(form.longitude).toFixed(3)}} </span>
              <span class="info">纬度：{{parseInt(form.latitude).toFixed(3)}}</span>
            </span>
            <i class="icon iconfont icon-coordinates_fill" style="font-size: 20px;
    color: #444;cursor:pointer;" @click="viewMap()"></i>
          </span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" class="info-text-box">
          <label>简要案情</label>
          <span class="lable-text-input" style="width: 80%">{{form.desc}}</span>
        </el-col>
      </el-row>
      <!-- <el-row>
           <el-col :span="24" class="info-text-box">
             <label>办案人员</label>
             <span class="lable-text-input" style="width: 80%"></span>
           </el-col>
         </el-row>-->
    </el-col>
  </el-row>
  <editor :dialog="editorDialog" @close="editorDialog=false" @call:submit="editorSummit"></editor>
  <!-- 地图查看 -->
  <map-view-dialog :dialog="addressDialog" :data="mapData" @close="addressDialog = false" :size="'full'"></map-view-dialog>

</div>
</template>

<style scoped lang="scss">
  .basic-box {
    background: #fff;
    margin-bottom: 10px;
  }

  .info-box {
    margin-top: 13px;
    overflow: hidden;
    .users-image {
      height: 145px;
      border: 1px solid #D7D7d7;
      text-align: center;
      background-color: #F2F2F2;
      img {
        margin: 5px;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
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
    .info-text-name {
      margin-bottom: 12px;
      margin-left: 10px;
      .name {
        font-size: 22px;
        color: #1E1E1E;
      }
    }
    .info-text-box {
      display: flex;
      label {
        background-color: #F2F2F2;
        min-height: 28px;
        line-height: 28px;
        padding: 0 10px;
        margin-right: 10px;
        margin-bottom: 2px;
        display: inline-block; // text-align: justify;
        // text-align-last: justify;
        &:after {
          content: ':';
        }
      }
      span.lable-text-input {
        line-height: 28px;
        width: 70%;
        .info {
          padding-left: 10px;
        }
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
  import mixin from '../../../utils/mixin'
  import { GET_CASE_INFO } from '../../../store/types'
  import cardHeader from './card-header.vue'
  import mapViewDialog from './map-view-dialog'
  import editor from './editor.vue'
  import printButton from '../../../widgets/print/print.vue'

  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      editor,
      mapViewDialog,
      printButton
    },
    props: {
      tranInfo: {
        type: Object,
        default: function() {
          return {
            print: true,
            exportSnapshot: true,
            tool: true
          }
        }
      },
      baseInfoTool: {
        type: Boolean,
        default: true
      },
      reportData: {
        type: Object,
        default: () => {
          return null
        }
      },
      exportWordShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        addressDialog: false,
        editorDialog: false,
        editMode: false,
        caseId: '',
        cjrId: '',
        form: {},
        mapData: {
          pos: {
            jd: '109.90821838',
            wd: '27.40741539'
          }
        }
      }
    },
    computed: {
      ...mapState(['caseInfo'])
    },
    methods: {
      viewMap() {
        let jd = this.caseInfo.Model.jd;
        let wd = this.caseInfo.Model.wd;
        if (!jd || !wd) {
          this.$message({ type: 'warning', message: '没有经纬度数据，无法加载地图信息' })
        } else {
          this.mapData.pos.jd = jd;
          this.mapData.pos.wd = wd;
          this.addressDialog = true;
        }
      },
      dataModel(val) {
        // 数据显示转换
        if (this.reportData) { // 判断是否显示报告数据
          this.form = {
            caseNo: this.reportData.ajbh,
            caseState: this.reportData.ajztmc,
            caseName: this.reportData.ajmc,
            upTime: this.reportData.fasjsx,
            downTime: this.reportData.fasjxx,
            reportTime: this.reportData.basj,
            reportType: this.reportData.ajlb,
            reportTypeText: this.reportData.ajlbmc,
            means: this.reportData.zasdmc,
            area: this.reportData.fadd,
            desc: this.reportData.jyaq,
            longitude: this.reportData.jd, // 经度
            latitude: this.reportData.wd // 纬度
          }
        } else {
          this.form = {
            caseNo: val.ajbh,
            caseState: val.ajztmc,
            caseName: val.ajmc,
            upTime: val.fasjsx,
            downTime: val.fasjxx,
            reportTime: val.basj,
            reportType: val.ajlb,
            reportTypeText: val.ajlbmc,
            means: val.zasdmc,
            area: val.fadd,
            desc: val.jyaq,
            longitude: val.jd, //  this.reportData.jd, // 经度
            latitude: val.wd // this.reportData.wd // 纬度
          }
        }
      },
      basicEdit() {
        this.editorDialog = true
      },
      editorSummit(s) {
        if (s) {
          this.editorDialog = false
          this.getCaseInfo(this.caseId)
        }
      },
      getCaseInfo(caseId) {
        if (this.checkUserRuleCase('ajgl/lawcase/info', caseId, true, this.cjrId)) {
          // 查询案件基础信息
          this.dispatch(GET_CASE_INFO, { data: { id: caseId } })
        }
      },
      initCaseInfo() {
        // 初始化案件信息
        this.dataModel(this.caseInfo.Model)
      }
    },
    watch: {
      'caseInfo.Model' (val) {
        if (val) {
          this.dataModel(val)
        }
      },
      reportData(val) {
        if (val) {
          this.dataModel(val)
        }
      }
    },
    mounted() {},
    created() {
      // 案件编号
      this.caseId = this.$route.query.a
      this.cjrId = this.$route.query.b
      //      if (caseId) {
      //        this.getCaseInfo(caseId)
      //      }
      this.initCaseInfo()
    }
  }

</script>
