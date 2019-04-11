<template>
<div>
  <tabs :tab="tab"></tabs>

  <editor :dialog="editDialog" :editMode="editMode" @close="editDialog=false" :obj="obj"></editor>
  <detail :detailDialog="detailDialog" @close="detailDialog=false" :data="obj"></detail>

  <div class="app-toolbar clearfix" style="">
    <div class="app-search__buttons">
      <el-button icon="plus" type="info" @click="add()">新增</el-button>
    </div>
    <div class="search-bar">
      <el-input placeholder="输入关键字搜索" v-model="navKeyword" class="search-input">
        <el-button slot="append" icon="search" @click="loadData"></el-button>
      </el-input>
    </div>
  </div>
  <div class="app-content-box">
    <el-table class="app-table" v-loading.body="loading" border stripe @row-dblclick="showDetail" :data="list">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="name" label="系统名称" width="200"></el-table-column>
      <el-table-column prop="area" label="单位" width="150"></el-table-column>
      <el-table-column prop="link" label="系统连接"></el-table-column>
      <el-table-column prop="label" label="系统级别" align="center" width="80"></el-table-column>
      <el-table-column prop="secretKey" label="密钥" align="center" width="80"></el-table-column>
      <el-table-column prop="clicks" label="点击数" align="center" width="80"></el-table-column>
      <el-table-column prop="collectNum" label="收藏数" align="center" width="80"></el-table-column>
      <el-table-column prop="user" label="联系人" align="center" width="80"></el-table-column>
      <el-table-column prop="CreatedTime" label="创建时间" align="center" width="150"></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template scope="scope">
            <el-button size="small" type="primary" @click="edit(scope.row)"><i class="iconfont icon-brush"></i>编辑
            </el-button>
            <el-button size="small" type="danger" @click="del(scope.row)"><i class="iconfont icon-trash"></i>删除
            </el-button>
          </template>
</el-table-column>
</el-table>
</div>
<div class="app-toolbar">
  <pagination :count="pageInfo.count" :pagenav="{limit: pageInfo.limit,currentpage:pageInfo.currentpage}" @update:pagenav="handlePageChange"></pagination>
</div>
</div>
</template>

<style scoped>
  .search-bar {
    width: 415px;
  }

</style>

<script>
  import {
    mapState
  } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {
    FETCH_LISTINFO,
    REMOVE_XTZTC
  } from '../../store/types'
  import mixin from '../../utils/mixin'
  import editor from './nav/editor'
  import detail from './nav/detail'
  import pagination from '../../widgets/pagination/pagination'
  import {
    tableFill
  } from '../../utils/util'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      Tabs,
      editor,
      detail
    },
    data() {
      return {
        list: [],
        obj: {},
        navKeyword: '', // 搜索关键字
        editMode: 'add',
        targetId: '',
        editDialog: false,
        detailDialog: false,
        pageInfo: {
          count: 15,
          currentpage: 1,
          limit: 15
        }
      }
    },
    computed: {
      ...mapState(['applyXtztc'])
    },
    methods: {
      loadData() {
        this.dispatch(FETCH_LISTINFO, {
          xtmc: this.navKeyword,
          PageIndex: this.pageInfo.currentpage,
          PageSize: this.pageInfo.limit
        }).then(_ => {
          this.list = this.applyXtztc.PageData.map(c => {
            return {
              id: c.id,
              name: c.xtmc,
              grade: c.lxid,
              label: c.xtjb,
              link: c.xtlj,
              user: c.lxr,
              phone: c.lxdh,
              area: c.dw,
              desc: c.jj,
              clicks: c.djs,
              system: c.xtgn,
              xtmc: c.xtmc,
              lxmc: c.lxmc,
              isColle: c.sfsc1,
              collectNum: c.scs,
              CreatedTime: c.cjsj,
              webLogo: c.pic,
              secretKey: c.skey // 单点登录密钥
            }
          })
          this.pageInfo.count = this.applyXtztc.DataCount
        })
      },
      add() {
        this.targetId = ''
        this.editMode = 'add'
        this.editDialog = true
      },
      edit(obj) {
        this.targetId = ''
        this.editMode = 'edit'
        this.editDialog = true
        this.obj = obj
      },
      del(obj) {
        this.$confirm('确定要删除么?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_XTZTC, {
            ids: obj.id
          }).then(_ => {
            this.$message('删除成功!')
            this.loadData();
          })
        })
      },
      showDetail(obj) {
        this.obj = obj
        this.detailDialog = true
      },
      handlePageChange(obj) {
        this.pageInfo.currentpage = obj.currentpage;
        this.pageInfo.limit = obj.limit;
        !this.loading && this.loadData()
      }
    },
    mounted() {
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.loadData();
      this.tab = {
        label: '系统直通车管理',
        name: this.$route.path
      }
    }
  }

</script>
