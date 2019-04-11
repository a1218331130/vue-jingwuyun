<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" :title="dialogTitle" :visible.sync="dialogVisible" size="bigest">
    <el-form id="formService" :model="formService" :rules="rules" ref="formService" label-width="120px">
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item label="标题" prop="Title">
            <el-input v-model="formService.Title" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-form-item label="描述" prop="Note">
          <el-input type="textarea" v-model="formService.Note" auto-complete="off"></el-input>
        </el-form-item>
      </el-row>
      <div style="position: relative">
        <flow-chart ref="flowChart" @click="handleFlowClickNode" @mouseEnter="handleFlowMouseEnter" @mouseLeave="handleFlowMouseLeave" style="width: 99%"></flow-chart>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer t-center">
      <el-button @click="resetForm(formService)">取消</el-button>
      <el-button type="primary" @click="handleSave(formService)">确定</el-button>
    </div>
  </el-dialog>
  <el-dialog v-draggable="dialogDraggableOptions" title="编辑节点" :visible.sync="dialogNodeVisible" size="middle">
    <el-form id="formService" :model="formNodeService" :rules="rules" ref="formService" label-width="120px">
      <el-row :gutter="0">
        <el-col :span="24">
          <el-form-item label="节点标题" prop="Title">
            <el-input v-model="formNodeService.NodeName" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <div style="text-align: right; margin-bottom:3px">
          <el-button icon="plus" @click="handleAddSpfwForm()">新增审批范围</el-button>
        </div>
        <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border stripe @selection-change="handleSelectionChange" :data="SpfwObjArr">
          <!--:data="processFlowchart.PageData"-->
          <el-table-column width="150" label="单位类型">
            <template scope="scope" width="150">
                <el-select v-model="scope.row.OrgType" placeholder="请选择单位类型"
                           @change="handlerChangeOrgType(scope.row)">
                  <el-option v-for="item in lcDwlxOps" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </template>
</el-table-column>
<el-table-column width="150" class-name="text-left" label="指定单位">
  <template scope="scope" width="150">
                <el-cascader :maxlength="50" :show-all-levels="false" :filterable="true"
                             @change="handleNodeSpfwDwChange(scope.row)" v-model="scope.row.OrgIds" :options="lcDwOps"
                             :clearable="true" :props="{children:'children',value:'id',label:'label'}"
                             :change-on-select="true" expand-trigger="click" style="width: 100%" placeholder=""
                             :disabled="scope.row.OrgType !== '1'"></el-cascader>
              </template>
</el-table-column>
<el-table-column width="150" class-name="text-left" label="人员类型">
  <template scope="scope" width="150">
                <el-select v-model="scope.row.PersonType" placeholder="请选择人员类型"
                           @change="handlePersonTypeChange(scope.row)">
                  <el-option v-for="item in lcRylxOps" :key="item.value" :label="item.label"
                             :disabled="item.value==='3'&&scope.row.OrgType!=='1'"
                             :value="item.value"></el-option>
                </el-select>
              </template>
</el-table-column>
<el-table-column label="值">
  <template scope="scope">
                <!--职务-->
                <div v-show="scope.row.PersonType==='0'">
                  <el-select v-model="scope.row.Value" placeholder="请选择职务" style="width: 100%">
                    <el-option v-for="item in lcZwOps" :key="scope.$index+item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </div>
                <!--角色-->
                <div v-show="scope.row.PersonType==='1'">
                  <el-select v-model="scope.row.Value" placeholder="请选择角色" style="width: 100%">
                    <el-option v-for="item in roles.sysRoleTree" :key="item.roleId" :label="item.roleName"
                               :value="item.roleId"></el-option>
                  </el-select>
                </div>
                <!--指定人员-->
                <div v-show="scope.row.PersonType==='3'">
                  <el-select v-model="scope.row.Value" placeholder="请选择人员" style="width: 100%">
                    <el-option v-for="item in scope.row.UserDictsList" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                  </el-select>
                </div>
                <!--所有人员-->
                <div v-show="scope.row.PersonType==='2' || (scope.row.PersonType!=='3' && scope.row.Value==='')">
                  <el-input :disabled="true" auto-complete="off"></el-input>
                </div>
              </template>
</el-table-column>
<el-table-column label="操作" width="80">
  <template scope="scope" width="80">
                <el-button size="small" @click="handleRemoveSpfw(scope.row)" type="danger">删除</el-button>
              </template>
</el-table-column>
</el-table>
</div>
</el-form>
<div slot="footer" class="dialog-footer t-center">
  <el-button @click="resetNodeForm(formNodeService)">取消</el-button>
  <el-button type="primary" @click="handleNodeModify(formNodeService)">确定</el-button>
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
    <el-button icon="plus" type="info" @click="handleUpdate">新增</el-button>
  </div>
</div>
<div class="app-content-box">
  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading.body="loading" border stripe @row-dblclick="handleUpdate" @selection-change="handleSelectionChange" :data="processFlowchart.PageData">
    <el-table-column prop="Title" width="200" class-name="text-left" label="标题"></el-table-column>
    <el-table-column prop="Note" label="备注"></el-table-column>
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
    <el-col :span="24">
      <pagination :count="processFlowchart.DataCount" :pagenav="{limit: pageSize,currentpage: processFlowchart.PageIndex}" @update:pagenav="handlePageChange"></pagination>
    </el-col>
    <el-col :span="0"></el-col>
  </el-row>
</div>
</div>
</template>

<style>
  /*.Title{ height: 40px;  line-height: 40px; width: 120px; text-align: right}*/

  .el-cascader__label {
    line-height: 30px;
  }

</style>

<script>
  //  import go from 'gojs'
  import {
    mapState
  } from 'vuex'
  import Tabs from '../common/tabs.vue'
  import {
    FETCH_PROCESS_FLOWCHART_LIST, // 获取流程图列表
    GET_PROCESS_FLOWCHART_INFO, // 获取流程图单笔数据
    ADD_PROCESS_FLOWCHART, // 新增流程图
    UPDATE_PROCESS_FLOWCHART, // 更新流程图
    REMOVE_PROCESS_FLOWCHART, // 删除流程图
    FETCH_USER_DICTS, // 用户列表
    GET_SYS_ROLE_TREE // 权限
  } from '../../store/types'
  import mixin from '../../utils/mixin'
  import pagination from '../../widgets/pagination/pagination'
  import FlowChart from './flowchart.vue'
  import treeSelect from '../../widgets/tree-select/tree-select'
  import {
    tableFill,
    getTopNexus
  } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination,
      Tabs,
      FlowChart,
      treeSelect
    },
    data() {
      return {
        dictList: null,
        tab: null,
        dialogVisible: false,
        dialogNodeVisible: false,
        dialogNodeSpfwBoxVisible: false,
        currentNode: null,
        lcDwlxOps: [],
        lcRylxOps: [],
        oldlcDwOps: [],
        lcDwOps: [],
        lcDwId: [],
        lcValOps: [],
        lcidOps: [],
        ywdmOps: [],
        dictsArr: [],
        SpfwObjArrOld: [], // 接收后台数据的对象
        SpfwObjArr: [], // 控件绑定的对象
        lcZwOps: [],
        searchKeys: {
          name: ''
        },
        formService: {},
        AllSpfwList: [],
        formNodeService: {},
        rules: {
          //          Ywdm: [{
          //            required: true,
          //            message: '请选择流程业务',
          //            trigger: 'blur'
          //          }],
          //          Lcid: [{
          //            required: true,
          //            message: '请选择流程图',
          //            trigger: 'blur'
          //          }],
          //          Title: [{
          //            required: true,
          //            message: '请输入标题',
          //            trigger: 'blur'
          //          }]
        },
        pageSize: 10,
        formLabelWidth: '105px'
      }
    },
    computed: {
      ...mapState(['users', 'processFlowchart', 'dict', 'roles']),
      dialogTitle() {
        return this.formService.KeyId ? '编辑流程图' : '新增流程图'
      }
    },
    methods: {
      initData() {
        // this.YwdmOps
        // 流程图设定
        this.formService = {
          KeyId: '', // 唯一ID;是否可空(false);长度(64)  是否主键（true）
          Title: '', // 流程名称;是否可空(true);长度(500)  是否主键（false）
          Note: '', // 备注;是否可空(true);长度(4000)  是否主键（false）
          LcType: '', // 流程类型(0:普通流程.1:协作流程 字典代码:LC_LCLB);是否可空(true);长度(2)  是否主键（false）
          Enable: '', // 是否启用;是否可空(true);长度(2)  是否主键（false）
          FlowchartStr: '', // 流程图形字符串 （为空时则表示没有画过流程，否则表示按字符串加载）;是否可空(true);长度(4000)  是否主键（false）
          DeleteFlag: '', // 是否删除(0:正常,1:删除);是否可空(true);长度(2)  是否主键（false）
          Creator: '', // 创建人;是否可空(true);长度(64)  是否主键（false）
          CreatTime: '', // 创建时间;是否可空(true);长度(7)  是否主键（false）
          Updator: '', // 修改人;是否可空(true);长度(64)  是否主键（false）
          UpdateTime: '', // 最后修改时间;是否可空(true);长度(7)  是否主键（false）
          NotDelete: '', // 不能删除(0:能删[默认],1:不能删除);是否可空(true);长度(2)  是否主键（false）
          FlowcharModel: '', // 流程图的JSON对象
          NodeList: [], // 节点列表 LcglNodeModel类
          SpfwList: [], // 审批范围- 包含单位,人员
          InvalidFlag: '0'
        }
      },
      initNodeData() {
        // 节点审批范围
        this.formNodeService = {
          Key: '', // 前端控件专用Key
          KeyId: '', // 唯一ID
          Lcid: '', // 流程ID
          NodeName: '', // 节点名称
          NodeType: '', // 节点类型 0: 开始节点 1:流转节点 2:判断节点 3: 结束节点
          Sequence: 0, // 节点顺序(开始:-1 结束:999)
          NextNode1: '', // 下级节点ID1
          NextNodeLink1: '', // 下级节点描述1
          NextNode2: '', // 下级节点ID2
          NextNodeLink2: '', // 下级节点描述2
          AssignFlag: '', // 是否指派(0:否,1:是)
          SpryList: [], // 审批人员
          SpryListIndex: 0 // 索引值
        };
      },
      loadData(page = 1, pageSize = 10) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_PROCESS_FLOWCHART_LIST, {
          PageIndex: page,
          PageSize: pageSize,
          Keyword: this.searchKeys.name
        })
      },
      handleSearch() {
        !this.loading && this.loadData(1, this.pageSize)
      },
      handleUpdate(row) {
        this.dialogVisible = true;
        if (row && row.KeyId) {
          this.dispatch(GET_PROCESS_FLOWCHART_INFO, {
            KeyId: row.KeyId
          }, true).then(_ => {
            this.formService = {
              ...this.processFlowchart.Model
            };
            this.AllSpfwList = JSON.parse(JSON.stringify(this.formService.SpfwList));
            this.$refs.flowChart.LoadFlowchart(this.processFlowchart.Model.FlowchartStr);
          })
        } else {
          this.initData();
        }
      },
      handleSave(formService) {
        this.confirm('是否作废正在进行的流程？')
          .then(_ => {
            this.handleModify(formService, '1');
          })
          .catch(_ => {
            this.handleModify(formService, '0');
          })
      },
      handleModify(formService, invalidFlag) {
        this.$refs.formService.validate((valid) => {
          if (valid) {
            this.formService.InvalidFlag = invalidFlag;
            this.formService.FlowchartStr = this.$refs.flowChart.chart.model.toJson();
            if (this.formService.KeyId) {
              this.dispatch(UPDATE_PROCESS_FLOWCHART, this.formService).then(_ => {
                this.dialogVisible = false;
                this.loadData(1, this.pageSize)
              })
            } else {
              this.dispatch(ADD_PROCESS_FLOWCHART, this.formService)
              this.dialogVisible = false;
            }
          } else {
            return false;
          }
        })
      },
      handleNodeUpdate(node) {
        // this.dialogVisible = true;
        this.initNodeData();
        if (!this.formService.SpfwList || this.formService.SpfwList.length === 0) this.formService.SpfwList = [];
        this.SpfwObjArr = [];
        this.SpfwObjArrOld = JSON.parse(JSON.stringify(this.formService.SpfwList.filter(m => (m.Key === node.part.data.key || (m.Key === '' && m.NodeId === node.part.data.SourceId)))));
        this.formNodeService.SpryListIndex = this.SpfwObjArrOld.length - 1;
        this.formNodeService.NodeName = node.part.data.text;
        this.formNodeService.Key = node.part.data.key;
        this.formNodeService.KeyId = node.part.data.SourceId;
        if (this.SpfwObjArrOld.length > 0) {
          let that = this;
          this.SpfwObjArrOld.forEach(function(item, index, arr) {
            if (!item.OrgIds) {
              item.OrgIds = [];
            }
            if (!item.IsNew) {
              item.IsNew = false;
            }
            if (!item.UserDictsList) {
              item.UserDictsList = [];
            }
            if (!item.OrgTypeOld) {
              item.OrgTypeOld = '';
            }
            if (!item.PersonTypeOld) {
              item.PersonTypeOld = '';
            }
            item.OrgTypeOld = item.OrgType;
            item.PersonTypeOld = item.PersonType;
            item.OrgIds = getTopNexus(that.oldlcDwOps, item.OrgId, {
              id: 'id',
              children: 'children',
              parentId: 'parentId'
            });
            // 指定人员赋值
            if (item.PersonType === '3') {
              that.GetUserDicts(item, false);
            }
          });
        } else {
          // alert('No Data!');
        }
        this.SpfwObjArr = JSON.parse(JSON.stringify(this.SpfwObjArrOld));
      },
      handleNodeModify(formNodeService) {
        // 删除数据
        for (let i = 0; i < this.AllSpfwList.length; i++) {
          if (this.AllSpfwList[i].Key === formNodeService.Key || (this.AllSpfwList[i].Key === '' && this.AllSpfwList[i].NodeId === formNodeService.KeyId)) {
            if (this.AllSpfwList[i].KeyId !== '') {
              let spobj = this.SpfwObjArr.find(m => m.KeyId === this.AllSpfwList[i].KeyId);
              if (!spobj) {
                this.AllSpfwList.pop(this.AllSpfwList[i]);
              }
            }
          }
        }
        // 新增或编辑
        for (let i = 0; i < this.SpfwObjArr.length; i++) {
          if (this.SpfwObjArr[i].IsNew === false) {
            for (let j = 0; j < this.AllSpfwList.length; j++) {
              if (this.AllSpfwList[j].Key === formNodeService.Key || (this.AllSpfwList[j].Key === '' && this.AllSpfwList[j].NodeId === formNodeService.KeyId)) {
                if (this.AllSpfwList[j].KeyId === this.SpfwObjArr[i].KeyId) {
                  this.AllSpfwList[j].OrgType = this.SpfwObjArr[i].OrgType; // 单位类型
                  this.AllSpfwList[j].PersonType = this.SpfwObjArr[i].PersonType; // 人员类型
                  this.AllSpfwList[j].OrgId = this.SpfwObjArr[i].OrgId; // 单位ID
                  this.AllSpfwList[j].Value = this.SpfwObjArr[i].Value; // 值(职务或角色或人员ID)
                  this.AllSpfwList[j].OrgIds = this.SpfwObjArr[i].OrgIds; // 前端控件用的参数
                  this.AllSpfwList[j].UserDictsList = this.SpfwObjArr[i].UserDictsList; // 前端控件用的参数
                }
              }
            }
          } else {
            this.SpfwObjArr[i].IsNew = false;
            this.AllSpfwList.push(this.SpfwObjArr[i]);
          }
        }
        this.formService.SpfwList = [...this.AllSpfwList];
        if (this.currentNode.part.data.text !== this.formNodeService.NodeName) {
          this.currentNode.part.data.text = this.formNodeService.NodeName;
          this.$refs.flowChart.LoadFlowchart(this.$refs.flowChart.chart.model.toJson());
          this.$refs.flowChart.isModified = false;
        }
        this.dialogNodeVisible = false;
      },
      handlerChangeOrgType(row) {
        if (row.OrgType !== row.OrgTypeOld) {
          row.OrgId = '';
          row.OrgIds = JSON.parse('[]');
          if (row.OrgType === '1' && this.oldlcDwOps.length > 0) {
            row.OrgId = this.oldlcDwOps[0].id;
            row.OrgIds = getTopNexus(this.oldlcDwOps, row.OrgId, {
              id: 'id',
              children: 'children',
              parentId: 'parentId'
            });
          }
          row.PersonType = '';
          row.Value = '';

          row.OrgTypeOld = row.OrgType;
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleNodeSpfwDwChange(row) {
        if (row.OrgIds) {
          row.OrgId = row.OrgIds[row.OrgIds.length - 1];
        }
      },
      handleFlowClickNode(e, node) {
        if (node && node.diagram.div.id === 'myDiagramDiv') {
          if (node.part.data.key !== '' || node.part.data.SourceId !== '') {
            this.currentNode = node;
            this.handleNodeUpdate(node);
            this.dialogNodeSpfwBoxVisible = false;
            this.dialogNodeVisible = true;
          }
        }
      },
      handleFlowMouseEnter(e, node) {
        //        原本做快速显示效果的, 做了一个不好看, 坐等大神抱大腿
      },
      handleFlowMouseLeave(e, node) {
        //        原本做快速显示效果的, 做了一个不好看, 坐等大神抱大腿
      },
      handleRemove(row) {
        this.confirm('此操作将将永久删除该数据，是否继续？')
          .then(_ => {
            this.dispatch(REMOVE_PROCESS_FLOWCHART, {
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
      handleRemoveSpfw(row) {
        this.confirm('此操作将将永久删除该数据，是否继续？')
          .then(_ => {
            this.SpfwObjArr.pop(row)
          }).catch(_ => {})
      },
      handleAddSpfwForm() {
        this.formNodeService.SpryListIndex++;
        let data = {
          Key: this.formNodeService.Key, // Key
          KeyId: this.formNodeService.KeyId + this.formNodeService.SpryListIndex, // 唯一ID
          NodeId: this.formNodeService.KeyId, // 节点ID
          IsNew: true // 是否新增
        }
        this.SpfwObjArr.push(this.ReturnNewSpfwItem(data));
      },
      ReturnNewSpfwItem(data) {
        return {
          Key: data.Key || '', // Key
          KeyId: data.KeyId || '', // 唯一ID
          Lcid: data.Lcid || '', // 流程图ID
          NodeId: data.NodeId || '', // 节点ID
          OrgType: data.OrgType || '', // 单位类型(0:申请单位,1:指定单位,2:受理单位,3:任意单位 字典类型:LC_DWLX)
          OrgTypeOld: data.OrgTypeOld || '',
          PersonType: data.PersonType || '', // 人员类型(0:职务,1:角色,2:所有人员,3:指定人员 字典类型:LC_RYLX)
          PersonTypeOld: data.PersonTypeOld || '', // 旧值
          Value: data.Value || '', // 值(职务或角色或人员ID)
          OrgId: data.OrgId || '', // 指定单位ID(当单位类型为指定单位时)
          OrgIds: [], //
          Creator: '', // 创建人
          CreateTime: '', // 创建时间
          Updator: '', // 修改人
          UpdateTime: '', // 最后修改时间
          IsNew: data.IsNew || true, // 是否新增
          UserDictsList: [] // 指定人员列表(每行都要独立给一个)
        };
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
      },
      resetNodeForm(formService) {
        this.dialogNodeVisible = false;
        // this.$refs.formService.resetFields();
      },
      /**
       * [GetUserDicts 获取用户列表]
       * @param {[type]} item [description]
       */
      GetUserDicts(row, isChangePersonType) {
        // 取用户字典列表
        this.dispatch(FETCH_USER_DICTS, { DeptNo: row.OrgId }, null, true).then(d => {
          row.UserDictsList = this.dict.fetchUserDicts.map(c => {
            return {
              label: c.DictName,
              value: c.KeyId,
              code: c.Temp2
            }
          })
          if (row && isChangePersonType && row.UserDictsList.length > 0) {
            row.Value = row.UserDictsList[0].value;
          }
        })
      },
      handlePersonTypeChange(row) {
        if (row.PersonType !== row.PersonTypeOld) {
          row.Value = '';
          if (row.PersonType === '0') {
            // 职务
            if (this.lcZwOps.length > 0) {
              row.Value = this.lcZwOps[0].value;
            }
          } else if (row.PersonType === '1') {
            // 角色
            if (this.roles.sysRoleTree.length > 0) {
              row.Value = this.roles.sysRoleTree[0].roleId;
            }
          } else if (row.PersonType === '2') {
            // 所有人员
          } else if (row.PersonType === '3') {
            // 指定单位
            this.GetUserDicts(row, true);
          }
          row.PersonTypeOld = row.PersonType;
        }
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
        label: '流程图管理',
        name: this.$route.path
      }
      this.getDict(['LC_DWLX', 'LC_RYLX', 'ZJ']).then(res => {
        this.dictList = res;
        this.lcDwlxOps = [...this.dictList['LC_DWLX']];
        this.lcRylxOps = [...this.dictList['LC_RYLX']];
        this.lcZwOps = res['ZJ'];
        this.initNodeData();
      });
      this.getDict([], true).then(res => {

      });
      this.dispatch(GET_SYS_ROLE_TREE)
      /**
       * 采集单位
       */
      this.getCascaderDict().then(d => {
        this.oldlcDwOps = d[0]
        this.lcDwOps = d[1];
      })

      this.loadData();
    }
  }

</script>
