<!-- 页面打印组件 -->
<!--
  使用说明：引入组件，动态设置相应属性
  btnType：按钮类型--参考element-UI  el-button 组件类型设置
  btnClass: 设置按钮样式CSS  对应的class
  ***【noprint】需要隐藏的不打印的DOM元素class 加上noprint
-->
<template>
<transition>
  <el-button @click="print" :type="btnType" :class="btnClass">打印</el-button>
</transition>
</template>

<style scoped>

</style>
<style>
@media print {
  .noprint {
    display: none;
  }

  @page {
    size: auto;
    margin: auto;
    /**是否显示标题 和链接 ，不显示改为0**/
  }
}
</style>

<script>
export default {
  props: {
    btnType: {
      type: String,
      default: 'default'
    },
    btnClass: {
      type: String,
      default: ''
    },
    printRange: {
      type: String,
      default: ''
    }
  },
  methods: {
    print() {
      // let ele = document.getElementById(this.printRange)
      this.$(this.printRange).jqprint()
      //
      // if(ele) {
      // } else {
      //   this.$alert('未选中打印区域', '温馨提示', {
      //     confirmButtonText: '确认'
      //   });
      // }
      // document.getElementById('#' + this.printRange).jqprint()
      // window.print()
    }
  }
}
</script>
