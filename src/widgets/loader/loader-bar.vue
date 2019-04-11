<template>
<div :class="{'loader--bar':true,'loader--bar--action':action===true}">
  <div class="loader--bar__item-box">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
</template>

<script>
export default {
  props: ['action']
}
</script>
