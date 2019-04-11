<template>
<telList v-loading.body="loading" element-loading-text="轨迹分析正在初始化..." @call:showMiniModel="miniSider">
  <!-- 左导航 -->
  <div slot="sunWest">
    <sidebar @call:comm="commChange" :miniModel="miniModel"></sidebar>
  </div>
  <div slot="sunCenter" class="content-box">
    <!-- 轨迹基本分析 -->
    <basic v-show="currentComm==='basic'" ref="basic" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </basic>
    <!-- 轨迹对比分析 -->
    <contrast v-show="currentComm==='contrast'" ref="contrast" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </contrast>
    <!-- 轨迹规律分析 -->
    <rule v-show="currentComm==='rule'" ref="rule" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </rule>
    <!-- 特定轨迹分析 -->
    <specific v-show="currentComm==='specific'" ref="specific" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </specific>
    <!-- 同行详查 -->
    <together v-show="currentComm==='together'" ref="together" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </together>
    <!-- 同住详查 -->
    <cohabit v-show="currentComm==='cohabit'" ref="cohabit" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </cohabit>
    <!-- 地图展示 -->
    <mapShow v-if="currentComm==='mapShow'" ref="mapShow" :currentComm="currentComm" :deliveryNumber="deliveryNumber" @update:databox="updateDateBox" @update:current-tab="deliveryNumber=null" @on-change-tableData="changeTableData">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </mapShow>

    <!-- 侧边栏(右工具按钮) -->
    <side-right-box :unfoldHandle="showRightBar" style="width:250px;z-index:999" v-loading="loading">
      <el-input v-model="addKeyword" style="width: 100%" placeholder="输入证件号码进行添加" icon="icon iconfont icon-plus" :on-icon-click="addPerson">
        <!-- <el-button slot="append" @click="addPerson" icon="icon iconfont icon-plus" style="border:none"></el-button> -->
      </el-input>
      <el-tree ref="rightTree" :default-checked-keys="treeData[0]&&!addKeyword?[treeData[0].children[0].children[0].id]:[]" :filter-node-method="filterTree" :default-expanded-keys="treeData[0]&&!addKeyword?[treeData[0].id]:[]" class="cat-tree" :data="treeData" :show-checkbox="true"
        node-key="id" @check-change="rightTreeChange"></el-tree>
      <el-table height="202" v-show="caseMen[currentComm].length>0" border :data="caseMen[currentComm]" style="width:250px">
        <el-table-column width="52px" align="center" label="姓名" prop="name"></el-table-column>
        <el-table-column align="center" label="证件号" prop="keyVal"></el-table-column>
        <el-table-column align="center" width="40px" label="操作">
          <template scope='scope'>
            <el-button size="small" type="primary" icon="delete" @click="deleteChecked(scope.row,scope.$index)"></el-button>
          </template>
</el-table-column>
</el-table>
</side-right-box>

<dialog-case :dialog="caseDialog" @update:caseId="updateCaseId"></dialog-case>
</div>
</telList>
</template>
<style lang="scss" scoped>
  .content-box {
    height: 100%;
    .side-box {
      overflow: hidden;
      top: 97px;
      z-index: 10;
      height: calc(100% - 130px);
    }
    .cat-tree {
      border: none;
      padding-top: 10px;
      height: calc(100vh - 370px);
      overflow-y: scroll;
      padding-bottom: 15px;
    }
  }

  .sunCenter {
    overflow: hidden;
    .side-box {
      top: 97px;
      z-index: 10;
      height: calc(100% - 130px);
    }
    .el-tree {
      border: none;
      padding-bottom: 50px;
    }
  }

  .pgis-sidebar {
    display: none;
  }

  .border-card {
    .el-tabs__content {
      padding: 0;
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_ANALYZE_LIST_BY_USER } from '../../../store/types'
  import baseMixin from '../baseMixin'

  // import { getOnlyArray } from '../../../utils/util'
  import telList from '../layout' // 列表
  import sidebar from './sidebar2' // 左导航
  import basic from './basic/index.vue' // 基本轨迹
  import contrast from './contrast/index.vue' // 对比轨迹
  import rule from './rule/index.vue' // 轨迹规律分析
  import together from './together/index.vue' // 同行详情
  import specific from './specific/index.vue' // 特定轨迹分析
  import cohabit from './cohabit/index.vue' // 同住详查
  import mapShow from './map/index.vue' // 地图展示

  export default {
    mixins: [baseMixin],
    components: {
      sidebar,
      telList,
      basic, // 轨迹基本分析
      contrast, // 轨迹对比分析
      rule, // 轨迹规律分析
      together, // 同行详情
      specific, // 特定轨迹分析
      cohabit, // 同住详查
      mapShow // 地图展示
    },
    data() {
      return {
        currentComm: 'basic',
        treeKeyword: '',
        loading: false,
        treeData: [],
        addKeyword: '',
        caseMenList: [],
        caseMen: {
          basic: [], // 轨迹基本分析
          contrast: [], // 轨迹对比分析
          rule: [], // 轨迹规律分析
          together: [], // 同行详情
          specific: [], // 特定轨迹分析
          cohabit: [], // 同住详查
          mapShow: [] // 地图展示
        }
        // caseMen: [
        //   { name: '李四', number: '15814890638' }
        // ]
      }
    },
    computed: {
      ...mapState(['analysisLocus', 'analysisTelList'])
    },
    watch: {
      treeKeyword(v) {
        this.$refs.rightTree.filter(v)
      },
      currentComm(val) {
        this.handleSingleTab(val)
      }
    },
    methods: {
      miniSider(val) {
        this.miniModel = !val
      },
      /**
       * [updateCaseId 获取案件ID]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      updateCaseId(val) {
        this.caseId = val
        this.fetchNumberTree()
        this.caseDialog = false
      },
      /**
       * [fetchNumberTree 拉取右侧话单树]
       * @return {[type]} [description]
       */
      fetchNumberTree() {
        if (this.caseId === '') {
          let startTimeObj = new Date(new Date().getTime() - 3600 * 1000 * 24 * 180);
          let startTime = this.dateFormat(startTimeObj, 'yyyy-MM-dd');
          let endTime = this.dateFormat(new Date(), 'yyyy-MM-dd')
          this.loading = true
          this.dispatch(FETCH_ANALYZE_LIST_BY_USER, {}).then(() => {
            let res = [],
              treeData = []
            treeData = this.analysisLocus.tree.filter(d => d.sfz !== null)
            treeData.forEach(d => {
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
                    id: d.ajid + d.id,
                    label: d.xm,
                    children: [{
                      id: d.id,
                      label: d.sfz,
                      name: d.xm,
                      startTime: startTime,
                      endTime: endTime
                    }]
                  }]
                })
              } else {
                // 该案是否存在此开户人员
                let isKHR = res[isCase].children.findIndex((currentEl, currentIndex) => {
                  return currentEl.label === d.xm
                })
                if (isKHR < 0) {
                  // 不存在
                  res[isCase].children.push({
                    id: d.ajid + d.id,
                    label: d.xm,
                    children: [{
                      id: d.id,
                      label: d.sfz,
                      name: d.xm,
                      startTime: startTime,
                      endTime: endTime
                    }]
                  })
                } else {
                  // 该案是否存在此身份证号码
                  let isSFZ = res[isCase].children[isKHR].children.findIndex((currentEl, currentIndex) => {
                    return currentEl.label === d.sfz
                  })
                  if (isSFZ < 0) { // 不存在
                    res[isCase].children[isKHR].children.push({
                      id: d.id,
                      label: d.sfz,
                      name: d.xm,
                      startTime: startTime,
                      endTime: endTime
                    })
                  }
                }
              }
            })

            this.treeData = res
            this.updateDefaultTreeChecker('rightTree')
            this.loading = false
          })
        }
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
      // 添加号码
      addPerson() {
        var cP = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[0-9|X|x]$/ // 18位正则
        var cN = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/ // 15位正则
        if (!(cP.test(this.addKeyword) || cN.test(this.addKeyword))) {
          // this.$alert('请输入正确的身份证', '温馨提示');
          this.$message({
            message: '请输入正确的身份证',
            type: 'warning',
            duration: 2000
          })
          return false
        } else {
          this.caseMen[this.currentComm].forEach(d => {
            if (d.keyVal === this.addKeyword) {
              this.$message({
                message: '请勿输入重复的证件号码',
                type: 'warning',
                duration: 2000
              })
              return false
            }
          })
          let addData = {
            name: '手动输入',
            label: this.addKeyword,
            guid: this.addKeyword
          }
          this.rightTreeChange(addData, true)
        }
      },
      // 删除号码
      deleteChecked(item, index) {
        if (this.$refs[this.currentComm].singleTab) {
          if (item.name === '手动输入') {
            this.$refs[this.currentComm].tabs[0].vals.splice(this.$refs[this.currentComm].tabs[0].vals.indexOf(item.keyVal), 1)
            this.$refs[this.currentComm].tabs[0].names.splice(this.$refs[this.currentComm].tabs[0].names.indexOf(item.name), 1)
            this.$refs[this.currentComm].tabs[0].guid.splice(this.$refs[this.currentComm].tabs[0].guid.indexOf(item.guid), 1)
            this.$refs[this.currentComm].tabs[0].keyVal = this.$refs[this.currentComm].tabs[0].keyVal.split(',').filter(d => d !== item.keyVal).toString()
          }
          this.$refs[this.currentComm].removeTab({ guid: item.guid })
        } else {
          this.$refs[this.currentComm].removeItem(item.keyVal + '|' + item.name)
        }
      },
      // 改变tableData
      changeTableData(data) {
        if (data === 'specific' || data === 'contrast') {
          this.handleSingleTab(data)
          return
        }
        this.caseMen[this.currentComm] = this.$refs[this.currentComm].tabs
        for (var key in this.caseMen) {
          if (key !== this.currentComm && key !== 'specific' && key !== 'contrast') {
            if (this.$refs[key]) {
              this.$refs[key].tabs = this.$refs[this.currentComm].tabs
            }
          }
        }
      },
      // 判断是否为单标签
      handleSingleTab(val) {
        if (this.$refs[val]) {
          if (this.$refs[val].singleTab) {
            setTimeout(() => {
              this.caseMen[val] = []
              if (!this.$refs[val].currentTabItem) return
              let names = this.$refs[val].currentTabItem.names,
                guid = this.$refs[val].currentTabItem.guid
              this.$refs[val].currentTabItem.vals.forEach((keyVal, index, arr) => {
                this.caseMen[val].push({ name: names[index], keyVal: keyVal, guid: guid[index] })
              })
            }, 300)
          } else {
            this.caseMen[val] = this.$refs[val].tabs
          }
        }
      },
      validSfzh(sfzh) { // 验证是否为身份证号
        let reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g;
        let reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/g;
        if (!reg1.test(sfzh) && !reg2.test(sfzh)) {
          return false
        } else {
          return true
        }
      }
    },
    created() {},
    mounted() {
      this.fetchNumberTree()
      document.title = '轨迹分析-智慧警务'
      if (this.validSfzh(this.$route.query.key)) { // 慧搜小卡片点击进入轨迹分析自动分析轨迹
        console.log(this.$route.query.key, 'this.$route.query.key')
        this.addKeyword = this.$route.query.key
        this.addPerson();
      }
    }
  }

</script>
