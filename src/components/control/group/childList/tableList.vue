<template>
<!--列表-->
<div style="height: 100%;">
  <div class="app-toolbar" style="border-bottom: 1px solid #ccc; margin:5px 0;" v-if="title">
    <span @click="arrowTable" class="tableTitle" style="color: #46BDFD;font-size: 16px"><i class="icon iconfont " :class="[showTable ? 'icon-unfold' : 'icon-fold']"></i> {{title}} {{isEnd?'（共'+countLength+'条数据)':'(关联分析中)'}} </span>

    <div class="app-search__buttons " v-if="add&&!readonly">
      <el-button type="warning" class="yellow" size="small" icon="plus" @click="addFun()">新增</el-button>
    </div>
  </div>
  <div v-show="showTable">
    <div class="app-content-box">
      <el-table ref="tableform" class="app-table" border stripe :data="list" @row-dblclick="rowClick" :height="H||''">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column type="index" label="序号" align="center" v-if="tab.length > 0" :width="tab.length > 0?'50':'auto'">
          <template scope="scope">
            {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
          </template>
        </el-table-column>

        <el-table-column v-for="(itemT,indexT) in tab" :key="indexT" :prop="itemT.prop" :label="itemT.label" align="center"></el-table-column>

        <el-table-column label="操作" width="150" v-if="tab.length > 0 && (edit||remove)">
          <template scope="scope">
            <el-button type="primary" v-if="scope.row.id !==null&&!readonly" v-show="edit" size="mini" @click="editFun(scope.row)" icon="icon iconfont icon-brush">编辑
            </el-button>
            <el-button type="danger" v-if="scope.row.id !==null&&!readonly" v-show="remove" size="mini" @click="removeFun(scope.row,scope.$index)" icon="icon iconfont icon-trash">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="app-toolbar">
      <pagination :count="pagenav.count" :pagenav="{limit: pagenav.limit,currentpage:pagenav.currentpage}" @update:pagenav="pagenavChange"></pagination>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
.tableTitle {
    cursor: pointer;
}
.finds {
    transition: all 0.5s;
}
.yellow {
    background: #FF9900;
    color: #fff;
    border: 1px solid #FF9900;
}
</style>
<script>
import pagination from '../../../../widgets/pagination/pagination.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      showTable: false,
      tR: false
    }
  },
  props: {
    title: { // 表格标题
      type: String,
      default: null
    },
    readonly: { // 表格标题
      type: Boolean,
      default: false
    },
    pagenav: { // 分页
      type: Object,
      default: () => {
        return {
          count: 10,
          limit: 10,
          currentpage: 1
        }
      }
    },
    list: { // 表格数据
      type: Array,
      default: () => {
        return []
      }
    },
    tab: { // 表格抬头
      type: Array,
      default: () => {
        return []
      }
    },
    H: { // 固定表格高度
      type: String,
      default: ''
    },
    add: { // 添加权限  默认开启
      type: Boolean,
      default: true
    },
    edit: { // 编辑权限  默认开启
      type: Boolean,
      default: true
    },
    remove: { // 删除权限  默认开启
      type: Boolean,
      default: true
    },
    isEnd: { // 请求是否结束
      type: Boolean,
      default: true
    },
    countLength: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  methods: {
    /**
     * 行点击操作
     */
    rowClick(row, e) {
      this.$emit('on:rowclick', { row: row, e: e })
    },
    /**
     * 表格收缩
     */
    arrowTable() {
      this.showTable = !this.showTable
    },
    /**
     * 添加
     */
    addFun() {
      this.$refs['tableform'].resetFields
      this.$emit('on:add', true)
    },
    /**
     * 编辑
     * @param row
     */
    editFun(row) {
      this.$emit('on:edit', row)
    },
    /**
     * 清空
     * @param row
     */
    reset(item) {
      for(let key in item) {
        if(item[key] instanceof Array) {
          item[key] = []
        } else {
          item[key] = ''
        }
      }
    },
    /**
     * 删除
     * @param row
     * @param index 当前删除所有在表格索引
     */
    removeFun(row, index) {
      this.$emit('on:remove', { row: row, index: index })
    },
    /**
     * 分页操作
     * @param pg
     */
    pagenavChange(pg) {
      this.$emit('on:pagenav', pg)
    }
  },
  created() {},
  mounted() {}
}
</script>
