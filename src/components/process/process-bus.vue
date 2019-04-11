<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :title="dialogTitle" :visible.sync="dialogVisible" size="middle">
    <el-form id="formService" :model="formService" :rules="rules" ref="formService" label-width="80px">

      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="流程业务" prop="Ywdm">
            <el-select v-model="formService.Ywdm" placeholder="请选择流程业务">
              <el-option v-for="item in ywdmOps" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流程图" prop="Lcid">
            <el-select v-model="formService.Lcid" placeholder="请选择操作类型">
              <el-option v-for="item in lcidOps" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item label="标题" prop="Title">
            <el-input v-model="formService.Title" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-form-item label="描述" prop="Note">
          <!-- <el-input type="textarea" v-model="formService.Note" auto-complete="off"></el-input> -->
          <UE ref="processBusEditor" v-model="formService.Note" :height="300" :transcode="true"></UE>
        </el-form-item>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item label="顺序" prop="Sequence">
            <el-input-number v-model="formService.Sequence" size="small" :min="1" :max="10000"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer t-center">
      <el-button @click="resetForm(formService)">取消</el-button>
      <el-button type="primary" @click="handleModify(formService)">确定</el-button>
    </div>
  </el-dialog>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar clearfix">
    <el-form :inline="true" class="app-search__form">
      <el-form-item label="关键字">
        <el-input placeholder="支持模糊查询" v-model="searchKeys.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
      </el-form-item>
      <!--<el-form-item>-->
      <!--<el-button type="primary" native-type="submit" @click="updateSevice()">刷新</el-button>-->
      <!--</el-form-item>-->
    </el-form>

    <div class="app-search__buttons">
      <el-button icon="plus" type="info" @click="handleUpdate">新增</el-button>
    </div>
  </div>
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border stripe @row-dblclick="handleUpdate" @selection-change="handleSelectionChange" :data="processBus.PageData">
      <!--<el-table-column type="selection" width="55"></el-table-column>-->
      <!--<el-table-column prop="id" width="100" label="服务编号"></el-table-column>-->
      <el-table-column prop="Title" width="200" class-name="text-left" label="标题"></el-table-column>
      <!--<el-table-column prop="Lcid" class-name="text-left" label="流程图"></el-table-column>-->
      <el-table-column prop="Ywdm" width="200" label="业务代码"></el-table-column>
      <el-table-column label="备注">
        <template scope="scope">
          <div v-html="decodeURIComponent(scope.row.Note)"></div>
        </template>
</el-table-column>
<el-table-column prop="NotDelete" width="100" label="系统流程">
  <template scope="scope" width="200">
          {{scope.row.NotDelete == '1' ? '√' : ''}}
          <!--{{scope.row.kfxy == 1 ? 'OAP协议(WebService)' : scope.row.kfxy == 2 ? 'HTTP POST' : scope.row.kfxy}}-->
        </template>
</el-table-column>
<el-table-column label="操作" width="220" align="center">
  <template scope="scope">
          <el-button size="small" icon="icon iconfont icon-brush" @click="handleUpdate(scope.row)" type="primary">编辑</el-button>
            <el-button size="small" icon="icon iconfont icon-trash" @click="handleRemove(scope.row)" type="danger">删除</el-button>
        </template>
</el-table-column>
</el-table>
</div>
<div class="app-toolbar">
  <el-row>
    <!--<el-col :span="4">-->
    <!--<el-button @click="handleMultiRemove()">批量删除</el-button>-->
    <!--</el-col>-->
    <el-col :span="24">
      <pagination :count="processBus.DataCount" :pagenav="{limit: pageSize,currentpage: processBus.PageIndex}" @update:pagenav="handlePageChange"></pagination>
    </el-col>
    <el-col :span="0"> </el-col>
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
    FETCH_PROCESS_BUS_LIST,
    GET_PROCESS_BUS_INFO,
    ADD_PROCESS_BUS,
    UPDATE_PROCESS_BUS,
    REMOVE_PROCESS_BUS,
    FETCH_PROCESS_FLOWCHART_ALL_LIST
  } from '../../store/types'
  //  import {
  //    SYNC_SERVICE_PATH
  //  } from '../../config'
  import mixin from '../../utils/mixin'
  import pagination from '../../widgets/pagination/pagination'
  import UE from '../../widgets/UEeditor/editor'

  import {
    tableFill
  } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      Tabs,
      UE
    },
    data() {
      return {
        dictList: null,
        tab: null,
        dialogVisible: false,
        lcidOps: [],
        ywdmOps: [],
        searchKeys: {
          name: ''
        },
        formService: {},
        rules: {
          Ywdm: [{
            required: true,
            message: '请选择流程业务',
            trigger: 'blur'
          }],
          Lcid: [{
            required: true,
            message: '请选择流程图',
            trigger: 'blur'
          }],
          Title: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }]
        },

        pageSize: 10,
        formLabelWidth: '105px'
      }
    },
    computed: {
      ...mapState(['users', 'processBus', 'processFlowchart']),
      dialogTitle() {
        return this.formService.KeyId ? '编辑流程业务' : '新增流程业务'
      }
    },
    methods: {
      initData() {
        // this.YwdmOps

        this.formService = {
          KeyId: '', // 唯一ID
          Lcid: '', // 流程ID
          Ywdm: '', // 业务类别代码（字典类型:LC_YWDM）
          Title: '', // 标题
          Note: '', // 备注
          Sequence: 0, // 顺序
          DeleteFlag: '', // 是否删除(0:正常,1:删除)
          Creator: '', // 创建人
          CreateTime: '', // 创建时间
          Updator: '', // 修改人
          UpdateTime: '', // 修改时间
          NotDelete: '' // 不能删除(0:能删[默认],1:不能删除)
        }

        if (this.$refs.processBusEditor) this.$refs.processBusEditor.setContent('')
      },
      loadData(page = 1, pageSize = 10) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_PROCESS_BUS_LIST, {
          PageIndex: page,
          PageSize: pageSize,
          Keyword: this.searchKeys.name
        })
      },
      handleSearch() {
        !this.loading && this.loadData(1, this.pageSize)
      },
      //      updateSevice() {
      //        this.$http.get(SYNC_SERVICE_PATH).then((r) => {
      //          if (r.body.Status === 1) {
      //            this.$message({
      //              duration: 1000,
      //              type: 'info',
      //              message: '服务总线数据同步成功!'
      //            });
      //          } else {
      //            this.$message({
      //              duration: 1000,
      //              type: 'warning',
      //              message: '服务总线同步异常,请重试！'
      //            });
      //          }
      //          this.loading = false
      //        })
      //      },
      handleUpdate(row) {
        this.dialogVisible = true;
        if (row && row.KeyId) {
          this.dispatch(GET_PROCESS_BUS_INFO, {
            KeyId: row.KeyId
          }, true).then(_ => {
            this.formService = { ...this.processBus.Model
            };
            if (this.$refs.processBusEditor) this.$refs.processBusEditor.setContent(this.formService.Note)
          })
        } else {
          this.initData();
        }
      },
      handleModify(formService) {
        this.$refs.formService.validate((valid) => {
          if (valid) {
            if (this.formService.KeyId) {
              // delete formService.cjsj;
              // delete formService.gxsj;
              this.dispatch(UPDATE_PROCESS_BUS, this.formService).then(_ => {
                this.loadData(1, this.pageSize)
                this.dialogVisible = false;
              })
            } else {
              this.dispatch(ADD_PROCESS_BUS, this.formService)
              this.dialogVisible = false;
            }
          } else {
            return false;
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //      handleMultiRemove() {
      //        const idsList = this.multipleSelection.map(item => item.id);
      //        const ids = idsList.join(',');
      //        if (ids.length === 0) {
      //          this.$message({
      //            type: 'info',
      //            message: '请勾选要删除的数据'
      //          })
      //        } else {
      //          this.confirm('是否确认批量删除？').then(_ => {
      //            this.dispatch(DELETESERVICE_BUS_BY_BATCH, {
      //              data: {
      //                ids: ids
      //              }
      //            }).then(_ => {
      //              this.$message({
      //                type: 'success',
      //                message: '批量删除成功!'
      //              })
      //              this.loadData()
      //            }).catch(_ => {
      //              this.$message({
      //                type: 'error',
      //                message: '批量删除失败!'
      //              })
      //            })
      //          }).catch(_ => {})
      //        }
      //      },
      handleRemove(row) {
        this.confirm('此操作将将永久删除该数据，是否继续？')
          .then(_ => {
            this.dispatch(REMOVE_PROCESS_BUS, {
              KeyId: row.KeyId
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
    created() {
      this.tab = {
        label: '流程业务管理',
        name: this.$route.path
      }
      this.loadData();
      this.getDict(['LC_YWDM']).then(res => {
        this.dictList = res;
        this.ywdmOps = this.dictList['LC_YWDM'];
        this.initData()
      });
      this.dispatch(FETCH_PROCESS_FLOWCHART_ALL_LIST).then(_ => {
        this.lcidOps = this.processFlowchart.FlowchartList.map(m => {
          return { label: m.Title, value: m.KeyId }
        })
      });
    }
  }

</script>
