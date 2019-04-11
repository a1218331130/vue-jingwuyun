<template>
  <div class="el-color-dropdown__btns tree-select__btns">
    <span class="el-color-dropdown__value"></span>
    <a href="JavaScript:" class="el-color-dropdown__link-btn" @click="clearChecked">清空</a>
    <!--
    <button class="el-color-dropdown__btn" @click.stop.prevent="confirmValue">确定</button>
    -->
  </div>
</template>

<style scoped>
</style>

<script>
  import Emitter from 'element-ui/src/mixins/emitter'
  export default {
    name: 'TreeSelectBtns',
    componentName: 'TreeSelectBtns',
    mixins: [Emitter],
    methods: {
      confirmValue() {
        this.dispatch('TreeSelect', 'confirm');
      },
      clearChecked() {
        this.dispatch('TreeSelect', 'clear');
      }
    }
  }
</script>
