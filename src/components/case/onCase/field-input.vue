<template>
<span class="">
  {{(type!=='time'?label:'')}}
  <!-- 文本输入 -->
  <el-input v-if="type==='string'" v-model="reVal" :disabled="disabled" placeholder=""></el-input>

  <!-- 时间范围选择 -->
  <el-time-picker v-if="type==='time'" v-model="reVal" :editable="true" @change="updateReVal" :disabled="disabled" :style="`width:${label.length * 22}px`" :placeholder="time?time:label"></el-time-picker>

  <!-- 数字输入框 -->
  <el-input-number v-if="type==='number'" v-model="reVal" :min="1" size="small" @change="updateReVal1" :disabled="disabled" style="width:120px;" :placeholder="label"></el-input-number>
</span>
</template>
<script>
  export default {
    data: () => ({
      reVal: null
    }),
    props: {
      label: {
        type: String,
        default: '',
        required: true
      },
      type: {
        type: String,
        default: '',
        required: true
      },
      value: {
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      time: {
        default: ''
      }
    },
    methods: {
      updateReVal(val) {
        let returnData = {
          time: val,
          diff: this.label
        }
        this.$emit('input', returnData)
      },
      updateReVal1(val) {
        this.$emit('input', val)
      }
    },
    created() {
      // if (this.type === 'number') this.updateReVal1(1)
    }
  }

</script>
