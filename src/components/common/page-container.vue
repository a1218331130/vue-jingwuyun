<template>
<div :class="{'page-container':true, 'adaptive-background':resizeBg}">
  <slot></slot>
  <!--<div class="page-container&#45;&#45;cloud"></div>-->
</div>
</template>
<style scoped>
.page-container {
  /*min-height: 850px;*/
  background-size: 1920px 1080px;
}

.adaptive-background {
  background-size: cover;
}
</style>
<script>
export default {
  data() {
    return {
      resizeBg: true
    }
  },
  created() {
    if (document.body.offsetWidth > 1920 || document.body.offsetHeight > 1080) {
      this.resizeBg = true;
    } else {
      this.resizeBg = false;
    }
    window.addEventListener('resize', (e) => {
      if (document.body.offsetWidth > 1920 || document.body.offsetHeight > 1080) {
        this.resizeBg = true;
      } else {
        this.resizeBg = false;
      }
    })
  }
}
</script>
