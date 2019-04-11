<template>
<!-- v-loading.body="loading" -->
<telList element-loading-text="话单正在初始化..." @call:showMiniModel="miniSider">
  <!-- 左导航 -->
  <div slot="sunWest">
    <sidebar @returnFocus="focusChange" @call:comm="commChange" :isFocus="sidebarFocus" :miniModel="miniModel"></sidebar>
  </div>
  <div slot="sunCenter" class="content-box">
    <!-- 通话详单分析 -->
    <detail v-show="currentComm==='detail'" ref="detail" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </detail>
    <!-- 通话规律分析 -->
    <law v-show="currentComm==='law'" ref="law" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </law>
    <!-- 通话频率分析 -->
    <frequency v-show="currentComm==='frequency'" ref="frequency" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </frequency>
    <!-- 居住地分析 -->
    <residence v-show="currentComm==='residence'" ref="residence" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </residence>
    <!-- 异常号码分析 -->
    <exception v-show="currentComm==='exception'" ref="exception" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </exception>
    <!-- 通话归属地分析 -->
    <attribution v-show="currentComm==='attribution'" ref="attribution" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </attribution>
    <!-- 通话基站分析 -->
    <station v-show="currentComm==='station'" ref="station" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </station>
    <!-- 相互通话分析 -->
    <converse v-show="currentComm==='converse'" ref="converse" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </converse>
    <!-- 共同联系人分析 -->
    <contacts v-show="currentComm==='contacts'" ref="contacts" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </contacts>
    <!-- 碰面分析 -->
    <meeting v-show="currentComm==='meeting'" ref="meeting" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </meeting>
    <!-- 关联分析 -->
    <relation v-show="currentComm==='relation'" ref="relation" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </relation>
    <manage :datas='information' v-show="currentComm==='manage'" ref="manage" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manage>
    <conversion :dataName="information" v-show="currentComm==='conversion'" ref="conversion" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:current-tab="deliveryNumber=null">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </conversion>
    <!-- 侧边栏(右工具按钮) -->
    <side-right-box :unfoldHandle="showRightBar" style="width:250px;" v-loading="loading" v-show="currentComm !== 'manage'">
      <el-input v-model="treeKeyword" style="width: 100%;margin-bottom:10px" placeholder="输入案件名称或电话号码进行搜索">
        <!-- <el-button slot="append" @click="checkCase()" icon="icon iconfont icon-sousuo"></el-button> -->
      </el-input>
      <el-tree ref="rightTree" 
      :default-checked-keys="treeData[0]?[treeData[0].children[0].children[0].id]:[]" 
      :filter-node-method="filterTree" 
      :default-expanded-keys="treeData[0]?[treeData[0].children[0].id]:[]"
       class="cat-tree" 
       :data="treeData" 
       :show-checkbox="true"
        node-key="id" 
        @check-change="rightTreeChange"
        :render-content = "renderContent"
        >
        </el-tree>
    </side-right-box>
 <side-right-box :unfoldHandle="showRightBar" style="width:250px;" v-loading="loading" v-show="currentComm === 'manage'">
      <el-input v-model="treeKeyword1" style="width: 100%;margin-bottom:10px" placeholder="输入案件名称或电话号码进行搜索">
        <!-- <el-button slot="append" @click="checkCase()" icon="icon iconfont icon-sousuo"></el-button> -->
      </el-input>
      <el-tree ref="rightTree1" 
      :default-checked-keys="manageTreeData[0]?[manageTreeData[0].children[0].children[0].id]:[]" 
 :filter-node-method="filterTree"
      :default-expanded-keys="manageTreeData[0]?[manageTreeData[0].children[0].id]:[]" 
      class="cat-tree" 
      :data="manageTreeData" 
        node-key="id"
        :show-checkbox="false"
        :render-content = "manageTreeRender"
        >
        </el-tree>
    </side-right-box>
    <dialog-case :dialog="caseDialog" @update:caseId="updateCaseId"></dialog-case>
  <el-button v-show="miniModel" type="primary" title="话单转化" size="mini" icon="icon iconfont icon-dianhuadingdan" style="position: absolute;bottom: 150px;left:0;padding:0;height:48px;border:0;width:220px;" @click="conversion('conversion')">话单转化</el-button>
  <el-button v-show="!miniModel" type="primary" title="话单转化" size="mini" icon="icon iconfont icon-dianhuadingdan" style="position:absolute;bottom:150px;left:0;padding:0;height:48px;border:0;margin:0;width:64px;" @click="conversion('conversion')"></el-button>
  <span></span>
  <el-button v-show="miniModel" :disabled="loading" type="primary" title="话单管理" size="mini" icon="icon iconfont icon-dianhuadingdan" style="position: absolute;bottom: 100px;left: 0;padding: 0;height: 48px;border: 0;width: 220px;" @click="commonManage('manage')">话单管理</el-button>
  <el-button v-show="!miniModel" :disabled="loading" type="primary" title="话单管理" size="mini" icon="icon iconfont icon-dianhuadingdan" style="position: absolute;bottom: 100px;left: 0;padding: 0;height: 48px;border: 0;margin:0;width: 64px;" @click="commonManage('manage')"></el-button>
  <span></span>
  <el-button v-show="miniModel" type="primary" title="话单导入" size="mini" icon="icon iconfont icon-download" style="position:absolute;bottom:50px;left: 0;padding: 0;height: 48px;border: 0;width: 220px;" @click="importFile">话单导入</el-button>
  <el-button v-show="!miniModel" type="primary" title="话单导入" size="mini" icon="icon iconfont icon-download" style="position:absolute;bottom:50px;left: 0;padding: 0;height: 48px;border: 0;margin:0;width: 64px;" @click="importFile"></el-button>
  <input v-if="fileInput===true" type="file" ref="importUploadBtn" class="hide" accept=".csv,.mdb,.accdb,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="v=>fileChange(v,1)">
  <import-dialog :dialog="dislogImport" :title="fileInfo.title" :file="fileInfo.file" :type="1" :caseInfo="null" @close="clearFileInput"></import-dialog>
    <!-- 地图查看 -->
  <map-view-dialog :dialog="addressDialog" :data="mapData" @close="addressDialog = false" :size="'large--fixed'"></map-view-dialog>
  <contextMenu :menuData="menuDatas" v-show="contextStatus" @changeMenuStatus="changeStatus" @deleteSplit="dataSplit"></contextMenu>
  </div>

</telList>
</template>
<style lang="scss" scoped>
  .content-box {
    height: 100%;
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
  import { FETCH_TELLIST_TREE, FETCH_TELMLIST_TREE } from '../../../store/types'
  import baseMixin from '../baseMixin'

  // import { getOnlyArray } from '../../../utils/util'

  import telList from '../layout' // 列表
  import sidebar from './sidebar' // 左导航
  import detail from './detail/index' // 通话详单分析
  import law from './law/index' // 通话规律分析
  import frequency from './frequency/index' // 通话频率分析
  import residence from './residence/index' // 居住地分析
  import exception from './exception/index' // 异常号码分析
  import attribution from './attribution/index' // 通话归属地分析
  import station from './station/index' // 通话基站分析
  import converse from './converse/index' // 相互通话分析
  import contacts from './contacts/index' // 共同联系人分析
  import meeting from './meeting/index' // 碰面分析
  import relation from './relation/index' // 关联分析
  import manage from './listManage/index' // 话单管理
  import conversion from './conversion/index' // 话单抓化
  import mapViewDialog from './map-view-dialog'
  import bus from '../../../utils/bus'
  import contextMenu from '../common/contextMenu' // 右击菜单框

  export default {
    mixins: [baseMixin],
    components: {
      sidebar,
      telList,
      detail,
      law,
      frequency,
      residence,
      exception,
      attribution,
      station,
      converse,
      contacts,
      meeting,
      relation,
      manage,
      conversion,
      mapViewDialog,
      contextMenu
    },
    data() {
      return {
        treeKeyword: '',
        treeKeyword1: '',
        loading: false,
        treeData: [],
        manageTreeData: [],
        information: {
          phone: '',
          name: ''
        },
        currNumber: '',
        mapData: {
          pos: {
            jd: '109.90821838',
            wd: '27.40741539'
          }
        },
        addressDialog: false,
        contextStatus: false,
        menuDatas: {
          menu: [{
            name: '删除',
            method: 'deleteOne',
            sendData: {
              V_GUID: '',
              V_SJHM: '',
              V_TYPE: ''
            }
          }],
          types: 'listManage',
          clientY: '',
          clientX: '',
          id: 'listIndex'
        },
        nodeData: ''
      }
    },
    computed: {
      ...mapState(['analysisTelList'])
    },
    watch: {
      treeKeyword(v) {
        this.$refs.rightTree.filter(v)
      },
      treeKeyword1(v) {
        this.$refs.rightTree1.filter(v)
      },
      currentComm(v) {
        if (v === 'manage' && this.manageTreeData.length === 0) {
          this.fetchNumberTree('manage')
        }
      }
    },
    methods: {
      reload() {
        // this.treeData = []
        // this.fetchNumberTree()
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
        this.fetchNumberTree()
        this.caseDialog = false
      },
      /**
       * [fetchNumberTree 拉取右侧话单树]
       * @return {[type]} [description]
       */
      fetchNumberTree(type) {
        let api;
        if (!type) {
          api = FETCH_TELLIST_TREE;
        } else {
          api = FETCH_TELMLIST_TREE;
        }
        if (this.caseId === '') {
          //   this.caseDialog = true
          // } else {
          this.dispatch(api, { v_ajid: '' }).then(() => {
            let res = []
            let treeList;
            if (!type) {
              treeList = this.analysisTelList.tree;
            } else {
              treeList = this.analysisTelList.mListTree;
              this.information.phone = treeList[0].sjhm;
              this.information.name = treeList[0].XM;
              this.currNumber = treeList[0].sjhm;
            }
            treeList.forEach(d => {
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
                    label: d.XM,
                    children: [{
                      id: d.guid,
                      label: d.sjhm,
                      name: d.XM,
                      startTime: d.zzthrq,
                      endTime: d.zwthrq,
                      status: parseInt(d.qx_step) === 3
                    }]
                  }]
                })
              } else {
                // 该案是否存在此开户人员
                let isKHR = res[isCase].children.findIndex((currentEl, currentIndex) => {
                  return currentEl.label === d.XM
                })
                if (isKHR < 0) {
                  // 不存在
                  res[isCase].children.push({
                    id: d.ajid + d.guid,
                    label: d.XM,
                    children: [{
                      id: d.guid,
                      label: d.sjhm,
                      name: d.XM,
                      startTime: d.zzthrq,
                      endTime: d.zwthrq,
                      status: parseInt(d.qx_step) === 3
                    }]
                  })
                } else {
                  // 该案是否存在此手机号码
                  let isSJHM = res[isCase].children[isKHR].children.findIndex((currentEl, currentIndex) => {
                    return currentEl.label === d.sjhm
                  })
                  if (isSJHM < 0) { // 不存在
                    res[isCase].children[isKHR].children.push({
                      id: d.guid,
                      label: d.sjhm,
                      name: d.XM,
                      startTime: d.zzthrq,
                      endTime: d.zwthrq,
                      status: parseInt(d.qx_step) === 3
                    })
                  }
                }
              }
            })
            if (!type) {
              this.treeData = res;
              this.updateDefaultTreeChecker('rightTree')
            } else {
              this.manageTreeData = res;
              this.updateDefaultTreeChecker('rightTree1')
            }
            this.loading = false
          })
        }
      },
      /** * [fetchNumberTree 拉取右侧话单详细列表] * @return {[type]} [description] */
      checkCase() {
        // console.log('关键词', this.keyword)
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
                this.information.phone = data.label;
                this.information.name = data.name;
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
                contextmenu: () => {
                  event.preventDefault();
                  this.contextStatus = true;
                  this.menuDatas.clientY = event.clientY;
                  this.menuDatas.clientX = event.clientX;
                  this.menuDatas.menu[0].sendData.V_SJHM = data.label;
                  this.menuDatas.menu[0].sendData.V_TYPE = 1;
                  this.menuDatas.menu[0].sendData.V_GUID = data.id;
                  this.nodeData = data;
                }
              }
            }, '编辑')
            //   h('el-dropdown', {
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
      checkParent(val) {
        let valParent = val.parent;
        if (valParent ? valParent.childNodes.length > 1 : false || !valParent) {
          return valParent ? val : val.childNodes[0];
        } else {
          let node = this.checkParent(valParent);
          return node;
        }
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
          this.manageTreeData[count].children.splice(count1,
            1);
          if (len1 <= 1) {
            this.manageTreeData.splice(count, 1);
            if (this.manageTreeData.length !== 0) {
              this.information.phone = this.nodeData.label === this.information.phone ? this.manageTreeData[0].children[0].children[0].label : this.information.phone
              this.currNumber = this.information.phone
            } else {
              this.information.phone = '';
            }
            return
          }
          this.information.phone = this.nodeData.label === this.information.phone ? this.manageTreeData[count].children[0].children[0].label : this.information.phone
          this.currNumber = this.information.phone
        } else {
          this.information.phone = this.nodeData.label === this.information.phone ? this.manageTreeData[count].children[count1].children[0].label : this.information.phone;
          this.currNumber = this.information.phone
        }
      }
    },
    created() {
      console.log(this.currentComm, 'this.currentComm')
    },
    mounted() {
      this.fetchNumberTree()
      document.title = '话单分析-智慧警务';
      bus.$on('tel-map-open', ({ pos: { jd, wd } }) => {
        this.mapData.pos.jd = jd;
        this.mapData.pos.wd = wd;
        this.addressDialog = true;
      })
      this.$(document).on('click', () => {
        this.contextStatus = false;
      })
    }
  }

</script>
