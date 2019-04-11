<template>
  <pgis :zoom="18"
        :show-control="false"
        :case-info="caseInfo"
        :center="[109.9787449836731, 27.555813789367676]"
        @on-poi-click="handlePoiClick"
        @on-case-click="handleCaseClick"></pgis>
</template>
<script>
  import pgis from './pgis.vue'
  export default {
    components: {
      pgis
    },
    data() {
      return {
        caseInfo: {
          x: 109.9787449836731,
          y: 27.555813789367676
        }
      }
    },
    methods: {
      handlePoiClick(poi) {
        console.log(poi)
      },
      handleCaseClick(caseInfo) {
        console.log('case click', caseInfo)
      }
    }
  }
</script>
