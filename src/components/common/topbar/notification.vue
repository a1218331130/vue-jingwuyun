<template>
<div>
  <el-dialog class="notification" :visible.sync="dialog" title="" :modal-append-to-body="false" :append-to-body="true" :modal="false" :lock-scroll="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" size="bigest--fixed">
    <div class="title">信息服务</div>
    <div class="el-header">
      <el-input placeholder="请输入内容" v-model="searchValue">
        <el-button slot="append" icon="search" @click="search"></el-button>
      </el-input>
    </div>
    <div class="el-layout__middle">
      <div class="el-news">
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="typeChange">
          <el-menu-item index="0"><i class="el-icon-document"></i>
            <el-badge class="red-dot" :is-dot="systemCount['0'] > 0">通知通报</el-badge>
          </el-menu-item>
          <el-menu-item index="1"><i class="el-icon-document"></i>
            <el-badge class="red-dot" :is-dot="systemCount['1']  > 0">系统消息</el-badge>
          </el-menu-item>
          <el-menu-item index="2"><i class="el-icon-date"></i>
            <el-badge class="red-dot" :is-dot="systemCount['2']  > 0">工作提醒</el-badge>
          </el-menu-item>
          <el-menu-item index="3"><i class="el-icon-information"></i>
            <el-badge class="red-dot" :is-dot="systemCount['3']  > 0">精准布控</el-badge>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="el-region-center">
        <list ref="list" :noticeType="activeIndex" :keyword="keyword" @call:detail="callDetail" @call:click="clickDetail"></list>
      </div>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
  .el-region-center {
    height: 516px;
  }

  .el-news {
    .el-menu {
      background: #1166a2;
      &-item {
        height: 40px;
        width: 150px;
        line-height: 40px;
        text-align: left;
        color: #fff;
        border-bottom: 1px solid #115497;
        &:hover {
          background: #fff;
          color: #2f80c5;
          &[class^=el-icon-] {
            color: #2f80c5;
          }
        }
        &.is-active {
          background: #fff;
          color: #2f80c5;
          &[class^=el-icon-] {
            color: #2f80c5;
          }
        }
      }
    }
  }

  .detail {
    height: 516px;
  }

  .red-dot {
    height: 20px;
    line-height: 20px;
  }

  .tilte {
    margin: 20px 0 0;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #333333;
  }

  .return {
    margin-top: 10px;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import list from './notification/list.vue'
  import detail from './notification/notice-detail.vue'
  import { GET_TOTAL_UNREAD_COUNT, UPDATE_NEWS_STATE } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      list,
      detail
    },
    data() {
      return {
        readPageDialog: false,
        detailId: '',
        searchValue: '', // 搜索关键字
        activeIndex: '',
        isShow: 0,
        keyword: '',
        systemCount: {
          '0': 0, // 0:通知通告，
          '1': 0, // 1：系统消息，
          '2': 0, // 2：工作提醒，
          '3': 0 // 3：预警信息
        },
        pageSize: 10
      }
    },
    props: ['dialog', 'id', 'active'],
    computed: {
      ...mapState({
        unReadList: state => state.systemNew.GetTotalUnreadCount
      })
    },
    methods: {
      /**
       * 查询相关消息数据条数
       */
      getUnredCount() {
        this.dispatch(GET_TOTAL_UNREAD_COUNT).then(() => {
          this.unReadList.forEach(r => {
            this.systemCount[r.Type] = r.TotalCount
          })
        })
      },
      /**
       * 弹窗初始化回调
       */
      initDialog() {
        // 初始化分类未读信息条数
        this.getUnredCount()
        // this.activeIndex = '0'
        this.activeIndex = this.active || '0'
      },
      typeChange(key, keyPath) {
        this.readPageDialog = false
        this.searchValue = ''
        this.isShow = key;
        this.activeIndex = keyPath[0]
      },
      /**
       * 弹窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.activeIndex = ''
        this.$emit('close');
      },
      /**
       *  关键字搜索
       */
      search(keyword) {
        this.keyword = this.searchValue
      },
      /***
       * 显示列表详情
       * @param data
       * @constructor
       */
      callDetail(val) {
        this.detailId = val
        this.readPageDialog = true
      },
      clickDetail(val) {
        this.dispatch(UPDATE_NEWS_STATE, {
          KeyId: val,
          Id: val
        }).then(_ => {
          this.readed()
        })
      },
      /**
       * 关闭详情页面
       */
      closeDetail() {
        this.readPageDialog = false
        this.detailId = ''
      },
      readed() {
        this.$refs.list.reload()
        this.getUnredCount()
        this.$emit('call:readed')
      }
    },
    created() {}
  }

</script>
