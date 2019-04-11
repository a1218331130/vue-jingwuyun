<!-- 涉案信息 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'涉案信息('+tableData.length+'条信息)'" :tableData="tableData" :expand='true' @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="involved-box" v-show="expandMark">
    <el-col :span="24" v-loading="dossierLoading">
      <el-table :data="tableData">
        <el-table-column type="index" class-name="vt_t" label="序号" align="center">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="cobjms" label="案件名称" width="300" align="center">
          <template scope="scope">
            <p> {{scope.row.AJMC}}</p>
          </template>

        </el-table-column>
        <el-table-column label="案件编号" align="center">
          <template scope="scope">
            <p> {{scope.row.AJBH}}</p>
          </template>

        </el-table-column>
        <el-table-column label="采集时间" width="300" align="center">
          <template scope="scope">
            <p> {{scope.row.CJSJ}}</p>
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
import { GET_SHE_AN_INFO } from '../../../../store/types'
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
  props: ['carKey', 'zdyData'],
  components: {
    cardHeader
  },
  methods: {
    loadData() {
      this.dossierLoading = true
      if(this.checkRule('jwy/vehicleFile/getSheAnInfo', true) === true) {
        this.dispatch(GET_SHE_AN_INFO, { cphm: this.carKey }).then(() => {
          this.tableData = this.dossier.getSheAnInfo
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
      bus.$emit('update:dossierSubTitleNumber', { 'title': '涉案信息', 'number': val.length })
    }
  }
}
</script>
