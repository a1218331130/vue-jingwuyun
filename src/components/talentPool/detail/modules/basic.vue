<template>
  <div class="bmhx_box" style="margin-top: 0px;">
    <!--大模块头部-->
    <card-header title="基本情况"></card-header>
    <!--大模块内容-->
    <div class="bmhx_box_body">
      <!--小模块内容-->
      <div class="bmhx_content" id="2_1F_1">

        <div class="bmhx_box_content">
          <p>
            <span class="fontsize18 t_blue">{{value.Name || ""}}</span>
            负责对侦查机关移送审查起诉的案件及上级院交办的刑事案件进行审查，决定是否提起公诉；办理不起诉复议案件；出庭支持公诉；对一审刑事判决、裁定进行审查，提出是否提请抗诉的意见；依法适时介入，引导侦查机关调查取证等工作。
          </p>
        </div>
      </div>
      <!-- 小模块内容-->
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>


<script>
  import cardHeader from './card-header.vue'
  import {mapState} from 'vuex'
  export default {
    props: ['message', 'value'],
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['talentPool']),
      themodel() {
        return this.talentPool.Model || {}
      }
    },
    medthods: {},
    created() {
    },
    mounted() {
    }
  }
</script>
