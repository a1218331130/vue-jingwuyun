<!-- 对象选择组件 -->
<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="type==='person'?'选择人员':'选择车辆'" :modal-append-to-body="true" :append-to-body="true" :size="size||'large--fixed'" :modal="size!=='full'" :close-on-click-modal="false" @open="initDialog"
  :before-close="closeEvent" id="object-selector-dialog">
  <el-row>
    <el-col :span="6">
      <el-tabs v-model="activeName" >
        <el-tab-pane v-for="tab in tabs" :key="tab.id" :name="tab.id.toString()" :label="tab.label">
          <el-tree class="cat-tree" v-if="tab.id === '1'" :data="tree[0].children" node-key="id" :highlight-current="true" :indent="0" :default-expand-all="true" @node-click="nodeClick"></el-tree>
          <el-tree class="cat-tree" v-if="tab.id === '2'" :data="tree[1].children" node-key="id" :highlight-current="true" :indent="0" :default-expand-all="true" @node-click="nodeClick"></el-tree>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="18" style="margin-top:41px;">
      <div class="list-wrap" v-if="this.type==='person'">
        <div class="app-toolbar">
          <el-form class="form" :inline="true">
            <el-form-item label="姓名">
              <el-input size="small" style="width:90px;" v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item label="身份证">
              <el-input style="width:165px;" v-model="query.idCard"></el-input>
            </el-form-item>
            <el-form-item style="margin:0;">
              <el-button class="btn" type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="list-box">
          <!-- <el-table ref="objectTable" @cell-mouse-enter="cellMouseEnter" class="app-table" :data="list" :show-header="true" :border="true" v-loading="loading" height="370" @select="updateSelection" @select-all="allSelection"> -->

          <el-table ref="objectTable" id="objectTable" @row-click="rowClick" @cell-mouse-enter="cellMouseEnter" class="app-table" :data="list" :show-header="true" :border="true" v-loading="loading" height="370" highlight-current-row @current-change="handleCurrentChange">
                    <el-table-column type="index" label="序号" align="center" sortable>
                      <template scope="scope">
                      {{scope.$index+1 + pageInfo.limit * (pageInfo.currentpage - 1)}}
                      </template>
</el-table-column>
<el-table-column v-for="column in columns" :key="column.id" :label="column.label" :prop="column.prop"></el-table-column>
</el-table>
<div style="border-color: rgb(238, 238, 238); text-align:right" v-if="(this.persontype!=='')">
  <pagination :count=" this.pageInfo.count" :pagenav="{limit: this.pageInfo.limit,currentpage: this.pageInfo.currentpage}" @update:pagenav="updatePage" :align="right"></pagination>
</div>
</div>
</div>
<div class="list-wrap" v-if="this.type==='car'">
  <div class="app-toolbar">
    <el-form class="form" :inline="true">
      <el-form-item label="车主姓名">
        <el-input size="small" style="width:90px;" v-model="querycar.name"></el-input>
      </el-form-item>
      <el-form-item label="车牌号">
        <el-input style="width:165px;" v-model="querycar.idCard"></el-input>
      </el-form-item>
      <el-form-item style="margin:0;">
        <el-button class="btn" type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="list-box">
    <el-table ref="objectTable" @cell-mouse-enter="cellMouseEnter" @row-click="rowClick" class="app-table" :data="list2" :show-header="true" :border="true" v-loading="loading" height="370" style="overflow:auto" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column width="55"></el-table-column>
      <el-table-column v-for="column in columnsCar" :key="column.id" :label="column.label" :prop="column.prop"></el-table-column>
    </el-table>
    <div style="border-color: rgb(238, 238, 238); text-align:right" v-if="(this.persontype!=='')">
      <pagination :count=" this.pageInfo.count" :pagenav="{limit: this.pageInfo.limit,currentpage: this.pageInfo.currentpage}" @update:pagenav="updatePage" :align="right"></pagination>
    </div>
  </div>
</div>
</el-col>
</el-row>

<div slot="footer" class="dialog-footer">
  <el-button type="" @click="closeEvent">取消</el-button>
  <el-button type="primary" @click="submit">确定</el-button>
</div>
</el-dialog>
</template>
<style lang="scss" scoped>
  .el-tabs__nav {
    width: 100%;
  }

  .el-tabs__item {
    width: 50%;
  }

  .cat-tree {
    height: 429px;
    overflow-y: scroll;
  }

  .list-wrap {
    height: 450px;
    .form {
      .el-form-item {
        margin-bottom: 0;
      }
      .btn {
        vertical-align: middle;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
      }
    }
  }

  .el-dialog__body {
    height: 900px;
    padding: 0;
  }

</style>
<style lang="scss">
  #object-selector-dialog {
    .list-box {
      .el-table__body-wrapper {
        height: 330px !important;
      }
      .el-table.app-table {
        overflow: hidden !important;
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import {
    FETCH_CASE_LIST,
    // FETCH_SUSPECT_CASE_PEOPLE_LIST,
    // FETCH_INVOLVED_CAR_LIST,
    IMPORTANT_PERSON_LIST,
    // FXPCGK_LIST,
    // FXPCGK_CASECAR_LIST,
    // FETCH_PEOPLE_KEYWORD_LIST,
    FETCH_QUERY_PEOPLE_LIST, // 布控预警-关键词布控-获取被选的人员列表
    FETCH_QUERY_CAR_LIST // 布控预警-关键词布控-获取被选的车辆列表
  } from '../../store/types'

  import mixin from '../../utils/mixin'
  import pagination from '../../widgets/pagination/pagination.vue'
  import { arrayGetRid } from '../../utils/util'

  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    data() {
      return {
        right: 'right',
        pageInfo: {
          count: 100,
          limit: 10,
          currentpage: 1
        },
        tabs: [
          { label: '案件', id: '1' },
          { label: '重点人员', id: '2' }
        ],
        activeName: '1',
        selection: [],
        currentpageOld: 1,
        currentpage: 1,
        num: 1,
        selections: {},
        query: {
          name: '',
          idCard: ''
        },
        querycar: {
          name: '',
          idCard: ''
        },
        columns: [{
          id: 1,
          label: '姓名',
          prop: 'xm',
          type: 'name'
        }, {
          id: 2,
          label: '身份证',
          prop: 'sfz',
          type: 'idCard'
        }, {
          id: 3,
          label: '性别',
          prop: 'xb',
          type: null
        }, {
          id: 4,
          label: '布控状态',
          prop: 'bkzt',
          type: null
        }, {
          id: 5,
          label: '备注',
          prop: 'mark',
          type: null
        }],
        columnsCar: [{
          id: 1,
          label: '车牌号',
          prop: 'carNum',
          type: 'name'
        }, {
          id: 2,
          label: '车辆型号',
          prop: 'carModel',
          type: null
        }, {
          //   id: 3,
          //   label: '车辆品牌',
          //   prop: 'brand',
          //   type: null
          // }, {
          id: 3,
          label: '车主姓名',
          prop: 'xm',
          type: null
        }, {
          id: 4,
          label: '布控状态',
          prop: 'bkzt',
          type: null
        }, {
          id: 5,
          label: '车辆描述',
          prop: 'mark',
          type: null
        }],
        list: [],
        list2: [],
        listType: '',
        caseId: '',
        persontype: '',
        dictList: null,
        tree: [{
          label: '案件',
          id: '1',
          count: 0,
          children: []
        }, {
          label: '管控对象',
          id: '2',
          count: 0,
          children: [{
            type: 'object',
            label: '涉稳人员',
            id: '3',
            count: 0,
            rylx: '000002'
          }, {
            type: 'object',
            label: '涉恐人员',
            id: '4',
            count: 0,
            rylx: '000001'
          }, {
            type: 'object',
            label: '精神病人',
            id: '5',
            count: 0,
            rylx: '000004'
          }, {
            type: 'object',
            label: '涉毒人员',
            id: '6',
            count: 0,
            rylx: '000005'
          }, {
            type: 'object',
            label: '前科人员',
            id: '8',
            count: 0,
            rylx: '000006'
          }, {
            type: 'object',
            label: '涉抢涉爆人员',
            id: '8',
            count: 0,
            rylx: '000007'
          }, {
            type: 'object',
            label: '上访人员',
            id: '8',
            count: 0,
            rylx: '000003'
          }]
        }],
        ajidList: ''
      }
    },
    props: ['dialog', 'type', 'size', 'value'],
    computed: {
      ...mapState(['caseInfo', 'suspectCasePeople', 'involvedCar', 'controlManage', 'focusCar', 'focusPerson'])
    },
    methods: {
      initDialog() {
        this.ajidList = ''
        this.reset()
        this.selection = [...this.value]
        if (!this.type) {
          this.type = 'person'
        }
        if (this.type === 'person' && this.tree[0].children.length === 0) {
          this.tree[1].children = this.dictList['RQFL'].filter(d => d.parentId !== '').map(d => {
            return {
              type: 'object-person',
              label: d.label,
              id: d.value,
              count: 0,
              rylx: d.value
            }
          })
          this.dispatch(FETCH_CASE_LIST, { PageIndex: 1, PageSize: 500 }).then(() => {
            this.tree[0].children = this.caseInfo.PageData.filter(d => d.ajmc !== '').map(d => {
              this.ajidList = this.ajidList + ',' + d.id // 获取案件id
              return {
                type: 'case',
                label: d.ajmc,
                id: d.id,
                count: 0
              }
            })
          })
        } else if (this.type === 'car' && this.tree[0].children.length === 0) {
          this.tree[1].children = this.dictList['ZDCLLX'].map(d => {
            return {
              type: 'object-car',
              label: d.label,
              id: d.value,
              count: 0,
              rylx: d.value
            }
          })
          this.dispatch(FETCH_CASE_LIST, { PageIndex: 1, PageSize: 500 }).then(() => {
            this.tree[0].children = this.caseInfo.PageData.filter(d => d.ajmc !== '').map(d => {
              this.ajidList = this.ajidList + ',' + d.id // 获取案件id
              return {
                type: 'case',
                label: d.ajmc,
                id: d.id,
                count: 0
              }
            })
          })
        }
      },
      search() {
        this.fetchList({
          type: this.listType,
          rylx: this.persontype
        })
      },
      fetchList(data) {
        this.list = []
        this.list2 = []
        if (this.type === 'person' && !data.type) {
          // this.dispatch(FETCH_QUERY_PEOPLE_LIST, {
          //   // ajid: this.caseId, // 案件id
          //   xm: this.query.name, // 查询姓名
          //   sfz: this.query.idCard, // 身份证
          //   ajids: this.ajidList, // 案件id列表
          //   PageIndex: 1,
          //   PageSize: 10
          // }).then(() => {
          //   this.list = this.controlManage.queryPeopleList.PageData.map(d => {
          //     return {
          //       id: d.lybid, // 来源表id
          //       bkzt: d.bkzt ? '已布控' : '未布控', // 布控状态
          //       name: d.xm, // 姓名
          //       idCard: d.sfz, // 身份证
          //       sex: d.xb, // 性别
          //       mark: d.bz, // 备注
          //       lybid: d.lybid, // 来源表id
          //       lylx: '1' // 来源类型
          //     }
          //   })
          // })
        } else if (this.type === 'person' && data.type === 'case') {
          if (this.persontype !== '') {
            // this.getImptrantPerson()
          } else {
            // 查询-布控预警-关键词布控-获取被选的人员列表
            this.dispatch(FETCH_QUERY_PEOPLE_LIST, {
              ajid: this.caseId, // 案件id
              xm: this.query.name, // 查询姓名
              sfz: this.query.idCard, // 身份证
              ajids: this.ajidList, // 案件id列表
              PageIndex: 1,
              PageSize: 10
            }).then(() => {
              this.list = this.controlManage.queryPeopleList.PageData.map(d => {
                return {
                  id: d.lybid, // 来源表id
                  bkzt: parseInt(d.bkzt) ? '已布控' : '未布控', // 布控状态
                  xm: d.xm, // 姓名
                  sfz: d.sfz, // 身份证
                  xb: d.xb, // 性别
                  mark: d.bz, // 备注
                  lybid: d.lybid, // 来源表id
                  lylx: '1', // 来源类型
                  obj: d.ajxx // 对象属性
                }
              })
            })
          }
        } else if (this.type === 'car' && data.type === 'case') {
          this.dispatch(FETCH_QUERY_CAR_LIST, {
            xm: this.querycar.name, // 车主姓名
            cph: this.querycar.idCard, // 车牌号码
            ajid: this.caseId, // 对象所属的案件ID
            ajids: this.ajidList, // 当前登录人有权限查看的案件 IDs
            PageIndex: 1,
            PageSize: 500
          }).then(() => {
            this.list2 = this.controlManage.queryCarList.PageData.map(d => {
              return {
                bkzt: parseInt(d.bkzt) ? '已布控' : '未布控', // 布控状态
                carNum: d.cph, // 车牌号码
                // carColor: d.clys,
                // brand: d.clsbm,
                carModel: d.clxh, // 车辆型号
                xm: d.xm, // 车主姓名
                mark: d.ms, // 车辆描述
                lybid: d.lybid, // 来源表id
                // tpid: d.tpid,
                lylx: '1' // 来源类型
              }
            })
          })
        } else if (data.type === 'object-person') {
          this.dispatch(FETCH_QUERY_PEOPLE_LIST, {
            xm: this.query.name, // 查询姓名
            sfz: this.query.idCard, // 身份证
            ajids: this.ajidList, // 案件id列表
            PageIndex: 1,
            PageSize: 10,
            dxlb: data.rylx // 对象类别
          }).then(() => {
            this.pageInfo.count = this.controlManage.queryPeopleList.DataCount
            this.list = this.controlManage.queryPeopleList.PageData.map(d => {
              return {
                id: d.lybid, // 来源表id
                bkzt: parseInt(d.bkzt) ? '已布控' : '未布控', // 布控状态
                xm: d.xm, // 姓名
                sfz: d.sfz, // 身份证
                xb: d.xb, // 性别
                mark: d.bz, // 备注
                lybid: d.lybid, // 来源表id
                lylx: '2',
                rqlbmc: d.rqlbmc // 人员类别
              }
            })
          })
        } else if (data.type === 'object-car') {
          this.dispatch(FETCH_QUERY_CAR_LIST, {
            xm: this.querycar.name, // 车主姓名
            cph: this.querycar.idCard, // 车牌号码
            // ajid: this.caseId, // 对象所属的案件ID
            ajids: this.ajidList, // 当前登录人有权限查看的案件 IDs
            PageIndex: 1,
            PageSize: 10,
            dxlb: data.rylx
          }).then(() => {
            this.pageInfo.count = this.controlManage.queryCarList.DataCount
            this.list2 = this.controlManage.queryCarList.PageData.map(d => {
              return {
                bkzt: parseInt(d.bkzt) ? '已布控' : '未布控', // 布控状态
                carNum: d.cph, // 车牌号码
                // carColor: d.clys,
                // brand: d.clsbm,
                carModel: d.clxh, // 车辆型号
                xm: d.xm, // 车主姓名
                mark: d.ms, // 车辆描述
                lybid: d.lybid, // 来源表id
                // tpid: d.tpid,
                lylx: '2' // 来源类型
              }
            })
          })
        }
      },
      checkAndSelectRow(item) {
        if (this.list.length > 0 && this.selection.length > 0) {
          setTimeout(() => {
            this.list.forEach(d => {
              if (!this.selection.find(s => s.id === d.id)) {

              } else {
                this.$refs.objectTable.toggleRowSelection(d, true)
              }
            })
          }, 0)
        }
      },
      nodeClick(data, obj, node) {
        if (!data.type) {
          return false
        } else {
          this.reset()
          this.listType = data.type
          this.caseId = data.id
          this.persontype = data.rylx ? data.rylx : ''
          this.fetchList(data)
        }
      },
      updatePage(data) {
        if (this.type === 'person') {
          this.pageInfo.currentpage = this.currentpage = data.currentpage
          if (this.currentpage === this.currentpageOld) {
            this.$('#objectTable').find('tr').eq(this.num).find('td').css({ 'background-color': 'blue', 'color': 'white' })
          } else {
            this.$('#objectTable').find('tr td').css({ 'background-color': 'white', 'color': '#666666' })
          }
          this.getFocusPerson(data.currentpage, data.limit)
        } else if (this.type === 'car') {
          this.getFocusCar(data.currentpage, data.limit)
        }
      },
      updateSelection(selection, row) {
        if (row.bkzt === '已布控') {
          this.$message({
            type: 'warning',
            message: '已布控对象不能重复布控'
          })
          let rows = selection.filter(d => d.bkzt === '未布控')
          if (rows.length) {
            this.$refs.objectTable.clearSelection()
            rows.forEach(c => {
              this.$refs.objectTable.toggleRowSelection(c)
            })
          } else {
            this.$refs.objectTable.clearSelection()
          }
          return
        }
        if (!selection.find(d => d.id === row.id)) {
          // 取消选择
          arrayGetRid(this.selection, [row])
        } else {
          // 添加选择
          this.selection = this.selection.filter(d => d.lybid !== row.lybid)
          this.selection.push(row)
        }
      },
      allSelection(selection) {
        let rows = selection.filter(d => d.bkzt === '未布控')
        if (rows.length) {
          this.$refs.objectTable.clearSelection()
          rows.forEach(c => {
            this.$refs.objectTable.toggleRowSelection(c)
          })
        } else {
          this.$refs.objectTable.clearSelection()
        }
        rows.forEach(d => {
          this.selection.push(d)
        })
      },
      getImptrantPerson(PageIndex = 1, PageSize = 10) {
        this.dispatch(IMPORTANT_PERSON_LIST, {
          rqlb: this.persontype,
          PageSize: PageSize,
          PageIndex: PageIndex
        }).then(() => {
          this.pageInfo.count = this.controlManage.impPList.DataCount
          this.list = this.controlManage.impPList.PageData.map(d => {
            return {
              id: d.id,
              city: d.xzdz,
              name: d.xm,
              idCard: d.sfz,
              // source: '怀化',
              sex: d.xb === '1' ? '男' : '女',
              mark: d.bz,
              lybid: d.id,
              lylx: '2'
            }
          })
          this.checkAndSelectRow()
        })
      },
      getFocusPerson(PageIndex = 1, PageSize = 10) {
        this.dispatch(FETCH_QUERY_PEOPLE_LIST, {
          PageIndex: PageIndex,
          PageSize: PageSize,
          xm: this.query.name, // 查询姓名
          sfz: this.query.idCard, // 身份证
          ajids: this.ajidList, // 案件id列表
          dxlb: this.persontype
        }).then(() => {
          this.pageInfo.count = this.controlManage.queryPeopleList.DataCount
          this.list = this.controlManage.queryPeopleList.PageData.map(d => {
            return {
              id: d.lybid, // 来源表id
              bkzt: parseInt(d.bkzt) ? '已布控' : '未布控', // 布控状态
              xm: d.xm, // 姓名
              sfz: d.sfz, // 身份证
              xb: d.xb, // 性别
              mark: d.bz, // 备注
              lybid: d.lybid, // 来源表id
              lylx: '2'
            }
          })
        })
      },
      getFocusCar(PageIndex = 1, PageSize = 10) {
        this.dispatch(FETCH_QUERY_CAR_LIST, {
          xm: this.querycar.name, // 车主姓名
          cph: this.querycar.idCard, // 车牌号码
          // ajid: this.caseId, // 对象所属的案件ID
          ajids: this.ajidList, // 当前登录人有权限查看的案件 IDs
          dxlb: this.persontype,
          PageIndex: PageIndex,
          PageSize: PageSize
          // rqlb: this.persontype
        }).then(() => {
          this.list2 = []
          this.list2 = this.controlManage.queryCarList.PageData.map(d => {
            return {
              bkzt: parseInt(d.bkzt) ? '已布控' : '未布控', // 布控状态
              carNum: d.cph, // 车牌号码
              // carColor: d.clys,
              // brand: d.clsbm,
              carModel: d.clxh, // 车辆型号
              xm: d.xm, // 车主姓名
              mark: d.ms, // 车辆描述
              lybid: d.lybid, // 来源表id
              // tpid: d.tpid,
              lylx: '2' // 来源类型
            }
          })
        })
      },
      submit() {
        // if (this.type === 'car') {
        //   this.$emit('input', this.selection)
        //   this.$emit('close')
        // } else {
        //   this.dispatch(FETCH_PEOPLE_KEYWORD_LIST, { people_info: this.selection }).then(() => {
        //     this.$emit('input', this.controlManage.fetchPeopleKeywordList)
        //     this.$emit('close')
        //   })
        // }
        this.$emit('input', this.selections)
        this.$emit('close')
      },
      closeEvent() {
        this.$emit('close')
      },
      reset() {
        this.list = []
        this.list2 = []
        this.query.name = ''
        this.query.idCard = ''
        this.persontype = ''
        this.pageInfo.count = 0
      },
      handleCurrentChange(val) {
        this.selections = val;
      },
      rowClick(row, event, cloumn) {
        if (row.bkzt === '已布控') {
          this.$message({ type: 'warning', message: '该人员已布控，请重新选择' })
          return
        }
        this.currentpageOld = this.currentpage
        let obj = this.$(event.target).parents('tr');
        this.num = obj.parents('table').find('tr').index(obj) + 1;
        this.$('.' + cloumn.id).parent('tr').find('td').css({ 'background-color': 'white', 'color': '#666666' })
        this.$(event.target).parents('tr').find('td').css({ 'background-color': 'blue', 'color': 'white' })
      }
    },
    mounted() {},
    created() {
      this.getDict(['RQFL', 'ZDCLLX'], true).then(res => {
        this.dictList = res
      })
    }
  }

</script>
