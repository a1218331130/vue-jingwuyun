<!-- 虚拟账号 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'虚拟账号('+tableData.length+'条结果)'" :type=4 logtitle="添加虚拟账号" @call:change-update="changeUpdate" tool='addbtn' :caseKey="caseKey" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="10" class="certificate-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="序号" class-name="vt_t" align="center" width="50px">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>
<el-table-column label="账号类型" align="center" width="150px" prop="ZHLX">
  <template scope="scope">
            <p> {{scope.row.ZHLX}}</p>
          </template>
</el-table-column>
<el-table-column prop="ZH" label="账号" align="center" width="150px">
  <template scope="scope">
            <p> {{scope.row.ZH}}</p>
          </template>
</el-table-column>
<el-table-column prop="NC" label="昵称" align="center" width="150px">
  <template scope="scope">
            <p> {{scope.row.NC}}</p>
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
            <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'4',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
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
  import { GET_VIRTUAL_INFO } from '../../../../store/types'
  import bus from '../../../../utils/bus'
  import { mapState } from 'vuex'
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
        if (this.checkRule('jwy/pesonnelfiles/getVirtualInfo', true) === true) {
          this.dispatchDossier(GET_VIRTUAL_INFO, { idcard: this.caseKey }).then(() => {
            this.tableData = this.dossier.getVirtualInfo
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
    computed: {
      ...mapState(['dossier'])
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '虚拟账号', 'number': val.length })
      }
    }
  }

</script>
