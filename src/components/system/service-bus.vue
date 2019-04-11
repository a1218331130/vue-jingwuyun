<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :title="dialogTitle" :visible.sync="dialogVisible" size="middle">
    <el-form id="formService" :model="formService" :rules="rules" ref="formService" label-width="120px">
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="服务名称" prop="name">
            <el-input v-model="formService.name" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请求别名" prop="qqbm">
            <el-input placeholder="http://host:port/区域名称/请求别名" v-model="formService.qqbm" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="主机" prop="host">
            <el-input v-model="formService.host" auto-complete="off"></el-input>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="应用地址" prop="yydz">
            <el-input v-model="formService.yydz" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="区域名称" prop="qumc">
            <el-input placeholder="http://host:port/区域名称/请求别名" v-model="formService.qumc" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="协议" prop="scheme">
            <el-input v-model="formService.scheme" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="开发语言" prop="kfyy">
            <el-input v-model="formService.kfyy" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务提供者" prop="fftgz">
            <el-input v-model="formService.fftgz" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="开发框架" prop="kfkj">
            <el-input placeholder="如： asp.net MVC5 ,Axis1.4" v-model="formService.kfkj" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作类型" prop="czlx">
            <el-select v-model="formService.czlx" placeholder="请选择操作类型">
              <el-option label="登录" value="0"></el-option>
              <el-option label="查询" value="1"></el-option>
              <el-option label="新增" value="2"></el-option>
              <el-option label="修改" value="3"></el-option>
              <el-option label="删除" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item label="数据来源" prop="sjly">
            <el-radio class="radio" v-model="formService.sjly" label="1">内部系统</el-radio>
            <el-radio class="radio" v-model="formService.sjly" label="2">外部系统</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开发协议" prop="kfxy">
            <el-radio class="radio" v-model="formService.kfxy" label="1">SOAP协议（WebService）</el-radio>
            <el-radio class="radio" v-model="formService.kfxy" label="2">Http Post</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="联系单位" prop="lxdw">
            <el-input v-model="formService.lxdw" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="lxr">
            <el-input v-model="formService.lxr" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="联系方式" prop="lxfs">
            <el-input v-model="formService.lxfs" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用返回类型" prop="yyfhlx">
            <el-radio class="radio" v-model="formService.yyfhlx" label="1">json</el-radio>
            <el-radio class="radio" v-model="formService.yyfhlx" label="2">xml</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="是否启用" prop="sfqy">
            <el-radio class="radio" v-model="formService.sfqy" label="1">是</el-radio>
            <el-radio class="radio" v-model="formService.sfqy" label="0">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否记录日志" prop="sfjlrz">
            <el-radio class="radio" v-model="formService.sfjlrz" label="1">是</el-radio>
            <el-radio class="radio" v-model="formService.sfjlrz" label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="ms">
        <el-input type="textarea" v-model="formService.ms" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer t-center">
      <el-button @click="resetForm(formService)">取消</el-button>
      <el-button type="primary" @click="handleModify(formService)">确定</el-button>
    </div>
  </el-dialog>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar clearfix">
    <el-form :inline="true" class="app-search__form">
      <el-form-item label="服务名称">
        <el-input placeholder="支持模糊查询" v-model="searchKeys.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="updateSevice()">刷新</el-button>
        <breifPopover contentId="f15708b5d5404b7d81a97cef9be9d7f1" style="padding-top:0px"></breifPopover>
      </el-form-item>
    </el-form>

    <div class="app-search__buttons">
      <el-button icon="plus" type="info" @click="handleUpdate">新增</el-button>
    </div>
  </div>
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border stripe @row-dblclick="handleUpdate" @selection-change="handleSelectionChange" :data="serviceBus.PageData">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="id" label="编号" align="center" width="80"></el-table-column>
      <el-table-column prop="name" class-name="text-left" label="服务名称"></el-table-column>
      <el-table-column prop="yydz" class-name="text-left" label="请求路径"></el-table-column>
      <el-table-column prop="qqbm" class-name="text-left" label="请求别名"></el-table-column>
      <el-table-column prop="kfyy" label="语言" align="center" width="80"></el-table-column>
      <el-table-column prop="kfxy" label="协议" align="center" width="120">
        <template scope="scope" width="200">
          {{scope.row.kfxy == 1 ? 'OAP协议(WebService)' : scope.row.kfxy == 2 ? 'HTTP POST' : scope.row.kfxy}}
        </template>
</el-table-column>
<el-table-column label="操作" width="140">
  <template scope="scope" width="120">
          <el-button size="small" icon="icon iconfont icon-brush" @click="handleUpdate(scope.row)" type="primary">编辑</el-button>
          <el-button size="small" icon="icon iconfont icon-trash" @click="handleRemove(scope.row)" type="danger">删除</el-button>
        </template>
</el-table-column>
</el-table>
</div>
<div class="app-toolbar">
  <el-row>
    <!-- <el-col :span="4">
        <el-button @click="handleMultiRemove()">批量删除</el-button>
      </el-col> -->
    <el-col :span="24">
      <pagination :count="serviceBus.DataCount" :pagenav="{limit: pageSize,currentpage: serviceBus.PageIndex}" @update:pagenav="handlePageChange"></pagination>
    </el-col>
  </el-row>
</div>
</div>
</template>

<style>


</style>

<script>
  import {
    mapState
  } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {
    FETCH_SERVICE_BUS,
    FETCH_SERVICE_BUS_BY_ID,
    ADD_SERVICE_BUS,
    UPDATE_SERVICE_BUS,
    DELETESERVICE_BUS_BY_ID,
    DELETESERVICE_BUS_BY_BATCH
  } from '../../store/types'
  import {
    SYNC_SERVICE_PATH
  } from '../../config'
  import mixin from '../../utils/mixin'
  import breifPopover from '../../widgets/brief-popover/brief-popover.vue'
  import pagination from '../../widgets/pagination/pagination'

  import {
    tableFill
  } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      breifPopover,
      Tabs
    },
    data() {
      return {
        tab: null,
        dialogVisible: false,
        searchKeys: {
          name: ''
        },
        formService: {},
        rules: {
          name: [{
            required: true,
            message: '请输入服务名称',
            trigger: 'blur'
          }],
          qqbm: [{
            required: true,
            message: '请输入请求别名',
            trigger: 'blur'
          }],
          host: [{
            required: true,
            message: '请输入主机',
            trigger: 'blur'
          }],
          yydz: [{
            required: true,
            message: '请输入应用地址',
            trigger: 'blur'
          }],
          qumc: [{
            required: true,
            message: '请输入区域名称',
            trigger: 'blur'
          }],
          scheme: [{
            required: true,
            message: '请输入协议',
            trigger: 'blur'
          }],
          kfyy: [{
            required: true,
            message: '请输入开发语言',
            trigger: 'blur'
          }],
          fftgz: [{
            required: true,
            message: '请输入服务提供者',
            trigger: 'blur'
          }],
          kfkj: [{
            required: true,
            message: '请输入开发框架',
            trigger: 'blur'
          }],
          czlx: [{
            required: true,
            message: '请选择操作类型',
            trigger: 'blur'
          }]
        },
        pageSize: 10,
        formLabelWidth: '105px'
      }
    },
    computed: {
      ...mapState(['users', 'serviceBus']),
      dialogTitle() {
        return this.formService.id ? '编辑服务总线' : '新增服务总线'
      }
    },
    methods: {
      loadData(page = 1, pageSize = 10) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_SERVICE_BUS, {
          PageIndex: page,
          PageSize: pageSize,
          Keyword: this.searchKeys.name
        })
      },
      handleSearch() {
        !this.loading && this.loadData(1, this.pageSize)
      },
      updateSevice() {
        this.$http.get(SYNC_SERVICE_PATH).then((r) => {
          if (r.body.Status === 1) {
            this.$message({
              duration: 1000,
              type: 'info',
              message: '服务总线数据同步成功!'
            });
          } else {
            this.$message({
              duration: 1000,
              type: 'warning',
              message: '服务总线同步异常,请重试！'
            });
          }
          this.loading = false
        })
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        if (row && row.id) {
          this.dispatch(FETCH_SERVICE_BUS_BY_ID, {
            ServiceId: row.id
          }, true).then(_ => {
            this.formService = { ...this.serviceBus.Model
            };
            console.log('this.formService', this.formService);
          })
        } else {
          this.formService = {
            id: '',
            name: '',
            ms: '',
            pkValue: '',
            sfqy: '1',
            sjly: '1',
            yydz: '',
            fftgz: '',
            kfyy: '',
            kfxy: '2',
            lxdw: '',
            lxr: '',
            yyfhlx: '1',
            qqbm: '',
            sfjlrz: '1',
            scbj: '1',
            host: '',
            cdid: '',
            scheme: '',
            czlx: '',
            qumc: ''
          }
        }
      },
      handleModify(formService) {
        this.$refs.formService.validate((valid) => {
          if (valid) {
            if (this.formService.id) {
              delete formService.cjsj;
              delete formService.gxsj;
              this.dispatch(UPDATE_SERVICE_BUS, {
                data: this.formService
              }).then(_ => {
                this.loadData(1, this.pageSize)
              })
            } else {
              this.dispatch(ADD_SERVICE_BUS, {
                data: this.formService
              })
            }
            this.dialogVisible = false;
          } else {
            return false;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleMultiRemove() {
        const idsList = this.multipleSelection.map(item => item.id);
        const ids = idsList.join(',');
        if (ids.length === 0) {
          this.$message({
            type: 'info',
            message: '请勾选要删除的数据'
          })
        } else {
          this.confirm('是否确认批量删除？').then(_ => {
            this.dispatch(DELETESERVICE_BUS_BY_BATCH, {
              data: {
                ids: ids
              }
            }).then(_ => {
              this.$message({
                type: 'success',
                message: '批量删除成功!'
              })
              this.loadData()
            }).catch(_ => {
              this.$message({
                type: 'error',
                message: '批量删除失败!'
              })
            })
          }).catch(_ => {})
        }
      },
      handleRemove(row) {
        this.confirm('此操作将将永久删除该数据，是否继续？')
          .then(_ => {
            this.dispatch(DELETESERVICE_BUS_BY_ID, {
              ServiceId: row.id
            }).then(_ => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadData()
            }).catch(_ => {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
          }).catch(_ => {})
      },
      handlePageChange(obj) {
        !this.loading && this.loadData(obj.currentpage, obj.limit)
      },
      handlePageSizeChange(size) {
        this.pageSize = size;
        !this.loading && this.loadData(1, size)
      },
      resetForm(formService) {
        this.dialogVisible = false;
        this.$refs.formService.resetFields();
      }
    },
    mounted() {
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    activated() {
      console.log(this.$route.name)
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.tab = {
        label: '系统服务总线',
        name: this.$route.path
      }
      this.loadData();
    }
  }

</script>
