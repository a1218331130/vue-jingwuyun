<template>
<el-dialog v-draggable="dialogDraggableOptions" class="no-padding" :visible.sync="dialog" title="检索纪录" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <span slot="title" class="el-dialog__title">
    检索记录
    <pagination v-if="currentTab===0" class="pagenav" :count="count" :small="true" mode="prev,slot,next" :pagenav="pagenav" :nopage='true' @update:pagenav="val=>pagenav=val">
    </pagination>

    <pagination v-if="currentTab===1" class="pagenav" :count="batchCount" :small="true" mode="prev,slot,next" :pagenav="batchPagenav" :nopage='true' @update:pagenav="val=>batchPagenav=val">
    </pagination>
  </span>
  <div class="tabs">
    <div class="tabs__btn-box">
      <el-button :class="{current:currentTab===0}" type="" @click="currentTab=0">普通</el-button>
      <el-button :class="{current:currentTab===1}" type="" @click="currentTab=1">批量</el-button>
      <el-button :class="{current:currentTab===2}" type="" @click="currentTab=2">图片</el-button>
      <!-- 刷新按钮 -->
      <i :class="{'refresh-btn':true,'iconfont':iconFlag,'icon-refresh':iconFlag,'el-icon-loading':!iconFlag}" @click="refreshList" title="刷新"></i>
    </div>
    <div class="tabs__tab-box">
      <div v-show="currentTab===0" class="tab">
        <!--  @row-click="apply" -->
        <el-table @cell-mouse-enter="cellMouseEnter" :data="historyList" v-loading="loading" height="448">
          <el-table-column type="index" label="序号" align="center" width="50">
            <template scope="scope">
              {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
            </template>
</el-table-column>
<!-- <el-table-column label="序号" prop="id" width="45"></el-table-column> -->
<el-table-column label="关键字" class-name="text-left" width="170" align="center">
  <template scope="scope">
              <span class="keyword" @click="apply(scope.row)">{{scope.row.Keyword}}</span>
            </template>
</el-table-column>
<el-table-column label="类型" align="center" width="50">
  <template scope="scope">
              {{scope.row.SearchType==='全部'?'通用':scope.row.SearchType}}
            </template>
</el-table-column>
<el-table-column label="IP" prop="UserIP" align="center"></el-table-column>
<el-table-column label="日期" prop="CreateTime" align="center"></el-table-column>
<el-table-column label="检索时间" align="center">
  <template scope="scope">
              {{scope.row.SearchUseMs/1000}}秒
            </template>
</el-table-column>
<el-table-column label="操作" align="center" width="120">
  <template scope="scope">
              <el-button type="primary" size="mini" icon="search" @click="callResult(scope.row)">再搜一次</el-button>
            </template>
</el-table-column>
</el-table>
</div>
<div v-show="currentTab===1" class="tab">
  <el-table @cell-mouse-enter="cellMouseEnter" :data="batchList" v-loading.body="loading" height="448" style="width:100%;">
    <el-table-column type="index" label="序号" align="center" width="80">
      <template scope="scope">
              {{scope.$index + 1 + batchPagenav.limit * (batchPagenav.currentpage - 1)}}
            </template>
    </el-table-column>
    <!-- <el-table-column label="序号" prop="id" width="45"></el-table-column> -->

    <el-table-column label="文件名" prop="Filename" align="center"></el-table-column>
    <!-- //   -->
    <el-table-column label="开始时间" prop="StartTime" align="center"></el-table-column>
    <el-table-column label="状态" align="center" width="80">
      <template scope="scope">
              <el-tag v-if="scope.row.EndTime" type="success">完成</el-tag>
              <el-tag v-else type="warning">进行中</el-tag>
            </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="120">
      <template scope="scope">
              <el-button type="primary" size="mini" icon="search" @click="callResource(scope.row)">查看</el-button>
            </template>
    </el-table-column>
  </el-table>
</div>
<div v-show="currentTab===2" class="tab">
  <div class="image-box" v-loading.body="loading">
    <el-tooltip v-for="(item,i) in imageList" :key="i" placement="top">
      <div slot="content">
        操作人: {{item.username}}<br/> 文件名: {{item.by1}}<br/> 检索时间: {{item.gxsj}}
      </div>
      <div class="image-box__item">
        <div class="image-box__item__btn-remove" @click="removeHistoryItem(item.md5)"></div>
        <img class="image-box__item__image" :src="item.picurl" @click="jumpTo(`/analysis/image/${item.fjid}|${item.md5}`, true)">
      </div>
    </el-tooltip>
  </div>
</div>
</div>
</div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .tabs {
    &__btn-box {
      position: absolute;
      top: 7px;
      left: 120px;
      .el-button {
        background: #f6f6f6;
        width: 80px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        margin: 0; // border-bottom: 2px solid #fff; // 97cbff
        border-bottom: none;
        &.current,
        &:hover {
          background: #fff;
          color: #20a0ff;
          border-color: #20a0ff;
        }
      }
    }
  }

  .refresh-btn {
    padding: 5px 20px;
    cursor: pointer;
  }

  .keyword {
    cursor: pointer;
    color: #20a0ff;
    &:hover {
      text-decoration: underline;
    }
  }

  .pagenav {
    position: absolute;
    top: 6px;
    right: 45px;
    .btn-next,
    .btn-prev {
      background: transparent;
    }
    button.disabled {
      background: transparent;
    }
  }

  .image-box {
    height: 500px;
    &__item {
      width: 120px;
      height: 150px;
      margin: 10px;
      border: 0 solid #dedede;
      opacity: 0.8;
      display: inline-block;
      cursor: pointer;
      position: relative;
      &__image {
        width: 100%;
        height: 100%;
      }
      &__btn-remove {
        background: #ccc;
        font-family: element-icons!important;
        font-size: 12px;
        color: #fff;
        text-align: center;
        width: 24px;
        height: 24px;
        line-height: 24px;
        padding: 0;
        border: 0;
        border-radius: 0 0 0 10px;
        opacity: 0.8;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        &:before {
          content: "\E60C";
        }
        &:hover {
          background: red;
          color: #fff;
          opacity: 1;
        }
      }
      &:hover {
        opacity: 1;
      }
    }
  }

  .el-dialog__body {
    padding: 0;
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import { mapState } from 'vuex'
  import { GET_SEARCH_HIS_LOG, FETCH_BATCH_HISTORY, FETCH_ANALYSIS_IMAGE_HISTORY, REMOVE_ANALYSIS_IMAGE_HISTORY } from '../../store/types'
  import pagination from '../../widgets/pagination/pagination'
  // import dateFormat from '../../utils/dateFormat'
  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    data() {
      return {
        iconFlag: true, // 图标
        ptCount: 0,
        plCount: 0,
        currentTab: 0,
        count: 0,
        pagenav: {
          currentpage: 1,
          limit: 10
        },
        batchCount: 0,
        batchPagenav: {
          currentpage: 1,
          limit: 10
        },
        historyList: [],
        batchList: [],
        imageList: []
      }
    },
    props: ['dialog'],
    computed: {
      ...mapState(['search', 'analysisImage'])
    },
    watch: {
      pagenav: {
        handler: function(val, oldVal) {
          this.fetchHistoryList()
        },
        deep: true
      },
      batchPagenav: {
        handler: function(val, oldVal) {
          this.fetchBatchList()
        },
        deep: true
      },
      currentTab(val) {
        if (val === 0 && this.historyList.length === 0) {
          this.fetchHistoryList()
        }
        if (val === 1 && this.batchList.length === 0) {
          this.fetchBatchList()
        }
        if (val === 2 && this.imageList.length === 0) {
          this.fetchImageList()
        }
      },
      count(val) {
        this.ptCount = parseInt((val / 10) + 1)
      },
      batchCount(val) {
        this.plCount = parseInt(val / 10 + 1)
        console.log(this.plCount, 'this.plCount')
      }
    },
    methods: {
      refreshList() {
        this.iconFlag = false
        if (this.currentTab === 0) {
          this.fetchHistoryList()
        } else if (this.currentTab === 1) {
          this.fetchBatchList()
        } else if (this.currentTab === 2) {
          this.fetchImageList()
        }
      },
      initDialog() {
        this.pagenav.currentpage = 1
        this.currentTab = 0
        this.iconFlag = true
        // if(this.historyList.length === 0) {
        this.fetchHistoryList()
        // }
      },
      closeEvent() {
        this.$emit('close')
      },
      apply(row, e, c) {
        this.$emit('update:keyword', row, true)
      },
      fetchHistoryList() {
        if (this.checkRule('Search/GetSearchHisLog', true) === false) {
          return false
        }
        // 获取搜索历史纪录
        this.dispatch(GET_SEARCH_HIS_LOG, {
          PageIndex: this.pagenav.currentpage,
          PageSize: this.pagenav.limit
        }).then(() => {
          this.historyList = this.search.searchHisLog.PageData
          this.count = this.search.searchHisLog.DataCount
          this.iconFlag = true
        })
      },
      fetchBatchList() {
        this.dispatch(FETCH_BATCH_HISTORY, {
          PageIndex: this.batchPagenav.currentpage,
          PageSize: this.batchPagenav.limit
        }).then(() => {
          this.batchList = this.search.batchHistoryList.PageData
          this.batchCount = this.search.batchHistoryList.DataCount
          this.iconFlag = true
        })
      },
      fetchImageList() {
        this.dispatch(FETCH_ANALYSIS_IMAGE_HISTORY, { limit: 18 }).then(() => {
          this.imageList = this.analysisImage.historyList
          this.iconFlag = true
        })
      },
      removeHistoryItem(id) {
        this.$confirm('请确认是否删除该条历史记录?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_ANALYSIS_IMAGE_HISTORY, { id: id }).then(() => {
            this.fetchImageList()
          })
        }).catch(() => {})
      },
      callResource(data) {
        data.flag = true
        this.$emit('call:resource', { params: data })
      },
      callResult(item) {
        this.$emit('update:keyword', item)
      }
    },
    mounted() {}
  }

</script>
