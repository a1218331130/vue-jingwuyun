<template>
<el-layout class="app-layout" :fit="true">
  <el-region v-show="hideTopbar===false" class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <el-region class="app-center" slot="center" type="center">
    <iframe :class="{'external-box':true, 'full':hideTopbar===true}" :src="externalSrc"></iframe>
  </el-region>
</el-layout>
</template>
<style lang="scss" scoped>
.external-box {
    width: calc(100% - 5px);
    height: calc(100vh - 78px);
    border: 0;
    overflow: hidden;
    &.full {
        height: calc(100vh - 5px);
    }
}
</style>
<script>
import TopBar from './common/topbar/index.vue'
import mixin from '../utils/mixin'
import { get } from '../utils/storage'
export default {
  mixins: [mixin],
  components: {
    TopBar
  },
  data() {
    return {
      isWestCollapsed: false,
      hideX: false,
      active: '',
      externalSrc: ''
    }
  },
  computed: {
    hideTopbar() {
      return this.$route.query['big'] === 'true' || this.$route.params['big'] === true
    }
  },
  methods: {},
  created() {
    this.externalSrc = get(this.permission).src
  }
}
</script>
