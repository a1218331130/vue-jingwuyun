<template>
<!--通话详情分析-->
<div class="comm tel-list-box">
  <!-- 搜索条件 -->
  <div class="app-toolbar">
    <transition enter-active-class="animated">
      <div v-show="isArrow===true" class="form-box">
        <slot name="formBox"></slot>
      </div>
    </transition>
    <div class="arrow-tool cursor--pointer" @click="toggleArrow">
      <i :class="['el-icon-d-arrow-left', 'isArrow', isArrow? 'arrow-top': 'arrow-bottom']"></i>
      <!--<i :class="['icon', 'iconfont', isArrow? 'icon-packup-2': 'icon-unfold1']"></i>-->
    </div>
  </div>
  <!-- 查询结果 -->
  <div class="app-content" v-if="resBox===true">
    <list></list>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .app {
    &-toolbar {
      margin: 0;
      border-top: 0;
      padding-top: 0px;
      .arrow-tool {
        height: 15px;
        i {
          line-height: 15px;
        }
      }
      .form-box {
        padding: 12px 10px;
        position: relative;
      }
    }
    &-content-box {
      padding: 0;
    }
  }

</style>
<script>
  import telList from './index'
  import mixin from '../../utils/mixin'

  export default {
    mixins: [mixin],
    components: {
      telList
    },
    data() {
      return {
        isArrow: true,
        resBox: false,
        detailBox: false
      }
    },
    props: [],
    computed: {},
    methods: {
      toggleArrow() {
        this.isArrow = !this.isArrow;
        // this.$emit('onToggle', this.isArrow)
      },
      submit() {
        this.resBox = true
      },
      dateRange() {}
    },
    created() {},
    mounted() {}
  }

</script>
