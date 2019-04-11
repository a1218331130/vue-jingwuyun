<template>
<!-- v-if="count > size"  -->
<div :style="'text-align:'+(align||'center')+';'" :class="{pagenav:true, 'page-position':nopage || false}">
  <el-pagination :small="small||false" @size-change="sizeChange" @current-change="currentChange" :current-page="current" :page-sizes="[10,20,30,40,50,100,200]" :page-size="size" :layout="layout" :total="count">
  </el-pagination>
  <span class="pageNum" v-if="nopage || false">{{pagenav.currentpage}}/{{pageCount}}</span>
</div>
</template>

<style scoped>
.pageNum {
  padding: 10px 32px 0px 32px;
  font-weight: normal;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
}

.pagenav {
  min-width: 54px;
}
</style>

<script>
/**
 * @module Pagination
 * @desc 分页组件(方便统一分页配置), 基于elementUI el-pagination
 *
 * @example <pagination :count="99" :pagenav="{limit: 20,currentpage:1}" @update:pagenav="v=>pagenav=v"></pagination>
 */
export default {
  data: function () {
    return {
      size: 12,
      current: 1,
      pageCount: 0
    }
  },
  /**
   * 接收参数
   * @prop {Number} count 数据总条数(COUNT)
   * @prop {Object} pagenav 分页对象: {limit: {{每页显示多少条数据}},currentpage:{{当前页码}}}
   * @prop {Number} mode el-pagination layout, 请参考官方文档, 默认: '空'
   * @prop {String} align 分页按钮对齐方式, left/right/center, 默认: center
   * @prop {Boolean} small 是否使用精简模式, 默认:false
   * @prop {Boolean} nopage 是否显示页数, 默认:false
   */
  props: ['count', 'pagenav', 'mode', 'align', 'small', 'nopage'],
  computed: {
    layout() {
      return this.mode ? this.mode : 'total, prev, pager, next, jumper' // sizes
    }
  },
  watch: {
    pagenav: {
      handler: function (val, oldVal) {
        this.current = val.currentpage
      },
      deep: true
    },
    count(val) {
      let page = parseInt(val / 10)
      if(page !== val / 10 && this.nopage) {
        this.pageCount = page + 1
      } else {
        this.pageCount = page
      }
    }
  },
  methods: {
    sizeChange: function (size) {
      this.size = size
      this.current = 1
      this.updatePagenav()
    },
    currentChange: function (targetPage) {
      // if (this.pagenav.currentpage === targetPage) return false
      this.current = targetPage
      this.updatePagenav()
    },
    updatePagenav() {
      /**
       * 更新翻页
       * @event module:Pagination~update:pagenav
       * @param {Object} a 返回对象
       * @param {Object} a.limit 阀什
       * @param {Array} a.currentpage 目标页
       */
      this.$emit('update:pagenav', {
        limit: this.size,
        currentpage: this.current
      })
    }
  },
  mounted: function () {
    this.size = this.pagenav.limit
    this.current = this.pagenav.currentpage
  }
}
</script>
