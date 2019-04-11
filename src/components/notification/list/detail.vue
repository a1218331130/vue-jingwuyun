<template>
<!-- 内容 -->
<div class="app-content">
  <div v-if="isShow===true">
    <!-- 列表 -->
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" :show-header="listType===2" v-loading.body="loading" :data="list" :border="true" :height="tableHeight">
      <el-table-column v-if="listType===2" prop="id" label="序号" width="70"></el-table-column>
      <el-table-column v-if="listType===2" prop="title" label="标题"></el-table-column>
      <el-table-column v-if="listType===2" prop="type" label="分类"></el-table-column>
      <el-table-column v-if="listType===2" prop="unit" label="分发单位"></el-table-column>
      <el-table-column v-if="listType===2" prop="date" label="日期"></el-table-column>
      <el-table-column v-if="listType===2" prop="Emergency" label="状态">
        <template scope="scope">
          <span v-if="scope.row.Emergency==0">未读</span>
          <span v-if="scope.row.Emergency==1">已读</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===2" prop="isSign" label="签收">
        <template scope="scope">
          <span v-if="scope.row.isSign==0">已签收</span>
          <span v-if="scope.row.isSign==1">未签收</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===2" prop="enclosure" label="附件"></el-table-column>
      <el-table-column v-if="listType===2" prop="grade" label="等级"></el-table-column>
      <el-table-column v-if="listType===2" label="操作">
        <template scope="scope">
          <el-button type="text" size="small" @click="addTemp($event,scope.row)">
            <i class="iconfont icon-save"></i>
            <span style="color:#555" @click="showDetail()">查看</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===1" class-name="compact" label="内容集">
        <template scope="scope">
          <div class="compact__wrap">
            <div class="compact__serial">
              <el-tag type="primary">{{scope.row.id}}</el-tag>
            </div>
            <div class="compact__box">
              <div class="compact__title">
                日期: {{scope.row.date}}
                <el-button type="text" icon="icon-search">查看详情</el-button>
                <!-- <div class="compact__item--point" @click="openDetailInfo(2,scope.row)">
                          <span @click="showDetail()">查看</span>
                  </div> -->
              </div>
              <div class="compact__item">
                <label>标题</label> {{scope.row.title}}
              </div>

              <div class="compact__item">
                <label>分类</label> {{scope.row.type}}
              </div>

              <div class="compact__item">
                <label>分发单位</label> {{scope.row.unit}}
              </div>
              <div class="compact__item">
                <label>状态</label>
                <span v-if="scope.row.Emergency==0">未读</span>
                <span v-if="scope.row.Emergency==1">已读</span>
              </div>
              <div class="compact__item">
                <label>签收</label>
                <span v-if="scope.row.isSign==0">已签收</span>
                <span v-if="scope.row.isSign==1">未签收</span>
              </div>

              <div class="compact__item">
                <label>附件</label> {{scope.row.enclosure}}
              </div>

              <div class="compact__item">
                <label>等级</label> {{scope.row.grade}}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" style="text-align:center;">
        <el-pagination :total="50" @current-page="1" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-col>
    </el-row>
  </div>
  <div class="detail-box" v-if="isShow===false" :height="tableHeight">
    <el-row :gutter="0">
      <el-col class="text-center detail-box__title">公安部督察组来湘开展党的十九大安保维稳工作专项督察</el-col>
      <el-col class="text-center detail-box__time">发布时间: 2017-08-08 查阅: 230</el-col>
      <el-col class="detail-box-content">
        8月31日，公安部督察专员李国和率领督察组一行三人来湘开展党的十九大安保工作专项督察。此次督察内容包括学习贯彻习近平总书记"5.19"重要讲话、开展"三个不发生"省区市创建、重大活动安保以及重大专项整治行动等4个方面的工作情况。8月31日下午，省厅召开全省公安机关党的十九大安保维稳工作汇报会，会议由驻厅纪检组组长、厅党委委员段国华主持，厅党委副书记、副厅长周赛保出席并作全面汇报，警令部、政治部、驻厅纪检组、国保总队、治安总队、禁毒总队、刑侦总队、警务督察总队、法制总队、维稳一处、维稳二处、反恐总队、交警总队、消防总队等部门就有关工作进行补充发言。会后，省政府党组成员、公安厅长许显辉会见了部督察组一行，交流工作意见。部督察组随后还将赴基层单位进行实地督导。
        周赛保同志指出，为党的十九大胜利召开创造安全稳定的社会环境，是公安机关光荣神圣的政治使命，也是当前压倒一切的政治任务。全省公安机关按照中央、公安部、省委省政府的决策部署，紧紧围绕十九大安保维稳的主线，统筹推进各项公安工作。特别是7月底以来，显辉厅长先后6次组织召开厅党委会议、厅长办公会，专题研究十九大安保维稳工作，制定"1+7"方案办法，提出"三个四"的工作部署，即"四个不发生"、"四大保卫战"和"四大举措"；强化政治责任，深入学习"5.19"重要讲话精神；强化系统思维，全面开展"三个不发生"创建；强化风险防控，扎实推进重大活动安保；强化效能导向，强力推进重大专项整治；着力开发"全省公安机关风险隐患管控系统"，对风险隐患实行数据化管理、动态化管控。通过抓组织部署、抓督导推进、抓考核奖惩，推动安保维稳与深化改革相互促进、与专项整治综合显效、与队伍建设同频共振，努力为党的十九大胜利召开创造安全稳定的社会环境。
        李国和同志对我省党的十九大安保维稳工作予以充分肯定。他指出，省厅的工作汇报及台账资料数据详实、内容丰富，体现了良好的精神面貌。一方面，落实公安部的部署行动快、结合快。省厅提前开展"5.19"重要讲话学习贯彻活动，并迅速结合到十九大安保工作上来，在"三个不发生"的基础上创新提出"四个不发生"，制定"1+7"方案办法，建立"日通报、周讲评、半月调度"的指挥运行机制，每天有工作动态，效果非常好。另一方面，推进安保维稳措施细、工作实。坚持向改革要警力、要效能，与十九大安保紧密结合，推行大排查、大研判、大管控、大演练，任务具体、操作性强，在打击整治和消防演练等方面取得实实在在的效果，特别是有效开展"善心汇"事件维稳处置，为社会治安平稳作出了重要贡献。他强调，当前是十九大安保的重要时期，各项工作必须做到细之再细、实之更实、严之又严，要加强督导检查，特别是强化警种部门条线督导，确保决策部署的最后一公里落实到位；同时，要带着感情去督导，注重维护民警执法权益，强化战时奖励表彰，激励民警创先争优。
        段国华同志指出，李国和专员的讲话既是鼓励，又是鞭策，为我们下步工作提出了建设性的指导意见，各单位要从严从实从细抓好落实。一要提升政治站位，抓思想认识到位。充分认识十九大安保工作的重要性、紧迫性，以及当前维稳形势的严峻性、复杂性，切实将思想认识统一到公安部和厅党委的部署上来，按照部督察组的意见和要求，扎实开展各项工作，确保万无一失。二要强化系统思维，抓工作合力到位。牢固树立"一盘棋"思想，以十九大安保维稳为主线，以省厅"1+7"方案为统领，分工负责、紧密配合，形成工作合力，确保工作落实。三要加强督导检查，抓责任落实到位。对照公安部和厅党委各项工作部署，组织开展严密督导，查找漏洞隐患、补齐工作短板；同时，要讲究方式方法，关心关爱民警、帮助解决问题、维护民警权益，更好地服务安保维稳大局，以优异成绩向党的十九大献礼。
      </el-col>
    </el-row>
    <el-button type="primary" class="detail-box-content__return" @click="hideDetail()">返回</el-button>
  </div>
</div>
</template>

<style lang="scss" scoped>
.app-west {
    background: #fff;
    width: 220px;
    border-right: 1px solid #d7d7d7;
}

.tabs {
    margin-top: 6px;
    margin-left: 15px;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;
    bottom: -1px;
    &__item {
        background: #e4e4e4;
        max-width: 120px;
        height: 28px;
        line-height: 28px;
        padding: 0 5px 0 9px;
        border: 1px solid #d7d7d7;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        position: relative;
        display: inline-block;
        cursor: pointer;
        .iconfont {
            opacity: 0;
            transition: 0.25s;
        }
        & + & {
            border-left: 0;
        }
        &:hover {
            .iconfont {
                opacity: 1;
            }
        }
        &.current {
            background: #fff;
            border-bottom-color: #fff;
            /*&:after {
      content: '';
      background: #fff;
      width: 100%;
      height: 10px;
      display: block;
      position: absolute;
      bottom: -5px;
      left: 0;
    }*/
        }
    }
}

.query-box {
    &__item {
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        color: #fd6533;
        display: inline-block;
        &__name {
            color: #666;
        }
    }
}

.compact {
    position: fixed;
    &__wrap {
        white-space: normal;
        padding: 15px 0;
        display: flex;
    }
    &__serial {
        line-height: 40px;
        width: 70px;
    }
    &__box {
        text-align: left;
        line-height: 16px;
    }
    &__title {
        color: #fd6533;
        display: block;
    }
    &__item {
        color: #333;
        margin-right: 15px;
        display: inline;
        label {
            color: #656565;
            &:after {
                content: ':';
            }
        }
        &--point {
            @extend .compact__item;
            color: #1e8ffd;
            cursor: pointer;
            &:hover {
                opacity: 0.9;
            }
        }
    }
}

.app-toolbar {
    border-bottom: 1px solid #d7d7d7;
    .ctrl-box {
        text-align: right;
        .el-button {
            color: #666;
            padding: 0 12px;
            border-radius: 2px;
            border-color: #e4e4e4;
            .iconfont {
                color: #53a9ff;
                margin-right: 8px;
            }
            &.action,
            &:hover {
                background: #73b8fd;
                color: #fff;
                .iconfont {
                    color: #fff;
                }
            }
            & + & {
                margin-left: 10px;
            }
        }
        .el-button-group {
            margin-left: 10px;
            .el-button {
                text-align: center;
                width: 36px;
                padding: 0;
                .iconfont {
                    margin: 0;
                }
            }
        }
        &--mini {
            .el-button {
                .iconfont {
                    margin: 0;
                }
            }
        }
    }
}

.cell {
    .el-button {
        text-align: center;
        & + & {
            margin-left: 0;
        }
        .iconfont {
            margin: 0;
        }
    }
}

.app-content {
    /*margin-top: 12px;*/
}

.cus-save-icon {
    color: #1e8ffd;
    display: none;
    position: fixed;
    transition: 0.3s;
}
.detail-box {
    height: 100%;
    background-color: #ffffff;
    .detail-box__title {
        font-size: 20px;
        margin-top: 10px;
        color: #333333;
        height: 50px;
        line-height: 50px;
    }
    .detail-box__time {
        height: 30px;
        line-height: 30px;
    }
    .detail-box-content {
        height: 100%;
        text-indent: 2rem;
        padding: 20px;
        line-height: 25px;
        .detail-box-content__return {
            position: absolute;
            bottom: 10px;
        }
    }
}
</style>

<script>
import {
  setStyle
} from '../../../node_modules/element-ui/src/utils/dom'
import mixin from '../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  props: ['listType'],
  data() {
    return {
      isShow: true,
      tableHeight: 0,
      listType: 1
    }
  },
  computed: {
    list() {
      return this.cList(10)
    }
  },
  watch: {},
  methods: {
    showDetail() {
      this.isShow = false;
    },
    hideDetail() {
      this.isShow = true;
    },
    addTemp(e, item) {
      // let cusIcon, cusBox
      if(this.temp.find(d => d.id === item.id)) {
        this.$alert('该条数据已存在临时储存, 无需重复添加.', '温馨提示');
      } else {
        // cusIcon = this.$refs.cusIcon
        // cusBox = this.$refs.cusBox
        console.log(setStyle);
        // setStyle(cusIcon, 'display', 'none')
        // setStyle(cusIcon, 'left', e.clientX + 'px')
        // setStyle(cusIcon, 'top', e.clientY + 'px')
        // setStyle(cusIcon, 'display', 'block')
        //
        // setStyle(cusIcon, 'left', cusBox.$el.offsetLeft + 'px')
        // setStyle(cusIcon, 'top', cusBox.$el.offsetTop + 90 + 'px')
        this.temp.push(item)
      }
    },
    cList(count) {
      let arr = []
      for(let i = 0; i <= count - 1; i++) {
        arr.push({
          id: (i + 1),
          title: '某案件通报',
          type: '通告',
          unit: '长沙警察局',
          date: '2017-08-08',
          Emergency: 1,
          isSign: 1,
          enclosure: 3,
          grade: '紧急'
        })
      }
      return arr
    }
  },
  created() {
    let self = this
    sizeFixed()
    window.addEventListener('resize', (e) => {
      sizeFixed()
    })

    function sizeFixed() {
      let bodyWidth = document.body.offsetWidth,
        bodyHeight = document.body.offsetHeight
      if(bodyWidth < 1495) {
        self.miniModel = true;
      } else {
        self.miniModel = false;
      }
      if(bodyHeight <= 720 && bodyHeight > 620) {
        self.tableHeight = 480;
      } else if(bodyHeight <= 620) {
        self.tableHeight = 480;
      } else {
        self.tableHeight = 830;
      }
    }
  },
  mounted() {}
}
</script>
