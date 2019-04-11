<!-- 亲属人员 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'亲属人群('+tableData.length+'条结果)'" :type=1 logtitle="添加亲属人群" @call:change-update="changeUpdate" tool='addbtn' :caseKey="caseKey" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->

  <el-row :gutter="15" class="involved-box" v-show="expandMark">
    <el-col :span="24" v-loading="!(dossierLoading===false && dictLoading===false)">
      <el-table :data="tableData" border stripe @cell-mouse-enter="handleCurrentChange">
        <el-table-column type="index" class-name="vt_t" label="序号" align="center">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>
<el-table-column prop="cobjms" label="姓名" width="100" align="center">
  <template scope="scope">
            <p v-if="scope.row.xm"> {{scope.row.xm}}</p>
            <p v-else> {{names(scope.row)}}</p>
          </template>

</el-table-column>
<el-table-column label="关系" width="100" align="center">
  <template scope="scope">
            <p v-if="scope.row.xm"> {{scope.row.gx}}</p>
            <p v-else> {{scope.row.GXMS}}</p>
          </template>

</el-table-column>
<el-table-column label="证件号码" width="200" align="center">
  <template scope="scope">
            <p v-if="scope.row.xm"> {{scope.row.zjhm}}</p>
            <p v-else> {{scope.row.ZJHM}}</p>
          </template>

</el-table-column>
<el-table-column label="现住址" align="center">
  <template scope="scope">
    {{locations(scope.row)}}
  </template>
</el-table-column>
<el-table-column label="性别" align="center">
  <template scope="scope">
    <!-- {{scope.row.ms.xb?scope.row.ms.xb:''}} -->
    {{sex(scope.row)}}
  </template>
</el-table-column>
<!-- <el-table-column label="人员描述" align="left">
  <template scope="scope">

            <p class="other-text" v-if="scope.row.ms">
              <span>曾用名：</span> {{scope.row.ms.cym}}
              <span>别名/绰号：</span> {{scope.row.ms.bmch}}
              <span>出生日期：</span> {{scope.row.ms.csrq}}
              <span>性别：</span> {{scope.row.ms.xb}}
              <span>民族：</span>{{scope.row.ms.mz}}
              <span>户籍地址：</span>{{scope.row.ms.hjdz}}
              <span>现住址:</span>{{scope.row.ms.xzz}}
              <span>证件号码:</span>{{scope.row.ms.zjhm}}
              <span>单位:</span>{{scope.row.ms.gzdw}}
              <span>婚姻状况:</span>{{scope.row.ms.jyzkdm}}
            </p>
            <p v-else class="phover">
              {{scope.row.MS}} -->
<!--<span class=""><i class="iconfont icon-trash icondelete"-->
<!--@click.prevent='deleteRow(scope.$index, tableData)'></i></span>-->
<!-- </p>
          </template>
</el-table-column> -->
<el-table-column label="创建时间" width="150" align="center">
  <template scope="scope">
      <p>{{scope.row.CZSJ?`${scope.row.CZSJ}` : ""}}</p>
    </template>
</el-table-column>
<el-table-column label="数据来源" width="100" align="center">
  <template scope="scope">
            <p>{{scope.row.CZRNAME?`手动(${scope.row.CZRNAME})` : "检索"}}</p>
          </template>
</el-table-column>
<el-table-column label="操作" width="50" align="center">
  <template scope="scope">
            <el-button type="text" @click="dossierDeLInfo(scope.row.id || scope.row.ID,'1',loadData)" title="删除" v-if="scope.row.id || scope.row.ID" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>

</el-table>

</el-col>
</el-row>
</div>
</template>

<style scoped lang="scss">
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
      margin-top: 0;
      span {
        display: inline-block;
        color: #999;
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
  import cardHeader from './card-header.vue'
  import dossierMixin from '../../dossierMixin'
  import { clone } from '../../../../utils/util'
  import { DELETE_ARCHIVES, GETPERSONFAMILYINFO } from '../../../../store/types'
  import bus from '../../../../utils/bus'
  import { mapState } from 'vuex'
  export default {
    mixins: [dossierMixin],
    data() {
      return {
        dictList: [],
        infoMz: '',
        dossierLoading: true,
        tableData: [],
        deletekey: {},
        count: 0
        // expandMark: false
      }
    },
    props: ['caseKey', 'zdyData', 'mz'],
    components: {
      cardHeader
    },
    methods: {
      changeUpdate() {
        this.loadData()
      },
      loadData() {
        // this.dispatchDossier(PERSON_FAMILY, { zjhm: this.caseKey }).then(() => {
        //   // this.tableData = this.dossier.PersonFamily
        //   this.dossier.PersonFamily.map(item => {
        //     this.tableData.push(item)
        //   })
        //   this.zdyData.map(item => {
        //     if (item.Module === '亲属人群') {
        //       this.tableData.push(item)
        //     }
        //   })
        //   this.dossierLoading = false;
        // })
        if (this.checkRule('jwy/pesonnelfiles/getpersonfamilyinfo', true) === true) {
          this.dispatchDossier(GETPERSONFAMILYINFO, { idcard: this.caseKey }).then(() => {
            this.tableData = clone(this.dossier.getpersonfamilyinfo)
            if (this.tableData) {
              this.relation
            }
            bus.$emit('allLoading')
            this.dossierLoading = false;
          })
        } else {
          bus.$emit('allLoading')
          this.dossierLoading = false;
        }
      },
      names(val) {
        if (val.XM) {
          return val.XM
        }
        return '';
      },
      sex(val) {
        if (val.ms) {
          return val.ms.xb
        }
        return '';
      },
      locations(val) {
        if (val.ms) {
          return val.ms.xzz
        }
        return '';
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
      // 获取民族数字字典
      //    getNationLabel(val) {
      //      console.log(val);
      //      let res = !this.mz.MZDM ? false : this.mz.MZDM.find(d => d.value === val)
      //      if (!res) {
      //        return val
      //      } else {
      //        return res
      //      }
      //    }
    },
    created() {
      this.loadData();
    },
    computed: {
      ...mapState(['dossier'])
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '亲属人群', 'number': val.length })
      }
    }
  }

</script>
