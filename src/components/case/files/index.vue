<!-- 资料夹（数据池、文件夹、图片库、视频库） -->
<template>
<div class="case-box"style="overflow:hidden;">
  <div class="cat-box"style="position:relative;">
    <el-row style="position:absolute;top:0;width:100%;">
      <el-col :span="18">
        <div :class="{cat:true,action:cat==='0'}" @click="cat='0'" v-if="checkUserRuleCase('Ajgl/GetAjglSjcByAjId',caseId,true,cjrId)">
          数据池
        </div>
        <div :class="{cat:true,action:cat==='1'}" @click="cat='1'" v-if="checkRuleCaseFolder.list">
          文件库
        </div>
        <div :class="{cat:true,action:cat==='2'}" @click="cat='2'" v-if="checkRuleCaseFolder.list">
          图片库
        </div>
        <div :class="{cat:true,action:cat==='3'}" @click="cat='3'" v-if="checkRuleCaseFolder.list">
          视频库
        </div>
        <div :class="{cat:true,action:cat==='4'}" @click="cat='4'" v-if="checkRuleCaseFolder.list">
          战法结果
        </div>
        <div :class="{cat:true,action:cat==='5'}" @click="cat='5'" v-if="checkRuleCaseFolder.list">
          时光轴结果
        </div>
        <div :class="{cat:true,action:cat==='6'}" @click="cat='6'" v-if="checkRuleCaseFolder.list">
          关系分析
        </div>
      </el-col>
      <el-col v-if="cat !== '0'&&cat!== '4'&&cat!=='5'&&cat!=='6'&& checkUserRuleCase('ajgl/folder/save',caseId,true,cjrId)" :span="6" style="text-align:right;">
        <el-button size="small" class="iconfont icon-plus" type="primary" @click="addFolder" style="margin-right:20px;">
          新建文件夹
        </el-button>
      </el-col>
    </el-row>
  </div>

  <div :class="{folder:true, 'folder--mg':cat !== '0'&& folderList.length > 0}" v-show="cat!== '4'&&cat!=='5'&&cat!=='6'" v-loading="loadingV" style="position: relative">

    <!-- 无内容初始状态 -->
    <div class="empty empty--tips" v-if="!loadingV && cat !== '0' && folderList.length <= 0">
      <span>暂无相关资料数据</span>
    </div>

    <div class="folder__category" v-if="!loadingV && folderList.length > 0&&cat!=='0'" v-for="(folderL, index) in folderList" >
      <!-- 文件夹分类头部 -->
      <p class="folder__category-top">
        <span class="folder__category-title">{{folderL.title}}</span>
        <span class="folder__category-describe">{{folderL.describe}}</span>
        <span class="folder__category-tool">
          <!-- 文件状态： -->
          <el-radio-group v-model="folderL.shareFlag" class="folder__category-flag">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">共享</el-radio>
            <el-radio :label="2">未共享</el-radio>
          </el-radio-group>
          <i class="iconfont icon-bianji" title="编辑" v-if="checkRuleCaseFolder.update" @click="updateFolder(folderL)"></i>
          <i class="iconfont icon-trash" title="删除" v-if="checkRuleCaseFolder.delete" @click="removeFolder(folderL,index)"></i>
        </span>
      </p>
      <!-- 文件夹类目子集列表 -->
      <div class="folder__item" v-if="cat !== '0'" :span="4" v-for="(item,itemIndex) in folderL.shareFlag===0?folderL.children:(folderL.shareFlag===1?folderL.children.filter(d=>d.share==='1'):folderL.children.filter(d=>d.share!=='1'))" :key="item.id" :title="item.fileInfoTip"
        @click="open(item,itemIndex,folderL.children)">
        <i :class="'iconfont '+getIcon(item.fileType)" v-if="!imageSuffix.includes(item.fileType)"></i>
        <img class="thumbnail" :src="item.fileUrl" v-if="imageSuffix.includes(item.fileType)" /> {{item.videoPreview}}
        <div class="folder__item__name">
          {{item.fileName + '.' + item.fileType}}
        </div>
        <div class="folder__item__flag" @click.stop="handleShare(item,folderL.id)">
          <!-- 共享 -->
          <i :class="{'iconfont icon-share':true, 'folder__item__flag__share':true,'folder__item__flag__share__true':item.share==='1','folder__item__flag__share__false':item.share!=='1'}" :title="item.share==='1'?'取消共享':'共享'"></i>
        </div>
        <div class="folder__item__btn-box">

          <el-button type="text" v-if="checkRuleCaseFolder.deletefile" title="删除" @click.stop="removeFile(item,itemIndex)">
            <i class="iconfont icon-trash"></i>
          </el-button>

          <a :href="item.fileUrl" @click.stop :download="item.fileName" title="下载">
            <el-button type="text"><i class="iconfont icon-download"></i>
            </el-button>
          </a>
          <!--<el-button type="text" title="编辑" v-if="item.type==='text'||item.type==='word'||item.type==='excel'"-->
          <!--@click="edit"><i class="iconfont icon-xinjianbiji"></i></el-button>-->
        </div>
      </div>
      <!-- 文件夹类目子集添加操作 -->
      <div class="person-box__person person-box__person--empty" v-if="(cat === '1'&& checkUserRuleCase('ajgl/folder/savefile',caseId,true,cjrId))||(cat === '2'&& checkUserRuleCase('ajgl/folder/savefiletp',caseId,true,cjrId))||(cat === '3'&& checkUserRuleCase('ajgl/folder/savefilesp',caseId,true,cjrId))"
        @click="addFile(folderL)"></div>

    </div>


    <div class="data-box" v-if="cat === '0'">
      <!-- 数据池 -->
      <data-pool v-if="checkUserRuleCase('Ajgl/GetAjglSjcByAjId',caseId,true,cjrId)"></data-pool>
    </div>
  </div>
    <div class="time_tratic" v-show="cat === '4'">
      <!-- 战法结果 -->
      <content-list></content-list>
    </div>
    <div class="time_tratic" v-show="cat === '5'">
      <!-- 时光轴结果 -->
      <time-line></time-line>
    </div>
    <div class="time_tratic" v-if="cat === '6'">
      <gxfx></gxfx>
    </div>

  <!-- 新增/更新 文件夹 -->
  <editor-folder :dialog="dialogFolder" :data="dialogFolderData" :editmode="handleFolderType" @call:close="dialogFolder = false" @form:submit="folderFormSubmit"></editor-folder>
  <!-- 新增/更新 文件 -->
  <editor-file :dialog="dialogFileEditor" :data="dialogFileData" :editmode="handleFileType" :fileAcceptType="cat" @call:close="dialogFileEditor = false" @form:submit="fileFormSubmit"></editor-file>
  <!-- 视频预览 -->
  <dialog-video :data="videoData" :dialog="videoDialog" @close="videoDialog=false"></dialog-video>
  <!-- 图片预览 -->
  <dialog-image :data="imageData" :dialog="imageDialog" @close="imageDialog=false"></dialog-image>

  <dialog-data :data="dataData" :dialog="dataDialog" @close="dataDialog=false"></dialog-data>
  <dialog-file :data="fileData" :dialog="fileDialog" @close="fileDialog=false"></dialog-file>


</div>
</template>

<style lang="scss" scoped>
  .person-box {
    &__person {
      background: #f2f2f2;
      text-align: center;
      width: 90px;
      height: 80px;
      margin: 10px 5px 0;
      border: 1px solid #ccc;
      display: inline-block;
      position: relative;
      z-index: 2;
      &--empty {
        background: transparent;
        border: 0;
        z-index: 1;
        &:before {
          content: '+';
          background: #efefef;
          font-size: 64px;
          color: #c9c9c9;
          vertical-align: top;
          text-align: center;
          width: 60px;
          height: 60px;
          line-height: 50px;
          border-style: dashed;
          display: block;
          z-index: 1;
          cursor: pointer;
          opacity: 0.8;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          &hover {
            opacity: 1;
          }
        }
      }
    }
  }

  .empty {
    transform: scale(1.5) translateY(-50%);
  }

  .time_tratic {
    height: calc(100vh - 55px);
    display: flex;
  }

  .case-box {
    height: 100%;
    padding: 0;
  }

  .data-box {
    height: 100%;
    display: flex;
  }

  .cat-box {
    /*border-bottom: 1px solid #46bdfd;*/
    padding-top: 8px;
    padding-left: 10px;
    background-color: #fff;
    height: 35px;
    .ctrl-box {
      text-align: right;
    }
    .cat {
      /*background: #d7d7d7;*/
      text-align: center;
      width: 85px;
      height: 30px;
      line-height: 30px;
      margin-left: 10px;
      border-radius: 5px 5px 0 0;
      cursor: pointer;
      transition: 0.2s;
      display: inline-block;
      .iconfont {
        font-size: 20px;
        vertical-align: middle;
      }
      &:hover {
        background: #eee;
      }
      &.action {
        /*background: #54a8e7;*/
        color: #54a8e7;
        border-bottom: 2px solid #54a8e7;
      }
      &:nth-childen(1) {
        margin-left: 20px;
      }
    }
  }

  .folder-navbar {
    color: #999;
    height: 30px;
    line-height: 30px;
    .el-button {
      float: right;
    }
    &__item {
      &+& {
        &:before {
          content: '/';
          margin: 0 10px;
          display: inline-block;
        }
      }
    }
  }

  .folder {
    height: calc(100vh - 105px);
    margin-top: 2px;
    overflow: auto;
    &--mg {
      margin-top: 3px;
      padding-top: 7px;
      background: #fff;
      height: calc(100% - 55px);
    }
    &__category {
      margin: 0 10px;
      &-top {
        border-bottom: 2px solid;
        color: rgba(24, 108, 171, 0.6);
        height: 25px;
        padding: 0 0 0 5px;
      }
      &-title {
        font-size: 16px;
        font-weight: bold;
        float: left;
      }
      &-describe {
        color: #666;
        font-weight: normal;
        margin-left: 10px;
        overflow: hidden;
        display: block;
        width: 40%;
        height: 18px;
        float: left;
      }
      &-tool {
        float: right;
        color: #0e90d2;
        margin-right: 5px;
        >i {
          cursor: pointer;
          margin-right: 5px;
        }
      }
      &-flag {
        padding-right: 20px;
      }
    }
    &__item {
      &__flag {
        position: absolute;
        top: 0;
        left: 0;
        font-size: 10px;
        padding: 5px;
        cursor: pointer;
        &__share {
          font-size: 20px !important;
          margin-bottom: 0 !important;
          &__true {
            color: #4db8ff;
          }
          &__false {
            color: #ccc;
          }
        }
      }
      text-align: center;
      width: 120px;
      height: 85px;
      padding: 0;
      position: relative;
      user-select: none;
      display: inline-block; // cursor: pointer;
      transition: 0.2s;
      i {
        font-size: 50px;
        margin-bottom: 10px;
        display: block;
        &.icon {
          &-word {
            color: rgb(76, 131, 229);
          }
          &-excel {
            color: rgb(111, 180, 123);
          }
          &-pdf {
            color: rgb(255, 118, 118);
          }
          &-ppt {
            color: rgb(233, 87, 63);
          }
          &-TXT {
            color: #f3d000;
          }
          &-jpg {
            color: rgb(61, 172, 12);
          }
          &-avi {
            color: rgb(19, 34, 122);
          }
          &-rar {
            color: rgb(214, 32, 75);
          }
          &-zip {
            color: rgb(214, 32, 75);
          }
          &-file {
            color: rgb(112, 112, 112);
          }
        }
      }
      .thumbnail {
        max-width: 100%;
        height: calc(100% - 30px);
      }
      &:hover {
        background: #eee;
      }
      &__name {
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
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
          &+& {
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
        .folder__item__btn-box {
          display: block;
        }
      }
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import {
    GET_VIDEO_INFO, // 获取视频上传视频信息
    FETCH_FOLDERS_LIST,
    ADD_FOLDER,
    UPDATE_FOLDER,
    REMOVE_FOLDER,
    REMOVE_FOLDER_FILE,
    UPDATE_FOLDER_FILE,
    BATCH_ADDITION_FILE
  } from '../../../store/types'
  import { DOWNLOAD_FILE_PATH } from '../../../config'

  import editorFolder from './editor-folder.vue' // 文件夹编辑
  import editorFile from './editor-file.vue' // 文件编辑

  import pagination from '../../../widgets/pagination/pagination'

  import dialogData from './dialog-data'
  import gxfx from './gxfx'
  import dialogFile from './dialog-file'
  import dialogImage from './dialog-image'
  import dialogVideo from './dialog-video'
  import contentlist from './content-list'
  import timeline from './timeLine'
  import dataPool from './dataPool/index.vue'

  export default {
    mixins: [mixin],
    components: {
      'data-pool': dataPool, // 数据池
      pagination,
      editorFolder,
      editorFile,
      'time-line': timeline,
      'content-list': contentlist,
      'dialog-image': dialogImage,
      'dialog-video': dialogVideo,
      'dialog-data': dialogData,
      'dialog-file': dialogFile,
      'gxfx': gxfx
    },
    data() {
      return {
        checkRuleCaseFolder: { // 多个遍历一套权限
          list: false, // ajgl/folder/list
          update: false, // ajgl/folder/update
          delete: false, // ajgl/folder/delete
          deletefile: false // ajgl/folder/deletefile  v-if=" checkRuleCase('ajgl/folder/deletefile',caseId,true,cjrId)"
        },
        imageSuffix: ['png', 'jpg', 'jpeg', 'gif'], // 图片后缀
        cat: '0', // 0:数据池 1:文件库 2:图片库 3视频库 4:战法结果 5时光轴结果
        caseId: '',
        cjrId: '',
        loadingV: false,
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 1000,
          currentpage: 1
        },
        folderList: [{
          children: [],
          describe: '',
          id: '',
          shareFlag: '', // 0 为全部；1 为共享；2 为非共享 （文件夹的文件）
          title: ''
        }], // 文件集合
        dialogFolder: false,
        handleFolderType: 'add', // 文件夹 弹窗 操作类型 默认add:新增   edit:修改
        dialogFolderData: null, // 文件夹 信息对象
        dialogFileEditor: false,
        handleFileType: 'add', // 文件 弹窗 操作类型 默认add:新增   edit:修改
        dialogFileData: null, // 文件 信息对象
        dataDialog: false,
        fileDialog: false,
        imageDialog: false,
        videoDialog: false,
        videoData: null, // 视频文件预览数据
        imageData: null, // 图片文件预览数据
        dataData: null,
        fileData: null
      }
    },
    computed: {
      ...mapState(['folder', 'videoInfo'])
    },
    methods: {
      /**
       * 文件夹列表匹配
       * @param r
       * @returns {{title: *, children: Array}}
       */
      fileListMap(r) {
        let _children = []
        if (r.fileList) {
          _children = r.fileList.map(cr => {
            let _videoPre = ''
            //            if (cr.by1 === 'mp4') { // 视频文件获取预览图
            //              this.queryVideoInfo(cr.url, f => {
            //                _videoPre = 'data:image/gif;base64,' + this.videoInfo.GetVideoInfo.ScreenshotImage  // 上传视频图片预览
            //                console.log('// 上传视频图片预览', _videoPre)
            //              })
            //            }
            let _fileInfoTipTemp = (cr.wjmc ? '名称：' + cr.wjmc : '') + (cr.wjly ? '\n' + '来源：' + cr.wjly : '') + (cr.sams ? '\n' + '描述：' + cr.sams : '')
            return {
              fileId: cr.id, // 文件id
              fileName: cr.wjmc, // 文件名称
              fileUrlId: cr.url, // 文件存储id
              fileUrl: DOWNLOAD_FILE_PATH + cr.url, // 文件url
              fileType: cr.by1, // 文件类型
              fileSource: cr.wjly, // 文件来源
              fileDescribe: cr.sams, // 文件涉案描述
              videoTime: cr.sc, // 视频时长
              videoPreview: _videoPre, // 视频预览【待定解决】
              // 文件相关提示显示
              fileInfoTip: _fileInfoTipTemp,
              share: cr.sfgx // 是否共享
            }
          })
        }
        return {
          id: r.id, // 文件夹id
          title: r.wjjmc, // 文件夹名称
          describe: r.wjms, // 文件夹描述
          shareFlag: 0, // 文件分享标记
          children: _children
        }
      },
      /**
       * 查询文件夹列表
       */
      queryFoldersList(tp) {
        this.folderList = [] // 置空列表
        this.dispatch(FETCH_FOLDERS_LIST, {
          ajid: this.caseId,
          type: tp,
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        }).then(d => {
          this.loadingV = false
          if (this.folder.FetchFoldersList.PageData) {
            this.folderList = this.folder.FetchFoldersList.PageData.map(r => {
              return this.fileListMap(r)
            })
          }
        })
      },
      /**
       * 文件夹添加
       */
      addFolder() {
        this.handleFolderType = 'add'
        this.dialogFolderData = null
        this.dialogFolder = true
      },
      /**
       * 文件夹更新
       */
      updateFolder(row) {
        this.handleFolderType = 'edit'
        this.dialogFolderData = row
        this.dialogFolder = true
      },
      /**
       *  文件夹删除
       */
      removeFolder(row, index) {
        this.$confirm('确认删除该文件夹及其包含的文件?', '温馨提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingV = true
          this.dispatch(REMOVE_FOLDER, {
            ids: row.id
          }).then(() => {
            this.queryFoldersList(this.cat)
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          })
        }).catch(() => {});
      },
      /**
       * 文件夹操作表单提交
       * @param f
       */
      folderFormSubmit(f) {
        // 新建 (默认)
        let thisForm = {
          wjjmc: f.folderName,
          wjms: f.folderDescribe,
          wjlx: this.cat,
          ajid: this.caseId
        }
        let thisSubmitPath = ADD_FOLDER
        // 修改
        if (f.id !== '') {
          thisForm.id = f.id
          thisSubmitPath = UPDATE_FOLDER
        }
        this.dispatch(thisSubmitPath, thisForm).then(d => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.queryFoldersList(this.cat)
          this.dialogFolder = false
        })
      },
      /**
       *  添加文件
       * @param folder
       */
      addFile(folder) {
        this.handleFileType = 'add'
        this.dialogFileData = {
          folderId: folder.id
        }
        this.dialogFileEditor = true
      },
      /**
       * 文件操作表单提交
       * @param f
       */
      fileFormSubmit(f) {
        // 新建 (默认)
        let queryFormData = []
        f.map(item => {
          let thisForm = {
            wjjid: item.folderId,
            wjmc: item.fileName,
            url: item.fileUrlId,
            wjly: item.fileSource,
            sfgx: item.isshare,
            sams: item.fileDescribe,
            sc: item.videoTime,
            by1: item.fileSuffix, // 文件后缀
            by2: item.videoPreview // 视频预览
          }
          queryFormData.push(thisForm)
        })
        let thisSubmitPath = BATCH_ADDITION_FILE
        this.dispatch(thisSubmitPath, { list: queryFormData }).then(d => {
          this.$message({
            type: 'success',
            message: '成功'
          })
          this.queryFoldersList(this.cat)
          this.dialogFileEditor = false
        })
      },
      /**
       * 删除文件
       * @param row
       */
      removeFile(row, index) {
        this.$confirm('确认删除该文件-' + row.fileName + '?', '温馨提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadingV = true
          this.dispatch(REMOVE_FOLDER_FILE, {
            ids: row.fileId
          }).then(() => {
            this.queryFoldersList(this.cat)
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          })
        }).catch(() => {});
      },
      getIcon(type) {
        let icon
        switch (type) {
          case 'folder':
            icon = 'icon-folder'
            break;
          case 'data':
            icon = 'icon-data-box'
            break;
          case 'word':
            icon = 'icon-word'
            break;
          case 'docx':
            icon = 'icon-word'
            break;
          case 'excel':
            icon = 'icon-excel'
            break;
          case 'pdf':
            icon = 'icon-pdf'
            break;
          case 'text':
            icon = 'icon-TXT'
            break;
          case 'txt':
            icon = 'icon-TXT'
            break;
          case 'png':
            icon = 'icon-jpg'
            break;
          case 'jpg':
            icon = 'icon-jpg'
            break;
          case 'jpeg':
            icon = 'icon-jpg'
            break;
          case 'gif':
            icon = 'icon-jpg'
            break;
          case 'mp4':
            icon = 'icon-avi'
            break;
          case 'avi':
            icon = 'icon-avi'
            break;
          default:
            icon = 'icon-file'
        }
        return icon
      },
      /**
       *  查询上传视频文件信息
       * @param vId 上传视频文件id
       * @param callback 查询信息成功回调
       */
      queryVideoInfo(vId, callback = () => {}) {
        this.dispatch(GET_VIDEO_INFO, {
          ID: vId
        }).then(d => {
          callback()
        })
      },
      open(target, index, itemList) {
        // 文件
        switch (this.cat) {
          case '0':
            // 数据
            //              this.dataData = target
            //              this.dataDialog = true
            break;
          case '1':
            // 文件
            //              this.fileData = target
            //              this.fileDialog = true
            break;
          case '2':
            // 图片
            this.imageData = {
              currentItem: target,
              currentIndex: index,
              item: itemList
            }
            this.imageDialog = true
            break;
          case '3':
            // 视频
            this.videoData = target
            this.videoDialog = true
            break;
          default:
        }
      },
      /**
       * 刷新相关操作权限限制
       */
      refreshRule() {
        this.checkRuleCaseFolder = { // 多个遍历一套权限
          list: this.checkUserRuleCase('ajgl/folder/list', this.caseId, true, this.cjrId), // ajgl/folder/list
          update: this.checkUserRuleCase('ajgl/folder/update', this.caseId, true, this.cjrId), // ajgl/folder/update
          delete: this.checkUserRuleCase('ajgl/folder/delete', this.caseId, true, this.cjrId), // ajgl/folder/delete
          deletefile: this.checkUserRuleCase('ajgl/folder/deletefile', this.caseId, true, this.cjrId) // ajgl/folder/deletefile
        }
      },
      /**
       * 共享状态切换
       */
      handleShare(file, folderId) {
        this.dispatch(UPDATE_FOLDER_FILE, {
          wjjid: folderId,
          id: file.fileId,
          sfgx: file.share === '1' ? '0' : '1'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '状态更改成功'
          })
          this.queryFoldersList(this.cat)
        }).catch(d => {
          console.log(d, '错误');
        })
      }
    },
    watch: {
      cat(val) {
        this.loadingV = true
        switch (this.cat) {
          case '0':
            // 数据池
            this.loadingV = false
            break;
          case '1':
            // 文件
            this.queryFoldersList('1')
            break;
          case '2':
            // 图片
            this.queryFoldersList('2')
            break;
          case '3':
            // 视频
            this.queryFoldersList('3')
            break;
          case '4':
            // 战法结果
            this.loadingV = false;
            break;
          case '5':
            // 时光轴结果
            this.loadingV = false;
            break;
          case '6':
            // 关系分析
            this.loadingV = false;
            break;
        }
        this.refreshRule() // 刷新页面操作权限
      }
    },
    mounted() {
      this.cat = '0'
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      this.refreshRule() // 刷新页面操作权限
    }
  }

</script>
