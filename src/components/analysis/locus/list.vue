<template>
<!--列表-->
<div class="tel-list">
  <el-table ref="table" class="app-table" border stripe :data="list" @row-dblclick="rowClick" :height="H||''">
    <!--<el-table-column type="selection" width="55"></el-table-column>-->
    <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'">
      <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
</el-table-column>
<el-table-column v-for="(itemT,indexT) in tab" :key="indexT" :prop="itemT.prop" :label="itemT.label" :width="itemT.prop === 'gjms'?columnWidth(itemT):286" align="center"></el-table-column>
</el-table>
</div>
</template>
<style lang="scss" scoped>


</style>
<script>
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
            count: 0,
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
    computed: {},
    methods: {
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      columnWidth(item) {
        let res = ''
        switch (item.prop) {
          case 'gjms':
            res = 450
            break
        }
        return res
      },
      filterTag(value, row) {
        return row.tag === value
      }
    },
    created() {},
    mounted() {}
  }

</script>
