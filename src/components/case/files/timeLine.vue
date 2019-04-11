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
          <span>时光轴结果</span>
        </div>
        <ul style="overflow-y:auto;height:calc(100vh - 202px);">
          <li v-for="(item,idx) in resultList" :class="{current:idx === curIndex}" ref="selectLi"class="content-left-li" @click="selectReport(idx)">
            <dl>
              <dt ><span>{{idx+1}}</span><span>{{item.SAVE_NAME}}</span><span class="report-remove-btn iconfont icon-trash icondelete" @click.stop="confirmFn(idx)"></span></dt>
              <dd>
                <span class="item_name">执&nbsp&nbsp&nbsp行&nbsp&nbsp&nbsp者&nbsp&nbsp:&nbsp</span>
                <span class="item_value">{{item.USER_NAME}}</span>
              </dd>
              <dd>
                <span class="item_name">执&nbsp行&nbsp时&nbsp间&nbsp:&nbsp</span>
                <span class="item_value">{{item.SAVE_DATE}}</span>
              </dd>
            </dl>
          </li>	
        </ul>
        <div :class="{'west-box':true, 'el-icon-d-arrow-left':isWestReportList,'el-icon-d-arrow-right':!isWestReportList}" @click.stop="switchWestReport"></div>
      </el-col>
      <el-col :span="isWestReportList?20:24">
          <el-table v-loading="loading" :data="tableData" ref="tables" border stripe :height="H">
            <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
            <el-table-column align="center" label="姓名" prop="xm" width="130px"></el-table-column>
            <el-table-column align="center" label="证件号" prop="zjhm" width="250px"></el-table-column>
            <el-table-column align="center" label="类型" prop="gjlxms" width="130px"></el-table-column>
            <el-table-column align="center" label="日期" prop="kssj" width="250px"></el-table-column>
            <el-table-column align="left" label="摘要" prop="gjms"></el-table-column>
          </el-table>
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
            width: 35%;
            margin-right: 5%;
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
  import { FETCH_SAVE_NAME_LIST, GET_SAVE_TIMELINE_DETAIL, DELETE_TIMELINE_CLASSIFY } from '../../../store/types'
  import list from './list'
  export default {
    mixins: [mixin],
    components: {
      list
    },
    data() {
      return {
        data: [],
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
      ...mapState(['analysisTimeline']),
      tableData() {
        let tableData = this.data ? this.data.map(d => {
          return {
            id: d.ID,
            xm: d.对象,
            gjlxms: d.事件,
            kssj: d.日期,
            gjms: d.摘要,
            zjhm: d.身份证号码,
            gjlxdm: d.gjlx
          }
        }) : [];
        return tableData;
      },
      H() {
        return document.body.scrollHeight - 60 - 45 - 60 + 'px'
      }
    },
    methods: {
      switchWestReport() {
        this.isWestReportList = this.isWestReportList === false
      },
      selectReport(idx) { // 切换时光轴结果
        this.curIndex = idx;
        this.queryDataFn()
      },
      fetchList() { // 获取时光轴列表
        this.dispatch(FETCH_SAVE_NAME_LIST, { caseId: this.caseId }).then(() => {
          this.resultList = this.analysisTimeline.fetchSaveNameListResult
        })
      },
      fetchTimelineData() {
        this.dispatch(GET_SAVE_TIMELINE_DETAIL, this.formData).then(() => {
          this.data = this.analysisTimeline.getSaveTimelineDetailResult
        })
      },
      confirmFn(val) {
        this.$confirm('此操作将彻底删除该数据,是否继续？', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteData(val)
        })
      },
      deleteData(val) { // 删除时光轴结果
        let obj = this.resultList[val];
        let query = {
          caseId: this.caseId,
          saveName: obj.SAVE_NAME
        }
        this.dispatch(DELETE_TIMELINE_CLASSIFY, query).then(() => {
          let status = this.analysisTimeline.deleteTimelineClassifyResult
          if (status === '删除成功') {
            this.$alert('删除成功', '温馨提示')
            this.resultList.splice(val, 1)
            if (val === this.curIndex) {
              this.curIndex = 0;
              setTimeout(this.queryDataFn, 500)
            }
          } else {
            this.$alert('删除失败', '温馨提示')
          }
        })
      },
      queryDataFn() {
        this.formData = {};
        this.formData.caseId = this.caseId;
        if (this.resultList.length > 0) {
          this.formData.saveName = this.resultList[this.curIndex].SAVE_NAME
          this.fetchTimelineData()
        }
      }
    },
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.fetchList()
      setTimeout(this.queryDataFn, 1000)
    }
  }

</script>
