<template>
  <analysisBox @call:showMiniModel="miniSider">
    <div slot="sunWest">
      <sidebar @returnFocus="focusChange" @call:comm="commChange" :isFocus="sidebarFocus" :miniModel="miniModel"></sidebar>
    </div>
    <div slot="sunCenter" class="content-box">
      <!-- 基本账户分析 -->
      <basic v-show="currentComm==='basic'" ref="basic" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </basic>

      <!-- 交易频率分析 -->
      <frequency v-show="currentComm==='frequency'" ref="frequency" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </frequency>

      <!-- 交易日期规律 -->
      <datePattern v-show="currentComm==='datePattern'" ref="datePattern" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </datePattern>

      <!-- 交易网点分析 -->
      <netDot v-show="currentComm==='netDot'" ref="netDot" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </netDot>

      <!-- 资金流向分析 -->
      <flowTo v-show="currentComm==='flowTo'" ref="flowTo" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </flowTo>

      <!-- 交叉频率分析 -->
      <overlapping v-show="currentComm==='overlapping'" ref="overlapping" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </overlapping>

      <!-- 共同账户分析 -->
      <common v-show="currentComm==='common'" ref="common" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </common>

      <!-- 可疑点分析 -->
      <!-- <doubtful v-show="currentComm==='doubtful'" ref="doubtful" ></doubtful> -->
      <doubtful v-show="currentComm==='doubtful'" ref="doubtful" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </doubtful>

      <!-- 关联分析 -->
      <relation v-show="currentComm==='relation'" ref="relation" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </relation>

      <!-- 对比分析 -->
      <contrast v-show="currentComm==='contrast'" ref="contrast" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </contrast>
      <!-- 账单管理 -->
      <billManage :datas="datas" v-show="currentComm==='billManage'" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
        <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
      </billManage>

      <!-- 侧边栏(右工具按钮) -->
    <side-right-box :unfoldHandle="showRightBar" style="width:270px;" v-loading="loading" v-show="currentComm !=='billManage'">
      <el-input v-model="treeKeyword" style="width: 100%;margin-bottom:10px" placeholder="输入案件名称进行搜索">
        <!-- <el-button slot="append" @click="checkCase()" icon="icon iconfont icon-sousuo"></el-button> -->
      </el-input>
      <el-tree ref="rightTree" :default-checked-keys="treeData[0]?[treeData[0].children[0].children[0].id]:[]" :filter-node-method="filterTree" :default-expanded-keys="treeData[0]?[treeData[0].children[0].id]:[]" class="cat-tree" :data="treeData" :show-checkbox="true" node-key="id" @check-change="rightTreeChange" :render-content="renderContent"></el-tree>

    </side-right-box>
    <side-right-box :unfoldHandle="showRightBar" style="width:290px;" v-loading="loading" v-show="currentComm ==='billManage'">
      <el-input v-model="treeKeyword1" style="width: 100%;margin-bottom:10px" placeholder="输入案件名称进行搜索">
        <!-- <el-button slot="append" @click="checkCase()" icon="icon iconfont icon-sousuo"></el-button> -->
      </el-input>
      <el-tree ref="rightTree1" :default-checked-keys="manageTreeData[0]?[manageTreeData[0].children[0].children[0].id]:[]" :filter-node-method="filterTree" :default-expanded-keys="manageTreeData[0]?[manageTreeData[0].children[0].id]:[]" class="cat-tree" :data="manageTreeData" node-key="id" @check-change="rightTreeChange" :render-content="manageTreeRender"></el-tree>

    </side-right-box>

    <dialog-case :dialog="caseDialog" @update:caseId="updateCaseId"></dialog-case>

    <el-button v-show="miniModel" type="primary" title="账单管理" size="mini" icon="icon iconfont icon-shenqing" style="position: absolute;
          bottom: 100px;
          left: 0;
          padding: 0;
          height: 48px;
          border: 0;
          width: 220px;" @click="commonManage('billManage')" :disabled="loading">账单管理</el-button>
    <el-button v-show="!miniModel" type="primary" title="账单管理" size="mini" icon="icon iconfont icon-shenqing" style="position: absolute;
              bottom: 100px;
              left: 0;
              padding: 0;
              height: 48px;
              border: 0;margin:0;
              width: 64px;" @click="commonManage('billManage')" :disabled="loading"></el-button>

    <span></span>
    <el-button v-show="miniModel" type="primary" title="账单导入" size="mini" icon="icon iconfont icon-download" style="position: absolute;
          bottom: 50px;
          left: 0;
          padding: 0;
          height: 48px;
          border: 0;
          width: 220px;" @click="importFile">账单导入</el-button>
    <el-button v-show="!miniModel" type="primary" title="账单导入" size="mini" icon="icon iconfont icon-download" style="position: absolute;
              bottom: 50px;
              left: 0;
              padding: 0;
              height: 48px;
              border: 0;margin:0;
              width: 64px;" @click="importFile"></el-button>

    <input v-if="fileInput===true" type="file" ref="importUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="v=>fileChange(v,2)">
    <import-dialog :dialog="dislogImport" :title="fileInfo.title" :file="fileInfo.file" :type="2" :caseInfo="null" @close="clearFileInput"></import-dialog>
    <contextMenu :menuData="menuDatas" v-show="contextStatus" @changeMenuStatus="changeStatus" @deleteSplit="dataSplit"></contextMenu>
    </div>
    <!-- 导入 -->
    <!-- <input v-if="fileInput===true" type="file" ref="importUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="fileChange">
    <import-dialog :dialog="dislogImport" :title="fileInfo.title" :file="fileInfo.file" :type="importType" :caseInfo="{caseName:caseTitle, caseId:caseId}" @close="clearFileInput"></import-dialog> -->
  </analysisBox>
</template>

<style lang="scss" scoped>
  .content-box {
    height: 100%; // overflow: hidden;
    overflow: scroll;
    .side-box {
      top: 97px;
      z-index: 10;
      height: calc(100% - 130px);
    }
    .cat-tree {
      padding-top: 10px;
      height: calc(100vh - 240px);
      overflow-y: scroll;
      border: none;
      padding-bottom: 50px;
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_BILL_TREE_LIST, FETCH_MANAGE_BILL_TREE_LIST } from '../../../store/types'
  import baseMixin from '../baseMixin'

  // import { getOnlyArray } from '../../../utils/util'

  import analysisBox from '../layout'
  import sidebar from './sidebar'
  import basic from './basic/index' // 基本账户分析
  import frequency from './frequency/index' // 交易频率分析
  import datePattern from './datePattern/index' // 交易日期规律
  import netDot from './netDot/index' // 交易网点分析
  import flowTo from './flowTo/index' // 资金流向分析
  import overlapping from './overlapping/index' // 交叉频率分析
  import common from './common/index' // 共同账户分析
  import doubtful from './doubtful/index' // 可疑点分析
  import relation from './relation/index' // 关联分析
  import billManage from './billManage/index' // 账单管理
  import contrast from './contrast/index'
  import contextMenu from '../common/contextMenu' // 右击菜单框

  export default {
    mixins: [baseMixin],
    components: {
      analysisBox,
      sidebar,
      basic,
      frequency,
      datePattern,
      netDot,
      flowTo,
      overlapping,
      common,
      doubtful,
      relation,
      billManage,
      contrast,
      contextMenu
    },
    data() {
      return {
        treeKeyword: '',
        treeKeyword1: '',
        treeData: [],
        currentComm: 'basic',
        manageTreeData: [],
        datas: {
          billNumber: '',
          name: ''
        },
        currNumber: '',
        contextStatus: false,
        menuDatas: {
          menu: [{
            name: '删除',
            method: 'deleteOne',
            sendData: {
              v_guid: '',
              v_zzh: '',
              v_type: ''
            }
          }],
          types: 'billManage',
          clientY: '',
          clientX: '',
          id: 'billIndex'
        },
        nodeData: ''
      }
    },
    computed: {
      ...mapState(['analysisBill'])
    },
    watch: {
      treeKeyword(v) {
        this.$refs.rightTree.filter(v)
      },
      treeKeyword1(v) {
        this.$refs.rightTree1.filter(v)
      },
      currentComm(v) {
        if (v === 'billManage' && this.manageTreeData.length === 0) {
          this.fetchAccoundTree('type')
        }
      }
    },
    methods: {
      reload() {
        // this.treeData = []
        // this.fetchAccoundTree()
      },
      miniSider(val) {
        this.miniModel = !val
      },
      /**
       * [updateCaseId 获取案件ID]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      updateCaseId(val) {
        this.loading = true
        this.caseId = val
        this.fetchAccoundTree()
        this.caseDialog = false
      },
      /**
       * [fetchAccoundTree 拉取右侧账单树]
       * @return {[type]} [description]
       */
      fetchAccoundTree(type) {
        let api = '';
        if (!type) {
          api = FETCH_BILL_TREE_LIST;
        } else {
          api = FETCH_MANAGE_BILL_TREE_LIST;
        }
        if (this.caseId === '') {
          this.dispatch(api, { v_ajid: '' }).then(() => {
            let res = [];
            let treeList;
            if (!type) {
              treeList = this.analysisBill.treeList;
              res = this.computCase(treeList);
            } else {
              // 账单管理树
              treeList = this.analysisBill.manageBillTreeList;
              this.datas.billNumber = treeList[0].zdzzh;
              this.datas.name = treeList[0].khr;
              this.currNumber = treeList[0].zdzzh;
              res = this.computManageCase(treeList);
            }
            if (res.length !== 0) {
              if (!type) {
                this.treeData = res;
                this.updateDefaultTreeChecker('rightTree')
              } else {
                this.manageTreeData = res;
                this.updateDefaultTreeChecker('rightTree1')
              }
            }
            this.treeloading = false
          })
        }
      },
      computManageCase(data) {
        let res = [];
        data.forEach(d => {
          // 是否存在案件
          let isCase = res.findIndex((currentEl, currentIndex) => {
            return currentEl.id === d.ajid
          })
          if (isCase < 0) {
            // 不存在
            res.push({
              id: d.ajid,
              label: d.ajmc === '' ? '(暂无案件名称)' : d.ajmc,
              children: [{
                id: d.ajid + d.guid,
                label: d.khr,
                children: [{
                  id: d.guid,
                  label: d.zdzzh,
                  name: d.khr,
                  startTime: d.zdkssj,
                  endTime: d.zdjssj,
                  status: parseInt(d.qx_step) === 2
                }]
              }]
            })
          } else {
            // 该案是否存在此开户人员
            let isKHR = res[isCase].children.findIndex((currentEl, currentIndex) => {
              return currentEl.label === d.khr
            })
            if (isKHR < 0) {
              // 不存在
              res[isCase].children.push({
                id: d.ajid + d.guid,
                label: d.khr,
                children: [{
                  id: d.guid,
                  label: d.zdzzh,
                  name: d.khr,
                  startTime: d.zdkssj,
                  endTime: d.zdjssj,
                  status: parseInt(d.qx_step) === 2
                }]
              })
            } else {
              // 该案是否存在此账号
              let isZDZZH = res[isCase].children[isKHR].children.findIndex((currentEl, currentIndex) => {
                return currentEl.label === d.zdzzh
              })
              if (isZDZZH < 0) { // 不存在
                res[isCase].children[isKHR].children.push({
                  id: d.guid,
                  label: d.zdzzh,
                  name: d.khr,
                  startTime: d.zdkssj,
                  endTime: d.zdjssj,
                  status: parseInt(d.qx_step) === 2
                })
              }
            }
          }
        })
        return res;
      },
      computCase(data) {
        let res = [];
        data.ZdxxTreeList.forEach(d => {
          // 是否存在案件
          let isCase = res.findIndex((currentEl, currentIndex) => {
            return currentEl.id === d.AJID
          })
          // 获得开始时间和结束时间
          let timeObj = data.ZdxxTreeTimeList.filter((r, i) => {
            return r.zdzzh === d.ZDZZH
          })
          let startTime, endTime;
          if (timeObj.length !== 0) {
            startTime = timeObj[0].mintime;
            endTime = timeObj[0].maxtime;
          }
          if (isCase < 0) {
            // 不存在
            res.push({
              id: d.AJID,
              label: d.AJMC === '' ? '(暂无案件名称)' : d.AJMC,
              children: [{
                id: d.AJID + d.GUID,
                label: d.KHR,
                children: [{
                  id: d.GUID,
                  label: d.ZDZZH,
                  name: d.KHR,
                  startTime: startTime,
                  endTime: endTime,
                  status: parseInt(d.qx_step) === 2
                }]
              }]
            })
          } else {
            // 该案是否存在此开户人员
            let isKHR = res[isCase].children.findIndex((currentEl, currentIndex) => {
              return currentEl.label === d.KHR
            })
            if (isKHR < 0) {
              // 不存在
              res[isCase].children.push({
                id: d.AJID + d.GUID,
                label: d.KHR,
                children: [{
                  id: d.GUID,
                  label: d.ZDZZH,
                  name: d.KHR,
                  startTime: startTime,
                  endTime: endTime,
                  status: parseInt(d.qx_step) === 2
                }]
              })
            } else {
              // 该案是否存在此账号
              let isZDZZH = res[isCase].children[isKHR].children.findIndex((currentEl, currentIndex) => {
                return currentEl.label === d.ZDZZH
              })
              if (isZDZZH < 0) { // 不存在
                res[isCase].children[isKHR].children.push({
                  id: d.GUID,
                  label: d.ZDZZH,
                  name: d.KHR,
                  startTime: startTime,
                  endTime: endTime,
                  status: parseInt(d.qx_step) === 2
                })
              }
            }
          }
        })
        return res;
      },
      checkCase() {
        // this.$refs.rightTree.filter(this.treeKeyword)
      },
      filterTree(value, data) {
        if (!value) {
          return true
        } else {
          return data.label.indexOf(value) !== -1
        }
      },
      manageTreeRender(h, { node, data, store }) {
        // 账单管理树渲染
        let style = '',
          attr = {},
          spanStyle = '';
        if (!data.status && node.childNodes.length === 0) {
          style = `color: #0000ff;`;
          attr = { title: '数据清洗中' };
        } else {
          style = 'color: #000';
        }
        if (data.label === this.currNumber) {
          spanStyle = `background-color:#20A0FF;color:#fff;padding:3px;`;
        }
        let arr = [];
        arr.push(h('span', {
          style: spanStyle,
          on: {
            click: (e) => {
              if (!data.children) {
                this.datas.billNumber = data.label;
                this.datas.name = data.name;
                this.currNumber = data.label;
              }
            }
          }
        }, node.label))
        if (node.childNodes.length === 0) {
          arr.push(h('span',
            {
              style: 'margin-left:5px;',
              on: {
                click: () => {
                  event.preventDefault();
                  this.contextStatus = true;
                  this.menuDatas.clientY = event.clientY;
                  this.menuDatas.clientX = event.clientX;
                  this.menuDatas.menu[0].sendData.v_zzh = data.label;
                  this.menuDatas.menu[0].sendData.v_type = 1;
                  this.menuDatas.menu[0].sendData.v_guid = data.id;
                  this.nodeData = data;
                }
              }
            }, '编辑')
            //   h('span', {
            //   style: '',
            //   on: {
            //     command: (e) => {
            //       if (!data.children) {
            //         let jsonData = {}
            //         if (e === 'delete') {
            //           this.$confirm('此操作将永久删除该数据，是否继续？', '温馨提示', 'warning').then(() => {
            //             jsonData.billNumber = data.label;
            //             this.menuDatas.menu[0].sendData.v_zzh = data.label;
            //             this.menuDatas.menu[0].sendData.v_type = 1;
            //             this.menuDatas.menu[0].sendData.v_guid = data.id;
            //             jsonData.guid = data.id;
            //             jsonData.types = 1;
            //             jsonData.data = data;
            //             this.deleteData(jsonData);
            //           });
            //         }
            //       }
            //     }
            //   }
            // }, [h('el-button', { style: '', props: { size: 'mini' }, nativeOn: {
            //   contextmenu: {
            //             this.menuDatas.menu[0].sendData.v_zzh = data.label;
            //             this.menuDatas.menu[0].sendData.v_type = 1;
            //             this.menuDatas.menu[0].sendData.v_guid = data.id;
            //   }
            // } }, '编辑'), h('el-dropdown-menu', {
            //   style: '',
            //   slot: 'dropdown'
            // }, [h('el-dropdown-item', { style: '', props: { command: 'delete' } }, '删除')])])
          )
        }
        return h('a', { style: style, attrs: attr }, arr)
      },
      renderContent(h, { node, data, store }) {
        let style = '',
          attr = {};
        if (!data.status && node.childNodes.length === 0) {
          style = `background-color: #ccc;
                 color: #000;`;
          attr = { title: '数据清洗中' };
        } else {
          style = 'color: #000';
        }
        return h(
          'a', { style: style, attrs: attr },
          node.label
        )
      },
      changeStatus() {
        this.contextStatus = false;
      },
      dataSplit() {
        let count = '',
          count1 = '',
          len1 = '',
          count2 = '',
          len2 = '';
        this.manageTreeData.forEach((value, index, array) => {
          value.children.forEach((value1, index1, array1) => {
            value1.children.forEach((value2, index2, array2) => {
              if (value2.$treeNodeId === this.nodeData.$treeNodeId) {
                len1 = array1.length;
                len2 = array2.length;
                count = index;
                count1 = index1;
                count2 = index2;
                return false;
              }
            })
          })
        })
        this.manageTreeData[count].children[count1].children.splice(count2, 1);
        if (len2 <= 1) {
          this.manageTreeData[count].children.splice(count1, 1);
          if (len1 <= 1) {
            this.manageTreeData.splice(count, 1);
            if (this.manageTreeData.length !== 0) {
              this.datas.billNumber = this.nodeData.label === this.datas.billNumber ? this.manageTreeData[0].children[0].children[0].label : this.datas.billNumber
              this.currNumber = this.datas.billNumber;
            } else {
              this.datas.billNumber = '';
            }
            return
          }
          this.datas.billNumber = this.nodeData.label === this.datas.billNumber ? this.manageTreeData[count].children[0].children[0].label : this.datas.billNumber
          this.currNumber = this.datas.billNumber
        } else {
          this.datas.billNumber = this.nodeData.label === this.datas.billNumber ? this.manageTreeData[count].children[count1].children[0].label : this.datas.billNumber;
          this.currNumber = this.datas.billNumber
        }
      }

    },
    created() {
      this.treeloading = true
    },
    mounted() {
      this.fetchAccoundTree()
      this.$(document).on('click', () => {
        this.contextStatus = false;
      })
    }
  }

</script>
