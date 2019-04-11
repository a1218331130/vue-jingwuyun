<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <div class="analysis-image" v-loading="pageLoading">

      <div class="content-box">
        <div :class="{'result-box':true, 'img-model':isImgModel===true}">
          <div class="filterbox" style="position: absolute;right: 5px;top: 5px; z-index: 2;">
            <span>匹配率：</span>
            <!-- <el-autocomplete v-model="valueSore" placeholder="请选择匹配率" :fetch-suggestions="querySearch"></el-autocomplete> -->
            <el-select style="width:130px" v-model="valueSore" placeholder="请选择匹配率">
              <el-option v-for="item in optionSore" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <el-tabs v-model="currentTab" style="border-top: 1px solid #ccc;">
            <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.id" :key="tab.id">
              <div class="result-box__list" v-if="viewList.length>0">
                <div class="item" v-for="(item,itemIndex) in viewList" :key="item.id">
                  <div class="item__image-box">
                    <img class="item__image-box__image" :src="item.filepath" alt="" @click="showImageDialog(item,itemIndex,viewList)">
                    <div class="item__image-box__name">
                    </div>
                    <div class="item__image-box__btn-box">
                      <a :href="item.filepath" @click.stop :download="item.filepath" title="下载">
                        <el-button type="text"><i class="iconfont icon-download"></i>
                        </el-button>
                      </a>
                    </div>
                  </div>
                  <div class="item__desc">匹配率：
                    <span>{{parseInt(item.score)}}%</span>
                  </div>
                </div>
              </div>
              <div class="empty" v-if="viewList.length===0 && loading===false"></div>
              <dialog-image :data="imageData" :dialog="imageDialog" @close="imageDialog=false"></dialog-image>
              <!-- 分页栏 -->
              <!-- <div class="app-toolbar">
                  <pagination :count="tab.count" :pagenav="tab.pagenav" @update:pagenav="val=>tab.pagenav=val"></pagination>
                </div> -->

            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="source-box" v-if="isImgModel===true">
          <!-- <el-tabs>
              <el-tab-pane label="1111">
                <div class="user-uploader">
                  <div class="user-uploader__item" v-for="item in userUploader">
                    <img :class="{'source-box__image':true,current:targetSrc===item.src}" :src="item.src" @click="activeImgSearch(item.src)" alt="您上传的图片">
                    <div class="">您上传的图片</div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="222">
                <div class="list">
                  <div class="list__item" v-for="item in historyList" :key="item.id">
                    <img :class="{'list__item__image':true,current:targetSrc==='src'}" :src="item.picurl" alt="" @click="activeImgSearch('src')">
                    <div class="">历史图片</div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs> -->
          <div class="source-box__title">
            上传图片
          </div>
          <div class="source-box__upload">
            <!-- <div class="user-uploader__item" v-for="item in userUploader" style="width: 100%;
      background-color: white;
      height: 200px;">
                <img :class="{'source-box__item__image':true,current:targetSrc===item.src}" :src="item.src" @click="activeImgSearch(item.src)" alt="您上传的图片">
                <div class="source-box__item__content">
                  <el-row type="flex" justify="start">
                    <el-col :span="24">名称：{{'图片1'}}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">图片路径</el-col>
                  </el-row>
                </div>
                <div class="">您上传的图片</div>
              </div> -->
            <div class="info-hand" v-for="item in userUploader">
              <div class="info-logo_box">
                <img :src="item.src" @click="activeImgSearch(item)">
              </div>
              <div class="info-hand-box">
                <p title="名称">
                  <span>名称：</span>
                  <span class="info-hand-box_text">{{picName}}</span>
                </p>
                <!--<a :href="info.link">-->
                <!-- <p><span>上传路径：</span>
                  <span class="info-hand-box_text upload__time">{{'无'}}</span>
                </p> -->
                <!--</a>-->
                <p>
                  <span>上传时间：</span>
                  <span class="info-hand-box_text">{{uploadTime}}</span>
                </p>
              </div>
            </div>
            <div class="tool">
              <input type="file" ref="searchUploadBtn" class="hide" accept=".jpg,.png,.bmp,.JPG" @change="fileChange">
              <span class="into" @click="clickUpload"><i class="iconfont icon-into"></i>图片上传</span>
              <span @click="getResult"><i class="iconfont icon-collection"></i> 分析</span>
            </div>
          </div>
          <div class="source-box__history">
            <div class="source-box__history__title">
              历史图片
            </div>
            <p style="margin: 0;
    color: #ccc;">双击分析历史图片</p>
            <div class="list__item" v-for="(item,index) in historyList" v-if="(item.picurl!=='src')&&(item.picurl!==null)" :key="item.id">
              <!-- <el-popover placement="top-start" ref="popover" title="提示" width="200" trigger="hover" content="双击分析图片"></el-popover> -->
              <el-button class="list__item__btn-remove" icon="close" @click="removeHistoryItem(item.md5)"></el-button>
              <img :class="{'list__item__image':true,current:targetSrc==='src'}" :src="item.picurl" alt="" @dblclick="dblclickImg(item)">
              <div class="show-name">
                <span>{{item.by1}}</span>
              </div>
              <!-- <p style="margin:0px">历史图片{{index}}</p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" :modalAppendToBody="false" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
  </el-region>

</el-layout>
</template>

<style scoped lang='scss'>
.analysis-image {
    background: #fff;
    height: calc(100vh - 60px);
    overflow: hidden;
    .search-bar {
        background: #f5f9ff;
        text-align: center;
        height: 80px;
        line-height: 80px;
        border-bottom: 1px solid #ccc;
        &__input-box {
            min-width: 500px;
            max-width: 700px;
            display: inline-block;
            .el-input {
                .el-input__inner {
                    height: 30px;
                }
            }
        }
        &__button {}
    }
    .content-box {
        display: flex;
        padding: 15px 10px 15px 15px;
        border-left: 1px solid #ccc;
    }
    .source-box {
        text-align: center;
        width: 350px;
        height: 100vh;
        background: #eee;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-top: 1px solid #ccc;
        &__title {
            font-size: 14px;
            text-align: center;
            color: #20a0ff;
            height: 39px;
            line-height: 39px;
            border-bottom: 3px solid #20a0ff;
            background: #fff;
        }
        &__upload {
            min-height: 200px;
        }
        &__history {
            &__title {
                background: #fff;
                color: #333;
                border-top: 1px solid #ccc;
                border-bottom: 1px solid #ccc;
                padding: 5px 0;
            }
        }
        &__item {
            width: 300px;
            height: 150px;
            &__image {
                height: 70%;
                margin: 0 auto;
                border: 4px solid #f2f2f2;
                position: relative;
                left: -25%;
                top: 20px;
            }
            &__content {
                height: 70%;
                border: 4px solid #f2f2f2;
                position: relative;
                left: 47%;
                top: -132px;
                width: 150px;
            }
        }
    }
    .result-box {
        background: #fff;
        position: relative;
        border-left: 1px solid #ccc;
        &.img-model {
            width: calc(100% - 200px);
        }
        &__list {
            height: calc(100vh - 200px);
            padding: 10px 20px;
            overflow: scroll;
        }
        .item {
            width: 130px;
            margin: 0 10px;
            display: inline-block;
            &__image-box {
                background: #f2f2f2;
                padding: 5px;
                position: relative;
                &__image {
                    width: 120px;
                    height: 150px;
                    margin: 0 auto;
                }
                &__name {
                    line-height: 24px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    position: absolute;
                    bottom: 6px;
                    /* left: 44px; */
                    text-align: center;
                    background-color: white;
                    width: 92%;
                }
                &__btn-box {
                    width: 30px;
                    border: 1px solid #ccc;
                    display: none;
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    transition: 0.25s;
                    .el-button {
                        background: #4db8ff;
                        width: 100%;
                        height: 28px;
                        padding: 0;
                        & + & {
                            border-top: 1px solid #ccc;
                        }
                        .iconfont {
                            font-size: 12px;
                            color: #fff;
                            margin: 0;
                        }
                        &:hover {
                            background: #ff9900;
                            .iconfont {
                                color: #fff;
                            }
                        }
                    }
                }
                &:hover {
                    z-index: 3;
                    background-color: #ccc;
                    .item__image-box__btn-box {
                        display: inline;
                    }
                }
            }
            &__desc {
                height: 32px;
                line-height: 32px;
                padding: 0 5px;
                span {
                    float: right;
                    color: #20a0ff;
                }
            }
        }
    }
}
</style>

<style lang='scss'>
.analysis-image {
    .search-bar {
        &__input-box {
            .el-input {
                .el-input__inner {
                    height: 36px;
                }
            }
        }
        &__button {}
    }
}

.empty {
    text-align: center;
    font-size: 26px;
    color: #999999;
    line-height: 50px;
    position: absolute;
    top: 35vh;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.tool {
    height: 65px;
    text-align: center;
    color: #ffffff;
    background-color: #F5F5F5;
    span {
        background-color: rgb(16, 167, 53);
        font-size: 14px;
        height: 35px;
        margin: 15px auto;
        padding: 0 5px;
        line-height: 35px;
        display: inline-block;
        border-radius: 4px;
        cursor: pointer;
        width: 130px;
        &.into {
            background-color: #20a0ff;
        }
    }
}

.info-hand {
    height: 115px;
    padding: 20px 10px;
    position: relative;
    background-color: white;
    .info-logo_box {
        width: 100px;
        height: 100%;
        overflow: hidden;
        border: 4px solid #f2f2f2;
        /*background: rgba(9, 99, 149, 0.67);*/
        position: relative;
        > img {
            max-width: 100%;
            max-height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }
    .info-hand-box {
        position: absolute;
        top: 20px;
        left: 120px;
        right: 5px;
        p {
            margin: 0;
            line-height: 24px;
            font-size: 14px;
            overflow: hidden;
            padding-right: 0;
            text-overflow: ellipsis;
            margin-bottom: 5px;
            color: #000;
            span {
                // margin-right: 5px;
                float: left;
            }
            .info-hand-box_text {
                word-wrap: break-word;
                display: -webkit-box;
                max-height: 33px;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 10px;
                &.upload__time {
                    color: #20a0ff;
                }
            }
        }
    }
}

.list__item {
    background: transparent;
    width: 33.33333%;
    height: 150px;
    padding: 10px;
    box-sizing: border-box;
    border: 0 solid #dedede;
    opacity: 0.8;
    float: left;
    position: relative;
    &:after {
        content: '';
        display: block;
        clear: both;
    }
    &__btn-remove {
        background: #ccc;
        text-align: center;
        width: 24px;
        height: 24px;
        line-height: 24px;
        padding: 0;
        border: 0;
        border-radius: 0 0 0 10px;
        opacity: 0.8;
        position: absolute;
        top: 0;
        right: 0;
        i {
            font-size: 12px;
            color: #fff;
        }
        &:hover {
            background: red;
            i {
                color: #fff;
            }
            opacity: 1;
        }
    }
    &__image {
        width: 100%;
        height: 100px;
        display: block;
    }
    &:hover {
        opacity: 1;
    }
}
.show-name {
    text-align: start;
    font-size: 10px;
    position: relative;
    display: inline-block;
    overflow: hidden;
    width: 100%;
    overflow-wrap: break-word;
    height: 40px;
}
</style>

<script>
import { mapState } from 'vuex'
import { FETCH_ANALYSIS_IMAGE, FETCH_ANALYSIS_IMAGE_HISTORY, REMOVE_ANALYSIS_IMAGE_HISTORY } from '../../../store/types'
import { UPLOAD_PATH, LOGIN_HOST } from '../../../config'
import mixin from '../../../utils/mixin'
import TopBar from '../../common/topbar/index.vue'
import pagination from '../../../widgets/pagination/pagination'
import dialogImage from './image-dialog'
import sideRightBox from '../../control/side-right-box.vue'
import dialogInfo from '../../../widgets/info-dialog/info-dialog'
import infoDialogEvents from '../../../utils/infoDialogEvents'
export default {
  mixins: [mixin, infoDialogEvents],
  components: {
    TopBar,
    pagination,
    'dialog-image': dialogImage,
    sideRightBox,
    'dialog-people-info': dialogInfo
  },
  data() {
    return {
      // showRightBar: false,
      uploadTime: '',
      currentImage: false,
      fileOpen: true,
      peopleInfoDialog: false,
      infoDialogData: {},
      optionSore: [{
        value: '90',
        label: '90%'
      }, {
        value: '80',
        label: '80%'
      }, {
        value: '70',
        label: '70%'
      }, {
        value: '60',
        label: '60%'
      }, {
        value: '50',
        label: '50%'
      }],
      picName: '',
      userUploader: [],
      historyList: [],
      listNumber: '',
      valueSore: '70',
      imageData: null,
      imageDialog: false,
      showResult: false,
      keyword: '',
      targetSrc: '',
      targetFjId: '',
      fileMD5: '',
      currentTab: '1',
      fileInfo: {},
      isImgModel: true,
      tabs: [{
        id: '1',
        label: '对比图片',
        list: [],
        count: 0,
        pagenav: { currentpage: 1, count: 99 }
      }],
      fileTypes: ['jpg', 'png', 'bmp', 'JPG'],
      pageLoading: false
    }
  },
  computed: {
    viewList() {
      let res = []
      if(this.valueSore === '') {
        res = this.tabs[0].list
      } else {
        res = [...this.tabs[0].list.filter(d => parseInt(d.score) >= parseInt(this.valueSore))]
      }
      this.listNumber = res.length
      this.setTab()
      return res
    },
    ...mapState(['analysisImage'])
  },
  watch: {},
  methods: {
    querySearch(queryString, cb) {},
    createFilter(queryString) {},
    clickUpload() {
      this.$refs.searchUploadBtn.click()
      this.isImgModel = true
    },
    showImageDialog(target, index, itemList) {
      console.log(666, target, index, itemList);
      this.infoDialogData = { contentType: 1, keyId: target.metadata.objid }
      this.peopleInfoDialog = true
    },
    changeSelect(data) {
      console.log(parseInt(data));
    },
    getResult(isImgModel = true) {
      if(this.keyword === '' && this.targetSrc === '') {
        this.$alert('请先输入关键字 或 上传需要对比的图片', '温馨提示');
      }
      this.pageLoading = true
      this.dispatch(FETCH_ANALYSIS_IMAGE, {
        // keyword: this.keyword,
        md5: this.fileMD5,
        fjid: this.targetFjId || '',
        picurl: this.targetSrc,
        by1: this.picName
      }).then(() => {
        this.pageLoading = false
        this.currentImage = this.targetSrc
        this.tabs[0].list = JSON.parse(this.analysisImage.list.body).result
        this.listNumber = this.tabs[0].list.length
        this.setTab()
        this.showResult = true
        this.getHistoryList()
      })
    },
    getHistoryList() {
      this.dispatch(FETCH_ANALYSIS_IMAGE_HISTORY, { limit: 6 }).then(() => {
        this.historyList = this.analysisImage.historyList
      })
    },
    removeHistoryItem(id) {
      this.$confirm('请确认是否删除该条历史记录?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dispatch(REMOVE_ANALYSIS_IMAGE_HISTORY, { id: id }).then(() => {
          this.getHistoryList()
        })
      }).catch(() => {})
    },
    setTab() {
      this.tabs[0].label = '对比图片(' + this.listNumber + ')'
    },
    fileChange(elm) {
      this.userUploader = []
      let file = elm.target.files[0],
        fileTypeArr = file.name.split('.'),
        fileType = fileTypeArr[fileTypeArr.length - 1]
      if(file.size > 1024 * 1024 * 20) {
        this.$message({
          type: 'error',
          message: '文件不能大于20MB',
          showClose: true
        })
      } else if(!this.fileTypes.find(d => d === fileType)) {
        this.$message({
          type: 'error',
          message: '只支持 图像 文件',
          showClose: true
        })
      } else {
        let formData = new FormData()
        formData.append('file', file)
        formData.append('data', JSON.stringify({ token: this.userData.UserToken }))
        this.$http.post(UPLOAD_PATH, formData).then((res) => {
          this.targetFjId = res.body.Data.ID || ''
          this.targetSrc = res.body.Data.FileUrl || ''
          this.picName = res.body.Data.Name || ''
          this.fileMD5 = res.body.Data.FileMd5 || ''
          let upTime = new Date()
          this.uploadTime = upTime.toLocaleString()
          this.getHistoryList()
          this.userUploader.push({
            name: '',
            id: res.body.Data.ID || '',
            src: res.body.Data.FileUrl || '',
            md5: res.body.Data.FileMd5 || ''
          })
        })
        this.showResult = true
      }
    },
    activeImgSearch(item) {
      this.targetSrc = item.src
      this.targetFjId = item.id
      this.fileMD5 = item.md5
      this.$confirm('是否使用当前点击的图片进行搜索， 当前已有搜索结果会被清空', '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.getResult(true, item.src)
      }).catch(() => {});
    },
    dblclickImg(item) {
      this.userUploader = []
      this.userUploader.push({
        name: '',
        src: item.picurl
      })
      this.targetFjId = item.fjid
      this.targetSrc = item.picurl
      this.fileMD5 = item.md5
      this.picName = item.by1 === null ? '无' : item.by1
      this.uploadTime = item.gxsj
      if(!this.currentImage || this.currentImage !== item.picurl) this.getResult(true, item.picurl)
    },
    switchImgModel() {
      this.isImgModel = !this.isImgModel
    }
  },
  mounted() {
    if(this.$route.params.fileId) {
      let fileInfo = this.$route.params.fileId.indexOf('|') !== -1 ? this.$route.params.fileId.split('|') : [this.$route.params.fileId]
      this.targetFjId = fileInfo[0]
      this.targetSrc = `${LOGIN_HOST}/temp_uploader/${fileInfo[0]}.png`
      this.fileMD5 = fileInfo[1] || ''
      this.getResult(true)
    }
  },
  created() {
    this.getHistoryList()
    // this.tabs[1].list = [...testList]
    // this.tabs[2].list = [...testList]
  }
}
</script>
