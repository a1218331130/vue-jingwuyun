<template>
<!-- <el-select v-model="areaId" filterable remote :remote-method="fetchList" :loading="loading" @change="onChange" :style="'width:'+width+'px;'" placeholder="通过名称或编码搜索"> -->
<el-select v-model="areaId" filterable :loading="loading" @change="onChange" :style="'width:'+width+'px;'" placeholder="通过名称搜索">
  <el-option v-for="(item,i) in areaOps" :key="i" :label="item.XZQHMC" :value="item.XZQH"></el-option>
</el-select>
</template>
<script>
  import { mapState } from 'vuex'
  import { FETCH_AREA_LIST } from '../../store/types'
  import mixin from '../../utils/mixin'

  /**
   * @module AreaSpcSelector
   * @desc 下拉树式行政区划选择器
   *
   *    返回值: `[省Code, 市Code, 区/县Code]`
   *
   * @example <area-spc-selector v-model="column"></area-spc-selector>
   */
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        areaOps: [],
        areaId: ''
      }
    },
    /**
     * 接收参数
     * @prop {Number} width 元素宽度 @default 190
     */
    props: {
      width: {
        type: Number,
        default: 190 // gp
      }
    },
    computed: {
      ...mapState(['baseData'])
    },
    methods: {
      /**
       * 通过案件名称远程搜索案件信息
       * @param {String} keyword
       */
      fetchList(keyword = '') {
        this.dispatch(FETCH_AREA_LIST, {}).then(() => {
          this.areaOps = [...this.baseData.areaList]
          this.areaOps.unshift({ XZQH: '431200', XZQHMC: '怀化市' })
          this.areaId = this.userOrgInfo.mainOrg.SSQYDM || ''
        })
      },
      onChange(val) {
        let obj = this.areaOps.filter(item => {
          return item.XZQH === val
        })
        this.$emit('update:data', { areamc: obj[0].XZQHMC })
        this.$emit('input', val)
        this.$emit('update:value', val)
      }
    },
    created() {
      if (!this.baseData.areaList) {
        this.fetchList()
      }
    },
    mounted() {}
  }

</script>
