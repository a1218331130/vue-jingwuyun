<!-- 团伙关系 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="关系分析"></card-header>
    <!-- 内容 -->
    <el-row class="certificate-box">
      <p v-if="!chartDataList || (chartDataList && chartDataList.length === 0)"
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
                    <img src="" :ref="'goBoxTRelation'+index+'img'" v-show="chartImgShow">
                      <gocharts  :ref="'goBoxTRelation'+index" v-show="!chartImgShow"
                                :boxId="'goBoxTRelation'+ index"
                                background="none"
                                 class="maker-box" :data="item.data.nodeObj"
                                :options="item.data.options"
                                @update:imageData="updateImage" @inited="chartInited"></gocharts>
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
  import cardHeader from './card-header.vue'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  // import base64Src from './a.json'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      gocharts
    },
    props: ['reportData', 'chartImgShow'],
    computed: {

    },
    data() {
      return {
        chartDataList: null
      }
    },
    methods: {
      getNodeList() {
        let nodeDatas = [];
        if (this.reportData && this.reportData.length !== 0) {
          nodeDatas = this.reportData.filter((item) => {
            return parseInt(item.sfxs) === 1;
          });
        }
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
        if (!this.reportData || this.reportData.length === 0) {
          this.chartDataList = []
        } else {
          this.chartDataList = nodeDatas;
        }
      },
      queryList() {},
      updateImage(obj) {
        setTimeout(() => {
          this.$refs[obj.ref][0].src = obj.data;
          this.$emit('push:case-relation', obj.data);
        }, 1000)
      },
      chartInited(boxId) {
        setTimeout(() => {
          this.$refs[boxId][0].makeImage({ ref: boxId + 'img' });
        }, 3500)
      }
    },
    created() {
      this.getNodeList();
    }
  }

</script>
