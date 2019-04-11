<!-- 团伙关系 -->
<template>
  <div style="width:100%;" class="case-box">
    <!-- 内容 -->
    <el-row :gutter="10" style="height: calc(100vh - 165px);width:100%;overflow:hidden;margin-left: 0;margin-right: 0;" >
    <el-col :span="4" :class="{'content-left':true, 'is-west':!isWestReportList}" style="margin:0;padding:0">
      <div class="content-title" :class="ifHight === true ? 'heightRight' : 'heightRight1'">
          <span>关系分析目录</span>
        </div>
        <ul style="overflow-y:auto;height:calc(100vh - 202px);">
          <li v-for="(item,idx) in chartDataList" :class="{current:idx === curIndex}" ref="selectLi" class="content-left-li" @click="selectReport(idx)">
            <dl>
              <dt>
                <span>{{idx+1}}</span>
                <span>{{item.bt}}</span>
                <span class="report-remove-btn iconfont icon-trash icondelete" @click.stop="confirmFn(idx)"></span>
              </dt>
              <dd>
                <span class="item_name">描&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp述:&nbsp</span>
                <span class="item_value">{{item.sm}}</span>
              </dd>
            </dl>
          </li>
        </ul>
        <div :class="{'west-box':true, 'el-icon-d-arrow-left':isWestReportList,'el-icon-d-arrow-right':!isWestReportList}" @click.stop="switchWestReport"></div>
    </el-col>
    <el-col :span="isWestReportList?20:24" :style="{height:H}" style="z-index:10">
      <el-row class="certificate-box" style="height:100%;">
        <p v-if="chartDataList && chartDataList.length <= 0"
          style="color: #5e7382;text-align: center">暂无数据</p>
          <div v-if="chartDataList && chartDataList.length > 0" style="height:100%;" @click="rightHight" >
              <gocharts ref="goBoxTRelation" :boxId="'goBoxRelation_0'"style="height:100%;" background="none" class="maker-box" :data="chartDataList[curIndex].data.nodeObj" :options="chartDataList[curIndex].data.options" ></gocharts>
          </div>
      </el-row>
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
            font-size: 12px; // height: 30px;
            line-height: 30px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
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
<style scoped lang="scss">
  .heightRight{
    margin: 0;
    padding: 0
  }
  .heightRight1{
    margin: 0;
    padding: 0;
    margin-top:15px
  }
  .certificate-box {
    margin-top: 13px;
    .maker-box {
      width: 100%;
      height: 500px;
      margin: 5px auto;
    }
  }

  .case-relation-desc {
    padding: 10px 15px;
    h3 {
      color: #46BDFD;
      text-align: left;
    }
    .intro {
      text-indent: 2em;
    }
    .time {
      text-align: right;
      line-height: 40px;
      vertical-align: bottom;
    }
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import { mapState } from 'vuex'
  import { clone } from '../../../utils/util'
  import gocharts from '../../../widgets/gocharts/gocharts'
  import { FETCH_CASE_RELATION_LIST, DELETE_CASE_RELATION } from '../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      gocharts
    },
    computed: {
      ...mapState(['analysisRelation']),
      H() {
        return document.body.scrollHeight - 60 - 45 - 60 + 'px'
      }
    },
    data() {
      return {
        ifHight: true,
        caseId: '',
        curIndex: 0,
        isWestReportList: true,
        pagenav: { limit: 10000, currentpage: 1 },
        chartDataList: [],
        imageBase64: []
      }
    },
    props: {},
    watch: {},
    methods: {
      rightHight() {
        this.ifHight = false;
      },
      confirmFn(idx) {
        this.$confirm('此操作将删除该关系图,是否继续？', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(DELETE_CASE_RELATION, { id: this.chartDataList[idx].id }).then(() => {
            if (this.analysisRelation.deleteCaseRelationRes === '删除成功') {
              this.$alert('删除成功', '温馨提示', { type: 'warning' })
              if (this.curIndex === idx) {
                this.curIndex = 0;
              } else if (this.curIndex > idx) {
                this.curIndex = this.curIndex - 1;
              }
              this.chartDataList.splice(idx, 1)
            }
          })
        })
      },
      switchWestReport() {
        this.isWestReportList = this.isWestReportList === false
      },
      selectReport(idx) { // 切换关系分析图
        this.curIndex = idx;
      },
      queryList() {
        if (this.checkRuleCase('topic/gxfx/list', this.caseId)) {
          this.dispatch(FETCH_CASE_RELATION_LIST, {
            ajid: this.caseId,
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            if (this.analysisRelation.caseRelationList) {
              let nodeDatas = clone(this.analysisRelation.caseRelationList);
              nodeDatas.forEach((item, idx) => {
                let obj = JSON.parse(item.data);
                obj.nodeObj.nodeDataArray.forEach((item2, idx2) => {
                  item2.source = item2.source.replace(/(?!token=)\w+&amp;/g, `${this.userData.UserToken}&`);
                  item2.color = '#000';
                });
                obj.options.readOnly = true;
                obj.options.allowZoom = false;
                item.data = obj;
              })

              this.chartDataList = nodeDatas;
            }
          })
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryList()
    }
  }

</script>
