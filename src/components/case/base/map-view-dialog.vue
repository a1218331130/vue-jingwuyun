<template>
<!-- 详情列表弹窗 -->
<el-dialog :title="'地图查看'" :visible.sync="dialog" :size="size" :modal="false" @open="openInit" :before-close="closeEvent">
      <pgis ref="pgis"   :showControl="true"  :showTools="false" ></pgis>
</el-dialog>
</template>

<style lang="scss" scoped>


</style>

<script>
  import pgis from '../../../widgets/pgis/pgis'
  // import mixin from '../../../utils/mixin'
  const src = `/static/num/red.png`
  const icon = new window.EzIcon({
    src: src,
    anchor: [0.5, 1],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1
  })
  export default {
    components: { pgis },
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'large--fixed'
      },
      //
      layer: {
        type: String,
        default: ''
      },
      pointMode: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    computed: {},
    data() {
      return {
        marker: null
      }
    },
    watch: {
      dialog(val) {
        if (val && this.$refs.pgis) {
          this.$nextTick(() => {
            this.$refs.pgis.map.updateSize();
          })
        }
      }
    },
    methods: {
      /**
       * 初始化弹窗
       */
      openInit() {
        if (!this.$refs.pgis) {
          setTimeout(() => {
            this.openInit()
          }, 300);
        } else {
          if (this.$refs.pgis && this.$refs.pgis.map) {
            this.marker && this.$refs.pgis.map.removeOverlay(this.marker);
            let coord = new window.EzCoord(this.data.pos.jd, this.data.pos.wd)
            this.marker = new window.EzMarker(coord, icon)
            this.$refs.pgis.map.addOverlay(this.marker);
            this.$refs.pgis.map.centerAndZoom(coord, 15)
          }
        }
      },
      /**
       * 关闭弹窗触发
       */
      closeEvent() {
        this.$emit('close')
      }
    },
    mounted() {},
    created() {}
  }

</script>
