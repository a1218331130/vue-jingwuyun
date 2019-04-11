<!-- 战法结果（） -->
<template>
  <div style="width:100%;" class="case-box">
    <div v-if="false">
      <span>
        暂无生成相关报告数据！
      </span>
    </div>
    <el-row :gutter="10" style="height: calc(100vh - 165px);width:100%;overflow:hidden;margin-left: 0;margin-right: 0;" >
      <el-col :span="4" :class="{'content-left':true, 'is-west':!isWestReportList}" style="margin:0;padding:0;">
        <div class="content-title">
          <span>战法结果</span>
        </div>
        <ul style="overflow-y:auto;height:calc(100vh - 202px);">
          <li v-for="(item,idx) in resultList" :class="{current:idx === curIndex}" ref="selectLi"class="content-left-li" @click="selectReport(idx)">
            <dl>
              <dt ><span>{{idx+1}}</span><span>{{item.zfmc}}</span><span class="report-remove-btn iconfont icon-trash icondelete" @click="deleteData(idx)"></span></dt>
              <dd v-for ="(items, idxs) in item.conditionList">
                <span v-if="(items.TYPE==='date'||items.TYPE==='daterange')&&items.MRZ" class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span v-if="(items.TYPE==='date'||items.TYPE==='daterange')&&items.MRZ" class="item_value">{{transData(items.MRZ)}}</span>
                <div v-if="items.TYPE==='bbb'||items.TYPE==='areaSelector '">
                  <span  class="item_name">区划&nbsp:&nbsp</span><span class="item_value">{{items.AREAMC}}</span>
                </div>
                <div v-if="items.TYPE==='bbb'&&items.HOTELMC">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.HOTELMC}}</span>
                </div>
                <div v-if="items.TYPE==='input'&&items.MRZ">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.MRZ}}</span>
                </div>
                <div v-if="items.TYPE==='number'&&items.MRZ">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.MRZ}}</span>
                </div>
                <div v-if="items.TYPE==='xb'&&items.MRZ">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.MRZ}}</span>
                </div>
                <div v-if="items.TYPE==='internetBar'&&items.MRZ">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.MRZ}}</span>
                </div>
                <div v-if="items.TYPE==='input'&&items.MRZ">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.MRZ}}</span>
                </div>
                <div v-if="items.TYPE==='areaSelector'&&items.MRZ">
                  <span class="item_name">{{items.LABEL}}&nbsp:&nbsp</span><span class="item_value">{{items.MRZ}}</span>
                </div>
              </dd>
              <dd>
                <span class="item_name">执行者&nbsp:&nbsp</span><span class="item_value">{{item.zxz}}</span>
              </dd>
            </dl>
          </li>	
        </ul>
        <div :class="{'west-box':true, 'el-icon-d-arrow-left':isWestReportList,'el-icon-d-arrow-right':!isWestReportList}" @click.stop="switchWestReport"></div>
      </el-col>
      <el-col :span="isWestReportList?20:24">
        <div>
          <list ref="list" :query="formData"></list>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
  ul,
  li,
  dd,
  dl,
  dt,
  content-left {
    margin: 0;
    padding: 0;
  }

  ul,
  li {
    list-style: none;
  }

  .case-box {
    .content-title {
      height: 39px;
      background: #66A7E7;
      text-align: center;
      line-height: 42px;
      color: #fff;
      span {
        color: #fff;
        font-size: 14px;
        user-select: none;
      }
    }
    .is-west {
      width: 0;
      margin-left: -1px;
      .generate-report.cu-dang,
      .report-list-box,
      .content-title {
        display: none;
      }
    }
    .content-left {
      height: 100%;
      position: relative;
      .current {
        background-color: #b9d4dc;
      }
      &-li:nth-child(1) {
        border-top: none;
      }
      &-li {
        overflow: hidden;
        display: hidden; // margin-top: 15px;
        border-top: 15px solid #66a7e7;
        background-color: white;
        &>dl>dt {
          // height: 30px;
          line-height: 24px;
          overflow: hidden;
          position: relative;
          border-bottom: 2px dashed #ccc;
          padding: 5px 0;
          &>span {
            display: block;
          }
          &>span:nth-child(1) {
            width: 15%;
            text-align: center;
            line-height: 22px;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -11px;
          }
          &>span:nth-child(2) {
            float: left;
            width: 70%;
            font-size: 16px;
            text-align: center;
            margin-left: 15%; // font-weight: bold;
          }
          &>span:nth-child(3) {
            width: 15%;
            height: 22px;
            line-height: 22px;
            position: absolute;
            top: 50%;
            right: 0;
            margin-top: -11px;
            color: #A8A8A8;
            font-size: 20px;
            &:hover {
              color: #55A3F1;
            }
          }
        }
        &>dl dd {
          width: 100%;
          overflow: hidden;
          display: block;
          div {
            overflow: hidden;
          }
          span {
            display: block;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
          }
          .item_name {
            text-align: right;
            width: 40%;
            float: left;
          }
          .item_value {
            text-align: left;
            float: left;
            width: 60%;
          }
        }
      }
      .west-box {
        /* background: #75B0E9; */
        background: #F7FBFE;
        height: 80px;
        width: 15px;
        position: absolute;
        top: 50%;
        margin-top: -40px;
        right: -16px;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        box-shadow: 2px 1px 5px #949290;
        cursor: pointer;
        line-height: 80px;
        text-align: center;
        /*color: #fff;*/
        color: #666;
        z-index: 99;
        font-size: 12px;
        &:hover {
          /*background: #55A3F1;*/
          background: #F9F9F9;
        }
      }
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  // import { tableFill } from '../../../utils/util'
  import { SEARCH_TACTICS_SAVE_LIST, DELETE_SAVE_TACTICS } from '../../../store/types'
  import list from './list'
  export default {
    mixins: [mixin],
    components: {
      list
    },
    data() {
      return {
        conditionList: [], // 左侧条件数据
        isWestReportList: true,
        curIndex: 0,
        resultList: [],
        caseId: '',
        queryData: {},
        formData: {}
      }
    },
    computed: {
      ...mapState(['survey'])
    },
    methods: {
      switchWestReport() {
        this.isWestReportList = this.isWestReportList === false
      },
      selectReport(idx) { // 切换战法结果
        this.curIndex = idx;
        let obj = this.resultList[idx];
        obj.conditionList.map(item => {
          if (item.MRZ) {
            this.queryData[item.TYPE] = item.MRZ
          }
          this.queryDataFn()
        })
        this.$refs.list.showList = true
      },
      fetchList() { // 获取战法列表
        this.dispatch(SEARCH_TACTICS_SAVE_LIST, { caseId: this.caseId }).then(() => {
          this.resultList = this.survey.searchTacticsSaveListResult
        })
      },
      transData(val) { // 更改时间格式
        let str = ''
        if (val.length === 17) {
          let arr = val.split('T');
          let arr2 = []
          arr.map(item => {
            let arr1 = [];
            arr1.push(item.slice(0, 4))
            arr1.push(item.slice(4, 6))
            arr1.push(item.slice(6, 8))
            arr2.push(arr1.join('-'))
          })
          str = arr2.join('-')
        } else if (val.length === 13) {
          let arr = val.split('T');
          let arr2 = []
          arr.map(item => {
            let arr1 = [];
            arr1.push(item.slice(0, 2))
            arr1.push(item.slice(2, 4))
            arr1.push(item.slice(4, 6))
            arr2.push(arr1.join(':'))
          })
          str = arr2.join('-')
        } else {
          str = val
        }
        return str
      },
      deleteData(val) { // 删除战法结果
        let obj = this.resultList[val];
        let query = {
          caseId: this.caseId,
          zfid: obj.zfid,
          saveTime: obj.saveTime,
          userId: obj.userId
        }
        this.dispatch(DELETE_SAVE_TACTICS, { data: query }).then(() => {
          let status = this.survey.deleteSaveTacticsResult
          if (status === 'success') {
            this.$alert('删除成功', '温馨提示')
            this.resultList.splice(val, 1)
          } else {
            this.$alert('删除失败', '温馨提示')
          }
        })
      },
      queryDataFn() {
        this.formData = {};
        this.formData.zfid = this.resultList[this.curIndex].zfid
        this.formData.userId = this.resultList[this.curIndex].userId
        this.formData.saveTime = this.resultList[this.curIndex].saveTime
        this.formData.caseId = this.caseId;
      }
    },
    mounted() {
      this.$refs.list.showList = true
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.fetchList()
      setTimeout(this.queryDataFn, 1000)
    }
  }

</script>
