<template>
<div class="sidebar">
  <div :class="{'sidebar__item':true,'cursor--pointer':true,'sidebar__item--current':i===current}" v-for="(item,i) in list" @click="itemOnClickEvent(item,i)">
    <i :class="item.icon"></i><span v-if="miniModel===true" class="text">{{item.label}}</span>
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
        .iconfont {
            font-size: 18px;
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
        label: '轨迹基本分析',
        id: 1,
        icon: 'iconfont icon-fenxi',
        comm: 'basic',
        desc: '分析目标人员的详细通话情况并可通过地图定位的方式展示具体位置，便于侦查人员掌握目标人员的基本通话情况。'
      }, {
        label: '轨迹规律分析',
        id: 2,
        icon: 'iconfont icon-guiji',
        comm: 'rule',
        desc: '按小时天、小时、天、星期、月、年分别统计目标人员通话次数情况，便于侦查人员掌握其通话时间规律。'
      }, {
        label: '特定轨迹分析',
        id: 3,
        icon: 'iconfont icon-fenxi2',
        comm: 'specific',
        desc: '按小时天、小时、天、星期、月、年分别统计目标人员通话次数情况，便于侦查人员掌握其通话时间规律。'
      }, {
        label: '轨迹对比分析',
        id: 4,
        icon: 'iconfont icon-fenleijishougongtongbu',
        comm: 'contrast',
        desc: ''
      }, {
        label: '同住详查',
        id: 6,
        icon: 'iconfont icon-city',
        comm: 'cohabit',
        desc: ''
      }, {
        label: '同行详查',
        id: 5,
        icon: 'iconfont icon-huoche',
        comm: 'together',
        desc: ''
      }, {
        label: '地图展示',
        id: 7,
        icon: 'iconfont icon-ditu',
        comm: 'mapShow',
        desc: ''
      }]
    }
  },
  computed: {},
  watch: {},
  props: ['miniModel'],
  methods: {
    itemOnClickEvent(item, i) {
      this.current = i
      this.$emit('call:comm', item)
    }
  },
  created() {

  },
  mounted() {}
}
</script>
