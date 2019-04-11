<!-- 导出word组件 -->
<template>
  <transition>
    <el-button @click="handleExport" :type="btnType" :class="btnClass">导出word</el-button>
  </transition>
</template>

<style scoped>


</style>

<script>
  const noop = () => {};
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    props: {
      btnType: {
        type: String,
        default: 'default'
      },
      btnClass: {
        type: String,
        default: ''
      },
      postData: {
        type: Object,
        default: null
      },
      exportType: {
        type: String,
        default: ''
      },
      beforeExport: {
        type: Function,
        default: noop
      },
      afterExport: {
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
      handleExport() {
        if (this.beforeExport === noop) {
          this.exportFile();
        } else {
          this.beforeExport(this.exportFile);
        }
      },
      exportFile() {
        if (this.data) {
          if (this.exportType) {
            this.dispatch(this.exportType, this.postData).then(() => {
              if (this.afterExport !== noop) {
                this.afterExport()
              }
            });
          }
        }
      }
    }
  }

</script>
