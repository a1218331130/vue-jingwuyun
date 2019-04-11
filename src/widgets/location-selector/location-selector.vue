<template>
<el-dialog v-draggable="dialogDraggableOptions" ref="dialog" class="map-dialog" :visible.sync="dialog" title="位置信息选择器" :modal-append-to-body="true" :append-to-body="true" :size="size" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <pgis ref="pgis" :showSidebar="!pointMode" :showTools="!pointMode" :clickMarkerMode="pointMode" @update:newMarker="updateMarker"></pgis>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.form-box {
    position: relative;
    .search-bar {
        background: #2c5d90;
        padding: 5px 10px;
        position: absolute;
        top: 10px;
        left: 0;
        z-index: 10;
    }
}
</style>
<style>
.map-dialog .el-dialog__body {
  padding: 0;
}
</style>
<script>
import mixin from '../../utils/mixin'
import pgis from './pgis.vue'

/**
 * @module LocationSelector
 * @desc 位置信息选择模态窗, 支持PGIS选择区块范围功能
 *
 * 依赖'./pgis.vue'
 *
 *    返回值: PGIS返回信息对象
 *
 * @example <location-selector @on-select="updateLocation"></location-selector>
 */
export default {
  mixins: [mixin],
  components: { pgis },
  data() {
    return {
      marker: null
    }
  },
  /**
   * 接收参数
   * @prop {Array} dialog 是否显示窗口 @default false
   * @prop {Array} size 窗口大小,详情请参考当前项目对应elementUI客化样式文件 @default 'large--fixed'
   * @prop {String} layer AJGL_SJJBXX_PT 案件， PGIS_CS_FWCS_DH_PG_BG 旅馆， JSAH_JTGL_JKKK_PT 卡口， PGIS_CS_YLCS_DH_PG_WB 网吧 @default ''
   */
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
    }
  },
  computed: {},
  watch: {
    dialog(val) {
      // 由于PGIS在窗口resize时会计算canvas的显示，如果弹窗关闭后resize会隐藏canvas，这里作用时恢复canvas显示
      if(val && this.$refs.pgis) {
        this.$nextTick(() => {
          this.$refs.pgis.map.updateSize()
        })
      }
    }
  },
  methods: {
    initDialog() {
      this.reset()
    },
    submit() {
      if(this.$refs.pgis.selected || this.marker !== null) {
        if(!this.pointMode) {
          /**
           * 选中数据
           * @event module:LocationSelector~on-select
           * @param {Object} a 选中的Pgis返回对象
           */
          this.$emit('on-select', this.$refs.pgis.selected)
        } else if(this.marker !== null) {
          this.$emit('on-select', this.marker)
        }
      } else {
        this.$alert('请选择地点', '温馨提示');
      }
    },
    updateMarker(marker) {
      this.marker = marker
    },
    closeEvent() {
      /**
       * 关闭窗口
       * @event module:LocationSelector~close
       */
      this.$emit('close')
    },
    reset() {
      if(this.$refs.gpis) {
        this.$refs.gpis.clearMap()
      }
      this.marker = null
    }
  },
  created() {},
  mounted() {}
}
</script>
