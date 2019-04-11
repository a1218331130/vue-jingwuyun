<template>
  <div class="resourceCont">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" style="position: relative;">
      <el-form :model="form" :inline="true" class="searchForm" label-width="60px">
        <el-form-item>
          <el-input v-model="form.input" placeholder="请输入表名" @change="query" @keyup.enter=""></el-input>
        </el-form-item>
      </el-form>
      <el-tab-pane v-show="activeName === 'resource'" label="系统资源" name="resource">
        <div class="table">
          <div class="qureyBox" v-for="(item,indexs) in resourceTableInfo" :key="indexs">
            <span>{{item.Name}}：</span>
            <el-checkbox-group :max="2" v-model="checkedArr">
              <el-checkbox v-for="(it,index) in item.Tables" :key="index" :label="it.ID" @change="getTableInfo(it,index)">{{it.ZyName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-show="activeName === 'myResource'" label="我的比对资源" name="myResource">
        <div class="table">
          <div class="qureyBoxs">
            <el-checkbox-group :max="2" v-model="checkedArr">
              <el-checkbox v-for="(it,index) in myResourceTableInfo" :key="index" :label="it.ID" @change="getTableInfo(it,index)">{{it.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>  
      </el-tab-pane>
    </el-tabs>
    <div class="form">
      <div class="formTitle">
        <span>已选择</span>
        <span @click="clearFormList"><i class="el-icon-delete" style="color:#20a0ff;padding:0px 5px;"></i>清空</span>
      </div>
      <div class="formCont">
        <div v-for="(table,ind) in tableName" :key="ind">
          <p>{{table.name}} <span style="color:#2894ff;"> ({{table.count}}条)</span></p>
          <div>
            <el-radio-group v-model="radio" @change="setMainTable($event)">
              <el-radio class="radio" :label="ind">设为主表</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="relation">
      <div class="relationTitle">关联条件</div>
      <div class="relationCont">
        <div class="optionalTable">
          <span v-for="(el,i) in tableName" :key="i">{{el.name}}</span>
        </div>
        <div v-for="(item,index1) in relationConditionArr" :key="index1">
          <span>关联{{relationConditionArr.length === 1 ? '' : (index1 + 1)}}：</span>
          <div>
            <el-select v-model="item.FieldName1" placeholder="请选择" filterable @change="getLeftRequirement">
              <el-option v-for="(o1,index2) in selectConditionArr[0]" :key="index2" :label="o1.NameCn" :value="activeName === 'resource'?o1.Name:o1.ID"></el-option>
            </el-select>
            <span>=</span>
            <el-select v-model="item.FieldName2" placeholder="请选择" filterable @change="getRightRequirement">
              <el-option v-for="(o2,index3) in selectConditionArr[1]" :key="index3" :label="o2.NameCn" :value="activeName === 'resource'?o2.Name:o2.ID"></el-option>
            </el-select>
            <div class="el-icon-delete" style="color:#2894FF;padding:5px;margin-left:20px;" @click="deleteCondition(index1)"></div>
          </div>
        </div>
        <div class="add" @click="addCondition()">+</div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="downStep(3)">下一步</el-button>
      <el-button type="primary" @click="comparisonResult()">比对结果</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .table {
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    .el-tabs {
      margin: 0;
    }
  }

  .qureyBox {
    width: 97%;
    padding: 5px 0;
    display: -webkit-box;
    border-bottom: 1px solid #ddd;
  }

  .qureyBoxs {
    width: 97%;
    display: -webkit-box;
    line-height: 30px;
  }

  .el-checkbox+.el-checkbox {
    margin-right: 15px;
    margin-left: 0px;
  }

  .el-checkbox {
    margin-right: 15px;
  }

  .form {
    margin: 10px 0;
    .formTitle {
      height: 35px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #ddd;
      color: #868686;
      span:nth-child(2) {
        height: 35px;
        display: flex;
        align-items: center;
        border-left: 1px solid #ddd;
        cursor: pointer;
      }
    }
    .formCont {
      display: flex;
      justify-content: center;
      font-size: 14px;
      margin-top: 10px;
      &>div {
        width: 300px;
        height: 100px;
        border: 1px solid #ddd;
        margin-left: 20px;
        p {
          margin: 0;
          height: 60px;
          line-height: 60px;
          text-align: center;
        }
        div {
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ececec;
        }
      }
    }
  }

  .relation {
    border: 1px solid #ddd;
    padding-bottom: 20px;
    .relationTitle {
      height: 35px;
      line-height: 35px;
      padding: 0 10px;
      color: #868686;
      border-bottom: 1px solid #ddd;
    }
    .relationCont {
      .optionalTable {
        height: 40px;
        margin: 0px auto;
        &>span {
          width: 40%;
          display: inline-block;
          text-align: center;
        }
      }
      &>div {
        width: 640px;
        height: 50px;
        margin: 0 auto 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        &>div {
          height: 50px;
          padding: 0px 10px;
          border: 1px dashed #ddd;
          display: flex;
          align-items: center;
          &>span {
            margin: 0 20px;
          }
        }
      }
      .add {
        width: 640px;
        height: 35px;
        border: 1px dashed #ddd;
        color: #868686;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    cursor: pointer;
    button {
      border-radius: 3px;
    }
  }

  .searchForm {
    position: absolute;
    top: -37px;
    right: 5px;
    z-index: 1000;
    display: flex;
    justify-content: flex-end;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_GET_ZYML, FETCH_GET_TABLE_INFOL, FETCH_MY_DATA_LIST } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  import bus from '../../../../utils/bus'
  import { clone } from '../../../../utils/util'
  export default {
    mixins: [mixin],
    data() {
      return {
        activeName: 'resource',
        filterList: [{
          NameCn: '',
          isMaster: '',
          number: '',
          tableID: '',
          options: '',
          list: [],
          parameter: []
        }, {
          NameCn: '',
          isMaster: '',
          number: '',
          tableID: '',
          options: '',
          list: [],
          parameter: []
        }],
        form: {
          input: ''
        },
        radio: '',
        checkedArr: [],
        tableName: [],
        resourceTableInfo: [],
        myResourceTableInfo: [],
        /* 记录对比条件个数 */
        relationConditionArr: [{
          FieldName1: '',
          FieldName2: '',
          TableID1: '',
          TableID2: '',
          TableIndex1: '',
          TableIndex2: ''
        }],
        /* 选中筛选条件数组 */
        selectConditionArr: [
          [],
          []
        ],
        tableType: 1,
        comparisonData: {
          SourceType: 2,
          SjbdTableModels: [],
          SjbdTableGxModels: [],
          Columns: [],
          SjbdTableFilterModels: []
        }
      }
    },
    computed: {
      ...mapState(['dataComparison'])
    },
    watch: {
      checkedArr(newVal, old) {
        console.log('newVal', newVal)
        console.log('old', old)
        if (newVal.length === 1 && old.length === 2) {
          this.radio = 0;
          let idx = old.indexOf(newVal[0])
          this.selectConditionArr.splice({ 0: 1, 1: 0 }[idx], 1);
          this.tableName.splice({ 0: 1, 1: 0 }[idx], 1)
          old.forEach((d, i) => {
            if (d !== newVal[0]) {
              this.comparisonData.SjbdTableModels.splice(i, 1);
            }
          })
          this.relationConditionArr.forEach((item, idx) => {
            item.FieldName2 = ''
          })
        } else if (newVal.length === 0 && old.length === 1) {
          this.relationConditionArr = [{
            FieldName1: '',
            FieldName2: '',
            TableID1: '',
            TableID2: '',
            TableIndex1: '',
            TableIndex2: ''
          }];
          this.selectConditionArr[0] = []
          this.selectConditionArr[1] = []
          this.comparisonData.SjbdTableModels = []
          this.tableName = []
        }
      }
    },
    methods: {
      // 初始化哪信息资源
      initTableInfo() {
        this.dispatch(FETCH_GET_ZYML, { Keyword: '', PageIndex: 1, PageSize: 100 }).then(() => {
          this.resourceTableInfo = clone(this.dataComparison.GetZyml).filter(d => {
            if (d.Tables.length !== 0) {
              return d;
            }
          })
        })
      },
      // 点击切换调取我的资源列表
      handleClick(tab, e) {
        this.activeName = tab.name
        if (this.activeName === 'myResource') {
          this.dispatch(FETCH_MY_DATA_LIST, { Keyword: '', PageIndex: 1, PageSize: 100, SourceType: '' }).then(() => {
            this.myResourceTableInfo = clone(this.dataComparison.myDataList.PageData)
          })
        }
      },
      // 表名搜索
      query() {
        if (this.activeName === 'myResource') {
          this.dispatch(FETCH_MY_DATA_LIST, { Keyword: this.form.input, PageIndex: 1, PageSize: 100, SourceType: '' }).then(() => {
            this.myResourceTableInfo = this.dataComparison.myDataList.PageData
          })
        } else if (this.activeName === 'resource') {
          this.dispatch(FETCH_GET_ZYML, { Keyword: this.form.input, PageIndex: 1, PageSize: 100 }).then(() => {
            this.resourceTableInfo = this.dataComparison.GetZyml.filter(d => {
              if (d.Tables.length !== 0) {
                return d;
              }
            })
          })
        }
      },
      // 收集表--左比对条件
      getLeftRequirement() {
        if (this.activeName === 'resource') {
          this.relationConditionArr.forEach((e, i) => {
            this.selectConditionArr[0].forEach((el, j) => {
              if (e.FieldName1 === el.Name) {
                // this.relationConditionArr[i].FieldName1 = el.Name;
                this.relationConditionArr[i].TableID1 = this.comparisonData.SjbdTableModels[0].TableID;
                this.relationConditionArr[i].TableIndex1 = this.comparisonData.SjbdTableModels[0].TableIndex;
              }
            })
          })
        } else {
          this.relationConditionArr.forEach((e, i) => {
            this.selectConditionArr[0].forEach((el, j) => {
              if (e.FieldName1 === el.ID) {
                // this.relationConditionArr[i].FieldName1 = el.Name;
                this.relationConditionArr[i].TableID1 = this.comparisonData.SjbdTableModels[0].TableID;
                this.relationConditionArr[i].TableIndex1 = this.comparisonData.SjbdTableModels[0].TableIndex;
              }
            })
          })
        }
      },
      // 收集表--右比对条件
      getRightRequirement() {
        if (this.activeName === 'resource') {
          this.relationConditionArr.forEach((e, i) => {
            this.selectConditionArr[0].forEach((el, j) => {
              if (e.FieldName1 === el.Name) {
                // this.relationConditionArr[i].FieldName1 = el.Name;
                this.relationConditionArr[i].TableID2 = this.comparisonData.SjbdTableModels[1].TableID;
                this.relationConditionArr[i].TableIndex2 = this.comparisonData.SjbdTableModels[1].TableIndex;
              }
            })
          })
        } else {
          this.relationConditionArr.forEach((e, i) => {
            this.selectConditionArr[0].forEach((el, j) => {
              if (e.FieldName1 === el.ID) {
                // this.relationConditionArr[i].FieldName1 = el.Name;
                this.relationConditionArr[i].TableID2 = this.comparisonData.SjbdTableModels[1].TableID;
                this.relationConditionArr[i].TableIndex2 = this.comparisonData.SjbdTableModels[1].TableIndex;
              }
            })
          })
        }
      },
      // 获取对比条件
      getRemoteConditions(id, callback) {
        let arr = null;
        if (this.activeName === 'resource') {
          this.tableType = 1
        } else {
          this.tableType = 2
        }
        this.dispatch(FETCH_GET_TABLE_INFOL, { TableType: this.tableType, TableID: id }).then(() => {
          arr = clone(this.dataComparison.GetTableInfo.Columns);
          return callback(arr);
        })
      },
      // 删除比对条件
      deleteCondition(index) {
        this.relationConditionArr.splice(index, 1);
      },
      // 增加比对条件
      addCondition() {
        this.relationConditionArr.push({
          FieldName1: '',
          FieldName2: '',
          TableID1: '',
          TableID2: '',
          TableIndex1: '',
          TableIndex2: ''
        });
      },
      // 获取表信息
      getTableInfo(item, index) {
        if (this.checkedArr.indexOf(item.ID) !== -1) {
          this.$set(item, 'checkStatus', true)
        } else {
          this.$set(item, 'checkStatus', false)
        }
        if (item.checkStatus) {
          /* 如果只有一张表的情况 */
          if (this.checkedArr.length === 1) {
            this.getRemoteConditions(item.ID, (data) => {
              this.$set(this.selectConditionArr, '0', data);
              this.$set(this.selectConditionArr, '1', data);
            })
            // 获取表名
            if (this.activeName === 'resource') {
              this.tableName.push({ name: item.ZyName, count: item.EsCount })
              this.tableType = 1
            } else {
              this.tableName.push({ name: item.Name, count: item.Count })
              this.tableType = 2
            }
            // 获取选中表的ID
            this.comparisonData.SjbdTableModels.push({
              IsMaster: 1,
              TableIndex: 0,
              TableID: item.ID,
              TableType: this.tableType
            });
            this.radio = 0;
          } else {
            if (this.activeName === 'resource') {
              this.tableType = 1
              this.tableName.push({ name: item.ZyName, count: item.EsCount })
            } else {
              this.tableType = 2
              this.tableName.push({ name: item.Name, count: item.Count })
            }
            this.comparisonData.SjbdTableModels.push({
              IsMaster: 0,
              TableIndex: 1,
              TableID: item.ID,
              TableType: this.tableType
            });
            this.getRemoteConditions(item.ID, (data) => {
              this.$set(this.selectConditionArr, '1', data);
            });
            this.relationConditionArr.forEach((item, idx) => {
              item.FieldName2 = ''
            })
          }
        }
      },
      // 设置主表功能
      setMainTable(e) {
        if (this.checkedArr.length === 2 && e === 0) {
          this.comparisonData.SjbdTableModels[0].IsMaster = 1;
          this.comparisonData.SjbdTableModels[1].IsMaster = 0;
        } else if (this.checkedArr.length === 2 && e === 1) {
          this.comparisonData.SjbdTableModels[0].IsMaster = 0;
          this.comparisonData.SjbdTableModels[1].IsMaster = 1;
        } else {
          this.comparisonData.SjbdTableModels[0].IsMaster = 1;
        }
      },
      // 清空表单
      clearFormList() {
        this.checkedArr = []
        this.tableName = []
        this.selectConditionArr[0] = []
        this.selectConditionArr[1] = []
        this.relationConditionArr[0].FieldName1 = ''
        this.relationConditionArr[0].FieldName2 = ''
      },
      // 下一步
      downStep(step) {
        if (this.comparisonData.SjbdTableGxModels.length === 0 || this.comparisonData.SjbdTableGxModels.length === 2) {
          this.comparisonData.SjbdTableGxModels = this.relationConditionArr;
        }
        if (this.checkedArr.length < 2 && this.comparisonData.SjbdTableModels.length < 2) {
          this.$alert('请选择资源', '温馨提示')
          return false;
        } else if (this.radio === '') {
          this.$alert('请设置主表', '温馨提示')
          return false;
        } else if (this.relationConditionArr[0].FieldName1 === '' || this.relationConditionArr[0].FieldName2 === '') {
          this.$alert('请选择对比条件', '温馨提示')
          return false;
        }
        if (this.filterList[0].list.length === 0) {
          this.filterList[0].NameCn = this.tableName[0].name
          this.filterList[0].isMaster = this.comparisonData.SjbdTableModels[0].IsMaster
          this.filterList[0].tableID = this.comparisonData.SjbdTableModels[0].TableID
          this.filterList[0].options = this.selectConditionArr[0]
          this.filterList[1].NameCn = this.tableName[1].name
          this.filterList[1].isMaster = this.comparisonData.SjbdTableModels[1].IsMaster
          this.filterList[1].tableID = this.comparisonData.SjbdTableModels[1].TableID
          this.filterList[1].options = this.selectConditionArr[1]
          this.$emit('step', step)
          this.$nextTick(() => {
            bus.$emit('acossFilterList', this.filterList)
            bus.$emit('acossFirstComparisonData', this.comparisonData)
          })
        } else {
          this.$emit('step', step);
        }
      },
      // 获取比对结果
      comparisonResult() {
        if (this.checkedArr.length < 2 && this.comparisonData.SjbdTableModels.length < 2) {
          this.$alert('请选择资源', '温馨提示')
          return false;
        } else if (this.radio === '') {
          this.$alert('请设置主表', '温馨提示')
          return false;
        } else if (this.relationConditionArr[0].FieldName1 === '' || this.relationConditionArr[0].FieldName2 === '') {
          this.$alert('请选择对比条件', '温馨提示')
          return false;
        }
        this.comparisonData.SjbdTableGxModels = this.relationConditionArr;
        this.comparisonData.SjbdTableFilterModels = []
        sessionStorage.setItem('comparsionResult', JSON.stringify(this.comparisonData))
        this.jumpTo(`/analysis/comparisonResult`, true)
      }
    },
    created() {
      this.initTableInfo()
      bus.$on('acrossResouce', n => {
        // this.comparisonData.SjbdTableModels = clone(n.SjbdTableModels)
        // this.comparisonData.SjbdTableGxModels = clone(n.SjbdTableGxModels)
        this.checkedArr = [n.SjbdTableModels[0].TableID, n.SjbdTableModels[1].TableID]
        // this.tableName = [n.SjbdTableModels[0].TableNameCn, n.SjbdTableModels[1].TableNameCn]
        // n.SjbdTableModels.forEach((d, i) => {
        //   if (d.IsMaster === '1') {
        //     this.radio = i;
        //   }
        // })
        // this.dispatch(FETCH_GET_TABLE_INFOL, { TableType: n.SjbdTableModels[0].TableType, TableID: n.SjbdTableModels[0].TableID }).then(() => {
        //   this.selectConditionArr[0] = clone(this.dataComparison.GetTableInfo.Columns)
        //   this.relationConditionArr[0].FieldName1 = n.SjbdTableGxModels[0].FieldNameCn1
        // })
        // this.dispatch(FETCH_GET_TABLE_INFOL, { TableType: n.SjbdTableModels[1].TableType, TableID: n.SjbdTableModels[1].TableID }).then(() => {
        //   this.selectConditionArr[1] = clone(this.dataComparison.GetTableInfo.Columns)
        //   this.relationConditionArr[0].FieldName2 = n.SjbdTableGxModels[0].FieldNameCn2
        // })
      })
    },
    mounted() {}
  }

</script>
