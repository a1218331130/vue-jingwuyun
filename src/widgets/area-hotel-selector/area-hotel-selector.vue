<template>
<div>
  <el-select v-model="res.areaCode" filterable :loading="loading" @change="onAreaChange" :style="'width:'+width+'px;'" placeholder="通过名称搜索地区" style="margin-bottom:5px;">
    <el-option v-for="(item,i) in areaOps" :key="i" :label="item.XZQHMC" :value="item.XZQH"></el-option>
  </el-select>

  <el-select v-model="tranParam" multiple :multiple-limit="3" @change="onHotelChange" filterable :loading="loading" :style="'width:'+width+'px;'" placeholder="通过名称搜索酒店">
    <el-option v-for="(item, i) in hotelOps" :key="i" :label="item.NAME" :value="item.CODE"></el-option>
  </el-select>
  <!-- <el-select v-model="res.hotelCode" @chang="onHotelChange" filterable :loading="loading" :style="'width:'+width+'px;'" placeholder="通过名称搜索酒店">
    <el-option v-for="(item, i) in hotelOps" :key="i" :label="item.NAME" :value="item.CODE"></el-option>
  </el-select> -->
  <div class="tips">最多选择3个酒店同时查询</div>
</div>
</template>
<style lang="scss" scoped>
  .tips {
    color: #ccc;
    text-algin: right;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_AREA_LIST, FETCH_HOTEL_LIST_BY_AREA_CODE } from '../../store/types'
  import mixin from '../../utils/mixin'

  /**
   * @module AreaHotelSelector
   * @desc 区划酒店联动选择组件
   *
   *    返回值: `{areaCode: '', hotelCode: '' }`
   *
   * @example <area-hotel-selector v-model="column"></area-hotel-selector>
   */
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        areaOps: [],
        hotelOps: [],
        res: {
          areaCode: '',
          hotelCode: '',
          areamc: '',
          hotelmc: ''
        },
        tranParam: []
      }
    },
    /**
     * 接收参数
     * @prop {Number} width 输入组件宽度 @default 190
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
    watch: {
      tranParam(val) {
        let arr = this.hotelOps.filter(item => {
          var flag = false;
          val.map(item1 => {
            if (item.CODE === item1) {
              flag = true
            }
          })
          return flag
        })
        let arr1 = []
        arr.map(item => {
          arr1.push(item.NAME)
        })
        this.res.hotelmc = arr1.join()
        this.res.hotelCode = this.tranParam.join()
      }
    },
    methods: {
      fetchAreaList(keyword = '') {
        this.dispatch(FETCH_AREA_LIST, {}).then(() => {
          this.areaOps = [...this.baseData.areaList]
          this.areaOps.unshift({ XZQH: '431200', XZQHMC: '怀化市' })
          this.res.areaCode = this.userOrgInfo.mainOrg.SSQYDM || ''
        })
      },
      fetchHotelList() {
        this.dispatch(FETCH_HOTEL_LIST_BY_AREA_CODE, { areaCode: this.res.areaCode }).then(() => {
          this.hotelOps = [...this.baseData.hotelListByAreaCode]
        })
      },
      onAreaChange(val) {
        this.fetchHotelList()
        this.res.hotelCode = ''
        this.res.hotelmc = ''
        this.hotelOps = []
        let obj = this.areaOps.find(item => {
          return item.XZQH === this.res.areaCode;
        })
        this.res.areamc = obj.XZQHMC
        this.$emit('update:data', { areamc: obj.XZQHMC, hotelmc: this.res.hotelmc })
        this.$emit('input', this.res)
      },
      onHotelChange(val) {
        this.$emit('update:data', { hotelmc: this.res.hotelmc })
        this.$emit('input', this.res)
      }
    },
    created() {
      if (!this.baseData.areaList) {
        this.fetchAreaList()
      }
    },
    mounted() {}
  }

</script>
