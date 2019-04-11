<template>
<div class="video-wrap">
  <video class="bg-video" src="/static/video/bg.mp4" loop autoplay poster=""></video>
<keep-alive>
  <router-view></router-view>
  </keep-alive>
</div>
</template>
<style lang="scss" scoped>
  .video-wrap {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    z-index: 1;
    .bg-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 1;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
  }

</style>
<script>
  export default {
    data: () => ({

    })
  }

</script>
