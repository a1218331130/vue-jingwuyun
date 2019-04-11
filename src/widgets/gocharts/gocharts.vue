<template>
<div class="gocharts">
  <div :id="boxId || 'goBox'" class="maker canvas-board" :style="'background:' + background + ';'"></div>
</div>
</template>

<style lang="scss" scoped>
  .gocharts {
    .maker {
      background: #fff;
      width: 100%;
      height: 100%;
    }
  }

</style>

<script>
  import { NgwGo } from '../../utils/ngw.go'
  import { clone } from '../../utils/util'

  /**
   * @module GoCharts
   * @desc 基于Gojs的关系图组件
   *
   * @example <gocharts :data="chartData" :options="{readOnly:readOnly,allowZoom :true, layout: 'ForceDirectedLayout'}"></gocharts>
   */
  export default {
    name: 'GoCharts',
    componentName: 'GoCharts',
    /**
     * 接收参数
     * @prop {Object} data 标准Gojs对象, 如: { nodeDataArray: [ ], linkDataArray: [] }
     * @prop {String} boxId 默认:'goBox'
     * @prop {Object} options 配置项
     * @prop {String} options.layout 默认: 'ForceDirectedLayout', 详情请参考GOJS官方文档. 'GridLayout': 网格 'LayeredDigraphLayout': 分层, 'CircularLayout': 圆形, 'ForceDirectedLayout': 反牵引力, 'TreeLayout': 树形
     * @prop {Boolean} options.readOnly 是否只读
     * @prop {Boolean} options.allowZoom 是否允许缩放
     * @prop {String} options.overview 鹰眼图选择器字符串
     * @prop {String} options.contextMenuElm 鼠标右键事件回调
     * @prop {Function} options.makerClickEvent 画板单击事件回调
     * @prop {Function} options.nodeClickEvent 节点单击事件回调
     * @prop {Function} options.nodeDoubleClickEvent 节点双击事件回调
     * @prop {Function} options.linkNodeClickEvent 连线单击事件回调
     * @prop {String} background 默认:'#fff'
     *
     */
    props: {
      data: {
        type: Object,
        default: null
      },
      boxId: {
        type: String,
        default: 'goBox'
      },
      options: {
        type: Object,
        default () {
          return {
            layout: 'ForceDirectedLayout',
            readOnly: false, // 只读
            allowZoom: true, // 允许缩放
            overview: '', // 预测图
            contextMenuElm: '',
            makerClickEvent: () => {},
            nodeClickEvent: (e, node) => {},
            nodeDoubleClickEvent: (e, node) => {},
            linkNodeClickEvent: (e, node) => {}
          }
        }
      },
      background: {
        type: String,
        default: '#fff'
      },
      imgToBase64: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        mainGo: null,
        diagram: null,
        nodeList: []
      }
    },
    computed: {},
    watch: {
      'data.id': {
        handler: function(newVal, oldVal) {
          this.initMaker()
        },
        deep: true
      }
    },
    methods: {
      initMaker(goData, updateLayout = true) {
        this.chartData = clone(goData || this.data)
        let ngwGoObj = {
          elmBox: this.boxId || 'goBox',
          diagram: this.diagram || null,
          data: this.chartData || null,
          readOnly: this.options.readOnly,
          allowZoom: this.options.allowZoom,
          inspector: this.options.inspector || null,
          nodeList: this.nodeList || [],
          layout: this.options.layout || '',
          overview: this.options.overview || '',
          makerClickEvent: this.makerClickEvent,
          nodeClickEvent: this.nodeClickEvent,
          wrapOpenEvent: this.options.wrapOpenEvent,
          wrapFoldEvent: this.options.wrapFoldEvent,
          nodeDoubleClickEvent: this.options.nodeDoubleClickEvent,
          linkNodeClickEvent: this.options.linkNodeClickEvent,
          lineClickEvent: (e, targetObj) => {
            /**
             * 连线单击
             * @event module:GoCharts~link-click
             * @param {Object} a
             * @param {Event} a.e 鼠标事件
             * @param {Object} a.targetObj 连接数据对象
             */
            this.$emit('link-click', { e: e, targetObj: targetObj })
          },
          lineContextMenuEvent: (e, targetObj) => {
            /**
             * 连线右键点击
             * @event module:GoCharts~link-contextmenu
             * @param {Object} a
             * @param {Event} a.e 鼠标事件
             * @param {Object} a.targetObj 连线数据对象
             */
            this.$emit('link-contextmenu', { e: e, targetObj: targetObj })
          },
          linkDrawnEvent: (e) => {
            /**
             * 拖拉连接两个节点
             * @event module:GoCharts~link-drawn
             * @param {Event} e 鼠标事件
             */
            this.$emit('link-drawn', e)
          },
          contextMenuEvent: this.contextMenuEvent
        }
        // 如果之前画板有图, 则清除gojs之前的画板
        if (this.mainGo) {
          this.mainGo.diagram.isReadOnly = ngwGoObj.readOnly;
          this.mainGo.diagram.model.nodeDataArray = ngwGoObj.data.nodeDataArray // 节点数据
          this.mainGo.diagram.model.linkDataArray = ngwGoObj.data.linkDataArray // 连线数据
          if (updateLayout === true) {
            this.mainGo.setLayout(this.options.layout)
          }
        } else {
          this.mainGo = new NgwGo(ngwGoObj)
          this.mainGo.init();
          if (this.options.inspector) {
            new window.Inspector(this.options.inspector.containerId, this.mainGo.diagram, {
              properties: this.options.inspector.properties
            })
          }
        }
        /**
         * 初始化完成
         * @event module:GoCharts~inited
         */
        this.$emit('inited', this.boxId)
      },
      /**
       * 添加根节点
       */
      addNode() {
        this.mainGo.addNode({
          id: Date.parse(new Date()),
          title: '新起点'
        })
      },
      /**
       * 清除所有节点
       */
      clearAll() {

      },
      /**
       * 同步建模器数据到VUEMODEL
       */
      syncData() {
        let obj = JSON.parse(this.mainGo.diagram.model.toJson())
        this.chartData = {
          nodeDataArray: obj.nodeDataArray,
          linkDataArray: obj.linkDataArray
        }
      },
      /**
       * 提交数据到父级
       */
      commitData() {
        this.syncData()
        /**
         * 提交数据到父级
         * @event module:GoCharts~update:data
         * @param {Object} a 模型数据
         * @param {Array} a.nodeDataArray 节点数组
         * @param {Array} a.linkDataArray 连线数组
         */
        this.$emit('update:data', clone(this.chartData))
      },
      /**
       * 生成图片(base64 string)
       */
      makeImage(options = {
        ref: null,
        makeOption: { background: 'rgba(255,255,255,1)' },
        beforeMakeImage: null,
        afterMakeImage: null
      }) {
        /**
         * 生成图片
         * @event module:GoCharts~update:imageData
         * @param {String} a Base64字符串
         */
        if (options.beforeMakeImage && typeof options.beforeMakeImage === 'function') {
          options.beforeMakeImage();
        }
        this.$emit('update:imageData', { data: this.mainGo.diagram.makeImageData(options.makeOptions), ref: options.ref })
        if (options.afterMakeImage && typeof options.afterMakeImage === 'function') {
          options.afterMakeImage();
        }
      },
      nodeClickEvent(e, node) {
        this.hideContextMenu()
        if (this.options.nodeClickEvent) this.options.nodeClickEvent(e, node)
      },
      makerClickEvent(e) {
        this.hideContextMenu()
        if (this.options.makerClickEvent) this.options.makerClickEvent()
      },
      /**
       * 节点右键菜单事件
       * @param {Object} e    鼠标事件
       */
      contextMenuEvent(e) {
        this.hideContextMenu()
        if (this.options.contextMenuElm !== '') {
          let elm = document.getElementById(this.options.contextMenuElm)
          elm.style.display = 'block'
          elm.style.left = (e.viewPoint.x + 10) + 'px'
          elm.style.top = (e.viewPoint.y + 20) + 'px'
          elm.addEventListener('contextmenu', e => {
            e.preventDefault()
            return false
          }, false)
        }
      },
      hideContextMenu() {
        if (this.options.contextMenuElm !== '') {
          document.getElementById(this.options.contextMenuElm).style.display = 'none'
          /**
           * 隐藏右键菜单成功
           * @event module:GoCharts~hideContextMenu
           */
          this.$emit('hideContextMenu')
        }
      }
    },
    mounted() {
      this.initMaker()
    }
  }

</script>
