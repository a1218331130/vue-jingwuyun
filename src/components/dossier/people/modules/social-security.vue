<!-- 人事社保 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header :title="'人事社保('+tableData.length+'条结果)'" logtitle="添加人事社保" @call:change-update="changeUpdate" :type=8 tool='addbtn' :caseKey="caseKey" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-show="expandMark">
    <el-col :span="24">
      <el-row :gutter="10" class="certificate-box" v-loading="dossierLoading">
        <el-col :span="24" v-if="rzData.length>0 || sbData.length>0 || elseData.length>0">
          <el-tabs value="RZ" v-if="rzData.length>0 || false">
            <el-tab-pane label="任职" name="RZ">
              <el-table border stripe :data="rzData" @cell-mouse-enter="handleCurrentChange" :show-header="true">
                <el-table-column class-name="vt_t" width="50" align="center" type="index" label="序号">
                  <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
</el-table-column>
<el-table-column label="详细描述" align="left">
  <template scope="scope">
                    <p class="other-text ">
                      <span>单位名称:</span>{{scope.row.DWMC}}
                      <span>职务:</span>{{scope.row.ZW}}
                      <span>人员证件号码:</span>{{scope.row.ZJHM}}
                      <span>入职时间:</span>{{scope.row.CJSJ}}
                      <span>单位代码:</span>{{scope.row.DWDM}}
                      <span>人员姓名:</span>{{scope.row.RYNAME}}
                    </p>
                  </template>
</el-table-column>
<el-table-column label="创建时间" width="150" align="center">
  <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
</el-table-column>
<el-table-column prop="ZJRNAME" label="数据来源" align="center" width="150px">
  <template scope="scope">

                    <p>{{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})` : "检索"}}</p>

                  </template>
</el-table-column>
<el-table-column label="操作" width="50" align="center">
  <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'12',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
</el-table-column>

</el-table>
</el-tab-pane>
</el-tabs>
<el-tabs value="SB" v-if="sbData.length>0 || false">
  <el-tab-pane label="社保" name="SB">
    <el-table :data="sbData" border stripe @cell-mouse-enter="handleCurrentChange" :show-header="true">
      <el-table-column class-name="vt_t" width="50" align="center" type="index" label="序号">
        <template scope="scope">
                    <el-tag type="primary">{{scope.$index + 1}}</el-tag>
                  </template>
      </el-table-column>
      <el-table-column label="详细描述" align="left">
        <template scope="scope">
                    <p class="other-text ">
                      <span>银行单位名称:</span>{{scope.row.YHDWMC}}
                      <span>联系电话:</span>{{scope.row.LXDH}}
                      <span>单位名称:</span>{{scope.row.DWMC}}
                      <span>证件号码:</span>{{scope.row.ZJHM}}
                      <span>工种:</span>{{scope.row.GZ}}
                      <span>社保卡号:</span>{{scope.row.SBKH}}
                      <span>性别:</span>{{scope.row.XB}}
                      <span>就业状态:</span>{{scope.row.JYZT}}
                      <span>职务:</span>{{scope.row.ZW}}
                      <span>办理单位名称:</span>{{scope.row.BLDW}}
                      <span>代扣机构:</span>{{scope.row.DKJG}}
                      <span>人员姓名:</span>{{scope.row.RYXM}}
                      <span>文化程度:</span>{{scope.row.WHCD}}
                    </p>
                  </template>
      </el-table-column>
      <el-table-column prop="ZJRNAME" label="数据来源" align="center" width="150px">
        <template scope="scope">

                    <p>{{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})` : "检索"}}</p>

                  </template>
      </el-table-column>
      <el-table-column label="操作" width="50" align="center">
        <template scope="scope">
                    <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'13',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
                  </template>
      </el-table-column>
    </el-table>
  </el-tab-pane>
</el-tabs>
<el-tabs value="ELSE" v-if="elseData.length>0 || false">
  <el-tab-pane label="其它" name="ELSE">
    <el-table :data="elseData" border stripe @cell-mouse-enter="handleCurrentChange" :show-header="true">
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
      <el-table-column prop="ZJRNAME" label="数据来源" align="center" width="150px">
        <template scope="scope">

                    <p>{{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})` : "检索"}}</p>

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
  .certificate-box {
    min-height: 113px;
    margin-top: 13px;
  }

  .wrn_text {
    color: #fd8a8a;
  }

  .describe-text {
    white-space: normal;
  }

  .dataURL-text {
    color: #54b9fc;
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
  }

  .certificate span {
    margin-right: 5px;
  }

  .el-tabs {
    margin-bottom: 10px !important;
    margin-top: -13px;
  }

  .el-tabs__item.is-active {
    color: #5FAAE2;
  }

  .el-tabs__active-bar {
    background-color: #5FAAE2;
  }

</style>


<script>
  import cardHeader from './card-header.vue'
  import dossierMixin from '../../dossierMixin'
  import { GETSOCIALSECURITYINFO, DELETE_ARCHIVES } from '../../../../store/types'
  import bus from '../../../../utils/bus'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    components: {
      cardHeader
    },
    data() {
      return {
        dossierLoading: true,
        activeName: 'RZ',
        count: {
          tx: '1',
          ta: '1'
        },
        rzData: [],
        sbData: [],
        elseData: [],
        tableData: []
      }
    },
    props: ['caseKey', 'zdyData'],
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        if (this.checkRule('jwy/pesonnelfiles/getsocialsecurityinfo', true) === true) {
          this.dispatchDossier(GETSOCIALSECURITYINFO, { idcard: this.caseKey }).then(() => {
            this.rzData = this.dossier.getsocialsecurityinfo.RZ
            this.sbData = this.dossier.getsocialsecurityinfo.SB
            this.elseData = this.dossier.getsocialsecurityinfo.ELSE
            bus.$emit('allLoading')
            this.tableData = this.rzData.concat(this.sbData).concat(this.elseData)
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allLoading')
          this.dossierLoading = false;
        }
      },
      handleCurrentChange(val) {
        this.deletekey = val
      },
      deleteRow(index, rows) {
        this.$confirm('是否要删除该条自定义数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          rows.splice(index, 1)
          this.dispatchDossier(DELETE_ARCHIVES, this.deletekey).then(() => {
            this.$message('档案删除成功');
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
      }
    },
    created() {
      this.loadData();
    },
    computed: {
      ...mapState(['dossier'])
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '人事社保', 'number': val.length })
      }
    }
  }

</script>
