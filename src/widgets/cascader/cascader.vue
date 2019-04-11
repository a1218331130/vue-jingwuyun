<template>
  <el-cascader
    class="cascader-input"
    :options="options"
    :props="cascaderProps"
    filterable
    :change-on-select="true"
    @change="handleChange"
    v-model="modelC"
    :disabled="disabled"
  >
  </el-cascader>
</template>
<style scoped>
  .cascader-input {
    width: 100%;
  }
</style>
<script>
  export default {
    data() {
      return {
        modelC: null// ['915602E6FF334272A38F29AB979D6C9C']
      }
    },
    props: {
      options: Array,
      value: Array,
      disabled: {
        type: Boolean,
        default: false
      },
      cascaderProps: {
        value: 'menuId',
        label: 'name',
        children: 'children'
      }
    },
    methods: {
      handleChange(value) {
        // todo:选择回调返回已选数据
        this.$emit('change', value);
      }
    },
    watch: {
      value(val) {
        this.modelC = val
      }
    },
    mounted() {
      this.modelC = this.value;
    }
  }
</script>
