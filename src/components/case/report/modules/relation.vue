<!-- 团伙关系 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="团伙关系"></card-header>
    <!-- 内容 -->
    <el-row class="certificate-box">
      <P v-if="chartDataList.nodeDataArray && chartDataList.nodeDataArray.length <= 0"
         style="color: #5e7382;text-align: center">暂无数据</P>
      <gocharts v-if="chartDataList.nodeDataArray && chartDataList.nodeDataArray.length > 0" :ref="'goBoxTRelation'+index"
                :boxId="'goBoxRelation_'+ index"
                :key="index" v-for="(item,index) in chartDataList" class="maker-box" :data="item"
                :options="{readOnly:true,allowZoom:false,layout:'TreeLayout'}"></gocharts>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  .certificate-box {
    margin-top: 13px;
    .maker-box {
      width: 100%;
      height: 500px;
      margin: 5px auto;
    }
  }
</style>

<script>
  import mixin from '../../../../utils/mixin'
  import {mapState} from 'vuex'
  import cardHeader from './card-header.vue'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import {FETCH_SUSPECT_CASE_PEOPLE_LIST} from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      gocharts
    },
    computed: {
      ...mapState(['suspectCasePeople'])
    },
    data() {
      return {
        caseId: '',
        pagenav: {limit: 10000, currentpage: 1},
        chartDataList: []
      }
    },
    methods: {
      queryList() {
        if (this.checkRuleCase('ajgl/suspect/list', this.caseId)) {
          this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
            ajid: this.caseId,
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            let _charD = {
              nodeDataArray: [],
              linkDataArray: []
            }
            this.suspectCasePeople.PageData.map(r => {
              _charD.nodeDataArray.push({
                key: r.id,
                category: 'main',
                name: r.xm,
                text: r.xm
              })
              _charD.linkDataArray.push({
                from: r.xyrsj ? r.xyrsj : '0',
                to: r.id,
                curviness: '0'
              })
            })
            this.chartDataList = [_charD]
          })
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryList()
    }
  }
</script>
