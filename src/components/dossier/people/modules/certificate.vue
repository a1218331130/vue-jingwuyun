<!-- 证件信息 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'证件信息('+tableData.length+'条结果)'" logtitle="添加证件信息" @call:change-update="changeUpdate" :type=2 tool='addbtn' :caseKey="caseKey" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="10" class="certificate-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="序号" class-name="vt_t" align="center" width="50px">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>
<el-table-column label="证件类型" align="center" width="150px">
  <template scope="scope">
            <p> {{scope.row.ZJLXMC}}</p>

          </template>

</el-table-column>
<el-table-column prop="ZJHM" label="证件号码" align="center" width="300px">
  <template scope="scope">
            <p> {{scope.row.ZJHM}}</p>
          </template>
</el-table-column>
<el-table-column prop="MS" label="描述">
  <template scope="scope">
            <p> {{scope.row.MS}}</p>
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
              {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:scope.row.SJLY}}
            </p>
          </template>
</el-table-column>
<el-table-column label="操作" width="50" align="center">
  <template scope="scope">
            <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'2',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>

</el-table>
</el-col>
</el-row>
</div>
</template>

<style scoped lang="scss">
  .certificate-box {
    margin-top: 13px;
  }

  .dataURL-text {
    color: #54b9fc;
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

<script>
  import dossierMixin from '../../dossierMixin'
  import { GET_PERSON_CERTIFICATE_INFO } from '../../../../store/types'
  import { mapState } from 'vuex'
  import cardHeader from './card-header.vue'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [dossierMixin],
    data() {
      return {
        tableData: [],
        dossierLoading: true
      }
    },
    props: ['caseKey', 'zdyData'],
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        if (this.checkRule('jwy/pesonnelfiles/getPersonCertificateInfo', true) === true) {
          this.dispatchDossier(GET_PERSON_CERTIFICATE_INFO, { idcard: this.caseKey }).then(() => {
            this.tableData = this.dossier.getPersonCertificateInfo
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
    components: {
      cardHeader
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '证件信息', 'number': val.length })
      }
    },
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
