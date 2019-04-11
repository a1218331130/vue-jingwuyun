<!-- 车主信息 -->
<template>
<div class="car-kinship ">
  <!-- 标题 -->
  <card-header :title="'车主信息('+tableData.length+'条结果)'" @call:change-update="changeUpdate" :type=1 logtitle="添加车主信息" tool='addbtn' :carKey="carKey" :tableData="tableData" :jdcfdjddjh="jdcfdjddjh" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->

  <el-row :gutter="15" class="involved-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tableData">
        <el-table-column type="index" class-name="vt_t" label="序号" align="center">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>
<el-table-column label="姓名" width="100" align="center">
  <template scope="scope">
            <p v-if="scope.row.xm"> {{scope.row.xm || '暂无'}}</p>
            <p v-else> {{scope.row.XM || '暂无'}}</p>
          </template>

</el-table-column>
<el-table-column label="证件号码" width="200" align="center">
  <template scope="scope">
            <p v-if="scope.row.zjhm"> {{scope.row.zjhm || '暂无'}}</p>
            <p v-else> {{scope.row.ZJHM || '暂无'}}</p>
          </template>

</el-table-column>
<el-table-column label="人员描述" align="left">
  <template scope="scope">
            <p class="other-text" v-if="scope.row.ms && scope.row.ms.length > 0">
              <i><span>姓名：</span> {{scope.row.ms[0].xm || '暂无'}}</i>
              <i><span>曾用名：</span> {{scope.row.ms[0].cym || '暂无'}}</i>
              <i><span>别名/绰号：</span> {{scope.row.ms[0].bmch || '暂无'}}</i>
              <i><span>出生日期：</span> {{scope.row.ms[0].csrq || '暂无'}}</i>
              <i><span>性别：</span> {{scope.row.ms[0].xb || '暂无'}}</i>
              <i><span>民族：</span>{{scope.row.ms[0].mz || '暂无'}}</i>
              <i><span>户籍地址：</span>{{scope.row.ms[0].hjdz || '暂无'}}</i>
              <i><span>现住址：</span>{{scope.row.ms[0].xzz || '暂无'}}</i>
              <i><span>证件号码：</span>{{scope.row.ms[0].zjhm || '暂无'}}</i>
              <i><span>工作单位：</span>{{scope.row.ms[0].gzdw || '暂无'}}</i>
              <i><span>婚姻状况：</span>{{scope.row.ms[0].jyzkdm || '暂无'}}</i>
            </p>
            <p v-else class="phover">
              {{scope.row.MS}}
              <!--<span class=""><i class="iconfont icon-trash icondelete"-->
              <!--@click.prevent='deleteRow(scope.$index, tableData)'></i></span>-->
            </p>
          </template>
</el-table-column>


</el-table>

</el-col>
</el-row>

</div>
</template>

<style lang="scss" scoped>
  .involved-box {
    margin-top: 13px;
    .time-text {
      color: #ff6633;
    }
    .vt {
      vertical-align: top;
    }
    .describe-text {
      white-space: normal;
    }
    .relation-text {
      padding: 18px 15px;
      background: #88cfff;
      margin: 0 -15px;
      color: #fff;
      line-height: 27px;
      white-space: normal;
    }
    .time-text {
      color: #ff6633;
      margin-bottom: 0;
    }
    .other-text {
      white-space: normal;
      color: #000;
      margin-top: 10px;
      i {
        font-style: normal;
        margin-right: 10px;
      }
      span {
        display: inline-block;
        color: #999;
        margin-left: 10px;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .phover {
      display: block;
      min-height: 20px;
      white-space: normal;
      .icondelete {
        display: none;
        color: #6FB6EA;
        cursor: pointer;
      }
      &:hover .icondelete {
        display: inline-block;
      }
    }
  }

</style>


<script>
  import dossierMixin from '../../dossierMixin'
  import cardHeader from './card-header.vue'
  import mixin from '../../../../utils/mixin'
  import { GET_CHE_ZHU_INFO } from '../../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [mixin, dossierMixin],
    data() {
      return {
        dossierLoading: false,
        tableData: []
      }
    },
    props: ['carKey', 'zdyData', 'jdcfdjddjh'],
    components: {
      cardHeader
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        this.dossierLoading = true
        if (this.checkRule('jwy/vehicleFile/getCheZhuInfo', true) === true) {
          this.dispatch(GET_CHE_ZHU_INFO, { cphm: this.carKey, jdcfdjddjh: this.jdcfdjddjh }).then(() => {
            this.tableData = this.dossier.getCheZhuInfo
            bus.$emit('allCarLoading')
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allCarLoading')
          this.dossierLoading = false
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
        bus.$emit('update:dossierSubTitleNumber', { 'title': '车主信息', 'number': val.length })
      }
    }
  }

</script>
