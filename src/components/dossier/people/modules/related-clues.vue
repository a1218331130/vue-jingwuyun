<!-- 关联线索 -->
<template>
<div class="certificate">
  <!-- 标题 -->
  <card-header title="关联线索" logtitle="添加关联线索" tool='addbtn' :caseKey="caseKey" :type=12 :tableData="tabelData"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tabelData" border stripe :show-header="true" @cell-mouse-enter="handleCurrentChange">
        <el-table-column type="index" class-name="vt_t" width="50" label="序号">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="描述" align="left">
          <template scope="scope">
            <p class="time-text">
              录入时间{{scope.row.LRSJ}}
            </p>
            <p class="other-text ">
              <span>标题:</span>{{scope.row.BT}}
              <span>录入人:</span>{{scope.row.LRR}}
              <span>标题:</span>{{scope.row.BQ}}
              <span>描述:</span>{{scope.row.MS}}

            </p>
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
import { DELETE_ARCHIVES, GETASSOCIATEDCUESINFO } from '../../../../store/types'
import { mapState } from 'vuex'
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
    }
  },
  methods: {
    loadData() {
      this.zdyData.map(item => {
        if(item.Module === '关联线索') {
          this.tabelData.push(item)
        }
      })
      this.dispatchDossier(GETASSOCIATEDCUESINFO, { idcard: this.caseKey }).then(() => {
        this.tabelData = this.dossier.getassociatedcuesinfo
        this.dossierLoading = false
      })
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
    this.loadData()
  },
  mounted() {},
  computed: {
    ...mapState(['dossier'])
  }
}
</script>
