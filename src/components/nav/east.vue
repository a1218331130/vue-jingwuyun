<template>
<div class="info-box">
  <div class="info-hand">
    <div class="info-logo_box">
      <img :src="info.webLogo">
    </div>
    <div class="info-hand-box">
      <p :title="info.name"><i class="iconfont icon-homepage"></i>
        <span class="info-hand-box_text">{{info.name}}</span>
      </p>
      <!--<a :href="info.link">-->
      <p :title="info.link"><i class="iconfont icon-web"></i>
        <span class="info-hand-box_text">{{info.link}}</span>
      </p>
      <!--</a>-->
      <p :title="info.user"><i class="iconfont icon-user"></i>
        <span class="info-hand-box_text">{{info.user}}</span>
      </p>
      <p :title="info.name"><i class="iconfont icon-dianhua"></i>
        <span class="info-hand-box_text">{{info.phone}}</span>
      </p>
      <p :title="info.name"><i class="iconfont icon-dingwei"></i>
        <span class="info-hand-box_text">{{info.area}}</span>
      </p>
    </div>
  </div>
  <div class="brief">
    <div class="brief-mayor">
      <div class="brief-mayor-menu">
        <div class="icon-box"><i class="iconfont icon-note"></i></div>
        <div class="mayor-title">系统简介</div>
      </div>
      <div class="brief-content">{{info.desc}}</div>
    </div>
    <div class="brief-mayor">
      <div class="brief-mayor-menu">
        <div class="icon-box"><i class="iconfont icon-xitongxinxi"></i></div>
        <div class="mayor-title">主要功能</div>
      </div>
      <div class="tool-content">
        <div class="brief-list-box">
          <el-row>
            <el-col class="brief-list" :key="item" :span="12" v-for="(item,i) in info.system">[{{i + 1}}]{{item}}
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  <div class="tool">
    <span class="into" @click="into(info)"><i class="iconfont icon-into"></i> 进入系统</span>
    <!--<span @click="apply(info)" style="background-color: #e6a00c;">
        <i class="iconfont icon-xinjianbiji"></i> {{(info.isApply !== '' && info.isApply) ? '已提交申请' : '申请使用'}}
      </span>-->
    <span @click="collect(info)" v-if="info.isColle===null"><i class="iconfont icon-collection"></i> 收藏系统</span>
    <span v-if="info.isColle!==null" @click="unCollect(info)"><i
        class="iconfont icon-collection_fill"></i> 取消收藏</span>
  </div>
</div>
</template>
<style lang="scss" scoped>
.info-box {
    position: relative;
    width: 306px;
    height: 900px;
    border-left: 1px solid #cccccc;
    background-color: #f8f8f8;
    .info-hand {
        height: 115px;
        padding: 20px 10px;
        position: relative;
        .info-logo_box {
            width: 90px;
            height: 100%;
            overflow: hidden;
            /*background: rgba(9, 99, 149, 0.67);*/
            position: relative;
            > img {
                max-width: 100%;
                max-height: 100%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
        }
        .info-hand-box {
            position: absolute;
            top: 20px;
            left: 105px;
            right: 5px;
            p {
                margin: 0;
                line-height: 24px;
                font-size: 14px;
                overflow: hidden;
                padding-right: 0;
                text-overflow: ellipsis;
                margin-bottom: 5px;
                i {
                    color: #4781af;
                    margin-right: 5px;
                    float: left;
                }
                .info-hand-box_text {
                    word-wrap: break-word;
                    display: -webkit-box;
                    line-height: 1.2;
                    max-height: 33px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }
            }
        }
    }
    .brief {
        height: calc(100% - 230px);
        .brief-mayor {
            .brief-mayor-menu {
                height: 35px;
                line-height: 35px;
                background-color: #f5f5f5;
                border-top: 1px solid #cccccc;
                border-bottom: 1px solid #cccccc;
                .icon-box {
                    width: 50px;
                    height: 33px;
                    padding-top: 2px;
                    float: left;
                    text-align: center;
                    border-right: 1px solid #cccccc;
                    i {
                        color: #3c79b6;
                        font-size: 20px;
                    }
                }
                .mayor-title {
                    float: left;
                    color: #5b5b5b;
                    font-size: 16px;
                    padding-left: 10px;
                }
            }
            .brief-content {
                background-color: #ffffff;
                padding: 20px 10px 20px 20px;
                text-indent: 2em;
                max-height: 250px;
                overflow: scroll;
            }
            .tool-content {
                background-color: #ffffff;
                .brief-list-box {
                    float: left;
                    width: 100%;
                    margin-top: 20px;
                    .brief-list {
                        margin: 0;
                        padding: 0 10px 0 15px;
                        height: 23px;
                        overflow: hidden;
                        background-color: #ffffff;
                        white-space: nowrap;
                        line-height: 23px;
                        color: #054767;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
    .tool {
        height: 95px;
        text-align: center;
        color: #ffffff;
        background-color: #F5F5F5;
        span {
            background-color: #ef6c02;
            font-size: 14px;
            height: 35px;
            margin: 25px auto;
            padding: 0 5px;
            line-height: 35px;
            display: inline-block;
            border-radius: 4px;
            cursor: pointer;
            width: 130px;
            &.into {
                background-color: #0d5399;
            }
        }
    }
}
</style>
<script>
import mixin from '../../utils/mixin'
import {
  UPDATE_COLLE_XTZTC,
  CANCEL_COLLE_XTZTC,
  APPLY_XTZTC
  // ,
  // GET_IN_SYS_SECRET
} from '../../store/types'
import bus from '../../utils/bus'
import {
  mapState
} from 'vuex'
import regulation from '../../assets/regulation.gif'
import { DOWNLOAD_FILE_PATH } from '../../config'
export default {
  mixins: [mixin],
  computed: {
    ...mapState(['xtztc', 'dict', 'colleXtztc', 'applyXtztc'])
  },
  data: function() {
    return {
      regulation: regulation
    }
  },
  props: ['info'],
  methods: {
    collect(item) {
      this.dispatch(UPDATE_COLLE_XTZTC, {
        sysid: item.id
      }).then(d => {
        this.$message('收藏成功!')
        bus.$emit('cancelNav')
        this.info.isColle = this.info.id;
      })
    },
    unCollect(item) {
      this.$confirm('确定要取消收藏?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(CANCEL_COLLE_XTZTC, {
          sysid: item.id
        }).then(d => {
          this.$message('取消成功!')
          bus.$emit('cancelNav')
          this.info.isColle = null;
        })
      })
    },
    apply(item) {
      if (item.isApply !== '' && item.isApply) {
        this.$alert('该项已提交申请,请勿重复提交', '提示', {
          confirmButtonText: '确认',
          type: 'warning'
        })
      } else {
        this.dispatch(APPLY_XTZTC, {
          sysid: item.id
        }).then(d => {
          this.$alert('申请成功', '温馨提示');
        })
      }
    },
    into(item) {
      window.open(item.link + '?token=' + this.userData.UserToken);
      // if (item.isDLogin === '1') { // 判断是否单点登录
      //   this.dispatch(GET_IN_SYS_SECRET, {
      //     sysid: item.id
      //   }).then(r => {
      //     window.open(item.link + '?ticket=' + this.colleXtztc.getInSysSecret.ticket)
      //   })
      // } else {
      //   window.open(item.link)
      // }
    }
  },
  watch: {
    'info' (val) {
      if (val) {
        this.info.webLogo = val.webLogo ? DOWNLOAD_FILE_PATH + val.webLogo + '&w=91&h=125' : regulation
      }
    }
  },
  created() {}
}
</script>
