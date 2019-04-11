<template>
  <div :class="[{'el-layout':true, 'el-layout--fit':fit}].concat(fixedClass)">
    <slot name="north"></slot>
    <div class="el-layout__middle" ref="middle" :style="middleStyle">
      <slot name="west"></slot>
      <slot name="center"></slot>
      <slot name="east"></slot>
    </div>
    <slot name="south"></slot>
  </div>
</template>

<script>
  export default {
    name: 'ElLayout',
    componentName: 'ElLayout',
    props: {
      // 是否自动适应填充父容器的尺寸
      fit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        regions: {}
      }
    },
    computed: {
      fixedClass() {
        let cls = [], region;
        for (let key in this.regions) {
          if (this.regions.hasOwnProperty(key)) {
            region = this.regions[key];
            if (region.fixed) {
              cls.push(`${key}-fixed`);
            }
          }
        }
        return cls;
      },
      middleStyle() {
        let style = {};
        this.fixedClass.forEach(item => {
          switch (item) {
            case 'north-fixed':
              style.paddingTop = this.regions.north.$el.offsetHeight + 'px';
              break;
            case 'south-fixed':
              style.paddingBottom = this.regions.south.$el.offsetHeight + 'px';
              break;
            case 'west-fixed':
              style.paddingLeft = this.regions.west.$el.offsetWidth + 'px';
              break;
            case 'east-fixed':
              style.paddingRight = this.regions.east.$el.offsetWidth + 'px';
              break;
          }
        });
        return style;
      }
    }
  }
</script>
