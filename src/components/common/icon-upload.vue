
<template>
<el-upload class="icon-uploader" :show-file-list="true" :action="action" :data="data" :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile" :on-error="handleError" :on-preview="handlePreview" :on-success="handleSuccess" :file-list="fileList">
  <img :src="imageUrl" v-if="imageUrl" class="icon" />
  <i v-else class="el-icon-plus uploader-icon"></i>
</el-upload>
</template>
<style scoped>
.icon-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.icon-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.icon {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
<script>
/**
 * 图标上传 成功后回调函数 uploadSuccessCallback（data）;
 **/

import { UPLOAD_PATH } from '../../config'
import userInfoMixin from '../../utils/userInfoMixin'
export default {
  mixins: [userInfoMixin],
  data() {
    return {
      data: {
        data: ''
      },
      action: UPLOAD_PATH
    };
  },
  props: {
    imageUrl: String,
    fileList: Array
  },
  methods: {
    handleSuccess(res, file) {
      //        this.imageUrl = URL.createObjectURL(file.raw)
      // todo:返回临时上传图片对象 res
      this.$emit('uploadSuccessCallback', res, file);
    },
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if(!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    handleError(err, file, fileList) {
      console.log('error', err);
    },
    handleRemoveFile(file) {
      console.log('Remove', file)
      this.imageUrl = null;
    },
    handlePreview(file) {
      console.log('handlePreview', file)
    }
  },
  created() {
    this.data.data = JSON.stringify({
      token: this.userData.UserToken
    })
  }
}
</script>
