<!-- 侦查导图 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="侦查导图"></card-header>
  <!-- 内容 -->
  <el-row class="certificate-box">
    <P v-if="chartDataList.length === 0" style="color: #5e7382;text-align: center">暂无数据</P>
    <gocharts v-if="chartDataList.length > 0" :ref="'goBoxZC'+index" :boxId="'goBoxZC_'+ index" :key="index" v-for="(item,index) in chartDataList" class="maker-box" :data="item" :options="{readOnly:true,allowZoom:false}"></gocharts>
  </el-row>
</div>
</template>

<style scoped lang="scss">
  .certificate-box {
    margin-top: 13px;
    width: 100%;
    .maker-box {
      width: 100%;
      height: 500px;
      margin: 5px auto;
    }
  }

</style>

<script>
  import mixin from '../../../../utils/mixin'
  import { mapState } from 'vuex'

  import cardHeader from './card-header.vue'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import { FETCH_BRAINMAP } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      gocharts
    },
    props: {
      reportData: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {
      ...mapState(['brainmap'])
    },
    data() {
      return {
        caseId: '',
        cjrId: '', //
        pagenav: { limit: 10000, currentpage: 1, showInRecord: '1' },
        chartDataList: []
      }
    },
    methods: {
      dataModel(val) {
        if (!val) val = this.reportData
        // 数据显示转换
        let _tempTab = val
        if (this.reportData) { // 判断是否显示报告数据
          _tempTab = this.reportData
        }
        this.chartDataList = _tempTab.map((r, ir) => {
          let _rdt = JSON.parse(r.dt)
          //              this.$refs['goBoxT' + ir].initMaker(_rdt)
          return _rdt
        })
      },
      openDetail() {
        if (!this.reportData) {
          if (this.checkUserRuleCase('ajgl/reconnaissancemap/list', this.caseId, true, this.cjrId)) {
            this.dispatch(FETCH_BRAINMAP, {
              ajid: this.caseId,
              PageIndex: this.pagenav.currentpage,
              PageSize: this.pagenav.limit,
              sfxs: this.pagenav.showInRecord
            }).then(() => {
              this.dataModel(this.brainmap.list.PageData)
            })
          }
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      this.openDetail()
    }
  }

</script>
