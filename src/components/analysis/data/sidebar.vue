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
  import bus from '../../../utils/bus'

  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        current: 0,
        list: [{
          label: '交叉比对',
          id: 2,
          comm: 'across',
          icon: 'iconfont icon-jinxingzhong',
          desc: '交叉比对'
        }, {
          label: '排除比对',
          id: 3,
          icon: 'iconfont icon-rili1',
          comm: 'exclude',
          desc: '排除比对'
        }, {
          label: '表单比对',
          id: 4,
          icon: 'iconfont icon-ripple',
          comm: 'form',
          desc: '表单比对'
        }, {
          label: '我的数据列表',
          id: 9,
          icon: 'iconfont icon-guanlian1',
          comm: 'datalist',
          desc: '我的数据列表'
        }]
      }
    },
    computed: {},
    props: ['miniModel'],
    watch: {},
    methods: {
      itemOnClickEvent(item, i) {
        this.current = i
        this.$emit('call:comm', item)
      }
    },
    created() {
      bus.$on('current', d => {
        this.current = d;
      })
      bus.$on('SourceType', d => {
        switch (Number(d)) {
          case 2:
            this.current = 0
            break
          case 3:
            this.current = 1
            break
          case 4:
            this.current = 2
            break
        }
      })
    },
    mounted() {}
  }

</script>
