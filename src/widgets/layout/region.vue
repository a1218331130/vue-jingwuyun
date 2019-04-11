<template>
  <div :class="['el-region',`el-region-${type}`, {'no-zoom':!zoom}]">
    <slot></slot>
  </div>
</template>


<script>
  export default {
    name: 'ElRegion',
    componentName: 'ElRegion',
    props: {

      // 区域类型，可选：north / south / west / east / center
      type: {
        type: String,
        required: true,
        default: 'center'
      },
      // 是否自动调整尺寸适应内容
      zoom: {
        type: Boolean,
        default: true
      },
      // 是否fixed 定位
      fixed: Boolean
    },
    data() {
      return {
        positionFixed: !!this.fixed
      }
    },
    created() {
      this.$set(this.$parent.regions, this.type, this);
    }
  }
</script>
