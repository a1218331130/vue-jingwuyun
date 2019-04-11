<template>
<!--列表-->
<div class="tel-list" v-if="list.length !==0">
  <el-table class="app-table" border stripe :data="list" @row-dblclick="rowClick" :height="tableHeight">
    <!--<el-table-column type="selection" width="55"></el-table-column>-->
    <!-- <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'">
      <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column> -->
<el-table-column v-for="(itemT,indexT) in tab" :key="indexT" :prop="itemT.prop" :width="getColumnWidth(itemT)" :label="itemT.label" align="center"></el-table-column>
</el-table>
</div>
</template>
<style lang="scss" scoped>
  .tel-list {}

</style>
<script>
  import getColumnWidth from './getColumnWidth'
  export default {
    components: {},
    data() {
      return {}
    },
    props: {
      pagenav: {
        type: Object,
        default: () => {
          return {
            count: 10,
            limit: 10,
            currentpage: 1
          }
        }
      },
      list: {
        type: Array,
        default: () => {
          return []
        }
      },
      tab: {
        type: Array,
        default: () => {
          return []
        }
      },
      H: {
        type: String,
        default: ''
      }
    },
    computed: {
      tableHeight() {
        let offset = this.H || 390;
        let height = document.documentElement.clientHeight - parseFloat(offset)
        return (height < 100 ? 100 : height).toString()
      }
    },
    methods: {
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      getColumnWidth
    },
    created() {},
    mounted() {}
  }

</script>
