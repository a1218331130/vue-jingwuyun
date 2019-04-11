<template>
<div id="zsmbBox">
  <el-dialog v-draggable="dialogDraggableOptions" class="dialogBox" :title="dialogTitle" size="large--fixed" :visible.sync="dialogVisible">
    <el-form id="knowTemplate" :model="zsmbForm" :rules="rules" ref="zsmbForm">
      <el-form-item label="标题" prop="ZSKMBMC" :label-width="formLabelWidth">
        <el-col :span="12">
          <el-input v-model="zsmbForm.ZSKMBMC" auto-complete="off" :maxlength="20"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="排序" prop="SX" :label-width="formLabelWidth">
        <el-input :maxlength="5" style="width:80px;" v-model="zsmbForm.SX"></el-input>
      </el-form-item>
      <el-form-item label="标签" :label-width="formLabelWidth">
        <el-row :gutter="20">
          <el-col :span="6" style="padding-left: 0px;">
            <el-input v-model="bqOne" :maxlength="10"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="bqTwo" :maxlength="10"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="bqThree" :maxlength="10"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-col :span="19">
          <el-input type="textarea" v-model="zsmbForm.ZSKMS" :maxlength="30"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-table @cell-mouse-enter="cellMouseEnter" :data="zsmbForm.ZDDXXLIST" border class="dataBox">
          <el-table-column label="标题名称[必填]">
            <template scope="scope">
                <el-form-item :prop="`ZDDXXLIST.${scope.$index}.ZDZDMC`" :rules="{required:false, message:'必填',trigger:'blur'}">
                  <el-input v-model="scope.row.ZDZDMC" :maxlength="20"></el-input>
                </el-form-item>
              </template>
</el-table-column>
<el-table-column label="控件类型[必选]" width="150">
  <template scope="scope">
                <el-form-item :prop="`ZDDXXLIST.${scope.$index}.ZDZDLX`" :rules="{required:false, message:'必填',trigger:'blur'}">
                  <el-select v-model="scope.row.ZDZDLX" placeholder="请选择">
                    <el-option v-for="item in kjlxList" :key="item.value" :label="item.value" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
</el-table-column>
<el-table-column label="字典名称[必填]" width="120">
  <template scope="scope">
                <el-form-item :prop="`ZDDXXLIST.${scope.$index}.ZDXDM`" :rules="{required:false, message:'必填',trigger:'blur'}">
                  <el-input v-model="scope.row.ZDXDM" :maxlength="10"></el-input>
                </el-form-item>
              </template>
</el-table-column>
<el-table-column label="长度" width="70">
  <template scope="scope">
                <el-input v-model="scope.row.ZDZDCD"></el-input>
              </template>
</el-table-column>
<el-table-column label="顺序" width="70">
  <template scope="scope">
                <el-tooltip :disabled="isShow" content="要小于10且不重复" placement="top">
                  <el-input v-model="scope.row.ZSZDSX" @change="required(scope.row.ZSZDSX)" :maxlength="2"></el-input>
                </el-tooltip>
              </template>
</el-table-column>
<el-table-column label="必填" width="70">
  <template scope="scope">
                <el-checkbox v-model="scope.row.ZDSFBT"></el-checkbox>
              </template>
</el-table-column>
<el-table-column label="操作" width="70">
  <template scope="scope">
                <i class="el-icon-plus hand" v-if="scope.$index==0" @click="add"></i>
                <i class="el-icon-minus hand" v-if="scope.$index>0" @click="reduce(scope.$index)"></i>
              </template>
</el-table-column>
</el-table>
</el-form-item>
</el-form>
<div slot="footer" class="dialog-footer t-center">
  <el-button @click="resetForm(zsmbForm)">取消</el-button>
  <el-button type="primary" @click="handleModify(zsmbForm)">确定</el-button>
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
  </el-form>
  <div class="app-search__buttons">
    <el-button icon="plus" type="info" @click="handleUpdate()">新增</el-button>
  </div>
</div>
<div class="app-content-box">

  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" @selection-change="handleSelectionChange" border stripe :data="knowTemplate.PageData">
    <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
    <el-table-column prop="ZSKMBMC" label="模板名称"></el-table-column>
    <el-table-column prop="ZSKMS" label="描述信息"></el-table-column>
    <el-table-column prop="ZSKBQ" label="标签" width="250"></el-table-column>
    <el-table-column prop="ZHXGSJ" label="发布时间" align="center" width="150"></el-table-column>
    <el-table-column label="操作" align="center" width="220">
      <template scope="scope">
            <el-button size="small" icon="icon iconfont icon-brush" @click="handleUpdate(scope.row)" type="primary">编辑</el-button>
            <el-button size="small" icon="icon iconfont icon-trash" @click="handleRemove(scope.row)" type="danger">删除</el-button>
          </template>
    </el-table-column>
  </el-table>
</div>
<div class="app-toolbar tool-pagination">
  <pagination :count="knowTemplate.DataCount" :pagenav="{limit: pageSize,currentpage: knowTemplate.PageIndex}" @update:pagenav="handlePageChange"></pagination>
</div>
</div>
</template>
<style>
  .t-center {
    text-align: center;
  }

  #zsmbBox .app-toolbar {
    height: 36px;
  }

  .le-row .el-col:first-child {
    padding-left: 0px;
  }

  .dialogBox {
    min-width: 1500px;
  }

  .dialogBox .el-table .cell,
  .el-table th>div {
    padding-left: 10px;
    padding-right: 10px;
  }

  .hand {
    cursor: pointer;
  }

</style>
<script>
  import {
    mapState
  } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {
    ZSK_MBB_GET_PAGE_LIST,
    ZSK_MBB_GET_DATA,
    ZSK_MBB_DEL,
    ZSK_MBB_ADD,
    ZSK_MBB_EDIT
  } from '../../store/types'
  import mixin from '../../utils/mixin'
  import pagination from '../../widgets/pagination/pagination'

  import {
    tableFill
  } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      Tabs
    },
    data() {
      return {
        isIndeteminate: true,
        dialogVisible: false,
        tab: null,
        fileList: [],
        isShow: true,
        // data: {
        //   data: {
        //     token: this.userData.UserToken
        //   }
        // },
        searchKeys: {
          name: ''
        },
        bqOne: '',
        bqTwo: '',
        bqThree: '',
        kjlxList: [{
          label: 'text',
          value: 'text'
        }, {
          label: 'textarea',
          value: 'textarea'
        }, {
          label: 'select',
          value: 'select'
        }],
        rules: {
          ZSKMBMC: [{
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }]
        },
        zsmbForm: {
          ZSKMBMC: '',
          ZSKBQ: '',
          ZSKMS: '',
          SX: 0,
          ZDDXXLIST: [{
            ZSKZDID: '',
            ZDZDMC: '',
            ZDZDL: '',
            ZDZDLX: '',
            ZDXDM: '',
            ZDZDCD: '',
            ZDSFBT: false,
            ZSZDSX: ''
          }]
        },
        ZDDXXLIST: {
          ZSKZDID: '',
          ZDZDMC: '',
          ZDZDL: '',
          ZDZDLX: '',
          ZDXDM: '',
          ZDZDCD: '',
          ZDSFBT: false,
          ZSZDSX: ''
        },
        pageSize: 10,
        formLabelWidth: '120px'
      }
    },
    computed: {
      ...mapState(['sysDictionary', 'users', 'knowTemplate']),
      dialogTitle() {
        return this.zsmbForm.ZSKMBID ? '编辑知识模板' : '新增知识模板'
      }
    },
    methods: {
      loadData(page = 1, pageSize = 10) {
        this.pageSize = pageSize;
        this.dispatch(ZSK_MBB_GET_PAGE_LIST, {
          PageIndex: page,
          PageSize: pageSize,
          Gjc: this.searchKeys.name
        })
      },
      required(index) {
        let arr = [];
        this.zsmbForm.ZDDXXLIST.forEach(function(value) {
          arr.push(value.ZSZDSX);
        })
        var show = arr.indexOf(index);
        if (index > 10 || show === 1) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      },
      handleSearch() {
        !this.loading && this.loadData(1, this.pageSize)
      },
      add() {
        if (this.zsmbForm.ZDDXXLIST.length === 10) {
          return false
        }
        this.zsmbForm.ZDDXXLIST.push({ ...this.ZDDXXLIST
        });
      },
      reduce(index) {
        this.zsmbForm.ZDDXXLIST.splice(index, 1);
      },
      handleUpdate(row) {
        if (row && row.ZSKMBID) {
          this.dispatch(ZSK_MBB_GET_DATA, {
            ZSKMBID: row.ZSKMBID
          }, true).then(_ => {
            this.zsmbForm = JSON.parse(JSON.stringify(this.knowTemplate.Model));
            if (this.zsmbForm.ZSKBQ !== null) {
              let mbArrs = this.zsmbForm.ZSKBQ.split('@');
              this.bqOne = mbArrs[0];
              this.bqTwo = mbArrs[1] ? mbArrs[1] : '';
              this.bqThree = mbArrs[2] ? mbArrs[2] : '';
            } else {
              this.bqOne = '';
              this.bqTwo = '';
              this.bqThree = '';
            }
            if (this.zsmbForm.ZDDXXLIST.length === 0) {
              // this.$store.commit('zsmbFormIncrement', this.ZDDXXLIST)
            }
          })
        } else {
          this.bqOne = '';
          this.bqTwo = '';
          this.bqThree = '';
          this.zsmbForm = {
            ZSKMBMC: '',
            ZSKBQ: '',
            ZSKMS: '',
            SX: 0,
            ZDDXXLIST: [{
              ZSKZDID: '',
              ZDZDMC: '',
              ZDZDL: '',
              ZDZDLX: '',
              ZDXDM: '',
              ZDZDCD: '',
              ZDSFBT: false,
              ZSZDSX: ''
            }]
          }
        }
        this.dialogVisible = true;
      },
      handleModify(zsmbForm) {
        let mbArrs = [];
        if (this.bqOne !== '') {
          mbArrs.push(this.bqOne);
        }
        if (this.bqTwo !== '') {
          mbArrs.push(this.bqTwo);
        }
        if (this.bqThree !== '') {
          mbArrs.push(this.bqThree);
        }
        this.zsmbForm.ZSKBQ = mbArrs.join('@');
        this.$refs.zsmbForm.validate((valid) => {
          if (valid) {
            if (this.zsmbForm.ZSKMBID) {
              this.dispatch(ZSK_MBB_EDIT, this.zsmbForm).then(_ => {
                this.loadData(1, this.pageSize)
              }).catch(e => {})
            } else {
              this.dispatch(ZSK_MBB_ADD, this.zsmbForm).then(_ => {
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
      handleRemove(row) {
        this.confirm('此操作将将永久删除该数据，是否继续？')
          .then(_ => {
            this.dispatch(ZSK_MBB_DEL, {
              ZSKMBID: row.ZSKMBID
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
      resetForm(zsmbForm) {
        this.dialogVisible = false;
        this.$refs.zsmbForm.resetFields();
      }
    },
    mounted() {
      console.log('this.userData', typeof this.userData.UserToken)
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
      // this.$store.commit('createNewZSMBModel')
      this.tab = {
        label: '知识模板',
        name: this.$route.path
      }
      this.loadData();
    }
  }

</script>
