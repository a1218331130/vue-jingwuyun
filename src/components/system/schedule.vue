<template>
  <div>
    <tabs :tab="tab"></tabs>
    <div class="app-toolbar">
      <app-iframe url="/qingbaoyun-navigation/sys/schedule.html"></app-iframe>
    </div>
  </div>
</template>
<style scoped>


</style>
<script>
  import Tabs from '../common/tabs.vue'
  import AppIframe from '../common/app-iframe.vue'
  export default {
    components: {
      Tabs,
      AppIframe
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.tab = {
        label: '定时任务',
        name: this.$route.path
      }
    }
  }

</script>
