<template>
<div class="el-echarts"></div>
</template>

<style scoped>


</style>

<script>
  /**
   * @module ECharts
   * @desc ECharts Vue 组件
   *
   * @example <import-dialog :dialog="dialogImport" :type="2" :caseInfo="null" @close="clearFileInput"></import-dialog>
   */
  import echarts from 'echarts';
  import { addResizeListener, removeResizeListener } from '../../utils/resize-event'
  export default {
    name: 'ECharts',
    componentName: 'ECharts',
    /**
     * 接收参数
     * @prop {Number} mapdata @default ''
     * @prop {Object} option ECharts官方option, 请参考官方文档
     * @prop {Array} events 自定义事件, 可定制 ECharts 鼠标事件相关配置 events: [{on:'鼠标事件', method:(percent) => {}]
     * 【栗子: event: [{on:'click', method:(percent) => {}]】
     * @prop {Boolean} loading 是否加载中  @default false
     */
    props: {
      mapdata: {
        type: String,
        default: ''
      },
      option: Object,
      events: Array,
      loading: Boolean
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      option(val) {
        if (this.chart) {
          this.option ? this.chart.setOption(val) : this.chart.clear();
        }
      },
      loading(val) {
        val ? this.chart.showLoading() : this.chart.hideLoading();
      }
    },
    methods: {
      makeImage() {
        return this.chart.getDataURL();
      },
      resize() {
        this.chart && this.chart.resize();
      },
      action() {
        this.$nextTick(() => {
          if (this.chart !== null) {
            this.chart.dispose()
            this.chart = null
          }
          this.chart = echarts.init(this.$el);
          this.option && this.chart.setOption(this.option);
          this.loading ? this.chart.showLoading() : this.chart.hideLoading();
          addResizeListener(this.$el, this.resize);
          /**
           * 初始化完成
           * @event module:ECharts~init
           * @param {Object} a echarts实体
           */
          this.$emit('init', this.chart)
          // 绑定事件{
          let optEvent = this.events
          if (optEvent) {
            if (Array.isArray(optEvent)) {
              optEvent.map(re => {
                this.chart.on(re.on || 'click', re.method || function(p) { console.log('请绑定echart 图表 事件 执行method ') })
                return re
              })
            }
          }
        })
      }
    },
    mounted() {
      if (this.mapdata === '') {
        this.action()
      } else {
        this.$http.get('/static/map/' + this.mapdata + '.json').then(res => {
          echarts.registerMap(this.mapdata, JSON.parse(JSON.stringify(res.data)))
          this.action()
        })
      }
    },
    beforeDestroy() {
      removeResizeListener(this.$el, this.resize);
      if (this.chart !== null) this.chart.dispose()
      this.$el.remove();
    }
  }

</script>
