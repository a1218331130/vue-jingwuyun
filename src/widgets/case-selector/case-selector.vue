<template>
<el-select v-model="caseId" 
filterable 
 :loading="loading" 
@change="onChange" :style="'width:'+width+'px;'"
 :placeholder="this.type==='gp'?'通过案件编号搜索':'点击选择案件'">
  <el-option v-for="(item,i) in caseOps" 
  :key="i"
  :label="item.label"
   :value="item.value"></el-option>
</el-select>
</template>
<script>
  import { mapState } from 'vuex'
  import { FETCH_CASE_LIST, FETCH_CASE_INFO_BY_NUMBER } from '../../store/types'
  import mixin from '../../utils/mixin'

  /**
   * @module CaseSelector
   * @desc 案件选择器
   *
   *    返回值: 案件信息对象
   *
   * @example <case-selector :width="350" v-model="caseInfo"></case-selector>
   */
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        caseOps: [],
        caseId: ''
      }
    },
    /**
     * 接收参数
     * @prop {String} type 案件来源(us:本地库,gp:GP库) @default 'us'
     * @prop {Number} width 组件宽度 @default 170
     */
    props: {
      type: {
        type: String,
        default: 'us' // gp
      },
      value: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: 170
      },
      otherOptionEnabled: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState(['caseInfo'])
    },
    watch: {
      value(val) {
        if (this.caseId !== val) {
          this.caseId = val || ''
        }
      }
    },
    methods: {
      /**
       * 通过案件名称远程搜索案件信息
       * @param keyword
       * @param callback
       */
      fetchCase(keyword = '') {
        if (keyword === '其他' && this.otherOptionEnabled) {
          this.caseOps = []
          let other = {
            label: '其他',
            value: '02',
            data: { // 案件
              caseId: '02', // 案件编号
              caseName: '其他', // 案件名称
              caseDesc: '', // 基本案情
              data: null // 原对象
            }
          }
          other.data = other;
          this.caseOps.unshift(other)
          return;
        }
        let query = {
          PageIndex: 1,
          PageSize: 10
        }
        if (this.type === 'gp') {
          query['ajbh'] = keyword
        } else {
          query['ajmc'] = keyword
        }
        this.dispatch(this.type === 'gp' ? FETCH_CASE_INFO_BY_NUMBER : FETCH_CASE_LIST, query).then(() => {
          if (this.type === 'gp') {
            if (this.caseInfo.FetchCaseInfoByNumber.ajList.length > 0) {
              this.caseOps = this.caseInfo.FetchCaseInfoByNumber.ajList.map(d => {
                return {
                  label: d.ajmc,
                  value: d.asjbh,
                  data: { // 案件
                    caseId: d.asjbh, // 案件编号
                    caseName: d.ajmc, // 案件名称
                    caseDesc: d.jyaq, // 基本案情
                    data: d // 原对象
                  }
                }
              })
            } else {
              this.caseOps = []
            }
          } else {
            if (this.caseInfo.PageData.length > 0) {
              this.caseOps = this.caseInfo.PageData.map(d => {
                return {
                  label: d.ajmc,
                  value: d.id,
                  data: { // 案件
                    caseId: d.id, // 案件编号
                    caseName: d.ajmc, // 案件名称
                    caseDesc: d.jyaq, // 基本案情
                    data: d // 原对象
                  }
                }
              })
              if (this.otherOptionEnabled) {
                this.caseOps.unshift({
                  label: '其他',
                  value: '02',
                  data: { // 案件
                    caseId: '02', // 案件编号
                    caseName: '其他', // 案件名称
                    caseDesc: '', // 基本案情
                    data: null // 原对象
                  }
                })
              }
            } else {
              this.caseOps = []
            }
          }
        })
      },
      onChange(val) {
        if (val.trim() === '') {
          this.$emit('clear:value');
        } else {
          this.$emit('input', this.caseOps.find(d => d.value === val).data)
          this.$emit('update:value', this.caseOps.find(d => d.value === val).data)
        }
      }
    },
    created() {
      this.fetchCase()
    },
    mounted() {}
  }

</script>
