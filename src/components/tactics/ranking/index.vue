<!-- 排行榜 -->
<template>
<div>
  <el-row :gutter="12" class="rank-list-wrap">
    <el-col class="rank-list" :span="8" v-for="cat in list" :key="cat.id">
      <div class="rank-list__title">
        {{cat.name}}
        <span class="rank-list__title__en">{{cat.enName}}</span>
        <i :class="cat.icon"></i>
        <div class="rank-list__title__bg"></div>
      </div>
      <el-row class="rank-list__item" v-for="item in cat.children" :key="item.id">
        <el-col :span="4">
          <div class="rank-list__item__rank">
            <img v-if="item.ranking===1" src="../../../assets/g.png" />
            <img v-if="item.ranking===2" src="../../../assets/g2.png" />
            <img v-if="item.ranking===3" src="../../../assets/g3.png" />
            <div class="default" v-if="item.ranking>3">
              <i class="iconfont icon-jiangpai"></i> <span>{{item.ranking}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <!-- @click="jumpTo('/tactics/apply',true)" -->
          <div class="rank-list__item__title cursor--pointer">
            {{item.title}}
          </div>
          <div class="rank-list__item__desc">
            {{item.desc}}
          </div>
        </el-col>
        <el-col :span="4">
          <div class="rank-list__item__count">
            {{item.count}}次
          </div>
          <div class="rank-list__item__author">
            {{item.author}}
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
.rank-list-wrap {
    padding: 10px 18px;
}
.rank-list {
    margin-bottom: 12px;
    &__title {
        background: #fff;
        font-size: 18px;
        color: #46bdfd;
        height: 65px;
        line-height: 65px;
        padding: 0 18px;
        border-bottom: 3px solid #46bdfd;
        overflow: hidden;
        position: relative;
        &__en {
            font-size: 14px;
            margin-left: 15px;
            display: inline-block;
        }
        &__bg {
            $size: 350px;
            width: $size;
            height: $size;
            border-radius: 100%;
            overflow: hidden;
            position: absolute;
            bottom: -100%;
            right: -($size/2);
            z-index: 1;
            &:after,
            &:before {
                content: '';
                display: block;
                border-radius: 100%;
                position: absolute;
                left: 50%;
                bottom: 0;
            }
            &:before {
                width: $size/1.2;
                height: $size/1.2;
                transform: translateX(-45%);
                z-index: 1;
            }
            &:after {
                width: $size/1.5;
                height: $size/1.5;
                transform: translateX(-40%);
                z-index: 2;
            }
        }
        .iconfont {
            color: #fff;
            font-size: 30px;
            position: absolute;
            top: 50%;
            right: 25px;
            transform: translateY(-50%);
            z-index: 2;
        }

    }
    &__item {
        background: #fff;
        padding: 18px 0;
        &:nth-child(odd) {
            background: #f5fbfe;
        }
        &__rank {
            text-align: center;
            height: 100%;
            position: relative;
            .default {
                color: #bfbfbf;
                .iconfont {
                    font-size: 45px;
                }
                span {
                    color: #fff;
                    position: absolute;
                    top: 18px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 2;
                }
                &:before {
                    content: '';
                    background: #bfbfbf;
                    width: 20px;
                    height: 20px;
                    border-radius: 100%;
                    display: block;
                    position: absolute;
                    top: 19px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
        &__title {
            color: #000;
            margin-bottom: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
        }
        &__desc {
            color: #999999;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
        }
        &__count {
            color: #ff6600;
            text-align: center;
        }
        &__author {
            color: #999999;
            font-size: 12px;
            text-align: center;
        }
    }
    &:nth-child(1) {
        .rank-list__title {
            &__bg {
                background: #fae6e1;
                &:before {
                    background: #fad4cb;
                }
                &:after {
                    background: #fac4b7;
                }
            }
        }
    }
    &:nth-child(2) {
        .rank-list__title {
            &__bg {
                background: #f0e6f5;
                &:before {
                    background: #e7d4f1;
                }
                &:after {
                    background: #dfc4ed;
                }
            }
        }
    }
    &:nth-child(3) {
        .rank-list__title {
            &__bg {
                background: #e1e6f5;
                &:before {
                    background: #cbd4f1;
                }
                &:after {
                    background: #b7c4ed;
                }
            }
        }
    }
    &:nth-child(4) {
        .rank-list__title {
            &__bg {
                background: #e8f4fa;
                &:before {
                    background: #d8effa;
                }
                &:after {
                    background: #caebfa;
                }
            }
        }
    }
    &:nth-child(5) {
        .rank-list__title {
            &__bg {
                background: #e1f0e6;
                &:before {
                    background: #cbe7d4;
                }
                &:after {
                    background: #b7dfc4;
                }
            }
        }
    }
    &:nth-child(6) {
        .rank-list__title {
            &__bg {
                background: #ebf0f0;
                &:before {
                    background: #dee7e7;
                }
                &:after {
                    background: #d2dfdf;
                }
            }
        }
    }
    &:nth-child(7) {
        .rank-list__title {
            &__bg {
                background: #fae6e1;
                &:before {
                    background: #fad4cb;
                }
                &:after {
                    background: #fac4b7;
                }
            }
        }
    }
    &:nth-child(8) {
        .rank-list__title {
            &__bg {
                background: #ebf0f0;
                &:before {
                    background: #dee7e7;
                }
                &:after {
                    background: #d2dfdf;
                }
            }
        }
    }
}
</style>

<script>
import mixin from '../../../utils/mixin'
import { FETCH_POLICE_RANKING } from '../../../store/types'
import { mapState } from 'vuex'

export default {
  mixins: [mixin],
  components: {},

  data() {
    return {
      list: [{
        id: 1,
        name: '出入境',
        enName: 'Hot',
        icon: 'iconfont icon-jiangbei1',
        children: []
      }, {
        id: 2,
        name: '刑侦',
        enName: 'MsOriginating',
        icon: 'iconfont icon-order-phone',
        children: []
      }, {
        id: 3,
        name: '经侦',
        enName: 'Bill',
        icon: 'iconfont icon-zhangdan',
        children: []
      }, {
        id: 4,
        name: '技侦',
        enName: 'Trajectory',
        icon: 'iconfont icon-guiji_xiao',
        children: []
      }, {
        id: 5,
        name: '治安',
        enName: 'Case',
        icon: 'iconfont icon-dangan1',
        children: []
      }, {
        id: 6,
        name: '法制',
        enName: 'Relation',
        icon: 'iconfont icon-guanxi',
        children: []
      }, {
        id: 7,
        name: '情报',
        enName: 'Relation',
        icon: 'iconfont icon-guiji_xiao',
        children: []
      }, {
        id: 8,
        name: '网安',
        enName: 'Relation',
        icon: 'iconfont icon-guanxi',
        children: []
      }]
    }
  },
  computed: {
    ...mapState(['survey'])
  },
  watch: {},
  methods: {
    loadData() {
      this.dispatch(FETCH_POLICE_RANKING, {}).then(() => {
        console.log(this.survey.policeRanking['出入境']);
        this.list[0].children = this.survey.policeRanking['出入境'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[1].children = this.survey.policeRanking['刑侦'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[2].children = this.survey.policeRanking['经侦'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[3].children = this.survey.policeRanking['技侦'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[4].children = this.survey.policeRanking['治安'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[5].children = this.survey.policeRanking['法制'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[6].children = this.survey.policeRanking['情报'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
        this.list[7].children = this.survey.policeRanking['网安'].map((d, i) => {
          return {
            id: d.ZFID,
            ranking: parseInt(i + 1),
            title: d.ZFMC,
            desc: '',
            count: d.SCCS,
            author: ''
          }
        });
      })
    }
  },
  created() {

  },
  mounted() {
    this.loadData()
    this.list.forEach((d, i) => {
      for (let i = 1; i <= 5; i++) {
        d.children.push({
          id: i,
          ranking: i,
          title: '异常行为战法',
          desc: '湖南省怀化市公安局情报中心',
          count: parseInt(4852 / i),
          author: '张三'
        })
      }
    })
  }
}
</script>
