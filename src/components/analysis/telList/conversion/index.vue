<template>
<div>
  <el-row class="el-row analysis-topbar">
    <el-col :span="20">
      <div class="tabs">
        <div class="tabs__item" :title="dataName.phone+'  '+dataName.name">
          {{dataName && dataName.phone ? (dataName.phone+'&nbsp&nbsp['+dataName.name+']'):''}}
        </div>
      </div>
    </el-col>
    <el-col :span="4" class="collap-col">
      <div class="collap-box pointer">
        <slot name="switchRightBarBtn"></slot>
      </div>
    </el-col>
  </el-row>
  <div class="app-toolbar">
    <!-- 查询条件 -->
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyWord" label="关键字">
        <el-input v-model="queryForm.keyWord" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="query">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="app-search__buttons">
      <el-button type="primary" icon="upload" @click="singleConversion">电信话单转化</el-button>
    </div>
  </div>

  <!-- 查询结果 -->
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" height="700px">
      <el-table-column type="index" label="序号" align="center" width="50px">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column label="文件名" align="center" width="150px">
  <template scope="scope">
    <a :href="fileUrl + scope.row.FileID" @click.stop :download="scope.row.Filename">{{scope.row.Filename}}</a>
  </template>
</el-table-column>
<el-table-column prop="Jzxm" label="机主姓名" align="center" width="80px"></el-table-column>
<el-table-column prop="Jzhm" label="机主号码" align="center" width="170px"></el-table-column>
<el-table-column prop="Jzhth" label="机主合同号" align="center" width="120px"></el-table-column>
<el-table-column prop="Ygxm" label="员工姓名" align="center"></el-table-column>
<el-table-column prop="Yggh" label="员工工号" align="center"></el-table-column>
<el-table-column prop="SheetCount" label="工作表数量" align="center"></el-table-column>
<el-table-column prop="CreateTime" label="创建时间" align="center"></el-table-column>
<el-table-column prop="Ms" label="描述" align="center"></el-table-column>
<el-table-column label="操作">
  <template scope="scope">
    <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="romve(scope.row)">删除</el-button>
    <a :href="fileUrl + scope.row.NewFileId" @click.stop :download="scope.row.NewFilename" title="下载">
      <el-button type="primary" size="mini" icon="icon iconfont icon-download">下载</el-button>
    </a>
  </template>
</el-table-column>
</el-table>
</div>
<!-- 分页栏 -->
<div class="app-toolbar">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>

<!-- 编辑模态窗 -->
<dialog-form :dialog="dialog" :id="target!==null ? target.id : ''" @close="dialog=false" @success="reload"></dialog-form>
</div>
</template>
<style scoped>
  .app-toolbar .el-form-item {
    margin-bottom: 0;
  }

  .tree-box {
    max-height: 270px;
    overflow: auto;
  }

  .tabs__item {
    color: rgba(32, 160, 225, 1);
    border: none;
    background-color: transparent;
  }

</style>
<script>
  import mixin from '../../../../utils/mixin'
  import { mapState } from 'vuex'
  import { GET_HDGL_HDZHS, DELETE_HDZH } from '../../../../store/types'
  import dialogForm from './editor-file'
  import pagination from '../../../../widgets/pagination/pagination'
  import { tableFill } from '../../../../utils/util'
  import { DOWNLOAD_FILE_PATH } from '../../../../config'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      dialogForm
    },
    data() {
      return {
        pagenav: {
          limit: 17,
          currentpage: 1
        },
        queryForm: {
          keyWord: ''
        },
        count: 0,
        list: [],
        dialog: false,
        target: null,
        fileUrl: DOWNLOAD_FILE_PATH
      }
    },
    computed: {
      ...mapState(['improt'])
    },
    props: ['dataName'],
    watch: {
      pagenav: {
        handler() {
          this.query()
        },
        deep: true
      }
    },
    methods: {
      reload() {
        this.dialog = false
        if (this.pagenav.currentpage === 1) {
          this.query()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      query() {
        this.dispatch(GET_HDGL_HDZHS, {
          KeyWord: this.queryForm.keyWord,
          PageSize: this.pagenav.limit,
          PageIndex: this.pagenav.currentpage
        }).then(() => {
          this.count = this.improt.getHdglHdzhs.DataCount
          this.list = this.improt.getHdglHdzhs.PageData
        })
      },
      singleConversion() {
        this.target = null
        this.dialog = true
      },
      romve(item) {
        this.$confirm('确定要删除这些选项?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(DELETE_HDZH, { ID: item.ID }).then(() => {
            this.$message({
              type: 'success',
              message: '选项删除成功',
              showClose: true
            })
            this.query()
          })
        })
      }
    },
    mounted() {
      this.query()
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    created() {}
  }

</script>
