<template>
<!-- <el-select v-model="hotelId" filterable remote :remote-method="fetchList" :loading="loading" @change="onChange" :style="'width:'+width+'px;'" placeholder="通过名称或编码搜索"> -->
<el-select v-model="hotelId" filterable :loading="loading" @change="onChange" :style="'width:'+width+'px;'" placeholder="通过名称搜索">
  <el-option v-for="(item,i) in hotelOps" :key="i" :label="item.LGMC" :value="item.LGDM"></el-option>
</el-select>
</template>
<script>
  import { mapState } from 'vuex'
  import { FETCH_HOTEL_LIST } from '../../store/types'
  import mixin from '../../utils/mixin'

  /**
   * @module HotelSelector
   * @desc 酒店选择器
   *
   *    返回值: {String} 酒店Code
   *
   * @example <hotel-selector v-model="column"></hotel-selector>
   */
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        hotelOps: [],
        hotelId: ''
      }
    },
    /**
     * 接收参数
     * @prop {Number} width 组件宽度 @default 190
     */
    props: {
      width: {
        type: Number,
        default: 190
      }
    },
    computed: {
      ...mapState(['baseData'])
    },
    methods: {
      fetchList(keyword = '') {
        this.dispatch(FETCH_HOTEL_LIST, {}).then(() => {
          this.hotelOps = this.baseData.hotelList
        })
      },
      onChange(val) {
        let obj = this.hotelOps.filter(item => {
          return item.LGDM === val
        })
        this.$emit('update:data', { hotelmc: obj[0].LGMC })
        this.$emit('input', val)
        this.$emit('update:value', val)
      }
    },
    created() {
      if (!this.baseData.hotelList) {
        this.fetchList()
      }
    },
    mounted() {}
  }

</script>
