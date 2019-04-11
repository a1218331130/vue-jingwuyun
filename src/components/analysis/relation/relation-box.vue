<template>
<div class="relation-diagram">
  <div class="text-section">
  <span class="title">案件名称：</span>
<span>{{relationInfoData && relationInfoData.ajmc || '暂无信息'}}</span>

  </div>
<div class="text-section">

<span class="title">标题：</span>

<span>{{relationInfoData && relationInfoData.bt || '暂无信息'}}</span>

</div>
<div class="text-section">

<span class="title">创建时间：</span>

<span>{{relationInfoData && relationInfoData.cjsj || '暂无信息'}}</span>

</div>
<div class="text-section">

<span class="title">是否显示到报告：</span>

<span>{{relationInfoData && relationInfoData.sfxs | viewStatus}}</span>


</div>
<div class="text-section">

<span class="title">描述：</span>

<span>{{relationInfoData && relationInfoData.sm || '暂无信息'}}</span>

</div>

  <hr class="filter__line" />
    <div v-show="!relationInfoData" class="tips--fixed">
      暂无相关数据
    </div>
</div>
</template>
<style lang="scss" scoped>
  .tips {
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    &--fixed {
      @extend .tips;
      position: static;
      transform: none;
    }
  }

  .relation-box .relation-diagram {
    color: #fff;
    padding: 10px;
    .text-section {
      margin-bottom: 15px;
      line-height: 30px;
      .title {
        color: #FFEB3B;
      }
    }
  }

</style>
<script>
  /**
   * @module RelationFilter
   * @desc 关系分析-过滤组件
   */
  export default {
    filters: {
      viewStatus(val) {
        return { 0: '否', 1: '是' }[val] || '暂无信息'
      }
    },
    data: () => ({}),
    props: {
      relationInfoData: {
        type: Object,
        default: null
      }
    },
    watch: {},
    computed: {},
    methods: {}
  }

</script>
