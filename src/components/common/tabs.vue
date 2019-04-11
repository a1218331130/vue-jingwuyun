<template>

  <el-tabs type="card" :active-name="tabs.selected" @tab-click="handleTabClick" @tab-remove="handleTabRemove">
    <el-tab-pane v-for="item in tabs.list" :key="item.name" :label="item.label" :closable="item.closable" :name="item.name"></el-tab-pane>
  </el-tabs>

</template>

<style scoped>


</style>

<script>
  import {
    mapState
  } from 'vuex'
  import bus from '../../utils/bus'
  export default {
    data: function() {
      return {
        value: null,
        label: ''
      }
    },
    props: {
      tab: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState(['tabs'])
    },
    methods: {
      handleTabClick(tab) {
        // 由于el-tabs组件有自己的逻辑要处理，setTimeout避免阻塞导致el-tabs执行报错问题
        setTimeout(() => {
          this.$router.push(tab.name)
        }, 0)
      },
      handleTabRemove(name) {
        let self = this
        this.$store.commit('remove', {
          name: name,
          emptyCallBack: () => {
            // 当没有选择卡时, 跳回本中心根级路由
            this.$router.push(self.$route.matched[0].path)
          }
        })
        setTimeout(() => {
          this.$router.push(this.tabs.selected)
          bus.$emit('tabs.remove', name, this.tabs.selected)
        }, 0)
      }
    },
    activated() {
      this.$store.commit('pushTab', {
        tab: this.tab
      })
    },
    created() {
      this.$store.commit('pushTab', {
        tab: this.tab
      })
    }
  }

</script>
