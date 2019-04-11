<template>
<div>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" size="large--fixed">
    <el-form id="message" :model="formMessage" :rules="rules" ref="formMessage">
      <el-form-item label="标题" prop="Title" :label-width="formLabelWidth">
        <el-input v-model="formMessage.Title" auto-complete="off" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="接收单位列表" :label-width="formLabelWidth">
        <template>
            <tree-dialog :data="treeData" v-model="checked" @check-change="handleChange"
                         :defaultProps="defaultProps"></tree-dialog>
          </template>
</el-form-item>
<el-form-item label="接收角色列表" :label-width="formLabelWidth">
  <el-checkbox-group v-model="selectRoleList" @change="handleCheckedRoleList">
    <el-checkbox v-for=" item in formRcvRoleList" :label="item.KeyId" :key="item.KeyId">{{item.DictName}}
    </el-checkbox>
  </el-checkbox-group>
</el-form-item>
<el-form-item :label-width="formLabelWidth" label="附件上传">
  <el-upload :show-file-list="true" :action="action" :data="data" :file-list="fileList" :before-upload="handleBeforeUpload" :on-error="handleError" :on-remove="handleRemoveFile" :on-progress="handleProgress" :on-success="handleSuccess">
    <el-button type="primary" icon="upload">上传文件</el-button>
  </el-upload>
</el-form-item>
<el-form-item :label-width="formLabelWidth" label="紧急程度">
  <el-radio class="radio" v-model="formMessage.Emergency" label="1">普通</el-radio>
  <el-radio class="radio" v-model="formMessage.Emergency" label="2">紧急</el-radio>
</el-form-item>
<el-form-item class="editorBox" prop="Content">
  <quill-editor :options="editorOptions" v-model="formMessage.Content"></quill-editor>
</el-form-item>
</el-form>
<div slot="footer" class="dialog-footer t-center">
  <el-button @click="resetForm(formMessage)">取消</el-button>
  <el-button type="primary" @click="handleModify(formMessage)">确定</el-button>
</div>
</el-dialog>
<el-dialog title="通知通告详情" :visible.sync="dialogDetailVisible">
  <el-row>
    <el-col class="t-center tilte">{{detailObject.Title}}</el-col>
    <el-col class="t-center CreatedTime"><span class="textName">发布时间：</span>{{detailObject.CreatedTime}} <span class="textName"> 发布人：</span>{{detailObject.CreatorName}}
    </el-col>
    <el-col class="detailBox" v-html="detailObject.Content">
    </el-col>
  </el-row>
  <div class="dialog-footer t-center">
    <el-button type="primary" class="return" @click="hideDetail()">返回</el-button>
  </div>
</el-dialog>
<tabs :tab="tab"></tabs>
<div class="app-toolbar clearfix">
  <el-form :inline="true" class="app-search__form">
    <el-form-item label="时间段">
      <el-date-picker v-model="timeSlot" type="daterange" :editable="false" format="yyyy-MM-dd" @change="dateRange()" placeholder="请选择时间范围">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="关键字">
      <el-input placeholder="支持模糊查询" v-model="searchKeys.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
    </el-form-item>
  </el-form>
  <div class="app-search__buttons">
    <el-button icon="plus" type="info" @click="handleUpdate()">新增</el-button>
  </div>
</div>
<div class="app-content-box">
  <el-table class="app-table" v-loading.body="loading" @selection-change="handleSelectionChange" border stripe @row-dblclick="showDetail" :data="message.PageData">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column type="index" label="序号" width="80"></el-table-column>
    <el-table-column prop="Title" class-name="text-left" label="标题"></el-table-column>
    <el-table-column prop="CreatorName" label="发布人" width="200"></el-table-column>
    <el-table-column label="状态" width="80">
      <template scope="scope">
            <span v-if="scope.row.Emergency==1">普通</span>
            <span v-if="scope.row.Emergency==2">紧急</span>
          </template>
    </el-table-column>
    <el-table-column prop="CreatedTime" label="发布时间" width="180"></el-table-column>
    <el-table-column label="详情" width="80">
      <template scope="scope">
            <span class="link" @click="showDetail(scope.row)">查看</span>
          </template>
    </el-table-column>
    <el-table-column label="操作" width="140">
      <template scope="scope">
            <el-button size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="small" @click="handleRemove(scope.row)" type="danger">删除</el-button>
          </template>
    </el-table-column>
  </el-table>
</div>
<div class="app-toolbar">
  <el-row>
    <el-col :span="4">
      <el-button @click="handleMultiRemove()">批量删除</el-button>
    </el-col>
    <el-col :span="20">
      <pagination :count="message.DataCount" :pagenav="{limit: pageSize,currentpage: message.PageIndex}" @update:pagenav="handlePageChange"></pagination>
    </el-col>
    <el-col :span="0"></el-col>
  </el-row>
</div>
</div>
</template>

<style>
  .detailBox {
    text-indent: 2em;
    line-height: 25px;
    height: 360px;
    padding: 0 20px;
    overflow-y: auto;
  }

  .tilte {
    margin: 20px 0 0px 0;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    color: #333333;
  }

  .CreatedTime {
    height: 30px;
    line-height: 30px;
    color: #666666;
  }

  .editorBox {
    height: 255px;
    overflow: hidden;
  }

  .quill-editor {
    height: 200px;
  }

  .el-tag.el-tag--primary .el-select__tags-text {
    width: 100%;
    overflow: hidden;
    dislay: inline-block;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }

  .el-upload-list {
    margin-top: 5px
  }

  .el-upload-list__item.is-success {
    width: 150px;
    float: left;
  }

  .el-upload-list__item:first-child {
    margin-top: 5px;
  }

</style>

<script>
  import TreeDialog from '../../widgets/tree-dialog/tree-dialog.vue'
  import {
    UPLOAD_PATH
  } from '../../config'
  import {
    quillEditor
  } from 'vue-quill-editor'
  import {
    mapState
  } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {
    FETCH_MESSAGE,
    FETCH_MESSAGE_BY_ID,
    EDIT_MESSAGE,
    ADD_MESSAGE,
    DEL_MESSAGES,
    GET_DEPT_DICTS,
    GET_ROLE_DICTS
  } from '../../store/types'
  import mixin from '../../utils/mixin'
  import editor from '../../utils/editorOptions'
  import ElTree from '../../../node_modules/element-ui/packages/tree/src/tree'
  import pagination from '../../widgets/pagination/pagination'
  //  import {listToTree} from '../../utils/listToTree'

  import {
    tableFill
  } from '../../utils/util'
  export default {
    mixins: [mixin, editor],
    components: {
      pagination,
      ElTree,
      Tabs,
      TreeDialog,
      quillEditor
    },
    data() {
      return {
        checked: [],
        treeData: [],
        defaultProps: {
          children: 'SonModels',
          label: 'DictName',
          id: 'KeyId'
        },
        isIndeteminate: true,
        dialogVisible: false,
        dialogDetailVisible: false,
        tab: null,
        action: UPLOAD_PATH,
        fileList: [],
        data: {
          data: JSON.stringify({
            token: this.userData.UserToken
          })
        },
        searchKeys: {
          name: ''
        },
        detailObject: {},
        timeSlot: '',
        formRcvDeptList: [],
        formRcvRoleList: [],
        selectRoleList: [],
        formMessage: {
          KeyId: '',
          Title: '',
          Content: '',
          Emergency: '1',
          FileDetail: [],
          RcvDeptList: [],
          RcvRoleList: []
        },
        rules: {
          Title: [{
            required: true,
            message: '请输入通知通告名称',
            trigger: 'blur'
          }],
          Content: [{
            required: true,
            message: '请输入通知通告内容',
            trigger: 'blur'
          }]
        },
        pageSize: 10,
        BeginDate: '',
        EndDate: '',
        formLabelWidth: '120px'
      }
    },
    computed: {
      ...mapState(['sysDictionary', 'users', 'message']),
      dialogTitle() {
        return this.formMessage.KeyId ? '编辑通知通告' : '新增通知通告'
      }
    },
    methods: {
      handleChange(val) {
        this.checked = val;
        // 接收列表
        let deptList = this.checked;
        let RcvDept = {};
        let RcvDeptList = [];
        deptList.forEach(function(value) {
          RcvDept['DeptId'] = value.KeyId;
          RcvDeptList.push(RcvDept);
          RcvDept = {};
        });
        this.formMessage.RcvDeptList = RcvDeptList;
      },
      handleIconClick(ev) {
        console.log('ev', ev);
      },
      dateRange() {
        this.BeginDate = this.timeSlot === '' ? this.timeSlot[0] : this.dateFormat(new Date(this.timeSlot[0]), 'yyyy-MM-dd');
        this.EndDate = this.timeSlot === '' ? this.timeSlot[1] : this.dateFormat(new Date(this.timeSlot[1]), 'yyyy-MM-dd');
      },
      handleCheckedRoleList(value) {
        console.log('value', value);
        if (value) {
          this.formMessage.RcvRoleList = value;
        } else {
          this.formMessage.RcvRoleList = this.selectRoleList;
        }
      },
      handleBeforeUpload(file) {
        console.log('before', file);
        return true;
      },
      handleError(err, file, fileList) {
        console.log('error', err);
      },
      handleProgress(e, file, fileList) {
        console.log('progress', e);
      },
      handleRemoveFile(file) {
        this.fileList = this.fileList.filter(item => {
          return item.uid !== file.uid
        })
        let fileList = this.fileList;
        fileList.forEach(function(value) {
          value.FileName = value.name;
          value.FilePath = value.url;
        });
        this.formMessage.FileDetail = fileList;
      },
      showDetail(row) {
        this.detailObject = row;
        this.dialogDetailVisible = true;
        console.log('row=====', this.detailObject);
      },
      hideDetail() {
        this.dialogDetailVisible = false;
      },
      handleSuccess(file) {
        this.fileList.push({
          name: file.Data[0].FileName,
          url: file.Data[0].FilePath,
          FileSize: file.Data[0].FileSize,
          FileType: file.Data[0].FileType,
          FileGuid: file.Data[0].FileGuid
        });
        let fileList = this.fileList;
        fileList.forEach(function(value) {
          value.FileName = value.name;
          value.FilePath = value.url;
        });
        this.formMessage.FileDetail = fileList;
      },
      loadData(page = 1, pageSize = 10) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_MESSAGE, {
          PageIndex: page,
          PageSize: pageSize,
          BeginDate: this.BeginDate,
          EndDate: this.EndDate,
          Keyword: this.searchKeys.name
        })
      },
      handleSearch() {
        !this.loading && this.loadData(1, this.pageSize)
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        this.dispatch(GET_DEPT_DICTS, {}, true).then(_ => {
          this.treeData = this.sysDictionary.DeptDicts[0].SonModels;
        })
        this.dispatch(GET_ROLE_DICTS, {}, true).then(_ => {
          this.formRcvRoleList = this.sysDictionary.RoleDicts;
        })
        if (row && row.KeyId) {
          this.dispatch(FETCH_MESSAGE_BY_ID, {
            KeyId: row.KeyId
          }, true).then(_ => {
            this.formMessage = {
              ...this.message.Model
            };
            let list = this.formMessage.FileDetail;
            list.forEach(function(value) {
              value.name = value.FileName;
              value.url = value.FilePath;
            });
            this.fileList = list;
            let selectRoleList = this.formMessage.RcvRoleList;
            let selectArr = [];
            selectRoleList.forEach(function(value) {
              selectArr.push(value.RoleId);
            });
            this.selectRoleList = selectArr;
            let RcvDeptList = this.formMessage.RcvDeptList;
            console.log('this.formMessage.RcvDeptList===99999', this.formMessage.RcvDeptList);
            this.checked = RcvDeptList.map(function(value) {
              return {
                KeyId: value.KeyId,
                DictName: value.DeptName
              };
            });
            console.log('this.checked', this.checked);
            this.handleCheckedRoleList();
          })
        } else {
          this.fileList = [];
          this.selectRoleList = [];
          this.checked = [];
          this.formMessage = {
            KeyId: '',
            Title: '',
            Content: '',
            Emergency: '1',
            FileDetail: [],
            RcvDeptList: [],
            RcvRoleList: []
          }
        }
      },
      // 用户角色
      handleModify(formMessage) {
        console.log();
        let roleList = this.formMessage.RcvRoleList
        let role = {};
        let RcvRoleList = [];
        roleList.forEach(function(value) {
          role['RoleId'] = value;
          RcvRoleList.push(role);
          role = {};
        });
        this.formMessage.RcvRoleList = RcvRoleList;
        this.$refs.formMessage.validate((valid) => {
          if (valid) {
            if (this.formMessage.KeyId) {
              this.dispatch(EDIT_MESSAGE, this.formMessage).then(_ => {
                this.loadData(1, this.pageSize)
              })
            } else {
              this.dispatch(ADD_MESSAGE, this.formMessage).then(_ => {
                this.loadData(1, this.pageSize)
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
        const ids = this.multipleSelection.map(item => item.KeyId);
        if (ids.length === 0) {
          this.$message({
            type: 'info',
            message: '请勾选要删除的数据'
          })
        } else {
          this.confirm('是否确认批量删除？').then(_ => {
            this.dispatch(
                DEL_MESSAGES, {
                  MsgIdList: ids
                })
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '批量删除成功!'
                })
                this.loadData()
              })
              .catch(_ => {
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
            this.dispatch(
                DEL_MESSAGES, {
                  MsgId: row.KeyId
                })
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.loadData()
              })
              .catch(_ => {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                })
              })
          })
          .catch(_ => {})
      },
      handlePageChange(obj) {
        !this.loading && this.loadData(obj.currentpage, obj.limit)
      },
      handlePageSizeChange(size) {
        this.pageSize = size;
        !this.loading && this.loadData(1, size)
      },
      resetForm(formMessage) {
        this.dialogVisible = false;
        this.$refs.formMessage.resetFields();
      }
    },
    mounted() {
      tableFill(this.$)
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      this.tab = {
        label: '通知通告',
        name: this.$route.path
      }
      this.loadData()
    }
  }

</script>
