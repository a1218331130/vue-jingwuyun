<!-- 人员档案 -->
<template>
  <div class="bmhx bh_add ">
    <!--左侧基本信息-->
    <left-info v-if="talentPool.Model" :value="talentPool.Model" ></left-info>

    <div class=" main-right sidebar-mar fadein-right " id="ifra" style="padding-top: 1px;">
      <!--基本情况-->
      <basic v-if="talentPool.Model" :value="talentPool.Model" ></basic>
      <!--工作简历-->
      <work-resume v-if="talentPool.Model"></work-resume>
      <!--学历情况-->
      <education v-if="talentPool.Model"></education>
      <!--技能雷达图-->
      <skill v-if="talentPool.Model"></skill>
      <!--技能榜-->
      <skills-list v-if="talentPool.Model"></skills-list>
      <!--主要业绩-->
      <achievement v-if="talentPool.Model"></achievement>
      <!--具体案件-->
      <case-list v-if="talentPool.Model"></case-list>
      <!--奖罚情况-->
      <sanction v-if="talentPool.Model"></sanction>
      <!--信息调研-->
      <survey v-if="talentPool.Model"></survey>

    </div>


  </div>
</template>

<style scoped>

</style>

<script>
  import mixin from '../../../utils/mixin'
  import leftInfo from './modules/left-info.vue'
  import basic from './modules/basic.vue'
  import workResume from './modules/work-resume.vue'
  import education from './modules/education.vue'
  import skill from './modules/skill.vue'
  import skillsList from './modules/skills-list.vue'
  import achievement from './modules/achievement.vue'
  import caseList from './modules/case.vue'
  import sanction from './modules/sanction.vue'
  import survey from './modules/survey.vue'
  import {GET_TALENT_DETAIL} from '../../../store/types'
  import {mapState} from 'vuex'
  export default {
    mixins: [mixin],
    components: {
      leftInfo,
      basic,
      workResume,
      education,
      skill,
      skillsList,
      achievement,
      caseList,
      sanction,
      survey
    },
    data() {
      return {}
    },
    computed: {
      ...mapState(['talentPool'])
    },
    watch: {
      type() {
      }
    },
    methods: {
      getdetail() {
        this.dispatch(GET_TALENT_DETAIL, {
          KeyId: this.$route.query.id
        });
      }
    },
    created() {
      this.getdetail()
    },
    mounted() {
      console.log(this.$route.query)
      console.log(this.talentPool)
    }
  }
</script>
