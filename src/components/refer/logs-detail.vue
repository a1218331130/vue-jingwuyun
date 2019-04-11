<template>
  <div>
    <page-header title="日志详情" :path="[{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '日志管理',
          to: '/system/logs'
        }, {
          text: '日志详情'
        }]"></page-header>


    <div class="app-detail" v-loading="loading">
      <el-form label-width="100px" label-position="right" v-if="logs.model">
        <el-form-item label="用户名">{{logs.model.account}}</el-form-item>
        <el-form-item label="操作">{{logs.model.action}}</el-form-item>
        <el-form-item label="IP">{{logs.model.ip}}</el-form-item>
        <el-form-item label="时间">{{logs.model.time}}</el-form-item>
        <el-form-item label="操作方法">{{logs.model.method}}</el-form-item>
        <el-form-item label="参数">{{logs.model.params}}</el-form-item>
        <el-form-item label="详情">{{logs.model.detail}}</el-form-item>
      </el-form>
    </div>

    <div class="app-toolbar" style="text-align: right;">
      <el-button @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<style scoped>

</style>

<script>
  import { mapState } from 'vuex'
  import { GET_LOGS } from '../../store/types'
  import PageHeader from '../common/page-header.vue'
  import mixin from '../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {PageHeader},
    computed: {
      ...mapState(['logs'])
    },
    created() {
      this.dispatch(GET_LOGS, {id: this.$route.params.id})
    }
  }
</script>
