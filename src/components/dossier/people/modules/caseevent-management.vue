<!-- 案事件关联 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header :title="'案事件关联('+tabelData.length+'条数据)'" logtitle="添加案事件关联" @call:change-update="changeUpdate" tool='addbtn' :caseKey="caseKey" :type=11 :tableData="tabelData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tabelData" border stripe :show-header="true">
        <el-table-column type="index" class-name="vt_t" width="50" label="序号">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>

<el-table-column label="描述" align="left">
  <template scope="scope">
            <p class="time-text">
              {{scope.row.BT}}
            </p>
            <p class="other-text ">
              <span>名称:</span>{{scope.row.BT}}
              <span>摘要:</span>{{scope.row.BQ}}
              <span>描述:</span>{{scope.row.MS}}
              <span>来源:</span>{{scope.row.LRR}}
              <span>录入时间:</span>{{scope.row.LRSJ}}
            </p>
          </template>
</el-table-column>
<el-table-column label="创建时间" width="150" align="center">
  <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
</el-table-column>
<el-table-column prop="LRR" label="数据来源" align="center" width="150px">
  <template scope="scope">
            <p>
              {{scope.row.LRR !== '系统检索'?`手动(${scope.row.LRR})`:scope.row.LRR}}
            </p>
          </template>
</el-table-column>
<el-table-column label="操作" width="50" align="center">
  <template scope="scope">
            <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'11',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
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

  .time-text {
    color: #ff6633;
    margin-bottom: 0;
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
  import { GETASSOCIATEDCUESINFO } from '../../../../store/types'
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
        bus.$emit('update:dossierSubTitleNumber', { 'title': '案事件关联', 'number': val.length })
      }
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        if (this.checkRule('jwy/pesonnelfiles/getassociatedcuesinfo', true) === true) {
          this.dispatchDossier(GETASSOCIATEDCUESINFO, { idcard: this.caseKey }).then(() => {
            this.tabelData = this.dossier.getassociatedcuesinfo
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
    mounted() {},
    computed: {
      ...mapState(['dossier'])
    }
  }

</script>
