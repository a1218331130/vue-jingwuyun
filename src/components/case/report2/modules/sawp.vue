<!-- 涉案物品 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="涉案物品"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box">
    <el-col :span="24">
      <el-table :data="tableData" stripe border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="物品名称" min-width="100"></el-table-column>

        <el-table-column prop="describe" label="物品描述" min-width="160">
          <template scope="scope">
            <p class="describe-text">
              {{scope.row.describe}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="tez" label="物品特征" width="220"></el-table-column>
        <el-table-column prop="caseTypeText" label="涉案类型" width="220"></el-table-column>
        <el-table-column prop="incone" label="来源" width="220"></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</div>
</template>

<style scoped lang="scss">
.kinship-box {
    margin-top: 13px;
}

.describe-text {
    white-space: normal;
}

.k-user-img-box {
    width: 49px;
    height: 49px;
    border: 1px solid #D7D7D7;
    margin: 10px auto;
    overflow: hidden;
    .k-user-img {
        width: 90%;
        height: 100%;
        margin: 1px auto;
    }
}
</style>

<script>
import { mapState } from 'vuex'
import mixin from '../../../../utils/mixin'
import {
  FETCH_INVOLVED_ITEM_LIST
} from '../../../../store/types'
import { DOWNLOAD_FILE_PATH } from '../../../../config'
import cardHeader from './card-header.vue'
export default {
  mixins: [mixin],
  components: {
    cardHeader
  },
  props: {
    reportData: {
      type: Array,
      default: () => {
        return null
      }
    }
  },
  computed: {
    ...mapState(['involvedItem'])
  },
  data() {
    return {
      caseId: '',
      cjrId: '', //
      tableData: []
    }
  },
  methods: {
    dataModel(val) {
      // 数据显示转换
      let _tempTab = val
      if(this.reportData) { // 判断是否显示报告数据
        _tempTab = this.reportData
      }
      this.tableData = _tempTab.map(row => {
        return {
          id: row.id,
          useIcon: DOWNLOAD_FILE_PATH + row.tpid,
          name: row.wpmc,
          tez: row.wptz,
          describe: row.wpms,
          caseTypeText: row.salxmc,
          incone: row.wply === '0' ? '手动添加' : '外部导入'
        }
      })
    },
    queryList() {
      if(this.checkUserRuleCase('ajgl/article/list', this.caseId, true, this.cjrId)) {
        // 查询列表
        this.dispatch(FETCH_INVOLVED_ITEM_LIST, {
          data: {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 10000
          }
        })
      }
    }
  },
  watch: {
    'involvedItem.PageData' (val) {
      this.dataModel(val)
    },
    reportData(val) {
      if(val) {
        this.dataModel(val)
      }
    }
  },
  mounted() {
    if(this.reportData) {
      this.dataModel(this.reportData)
    }
  },
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    this.cjrId = this.$route.query.b // 初始化获取案件id
    //      this.queryList()
  }
}
</script>
