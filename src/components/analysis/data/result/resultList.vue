<template>
<!--比对结果列表-->
<div class="comparison-result-list" v-loading="this.resultData.loading" element-loading-text="拼命分析计算中……">
  <div class="switch">
    <el-switch v-if="resultData.contentList.length>0" v-model="value" :width="100" off-text="隐藏空字段" on-text="显示空字段" @change="isShowText"></el-switch>
  </div>
  <div v-if="resultData.contentList.length>0 || resultData.titleList.length>0">
    <el-table @cell-mouse-enter="cellMouseEnter" border stripe :data="resultData.contentList" @row-dblclick="rowClick" height="900px">
      <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
      <el-table-column v-for="(item,i) in resultData.titleList" :key="i" :prop="item.prop" :label="item.label" align="center"></el-table-column>
    </el-table>
    <div class="totalCount">总共 {{resultData.totalCount}} 条</div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .comparison-result-list {
    height: 100%;
  }

  .totalCount {
    text-align: right;
    background: #fff;
    padding-right: 10px;
  }

  .switch {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import mixin from '../../../../utils/mixin'
  import { FETCH_VIEW_SSBD_WDBD_DATA } from '../../../../store/types'
  export default {
    mixins: [mixin],
    computed: {
      ...mapState(['dataComparison'])
    },
    data() {
      return {
        value: true,
        resultData: {
          loading: false,
          titleList: '',
          contentList: [],
          totalCount: ''
        },
        comparisonData: ''
      }
    },
    methods: {
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      init() {
        this.resultData.loading = true;
        this.comparisonData = JSON.parse(sessionStorage.getItem('comparsionResult'))
        this.dispatch(FETCH_VIEW_SSBD_WDBD_DATA, this.comparisonData).then(() => {
          this.resultData.loading = false;
          if (this.comparisonData.SourceType === 2 || this.comparisonData.SourceType === 3) {
            this.resultData.titleList = this.dataComparison.ViewSsbdWdbdData.TableInfo.Columns.map(d => {
              return {
                label: d.NameCn,
                prop: d.ByName
              }
            })
          } else if (this.comparisonData.SourceType === 4) {
            this.resultData.titleList = this.dataComparison.ViewSsbdWdbdData.TableInfo.Columns.map(d => {
              return {
                label: d.NameCn,
                prop: d.Name
              }
            })
          }
          this.resultData.contentList = this.dataComparison.ViewSsbdWdbdData.Source;
          this.resultData.totalCount = this.dataComparison.ViewSsbdWdbdData.TotalCount;
          this.isShowText(true)
        })
      },
      isShowText(e) {
        if (e) {
          let keyArr = Object.keys(this.resultData.contentList[0])
          keyArr.forEach(m => {
            if (this.resultData.contentList[0][m] === null || this.resultData.contentList[0][m] === '' || this.resultData.contentList[0][m] === undefined) {
              this.resultData.titleList.forEach((d, i) => {
                if (d.prop === m) {
                  this.resultData.titleList.splice(i, 1)
                }
              })
            }
          })
        } else {
          if (this.comparisonData.SourceType === 2 || this.comparisonData.SourceType === 3) {
            this.resultData.titleList = this.dataComparison.ViewSsbdWdbdData.TableInfo.Columns.map(d => {
              return {
                label: d.NameCn,
                prop: d.ByName
              }
            })
          } else if (this.comparisonData.SourceType === 4) {
            this.resultData.titleList = this.dataComparison.ViewSsbdWdbdData.TableInfo.Columns.map(d => {
              return {
                label: d.NameCn,
                prop: d.Name
              }
            })
          }
        }
      }
    },
    created() {},
    mounted() {
      this.init()
    }
  }

</script>
