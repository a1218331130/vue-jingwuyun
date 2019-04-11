<template>
<div class="sidebar">
  <div class="wrap-box">
    <card-header title="战法介绍"></card-header>
    <div class="wrap-box__content">
      <div class="" v-html="detail.content"></div>
      <hr>
      <div class="item-box">
        <el-row>
          <el-col :span="24">
            <div class="item">
              <div class="label">战法名称</div>
              <div class="value">{{detail.title}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="item">
              <div class="label">提供人</div>
              <div class="value">{{detail.author}}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="item">
              <div class="label">版本号</div>
              <div class="value">{{detail.version}}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="item">
              <div class="label">创建时间</div>
              <div class="value">{{detail.postTime}}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="item">
              <div class="label">单位</div>
              <div class="value">{{detail.org}}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <hr>
      <el-button-group class="interactive">
        <el-button :disabled="loading" @click="praiseCollection((detail.isCollection===false ? 1 : 2), 1)"><i :class="{iconfont:true, 'icon-like_fill':true, 'icon-like_xz':detail.isCollection===false}"></i> 收藏({{detail.collectionCount}})</el-button>
        <el-button :disabled="loading" @click="praiseCollection((detail.isPraise===false ? 1 : 2), 2)"><i :class="{iconfont:true, 'icon-praise_fill':true, 'icon-praise_xz':detail.isPraise===false}"></i> 点赞({{detail.praiseCount}})</el-button>
        <el-button><i class="iconfont icon-msg"></i> 评论({{detail.commentCount}})</el-button>
      </el-button-group>

      <loader-bar :action="loading"></loader-bar>
    </div>
  </div>
  <div class="wrap-box" style="margin-top:0;">
    <card-header title="留言评论"></card-header>
    <div class="wrap-box__comment-box">

      <el-form class="comment-box__form" :model="form">
        <el-form-item prop="comment">
          <el-input type="textarea" v-model="form.comment" placeholder="请输入评论内容"></el-input>
        </el-form-item>
        <el-button size="mini" icon="icon iconfont icon-msg" @click="submit">发布留言</el-button>
      </el-form>
      <hr>

      <div class="comment-box__comment" v-for="item in comments">
        <div class="comment-box__comment__image">
          <img v-if="userData.FacePicId!=='' && userData.FacePicId!==null" class="head-portrait" :src="fileBasePath + userData.FacePicId" />
          <data-image v-else class="head-portrait" :idCard="userData.UserSfz"></data-image>
        </div>
        <div class="comment-box__comment__wrap">
          <div class="comment-box__comment__name">{{userData.UserName}}</div>
          <div class="comment-box__comment__posttime">{{item.postTime}}</div>
          <div class="comment-box__comment__content">{{item.content}}</div>
        </div>
      </div>

      <pagination :count="count" :small="true" :pagenav="pagenav" @update:pagenav="val=>pagenav=val" align="right" mode="prev, pager, next"></pagination>

      <loader-bar :action="commentLoading"></loader-bar>
    </div>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .sidebar {
    height: 100%;
    overflow-y: auto;
    .wrap-box {
      margin-top: 10px;
      padding: 0 10px;
      &__comment-box {
        position: relative;
      }
      &__content {
        font-size: 12px;
        color: #666;
        line-height: 22px;
        padding: 10px 0;
        position: relative;
        p {
          text-indent: 2em;
          margin: 0 0 10px;
        }
        .item-box {
          .item {
            line-height: 30px;
            height: 30px;
            margin-bottom: 0;
            .label {
              color: #999;
              display: inline-block;
              &:after {
                content: ':';
              }
            }
            .value {
              color: #000;
              display: inline-block;
            }
          }
        }
        .interactive {
          float: none;
          .el-button {
            border: 0;
            padding-bottom: 0;
            .iconfont {
              font-size: 32px;
              display: block;
              &.icon-like_fill {
                color: #ff5555;
                &.icon-like_xz {
                  color: #999;
                }
              }
              &.icon-praise_fill {
                color: #1296db;
                &.icon-praise_xz {
                  color: #999;
                }
              }
              &.icon-msg {
                color: #8cbb19;
              }
            }
          }
        }
      }
      .comment-box {
        padding: 10px 0;
        &__comment {
          margin-top: 10px;
          padding-bottom: 5px;
          border-bottom: 1px dashed #ccc;
          display: flex;
          &__image {
            width: 45px;
            height: 45px;
            margin-right: 10px;
            overflow: hidden;
            border-radius: 100%;
            img {
              width: 100%;
              height: auto;
            }
          }
          &__wrap {
            width: 240px;
          }
          &__name {
            font-weight: bold;
            width: 40%;
            display: inline-block;
          }
          &__posttime {
            text-align: right;
            width: 51%;
            font-size: 12px;
            display: inline-block;
          }
          &__content {
            line-height: 20px;
            margin-top: 10px;
            display: block;
          }
        }
        &__form {
          text-align: right;
          margin-top: 10px;
          .el-button {
            color: #0099cc;
            border-color: #0099cc;
          }
        }
      }
      hr {
        border-style: dashed;
      }
    }
  }

  .loader--bar {
    background: rgba(255, 255, 255, .8);
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  // REMOVE_TACTICS_COMMENT
  import { GET_TACTICS_DETAIL, FETCH_TACTICS_COMMENT_LIST, ADD_TACTICS_COMMENT, TACTICS_PRAISE_COLLECTION } from '../../../store/types'

  import { clone } from '../../../utils/util'

  import pagination from '../../../widgets/pagination/pagination'
  import cardHeader from '../../../widgets/card-header/card-header'
  import loaderBar from '../../../widgets/loader/loader-bar.vue'
  import dataImage from '../../../widgets/data-image/data-image'
  import { DOWNLOAD_FILE_PATH } from '../../../config'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      'card-header': cardHeader,
      'loader-bar': loaderBar,
      dataImage
    },
    data() {
      return {
        id: null,
        commentLoading: false,
        count: 0,
        pagenav: { limit: 3, currentpage: 1 },
        comments: [],
        form: {
          comment: ''
        },
        detail: {
          title: '',
          author: '',
          content: '',
          postTime: '',
          org: '',
          version: '',
          collectionCount: '',
          praiseCount: '',
          commentCount: '',
          isPraise: false,
          isCollection: false
        }
      }
    },
    props: [],
    computed: {
      ...mapState(['tactics'])
    },
    watch: {
      pagenav: {
        handler() {
          if (this.commentLoading === false) {
            this.fetchCommentList()
          }
        },
        deep: true
      }
    },
    methods: {
      getDetail() {
        if (this.checkRule('zfsc/library/getinfo') === true) {
          this.loading = true
          this.id = this.$route.query.id
          this.dispatch(GET_TACTICS_DETAIL, {
            zfid: this.id
          }).then(() => {
            let d = clone(this.tactics.detail.tacticsLibraryEntity)
            this.detail = {
              title: d.zfbt || d.ZFBT,
              author: d.cjr || d.CJR,
              content: d.zfjs || d.ZFJS,
              postTime: d.xgsj || d.XGSJ,
              org: d.dwmc || d.DWMC,
              version: d.bbh || d.BBH,
              type: d.SSLX || '',
              collectionCount: d.sccs || d.SCCS,
              praiseCount: d.dzcs || d.DZCS,
              commentCount: d.plcs || d.PLCS,
              isPraise: d.DZSTATUS === '1',
              isCollection: d.SCSTATUS === '1'
            }
            // 图表模式
            if (d.XSLX === 'TB' || d.xslx === 'TB') {
              this.$emit('call:chart')
            }
            this.$emit('update:title', this.detail.title)
            this.loading = false
          })
          this.fetchCommentList()
        }
      },
      fetchCommentList() {
        if (this.checkRule('zfsc/comment/list') === true) {
          this.commentLoading = true
          this.dispatch(FETCH_TACTICS_COMMENT_LIST, {
            zfid: this.id,
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            this.comments = this.tactics.commentList.PageData.map(d => {
              return {
                name: d.plrname || d.PLRNAME,
                content: d.plnr || d.PLNR,
                image: '/static/img/testPersonImg.jpg',
                postTime: d.plsj || d.PLSJ
              }
            })
            this.count = this.tactics.commentList.DataCount
            this.commentLoading = false
          })
        }
      },
      submit() {
        if (this.checkRule('zfsc/comment/save') === true) {
          if (this.form.comment === '') {
            this.$alert('请输入评论内容', '温馨提示')
          } else {
            this.commentLoading = true
            this.dispatch(ADD_TACTICS_COMMENT, {
              zfid: this.id,
              plnr: this.form.comment
            }).then(() => {
              this.$message({
                type: 'success',
                message: '评论提交成功',
                showClose: true
              })
              this.form.comment = ''
              this.getDetail()
            })
          }
        }
      },
      praiseCollection(flag, type) {
        if (this.checkRule('zfsc/dzsc/handle') === true) {
          this.dispatch(TACTICS_PRAISE_COLLECTION, {
            zfid: this.id, // 战法id
            flag: flag, // 标识操作是添加或取消(1:添加 2:取消)
            type: type // 类型(1:收藏 2:点赞)
          }).then(() => {
            this.getDetail()
            // if(type === 1) {
            //   this.detail.isCollection = (flag === 1)
            // }
            // if(type === 2) {
            //   this.detail.isPraise = (flag === 1)
            // }
          })
        }
      }
    },
    created() {
      this.fileBasePath = DOWNLOAD_FILE_PATH
    },
    mounted() {
      this.getDetail()
    }
  }

</script>
