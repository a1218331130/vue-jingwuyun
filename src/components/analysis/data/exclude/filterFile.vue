<template>
  <div class="filter-list">
    <div class="filter-item" v-for="(item,index) in filterList" :key="index">
      <div class="filter-title">
        <div>
          <el-tag type="primary">{{item.NameCn}}</el-tag>
          <el-tag type="primary" v-if="Number(item.isMaster)">主表</el-tag>
        </div>
        <div v-if="item.number !== ''">运算条数：<span>{{item.number}}</span></div>
      </div>
      <div class="filter-cont">
        <div class="filter-cont-title">
          <span>筛选条件</span>
          <div>
            <span @click="add(item,index)"><i class="el-icon-plus" style="color:#20a0ff;padding:0px 5px;"></i>添加</span>
            <span @click="clearItem(item)"><i class="el-icon-delete" style="color:#20a0ff;padding:0px 5px;"></i>清空</span>
          </div>
        </div>
        <ul class="filter-cont-tag">
          <li v-for="(tag,tags) in item.list" :key="tags">
            <el-tag :closable="true" type="primary" :close-transition="false" @close="handleClose(item,tag)">{{tag.Val}}</el-tag>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="upStep(2)">上一步</el-button>
      <el-button type="primary" @click="downStep(4)">下一步</el-button>
      <el-button type="primary" @click="comparisonResult()">对比结果</el-button>
    </div>
    <el-dialog title="过滤集合" :visible.sync="dialog" top="30%" size="tiny" :before-close="close">
      <div class="gatherCont">
        <el-select v-model="value" clearable size="small" placeholder="请选择">
          <el-option v-for="(option,i) in options" :key="i" :label="option.NameCn" :value="option.Name"></el-option>
        </el-select>
        <el-select v-model="value1" clearable size="small" placeholder="请选择">
          <el-option v-for="(option,i) in gatherArr" :key="i" :label="option.label" :value="option.prop"></el-option>
        </el-select>
        <el-input type="text" size="small" v-model="value2" placeholder="请输入筛选条件"></el-input>
      </div>
      <span solt="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .filter-list {
    padding: 0px 10px;
    .filter-title {
      display: flex;
      justify-content: space-between;
      padding: 5px 0px;
      &>div:nth-child(2) {
        color: #868686;
        &>span {
          color: #20a0ff;
        }
      }
    }
    .filter-cont {
      min-height: 100px;
      margin: 5px 0 15px 0px;
      border: 1px solid #ddd;
      .filter-cont-title {
        height: 35px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
        color: #868686;
        &>div {
          height: 35px;
          display: flex;
          &>span {
            width: 60px;
            padding-top: 8px;
            border-left: 1px solid #ddd;
            overflow: hidden;
            cursor: pointer;
          }
        }
      }
    }
    .filter-cont-tag {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      &>li {
        margin: 5px 0px 5px 10px;
      }
    }
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    cursor: pointer;
    button {
      border-radius: 3px;
    }
  }

  .gatherCont {
    display: flex;
    justify-content: center;
    padding: 30px 0;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_VIEW_SSBD_WDBD_COUNT } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [mixin],
    data() {
      return {
        value: '',
        value1: 12,
        value2: '',
        index: '',
        options: [],
        gatherArr: [{
          label: '等于空',
          prop: 2
        }, {
          label: '等于',
          prop: 3
        }, {
          label: '不等于',
          prop: 4
        }, {
          label: '大于',
          prop: 5
        }, {
          label: '小于',
          prop: 6
        }, {
          label: '大于等于',
          prop: 7
        }, {
          label: '小于等于',
          prop: 8
        }, {
          label: '不等于空',
          prop: 9
        }, {
          label: '左包含',
          prop: 10
        }, {
          label: '右包含',
          prop: 11
        }, {
          label: '包含',
          prop: 12
        }],
        dialog: false,
        filterList: [],
        nextComparisonData: '',
        resultData: {
          isLoad: false,
          isShowResult: false,
          titleList: [],
          contentList: [],
          totalCount: ''
        },
        gatherName: ''
      }
    },
    computed: {
      ...mapState(['dataComparison'])
    },
    methods: {
      // 初始化运算条数
      initCount() {
        let SjbdTableModels1 = [],
          SjbdTableModels2 = [],
          formData1,
          formData2
        SjbdTableModels1[0] = this.nextComparisonData.SjbdTableModels[0]
        SjbdTableModels2[0] = this.nextComparisonData.SjbdTableModels[1]
        formData1 = {
          SourceType: 4,
          SjbdTableModels: SjbdTableModels1,
          SjbdTableFilterModels: [],
          Columns: []
        }
        formData2 = {
          SourceType: 4,
          SjbdTableModels: SjbdTableModels2,
          SjbdTableFilterModels: [],
          Columns: []
        }
        this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData1).then(() => {
          this.filterList[0].number = this.dataComparison.ViewSsbdWdbdCount
        })
        this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData2).then(() => {
          this.filterList[1].number = this.dataComparison.ViewSsbdWdbdCount
        })
      },
      add(item, index) {
        this.dialog = true;
        this.value = '';
        this.value1 = '';
        this.value2 = '';
        this.options = item.options;
        this.index = index;
        this.$set(item, 'indexs', index)
      },
      handleClose(item, tag) {
        item.list.splice(item.list.indexOf(tag.name), 1)
        item.parameter.splice(item.list.indexOf(tag.name), 1)
        if (item.indexs === 0) {
          let SjbdTableModels1 = [],
            formData1
          SjbdTableModels1[0] = this.nextComparisonData.SjbdTableModels[0]
          formData1 = {
            SourceType: 4,
            SjbdTableModels: SjbdTableModels1,
            SjbdTableFilterModels: [],
            Columns: []
          }
          if (item.parameter.length === 0) {
            this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData1).then(() => {
              this.filterList[0].number = this.dataComparison.ViewSsbdWdbdCount
            })
          } else {
            formData1.SjbdTableFilterModels = item.parameter
            this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData1).then(() => {
              this.filterList[0].number = this.dataComparison.ViewSsbdWdbdCount
            })
          }
        } else {
          let SjbdTableModels2 = [],
            formData2
          SjbdTableModels2[0] = this.nextComparisonData.SjbdTableModels[1]
          formData2 = {
            SourceType: 4,
            SjbdTableModels: SjbdTableModels2,
            SjbdTableFilterModels: [],
            Columns: []
          }
          if (item.parameter.length === 0) {
            this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData2).then(() => {
              this.filterList[1].number = this.dataComparison.ViewSsbdWdbdCount
            })
          } else {
            formData2.SjbdTableFilterModels = item.parameter
            this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData2).then(() => {
              this.filterList[1].number = this.dataComparison.ViewSsbdWdbdCount
            })
          }
        }
      },
      clearItem(item) {
        item.list = []
        item.parameter = []
      },
      upStep(step) {
        this.$emit('step', step)
        bus.$emit('excludefirstRest', null)
      },
      downStep(step) {
        this.nextComparisonData.SjbdTableFilterModels = this.filterList[0].parameter.concat(this.filterList[1].parameter)
        this.$emit('step', step)
        this.$nextTick(() => {
          bus.$emit('excludeSecondComparisonData', this.comparisonData)
          bus.$emit('excludefilterNumber', this.nextComparisonData.SjbdTableFilterModels.length)
        })
      },
      close(done) {
        this.dialog = false
      },
      confirm() {
        this.dialog = false;
        if (this.index === 0) {
          this.filterList[0].options.forEach(n => {
            this.gatherArr.forEach(m => {
              if (this.value === n.Name) {
                if (this.value1 === m.prop) {
                  this.gatherName = `${n.NameCn} ${m.label} ${this.value2}`;
                  this.filterList[0].list.push({ Val: this.gatherName })
                  this.filterList[0].parameter.push({ TableIndex: this.index, FieldName: this.value, Val: this.value2, TableID: this.filterList[0].tableID, OperatorType: this.value1 });
                }
              }
            })
          })
          let SjbdTableModels1 = [],
            formData1
          SjbdTableModels1[0] = this.nextComparisonData.SjbdTableModels[0]
          formData1 = {
            SourceType: 4,
            SjbdTableModels: SjbdTableModels1,
            SjbdTableFilterModels: [],
            Columns: []
          }
          formData1.SjbdTableFilterModels = this.filterList[0].parameter
          this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData1).then(() => {
            this.filterList[0].number = this.dataComparison.ViewSsbdWdbdCount
          })
        } else {
          this.filterList[1].options.forEach(n => {
            this.gatherArr.forEach(m => {
              if (this.value === n.Name) {
                if (this.value1 === m.prop) {
                  this.gatherName = `${n.NameCn} ${m.label} ${this.value2}`;
                  this.filterList[1].list.push({ Val: this.gatherName })
                  this.filterList[1].parameter.push({ TableIndex: this.index, FieldName: this.value, Val: this.value2, TableID: this.filterList[0].tableID, OperatorType: this.value1 });
                }
              }
            })
          })
          let SjbdTableModels2 = [],
            formData2
          SjbdTableModels2[0] = this.nextComparisonData.SjbdTableModels[1]
          formData2 = {
            SourceType: 4,
            SjbdTableModels: SjbdTableModels2,
            SjbdTableFilterModels: [],
            Columns: []
          }
          formData2.SjbdTableFilterModels = this.filterList[1].parameter;
          this.dispatch(FETCH_VIEW_SSBD_WDBD_COUNT, formData2).then(() => {
            this.filterList[1].number = this.dataComparison.ViewSsbdWdbdCount
          })
        }
      },
      // 查看实时比对结果
      comparisonResult() {
        this.nextComparisonData.SjbdTableFilterModels = this.filterList[0].parameter.concat(this.filterList[1].parameter)
        this.nextComparisonData.Columns = []
        sessionStorage.setItem('comparsionResult', JSON.stringify(this.nextComparisonData))
        this.jumpTo(`/analysis/comparisonResult`, true)
      }
    },
    created() {
      bus.$on('excludeFilterList', n => {
        this.filterList = n
      })
      bus.$on('excludeFirstComparisonData', m => {
        this.nextComparisonData = m
        this.initCount()
      })
    },
    mounted() {}
  }

</script>
