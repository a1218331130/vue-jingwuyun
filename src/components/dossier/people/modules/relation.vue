<template>
  <div>
    <cardHeader title="关系分析"></cardHeader>
    <relation></relation>
  </div>
</template>
<style></style>
<script>
  import mixin from '../../../../utils/mixin'
  import cardHeader from './card-header.vue'
  import relation from '../../../analysis/relation'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      relation
    },
    data() {}
  }

</script>
