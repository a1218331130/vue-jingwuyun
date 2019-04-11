<!-- 财产信息 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header :title="'财产信息('+activeData.length+'条结果)'" logtitle="添加财产信息" @call:change-update="changeUpdate" tool='addbtn' :caseKey="caseKey" :type=6 :tableData="activeData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-show="expandMark">
    <el-col :span="24">
      <el-row :gutter="10" class="certificate-box" v-loading="dossierLoading">
        <el-col :span="24" v-if="gqData.length>0 || fcData.length>0 || yhData.length>0 || clData.length>0 || elseData.length>0">
          <el-tabs value="GQ" v-if="gqData.length>0 || false">
            <el-tab-pane label="股权" name="GQ">
              <el-table :data="gqData" border stripe :show-header="true">
                <el-table-column class-name="vt_t" label="序号" width="50" align="center" type="index">
                  <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
</el-table-column>
<el-table-column label="详细描述" align="left">
  <template scope="scope">
                    <p class="other-text ">
                      <span>企业名称:</span>{{scope.row.QYMC}}
                      <span>投资时间:</span>{{scope.row.TZSJ}}
                      <span>投资金额:</span>{{scope.row.TZJE}}
                      <span>企业编号:</span>{{scope.row.QYBH}}
                      <span>人员证件号码:</span>{{scope.row.ZJHM}}
                      <span>投资比例:</span>{{scope.row.TZBL}}
                      <span>人员姓名:</span>{{scope.row.RYNAME}}

                    </p>
                  </template>
</el-table-column>
<el-table-column label="创建时间" width="150" align="center">
  <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
</el-table-column>
<el-table-column prop="SJLY" label="数据来源" align="center" width="150px">
  <template scope="scope">
                    <p>
                      {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:"检索"}}
                    </p>
                  </template>
</el-table-column>
<el-table-column label="操作" width="50" align="center">
  <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'5',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
</el-table-column>

</el-table>
</el-tab-pane>
</el-tabs>
<el-tabs value="FC" v-if="fcData.length>0 || false">
  <el-tab-pane label="房产" name="FC">
    <el-table :data="fcData" border stripe :show-header="true">
      <el-table-column class-name="vt_t" width="50" align="center" type="index" label="序号">
        <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
      </el-table-column>
      <el-table-column label="详细描述" align="left">
        <template scope="scope">
                    <p class="other-text ">
                      <span>房屋地址:</span>{{scope.row.FWDZ}}
                      <span>面积:</span>{{scope.row.MJ}}
                      <span>人员证件号码:</span>{{scope.row.ZJHM}}
                      <span>房屋用途:</span>{{scope.row.YT}}
                      <span>登记时间:</span>{{scope.row.DJSJ}}
                      <span>产权证证件号码:</span>{{scope.row.CQZZJHM}}
                      <span>房屋编号:</span>{{scope.row.FWBH}}
                      <span>人员姓名:</span>{{scope.row.RYNAME}}
                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
      </el-table-column>
      <el-table-column prop="SJLY" label="数据来源" align="center" width="150px">
        <template scope="scope">
                    <p>
                      {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:"检索"}}
                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'6',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
      </el-table-column>

    </el-table>

  </el-tab-pane>
</el-tabs>
<el-tabs value="YH" v-if="yhData.length>0 || false">
  <el-tab-pane label="银行" name="YH">
    <el-table :data="yhData" border stripe :show-header="true">
      <el-table-column class-name="vt_t" width="50" align="center" type="index" label="序号">
        <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
      </el-table-column>
      <el-table-column label="详细描述" align="left">
        <template scope="scope">
                    <p class="other-text ">
                      <span>开户名:</span>{{scope.row.KHMC}}
                      <span>银行账号:</span>{{scope.row.YHZH}}
                      <span>人员姓名:</span>{{scope.row.RYNAME }}
                      <span>人员证件号码:</span>{{scope.row.ZJHM}}
                      <span>开户行单位名称:</span>{{scope.row.DWMC}}
                      <span>开户日期:</span>{{scope.row.KHRQ}}

                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
      </el-table-column>
      <el-table-column prop="SJLY" label="数据来源" align="center" width="150px">
        <template scope="scope">
                    <p>
                      {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:"检索"}}
                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'7',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
      </el-table-column>

    </el-table>
  </el-tab-pane>
</el-tabs>
<el-tabs value="CL" v-if="clData.length>0 || false">
  <el-tab-pane label="车辆" name="CL">
    <el-table :data="clData" border stripe :show-header="true">
      <el-table-column class-name="vt_t" width="50" align="center" type="index" label="序号">
        <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
      </el-table-column>
      <el-table-column label="详细描述" align="left">
        <template scope="scope">
                    <p class="other-text ">
                      <span>车牌号码:</span>{{scope.row.CPHM}}
                      <span>品牌名称:</span>{{scope.row.PPMC}}
                      <span>车辆型号:</span>{{scope.row.CLXH }}
                      <span>人员证件号码:</span>{{scope.row.ZJHM}}
                      <span>人员姓名:</span>{{scope.row.RYNAME}}

                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
      </el-table-column>
      <el-table-column prop="SJLY" label="数据来源" align="center" width="150px">
        <template scope="scope">
                    <p>
                      {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:"检索"}}
                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'8',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
      </el-table-column>
    </el-table>
  </el-tab-pane>
</el-tabs>
<el-tabs value="ELSE" v-if="elseData.length>0 || false">
  <el-tab-pane label="其它" name="ELSE">
    <el-table :data="elseData" border stripe :show-header="true">
      <el-table-column class-name="vt_t" width="50" align="center" type="index" label="序号">
        <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
      </el-table-column>
      <el-table-column label="详细描述" align="left">
        <template scope="scope">
                    <p class="other-text ">
                      <span>标题:</span>{{scope.row.BT}}
                      <span>标签:</span>{{scope.row.BQ}}
                      <span>描述:</span>{{scope.row.MS }}

                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
      </el-table-column>
      <el-table-column prop="SJLY" label="数据来源" align="center" width="150px">
        <template scope="scope">
                    <p>
                      {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:"检索"}}
                    </p>
                  </template>
      </el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'9',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
      </el-table-column>

    </el-table>
  </el-tab-pane>
</el-tabs>
</el-col>
<el-col :span="24" v-else>
  <div class="empty "></div>
</el-col>
</el-row>
</el-col>
</el-row>
</div>
</template>

<style lang="scss" scoped>
  .kinship-box {
    text-align: center;
    margin-top: 13px;
  }

  .certificate-box {
    min-height: 113px;
  }

  .describe-text {
    white-space: normal;
  }

  .dataURL-text {
    color: #54b9fc;
  }

  .el-tabs {
    margin-bottom: 10px !important;
    margin-top: -13px !important;
  }

  .el-tabs__item.is-active {
    color: #5FAAE2;
  }

  .el-tabs__active-bar {
    background-color: #5FAAE2;
  }

  .other-text {
    white-space: normal;
    color: #000;
    span {
      display: inline-block;
      color: #999;
      margin-right: 5px;
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }

  .phover {
    display: block;
    min-height: 20px;
    .icondelete {
      display: none;
      color: #6FB6EA;
      cursor: pointer;
    }
    &:hover .icondelete {
      display: inline-block;
    }
  }

</style>
<style>
  .certificate .el-tabs__nav {
    float: left;
    border: 0;
  }

  .certificate span {
    margin-right: 5px;
  }

</style>

<script>
  import cardHeader from './card-header.vue'
  import dossierMixin from '../../dossierMixin'
  import { GETPROPERTYINFO } from '../../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [dossierMixin],
    components: {
      cardHeader
    },
    data() {
      return {
        dossierLoading: true,
        tableData: [],
        gqData: [],
        fcData: [],
        yhData: [],
        clData: [],
        elseData: [],
        activeName: 'GQ',
        activeData: []
      }
    },
    props: ['caseKey', 'zdyData'],
    watch: {
      tableData: {
        handler(val) {
          this.activeData = [].concat(val.GQ).concat(val.FC).concat(val.CL).concat(val.YH).concat(val.ELSE)
        },
        deep: true
      },
      activeData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '财产信息', 'number': val.length })
      }
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        if (this.checkRule('jwy/pesonnelfiles/getpropertyinfo', true) === true) {
          this.dispatchDossier(GETPROPERTYINFO, { idcard: this.caseKey }).then(() => {
            this.tableData = this.dossier.getpropertyinfo
            this.gqData = this.dossier.getpropertyinfo.GQ
            this.fcData = this.dossier.getpropertyinfo.FC
            this.clData = this.dossier.getpropertyinfo.CL
            this.yhData = this.dossier.getpropertyinfo.YH
            this.elseData = this.dossier.getpropertyinfo.ELSE
            bus.$emit('allLoading')
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allLoading')
          this.dossierLoading = false;
        }
      }
    },
    created() {
      this.loadData();
    },
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
