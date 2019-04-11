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
              <span>{{personData.name[0]}}</span>
            </span>
            <!-- 个人信息 -->
            <span class="specific-info">({{personData.gender}} {{personData.birth}} {{personData.nplace}})</span><br/>
            <span class="tag" v-for="(elem,i) in personData.name" :key="i" v-if="i!==0&&i<showNumber">{{elem}}</span>
            <span class="more" @click="()=>{showMoreFlag=!showMoreFlag}" v-if="personData.name.length>6">{{showMoreFlag?'收起':'更多'}}</span>
          </div>
        </div>
        <!-- 工作 -->
        <!-- <div class="info-item wechat" v-if="personData.wechat.length>0">
          <div class="info-item-left">
            <i class="iconfont img-bg wechat" title="微信"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div class="normal" v-for="(elem,i) in personData.wechat" :key="i">{{elem}}</div>
            </div>
          </div>
        </div> -->
        <!-- 身份证号码 -->
        <div class="info-item idcard" v-if="personData.telnum.length>0">
          <div class="info-item-left">
            <i class="iconfont icon-touxiang" title="身份证号码"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div class="phone-number" v-for="(elem,i) in personData.idcard" :key="i">{{elem}}</div>
              <!-- <div class="phone-address">(广东广州-移动)</div> -->
              <!-- <div class="info-icon">
                <span class="relation-icon"><i class="iconfont icon-guanxi"></i></span>
                <span class="relation-icon" style="border-left:1px solid #666"><i class="iconfont icon-hudong"></i></span>
              </div> -->
            </div>
          </div>
        </div>
        <!-- 手机号码 -->
        <div class="info-item phone" v-if="personData.telnum.length>0">
          <div class="info-item-left">
            <i class="iconfont icon-shouji" title="手机号码"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div class="phone-number" v-for="(elem,i) in personData.telnum" :key="i">{{elem}}</div>
              <!-- <div class="phone-address">(广东广州-移动)</div> -->
              <!-- <div class="info-icon">
                <span class="relation-icon"><i class="iconfont icon-guanxi"></i></span>
                <span class="relation-icon" style="border-left:1px solid #666"><i class="iconfont icon-hudong"></i></span>
              </div> -->
            </div>
          </div>
        </div>
        <!-- QQ群 -->
        <div class="info-item group" v-if="personData.qq.length>0">
          <div class="info-item-left">
            <i class="iconfont img-bg qq" title="QQ"></i>
          </div>
          <div class="info-item-right">
            <div style="display:flex">
              <div class="main-content" v-for="(elem,i) in personData.qq" :key="i">
                <div class="phone-number">{{elem.value}}</div>
                <div class="info-icon">
                  <span :class="{'relation-icon':true, 'group':true, 'icon-active':elem.flag}" @click="changeGroupFlag(i)" style="border-right:1px solid #666">{{elem.group.length}}个群<i :class="{'iconfont':true, 'icon-unfold1':!elem.flag, 'icon-packup-2':elem.flag,'arrows':true}"></i></span>
                  <span class="relation-icon"><i class="iconfont icon-guanxi"></i></span>
                </div>
              </div>
            </div>
            <div class="detail-content" v-show="groupflag">
              <!-- <i class="iconfont icon-addressbook"></i> -->
              <span v-for="(elem,i) in groupList" :key="i">{{elem}}</span>
            </div>
          </div>
        </div>
        <!-- 微信 -->
        <div class="info-item wechat" v-if="personData.wechat.length>0">
          <div class="info-item-left">
            <i class="iconfont img-bg wechat" title="微信"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div class="normal" v-for="(elem,i) in personData.wechat" :key="i">{{elem}}</div>
            </div>
          </div>
        </div>
        <!-- 邮箱 -->
        <div class="info-item email" v-if="personData.msn.length>0">
          <div class="info-item-left">
            <i class="iconfont icon-mail" title="邮箱"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content">
              <div <div class="phone-number" v-for="(elem,i) in personData.msn" :key="i">{{elem}}</div>
            </div>
          </div>
        </div>
        <!-- 地址定位 -->
        <div class="info-item address">
          <div class="info-item-left">
            <i class="iconfont icon-dingwei1" title="定位"></i>
          </div>
          <div class="info-item-right">
            <div class="main-content" v-for="(elem,i) in personData.address" :key="i">
              <div class="normal" v-show="i<showAddressNumber">
                <span>{{elem}}</span>
                <span class="more" v-show="i===showAddressNumber-1" @click="()=>{addressFlag=!addressFlag}">{{addressFlag?'收起':'更多'}}</span>
              </div>
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
    padding: 10px;
    // width: calc(100% - 80px);
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
                width: 54px;
                // background: #ccc;
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
                    & > span:nth-child(even) {
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
                    & > div {
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
                    > span {
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
      personData: {}, // 信息数据
      groupList: [], // qq群号码
      showMoreFlag: false, // 名字展现更多标志
      addressFlag: false // 展示更多位置标志
    }
  },
  props: ['itemData'],
  methods: {
    // qq群号码展示：
    changeGroupFlag(i) {
      if(this.personData.qq[i].group.length === 0) return
      if(!this.personData.qq[i].flag) {
        this.personData.qq.forEach(d => {
          d.flag = false
        })
        this.personData.qq[i].flag = true
        this.groupList = this.personData.qq[i].group
        this.groupflag = true
      } else {
        this.groupflag = false
        this.personData.qq[i].flag = false
      }
    },
    // 设置personData默认值
    handleData(data) {
      let res = {
        name: data.name || [], // 姓名及外号
        gender: data.gender || '', // 性别
        telnum: data.telnum || [], // 手机号码
        ftelnum: data.ftelnum || [], // 电话号码
        qq: [], // qq及qq群
        idcard: data.idcard || [], // 身份证
        msn: data.msn || [], // msn帐号
        email: data.email || [], // 邮箱
        mblog: data.mblog || [], // 博客
        location: data.location || '', // 归属地，例如：/中国/江苏/南京
        address: data.address || [], // 地址
        homeurl: data.homeurl || [], // 个人主页
        faceimg: data.faceimg || [], // 头像
        birth: data.birth || '', // 生日
        nplace: data.nplace || '', // 籍贯信息
        wechat: data.wechat || [], // 微信
        job: data.job || [], // 工作
        relationshipstats: data.relationshipstats || { kindred: 0, shoolmate: 0 } // 近亲关系及同学关系
      }
      data.qq.map(d => {
        res.qq.push({
          value: d.value,
          group: d.group,
          flag: false
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
      if(this.showMoreFlag) {
        return this.personData.name.length
      } else {
        return 6
      }
    },
    // 展示位置条数
    showAddressNumber() {
      if(this.addressFlag) {
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
