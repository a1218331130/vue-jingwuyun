<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="activeItem.title" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <el-row>
    <el-col :span="24">
      <div style="height:460px;text-align: center;border: 1px solid #cac6c6;margin: 0 5px;padding: 0 3px">
        <el-carousel ref="imageCarouselRef" height="460px" :autoplay="false" indicator-position="none" @change="imageChange">
          <el-carousel-item v-for="(iItem, iItemIndex) in imageList" :key="iItemIndex">
            <img :src="iItem.url" :alt="iItem.name" style="
                          max-width: 100%;
                          max-height: 100%;
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translateX(-50%) translateY(-50%);">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="info_div">
        <p><label>文件名称:</label><b>{{activeItem.name}}</b></p>
        <p><label>来源:</label>{{activeItem.source}}{{'全国人口表'}}</p>
        <!-- <p><label>涉案描述:</label>{{activeItem.describe}}</p> -->
      </div>
    </el-col>
  </el-row>

  <dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" :modalAppendToBody="false" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">关闭</el-button>
    <el-button type="success" @click="showPeoplrInfo(activeItem.name)">查看图片档案</el-button>
    <a :href="activeItem.url" :download="activeItem.name" :title="activeItem.name">
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
import { FETCH_ANALYSIS_IMAGE_DETAILS } from '../../../store/types'
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import dialogInfo from '../../../widgets/info-dialog/info-dialog'
import infoDialogEvents from '../../../utils/infoDialogEvents'
export default {
  mixins: [mixin, infoDialogEvents],
  props: ['dialog', 'data'],
  components: {
    'dialog-people-info': dialogInfo
  },
  data() {
    return {
      peopleInfoDialog: false,
      infoDialogData: {},
      tableName: '',
      isInit: false,
      activeIndex: null,
      activeItem: {},
      imageList: []
    }
  },
  computed: {
    ...mapState(['analysisImage'])
  },
  methods: {
    initDialog() {
      let _rd = this.data
      if (_rd) {
        // console.log(_rd.item.metadata.table);
        // this.tableName = _rd.item.metadata.table
        // this.dispatch(FETCH_ANALYSIS_IMAGE_DETAILS, { limit: '5' }).then(() => {
        //   console.log(this.analysisImage.detail);
        // })
        this.imageList = _rd.item.map(r => {
          return {
            title: r.metadata.objid + '预览',
            name: r.metadata.objid,
            url: r.filepath,
            source: r.fileSource,
            describe: r.fileDescribe,
            table: r.metadata.table
          }
        })
        // 切换获取当前索引
        this.activeIndex = _rd.currentIndex instanceof String ? parseInt(_rd.currentIndex) : _rd.currentIndex
        this.isInit = true
      }
    },
    closeEvent() {
      this.$emit('close')
    },
    showPeoplrInfo(data) {
      this.infoDialogData = { contentType: 1, keyId: data }
      this.peopleInfoDialog = true
    },
    imageChange(ai, i) { // 切换获取指定索引
      if (!this.isInit) {
        this.activeIndex = ai instanceof String ? parseInt(ai) : ai
      }
    }
  },
  getContent(data) {
    this.dispatch(FETCH_ANALYSIS_IMAGE_DETAILS, { limit: '5' }).then(() => {
      console.log(this.analysisImage.detail);
    })
  },
  updated() {
    if (this.isInit) {
      this.$nextTick(() => {
        this.$refs.imageCarouselRef.setActiveItem(this.activeIndex)
        this.isInit = false
      })
    }
  },
  watch: {
    activeIndex(val) {
      this.activeItem = this.imageList[val] // 显示指定图片信息
    }
  },
  created() {},
  mounted() {}
}
</script>
