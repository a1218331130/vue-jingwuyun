<!-- 通信方式 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'通信方式('+tableData.length+'条结果)'" :type=3 logtitle="添加通信方式" @call:change-update="changeUpdate" tool='addbtn' :caseKey="caseKey" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="10" class="certificate-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="序号" class-name="vt_t" align="center" >
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>
<el-table-column prop="ZJHM" label="通讯号码" align="center">
  <template scope="scope">
            <p> {{scope.row.txhm || scope.row.TXHM}}</p>
          </template>
</el-table-column>
<el-table-column label="通讯类型" align="center">
  <template scope="scope">
            <p> {{scope.row.txlx || scope.row.TXLX}}</p>
          </template>
</el-table-column>
<el-table-column label="姓名" align="center">
  <template scope="scope">
            <p> {{scope.row.xm || scope.row.XM}}</p>
          </template>
</el-table-column>
<el-table-column label="身份证号" align="center">
  <template scope="scope">
            <p> {{scope.row.ZJHM || scope.row.SFZH}}</p>
          </template>
</el-table-column>

<el-table-column label="创建时间" width="150" align="center">
  <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
</el-table-column>
<el-table-column prop="SJLY" label="数据来源" align="center">
  <template scope="scope">
            <p>
              {{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})`:(scope.row.sjly || scope.row.SJLY)}}
            </p>
          </template>
</el-table-column>
<el-table-column label="操作" align="center">
  <template scope="scope">
            <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'3',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
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
  import cardHeader from './card-header.vue'
  import dossierMixin from '../../dossierMixin'
  import { GET_PERSON_COMMUNICATION_INFO } from '../../../../store/types'
  import bus from '../../../../utils/bus'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    data() {
      return {
        tableData: [],
        telList: [], // 电话号码
        dossierLoading: true
      }
    },
    props: ['caseKey', 'zdyData'],
    components: {
      cardHeader
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        if (this.checkRule('jwy/pesonnelfiles/getPersonCommunicationInfo', true) === true) {
          this.dispatchDossier(GET_PERSON_COMMUNICATION_INFO, { idcard: this.caseKey }).then(() => {
            this.telList = []
            this.tableData = []
            this.tableData = this.dossier.getPersonCommunicationInfo.map(r => {
              this.telList.push(r.txhm || r.TXHM)
              return r
            })
            this.$emit('call:telList', this.telList.join(','))
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
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '通信方式', 'number': val.length })
      }
    }
  }

</script>
