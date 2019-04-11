<!-- 图片视频 -->
<template>
<div class="pic-video">
  <!-- 标题 -->
  <card-header :title="'图片视频('+(pvData.length)+'条结果)'" logtitle="添加图片视频" @call:change-update="changeUpdate" tool='addbtn' :caseKey="caseKey" :type=9 :tableData="pvData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <div class="content-box" v-show="expandMark">
    <el-row :gutter="0" class="kinship-box" v-if="picList&&picList.length > 0">
      <el-col :span="3">
        <div class="bg1">
          图片
        </div>
      </el-col>
      <el-col :span="21">
        <div class="bg2"></div>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <el-col :span="4" v-for="(item,i) in picList" :key='i'>
        <div class="p-v-box" @click="open(item)">
          <div class="p-v-img">
            <el-button class="remove-button" type="text" @click.stop="dossierDeLInfo(item.id || item.ID,'14',loadData)" title="删除" v-if="item.id || item.ID" icon="icon iconfont icon-trash"></el-button>
            <img :src='item.imgsrc' />
          </div>
          <div class="p-v-text">
            <div>{{item.FILENAME}}</div>
            <div class="time_r">{{item.SCSJ}}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="0" class="kinship-box" v-if="videoList&&videoList.length > 0">
      <el-col :span="3">
        <div class="bg1">
          视频
        </div>
      </el-col>
      <el-col :span="21">
        <div class="bg2"></div>
      </el-col>

    </el-row>
    <el-row :gutter="5">
      <el-col :span="4" v-for="(item,i) in videoList" :key='i'>
        <div class="p-v-box" @click="open(item)">
          <div class="p-v-img">
            <el-button class="remove-button" type="text" @click.stop="dossierDeLInfo(item.id || item.ID,'14',loadData)" title="删除" v-if="item.id || item.ID" icon="icon iconfont icon-trash"></el-button>
            <video :src='item.img' width="155" height="98" /></div>
          <div class="p-v-text">
            <div>{{item.FILENAME}}</div>
            <div class="time_r">{{item.SCSJ}}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="5" v-if="!(picList&&picList.length > 0)&&!(videoList&&videoList.length > 0)" style="min-height: 113px;" v-loading="dossierLoading">
      <el-col :span="24">
        <div class="empty"></div>
      </el-col>
    </el-row>
  </div>
  <!-- 图片预览 -->
  <dialog-image :data="imageData" :dialog="imageDialog" @close="imageDialog=false"></dialog-image>
</div>
</template>

<style lang="scss" scoped>
.pic-video {
    .kinship-box {
        text-align: center;
        margin-top: 13px;
        .bg1,
        .bg2,
        .bg3 {
            background: #66c6ff;
            height: 36px;
            line-height: 36px;
            color: #ffffff;
        }
        .bg2 {
            background: #b4d6f1;
        }
    }
    .p-v-box {
        width: 160px;
        margin-top: 10px;
        .p-v-img {
            background: #f2f2f2;
            padding: 5px;
            width: 155px;
            height: 97px;
            overflow: hidden;
            position: relative;
            &:hover {
                .remove-button {
                    display: block;
                }
            }
            img {
                width: 100%;
                height: 97px;
                object-fit: cover;
            }
        }
        .p-v-text {
            font-size: 12px;
            .time_r {}
        }
    }

}

.remove-button {
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px;
    background: rgb(228, 241, 250);
    display: none;
}
</style>


<script>
import cardHeader from './card-header.vue'
import dossierMixin from '../../dossierMixin'
import { GETPICANDVIDEOINFO } from '../../../../store/types'
import { DOWNLOAD_FILE_PATH } from '../../../../config'
import nonepic from '../../../../assets/nonepic.jpg'
import { mapState } from 'vuex'
import bus from '../../../../utils/bus'
import dialogImage from './dialog-image'
export default {
  mixins: [dossierMixin],
  components: {
    cardHeader,
    'dialog-image': dialogImage
  },
  props: ['caseKey', 'zdyData'],
  data() {
    return {
      pvData: [],
      picList: [],
      videoList: [],
      thumb_img: '',
      dossierLoading: true,
      imageDialog: false,
      imageData: []
    }
  },
  methods: {
    changeUpdate() {
      this.loadData()
    },
    loadData() {
      if(this.checkRule('jwy/pesonnelfiles/getpicandvideoinfo', true) === true) {
        this.dispatchDossier(GETPICANDVIDEOINFO, { idcard: this.caseKey }).then(() => {
          this.pvData = this.dossier.getpicandvideoinfo
          this.picList = this.pvData.filter(d => d.TYPE === 'PIC')
          this.videoList = this.pvData.filter(d => d.TYPE === 'VIDEO')
          this.picList.forEach(d => {
            d.imgsrc = d.FILEID ? DOWNLOAD_FILE_PATH + d.FILEID + '&w=91&h=125' : nonepic
            d.img = d.FILEID ? DOWNLOAD_FILE_PATH + d.FILEID : nonepic
          })
          this.videoList.forEach(d => {
            d.imgsrc = d.FILEID ? DOWNLOAD_FILE_PATH + d.FILEID + '&w=91&h=125' : nonepic
            d.img = d.FILEID ? DOWNLOAD_FILE_PATH + d.FILEID : nonepic
          })
          bus.$emit('allLoading')
          this.dossierLoading = false
        })
      } else {
        bus.$emit('allLoading')
        this.dossierLoading = false;
      }
    },
    open(d) {
      this.imageData = d
      this.imageDialog = true
    }
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapState(['dossier'])
  },
  watch: {
    pvData(val) {
      bus.$emit('update:dossierSubTitleNumber', { 'title': '图片视频', 'number': val.length })
    }
  }
}
</script>
