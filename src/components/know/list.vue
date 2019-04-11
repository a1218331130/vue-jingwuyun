<template>
<el-row class="know-list" v-loading.body="loading" :gutter="15">
  <el-col class="know-list__normal" :span="18">
    <div class="box">
      <div class="box__title">{{cateName}}列表</div>
      <!-- <div class="box__content">
            分类简介分类简介分类简介分类简介
          </div> -->
      <div class="box__list list" style="position: relative">
        <div v-if="list.length > 0" class="list__item" v-for="d in list">
          <div class="list__item__title" @click="openDetail(d.KeyId)">{{d.Title}}</div>
          <div class="list__item__desc" @click="openDetail(d.KeyId)">{{d.Summary||'暂无摘要'}}</div>
          <div class="tags" style="width: 60%;">
            <span class="label-box-list_dl" v-for="k in getKeywordArray(d.Keyword)">{{k}}
               <span class="label-box-list-dl_after"></span>
            </span>
          </div>
          <div class="interactive">
            <div v-if="type==='1'">
              阅读数: {{d.ReadCount}}
              <!-- 点赞 -->
              <praise class="interactive__item" :id="d.KeyId" @update:success="query(pagenav.currentpage)"><i class=""></i> 点赞({{d.PraiseCount}})</praise>
              <!-- 收藏 -->
              <collect class="interactive__item" :id="d.KeyId" @update:success="query(pagenav.currentpage)"><i class="el-icon-star-off"></i> 收藏</collect>
              <!-- 评论 -->
              <span class="interactive__item" @click="openDetail(d.KeyId,true)"><i class=""></i> 评论({{d.CommentCount}})</span></div>
            <div v-if="type==='2'">
              <!-- 编辑 -->
              <span class="interactive__item" @click="edit(d.KeyId)"><i class="iconfont icon-brush"></i> 编辑</span>
              <!-- 删除 -->
              <span class="interactive__item" @click="remove(d.KeyId)"><i class="iconfont icon-trash"></i> 删除</span>
            </div>
            <div v-if="type==='3'"></div>
          </div>
        </div>
        <div v-if="list.length <= 0" class="empty" style="margin-left: -48px; margin-top: -50px;"></div>
      </div>
    </div>
    <div class="app-toolbar">
      <pagination :count="count" :pagenav="pagenav" @update:pagenav="val => this.pagenav = val"></pagination>
    </div>
  </el-col>
  <el-col :span="6">
    <div class="box">
      <div class="box__title">
        最新动态
      </div>
      <div class="box__content" style="position: relative; min-height: 150px;">
        <div class="box__content__item" v-if="knowNews.PageData.length > 0" v-for="d in knowNews.PageData" @click="openDetail(d.KeyId)">{{d.Title}}</div>
        <div v-if="knowNews.PageData.length <= 0" class="empty" style="margin-left: -48px; margin-top: -50px;"></div>
      </div>
    </div>
    <!-- <div class="box">
        <div class="box__title">
          消息推送
        </div>
        <div class="box__content">
          123
        </div>
      </div> -->
  </el-col>
</el-row>
</template>

<style lang="scss" scoped>
.know-list {
    height: calc(100vh - 60px - 50px);
    overflow: hidden;
    &__normal {
        height: 100%;
        overflow: hidden;
    }
    .box {
        background: #fff;
        height: calc(100% - 58px);
        margin: 0;
        overflow: hidden;
        &__list {
            height: calc(100% - 40px);
        }
        &__content {
            margin: 0;
        }
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { GET_STRATEGY_LIST, DEL_STRATEGY_BY_ID, GET_STRATEGY_NEWS_LIST } from '../../store/types'
import mixin from '../../utils/mixin'
import collect from './collect'
import praise from './praise'

import pagination from '../../widgets/pagination/pagination'

// import { tableFill } from '../../utils/util'

export default {
  mixins: [mixin],
  components: {
    praise,
    collect,
    pagination
  },
  data() {
    return {
      loading: false,
      icon: 'icon-police',
      count: 0,
      list: [],
      pagenav: {
        limit: 10,
        currentpage: 1
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'all'
    },
    params: Object
  },
  computed: {
    cateName() {
      let name = ''
      if (this.params.ListType === 2) {
        // 我的文章
        name = '我的文章'
      } else if (this.params.ListType === 3) {
        // 我的收藏
        name = '我的收藏'
      } else {
        // 分类列表
        name = this.params.CateName || '全部'
      }
      return name
    },
    ...mapState(['know', 'knowNews'])
  },
  watch: {
    type() {
      this.fetchList()
    },
    pagenav: {
      handler: function(val, oldVal) {
        this.fetchList()
      },
      deep: true
    }
  },
  methods: {
    /**
     * 执行查询
     * @param  {Number} [targetPage=1] [description]
     * @return {[type]}                [description]
     */
    query(targetPage = 1) {
      if (this.pagenav.currentpage === targetPage) {
        this.fetchList()
      } else {
        this.pagenav.currentpage = targetPage
      }
    },
    /**
     * 获取文章列表
     * @return {[type]} [description]
     */
    fetchList() {
      if (this.type === '2' || this.type === '3') {
        this.params.CateId = ''
        this.params.CateLevel = ''
      }
      this.params.Title = this.params.Keyword // 后端搜索键名比较奇怪, 先在这里处理, 前面步骤还是用Keyword
      this.params.PageIndex = this.pagenav.currentpage
      this.params.PageSize = this.pagenav.limit
      this.loading = true
      this.dispatch(GET_STRATEGY_LIST, this.params).then(() => {
        // tableFill(this.$, '.box', this.$('.box__list.list'))
        this.count = this.know.list.DataCount
        this.list = this.know.list.PageData
        this.loading = false
      });
    },
    getKeywordArray(data) {
      let arr = []
      if (data) {
        if (data.indexOf('/') !== -1) {
          arr = data.split('/')
        } else if (data.indexOf(' ') !== -1) {
          arr = data.split(' ')
        } else {
          arr = [data]
        }
      }
      return arr
    },
    /**
     * 修改按钮事件
     * @param  {String} [id=''] [description]
     * @return {[type]}         [description]
     */
    edit(id = '') {
      this.$emit('call:edit', {
        id: id
      });
    },
    /**
     * 删除文章
     * @param  {String} [id=''] [description]
     * @return {[type]}         [description]
     */
    remove(id = '') {
      this.$confirm('确认删除该知识?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dispatch(DEL_STRATEGY_BY_ID, {
          KeyId: id
        }).then(() => {
          this.$message({
            type: 'success',
            message: '知识已成功删除',
            showClose: true
          })
          this.query()
        });
      })
    },
    /**
     * 打开文章详情
     * @param  {String}  [id='']             [description]
     * @param  {Boolean} [goToComment=false] [是否跳转到评论区]
     * @return {[type]}                      [description]
     */
    openDetail(id = '', goToComment = false) {
      this.$emit('call:detail', {
        id: id,
        goToComment: goToComment
      });
    },
    /**
     * 点赞
     * @param  {String} [id=''] [description]
     * @return {[type]}         [description]
     */
    praise(id = '') {

    },
    /**
     * 收藏
     * @param  {String} [id=''] [description]
     * @return {[type]}         [description]
     */
    collect(id = '') {

    }
  },
  created() {

  },
  mounted() {
    this.query()

    // 最新动态列表
    this.dispatch(GET_STRATEGY_NEWS_LIST, {
      //   CateId: this.params.CateId, // 最新动态, 是取最新的所有文章, 而不是取当前分类
      //   CateLevel:'',
      Keyword: '',
      ListType: '1',
      OrderBy: '1',
      PageIndex: 1,
      PageSize: 10,
      BeginDate: '1900-01-01 00:00:00',
      EndDate: (new Date().getFullYear() + 1) + '-12-31 23:59:59'
    }).then();
  }
}
</script>
