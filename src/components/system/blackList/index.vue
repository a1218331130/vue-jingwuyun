  <template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handClick">
      <el-tab-pane label="草稿" name="draft" v-if="personType == 0 || personType == 2">
        <!-- 查询条件 -->
        <div class="app-toolbar">
          <el-form :inline="true" label-position="right" label-width="80px">
            <el-form-item prop="keyword" label="身份证号">
              <el-input v-model="queryForm.zjhm" placeholder="请输入身份证号码"></el-input>
            </el-form-item>
            <el-form-item prop="keyword" label="姓名">
              <el-input v-model="queryForm.xm" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item prop="keyword" label="警号">
              <el-input v-model="queryForm.jh" placeholder="请输入警号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" native-type="submit" @click.prevent="query">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="app-search__buttons">
            <el-button type="primary" icon="plus" @click="add">申请</el-button>
          </div>
        </div>
        <!-- 查询结果 -->
        <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" height="700px" @sort-change="sortChange">
      <el-table-column type="index" label="序号" align="center" width="50px">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
</el-table-column>
<el-table-column prop="name" label="姓名" align="center" width="150px" sortable="'custom'"></el-table-column>
<el-table-column prop="gender" label="性别" align="center" width="80px"></el-table-column>
<el-table-column prop="zjhm" label="证件号码" align="center"></el-table-column>
<el-table-column prop="cellphoneNum" label="手机号码" align="center" width="120px"></el-table-column>
<el-table-column prop="policeNum" label="警号" align="center"></el-table-column>
<el-table-column prop="position" label="职务" align="center"></el-table-column>
<el-table-column prop="dept" label="单位名称" align="center" sortable="'custom'"></el-table-column>
<el-table-column label="操作" width="260px">
  <template scope="scope">
    <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="edit(scope.row)">修改</el-button>
    <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="remove(scope.row)">删除</el-button>
    <el-button type="danger" size="mini" icon="icon iconfont icon-trash" @click="submitApply(scope.row)">提交申请</el-button>
  </template>
</el-table-column>
</el-table>
</div>
<!-- 分页栏 -->
<div class="app-toolbar">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>
</el-tab-pane>
<el-tab-pane label="审批中" name="approval" v-if="personType == 0 || personType == 2">
  <!-- 查询条件 -->
  <div class="app-toolbar">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="身份证号">
        <el-input v-model="queryForm.zjhm" placeholder="请输入身份证号码"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="姓名">
        <el-input v-model="queryForm.xm" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="警号">
        <el-input v-model="queryForm.jh" placeholder="请输入警号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="handClick({name:'approval'},null)">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 查询结果 -->
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" height="700px" @sort-change="sortChange">
      <el-table-column type="index" label="序号" align="center" width="50px">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="150px" sortable="'custom'"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center" width="80px"></el-table-column>
      <el-table-column prop="zjhm" label="证件号码" align="center"></el-table-column>
      <el-table-column prop="cellphoneNum" label="手机号码" align="center" width="120px"></el-table-column>
      <el-table-column prop="policeNum" label="警号" align="center"></el-table-column>
      <el-table-column prop="position" label="职务" align="center"></el-table-column>
      <el-table-column prop="dept" label="单位名称" align="center" sortable="'custom'"></el-table-column>
      <el-table-column prop="applyUsername" label="申请人" align="center"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" sortable="'custom'"></el-table-column>
      <!-- <el-table-column prop="status" label="申请状态" align="center">
        <template scope="scope">
          <span>{{scope.row.status === '1'?'审批中':''}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template scope="scope">
    <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="viewDetail(scope.row)">查看详情</el-button>
  </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页栏 -->
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav1" @update:pagenav="val=>pagenav1=val"></pagination>
  </div>
</el-tab-pane>
<el-tab-pane label="审批完成" name="approvalFinsh" v-if="personType == 0 || personType == 2">
  <!-- 查询条件 -->
  <div class="app-toolbar">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="身份证号">
        <el-input v-model="queryForm.zjhm" placeholder="请输入身份证号码"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="姓名">
        <el-input v-model="queryForm.xm" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="警号">
        <el-input v-model="queryForm.jh" placeholder="请输入警号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="handClick({name:'approvalFinsh'},null)">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 查询结果 -->
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" height="700px" @sort-change="sortChange">
      <el-table-column type="index" label="序号" align="center" width="50px">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="150px" sortable="'custom'"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center" width="80px"></el-table-column>
      <el-table-column prop="zjhm" label="证件号码" align="center"></el-table-column>
      <el-table-column prop="cellphoneNum" label="手机号码" align="center" width="120px"></el-table-column>
      <el-table-column prop="policeNum" label="警号" align="center"></el-table-column>
      <el-table-column prop="position" label="职务" align="center"></el-table-column>
      <el-table-column prop="dept" label="单位名称" align="center" sortable="'custom'"></el-table-column>
      <el-table-column prop="applyUsername" label="申请人" align="center"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" sortable="'custom'"></el-table-column>
      <!-- <el-table-column prop="status" label="申请状态" align="center">
        <template scope="scope">
          <span>{{scope.row.status === '2'?'审批完成':''}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template scope="scope">
    <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="viewDetail(scope.row)">查看详情</el-button>
  </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页栏 -->
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav2" @update:pagenav="val=>pagenav2=val"></pagination>
  </div>
</el-tab-pane>
<el-tab-pane label="待审批" name="trail" v-if="personType == 1 || personType == 2">
  <!-- 查询条件 -->
  <div class="app-toolbar">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="身份证号">
        <el-input v-model="queryForm.zjhm" placeholder="请输入身份证号码"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="姓名">
        <el-input v-model="queryForm.xm" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="警号">
        <el-input v-model="queryForm.jh" placeholder="请输入警号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="handClick({name:'trail'},null)">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="app-search__buttons">
      <el-button type="primary" icon="plus" @click="approvalAll()">批量审批</el-button>
    </div>
  </div>
  <!-- 查询结果 -->
  <div class="app-content-box">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" @sort-change="sortChange" @selection-change="selectionChange" height="700px">
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center" width="50px">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="150px" sortable="'custom'"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center" width="80px"></el-table-column>
      <el-table-column prop="zjhm" label="证件号码" align="center"></el-table-column>
      <el-table-column prop="cellphoneNum" label="手机号码" align="center" width="120px"></el-table-column>
      <el-table-column prop="policeNum" label="警号" align="center"></el-table-column>
      <el-table-column prop="position" label="职务" align="center"></el-table-column>
      <el-table-column prop="dept" label="单位名称" align="center" sortable="'custom'"></el-table-column>
      <el-table-column prop="applyUsername" label="申请人" align="center"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" sortable="'custom'"></el-table-column>
      <el-table-column prop="handleStatus" label="审批状态" align="center"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
    <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="approval(scope.row)">审批</el-button>
  </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页栏 -->
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav3" @update:pagenav="val=>pagenav3=val"></pagination>
  </div>
</el-tab-pane>
<el-tab-pane label="已审批" name="fishApproval" v-if="personType == 1 || personType == 2">
  <!-- 查询条件 -->
  <div class="app-toolbar">
    <el-form :inline="true" label-position="right" label-width="80px">
      <el-form-item prop="keyword" label="身份证号">
        <el-input v-model="queryForm.zjhm" placeholder="请输入身份证号码"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="姓名">
        <el-input v-model="queryForm.xm" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="keyword" label="警号">
        <el-input v-model="queryForm.jh" placeholder="请输入警号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" native-type="submit" @click.prevent="handClick({name:'fishApproval'},null)">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 查询结果 -->
  <div class="app-content-box mingdan">
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border :stripe="true" :data="list" height="700px" @sort-change="sortChange">
      <el-table-column type="index" label="序号" align="center" width="50px">
        <template scope="scope">
          {{scope.$index + 1 + pagenav.limit * (pagenav.currentpage - 1)}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="150px" sortable="'custom'"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center" width="80px"></el-table-column>
      <el-table-column prop="zjhm" label="证件号码" align="center"></el-table-column>
      <el-table-column prop="cellphoneNum" label="手机号码" align="center" width="120px"></el-table-column>
      <el-table-column prop="policeNum" label="警号" align="center"></el-table-column>
      <el-table-column prop="position" label="职务" align="center"></el-table-column>
      <el-table-column prop="dept" label="单位名称" align="center" sortable="'custom'"></el-table-column>
      <el-table-column prop="applyUsername" label="申请人" align="center"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center" sortable="'custom'"></el-table-column>
      <el-table-column prop="handleStatus" label="审批状态" align="center"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
    <el-button type="primary" size="mini" icon="icon iconfont icon-brush" @click="viewDetail(scope.row)">查看详情</el-button>
  </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 分页栏 -->
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav4" @update:pagenav="val=>pagenav4=val"></pagination>
  </div>
</el-tab-pane>
</el-tabs>
<!-- 编辑模态窗 -->
<dialog-form :dialog="editDialog" :title="title" :id="target!==null ? target.id : ''" @close="editDialog=false" @submit="success"></dialog-form>
<apply-dialog :dialog="applyDialog" @close="applyDialog=false" @submit="success"></apply-dialog>
<detail-dialog :dialog="detailDialog" :des="des" :idString="ids" :id="target!==null ? target.applyId : ''" @close="detailDialog=false" @success="reload"></detail-dialog>
</div>
</template>
<style>
  .app-content-box .el-table td{
     text-align: center;
  }

</style>
<style scoped>
  .app-toolbar .el-form-item {
    margin-bottom: 0;
  }

  .tree-box {
    max-height: 270px;
    overflow: auto;
  }

  .el-tabs {
    margin: 0px;
  }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { FETCH_DRAFT_LIST, DELETE_DRAFT, VIEW_APPROVAL_LIST, PENDING_LIST, JUDGMENT_USER } from '../../../store/types'
  import dialogForm from './dialog-form'
  import applyDialog from './apply-dialog'
  import detailDialog from './detail-dialog'
  import pagination from '../../../widgets/pagination/pagination'
  import { tableFill } from '../../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      dialogForm,
      applyDialog,
      detailDialog
    },
    data() {
      return {
        activeName: 'draft',
        personType: '2',
        count: 0,
        list: [],
        editDialog: false,
        applyDialog: false,
        detailDialog: false,
        target: null,
        pagenav: {
          limit: 17,
          currentpage: 1
        },
        pagenav1: {
          limit: 17,
          currentpage: 1
        },
        pagenav2: {
          limit: 17,
          currentpage: 1
        },
        pagenav3: {
          limit: 17,
          currentpage: 1
        },
        pagenav4: {
          limit: 17,
          currentpage: 1
        },
        queryForm: {
          zjhm: '',
          xm: '',
          jh: '',
          sortField: '',
          sortBy: ''
        },
        title: '',
        des: '',
        sortType: 'draft',
        checkedSelects: [],
        checkedSelectString: '',
        ids: '',
        role: ''
      }
    },
    computed: {
      ...mapState(['blackList'])
    },
    watch: {
      pagenav: {
        handler() {
          this.query()
        },
        deep: true
      },
      pagenav1: {
        handler() {
          this.handClick()
        },
        deep: true
      },
      pagenav2: {
        handler() {
          this.handClick()
        },
        deep: true
      },
      pagenav3: {
        handler() {
          this.handClick()
        },
        deep: true
      },
      pagenav4: {
        handler() {
          this.handClick()
        },
        deep: true
      }
    },
    methods: {
      handClick(tab, event) {
        this.list = []
        this.queryForm = {
          zjhm: '',
          xm: '',
          jh: ''
        }
        if (tab.name === 'approval') {
          this.sortType = 'approval';
          this.approvals();
        } else if (tab.name === 'approvalFinsh') {
          this.sortType = 'approvalFinsh';
          this.approvalFinshs();
        } else if (tab.name === 'trail') {
          this.sortType = 'trail';
          this.trails();
        }else if (tab.name === 'draft') {
          this.sortType = 'draft';
          this.query();
        } else {
          this.sortType = 'fishApproval';
          this.hastrails();
        }
      },
       // 排序
      sortChange(column) {
        console.log(column);
        this.queryForm = {
          zjhm: '',
          xm: '',
          jh: ''
        }
        if(column.prop == null) {
          this.queryForm.sortField = '';
          this.queryForm.sortBy = '';
        } else {
          this.queryForm.sortField = column.prop;
          if(column.order === 'ascending') {
            this.queryForm.sortBy = 'asc';
          } else {
            this.queryForm.sortBy = 'desc';
          }
        }
        if (this.sortType === 'approval') {
          this.approvals();
        } else if(this.sortType === 'approvalFinsh') {
          this.approvalFinshs();
        } else if(this.sortType === 'trail') {
          this.trails();
        } else if(this.sortType === 'draft') {
          this.query();
        } else if(this.sortType === 'fishApproval') {
          this.hastrails();
        }
      },
      hastrails() {
        this.dispatch(PENDING_LIST, {
          zjhm: this.queryForm.zjhm,
          name: this.queryForm.xm,
          policeNum: this.queryForm.jh,
          sortField: this.queryForm.sortField,
          sortBy: this.queryForm.sortBy,
          PageSize: this.pagenav4.limit,
          PageIndex: this.pagenav4.currentpage,
          type: '已审'
        }).then(() => {
          this.count = this.blackList.pendingList.DataCount
          this.list = this.blackList.pendingList.PageData
        })
      },
      trails() {
        this.dispatch(PENDING_LIST, {
          zjhm: this.queryForm.zjhm,
          name: this.queryForm.xm,
          policeNum: this.queryForm.jh,
          sortField: this.queryForm.sortField,
          sortBy: this.queryForm.sortBy,
          PageSize: this.pagenav3.limit,
          PageIndex: this.pagenav3.currentpage,
          type: '待审'
        }).then(() => {
          this.count = this.blackList.pendingList.DataCount
          this.list = this.blackList.pendingList.PageData
        })
      },
      approvalFinshs() {
        this.dispatch(VIEW_APPROVAL_LIST, {
          zjhm: this.queryForm.zjhm,
          name: this.queryForm.xm,
          policeNum: this.queryForm.jh,
          sortField: this.queryForm.sortField,
          sortBy: this.queryForm.sortBy,
          PageSize: this.pagenav2.limit,
          PageIndex: this.pagenav2.currentpage,
          status: '2'
        }).then(() => {
          this.count = this.blackList.viewApprovalList.DataCount
          this.list = this.blackList.viewApprovalList.PageData
        })
      },
      approvals() {
        this.dispatch(VIEW_APPROVAL_LIST, {
          zjhm: this.queryForm.zjhm,
          name: this.queryForm.xm,
          policeNum: this.queryForm.jh,
          sortField: this.queryForm.sortField,
          sortBy: this.queryForm.sortBy,
          PageSize: this.pagenav1.limit,
          PageIndex: this.pagenav1.currentpage,
          status: '1'
        }).then(() => {
          this.count = this.blackList.viewApprovalList.DataCount
          this.list = this.blackList.viewApprovalList.PageData
        })
      },
      reload() {
        this.detailDialog = false
        if (this.pagenav.currentpage === 1) {
          this.handClick({ name: 'trail' }, null)
        } else {
          this.pagenav.currentpage = 1
        }
      },
      success() {
        this.editDialog = false
        this.applyDialog = false
        if (this.pagenav.currentpage === 1) {
          this.query()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      query() {
        this.dispatch(FETCH_DRAFT_LIST, {
          zjhm: this.queryForm.zjhm,
          name: this.queryForm.xm,
          policeNum: this.queryForm.jh,
          sortField: this.queryForm.sortField,
          sortBy: this.queryForm.sortBy,
          PageSize: this.pagenav.limit,
          PageIndex: this.pagenav.currentpage
        }).then(() => {
          this.count = this.blackList.draftList.DataCount
          this.list = this.blackList.draftList.PageData
        })
      },
      ifShenQing() {
        this.dispatch(JUDGMENT_USER, {}).then((d) => {
          this.personType = this.blackList.judgmentUser;
          if(this.personType === 1) {
            // alert(this.personType);
            this.activeName = 'trail';
            this.trails();
          }else{
            this.activeName = 'draft';
            this.query();
          }
        })
      },
      add() {
        this.target = null
        this.applyDialog = true
      },
      edit(item) {
        this.title = 'edit'
        this.target = item
        this.editDialog = true
      },
      remove(item) {
        this.$confirm('确定要删除这些选项?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(DELETE_DRAFT, { id: item.id }).then(() => {
            this.$message({
              type: 'success',
              message: '选项删除成功',
              showClose: true
            })
            this.query()
          })
        })
      },
      submitApply(id) {
        this.title = 'apply'
        this.target = id
        this.editDialog = true
      },
      viewDetail(item) {
        this.des = 'detail'
        this.target = item
        this.detailDialog = true
      },
      approval(item) {
        this.des = 'approval'
        this.target = item
        this.detailDialog = true
      },
      approvalAll() {
        this.des = 'approvalAll'
        // this.target = item
        if(this.ids.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择审批条数',
            showClose: true
          })
        } else {
          this.detailDialog = true
        }
      },
      selectionChange(val) {
        this.checkedSelects = val;
        this.checkedSelectString = this.checkedSelects.join(',');
        this.ids = val.map(val => val['applyId']);
        console.log(this.ids.length, 'this.ids');
      }
    },
    mounted() {
      this.ifShenQing();
      tableFill(this.$, false, false, this.$(window).height() - 112)
      window.addEventListener('resize', (e) => {
        tableFill(this.$, false, false, this.$(window).height() - 112)
      })
    },
    created() {}
  }

</script>
