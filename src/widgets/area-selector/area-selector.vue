<template>
<div class="area-selector">
  <el-select v-model="province" @change="provinceChange" placeholder="请选择省" style="margin-right:10px;" :disabled="this.disabled">
    <el-option v-for="(item,i) in provinceOps" :key="i" :label="item.label" :value="item.value"></el-option>
  </el-select>
  <el-select v-model="city" :disabled="province===''||this.disabled" @change="cityChange" placeholder="请选择市" style="margin-right:10px;">
    <el-option v-for="(item,i) in cityOps" :key="i" :label="item.label" :value="item.value"></el-option>
  </el-select>
  <el-select v-model="subArea" :disabled="province===''||city===''||this.disabled" @change="areaChange" placeholder="请选择区/县" style="display:inline-block;">
    <el-option v-for="(item,i) in areaOps" :key="i" :label="item.label" :value="item.value"></el-option>
  </el-select>
</div>
</template>
<style lang="scss" scoped>
.area-selector {
    width: 100%;
    display: flex;
}
</style>
<script>
import { mapState } from 'vuex'
import { FETCH_ADMIN_DIVISION } from '../../store/types'

import mixin from '../../utils/mixin'

/**
 * @module AreaSelector
 * @desc 三级联动行政区划选择器
 *
 *    返回值: `[省Code, 市Code, 区/县Code]`
 *
 * @example <area-selector v-model="column"></area-selector>
 */
export default {
  mixins: [mixin],
  data: () => ({
    province: '',
    city: '',
    subArea: '',
    provinceOps: [],
    cityOps: [],
    areaOps: []
  }),
  /**
   * 接收参数
   * @prop {Array} defaultArea 默认区划CODE数组 @default ['', '', '']
   */
  props: {
    defaultArea: {
      type: Array,
      default: ['', '', '']
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['area'])
  },
  watch: {
    defaultArea(val) {
      this.province = val[0] || ''
      this.city = val[1] || ''
      this.subArea = val[2] || ''
    }
  },
  methods: {
    fetchOptios(parentId = '', type = 'provinceOps') {
      // if (parentId === '310000' || parentId === '110000' || parentId === '500000') {
      //   this[type] = []
      // } else {
      this[type] = []
      this.dispatch(FETCH_ADMIN_DIVISION, { zdlx: 'XZQHDM', fjdm: parentId, keyword: '' }).then(() => {
        this[type] = [...this.area.list.map(d => { return { label: d.zdmc, value: d.zddm } })]
        if(type === 'provinceOps' && this[type].find(d => d.value === this.defaultArea[0])) {
          this.province = this.defaultArea[0]
        } else if(type === 'cityOps' && this[type].find(d => d.value === this.defaultArea[1])) {
          this.city = this.defaultArea[1]
        } else if(type === 'areaOps' && this[type].find(d => d.value === this.defaultArea[2])) {
          this.subArea = this.defaultArea[2]
        }
      })
      // }
    },
    provinceChange() {
      this.city = ''
      this.subArea = ''
      this.fetchOptios(this.province, 'cityOps')
      this.commit()
    },
    cityChange() {
      this.subArea = ''
      this.fetchOptios(this.city, 'areaOps')
      this.commit()
    },
    areaChange() {
      this.commit()
    },
    commit() {
      this.$emit('input', [this.province, this.city || '', this.subArea || ''])
    }
  },
  created() {
    this.fetchOptios()
  }
}
</script>
