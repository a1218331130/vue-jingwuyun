<template>
  <div class="nav-bar">
    <div @click="current(1)" :class="'nav-item'+(active === '1' ? '--current' : '')">
      <i class="iconfont icon-card-list"></i>
      <p>分类</p>
    </div>
    <div @click="current(2)" :class="'nav-item'+(active === '2' ? '--current' : '')">
      <i class="iconfont icon-city"></i>
      <p>部/省/市{{active}}</p>
    </div>
    <div @click="current(3)" :class="'nav-item'+(active === '3' ? '--current' : '')">
      <i class="iconfont icon-sort"></i>
      <p>字母</p>
    </div>
    <div @click="current(4)" :class="'nav-item'+(active === '4' ? '--current' : '')">
      <i class="iconfont icon-collection"></i>
      <p>常用</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .nav-bar {
    height: 100%;
    color: #ffffff;
    text-align: center;
    width: 70px;
    background-color: #0d5399;
    .nav-item {
      cursor: pointer;
      height: 40px;
      width: 60px;
      padding: 20px 5px;
      text-align: center;
      border-bottom: 1px solid #02396f;
      i {
        font-size: 24px;
        margin-top: 0px;
      }
      p {
        height: 14px;
        margin-top: 10px;
        line-height: 14px;
        font-size: 14px;
      }
    }
    .nav-item--current {
      background-color: #e6a00c;
      cursor: pointer;
      height: 40px;
      width: 60px;
      padding: 20px 5px;
      text-align: center;
      border-bottom: 1px solid #02396f;
      i {
        font-size: 24px;
        margin-top: 0px;
      }
      p {
        height: 14px;
        margin-top: 10px;
        line-height: 14px;
        font-size: 14px;
      }
    }
  }
</style>
<script>
  export default {
    data() {
      return {
        active: '1'
      }
    },
    methods: {
      current: function (current) {
        this.active = current;
        console.log('this.active', this.active);
      }
    }
  }
</script>
