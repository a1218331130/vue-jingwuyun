<template>
<div class="sidebar">
  <div :class="{'sidebar__item':true,'cursor--pointer':true,'sidebar__item--current':i===current}" v-for="(item,i) in list" @click="itemOnClickEvent(item,i)">
    <i :class="item.icon"> </i>
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
      /*.text{*/
      /*overflow: hidden;*/
      /*white-space: nowrap;*/
      /*text-overflow: ellipsis;*/
      /*}*/
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
          label: '基本账户分析',
          id: 1,
          comm: 'basic',
          icon: 'iconfont icon-jinxingzhong',
          desc: '分析账户在特定时间段内的支出总额，支出总次数，收入总额，收入次数等基本信息。'
        }, {
          label: '交易频率分析',
          id: 2,
          icon: 'iconfont icon-hudong',
          comm: 'frequency',
          desc: '分析主账号与各个账号的交易次数和交易金额，可以快速找到与主账号交易最频繁的账号及交易金额最高的账号。'
        }, {
          label: '交易日期规律',
          id: 3,
          icon: 'iconfont icon-rili1',
          comm: 'datePattern',
          desc: '按不同的周期（月、日、年、星期）分析主账号的交易次数和交易金额，便于掌握目标对象的交易周期规律且可以快速找到主账号交易最频繁及交易金额最高的日期。'
        }, {
          label: '交易网点分析',
          id: 4,
          icon: 'iconfont icon-ripple',
          comm: 'netDot',
          desc: '分析主账号在各个网点的交易次数和交易金额，便于掌握目标对象的经常交易及异常交易网点且可以快速找到主账号交易最频繁的网点及交易金额最高的网点。'
        }, {
          label: '交叉频率分析',
          id: 6,
          icon: 'iconfont icon-close',
          comm: 'overlapping',
          desc: '分析多个目标账号的相互交易情况，便于侦查人员掌握目标账号相互间的资金交易情况且可以快速找到交易最频繁的两个账号及交易金额最高两个账号。此处可以选择不同案件的账号，进行跨案件分析。'
        }, {
          label: '共同账户分析',
          id: 7,
          icon: 'iconfont icon-copy',
          comm: 'common',
          desc: '分析多个账号之间的共同交易账号，得出他们在某个时间段内的交易次数、交易金额等各种交易情况。此处可选择不同案件的账单，进行跨案件分析。'
        }, {
          label: '关联分析',
          id: 9,
          icon: 'iconfont icon-guanlian1',
          comm: 'relation',
          desc: '结合账单、话单记录，分析目标账户每次交易前后的通话情况，找出可疑交易对应的可疑通话情况。'
        }, {
          label: '对比分析',
          id: 10,
          icon: 'iconfont icon-merge',
          comm: 'contrast',
          desc: '分析目标账号交易前后对应的其他账号的可疑交易情况，便于找出目标账号本次交易的资金来源（或去向）关联的可疑账号信息。'
        }, {
          label: '可疑点分析',
          id: 11,
          icon: 'iconfont icon-guiji',
          comm: 'doubtful',
          desc: '分析目标账号交易前后对应的其他账号的资金来源（或去向），便于找出目标账号本次交易的资金来源（或去向）关联的可疑账号信息。'
        }]
      }
    },
    computed: {},
    props: ['miniModel', 'isFocus'],
    watch: {
      isFocus(v) {
        if (!v) {
          this.current = -1;
        }
      }
    },
    methods: {
      itemOnClickEvent(item, i) {
        this.current = i;
        this.$emit('returnFocus')
        this.$emit('call:comm', item)
      }
    },
    created() {

    },
    mounted() {}
  }

</script>
