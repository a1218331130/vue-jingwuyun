<template>
  <div class="bmhx_box_header">
    <span class="fa " :class="{icon}"></span>{{title}}
  </div>
</template>

<style lang="scss" scoped>

</style>


<script>
  export default {
    props: {
      title: {
        type: String,
        default: '标题'
      },
      icon: {
        type: String,
        default: 'fa-vcard-o'
      }

    }
  }
</script>
