<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="imageList.FILENAME" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <el-row>
    <el-col :span="24">
      <div style="height:460px;text-align: center;border: 1px solid #cac6c6;margin: 0 5px;padding: 0 3px; position: relative">

        <img v-if="imageList.TYPE ==='PIC'" :src="imageList.img" :alt="imageList.FILENAME" style="
                          max-width: 100%;
                          max-height: 100%;
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translateX(-50%) translateY(-50%);">
        <video v-if="imageList.TYPE === 'VIDEO'" height="396" width="704" :src="imageList.img" controls="controls" :alt="imageList.FILENAME" style="
                          max-width: 100%;
                          max-height: 100%;
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translateX(-50%) translateY(-50%);" />
      </div>
    </el-col>
    <el-col :span="24">
      <div class="info_div">
        <p><label>上传时间:</label><b>{{imageList.SCSJ}}</b></p>
        <p><label>类型:</label>{{imageList.TYPE}}</p>
      </div>
    </el-col>
  </el-row>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">关闭</el-button>
    <a :href="imageList.img" :download="imageList.FILENAME" :title="imageList.FILENAME">
      <el-button type="primary">下载</el-button>
    </a>
  </div>
</el-dialog>
</template>
<style scoped lang="scss">
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
import mixin from '../../../../utils/mixin'
export default {
  mixins: [mixin],
  props: ['dialog', 'data'],
  data() {
    return {
      isInit: false,
      activeIndex: null,
      activeItem: {},
      imageList: []
    }
  },
  computed: {},
  methods: {
    initDialog() {
      this.imageList = []
      this.imageList = this.data
      //      let _rd = this.data
      //      if (_rd) {
      //        this.imageList = _rd.item.map(r => {
      //          return {
      //            title: r.FILENAME + '预览',
      //            name: r.fileName + '.' + r.fileType,
      //            url: r.imgsrc,
      //            source: r.fileSource,
      //            describe: r.fileDescribe
      //          }
      //        })
      //        // 切换获取当前索引
      //        this.activeIndex = _rd.currentIndex instanceof String ? parseInt(_rd.currentIndex) : _rd.currentIndex
      //
      //        this.isInit = true
      //      }
    },
    closeEvent() {
      this.imageList = []
      this.$emit('close')
    }
  },
  created() {},
  mounted() {}
}
</script>
