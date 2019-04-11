<template>
  <div>
    <div style="clear: both"></div>
    <P  v-if="data.length === 0" style="color: #5e7382">暂无数据</P>
    <div class="time_Line_start" v-if="data.length > 0">
      <div class="start_br">
        <span class="iconfont icon-ditu"></span>
      </div>
    </div>
    <div v-for="(itemYear,YIndex) in data" class="time-box" :key="YIndex">
      <div class="timeLine_box timeLine_box_year">
        <div>
          <div class="timeLine_Left log" @click="itemYear.type=!itemYear.type"><span
            class="timeLine_time">{{itemYear.year}}</span><span
            class="el-icon-caret-bottom caret-l"
            :class="[ itemYear.type ? 'el-icon-caret-top':'el-icon-caret-bottom']"></span></div>
          <div class="timeLine_Right_year">
          </div>
        </div>
      </div>
      <div>
        <div class="timeLine_box" v-show="itemYear.type" v-for="(itemMonth,MIndex) in itemYear.month" :key="MIndex">
          <div>
            <div class="timeLine_Left log"><span class="timeLine_time">{{itemMonth.time}}</span>
              <!-- icon-feiji2:飞机 、 icon-city：酒店 、 icon-huoche：火车 、icon-cheliang：小车 、icon-youlun：轮渡 -->
              <span :class="'posicon iconfont '+ itemMonth.moreUrl"></span>
            </div>
            <div class="timeLine_Right">
              <div class="timeLine_box" v-for="(itemContent,CIndex) in itemMonth.contentList" :key="CIndex">
                <dl style="text-align: left;padding: 0;margin: 0;">
                  <dd :span="24" v-for="(itemDetail,DIndex) in itemContent.details" :key="DIndex"
                      style="float: left;margin:5px 35px 5px 0;">
                    <label style="color: #888">{{itemDetail.label}}：</label>
                    <span style="color: #333">{{itemDetail.value}}</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

  .time-box:after {
    content: '';
    display: block;
    clear: both;
  }

  .timeLine_box_year {
    .timeLine_Left {
      cursor: pointer;
      background: #4ab7ff;
      color: #fff;
      border-radius: 20px 0 0 20px;
      .timeLine_time {
        color: #fff;
        height: 30px;
        line-height: 30px;
      }
      .caret-l {
        margin-left: 10px;
      }
    }
  }

  .timeLine_box {
    padding: 0 15px;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .time_Line_start {
    position: relative;
    width: 90px;
    height: 40px;
    &:before {
      content: '';
      display: block;
      clear: both;
    }
    .start_br {
      width: 40px;
      height: 40px;
      line-height: 40px;
      color: #4ab7ff;
      text-align: center;
      border-radius: 50%;
      background-color: #f2f2f2;
      border: 1px solid #4ab7ff;
      position: absolute;
      right: -37px;
      .iconfont {
        font-size: 25px;
      }
    }
  }

  .timeLine_Left {
    width: 90px;
    float: left;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    margin-top: 15px;
    .timeLine_time {
      color: #4ab7ff;

    }
    .posicon {
      position: absolute;
      right: -10px;
      width: 22px;
      height: 22px;
      background: #4ab7ff;
      color: #fff;
      border-radius: 50%;
      line-height: 22px;
    }
  }

  .timeLine_Right_year {
    float: left;
    width: calc(100% - 90px);
    box-sizing: border-box;
    padding-bottom: 50px;
    border-left: 1px solid #e5e5e5;
  }

  .timeLine_Right {
    float: left;
    min-height: 50px;
    width: calc(100% - 90px);
    box-sizing: border-box;

    padding-bottom: 30px;
    border-left: 1px solid #e5e5e5;
    .timeLine_box {
      border-bottom: 1px solid #d7d7d7;
      padding: 15px 50px;
      color: #666;
      background: #f1f7fc;

    }
  }

  .timeline_address {
    color: #000;
    font-weight: bold;
  }

  .timeline_body {
    color: #4ab7ff;
  }

</style>


<script>
  /***
   data:[
   {
   type: true, // 是否展开显示
   year: '', // 年份数据
   month: [
     {
      time: ‘’, // 日期数据
      moreUrl: 'icon-city', // 节点类型图标  【icon-feiji2:飞机 、 icon-city：酒店 、 icon-huoche：火车 、icon-cheliang：小车 、icon-youlun：轮渡】
      contentList: [
       {
         details: [ // 详情内容
           {
                label: '', // 显示label
                value: ''  // 显示内容
            }
         ]
       }
      ]
     }
   ]
   }
   ]
   */
  export default {
    props: ['data']
  }
</script>
