<template>
  <div>
    <card-header title="串案信息"></card-header>
    <div>
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="baseInfo">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="caseName" label="案件名称"></el-table-column>
        <el-table-column prop="caseType" label="案件类别"></el-table-column>
        <el-table-column prop="area" label="案发地点"></el-table-column>
        <el-table-column prop="time" label="案发时间"></el-table-column>
        <el-table-column prop="org" label="管辖单位"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
  import {mapState} from 'vuex'
  import mixin from '../../../utils/mixin'
  import {
    FETCH_SERIES_CASE_LIST
  } from '../../../store/types'

  import cardHeader from '../report/modules/card-header.vue'

  export default {
    mixins: [mixin],
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['seriesCase'])
    },
    data() {
      return {
        caseId: '',
        baseInfo: []
      }
    },
    methods: {
      queryList() {
        if (this.checkRuleCase('ajgl/oncase/list', this.caseId)) {
          this.dispatch(FETCH_SERIES_CASE_LIST, {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 10000
          })
        }
      }
    },
    watch: {
      'seriesCase.PageData' (val) {
        this.baseInfo = val.map(d => {
          return {
            id: d.id,
            caseName: d.ajmc,
            caseType: d.ajlx,
            area: d.afdd,
            org: d.gxdw,
            time: d.afsj
          }
        })
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryList()
    },
    mounted() {
    }
  }
</script>
