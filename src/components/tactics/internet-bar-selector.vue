// 网吧筛选
<template>
  <div>
    <el-select v-model="res.areaCode" filterable :loading="loading" @change="onAreaChange" placeholder="通过名称搜索地区" style="margin-bottom:5px;">
      <el-option v-for="(item,i) in areaOps" :key="i" :label="item.XZQHMC" :value="item.XZQH"></el-option>
    </el-select>

    <el-select v-model="tranParam" multiple :multipleLimit="3" @change="internetBarChange" filterable :loading="loading" placeholder="通过网吧搜索" icon="el-icon-cicle-cross">
      <el-option v-for="(item, i) in internetOps" :key="i" :label="item.wbmc" :value="item.wbbh"></el-option>
    </el-select>
    <div class="tips">最多选择3家网吧同时查询</div>
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
  import { FETCH_AREA_LIST, FETCH_TACTICS_NET_BAR_LIST } from '../../store/types'
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
        internetOps: [],
        res: {
          areaCode: '',
          internetBarCode: '',
          areamc: '',
          wbmc: ''
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
        let arr = this.internetOps.filter(item => {
          var flag = false;
          val.map(item1 => {
            if (item.wbbh === item1) {
              flag = true
            }
          })
          return flag
        })
        let arr1 = []
        arr.map(item => {
          arr1.push(item.wbmc)
        })
        this.res.wbmc = arr1.join()
        this.res.internetBarCode = this.tranParam.join()
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
      fetchInternetBarList() {
        this.dispatch(FETCH_TACTICS_NET_BAR_LIST, { areaCode: this.res.areaCode }).then(() => {
          this.internetOps = [...this.baseData.fetchTacticsNetBarListResult]
        })
      },
      onAreaChange(val) {
        this.fetchInternetBarList()
        this.res.internetBarCode = ''
        this.internetOps = []
        let obj = this.areaOps.find(item => {
          return item.XZQH === this.res.areaCode;
        })
        this.res.areamc = obj.XZQHMC
        this.$emit('update:data', { areamc: this.res.areamc, wbmc: this.res.wbmc })
        this.$emit('input', this.res)
      },
      internetBarChange(val) {
        this.$emit('update:data', { areamc: this.res.areamc, wbmc: this.res.wbmc })
        this.$emit('input', this.res)
      }
    },
    created() {
      if (!this.baseData.areaList) {
        this.fetchAreaList()
      }
    },
    mounted() {
      //      this.internetOps.unshift({NAME: '请选择', CODE: ''})
    }
  }

</script>
