<template>
<div>
  <div style="clear: both"></div>
  <div class="time-line-start">
    <div class="start-br" @click="callAllData" title="点击获取所有轨迹">
      <span class="iconfont icon-rili1"></span>
      <div class="page-count">({{currentCount}}/{{total}})</div>
    </div>
  </div>
  <div v-for="item in timeLine" class="time-box">
    <div class="timeline-box timeline-box-year">
      <div>
        <div class="timeline-left" @click="item.type=!item.type"><span class="timeline-time">{{item.year}}</span><span class="el-icon-caret-bottom caret-l" :class="[ item.type ? 'el-icon-caret-top':'el-icon-caret-bottom']"></span></div>
        <div class="timeline-Right-year">
        </div>
      </div>
    </div>
    <div class="timeLine-main">
      <div class="timeline-box" v-show="item.type" v-for="subItem in item.months">
        <div>
          <div class="timeline-left" @click="callMonth([item.year,subItem])"><span class="timeline-time">{{subItem}}月</span><span :class="{'iconfont icon-coordinates-fill posicon':true,current:showItem === item.year+subItem}"><i class="icon iconfont icon-coordinates_fill"></i></span></div>
          <div class="timeline-Right">
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="timeline-end" style="text-align: center;
margin-top: 10px;
color: #ccc;">
    END
  </div>
</div>
</template>

<style lang="scss" scoped>
  .time-box {
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .timeline-box-year {
    .timeline-left {
      background: #4ab7ff;
      color: #fff;
      border-radius: 20px 0 0 20px;
      .timeline-time {
        color: #fff;
        height: 30px;
        line-height: 30px;
      }
      .caret-l {
        margin-left: 10px;
      }
    }
  }

  .timeline-box {
    padding: 0 15px;
    &:after {
      content: '';
      display: block;
      clear: both;
    }
  }

  .time-line-start {
    position: relative;
    width: 90px;
    height: 65px;
    &:before {
      content: '';
      display: block;
      clear: both;
    }
    .start-br {
      width: 125px;
      height: 65px;
      line-height: 33px;
      color: #4ab7ff;
      text-align: center;
      border-radius: 20px;
      background-color: #FFFFFF;
      border: 1px solid #4ab7ff;
      position: absolute;
      right: -52px;
      top: 2px;
      .iconfont {
        font-size: 33px;
        height: 33px;
        line-height: 33px;
      }
    }
  }

  .timeline-left {
    width: 62px;
    float: left;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    margin-top: 15px;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
    .timeline-time {
      color: #4ab7ff;
    }
    .posicon {
      position: absolute;
      right: -12px;
      width: 22px;
      height: 22px;
      background: #4ab7ff;
      color: #fff;
      border-radius: 50%;
      line-height: 22px;
    }
    .current {
      background: #F7BA2A;
      color: #F7BA2A;
    }
  }

  .timeline-Right-year {
    float: left;
    width: calc(100% - 90px);
    box-sizing: border-box;
    padding-bottom: 50px;
    border-left: 2px solid #4ab7ff;
  }

  .timeline-Right {
    float: left;
    min-height: 50px;
    box-sizing: border-box;
    padding-bottom: 30px;
    border-left: 2px solid #4ab7ff;
  }

  .timeline-address {
    color: #000;
    font-weight: bold;
  }

  .timeline-body {
    color: #4ab7ff;
  }

  .page-count {
    margin-top: -10px;
  }

</style>

<script>
  import bus from '../../../utils/bus'
  export default {
    props: ['total', 'currentCount'],
    data() {
      return {
        showItem: '',
        timeLine: []
      }
    },
    methods: {
      callMonth(item, b) {
        console.log(item, 123, b);
        bus.$emit('call:timeline-month', item)
        this.showItem = item[0] + item[1]
        console.log(this.showItem);
      },
      callAllData() {
        // this.showItem = ''
        // bus.$emit('call:timeline-all')
      },
      createTimeLine(data) {
        if (data.length > 0) {
          this.showItem = ''
          this.timeLine = []
          if (data.length > 0) {
            // 年月抽取, 数据去重
            let res = [],
              monthArr = Array.from(new Set(
                data.map(t => {
                  let d = t.split(' ')[0].split('月')[0]
                  let dateArr = d.split('年')
                  if (!res.find(r => r.year === dateArr[0])) {
                    res.push({
                      type: false,
                      year: dateArr[0],
                      months: []
                    })
                  }
                  return `${dateArr[0]}-${dateArr[1]}`
                })
              ))
            // 分组
            monthArr.forEach(d => {
              let dateArr = d.split('-')
              res.find(r => r.year === dateArr[0]).months.push(dateArr[1])
            })
            res[0].type = true
            this.timeLine = res
          } else {}
        }
      }
    },
    mounted() {
      bus.$on('update:timelist', data => {
        // console.log(data, 123456)
      })
    }
  }

</script>
