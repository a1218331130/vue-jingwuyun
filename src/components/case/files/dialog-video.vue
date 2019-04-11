<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="videoName" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <el-row>
    <el-col :span="24">
      <div style="height:460px;text-align: center;border: 1px solid #cac6c6;">
        <video ref="caseVideo" :src="videoUrl" id="videoID" class="video" name="media" poster="/static/img/fileTypeIcon/avi_loading.png" autoplay controls>
          </video>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="info_div">
        <p><label>文件名称:</label><b>{{vData.fileName}}</b></p>
        <p><label>来源:</label>{{vData.fileSource}}</p>
        <p><label>涉案描述:</label>{{vData.fileDescribe}}</p>
      </div>
    </el-col>
  </el-row>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">关闭</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.video {
    background: #333;
    width: 100%;
    height: 100%;
}
.info_div {
    margin-top: 10px;
    p {
        line-height: 26px;
        padding: 0;
        margin: 0 18px;
        font-size: 14px;
        label {
            margin-right: 8px;
            width: 80px;
            float: left;
            text-align: right;
            letter-spacing: 2px;
            display: block;
        }
    }
}
</style>

<script>
import mixin from '../../../utils/mixin'
export default {
  mixins: [mixin],
  props: ['dialog', 'data'],
  data() {
    return {
      vData: {},
      dialogDraggableOptions: '',
      videoName: '视频预览',
      videoUrl: ''
    }
  },
  methods: {
    initDialog() {
      this.vData = this.data
      this.videoName = this.data.fileName + '.' + this.data.fileType
      this.videoUrl = this.data.fileUrl
    },
    closeEvent() {
      this.$refs.caseVideo.pause()
      this.$emit('close')
    }
  }
}
</script>
