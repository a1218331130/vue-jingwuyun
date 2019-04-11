<template>
<div style="padding: 20px">
  <el-upload :show-file-list="true" :action="action" :with-credentials="false" :data="data" :file-list="fileList" :before-upload="handleBeforeUpload" :on-error="handleError" :on-remove="handleRemove" :on-progress="handleProgress" :on-success="handleSuccess">
    <el-button type="primary" icon="upload">上传文件</el-button>
  </el-upload>
</div>
</template>
<style scoped>
</style>
<script>
import { UPLOAD_PATH } from '../../config'
import userInfoMixin from '../../utils/userInfoMixin'
export default {
  mixins: [userInfoMixin],
  data() {
    return {
      action: UPLOAD_PATH,
      fileList: [{ name: '234234.png', url: 'http://127.0.0.1/1.jpg' }],
      data: {
        data: JSON.stringify({
          token: this.userData.UserToken
        })
      }
    }
  },
  methods: {
    handleBeforeUpload(file) {
      console.log('before', file);
      return true;
    },
    handleError(err, file, fileList) {
      console.log('error', err);
    },
    handleProgress(e, file, fileList) {
      console.log('progress', e);
    },
    handleSuccess(file) {
      console.log('sucess', file);
    }
  },
  created() {
    console.log(this.data);
  }
}
</script>
