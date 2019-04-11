<template>
<div v-if="siteInfo" class="login-footer">
  <p>Copyright&copy;{{year}} 湖南警察学院 版权所有 {{siteInfo.VersionName}}:{{siteInfo.Version}}</p>
  <!-- {{siteInfo.Copyright}} -->
  <!-- <p>技术支持：珠海市新德汇信息技术有限公司</p> -->
</div>
</template>
<script>
  import { getSiteInfo } from '../../utils/storage'
  export default {
    data() {
      return {
        siteInfo: null
      }
    },
    computed: {
      year() {
        let now = new Date()
        return now.getFullYear()
      }
    },
    mounted() {
      this.siteInfo = getSiteInfo()
    }
  }

</script>
