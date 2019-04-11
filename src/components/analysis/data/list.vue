<template>
<!--列表-->
<div class="tel-list">
  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="list" @row-dblclick="rowClick" height="775px" style="width:100%;">
    <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'" sortable>
      <template scope="scope">
        {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
      </template>
</el-table-column>
<el-table-column v-for="(item,i) in tab" :key="i" :prop="item.prop" :label="item.label" align="center" sortable></el-table-column>
<el-table-column label="操作">
  <template scope="scope">
    <el-button type="primary" :loading="scope.row.deleteStatus" @click="deleteData(scope)">删除</el-button>
    <!-- <el-button type="primary" @click="edit()">编辑</el-button> -->
    <el-button type="primary" :loading="scope.row.resultStstus"  @click="viewComparisonReult(scope)">查看结果</el-button>
    <el-button type="primary" :loading="scope.row.comparisonStatus" @click="viewMyDataDetail(scope)">数据比对</el-button>
  </template>
</el-table-column>
</el-table>
</div>
</template>
<style lang="scss" scoped>
  .tel-list {
    min-height: 130px;
  }

  .view-map {
    text-decoration: underline;
    cursor: pointer;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { DELETE_MY_SJBD } from '../../../store/types'
  // import { clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        addressDialog: false,
        mapData: {
          pos: null
        },
        result: '',
        loading: false
      }
    },
    props: {
      canViewMap: {
        type: Boolean,
        default: true
      },
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
      ...mapState(['dataComparison'])
    },
    methods: {
      rowClick(row, e) {
        this.$emit('on:rowclick', { row: row, e: e })
      },
      // 删除我的数据对比
      deleteData(scope) {
        this.$confirm('此操作将永久删除,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          scope.row.deleteStatus = true
          this.dispatch(DELETE_MY_SJBD, { ID: scope.row.ID }).then(() => {
            this.$emit('listenToListIndex', scope.$index);
            scope.row.deleteStatus = false
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
      // 查看结果
      viewComparisonReult(scope) {
        if (scope.row.CanUse === '1') {
          sessionStorage.setItem('id', scope.row.ID)
          this.jumpTo(`/analysis/viewComparisonResult`, true)
        } else {
          this.$alert('数据正在清洗中,无法使用该功能', '温馨提示');
        }
      },
      // 数据比对
      viewMyDataDetail(scope) {
        if (scope.row.CanUse === '1') {
          sessionStorage.setItem('ID', scope.row.ID)
          this.jumpTo(`/analysis/dataComparsion`, true)
        } else {
          this.$alert('数据正在清洗中,无法使用该功能', '温馨提示');
        }
      }
    },
    created() {},
    mounted() {}
  }

</script>
