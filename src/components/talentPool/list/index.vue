<!-- 排行榜 -->
<template>
<div class="pool-wrap">
  <div class="app-toolbar">
    <el-row>
      <el-col :span="12">
        人才库数据:
        <font color="#ff6600">{{talentPool.DataCount}}</font>
      </el-col>
      <el-col :span="12" class="text-right">
        <div class="ware-button-box">
          <el-button-group>
            <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="newEdit()" v-loading.fullscreen.lock="fullscreenLoading">添加
            </el-button>
            <el-button class="iconfont icon-fold" @click="switchToolbar" style="margin-left:15px">
            </el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
  </div>
  <div class="app-content">
    <div class="pool-box">
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border :data="talentPool.PageData">
        <el-table-column align="center" label="序号" type="index" width="100"></el-table-column>
        <el-table-column align="center" label="姓名" prop="Name" width="150"></el-table-column>
        <el-table-column label="单位" prop="Org"></el-table-column>
        <el-table-column label="部门" prop="Dept"></el-table-column>
        <el-table-column align="center" label="等级" prop="ZwLevel" width="100"></el-table-column>
        <el-table-column align="center" label="行政职务" prop="Post" width="200"></el-table-column>
        <el-table-column align="center" label="地区" prop="Area" width="100"></el-table-column>
        <el-table-column align="center" label="学历" prop="Xl" width="100"></el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template class="btn-box" scope="scope">
              <el-button type="primary" icon="icon iconfont icon-xiangqing" @click="goToDetail(scope.row.KeyId)">查看详情
              </el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <div class="app-toolbar">
    <pagination :count="pageInfo.count" :pagenav="{currentpage:pageInfo.currentpage,limit:pageInfo.limit||10}" @update:pagenav="updatePage"></pagination>
  </div>

  <dialogform :dialog='dialog' @close="dialog=false"></dialogform>
  右侧栏
  <side-right-box style="height:calc(100% - 147px); top:115px;" :unfoldHandle="unfoldT" @unfoldState="sideState">
    <right-toolbar title="查询列表" :params="filter" :options="filterOptions" @packup="packup" @update:params="searchSubmit"></right-toolbar>
  </side-right-box>
</div>
</template>

<style lang="scss" scoped>
.pool-wrap {
    width: 100%;
    overflow: hidden;
}

.app-content-box {
    padding: 0;
}
</style>

<script>
import mixin from '../../../utils/mixin'
import { mapState } from 'vuex'
import { FETCH_TALENT_POOL_LIST } from '../../../store/types'
import pagination from '../../../widgets/pagination/pagination'
import sideRightBox from '../../control/side-right-box.vue'
import rightToolbar from '../../../widgets/right-toolbar/right-toolbar.vue'
import { tableFill } from '../../../utils/util'
import dialogform from '../newPersonnel/dialog-form.vue'
export default {
  mixins: [mixin],
  components: {
    pagination,
    'side-right-box': sideRightBox,
    'right-toolbar': rightToolbar,
    dialogform
  },
  data() {
    return {
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 10,
        currentpage: 1
      },
      fullscreenLoading: false,
      dialog: false,
      count: 1,
      list: [],
      unfoldT: false,
      filter: {
        keyword: '',
        cat: '',
        type: '',
        date: '',
        sort: ''
      },
      filterOptions: [{
        title: '关键字',
        prop: 'keyword',
        type: 'input'
      }, {
        title: '职务',
        prop: 'type',
        type: 'radio',
        children: [
          { label: '刑警', value: '1' },
          { label: '交警', value: '2' },
          { label: '特警', value: '3' },
          { label: '铁警', value: '4' },
          { label: '巡警', value: '5' },
          { label: '武警', value: '6' },
          { label: '外警', value: '7' },
          { label: '林警', value: '8' },
          { label: '海警', value: '9' }
        ]
      }, {
        title: '等级',
        prop: 'cat',
        type: 'radio',
        children: [
          { label: '普通', value: '1' },
          { label: '高级', value: '2' },
          { label: '精英', value: '3' }
        ]
      }]
    }
  },
  computed: {
    ...mapState(['talentPool'])
  },
  watch: {},
  methods: {
    // 人才信息录入
    newEdit() {
      this.dialog = true;
      // setTimeout(() => {
      //   this.fullscreenLoading = true
      // }, 1000)
    },
    goToDetail(id) {
      this.pageInfo = {}
      this.$router.push('/talentPool/detail?id=' + id)
    },
    packup() {
      // 收起侧栏
      this.unfoldT = false
    },
    sideState(s) {
      // 窗体自身操作更新窗体状态
      this.unfoldT = s
    },
    searchSubmit(obj) {
      this.loadData(1,
        10,
        obj.keyword,
        obj.cat ? [obj.cat.toString()] : []);
      console.log('提交查询', obj)
      this.packup()
    },
    switchToolbar() {
      this.unfoldT = this.unfoldT === false
    },
    loadData(pageIndex = 1, pageSize = 11, key = '', Levels = []) {
      this.dispatch(FETCH_TALENT_POOL_LIST, {
        PageIndex: pageIndex,
        PageSize: pageSize,
        Keyword: key,
        Levels: Levels
      }).then(() => {
        this.pageInfo.count = this.talentPool.DataCount
        this.pageInfo.currentpage = this.talentPool.PageIndex
        this.pageInfo.limit = this.talentPool.PageSize
      });
    },
    updatePage(data) {
      console.log('updatePage', data)
      this.loadData(data.currentpage, data.limit);
    }
  },
  created() {},
  mounted() {
    this.loadData();
    tableFill(this.$, '.pool-box', false, this.$(window).height() - 60 - 110)
  }
}
</script>
