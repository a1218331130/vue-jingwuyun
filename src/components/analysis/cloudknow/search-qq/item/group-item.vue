<template>
<div class="result-item">
  <div class="result-item-flex">
    <div class="result-info">
      <div class="info-base" style="position:relative">
        <!-- 信息头 -->
        <div class="title">
          <div class="itme-img">

          </div>
          <div class="person-info">
            <!-- 姓名 -->
            <span class="name">
              <!-- <span v-for="elem in personData.name" :key="elem.key">{{elem }}</span> -->
              <!-- <span>{{personData.profile.qq}}</span> -->
              {{personData.profile.groupnumber}}-{{personData.profile.name}}
            </span>
            <!-- 个人信息 -->
            <!-- <span class="specific-info">({{personData.profile.gender}} {{personData.birth}} {{personData.nplace}})</span><br/> -->
            <span class="specific-info">
              (
              <span>群名称:{{personData.profile.name}}</span>
              <span>创建时间:{{personData.profile.createtime}}</span>
              <span>群大小:{{personData.profile.groupsize}}</span>
              <span>群类型:{{personData.profile.flag}}</span>
              )
            </span><br/>
            <div class="qq-marknames" v-for="(elem,i) in personData.marknames" :key="i">
              <span class="tag">备注名称:{{elem.markname}}</span>
              <span class="tag">备注人qq号:{{elem.marker.qq}}</span>
              <span class="tag">备注人昵称:{{elem.marker.nickname}}</span>
              <span class="tag">备注时间:{{elem.marktime}}</span>
              <!-- <span class="more" @click="()=>{showMoreFlag=!showMoreFlag}" v-if="personData.name.length>6">{{showMoreFlag?'收起':'更多'}}</span> -->
            </div>
          </div>
        </div>
        <!-- 工作 -->
        <div class="info-item group" v-if="personData.members.length!==0">
          <div class="info-item-left">
            <i class="iconfont img-bg qq" title="群成员"></i>
          </div>
          <div class="info-item-right" v-for="(item,i) in personData.members" :key="i">
            <div class="main-content">
              <div <div class="phone-number" v-if="item.qq">qq号:{{item.qq}}</div>
              <div <div class="phone-number" v-if="item.groupcard">群卡片:{{item.groupcard}}</div>
              <div <div class="phone-number" v-if="item.gender">性别:{{item.gender}}</div>
              <div <div class="phone-number" v-if="item.telephone">手机号:
                <span class="hover-menu" data-type="mobile">{{item.telephone}}</span></div>
              <div <div class="phone-number" v-if="item.email">邮箱:{{item.email}}</div>
              <div <div class="phone-number" v-if="item.notes">签名:{{item.notes}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped lang='scss'>
  .result-item {
    margin-top: 10px;
    background: transparents;
    &-flex {
      // display: flex;
      flex-direction: row;
      align-items: stretch;
    }
  }

  .result-info {
    padding: 10px; // width: calc(100% - 80px);
    margin-left: 10px;
    background: #fff;
    box-shadow: 0 0 3px #ccc;
    color: #666;
    min-height: 390px;
    font-size: 16px;
    .info-base {
      .title {
        display: flex;
        position: relative;
        .itme-img {
          height: 80px;
          width: 54px; // background: #ccc;
        }
        .person-info {
          margin-left: 6px;
          padding-top: 19px;
          width: calc(100% - 80px);
          .name {
            color: #1e8ffd;
            font-size: 20px;
            font-weight: 700;
            line-height: 40px;
            &>span:nth-child(even) {
              padding: 0 10px;
            }
          }
          .specific-info {
            margin-left: 10px;
          }
          .tag {
            padding-right: 8px;
          }
        }
      }
      .info-item {
        display: flex;
        margin-top: 5px;
        line-height: 26px;
        .info-item-left {
          color: #bbbbbb;
          text-align: right;
          min-width: 80px;
          padding-top: 4px;
          .iconfont {
            font-size: 28px;
            &.img-bg {
              width: 28px;
              height: 28px;
              display: block;
              margin-left: 50px;
              &.qq {
                background: url("/static/img/cloudknow/qq.png") no-repeat center top;
                background-size: 100%;
              }
              &.wechat {
                background: url("/static/img/cloudknow/weChat.png") no-repeat center top;
                background-size: 100%;
              }
              &.weibo {
                background: url("/static/img/cloudknow/sina.png") no-repeat center top;
                background-size: 100%;
              }
            }
          }
        }
        .info-item-right {
          margin-left: 6px;
          padding-top: 7px;
          .main-content {
            display: flex;
            position: relative;
            z-index: 2;
            &>div {
              margin-right: 8px;
            }
            .phone-number {
              color: #1e8ffd;
              font-weight: 700;
              font-size: 16px;
            }
            .normal {
              color: #666;
              font-weight: 700;
              font-size: 16px;
            }
            .info-icon {
              display: flex;
              position: relative;
              top: -3px;
              background: #eee;
              border: 1px solid #999;
              border-top-left-radius: 3px;
              border-top-right-radius: 3px;
              border-bottom: none;
              font-size: 14px;
              .relation-icon {
                padding: 2px 6px 0;
                cursor: pointer;
                border-bottom: 1px solid #999;
                &.icon-active {
                  border-bottom: none;
                }
                &.group {
                  font-weight: 700;
                  color: #333;
                }
                .iconfont {
                  font-size: 18px;
                  &.arrows {
                    padding-left: 3px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #333;
                  }
                }
              }
            }
          }
          .detail-content {
            line-height: 50px;
            position: relative;
            top: -4px;
            background: #eee;
            padding: 0 10px;
            border: 1px solid #999;
            border-radius: 4px;
            min-width: 400px;
            z-index: 1;
            .iconfont {
              font-size: 20px;
              font-weight: 700;
            }
            >span {
              margin-left: 10px;
              color: #1e8ffd;
              font-weight: 700;
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .more {
    padding: 0 4px;
    background: #999;
    color: #fff;
    border-radius: 2px;
    font-weight: 400;
    cursor: pointer;
  }

</style>

<script>
  export default {
    components: {},
    data() {
      return {
        groupflag: false, // qq群展示标志
        friendflag: false, // qq好友展示标志
        personData: {}, // 信息数据
        groupList: [], // qq群号码
        showMoreFlag: false, // 名字展现更多标志
        addressFlag: false // 展示更多位置标志
      }
    },
    props: ['itemData'],
    methods: {
      // qq群号码展示：
      changeGroupFlag() {
        this.friendflag = false
        this.groupflag = !this.groupflag
      },
      changeFriendFlag() {
        this.groupflag = false
        this.friendflag = !this.friendflag
      },
      // 设置personData默认值
      handleData(data) {
        let res = {
          profile: {},
          members: []
        }
        res.profile = {
          'groupnumber': data.profile.groupnumber || '',
          'name': data.profile.name || '',
          'category': data.profile.category || '',
          'flag': data.profile.flag || '',
          'bulletin': data.profile.bulletin || '',
          'fingermemo': data.profile.fingermemo || '',
          'groupsize': data.profile.groupsize || '',
          'membernum': data.profile.membernum || '',
          'createtime': data.profile.createtime || '',
          'owner': {
            'qq': data.profile.owner.qq || '',
            'nickname': data.profile.owner.nickname || ''
          }
        }
        data.members.forEach(d => {
          res.members.push({
            'qq': d.qq || '',
            'groupcard': d.groupcard || '',
            'gender': d.gender || '',
            'telephone': d.telephone || '',
            'email': d.email || '',
            'notes': d.notes || ''
          })
        })
        return res
      },
      // 名字展现更多
      showMore() {
        console.log(123)
      }
    },
    watch: {},
    computed: {
      // 展示名字数量
      showNumber() {
        if (this.showMoreFlag) {
          return this.personData.name.length
        } else {
          return 6
        }
      },
      // 展示位置条数
      showAddressNumber() {
        if (this.addressFlag) {
          return this.personData.address.length
        } else {
          return 2
        }
      }
    },
    mounted() {},
    created() {
      this.personData = this.handleData(this.itemData)
    }
  }

</script>
