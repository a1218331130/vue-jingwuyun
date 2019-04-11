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
              {{personData.profile.qq}}
            </span>
            <!-- 个人信息 -->
            <!-- <span class="specific-info">({{personData.profile.gender}} {{personData.birth}} {{personData.nplace}})</span><br/> -->
            <span class="specific-info">
              ({{personData.profile.gender}} {{personData.profile.birthday}} {{personData.profile.contry}}-{{personData.profile.province}}-{{personData.profile.city}})
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
        <!-- 身份证号码 -->
        <div class="info-item idcard" v-if="personData.profile.idcard">
          <div class="info-item-left">
            <i class="iconfont icon-touxiang" title="身份证号码"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div class="phone-number"><span class="hover-menu" data-type="idCard">{{personData.profile.idcard}}</span></div>
            </div>
          </div>
        </div>
        <!-- 手机号码 -->
        <div class="info-item phone" v-if="personData.profile.mobile">
          <div class="info-item-left">
            <i class="iconfont icon-shouji" title="手机号码"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div class="phone-number"><span class="hover-menu" data-type="mobile">{{personData.profile.mobile}}</span></div>
            </div>
          </div>
        </div>
        <!-- QQ群 -->
        <div class="info-item group" v-if="personData.groups.length!==0||personData.friends.length!==0">
          <div class="info-item-left">
            <i class="iconfont img-bg qq" title="QQ"></i>
          </div>
          <div class="info-item-right">
            <div style="display:flex">
              <div class="main-content">
                <div class="phone-number">{{personData.profile.qq}}</div>
                <div class="info-icon">
                  <span :class="{'relation-icon':true, 'group':true, 'icon-active':groupflag}" @click="changeGroupFlag()" style="border-right:1px solid #666">{{personData.groups.length}}个群<i :class="{'iconfont':true, 'icon-unfold1':!groupflag, 'icon-packup-2':groupflag,'arrows':true}"></i></span>
                  <!-- <i class="iconfont icon-guanxi"></i> -->
                  <span :class="{'relation-icon':true, 'group':true, 'icon-active':friendflag}" @click="changeFriendFlag()">{{personData.friends.length}}个好友<i :class="{'iconfont':true, 'icon-unfold1':!friendflag, 'icon-packup-2':friendflag,'arrows':true}"></i></span>
                </div>
              </div>
            </div>
            <div class="detail-content" v-show="groupflag">
              <!-- <i class="iconfont icon-addressbook"></i> -->
              <span v-for="(elem,i) in personData.groups" :key="i" :title="'群名:'+elem.groupname+'\r'+
              '群卡片:'+elem.groupcard+'\r'+'更新时间:'+elem.updatetime">{{elem.groupnumber}}</span>
            </div>
            <div class="detail-content" v-show="friendflag">
              <!-- <i class="iconfont icon-addressbook"></i> -->
              <span v-for="(elem,i) in personData.friends" :key="i" :title="'好友昵称:'+elem.nickname+'\r'+'备注昵称:'+elem.markname+'\r'+'更新时间:'+elem.updatetime">{{elem.qq}}</span>
            </div>
          </div>
        </div>
        <!-- 微信 -->

        <!-- 邮箱 -->
        <div class="info-item email" v-if="personData.profile.email">
          <div class="info-item-left">
            <i class="iconfont icon-mail" title="邮箱"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div <div class="phone-number">{{personData.profile.email}}</div>
            </div>
          </div>
        </div>
        <!-- 微博 -->
        <div class="info-item weibo" v-if="personData.profile.weibo">
          <div class="info-item-left">
            <i class="iconfont img-bg weibo" title="微博"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div <div class="phone-number">{{personData.profile.weibo}}</div>
            </div>
          </div>
        </div>
        <!-- 地址定位 -->
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
          marknames: [],
          friends: [],
          groups: []
        }
        res.profile = { // qq注册信息
          qq: data.profile.qq || '', //  qq号
          nickname: data.profile.nickname || '', // 昵称
          realname: data.profile.realname || '', // 真实姓名
          gender: data.profile.gender || '', // 性别
          telephone: data.profile.telephone || '', // 电话号码
          mobile: data.profile.mobile || '', // 手机号码
          birthday: data.profile.birthday || '', // 生日
          contry: data.profile.contry || '', // 国家
          province: data.profile.province || '', // 省份
          city: data.profile.city || '', // 城市
          faceimg: data.profile.faceimg || '', // 头像
          idcard: data.profile.idcard || '', // 身份证
          email: data.profile.email || '', // 邮箱
          weibo: data.profile.weibo || '' // 微博
        }
        data.marknames.forEach(d => {
          res.marknames.push({
            markname: d.markname,
            marker: {
              qq: d.marker.qq,
              nickname: d.marker.nickname
            },
            marktime: d.marktime
          })
        })
        data.friends.forEach(d => {
          res.friends.push({
            qq: d.qq || '', // 好友qq号码
            nickname: d.nickname || '', // 好友qq昵称
            markname: d.markname || '', // 当前QQ给此好友备注的名称
            updatetime: d.updatetime || '' // 备注更新时间
          })
        })
        data.groups.forEach(d => {
          res.groups.push({
            groupnumber: d.groupnumber || '', // 群号
            groupname: d.groupname || '', // 群名称
            groupcard: d.groupcard || '', // 群名片
            updatetime: d.updatetime || '' // 更新时间
          })
        })
        return res
      },
      // 名字展现更多
      showMore() {

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
