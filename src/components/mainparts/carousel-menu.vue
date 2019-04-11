<template>
  <el-carousel class="el-carousel-menu" indicator-position="outside" :autoplay="false" arrow="never" trigger="click">
    <el-carousel-item v-for="item in Math.ceil(users.userMenu.length / 10)" :key="item">
      <ul class="main-menu-list clearfix">
        <li v-for="(uMenu,index) in users.userMenu.filter((m,i) => {return i < 11})"
            v-if="uMenu.RequestUrl !== '/system'"
            @click="openPage(uMenu)">
          <img class="menu-icon" :src="uMenu.MenuIcon === null ?'/static/img/default02.png':uMenu.MenuIcon"/>
          <span class="menu-text">{{uMenu.MenuName}}</span>
        </li>
        <li v-for="(uMenu,index) in users.userMenu.filter((m,i) => {return  10 < i && i < 21})"
            v-if="uMenu.RequestUrl !== '/system'"
            @click="openPage(uMenu)">
          <img class="menu-icon" :src="uMenu.MenuIcon === null ?'/static/img/default02.png':uMenu.MenuIcon"/>
          <span class="menu-text">{{uMenu.MenuName}}</span>
        </li>
        <li v-for="(uMenu,index) in users.userMenu.filter((m,i) => {return  20 < i && i < 31})"
            v-if="uMenu.RequestUrl !== '/system'"
            @click="openPage(uMenu)">
          <img class="menu-icon" :src="uMenu.MenuIcon === null ?'/static/img/default02.png':uMenu.MenuIcon"/>
          <span class="menu-text">{{uMenu.MenuName}}</span>
        </li>
      </ul>
    </el-carousel-item>
  </el-carousel>
</template>
<style scoped lang="scss">
  .el-carousel__item {
    text-align: center;
    .main-menu-list {
      width: 805px;
      list-style-type: none;
      margin: 20px auto;
      overflow: hidden;
      padding: 0;
      padding-bottom: 10px;
      li {
        float: left;
        width: 130px;
        margin: 15px;
        height: 80px;
        cursor: pointer;
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState(['users'])
    },
    methods: {
      openPage(data) {
        this.$emit('clickOpen', data)
      }
    }
  }
</script>
