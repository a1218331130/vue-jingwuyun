<template>
  <div style="padding: 30px;">
    <tree-dialog :data="treeData" :value="checked" @check-change="handleChange" :defaultProps="defaultProps"></tree-dialog>
  </div>
</template>
<style scoped>
</style>
<script>
  import TreeDialog from '../../widgets/tree-dialog/tree-dialog.vue'
  export default {
    components: {TreeDialog},
    data() {
      return {
        checked: [{
          id: 3,
          label: '二级1-2'
        }],
        treeData: [{
          id: 1,
          label: '一级1',
          children: [{
            id: 2,
            label: '二级1-1'
          }, {
            id: 3,
            label: '二级1-2'
          }]
        }, {
          id: 21,
          label: '二级2'
        }],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'id'
        }
      }
    },
    methods: {
      handleChange(val) {
        this.checked = val;
      }
    }
  }
</script>
