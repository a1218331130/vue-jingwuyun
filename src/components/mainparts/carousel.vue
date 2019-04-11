<template>
  <el-carousel indicator-position="none" :autoplay="false" arrow="always" trigger="click">
    <el-carousel-item v-for="item in 4" :key="item">
      <img src="../../assets/main-table.png"/>
    </el-carousel-item>
  </el-carousel>
</template>
<style scoped lang="scss">
  .el-carousel__item {
    text-align: center;
    img {
      max-width: 100%;
      height: 100%;
    }
  }
</style>
<script>
  export default {}
</script>
