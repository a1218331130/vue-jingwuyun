<!-- 战法仓库 -->
<template>
<div slot="center" class="tactics-box" v-loading.body="loading">
  <div class="app-toolbar top">
    <el-row>
      <el-col :span="12">
        收藏数:
        <font color="#ff6600">{{this.count}}条</font>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-form v-on:submit.prevent>
          <el-form-item style="margin:0;">
            <el-input v-model="keyword" placeholder="通过战法名称搜索" style="width:200px;"></el-input>
            <el-button type="primary" native-type="submit" @click.prevent="reload" icon="search" style="vertical-align: baseline; padding:0 5px; height:30px; line-height:30px;">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
  <el-row class="ware-list-wrap">
    <!-- v-for="cat in list" :key="cat.id" -->
    <el-col class="ware-list" :span="24">
      <!-- <div class="ware-list__title" v-show="type!==1">
        <div class="ware-list__title__text">{{(type===2?cat.name:cat.cat)}}</div>
        <div class="ware-list__title__count">{{cat.count}}条</div>
      </div> -->
      <el-row :gutter="20">
        <el-col :span="miniModel===true?8:6" v-for="item in list" :key="item.id">
          <div class="ware-list__item">
            <div class="ware-list__item__tag">{{item.tag}}</div>
            <el-row :gutter="10">
              <el-col :span="7">
                <div class="ware-list__item__image">
                  <img :src="'/static/img/res/'+item.icon" />
                </div>
              </el-col>
              <el-col :span="17">
                <div class="ware-list__item__title">
                  {{item.title}}
                </div>
                <div class="ware-list__item__desc">
                  {{item.desc}}
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="10">
                <div class="ware-list__item__count">
                  使用次数: {{item.count}}
                </div>
              </el-col>
              <el-col :span="14">
                <div class="ware-list__item__interactive">
                  <el-row>
                    <el-col :span="8">
                      点赞(
                      <span>{{item.praiseCount}}</span>)
                    </el-col>
                    <el-col :span="8">
                      收藏(
                      <span>{{item.collectionCount}}</span>)
                    </el-col>
                    <el-col :span="8">
                      评论(
                      <span>{{item.commentCount}}</span>)
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>

            <div class="ware-list__item__meta">
              <div class="ware-list__item__meta__author">
                创建者: {{item.author}}
              </div>
              <div class="ware-list__item__meta__post-time">
                时间: {{item.postTime}}
              </div>
              <div class="ware-list__item__meta__org">
                创建单位: {{item.org}}
              </div>
            </div>

            <div class="ware-list__item__ctrl">
              <el-row>
                <el-col :span="12">
                  <el-button class="orange" @click="jumpTo(`/tactics/apply?id=${item.id}`,true)"><i class="iconfont icon-qidong"></i> 启动</el-button>
                </el-col>
                <el-col :span="12" class="text-right">
                  <el-button :class="{orange:item.isPraise===true,gray:item.isPraise===false}" @click="praiseCollection(item.id, (item.isPraise===false?1:2), 2)"><i class="iconfont icon-praise_fill"></i></el-button>
                  <el-button :class="{blue:item.isCollection===true,gray:item.isCollection===false}" @click="praiseCollection(item.id, (item.isCollection===false?1:2), 1)"><i class="iconfont icon-shoucang"></i></el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .app-toolbar.top {
    padding: 8px 15px;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_TACTICS_COLLECTION_LIST, TACTICS_PRAISE_COLLECTION } from '../../../store/types'

  import mixin from '../../../utils/mixin'

  import { fitSize } from '../../../utils/util'

  import pagination from '../../../widgets/pagination/pagination'

  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    data() {
      return {
        type: 1,
        miniModel: false,
        keyword: '',
        count: 0,
        pagenav: { currentpage: 1, limit: 20 },
        list: []
      }
    },
    computed: {
      ...mapState(['tactics'])
    },
    watch: {
      type() {

      },
      pagenav: {
        handler() {
          if (this.loading === false) {
            this.fetchList()
          }
        },
        deep: true
      }
    },
    methods: {
      reload() {
        if (this.pagenav.currentpage === 1) {
          this.fetchList()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      fetchList() {
        if (this.checkRule('zfsc/dzsc/sclist') === true) {
          this.dispatch(FETCH_TACTICS_COLLECTION_LIST, {
            keyword: this.keyword,
            zflx: '', // 战法类型
            type: '', // 警种
            date: '', // 生成日
            sort: '', // 排序（1：次数升序；2：次数降序；3：日期升序；4：日期降序）
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            this.list = this.tactics.collectionList.PageData.map((d, i) => {
              return {
                id: d.id || d.ID,
                icon: d.tbm || d.TBM,
                title: d.zfbt || d.ZFBT || d.zfmc || d.ZFMC || '暂无',
                desc: d.zfgy || d.ZFGY,
                img: (i < 10 ? '0' + (i + 1) : (i + 1)),
                tag: d.zfflmc || d.ZFFLMC || '暂无',
                count: d.sycs || d.SYCS,
                author: d.cjr || d.CJR,
                org: d.dwmc || d.DWMC,
                postTime: d.xgsj || d.XGSJ,
                type: d.SSLX,
                collectionCount: d.sccs || d.SCCS || 0,
                praiseCount: d.dzcs || d.DZCS || 0,
                commentCount: d.plcs || d.PLCS || 0,
                isPraise: d.dzStatus ? d.dzStatus === '1' : d.DZSTATUS === '1',
                isCollection: d.scStatus ? d.scStatus === '1' : d.SCSTATUS === '1'
              }
            })
            this.count = this.tactics.collectionList.DataCount
            this.loading = false
          })
        }
      },
      praiseCollection(id, flag, type) {
        if (this.checkRule('zfsc/dzsc/handle') === true) {
          this.dispatch(TACTICS_PRAISE_COLLECTION, {
            zfid: id, // 战法id
            flag: flag, // 标识操作是添加或取消(1:添加 2:取消)
            type: type // 类型(1:收藏 2:点赞)
          }).then(() => {
            this.fetchList()
          })
        }
      },
      fitEvent() {
        let res = fitSize(1380)
        this.miniModel = res.mini
      }
    },
    created() {},
    mounted() {
      this.fetchList()
      this.fitEvent()
      window.addEventListener('resize', (e) => {
        this.fitEvent()
      })
    }
  }

</script>
