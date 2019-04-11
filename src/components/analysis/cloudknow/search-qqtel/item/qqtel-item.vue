<template>
<div class="result-item">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="info-base" style="position:relative">
        <div class="info-icon">
          <i class="wbtel-icon"></i>
        </div>
        <div class="info-content">
          <div class="info-content-item">
            手机号码 :
            <span class="phone-number"><span class="hover-menu" data-type="mobile">{{resList.telnum}}</span></span>
          </div>
          <div class="info-content-item">
            QQ 账号 :
            <span class="qq-number">{{resList.wbid}}</span>
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
    padding: 10px; // width: calc(100%);
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
        background: url("/static/img/cloudknow/qq.png") no-repeat center top;
        background-size: 100%;
      }
      .info-content {
        width: 210px;
        &>div {
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
            wbid: '',
            telnum: ''
          }
        }
      }
    },
    methods: {
      handleData(data) {
        let res = {
          wbid: data.wbid || '',
          telnum: data.telnum || ''
        }
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
