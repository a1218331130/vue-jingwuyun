<!-- 社交关系 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header :title="'社交关系('+tabelData.length+'条数据)'" logtitle="添加社交关系" tool='addbtn' @call:change-update="changeUpdate" :caseKey="caseKey" :type=10 :tableData="tabelData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tabelData" border stripe :show-header="true">
        <el-table-column type="index" class-name="vt_t" label="序号">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>
<el-table-column label="描述" align="left">
  <template scope="scope">
            <p class="other-text">
              <span>性别:</span>{{scope.row.XB}}
              <span>关系人姓名:</span>{{scope.row.GXRXM}}
              <span>关系描述:</span>{{scope.row.GXMS}}
              <span>关系人证件号码:</span>{{scope.row.GXRZJHM}}
              <span>标签:</span>{{scope.row.BQ}}
              <span>采集时间:</span>{{scope.row.CJSJ}}
              <span>籍贯:</span>{{scope.row.JG}}
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
            <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'10',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>
</el-table>
</el-col>
</el-row>
</div>
</template>

<style lang="scss" scoped>
  .kinship-box {
    text-align: center;
    margin-top: 13px;
    min-height: 113px;
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
  .certificate span {
    margin-right: 5px;
  }

</style>

<script>
  import cardHeader from './card-header.vue'
  import dossierMixin from '../../dossierMixin'
  import { GETSOCIALRELATIONSHIPSINFO } from '../../../../store/types'
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
        tabelData: []
      }
    },
    props: ['caseKey', 'zdyData'],
    watch: {
      zdyData() {
        this.loadData()
      },
      tabelData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '社交关系', 'number': val.length })
      }
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        if (this.checkRule('jwy/pesonnelfiles/getsocialrelationshipsinfo', true) === true) {
          this.dispatchDossier(GETSOCIALRELATIONSHIPSINFO, { idcard: this.caseKey }).then(() => {
            this.tabelData = this.dossier.getsocialrelationshipsinfo
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
      this.loadData()
    },
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
