<template>
<div id="zsmbBox">
  <el-dialog v-draggable="dialogDraggableOptions" class="dialogBox" :title="dialogTitle" :visible.sync="dialogVisible">
  </el-dialog>
  <tabs :tab="tab"></tabs>
  <div class="app-toolbar clearfix">
    <div class="app-search__buttons">
      <el-button icon="plus" type="info" @click="handleAdd()">新增</el-button>
    </div>
  </div>
  <div style="width:20%;float: left">
    <el-tree :data="zskflTreeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
  <div style="width:80%;float: left">
    <el-form id="knowTemplate" :model="zskFlForm" :rules="rules" ref="zskFlForm" :label-width="formLabelWidth">
      <el-form-item label="标题" prop="ZSFLMC">
        <el-input v-model="zskFlForm.ZSFLMC" auto-complete="off" :disabled="ZSFLMC_disabled" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="上级" prop="ZSFLMC">
        <el-select v-model="zssjflID2" placeholder="请选择" @:change="handleFlChange()" :disabled="ZSSJFLID_disabled">
          <el-option v-for="item in zskflTreeSelectData" :key="item.KeyId" :label="item.Tag + item.Name" :value="item.KeyId" :disabled="item.disabled"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="SX">
        <el-input :maxlength="5" style="width:80px;" v-model="zskFlForm.SX" :disabled="ZSSJFLID_disabled"></el-input>
      </el-form-item>
      <el-form-item label="标签">
        <el-row :gutter="20">
          <el-col :span="6" style="padding-left: 0px;">
            <el-input :maxlength="10" v-model="bqOne" :disabled="BQ1_disabled"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input :maxlength="10" v-model="bqTwo" :disabled="BQ2_disabled"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input :maxlength="10" v-model="bqThree" :disabled="BQ3_disabled"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="zskFlForm.ZSFLMS" :disabled="ZSFLMS_disabled" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item class="t-center">
        <el-button @click="resetForm(zskFlForm)" :disabled="btnCancel_disabled">取消</el-button>
        <el-button type="primary" @click="handleModify(zskFlForm)" :disabled="btnSubmit_disabled">确定</el-button>
        <el-button type="danger" @click="handleRemove(zskFlForm)" :disabled="btnDelete_disabled">删除</el-button>
      </el-form-item>
    </el-form>
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
  /*#zsmbBox .el-table .el-input__inner {*/
  /*border: none;*/
  /*}*/

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
  import { mapState } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {
    ZSK_FL_GET_TREE,
    ZSK_FL_GET_TREE_SELECT,
    ZSK_FL_GET_DATA,
    ZSK_FL_ADD,
    ZSK_FL_EDIT,
    ZSK_FL_DEL
  } from '../../store/types'
  import mixin from '../../utils/mixin'

  export default {
    mixins: [mixin],
    components: {
      Tabs
    },
    data() {
      return {
        isIndeteminate: true,
        dialogVisible: false,
        tab: null,
        fileList: [],
        isShow: true,
        data: {
          data: null
        },
        searchKeys: {
          name: ''
        },
        bqOne: '',
        bqTwo: '',
        bqThree: '',
        rules: {
          ZSKMBMC: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ]
        },
        ZSFLMC_disabled: false,
        ZSSJFLID_disabled: false,
        BQ1_disabled: false,
        BQ2_disabled: false,
        BQ3_disabled: false,
        ZSFLMS_disabled: false,
        btnCancel_disabled: false,
        btnSubmit_disabled: false,
        btnDelete_disabled: false,
        zskFlForm: {
          ZSFLID: '', // 主键
          ZSKMBID: '', // 模版表主键
          ZSFLMC: '', // 分类名称
          ZSSJFLID: '', // 上级分类主键
          ZSFLBQ: '', // 标签
          ZSFLMS: '', // 描述
          SFSC: '', // 是否删除
          CJSJ: '', // 创建时间
          CJRID: '', // 创建人ID
          CJRXM: '', // 创建人姓名
          ZHXGSJ: '', // 最后修改时间
          ZHXGRID: '', // 最后修改人ID
          ZHXGRXM: '', // 最后修改人姓名
          BY1: '', // 备用1
          BY2: '', // 备用2
          BY3: '', // 备用3
          SX: 9999 // 顺序
        },
        zskFlFormcopy: this.zskFlForm,
        formLabelWidth: '120px',
        zskflTreeData: [],
        zskflTreeSelectData: [],
        defaultProps: {
          children: 'Children',
          label: 'Name'
        },
        zssjflIsMbId: false,
        zssjflID2: ''
      }
    },
    computed: {
      ...mapState(['sysDictionary', 'users', 'knowCate']),
      dialogTitle() {
        return this.zskFlForm.ZSFLID ? '编辑分类' : '新增分类'
      }
    },
    methods: {
      handleInitData() {
        // console.log('handleInitData');
        this.bqOne = '';
        this.bqTwo = '';
        this.bqThree = '';
        this.ZSFLMC_disabled = true;
        this.ZSSJFLID_disabled = true;
        this.BQ1_disabled = true;
        this.BQ2_disabled = true;
        this.BQ3_disabled = true;
        this.ZSFLMS_disabled = true;
        this.btnCancel_disabled = true;
        this.btnSubmit_disabled = true;
        this.btnDelete_disabled = true;
        this.zssjflID2 = '';
        this.zskFlForm = {
          ZSFLID: '', // 主键
          ZSKMBID: '', // 模版表主键
          ZSFLMC: '', // 分类名称
          ZSSJFLID: '', // 上级分类主键
          ZSFLBQ: '', // 标签
          ZSFLMS: '', // 描述
          SFSC: '', // 是否删除
          CJSJ: '', // 创建时间
          CJRID: '', // 创建人ID
          CJRXM: '', // 创建人姓名
          ZHXGSJ: '', // 最后修改时间
          ZHXGRID: '', // 最后修改人ID
          ZHXGRXM: '', // 最后修改人姓名
          BY1: '', // 备用1
          BY2: '', // 备用2
          BY3: '', // 备用3
          SX: 9999 // 顺序
        };
      },
      handleAdd() {
        // console.log('handleAdd');
        this.ZSFLMC_disabled = false;
        this.ZSSJFLID_disabled = false;
        this.BQ1_disabled = false;
        this.BQ2_disabled = false;
        this.BQ3_disabled = false;
        this.ZSFLMS_disabled = false;
        this.btnCancel_disabled = false;
        this.btnSubmit_disabled = false;
        this.btnDelete_disabled = false;
        this.zssjflID2 = '';
        this.zskFlForm = {
          ZSFLID: '', // 主键
          ZSKMBID: '', // 模版表主键
          ZSFLMC: '', // 分类名称
          ZSSJFLID: '', // 上级分类主键
          ZSFLBQ: '', // 标签
          ZSFLMS: '', // 描述
          SFSC: '', // 是否删除
          CJSJ: '', // 创建时间
          CJRID: '', // 创建人ID
          CJRXM: '', // 创建人姓名
          ZHXGSJ: '', // 最后修改时间
          ZHXGRID: '', // 最后修改人ID
          ZHXGRXM: '', // 最后修改人姓名
          BY1: '', // 备用1
          BY2: '', // 备用2
          BY3: '', // 备用3
          SX: 9999 // 顺序
        };
        this.btnDelete_disabled = true;
      },
      handleFlChange() {

      },
      loadTree() {
        // 加载左侧树结构数据
        this.dispatch(ZSK_FL_GET_TREE).then(_ => {
          this.zskflTreeData = JSON.parse(JSON.stringify(this.knowCate.Model));
        });
        // 加载下拉框数据
        this.dispatch(ZSK_FL_GET_TREE_SELECT).then(_ => {
          this.zskflTreeSelectData = JSON.parse(JSON.stringify(this.knowCate.Model));
        });
      },
      required(index) {
        let arr = [];
        this.zsmbForm.ZDDXXLIST.forEach(function(value) {
          arr.push(value.ZSZDSX);
        })
        var show = arr.indexOf(index);
        // console.log('show', show);
        if (index > 10 || show === 1) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      },
      handleIsMbid(val) {
        var len = this.zskflTreeData.length;
        for (var i = 0; i < len; i++) {
          if (this.zskflTreeData[i].KeyId === val) {
            return true;
          }
        }
        return false;
      },
      handleModify(zskFlForm) {
        //        let mbArrs = [];
        //        if (this.bqOne !== '') {
        //          mbArrs.push(this.bqOne);
        //        }
        //        if (this.bqTwo !== '') {
        //          mbArrs.push(this.bqTwo);
        //        }
        //        if (this.bqThree !== '') {
        //          mbArrs.push(this.bqThree);
        //        }
        // this.zskFlForm.ZSKBQ = mbArrs.join('@');
        this.$refs.zskFlForm.validate((valid) => {
          if (valid) {
            if (this.handleIsMbid(this.zssjflID2)) {
              // console.log('is mbid');
              this.zskFlForm.ZSSJFLID = '';
              this.zskFlForm.ZSKMBID = this.zssjflID2;
            } else {
              // console.log('is not mbid');
              if (this.zskFlForm.ZSFLID === this.zssjflID2) {
                this.$message({
                  type: 'error',
                  message: '上级分类不能是自己!'
                });
                return false;
              }
              this.zskFlForm.ZSSJFLID = this.zssjflID2;
            }
            // console.log(this.zskFlForm);

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
            this.zskFlForm.ZSFLBQ = mbArrs.join('@');

            if (this.zskFlForm.ZSFLID) {
              this.dispatch(ZSK_FL_EDIT, this.zskFlForm).then(_ => {
                // 初始化数据
                this.handleInitData();
                // 加载树结构
                this.loadTree();
              }).catch(e => {})
            } else {
              this.dispatch(ZSK_FL_ADD, this.zskFlForm).then(_ => {
                // 初始化数据
                this.handleInitData();
                // 加载树结构
                this.loadTree();
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
            this.dispatch(ZSK_FL_DEL, { ZSFLID: row.ZSFLID })
              .then(_ => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });

                // 初始化数据
                this.handleInitData();
                // 加载树结构
                this.loadTree();
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
      resetForm(zsmbForm) {
        this.dialogVisible = false;
        this.handleInitData();
        this.$refs.zskFlForm.resetFields();
      },
      handleSetTreeNodeDisabled(zskflid) {
        for (var i = 0, len = this.zskflTreeSelectData.length; i < len; i++) {
          if (this.zskflTreeSelectData[i].KeyId === zskflid) {
            this.zskflTreeSelectData[i].disabled = true;
          } else {
            this.zskflTreeSelectData[i].disabled = false;
          }
        }
      },
      handleNodeClick(obj) {
        this.dispatch(ZSK_FL_GET_DATA, { ZSFLID: obj.KeyId }).then(_ => {
          // console.log(this.knowCate.Model)
          var zskflModel = JSON.parse(JSON.stringify(this.knowCate.Model));
          if (zskflModel) {
            // 修改状态
            this.ZSFLMC_disabled = false;
            this.ZSSJFLID_disabled = false;
            this.BQ1_disabled = false;
            this.BQ2_disabled = false;
            this.BQ3_disabled = false;
            this.ZSFLMS_disabled = false;
            this.btnCancel_disabled = false;
            this.btnSubmit_disabled = false;
            this.btnDelete_disabled = false;

            this.zskFlForm = zskflModel;
            let ArrBx = [];
            if (this.zskFlForm.ZSFLBQ && this.zskFlForm.ZSFLBQ !== '') {
              ArrBx = this.zskFlForm.ZSFLBQ.split('@');
              if (ArrBx.length > 0) {
                this.bqOne = ArrBx[0];
              }
              if (ArrBx.length > 1) {
                this.bqOne = ArrBx[1];
              }
              if (ArrBx.length > 2) {
                this.bqOne = ArrBx[2];
              }
            } else {
              this.bqOne = '';
              this.bqTwo = '';
              this.bqThree = '';
            }
            // 特殊处理上级分类,如果SJFLID为空,则取模板ID. 模板ID为一级分类
            // console.log('zssjflid : ' + this.zskFlForm.ZSSJFLID);
            // console.log('zsflmbid : ' + this.zskFlForm.ZSKMBID);
            this.zssjflIsMbId = (this.zskFlForm.ZSSJFLID == null);
            this.zssjflID2 = this.zssjflIsMbId ? this.zskFlForm.ZSKMBID : this.zskFlForm.ZSSJFLID;
            this.handleSetTreeNodeDisabled(this.zssjflID2);
            // console.log(this.zssjflID2)
          }
        });
      }
    },
    activated() {
      this.tab = {
        label: this.$route.name,
        name: this.$route.path
      }
    },
    created() {
      // this.$store.commit('createNewZSMBModel')
      this.data.data = JSON.stringify({ token: this.userData.UserToken })
      this.tab = {
        label: '知识分类',
        name: this.$route.path
      };
      console.log(this.userData)
      this.handleInitData();
      this.loadTree();
    }
  }

</script>
