<!-- 团伙关系 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="关系分析"></card-header>
    <!-- 内容 -->
    <el-row class="certificate-box">
      <p v-if="chartDataList && chartDataList.length <= 0"
         style="color: #5e7382;text-align: center">暂无数据</p>
         <div v-if="chartDataList && chartDataList.length > 0">
              <div  v-for="(item,index) in chartDataList" :key="index" >
                    <div class="case-relation-desc">
                   
                    <el-row>
                    <el-col :span="18" class="intro">
                       <h3>{{item.bt}}</h3>
                       <div>{{item.sm}}
                         </div>
                       </el-col>
                    <el-col :span="6" class="time"> {{item.cjsj}}</el-col>
                      </el-row>
                    </div>
                      <gocharts ref="goBoxTRelation" :boxId="'goBoxRelation_'+ index" background="none" class="maker-box" :data="item.data.nodeObj" :options="item.data.options" @update:imageData="updateImageData"></gocharts>
              </div>
         </div>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
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
  import mixin from '../../../../utils/mixin'
  import { mapState } from 'vuex'
  import cardHeader from './card-header.vue'
  import { clone } from '../../../../utils/util'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import { FETCH_CASE_RELATION_LIST } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      gocharts
    },
    computed: {
      ...mapState(['analysisRelation'])
    },
    data() {
      return {
        caseId: '',
        pagenav: { limit: 10000, currentpage: 1 },
        chartDataList: [],
        imageBase64: []
      }
    },
    props: {
      operation: {
        type: Number,
        default: 1
      }
    },
    watch: {
      operation(newVal, oldVal) {
        if (newVal !== 1) {
          this.imageBase64 = []
          this.makeImage()
        }
      },
      imageBase64() {
        let arrays = []
        this.imageBase64.map((item, idx, array) => {
          let base64 = item.split('base64,')[1]
          arrays.push(base64)
        })
        let strings = `[${arrays.join()}]`
        this.$emit('update:relativeData', strings)
      }
    },
    methods: {
      makeImage() {
        this.$refs.goBoxTRelation.map(item => {
          item.makeImage()
        })
      },
      updateImageData(val) {
        if (val && val.data) {
          this.imageBase64.push(val.data)
        }
      },
      queryList() {
        console.log('getrelation')
        if (this.checkRuleCase('topic/gxfx/list', this.caseId)) {
          console.log('getrelation2')
          this.dispatch(FETCH_CASE_RELATION_LIST, {
            ajid: this.caseId,
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit
          }).then(() => {
            // let _charD = {
            //   nodeDataArray: [],
            //   linkDataArray: []
            // }
            if (this.analysisRelation.caseRelationList) {
              let nodeDatas = clone(this.analysisRelation.caseRelationList);
              nodeDatas.forEach((item, idx) => {
                let obj = JSON.parse(item.data);
                console.log(obj)
                obj.nodeObj.nodeDataArray.forEach((item2, idx2) => {
                  item2.source = item2.source.replace(/(?!token=)\w+&amp;/g, `${this.userData.UserToken}&`);
                  item2.color = '#000';
                });
                obj.options.readOnly = true;
                obj.options.allowZoom = false;
                item.data = obj;
              })

              this.chartDataList = nodeDatas;
              console.log(this.chartDataList, 'this.chartDataList')
            }
            console.log('69', this.chartDataList)
            // this.suspectCasePeople.PageData.map(r => {
            //   _charD.nodeDataArray.push({
            //     key: r.id,
            //     category: 'main',
            //     name: r.xm,
            //     text: r.xm
            //   })
            //   _charD.linkDataArray.push({
            //     from: r.xyrsj ? r.xyrsj : '0',
            //     to: r.id,
            //     curviness: '0'
            //   })
            // })
            // this.chartDataList = [_charD]
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
