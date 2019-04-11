<template>
<el-layout class="app-layout" :fit="true">
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>

  <!-- 侧边栏(分类树) -->
  <el-region :class="{'app-west': true, 'app-west--collapsed': isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false" v-loading.body="westLoading">
    <cat-tree class="cat-tree" @click="updateCat" @update:loading="v=>westLoading=v"></cat-tree>
  </el-region>

  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <!-- 查询条件 -->
    <div class="app-toolbar query-bar clearfix rel">
      <el-form :inline="true" v-model="queryForm" class="app-search__form">
        <el-form-item>
          <el-input v-model="queryForm.Keyword" placeholder="支持标题和内容模糊查询" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" @click.prevent="query">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="line-buttons">
        <span :class="'line-buttons__button'+ (queryForm.ListType==='1'||!queryForm.ListType?' line-buttons__button--current':'')" @click="typeChange('1')">{{queryForm.CateName || '全部'}}</span>
        <span :class="'line-buttons__button'+ (queryForm.ListType==='2'?' line-buttons__button--current':'')" @click="typeChange('2')">我的文章</span>
        <span :class="'line-buttons__button'+ (queryForm.ListType==='3'?' line-buttons__button--current':'')" @click="typeChange('3')">我的收藏</span>
      </div>
    </div>

    <el-row class="spc-box">
      <el-col :span="12" class="order-box">
        <span :class="'order-box__item'+(queryForm.OrderBy === '1' ? '--current' : '')" @click="orderChange('1')"><i class="iconfont icon-rili"></i> 发布时间排序</span>
        <span :class="'order-box__item'+(queryForm.OrderBy === '2' ? '--current' : '')" @click="orderChange('2')"><i class="iconfont icon-yuedu"></i> 阅读次数排序</span>
      </el-col>
      <el-col :span="12">
        <el-button class="btn-new" icon="plus" type="info" @click="add">新增</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <list ref="knowList" :type="queryForm.ListType" :params="queryForm" @call:edit="edit" @call:detail="detail"></list>

    <!-- 编辑模态窗 large/tiny-->
    <editor :id="targetId" :dialog="editDialog" :editmode="editMode" @close="editDialog=false" @success="closeAndReload"></editor>

    <!-- 详情模态窗 large/tiny-->
    <detail :id="targetId" :dialog="detailDialog" @close="closeAndReload"></detail>

  </el-region>

  <!-- <el-region class="app-south" slot="south" :zoom="false" :fixed="false" type="south">
    <span>技术支持：珠海市新德汇信息技术有限公司</span>
  </el-region> -->
</el-layout>
</template>

<style lang="scss" scoped>
.query-bar {
    padding: 0 15px;
}
.el-form-item {
    margin: 5px 10px 5px 0;
}
.spc-box {
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
    .btn-new {
        height: 30px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
        float: right;
    }
}

.app-west {
    background: #f1f1f1;
}
.app-center {
    overflow: hidden;
}
</style>


<script>
import TopBar from '../common/topbar/index.vue'
import mixin from '../../utils/mixin'

import catTree from './cat-tree'
import list from './list'
import editor from './editor'
import detail from './detail'

export default {
  mixins: [mixin],
  components: {
    TopBar,
    'cat-tree': catTree,
    list,
    editor,
    detail
  },
  data() {
    return {
      westLoading: false,
      isWestCollapsed: false,
      active: '',
      detailDialog: false,
      editDialog: false,
      editMode: 'add',
      targetId: '',
      queryForm: {
        CateName: '',
        CateId: '',
        CateLevel: '',
        Keyword: '', // 搜索关键字
        ListType: '1', // 1: 全部(默认), 2: 我的, 3: 收藏
        OrderBy: '1', // 1: 创建时间降序(默认), 2: 阅读次数降序
        BeginDate: '1900-01-01 00:00:00',
        EndDate: (new Date().getFullYear() + 100) + '-12-31 23:59:59'
      }
    }
  },
  computed: {},
  methods: {
    toggleWestCollapse() {
      this.isWestCollapsed = !this.isWestCollapsed
    },
    updateCat(treeRes) {
      if (treeRes.id !== this.queryForm.CateId) {
        this.queryForm.Keyword = ''
        this.queryForm.ListType = '1'
        this.queryForm.OrderBy = '1'
        this.queryForm.CateName = treeRes.name
        this.queryForm.CateId = treeRes.id
        this.queryForm.CateLevel = treeRes.level
        this.query()
      }
    },
    query() {
      this.$refs.knowList.query(1)
    },
    typeChange(target) {
      if (this.queryForm.ListType !== target) {
        if (target === '2' || target === '3') {
          this.queryForm.Keyword = ''
        }
        this.queryForm.ListType = target
        this.query()
      }
    },
    orderChange(target) {
      if (this.queryForm.OrderBy !== target) {
        this.queryForm.OrderBy = target
        this.query()
      }
    },
    /**
     * 新增按钮事件
     */
    add() {
      this.targetId = ''
      this.editMode = 'add'
      this.editDialog = true
    },
    edit(obj) {
      if (!obj.id) {

      } else {
        this.targetId = obj.id
        this.editMode = 'edit'
        this.editDialog = true
      }
    },
    closeAndReload() {
      this.$refs.knowList.query()
      this.detailDialog = false
      this.editDialog = false
    },
    detail(obj) {
      if (!obj.id) {

      } else {
        this.targetId = obj.id
        this.detailDialog = true
      }
    }
  },
  created() {
    this.active = this.$route.path
  },
  mounted() {}
}
</script>
