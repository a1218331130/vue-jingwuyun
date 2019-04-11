<template>
<div class="app-toolbar">
  <iframe class="con-box" :src="fullUrl"></iframe>
</div>
</template>
<style scoped>
.con-box {
  width: 100%;
  min-height: 600px;
  border: none;
}
</style>
<script>
import { ADMIN_PATH } from '../../config'
import userInfoMixin from '../../utils/userInfoMixin'
export default {
  mixins: [userInfoMixin],
  data() {
    return {
      fullUrl: ADMIN_PATH + this.url + '?token=' + this.userData.UserToken
    }
  },
  props: {
    url: String
  }
}
</script>
