<template>
  <div>
    <page-header title="菜单管理" :path="[{
          text: '首页',
          to: '/'
        }, {
          text: '系统管理',
          to: '/system'
        }, {
          text: '菜单管理'
        }]"></page-header>
    <el-tabs type="card" v-model="activePlatformIndex">
      <el-tab-pane v-for="(item, index) in platform.list"
                   :label="item.name"
                   :name="index.toString()"
                   :key="item.id"></el-tab-pane>
    </el-tabs>
    <div class="app-toolbar clearfix" style="padding-bottom: 0;">
      <el-form :inline="true" class="app-search__form">
        <el-form-item label="类型" porp="role">
          <el-select v-model="searchKeys.type">
            <el-option v-for="item in types"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" porp="role">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="app-search__buttons">
        <el-button icon="plus" type="info">新增</el-button>
      </div>
    </div>

    <el-table class="app-table"
              v-loading="loading"
              :data="menus.list"
              border
              stripe>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="type" label="类型" width="80">
        <template scope="scope">
          <el-tag v-if="scope.row.type==1" type="primary">目录</el-tag>
          <el-tag v-else-if="scope.row.type==2" type="success">链接</el-tag>
          <el-tag v-else-if="scope.row.type==3" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="parentName" label="父级名称"></el-table-column>
      <el-table-column prop="url" label="URL">
        <template scope="scope">
          <span v-if="scope.row.type==2">{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="right" label="权限编号">
        <template scope="scope">
          <span v-if="scope.row.type!=1">{{scope.row.right}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="80"></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>

<script>
  import { mapState } from 'vuex'
  import PageHeader from '../common/page-header.vue'
  import mixin from '../../utils/mixin'
  import { FETCH_PLATFORM, FETCH_MENUS } from '../../store/types'
  export default {
    mixins: [mixin],
    components: {
      PageHeader
    },
    data() {
      return {
        activePlatformIndex: '0',
        types: [{
          value: 1,
          label: '目录'
        }, {
          value: 2,
          label: '链接'
        }, {
          value: 3,
          label: '按钮'
        }],
        searchKeys: {
          type: ''
        }
      }
    },
    methods: {
      loadData(page = 1, limit = 15) {
        this.dispatch(FETCH_MENUS, {
          query: {
            page,
            limit,
            platformId: this.platform.list[Number.parseInt(this.activePlatformIndex)].id
          }
        })
      }
    },
    computed: {
      ...mapState(['menus', 'platform'])
    },
    watch: {
      activePlatformIndex(val) {
        this.loadData()
      }
    },
    created() {
      this.$store.dispatch(FETCH_PLATFORM, {query: {page: 1, limit: 3}})
        .then(_ => {
          if (this.platform.list && this.platform.list.length > 0) {
            this.loadData()
          }
        })
    }
  }
</script>
