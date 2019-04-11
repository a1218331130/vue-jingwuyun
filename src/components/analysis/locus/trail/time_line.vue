<template>
<div class="time_line_box">
  <div style="clear: both"></div>
  <!--<div v-if="timeLine.length>0">-->
  <div >
    <div class="time_Line_start">
      <div class="start_br">
        <span class="iconfont icon-ditu"></span>
      </div>
    </div>
    <div v-for="item in timeLine" class="time-box">
      <div class="timeLine_box timeLine_box_year">
        <div>
          <div class="timeLine_Left log" @click="item.type=!item.type"><span class="timeLine_time">{{item.year}}</span><span class="el-icon-caret-bottom caret-l" :class="[ item.type ? 'el-icon-caret-top':'el-icon-caret-bottom']"></span></div>
          <div class="timeLine_Right_year">
          </div>
        </div>
      </div>
      <div>
        <div class="timeLine_box" v-show="item.type" v-for="detas in item.detailed">
          <div v-if="detas.type==='WB'">
            <div class="timeLine_Left log"><span class="timeLine_time">{{detas.time}}</span><span class="iconfont icon-huzhao posicon"></span></div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    位置号：<span class="timeline_body">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>开始时间：</span><span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="12">
                    <span>地址：</span><span class="timeline_address">{{detas.address}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>结束时间：</span><span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="detas.type==='LY'">
            <div class="timeLine_Left log"><span class="timeLine_time">{{detas.time}}</span><span class="iconfont icon-feiji2 posicon"></span></div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    座位号：<span class="timeline_body">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>到达时间：</span><span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="12">
                    <span>地址：</span><span class="timeline_address">{{detas.address}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>起飞时间：</span><span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="detas.type==='JD'">
            <div class="timeLine_Left log"><span class="timeLine_time">{{detas.time}}</span><span class="iconfont icon-city posicon"></span></div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <el-col :span="12">
                    房号：<span class="timeline_body">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>入住时间：</span><span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="12">
                    <span>地址：</span><span class="timeline_address">{{detas.address}}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>退房时间：</span><span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <!--<el-row :gutter="10" v-else>-->
    <!--<el-col :span="24">-->
      <!--<div class="empty_h">-->
        <!--<div class="empty "></div>-->
      <!--</div>-->
    <!--</el-col>-->
  <!--</el-row>-->
</div>
</template>

<style lang="scss" scoped>
.time_line_box {
    min-height: 50px;
    .empty {
        min-height: 50px;
    }
}
.time-box:after {
    content: '';
    display: block;
    clear: both;
}

.timeLine_box_year {
    .timeLine_Left {
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
.empty_h {
    height: 113px;
}
</style>


<script>
export default {
  props: ['timeLine']
}
</script>
