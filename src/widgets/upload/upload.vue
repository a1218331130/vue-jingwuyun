<!--
  文件上传
  update-button 隐藏上传按钮
-->
<template>
<transition>
  <div>
    <!-- 上传 默认 -->
    <el-upload v-if="uploadType === 'default'|| uploadType === ''" ref="uploadRef" :action="action" :data="data" :on-preview="handlePreview" :on-success="handleSuccess" :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile" :file-list="fileLists"
      v-loading="updateLoading" element-loading-text="拼命上传中..." :class="{'update-button':(isSinglePic && fileListArry.length > 0)}">
      <slot name="button">
        <el-button size="small" type="primary">点击上传</el-button>
      </slot>
    </el-upload>
    
  <!-- 多文件上传  -->
  <el-upload :multiple="true" v-if="uploadType === 'multiple'" :accept="accept" ref="uploadRef" :action="action" :data="data" :on-preview="handlePreview" :on-success="handleSuccess" :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile" :file-list="fileLists"
      v-loading="updateLoading" element-loading-text="拼命上传中..." :class="{'update-button':(isSinglePic && fileListArry.length > 0)}">
      <slot name="button">
        <el-button size="small" type="primary">点击上传</el-button>
      </slot>
    </el-upload>

    <!-- 预览附件 上传 -->
    <el-upload v-if="uploadType === 'preview'" list-type="picture" :accept="accept" ref="uploadRef" :action="action" :data="data" :on-preview="handlePreview" :on-success="handleSuccess" :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile" :file-list="fileLists"
      v-loading="updateLoading" element-loading-text="拼命上传中..." :class="{'update-button':(isSinglePic && fileListArry.length > 0)}">
      <slot name="button">
        <el-button size="small" type="primary">点击上传</el-button>
      </slot>
    </el-upload>
    
  <!-- 预览附件 多个上传 -->
  <el-upload v-if="uploadType === 'previewMultiple'" list-type="picture" :accept="accept" ref="uploadRef" :action="action" :data="data" :on-preview="handlePreview" :on-success="handleSuccess" :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile" :file-list="fileLists" v-loading="updateLoading" element-loading-text="拼命上传中..." :class="{'update-button':(isSinglePic && fileListArry.length > 0)}" :multiple="true">
    <slot name="button">
      <el-button size="small" type="primary">点击上传</el-button>
    </slot>
  </el-upload>


    <!-- 上传用户头像 单张-->
    <el-upload v-if="uploadType === 'picture'&& isSinglePic" list-type="picture-card" accept="image/gif,image/jpg,image/png,image/jpeg" ref="uploadRef" :action="action" :data="data" :show-file-list="false" :on-preview="handlePreview" :on-success="handleSuccess"
      :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile">
      <img v-if="userImageUrl" :src="userImageUrl" class="avater" />
      <slot name="button" v-else>
        <i class="el-icon-plus"></i>
      </slot>
    </el-upload>

    <!-- 上传照片 多张-->
    <el-upload v-if="uploadType === 'picture'&& !isSinglePic" list-type="picture-card" accept="image/gif,image/jpg,image/png,image/jpeg" ref="uploadRef" :action="action" :data="data" :file-list="fileLists" :on-preview="handlePreview" :on-success="handleSuccess"
      :before-upload="handleBeforeUpload" :on-remove="handleRemoveFile" :multiple="true">
      <slot name="button">
        <i class="el-icon-plus"></i>
      </slot>
    </el-upload>
    <el-dialog v-draggable="dialogDraggableOptions" v-if="uploadType === 'picture-card'" v-model="dialogVisible.isShow" :modal="false" size="large">
      <img width="100%" height="100%" :src="dialogVisible.ImageUrl" alt="" />
    </el-dialog>

  </div>
</transition>
</template>
<style scoped lang="scss">
  .avater {
    width: 100%;
    max-height: 100%;
    transform: translateX(-50%) translateY(-50%);
    position: absolute;
    top: 50%;
    left: 50%;
  }

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
  import { mapState } from 'vuex'
  import mixin from '../../utils/mixin'
  import { UPLOAD_PATH, DOWNLOAD_FILE_PATH } from '../../config'
  import {
    SAVE_FILE_TO_FORMAL, // 临时目录移交到正式目录保存
    GET_VIDEO_INFO // 获取视频上传视频信息
  } from '../../store/types'

  /**
   * @module Upload
   * @desc 通用上传组件
   *
   *    `slot="button"`
   *
   *    保存成功后回调函数 `@upload:submit({Object})`
   *
   * @example <upload :isFormalSubmit="isFormalSubmit" :source="attachmentSource" @upload:submit="uploadSubmit" :currentFiles="form.files"></upload>
   */
  export default {
    mixins: [mixin],
    components: {},
    computed: {
      ...mapState(['videoInfo'])
    },
    data() {
      return {
        updateLoading: false, // 上传loading
        userImageUrl: '', // 用户头像
        dialogVisible: {
          isShow: false,
          ImageUrl: ''
        },
        data: null,
        action: UPLOAD_PATH,
        fileListName: [], // 当前上传文件名称
        fileLists: [], // 已上传文件列表
        fileListArry: [] // 存储临时文件列表
      };
    },
    /**
     * 接收参数
     * @prop {String} accept 上传文件类型限制 默认不限制 @default ''
     * @prop {Number} updateFileSize 上传文件大小限制 单位:MB @default 100
     * @prop {String} uploadType 上传类型 @default 'default'
     * @prop {Boolean} isSinglePic 是否只能上传单个图片 @default false
     * @prop {Boolean} isFormalSubmit 文件是否正式上传 @default false
     * @prop {String} imageUrl 单个图片 上传临时文件预览
     * @prop {Array} currentFiles 当前文件list
     */
    props: {
      accept: {
        type: String,
        default: ''
      },
      updateFileSize: {
        type: Number,
        default: 100
      },
      uploadType: {
        type: String,
        default: 'default'
      },
      isSinglePic: {
        type: Boolean,
        default: false
      },
      isFormalSubmit: {
        type: Boolean,
        default: false
      },
      imageUrl: String,
      currentFiles: Array
    },
    methods: {
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
      handleBeforeUpload(file) {
        console.log(file, 'handleBeforeUpload')
        // 文件上传之前
        this.updateLoading = true
        // 验证文件上传大小
        const isLtM = file.size / 1024 / 1024 < this.updateFileSize;
        if (!isLtM) {
          this.$message.error('上传文件大小不能超过 ' + this.updateFileSize + 'MB!');
          this.updateLoading = false
          return isLtM;
        }
        // 验证文件上传类型
        const _isType = file.name.split('.')[file.name.split('.').length - 1] // 文件后缀
        if (this.accept !== '' && !this.accept.includes(_isType)) {
          this.$message.error('上传文件类型不合法！');
          this.updateLoading = false
          return false;
        }
        this.fileListName.push(file.name) //  临时保存文件名称
      },
      handleSuccess(res, file, fileList) {
        console.log(res, file, fileList, 'handleSuccess')
        if (file.response.Status !== 1) { // 上传失败
          this.handleError(res, file, fileList)
          return false
        }
        // 文件上传成功执行
        if (file.raw.type.split('/')[0] === 'video') { // 判断上传文件是否为视频文件,特殊处理 获取相关信息
          let _tFileList = [] // 文件列表临时存储
          this.queryVideoInfo(file.response.Data.ID, f => {
            let _thisVideoBaseInfo = this.videoInfo.GetVideoInfo // 获取查询到的视频信息

            // 添加文件信息参数
            file.url = 'data:image/gif;base64,' + _thisVideoBaseInfo.ScreenshotImage // 上传视频图片预览
            file.response.Data.video = _thisVideoBaseInfo
            _tFileList = fileList.map(df => {
              if (df.response) {
                if (df.response.Data.ID === file.response.Data.ID) {
                  df.response.Data.video = _thisVideoBaseInfo
                  df.url = 'data:image/gif;base64,' + _thisVideoBaseInfo.ScreenshotImage // 上传视频图片预览
                }
              }
              return df
            })
            fileList = _tFileList
            // 文件临时操作处理
            if (this.isSinglePic) {
              this.temporaryHandle(res, file, [file])
            } else {
              console.log(fileList, 'handleSuccess....temporaryHandle')
              this.temporaryHandle(res, file, fileList)
            }
          })
        } else if (file.raw.type.split('/')[0] === 'image') { // 判断上传文件是否为 图片
          this.userImageUrl = URL.createObjectURL(file.raw)
          // 文件临时操作处理
          if (this.isSinglePic) {
            this.temporaryHandle(res, file, [file])
          } else {
            this.temporaryHandle(res, file, fileList)
          }
        } else { // 上传文件其它类型E:\workspace\JWY\trunk\JWYWEB\static\img\fileTypeIcon\file.png
          let defaultFileIcon = this.fileIconMatch(file.response.Data.Extend) // 上传文件列表默认预览图标
          file.url = defaultFileIcon // 上传文件列表默认预览图标
          let _tFileList = [] // 文件列表临时存储
          _tFileList = fileList.map(df => {
            if (df.response) {
              // if (df.response.Data.ID === file.response.Data.ID) {
              df.url = this.fileIconMatch(df.response.Data.Extend) // 上传视频图片预览
              // }
            }
            return df
          })
          console.log(_tFileList, '_fFileList')
          fileList = _tFileList
          console.log(this.isSinglePic, 'this.isSinglePic')
          // 文件临时操作处理f
          if (this.isSinglePic) {
            this.temporaryHandle(res, file, [file])
          } else {
            this.temporaryHandle(res, file, fileList)
          }
        }
      },
      handleError(err, file, fileList) {
        this.$message.error(file.response.Data) // 上传失败提示
        // 上传失败回调
        this.exposesMethod({ // 抛出参数响应到外部
          Status: 0,
          data: {
            err: err,
            file: file,
            fileList: fileList
          }
        })
      },
      handleRemoveFile(file, fileList) {
        // 删除附件
        this.fileListArry = fileList.filter(flr => {
          return flr.response // 过滤已存在数
        }).map(res => { // 保存新增
          return res.response.Data
        })
        this.exposesMethod({ // 抛出参数响应到外部
          Status: 1,
          data: {
            file: file,
            fileList: fileList
          }
        })
      },
      handlePreview(file) {
        if (this.uploadType === 'picture' && !this.isSinglePic) {
          this.dialogVisible.ImageUrl = file.url
          this.dialogVisible.isShow = true
        }
      },
      fileFormalSave() {
        // 保存文件到正式目录
        if (this.fileListArry.length <= 0) {
          this.exposesMethod({ // 抛出参数响应到外部
            Status: 0,
            data: {}
          })
          return false
        }

        let __fileListArry = [] // 保存文件信息
        for (let ii in this.fileListArry) { // 保存附加插入关联表数据
          let __fla = this.fileListArry[ii]
          __fileListArry.push(__fla.ID)
        }

        this.dispatch(SAVE_FILE_TO_FORMAL, {
          IDs: __fileListArry
        }).then(res => {
          //          this.clearFiles() // 初始化文件预览数据清空
        }).catch(r => {
          //          this.clearFiles() // 初始化文件预览数据清空
        })
      },
      dataReturn() {
        // 数据回填
        if (this.currentFiles.length < 1) {
          this.clearFiles() // 初始化文件预览数据清空
          console.log(this.currentFiles, 'this.currentFiles 3333333333333333333')
        } else if (this.currentFiles && this.currentFiles.length > 0) {
          console.log(this.currentFiles, 'this.currentFiles 2222222222222222')
          let ol = this.currentFiles
          let _cFiles = []
          for (let _did in ol) {
            if (this.uploadType === 'picture' && this.isSinglePic) { //  单张头像 数据回填
              this.userImageUrl = DOWNLOAD_FILE_PATH + ol[_did].id + '&w=148'
            } else {
              _cFiles.push({
                name: ol[_did].name,
                response: {
                  Data: {
                    Name: ol[_did].name,
                    ID: ol[_did].id
                  }
                },
                url: DOWNLOAD_FILE_PATH + ol[_did].id
              })
            }
          }
          this.fileLists = _cFiles
        }
      },
      exposesMethod(res) {
        this.updateLoading = false
        /**
         * 抛出参数响应到外部
         * @event module:Upload~upload:submit
         * @param {Object} a 返回对象
         * @param {Number} a.Status 成功与否, 1:成功, 0:失败
         * @param {Object} a.data 详细返回结果
         * @param {Object} a.data.res 后端源返回(根据后端不同版本会产生变化)
         * @param {File} a.data.file 上传文件实体
         * @param {Array} a.data.fileList 上传文件列队数组
         */
        this.$emit('upload:submit', res);
        console.log(res, 'this.res')
      },
      temporaryHandle(res, file, fileList) {
        console.log(res, file, fileList, 'temporaryHandle')
        // 文件临时操作处理
        // todo:临时文件复制
        this.fileFieldMatch(res, file) // 存储要上传的文件
        this.exposesMethod({ // 抛出参数响应到外部
          Status: 1,
          data: {
            res: res,
            file: file,
            fileList: fileList
          }
        })
      },
      clearFiles() {
        //  清空已上传列表
        this.$refs.uploadRef.clearFiles()
        this.userImageUrl = ''
        this.fileListName = []
        this.fileListArry = []
      },
      fileFieldMatch(res, file) {
        // 文件上传列表维护
        this.fileListArry.push(res.Data)
      },
      /**
       * 上传文件列表 默认图片预览
       * @param fileType
       */
      fileIconMatch(fileType) {
        let df = '/static/img/fileTypeIcon/file.png' // 上传文件列表默认预览图标
        if (fileType.includes('xls')) {
          df = '/static/img/fileTypeIcon/excel.png'
        }
        if (fileType.includes('ppt')) {
          df = '/static/img/fileTypeIcon/ppt.png'
        }
        if (fileType.includes('doc')) {
          df = '/static/img/fileTypeIcon/word.png'
        }
        if (fileType.includes('pdf')) {
          df = '/static/img/fileTypeIcon/pdf.png'
        }
        if (fileType.includes('rar')) {
          df = '/static/img/fileTypeIcon/rar.png'
        }
        if (fileType.includes('zip')) {
          df = '/static/img/fileTypeIcon/zip.png'
        }
        if (fileType.includes('txt')) {
          df = '/static/img/fileTypeIcon/txt.png'
        }
        return df
      }
    },
    watch: {
      isFormalSubmit(val) {
        // 附件保存到正式目录
        if (val) {
          this.fileFormalSave() // 保存上传文件
        }
      },
      currentFiles(val) {
        // 初始化数据
        this.updateLoading = false // 清除loading
        this.dataReturn() // 初始化数据回填
      },
      uploadType(newVal, oldVal) {
        console.log(newVal, oldVal, 'uploadType')
      }
    },
    mounted() {
      this.dataReturn() // 初始化数据回填
    },
    created() {
      this.data = {
        data: JSON.stringify({
          token: this.userData.UserToken
        })
      }
    }
  }

</script>
