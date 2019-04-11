<template>
<el-row class="app-page-header">
  <el-col :span="24">
    <h1 v-if="title">{{title}}</h1>
    <el-breadcrumb separator="/" class="app-breadcrumb" v-if="path">
      <el-breadcrumb-item v-for="(item,index) in path" :to="item.to" :key="item.text">
        <i v-if="index==0" class="iconfont icon-home"></i> {{item.text}}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>
</el-row>
</template>

<script>
export default {
  props: {
    title: String,
    path: Array
  },
  mounted() {}
}
</script>
