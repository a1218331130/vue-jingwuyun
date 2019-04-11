<template>
<div class="time_line_box">
  <div style="clear: both"></div>
  <div v-if="timeLine[0].detailed.length>0 || timeLine[1].detailed.length>0 || timeLine[2].detailed.length>0">
    <div class="time_Line_start">
      <div class="start_br">
        <span class="iconfont icon-ditu"></span>
      </div>
    </div>
    <div v-for="(item,idx) in timeLine" class="time-box">
      <div class="timeLine_box timeLine_box_year">
        <div>
          <div class="timeLine_Left log" @click="item.flag=!item.flag" style="position:relative;">
            <span class="timeLine_time">{{item.year}}</span>
            <span class="el-icon-caret-bottom caret-l" :class="[ item.flag ? 'el-icon-caret-top':'el-icon-caret-bottom']"></span>
            <span style="position:absolute;font-size:12px;right:2px;top:5px;">{{item.flag?'关闭':'展开'}}</span>
          </div>
          <div class="timeLine_Right_year">
            
          </div>
        </div>
      </div>
      <div class="detailed" v-show="item.flag">
        <div class="timeLine_box"  v-for="detas in item.detailed">
          <div v-if="detas.type === 'hd'" v-show="detas.show===true">
            <div class="timeLine_Left log">
              <span class="timeLine_time">{{detas.time}}</span>
              <span class="iconfont icon-zijin posicon"></span>
            </div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <div class="list">
                    <div class="list__desc text-right">
                      <div class="list__time">{{detas.ksddmc}}</div>
                    </div>
                    <div class="list__linebox">
                      <div class="list__title">{{detas.address}}</div>
                      <div class="list__title">
                      </div>
                      <div class="list__line"></div>
                    </div>
                    <div class="list__desc">
                      <div class="list__time">{{detas.jsddmc}}</div>
                    </div>
                  </div>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="6">
                    <span>姓名：</span>
                    <span class="timeline_address">{{detas.name}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>对方姓名：</span>
                    <span class="timeline_address">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>设备编号：</span>
                    <span class="timeline_address">{{detas.number}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>转账时间：</span>
                    <span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="detas.type === 'gt'" v-show="detas.show===true">
            <div class="timeLine_Left log">
              <span class="timeLine_time">{{detas.time}}</span>
              <span class="iconfont icon-huoche posicon"></span>
            </div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <div class="list">
                    <div class="list__desc text-right">
                      <div class="list__time">{{detas.ksddmc}}</div>
                    </div>
                    <div class="list__linebox">
                      <div class="list__title">{{detas.number}}</div>
                      <div class="list__title">
                      </div>
                      <div class="list__line"></div>
                    </div>
                    <div class="list__desc">
                      <div class="list__time">{{detas.jsddmc}}</div>
                    </div>
                  </div>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="6">
                    <span>姓名：</span>
                    <span class="timeline_address">{{detas.name}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>座位号：</span>
                    <span class="timeline_address">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>发车时间：</span>
                    <span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>到达时间：</span>
                    <span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="detas.type === 'ly'" v-show="detas.show===true">
            <div class="timeLine_Left log">
              <span class="timeLine_time">{{detas.time}}</span>
              <span class="iconfont icon-city posicon"></span>
            </div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <div class="line-content">
                    <span>{{detas.address}}</span>
                  </div>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="8">
                  入住酒店：
                    <span class="timeline_address">{{detas.hotel+"&nbsp"+detas.room+"房"}}</span>
                  </el-col>
                  <el-col :span="4">
                    <span>姓名：</span>
                    <span class="timeline_address">{{detas.name}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>入住时间：</span>
                    <span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                  </el-col>
                  <el-col :span="6">
                    <span>退房时间：</span>
                    <span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="detas.type === 'wb'" v-show="detas.show===true">
            <div class="timeLine_Left log">
              <span class="timeLine_time">{{detas.time}}</span>
              <span class="iconfont icon-msnui-webpage posicon"></span>
            </div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <div class="line-content">
                    <span>{{detas.address}}</span>
                  </div>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="6">
                    位置号：
                    <span class="timeline_address">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>姓名：</span>
                    <span class="timeline_address">{{detas.name}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>上机时间：</span>
                    <span class="timeline_body">{{detas.startroom}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>下机时间：</span>
                    <span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-if="detas.type === 'hb'" v-show="detas.show===true">
            <div class="timeLine_Left log">
              <span class="timeLine_time">{{detas.time}}</span>
              <span class="iconfont icon-feiji2 posicon"></span>
            </div>
            <div class="timeLine_Right">
              <div class="timeLine_box">
                <el-row :gutter="15" style="margin-bottom: 15px;">
                  <div class="list">
                    <div class="list__desc text-right">
                      <div class="list__time">{{detas.ksddmc}}</div>
                    </div>
                    <div class="list__linebox">
                      <div class="list__title">{{detas.number}}</div>
                      <div class="list__title">
                      </div>
                      <div class="list__line"></div>
                    </div>
                    <div class="list__desc">
                      <div class="list__time">{{detas.jsddmc}}</div>
                    </div>
                  </div>
                </el-row>
                <el-row :gutter="15">
                  <el-col :span="6">
                    <span>姓名：</span>
                    <span class="timeline_address">{{detas.name}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>座位号：</span>
                    <span class="timeline_address">{{detas.room}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>起飞时间：</span>
                    <span class="timeline_address">{{detas.startroom}}</span>
                  </el-col>
                  <el-col :span="6">
                    <span>到达时间：</span>
                    <span class="timeline_body">{{detas.endroom}}</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-row :gutter="10" v-else>
    <el-col :span="24">
      <div class="empty_h">
        <div class="empty "></div>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
  .time_line_box {
    min-height: 50px;
    .empty {
      min-height: 50px;
    }
    .detailed {
      max-height: 350px; // height: auto;
      overflow: auto;
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
        margin-left: 4px;
        margin-right: 18px;
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
    box-sizing: border-box; // padding-bottom: 50px;
    height: 50px;
    line-height: 60px;
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

  .list {
    font-size: 24px;
    width: auto;
    margin-top: 1px; // margin-bottom: 10px;
    margin-left: 10px;
    height: 35px;
    display: flex;
    float: left;
    color: #48ACE6;
    &__title {
      color: #ff9900;
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 16px;
      width: auto;
      .yellow {
        color: #ff9900;
      }
    }
    &__time {
      font-weight: bold;
      margin-top: 5px;
    }
    &__line {
      height: 1px;
      background: #cccccc;
      position: relative;
      &:after {
        content: '';
        background: #cccccc;
        width: 16px;
        height: 1px;
        display: block;
        position: absolute;
        top: -5px;
        right: 0;
        transform: rotate(36deg);
      }
    }
    &__desc {
      flex-grow: 1;
    }
    &__linebox {
      flex-grow: 0;
      flex-shrink: 0;
      width: 200px;
      margin: 0 15px;
      text-align: center;
      .list__title {
        color: #999;
      }
    }
  }

  .line-content {
    span {
      margin-left: 10px;
      font-size: 26px;
      color: #48ACE6;
      margin-top: 10px;
    }
  }

</style>


<script>
  export default {
    data() {
      return {
        flag: false
      }
    },
    props: ['timeLine'],
    computed: {},
    methods: {},
    mounted() {
      this.timeLine.map(item => {
        let flag2 = false;
        if (!this.flag) {
          if (item.detailed && item.detailed.length > 0) {
            this.flag = true;
            flag2 = true;
          }
        } else {
          flag2 = false;
        }
        this.$set(item, 'flag', flag2)
      })
    }
  }

</script>
