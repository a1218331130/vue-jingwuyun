<template>
  <div class="resourceCont">
    <el-form :model="form" :inline="true" class="searchForm" label-width="60px">
      <el-form-item>
        <el-input v-model="form.input" placeholder="请输入表名" @change="query" @keyup.enter="query"></el-input>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-card class="box-card">
        <div class="qureyBox">
          <el-checkbox-group :max="1" v-model="checkedArr">
            <el-checkbox v-for="(it,index) in queryRadioArray" :key="index" :label="it.ID" @change="getTableInfo(it,index)">{{it.Name}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-card>
    </div>
    <div class="form">
      <div class="formTitle">
        <span>已选择</span>
        <span @click="clearFormList"><i class="el-icon-delete" style="color:#20a0ff;padding:0px 5px;"></i>清空</span>
      </div>
      <div class="formCont">
        <div v-for="(table,ind) in tableName" :key="ind">
          <p>{{table}}</p>
          <div>
            <el-radio-group v-model="radio">
              <el-radio class="radio" :label="ind">设为主表</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="downStep(2)">下一步</el-button>
      <el-button type="primary" @click="comparisonResult()">比对结果</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .table {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 5px;
    .box-card {
      border: 0px;
    }
  }

  .qureyBox {
    padding: 5px 0;
    display: -webkit-box;
    border-bottom: 1px solid #ddd;
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
        &>span {
          width: 40%;
          display: inline-block;
          text-align: center;
        }
      }
      &>div {
        width: 640px;
        height: 50px;
        margin: 15px auto;
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
    padding: 30px 0;
    cursor: pointer;
  }

  .searchForm {
    position: absolute;
    top: -38px;
    right: 0px;
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
        queryRadioArray: [],
        /* 选中筛选条件数组 */
        selectConditionArr: [
          [],
          []
        ],
        tableType: 2,
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
          this.selectConditionArr[0] = []
          this.selectConditionArr[1] = []
          this.comparisonData.SjbdTableModels = []
          this.tableName = []
        }
      }
    },
    methods: {
      query() {
        if (this.index === '1') {
          this.dispatch(FETCH_MY_DATA_LIST, { Keyword: this.form.input, PageIndex: 1, PageSize: 100, SourceType: '2' }).then(() => {
            this.queryRadioArray = this.dataComparison.myDataList.PageData
          })
        } else if (this.index === '0') {
          this.dispatch(FETCH_GET_ZYML, { Keyword: this.form.input, PageIndex: 1, PageSize: 100 }).then(() => {
            this.queryRadioArray = this.dataComparison.GetZyml.filter(d => {
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
            this.tableName.push(item.Name)
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
        let arr = null;
        this.dispatch(FETCH_GET_TABLE_INFOL, { TableType: this.tableType, TableID: id }).then(() => {
          arr = clone(this.dataComparison.GetTableInfo.Columns);
          return callback(arr);
        })
      },
      // 清空表单
      clearFormList() {
        this.checkedArr = []
      },
      // 上一步
      upStep(step) {
        this.$emit('step', step);
      },
      // 下一步
      downStep(step) {
        if (this.checkedArr.length < 1 && this.comparisonData.SjbdTableModels.length < 1) {
          this.$alert('请选择资源', '温馨提示');
          return false;
        }
        if (this.filterList[0].list.length === 0) {
          this.filterList[0].NameCn = this.checkedArr[0];
          this.filterList[0].isMaster = this.comparisonData.SjbdTableModels[0].IsMaster;
          this.filterList[0].tableID = this.comparisonData.SjbdTableModels[0].TableID;
          this.filterList[0].options = this.selectConditionArr[0];
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
        this.comparisonData.SjbdTableModels = clone(n.SjbdTableModels);
        this.checkedArr = [n.SjbdTableModels[0].TableID]
        this.tableName = [n.SjbdTableModels[0].TableNameCn]
        this.radio = 0;
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
      this.dispatch(FETCH_MY_DATA_LIST, { Keyword: '', PageIndex: 1, PageSize: 100, SourceType: '4' }).then(() => {
        this.queryRadioArray = this.dataComparison.myDataList.PageData
      })
    }
  }

</script>
