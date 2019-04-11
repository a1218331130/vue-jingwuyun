<template>
  <div class="resourceCont">
    <el-form :model="form" :inline="true" class="searchForm" label-width="60px">
      <el-form-item>
        <el-input v-model="form.input" placeholder="请输入表名" @change="query" @keyup.enter=""></el-input>
      </el-form-item>
    </el-form>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-show="activeName === 'resource'" label="系统资源" name="resource">
        <div class="table">
          <div class="qureyBox" v-for="(item,indexs) in resourceTableInfo" :key="indexs">
            <span>{{item.Name}}：</span>
            <el-checkbox-group :max="1" v-model="checkedArr">
              <el-checkbox v-for="(it,index) in item.Tables" :key="index" :label="it.ID" @change="getTableInfo(it,index)">{{it.ZyName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-show="activeName === 'myResource'" label="我的比对资源" name="myResource">
        <div class="table">
          <div class="qureyBoxs">
            <el-checkbox-group :max="1" v-model="checkedArr">
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
        <div v-for="(table,i) in tableName" :key="i">
          <p>{{table.name}} <span style="color:#2894ff;"> ({{table.count}}条)</span></p>
          <div>
            <el-radio-group v-model="radio">
              <el-radio class="radio" :label="i">设为主表</el-radio>
            </el-radio-group>
          </div>
        </div>
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
    top: 146px;
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
        }],
        form: {
          input: ''
        },
        radio: '',
        checkedArr: [],
        tableName: [],
        resourceTableInfo: [],
        myResourceTableInfo: [],
        tableType: 1,
        comparisonData: {
          SourceType: 4,
          SjbdTableModels: [],
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
          this.selectConditionArr[1] = this.selectConditionArr[0]
        } else if (newVal.length === 0 && old.length === 1) {
          this.relationConditionArr = [{
            FieldName1: '',
            FieldName2: '',
            TableID1: '',
            TableID2: '',
            TableIndex1: '',
            TableIndex2: ''
          }];
          this.selectConditionArr[0] = [];
          this.selectConditionArr[1] = [];
          this.comparisonData.SjbdTableModels = [];
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
      // 获取表信息
      getTableInfo(item, index) {
        if (this.checkedArr.indexOf(item.ID) !== -1) {
          this.$set(item, 'checkStatus', true)
        } else {
          this.$set(item, 'checkStatus', false)
        }
        if (item.checkStatus) {
          if (this.checkedArr.length === 1) {
            this.getRemoteConditions(item.ID, (data) => {
              this.filterList[0].options = data
            })
            // 获取表名
            if (this.activeName === 'resource') {
              this.tableName.push({ name: item.ZyName, count: item.EsCount })
              this.tableType = 1
            } else {
              this.tableName.push({ name: item.Name, count: item.Count })
              this.tableType = 2
            }
            this.comparisonData.SjbdTableModels.push({
              IsMaster: 1,
              TableIndex: 0,
              TableID: item.ID,
              TableType: this.tableType
            });
            this.radio = 0;
          }
        }
      },
      // 获取对比条件
      getRemoteConditions(id, callback) {
        let arr = null
        if (this.activeName === 'resource') {
          this.tableType = 1
        } else {
          this.tableType = 2
        }
        this.dispatch(FETCH_GET_TABLE_INFOL, { TableType: this.tableType, TableID: id }).then(() => {
          arr = clone(this.dataComparison.GetTableInfo.Columns)
          return callback(arr)
        })
      },
      // 清空表单
      clearFormList() {
        this.checkedArr = []
        this.tableName = []
      },
      // 下一步
      downStep(step) {
        if (this.checkedArr.length < 1 && this.comparisonData.SjbdTableModels.length < 1) {
          this.$alert('请选择资源', '温馨提示');
          return false;
        }
        if (this.filterList[0].list.length === 0) {
          this.filterList[0].NameCn = this.tableName[0].name;
          this.filterList[0].isMaster = this.comparisonData.SjbdTableModels[0].IsMaster;
          this.filterList[0].tableID = this.comparisonData.SjbdTableModels[0].TableID;
          this.$emit('step', step);
          this.$nextTick(() => {
            bus.$emit('formFilterList', this.filterList);
            bus.$emit('formFirstComparisonData', this.comparisonData);
          })
        } else {
          this.$emit('step', step);
        }
      },
      // 获取比对结果
      comparisonResult() {
        if (this.checkedArr.length < 1 && this.comparisonData.SjbdTableModels.length < 1) {
          this.$alert('请选择资源', '温馨提示');
          return false;
        }
        this.comparisonData.SjbdTableFilterModels = []
        sessionStorage.setItem('comparsionResult', JSON.stringify(this.comparisonData))
        this.jumpTo(`/analysis/comparisonResult`, true)
      }
    },
    created() {
      bus.$on('formResouce', n => {
        // this.comparisonData.SjbdTableModels = clone(n.SjbdTableModels)
        this.checkedArr = [n.SjbdTableModels[0].TableID]
        // this.tableName = [n.SjbdTableModels[0].TableNameCn]
        // this.radio = 0;
      })
      bus.$on('save', d => {
        if (d === 'success') {
          this.checkedArr = []
          this.comparisonData.SjbdTableModels = []
          this.radio = ''
          this.selectConditionArr[0] = []
          this.selectConditionArr[1] = []
          this.relationConditionArr[0].FieldName1 = ''
          this.relationConditionArr[0].FieldName2 = ''
          this.filterList = [{
            NameCn: '',
            isMaster: '',
            number: '',
            tableID: '',
            options: '',
            list: [],
            parameter: []
          }]
        }
      })
    },
    mounted() {
      this.initTableInfo()
    }
  }

</script>
