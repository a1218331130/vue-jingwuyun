<!-- 侦查导图 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="侦查导图"></card-header>
  <!-- 内容 -->
  <el-row class="certificate-box">
    <P v-if="chartDataList.length === 0" style="color: #5e7382;text-align: center">暂无数据</P>
    <gocharts v-if="gochartsFlag" ref="goBoxZC" :boxId="'goBoxZC_'+ index" :key="index" v-for="(item,index) in chartDataList" class="maker-box" :data="item" @update:imageData="updateImageData" :options="{readOnly:true,allowZoom:false}"></gocharts>
    <img :src="item" v-for="item in imageBase64" v-if="imageBase64.length>0&&!gochartsFlag" alt="">
  </el-row>
</div>
</template>

<style scoped lang="scss">
  .certificate-box {
    margin-top: 13px;
    width: 100%;
    .maker-box {
      width: 100%;
      height: 500px;
      margin: 5px auto;
    }
  }

</style>

<script>
  import mixin from '../../../../utils/mixin'
  import { mapState } from 'vuex'

  import cardHeader from './card-header.vue'
  import gocharts from '../../../../widgets/gocharts/gocharts'
  import { FETCH_BRAINMAP } from '../../../../store/types'
  export default {
    mixins: [mixin],
    components: {
      cardHeader,
      gocharts
    },
    computed: {
      ...mapState(['brainmap'])
    },
    data() {
      return {
        caseId: '',
        pagenav: { limit: 10000, currentpage: 1, showInRecord: '1' },
        chartDataList: [],
        imageBase64: [],
        snapImage: [],
        flag: false,
        form: {
          id: '',
          title: '临时模型',
          type: '0',
          remark: '',
          keyword: '',
          showInRecord: '0'
        }
      }
    },
    props: {
      operation: {
        type: Number,
        default: 1
      },
      exportSnap: {
        type: Boolean,
        default: false
      },
      gochartsFlag: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      operation(newVal, oldVal) {
        if (newVal !== 1) {
          this.imageBase64 = [];
          this.flag = true;
          this.makeImage()
        }
      },
      exportSnap(newVal, oldVal) {
        if (newVal) {
          this.imageBase64 = [];
          this.flag = false
          this.gochartsFlag = false
          this.snapImage = []
          this.makeImage()
        }
      },
      imageBase64() {
        let arrays = []
        this.imageBase64.map((item, idx, array) => {
          let base64 = item.split('base64,')[1]
          arrays.push(base64)
        })
        if (this.flag) {
          let strings = `[${arrays.join()}]`
          this.$emit('update:imageData', { strings: strings, baseImage: this.imageBase64 })
        }
      }
    },
    methods: {
      makeImage() {
        this.$refs.goBoxZC.map(item => {
          item.makeImage()
        })
      },
      updateImageData(val) {
        this.imageBase64.push(val.data)
        // let arr = [];
        // arr.push(val.data);
        // this.imageBase64 = arr;
      },
      fetch() {
        if (this.checkRuleCase('ajgl/reconnaissancemap/list', this.caseId)) {
          this.dispatch(FETCH_BRAINMAP, {
            ajid: this.caseId,
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit,
            sfxs: this.pagenav.showInRecord
          }).then(() => {
            this.chartDataList = this.brainmap.list.PageData.map((r, ir) => {
              let _rdt = JSON.parse(r.dt)
              //              this.$refs['goBoxT' + ir].initMaker(_rdt)
              return _rdt
            })
          })
        }
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.fetch()
      this.makeImage()
    }
  }

</script>
