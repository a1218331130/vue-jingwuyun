<template>
<div class="sidebar">
  <div :class="{'sidebar__item':true,'cursor--pointer':true,'sidebar__item--current':i===current}" v-for="(item,i) in list" :key="i" @click="itemOnClickEvent(item,i)">
    <i :class="item.icon"></i>
    <span v-if="miniModel===true" class="text">{{item.label}}</span>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .iconfont {
    margin: 2px 10px 0 8px;
  }

  .sidebar {
    line-height: 38px;
    &__item {
      height: 38px;
      padding: 0 10px;
      color: #ffffff;
      font-size: 14px;
      border-bottom: 1px solid #2288d4;
      &:hover {
        background-color: #ff924a;
      }
      &--current {
        background-color: #ff924a;
        font-weight: bold;
      }
    }
  }

</style>

<script>
  import mixin from '../../../utils/mixin'

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        current: 0,
        list: [{
          label: '通话详情分析',
          id: 1,
          icon: 'iconfont icon-tonghua',
          comm: 'detail',
          desc: '分析目标人员的详细通话情况并可通过地图定位的方式展示具体位置，便于侦查人员掌握目标人员的基本通话情况。'
        }, {
          label: '通话规律分析',
          id: 2,
          icon: 'iconfont icon-rili1',
          comm: 'law',
          desc: '按小时天、小时、天、星期、月、年分别统计目标人员通话次数情况，便于侦查人员掌握其通话时间规律。'
        }, {
          label: '通话频率分析',
          id: 3,
          icon: 'iconfont icon-tonghuajilu',
          comm: 'frequency',
          desc: '分析目标人员与联系人的通话次数和通话时长，找到与目标人员关系密切的联系人。分析结果会在“通话频率统计”表格中显示，选定一行后下侧会以折线图展示目标人员与选定联系人的通话时间规律，点击折线图上的点时会在“通话明细”表格中筛选该时段内的通话详单。'
        }, {
          label: '居住地分析',
          id: 4,
          icon: 'iconfont icon-dingwei1',
          comm: 'residence',
          desc: '根据目标人员的通话情况，分别从非工作时间、隔天早晚、当天早晚三个角度分析目标人员的可能居住地。分析结果根据地址用列表形式显示并支持查看地图及明细。'
        }, {
          label: '异常号码分析',
          id: 5,
          icon: 'iconfont icon-dingwei2',
          comm: 'exception',
          desc: '分析目标人员联系人中的异常号码，通过分析某一时间段之后出现的号码或者消失的号码来找出该目标人的异常号码。分析结果用列表直观地显示，点击查看详情列时会弹出页面显示具体的通话详单。'
        }, {
          label: '通话归属地分析',
          id: 6,
          icon: 'iconfont icon-ipguishudi',
          comm: 'attribution',
          desc: '分析目标人员通话对象的归属地分布情况，便于侦查人员掌握目标人员的关系圈地理分布。分析结果用折线图直观地显示，点击折线图上的点时会在下方表格显示该归属地内的通话详单。'
        }, {
          label: '通话基站分析',
          bz: '暂无地图,本页不用做',
          id: 7,
          icon: 'iconfont icon-tower',
          comm: 'station',
          desc: '根据基站位置分析目标人员的通话情况，便于侦查人员掌握目标人员经常出现的地方式及偶尔出现的地方，结合地图能直观了解目标人员的活动轨迹，掌握目标人员的主要活动地点以及团伙聚散地点。分析结果以表格和地图的形式显示，点击“+”号展开目标人在该小区号内每天的通话情况，双击一行会显示当天通话详单，点击表格右键可以选择导出到Excel文件。'
        }, {
          label: '相互通话分析',
          id: 8,
          icon: 'iconfont icon-guanxi',
          comm: 'converse',
          desc: '对多个话单进行分析，得到目标人员之间的相互通话次数、通话总时长，用关系图的方式直观地显示他们之间的关系。此处可选择不同案件的话单，进行跨案件分析。分析结果会同时用表格和关系图的方式展示，联系人之间的蓝色数字表示通话次数，双击数字会显示通话详单。'
        }, {
          label: '共同联系人分析',
          id: 9,
          icon: 'iconfont icon-image',
          comm: 'contacts',
          desc: '分析多个话单寻找他们共同的联系人，挖掘目标人员的社会网络。此处可选择不同案件的话单，进行跨案件分析。分析结果会同时用表格和关系图的方式展示，联系人之间的蓝色数字表示通话次数，双击数字会显示通话详单。共同人数：分析指定人数具有相同的联系号码。'
        }, {
          label: '碰面分析',
          id: 10,
          icon: 'iconfont icon-chakan',
          comm: 'meeting',
          desc: '选择多个话单，分析目标人员在某个时间、地点的相互碰面情况。便于侦查人员掌握目标人员间的经常聚会地点及碰面情况。分析结果以列表形式展示，点击可查看地图及明细情况。'
        }, {
          label: '关联分析',
          id: 11,
          icon: 'iconfont icon-ditu',
          comm: 'relation',
          desc: '结合账单、话单记录，分析目标人员每次通话前后的银行转账情况。便于侦查人员找出可疑通话对应的可疑交易情况。'
        }]
      }
    },
    computed: {},
    watch: {
      isFocus(v) {
        if (!v) {
          this.current = -1;
        }
      }
    },
    props: ['miniModel', 'isFocus'],
    methods: {
      itemOnClickEvent(item, i) {
        this.current = i
        this.$emit('returnFocus')
        this.$emit('call:comm', item)
      }
    },
    created() {},
    mounted() {}
  }

</script>
