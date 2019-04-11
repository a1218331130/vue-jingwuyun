<template>
<div class="words">
  <div class="words__item" v-for="(item,i) in data" :key="i">
    {{item}}
    <el-button type="danger" size="mini" icon="icon iconfont icon-close" @click="remove(item)"></el-button>
  </div>
  <el-input v-model="inputVal" placeholder="新增" size="small" style="width:100px;" icon="icon iconfont icon-plus" :on-icon-click="add"></el-input>
</div>
</template>

<style lang="scss" scoped>
.words {
    &__item {
        height: 30px;
        line-height: 30px;
        padding: 0 5px;
        margin-right: 15px;
        border: 1px solid #ccc;
        border-radius: 3px;
        position: relative;
        display: inline-block;
        .el-button {
            padding: 0;
            border-radius: 100%;
            position: absolute;
            top: -8px;
            right: -8px;
            .iconfont {
                font-size: 12px;
                font-weight: normal;
            }
        }
    }
}
</style>

<script>
import mixin from '../../utils/mixin'
import { arrayGetRid } from '../../utils/util'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      inputVal: '',
      data: []
    }
  },
  props: ['value', 'options'],
  computed: {

  },
  watch: {},
  methods: {
    add() {
      if (this.inputVal !== '' && !this.data.find(d => d === this.inputVal)) {
        this.data.push(this.inputVal)
        this.inputVal = ''
      }
    },
    remove(item) {
      arrayGetRid(this.data, [item])
    }
  },
  created() {},
  mounted() {
    this.data = this.value || []
  }
}
</script>
