<!-- 页面打印组件 -->
<!--
  使用说明：引入组件，动态设置相应属性
  btnType：按钮类型--参考element-UI  el-button 组件类型设置
  btnClass: 设置按钮样式CSS  对应的class
  ***【noprint】需要隐藏的不打印的DOM元素class 加上noprint
-->
<template>
  <transition>
    <el-button @click="handlePrint" :type="btnType" :class="btnClass">打印</el-button>
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
  const noop = () => {};
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
      },
      containerStyle: {
        type: Object,
        defualt: () => { return {} }
      },
      beforePrint: {
        type: Function,
        default: noop
      },
      afterPrint: {
        type: Function,
        default: noop
      }
    },
    data() {
      return {
        handle: null
      }
    },
    methods: {
      handlePrint() {
        if (this.beforePrint === noop) {
          this.print();
        } else {
          this.beforePrint(this.print);
        }
      },
      closeAfterPrint() {
        this.handle = document.execCommand('print')
        if (this.handle) {
          this.$('#' + this.printRange + '_1').remove()
          if (this.afterPrint !== noop) {
            this.afterPrint();
          }
        } else {
          setTimeout(() => {
            this.closeAfterPrint();
          }, 300);
        }
      },
      print() {
        if (this.printRange) {
          let _tDom = this.$('#' + this.printRange).clone().attr('id', this.printRange + '_1');
          if (_tDom) {
            let style = { 'width': '100%', 'position': 'absolute', 'z-index': 99999, 'background-color': '#fff' };
            if (this.containerStyle) {
              style = Object.assign(style, this.containerStyle);
            }
            _tDom.css(style);
            this.$('body').prepend(_tDom);
          }
          this.closeAfterPrint();
        } else {
          window.print()
        }
      }
    }
  }

</script>
