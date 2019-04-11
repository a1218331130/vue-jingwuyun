<template>
<div class="result-item">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="info-base" style="position:relative">
        <div class="info-icon">
          <i class="iconfont icon-shouji"></i>
        </div>
        <div class="info-content">
          <div class="relative-level">
            <i v-for="elem in resList.score" :key="elem" class="iconfont icon-collection_fill"></i>
            <!-- <i class="iconfont icon-collection_fill"></i>
            <i class="iconfont icon-collection_fill"></i> -->
          </div>
          <div class="phone-number">
            {{resList.account}}
          </div>
          <div class="person-name">
            {{resList.name[0]}}
          </div>
          <div class="address">
            {{addressFormat(resList.location)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang='scss'>
.result-item {
    overflow: hidden;
    float: left;
    width: 260px;
    margin-left: 10px;
    margin-top: 10px;
    background: transparents;
    &-flex {
        // display: flex;
        flex-direction: row;
        align-items: stretch;
    }
}
.result-info {
    padding: 10px;
    // width: calc(100%);
    background: #fff;
    box-shadow: 0 0 3px #ccc;
    color: #666;
    width: 250px;
    .info-base {
        display: flex;
        width: 250px;
        overflow: hidden;
        .info-icon {
            width: 50px;
            .iconfont {
                font-size: 40px;
                color: #20a0ff;
                line-height: 98px;
            }
        }
        .info-content {
            width: 210px;
            & > div {
                margin-bottom: 5px;
                height: 22px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            .relative-level {}
            .phone-number {
                color: #1e8ffd;
                font-weight: 700;
                font-size: 16px;
            }
            .person-name {
                font-weight: 700;
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .address {}
        }
    }
}
.more {
    padding: 0 4px;
    background: #999;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
}
.icon-collection_fill {
    color: #e2960c;
}
</style>

<script>
export default {
  components: {},
  data() {
    return {
      resList: {}
    }
  },
  props: {
    dataList: {
      type: Object,
      default: () => {
        return {
          account: '',
          name: [''],
          location: '',
          score: 1
        }
      }
    }
  },
  methods: {
    handleData(data) {
      let res = {
        account: data.account,
        name: data.name,
        location: data.location,
        score: this.relativeStar(data.score)
      }
      return res
    },
    // 星星个数转换
    relativeStar(data) {
      if(data > 66) {
        return 3
      } else if(data > 33) {
        return 2
      } else {
        return 1
      }
    },
    // 地址格式化
    addressFormat(val) {
      if(!val) return
      if(val.indexOf('/') === -1) return val
      let res = val.split('/').slice(1).join('-')
      return res
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.resList = this.handleData(this.dataList)
  }
}
</script>
