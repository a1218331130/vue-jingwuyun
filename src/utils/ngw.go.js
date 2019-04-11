// 加载gojs
import go from 'gojs'
import Nodes from './ngw.go.node.js'

/**
 * NgwGo Go建模类
 */
class NgwGo {
  /**
   * 构建函数
   * @constructs
   */
  constructor(options) {
    this.ops = options
    this.goBoxId = this.ops.elmBox || 'goBox'
    this.readOnly = this.ops.readOnly
    this.allowZoom = this.ops.allowZoom
    this.maker = go.GraphObject.make
    this.diagram = this.ops.diagram || null
    this.data = this.ops.data || null
    this.nodeList = this.ops.nodeList
    this.layout = this.ops.layout;
    this.overview = this.ops.overview || ''
    this.makerClickEvent = this.ops.makerClickEvent || (() => {})
    this.linkDrawnEvent = this.ops.linkDrawnEvent || (() => {})
    this.nodeClickEvent = this.ops.nodeClickEvent || (() => {})
    this.wrapOpenEvent = this.ops.wrapOpenEvent || (() => {})
    this.wrapFoldEvent = this.ops.wrapFoldEvent || (() => {})
    this.nodeDoubleClickEvent = this.ops.nodeDoubleClickEvent || (() => {})
    this.lineClickEvent = this.ops.lineClickEvent || (() => {})
    this.lineContextMenuEvent = this.ops.lineContextMenuEvent || (() => {})
    this.linkNodeClickEvent = this.ops.linkNodeClickEvent || (() => {})
    this.contextMenu = this.ops.contextMenu || ''
    this.contextMenuEvent = this.ops.contextMenuEvent || ''
    this.draggingInitLayout = this.ops.draggingInitLayout || false
    this.overviewObj = null
    // 默认颜色
    this.defaultColor = '#b8f5ff'
    // 突出颜色
    this.highlightColor = '#48a3fc'
  }

  /**
   * 初始化模板构建器实例
   */
  init() {
    let model = this.maker(go.GraphLinksModel)
    // 创建模板构建器
    if(this.diagram === null) {
      this.diagram = this.makeDiagram()
      model.linkKeyProperty = 'key'
      model.linkFromPortIdProperty = 'fromPort'
      model.linkToPortIdProperty = 'toPort'
    } else {

    }
    // 绑定数据
    model.nodeDataArray = this.data.nodeDataArray // 节点数据
    model.linkDataArray = this.data.linkDataArray // 连线数据
    // 插入数据
    this.diagram.model = model
    // 定义layoutlayout
    this.setLayout(this.layout)
  }

  /**
   * 添加资源节点
   * @param {Object} [e] 拖拉插件事件, 用于获取准确的鼠标定位信息
   * @param {String} category 节点类型名称, 默认'base'
   */
  addNode(e = {}, category = null) {
    let item,
      self = this
    if(self.nodeList.length > 0) {
      item = self.nodeList.pop()
    } else {
      item = {
        id: e.id,
        label: e.title
      }
    }
    if(self.ops.addNodeEvent) {
      self.ops.addNodeEvent(item, function (itemMoveLocol, newtableId, flag) {
        pushNode()
      })
    } else {
      pushNode()
    }

    function pushNode() {
      let goBox = document.getElementById(self.goBoxId),
        goBoxPosition = goBox.getBoundingClientRect(),
        loc = [goBoxPosition.left - goBox.clientWidth / 2 - 160 / 2, goBoxPosition.top - goBox.clientHeight / 2 - 90 / 2].join(' ')
      // GOJS 插入NODE节点
      self.diagram.startTransaction('make new main node')
      self.diagram.model.addNodeData({
        key: item.id,
        category: category || 'base',
        loc: loc,
        name: item.label,
        text: item.label,
        isToLink: false,
        visible: true, // 节点可见
        wrapStatus: 'none'
      })
      self.diagram.commitTransaction('make new main node')
    }
  }

  /**
   * 添加自运算节点
   * @param {String} [title=''] 标题
   * @param {Object}  [task=[]]  节点任务对象, 需包含tableId和taskId
   * @param {Object} [data={}]  Go源节点信息, 对应节点的.part.data值
   */
  addSelfNode(title = '', task = {}, data = {}) {
    let self = this,
      locArray = typeof data.loc === 'string' ? data.loc.split(' ') : data.loc,
      newLoc = ([locArray[0], parseInt(locArray[1]) + 150].join(' '));

    self.diagram.model.addNodeData({
      key: task.taskId,
      tableId: task.tableId,
      category: 'result',
      loc: newLoc,
      color: self.getOnlyColor(),
      name: title,
      info: '计算中...',
      isToLink: false
    });

    self.diagram.model.addLinkData({
      from: data.key,
      to: task.taskId,
      curviness: 0
      // text: '身份证号码 = 国内旅客证件号码'
    });
  }

  /**
   * 添加子节点
   */
  addSubNode(e, obj = {}) {
    let self = this,
      data = obj.part.data,
      // locArray = typeof data.loc === 'string' ? data.loc.split(' ') : data.loc,
      // newLoc = ([locArray[0], parseInt(locArray[1])].join(' ')),
      newLoc = [-e.event.clientX / 2, -e.event.clientY / 2].join(' '),
      subId = Date.parse(new Date())
    self.diagram.startTransaction('make new sub node')
    self.diagram.model.addNodeData({
      key: subId,
      category: 'sub',
      loc: newLoc,
      name: '新思路',
      text: '新思路',
      isToLink: false,
      '背景': '#eef4f4',
      '文字': '#666'
    })

    self.diagram.model.addLinkData({
      from: data.key,
      to: subId,
      curviness: 0
    })
    self.diagram.commitTransaction('make new sub node')
  }

  /**
   * 移除节点/删除节点
   * @param  {String} key 目标节点key
   */
  removeNode(key) {
    let diagram = this.diagram,
      fromLinkData = diagram.model.linkDataArray.filter(l => l.from === key),
      toLinkData = diagram.model.linkDataArray.filter(l => l.to === key),
      targetNode = diagram.model.findNodeDataForKey(key)
    if(fromLinkData.length > 0) {
      alert('本节点正在为子节点提供数据支持, 如需删除, 请先删除所有关联的子节点')
    } else {
      // 删除 关系节点及相关连线
      toLinkData.forEach((link, i) => {
        let thisNode = diagram.model.findNodeDataForKey(link.from)
        // console.log(thisNode.category.indexOf('relation')) // isRelation
        if(thisNode.category.indexOf('relation') === 0) {
          //   console.log(diagram.model.linkDataArray.filter(l => l.to === link.from))
          diagram.model.removeLinkDataCollection(diagram.model.linkDataArray.filter(l => l.to === link.from))
          diagram.model.removeNodeData(thisNode)
        }
      })

      // 删除目标节点 和想着连线
      if(toLinkData.length > 0) {
        diagram.model.removeLinkDataCollection(toLinkData)
      }
      diagram.model.removeNodeData(targetNode)
    }
  }

  /**
   * 创建Go图表实例 (Gojs 基本配置)
   * @desc 内含 go.Diagram 配置 / 连线模板
   * @return {go.diagram} Go图表实例diagram
   */
  makeDiagram() {
    let self = this,
      maker = this.maker,
      diagram = maker(go.Diagram, self.goBoxId, {
        initialAutoScale: go.Diagram.UniformToFill, // 初始自动缩放到合适画布
        // initialContentAlignment: go.Spot.Center, // 元素基准点(当前为canvas中心)
        contentAlignment: go.Spot.Center,
        allowDrop: true, // must be true to accept drops from the Palette
        isReadOnly: self.readOnly, // 是否只读
        // allowSelect: self.readOnly === false,
        //   allowDelete: false,
        allowCopy: false,
        allowZoom: self.allowZoom, // 是否允许缩放
        'undoManager.isEnabled': true, // 是否开启 Ctrl-Z Ctrl-Y 前进后退操作
        // 鼠标滑轮操作缩放
        'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
        'commandHandler.copiesTree': true,
        'commandHandler.deletesTree': true,
        // 'draggingTool.dragsTree': true,
        SelectionMoved: function (e) {
          // 当拖出画布之外,回弹重新布局
          // e.diagram.layout.invalidateLayout();
        },

        click: function (e) { // 绘图背影板点击事件
          e.diagram.startTransaction('clear');
          // 清除所有高亮显示(取消选中效果)
          e.diagram.clearHighlighteds();
          e.diagram.commitTransaction('clear');
          // 清空路径
          e.diagram.model.modelData.analysisRoute = [];
          self.makerClickEvent(e)
        },
        // allowDrop: true,  // must be true to accept drops from the Palette
        'mouseHold': function (inputEvent) {
          // let e = inputEvent.event
          // console.log(e.layerX, e.layerY)
        },
        'LinkDrawn': function (e) {
          if(self.ops.linkDrawnEvent) {
            self.ops.linkDrawnEvent(e)
          }
        },
        'LinkRelinked': function () {

        }
      })

    // 拖动过程中是否实时刷新layout
    if(this.draggingInitLayout) {
      diagram.toolManager.draggingTool.doMouseMove = function () {
        go.DraggingTool.prototype.doMouseMove.call(this);
        if(this.isActive) {
          this.diagram.layout.invalidateLayout();
        }
      }
    }

    diagram = self.makeNodeTemplateMap(diagram)
    diagram = self.makeLinkTemplateMap(diagram)

    return diagram
  }

  /**
   * 生成节点模板
   * @param  {go.diagram} [diagram={}] Go图表实例
   * @return {go.diagram}            处理完后的Go图表实例
   */
  makeNodeTemplateMap(diagram = {}) {
    let self = this,
      nodeCreator = new Nodes(),
      maker = this.maker,
      nodeHandle = { // 传入节点对象
        wrapOpenEvent: this.wrapOpenEvent,
        wrapFoldEvent: this.wrapFoldEvent,
        nodeMenu: null,
        click: this.nodeClickEvent,
        doubleClick: this.nodeDoubleClickEvent,
        contextMenuEvent: this.contextMenuEvent
      }

    /**
     * contextMenu: { // 节点右键
     *   element:  //右键菜单，传入节点DOM，必填
     *   event: (obj, diagram, tool) => {} // 回调事件  (上下文菜单GraphObject,显示工具提示的GraphObject)
     *   }
     */
    if(this.contextMenu !== '') { // 判断是否存在，界面鼠标右键菜单
      nodeHandle.nodeMenu = maker(go.HTMLInfo, {
        show: this.contextMenu.event,
        mainElement: this.contextMenu.element
      })
      this.contextMenu.element.addEventListener('contextmenu', e => {
        e.preventDefault()
        return false
      }, false)
    }

    // 默认节点模板
    diagram.nodeTemplateMap.add('base', nodeCreator.baseNode())

    // 根节点模板
    diagram.nodeTemplateMap.add('main', nodeCreator.mainNode(self.readOnly, function (e, obj) {
      self.addSubNode(e, obj)
    }))
    // 子节点模板
    diagram.nodeTemplateMap.add('sub', nodeCreator.subNode(self.readOnly, function (e, obj) {
      self.addSubNode(e, obj)
    }, function (e, obj) {
      self.removeNode(obj.part.data.key)
    }))

    // 链路节点模板
    diagram.nodeTemplateMap.add('linkEnterNode', nodeCreator.linkEnterNode(self.readOnly))
    diagram.nodeTemplateMap.add('linkNode', nodeCreator.linkNode(self.readOnly, function (e, obj) {
      self.linkNodeClickEvent(e, obj)
    }))
    // diagram.nodeTemplateMap.add('linkSubNode', nodeCreator.linkSubNode(self.readOnly))

    // 默认（未知类型）节点模板
    diagram.nodeTemplateMap.add('default', nodeCreator.defaultNode(nodeHandle))

    // 人员节点模板
    diagram.nodeTemplateMap.add('person', nodeCreator.userNode(nodeHandle))

    // 电话节点模板
    diagram.nodeTemplateMap.add('tel', nodeCreator.telNode(nodeHandle))

    // 车辆节点模板
    diagram.nodeTemplateMap.add('car', nodeCreator.carNode(nodeHandle))

    // 打包数据节点模板
    diagram.nodeTemplateMap.add('dataPack', nodeCreator.dataPackNode(nodeHandle))

    // 银行卡节点模板
    diagram.nodeTemplateMap.add('bankcard', nodeCreator.bankCardNode(nodeHandle))

    // 案件节点模板
    diagram.nodeTemplateMap.add('case', nodeCreator.caseNode(nodeHandle))

    // 单位节点模板
    diagram.nodeTemplateMap.add('place', nodeCreator.placeNode(nodeHandle))

    return diagram
  }

  /**
   * 生成连线模板
   * @param  {go.diagram} [diagram={}] Go图表实例
   * @return {go.diagram}              处理完后的Go图表实例
   */
  makeLinkTemplateMap(diagram = {}) {
    let maker = this.maker

    diagram.linkTemplate = maker(
      go.Link, {
        visible: true,
        curve: go.Link.Bezier, // 弧线转弯
        adjusting: go.Link.Stretch,
        //   routing: go.Link.Orthogonal, // 直角转弯(好羞)
        corner: 5, // 圆角
        reshapable: false,
        // relinkableFrom: true,
        // relinkableTo: true,
        toShortLength: 3,
        click: (e, obj) => {
          this.ops.lineClickEvent(e, obj)
        },
        contextClick: (e, obj) => {
          this.ops.lineContextMenuEvent(e, obj)
        }
      },
      new go.Binding('curviness'),
      new go.Binding('visible').makeTwoWay(),
      // 线条
      maker(
        go.Shape, {
          stroke: '',
          strokeWidth: 2
        },
        new go.Binding('stroke', 'color'),
        new go.Binding('strokeWidth', 'isHighlighted',
          h => {
            return h ? 4 : 2;
          }).ofObject()
      ),

      // 线条指向的箭头
      maker(
        go.Shape, {
          toArrow: 'Standard',
          stroke: null,
          fill: '#67839c',
          strokeWidth: 2
        },
        new go.Binding('fill', 'color')
      ),

      // 线条文字块
      maker(go.Panel,
        'Auto', {
          visible: true,
          name: 'LABEL'
          // ,
          // segmentIndex: 2,
          // segmentFraction: 0.5
        },
        new go.Binding('visible', 'visible').makeTwoWay(),
        // 线条上的文字背景
        maker(
          go.Shape, 'Rectangle', {
            fill: '#8bc63a',
            stroke: null
          },
          new go.Binding('fill', 'color')),
        // 线条上的文字样式
        maker(
          go.TextBlock, '', { // transition
            textAlign: 'center',
            font: '12px helvetica, arial, sans-serif',
            stroke: '#fff',
            text: '点击输入',
            margin: 4,
            maxLines: 3,
            editable: true
          },
          new go.Binding('text').makeTwoWay()
        ),
        new go.Binding('visible').makeTwoWay()
      )
    )
    return diagram
  }

  /**
   * 设置布局
   * @param {String} [mode=''] 布局(layout), 参考 getLayout
   */
  setLayout(mode = '') {
    // 布局
    this.diagram.layout = this.getLayout(mode)
    // 缩略图
    if(this.overview !== '' && this.overviewObj === null && document.getElementById(this.overview)) {
      this.overviewObj = this.maker(go.Overview, this.overview, {
        observed: this.diagram,
        contentAlignment: go.Spot.Center
      })
    }
    this.reload()
  }

  /**
   * 获取布局对象
   * layout:
   *    GridLayout 网格布局,
   *    ForceDirectedLayout 反牵引力布局,
   *    CircularLayout 圆形布局,
   *    LayeredDigraphLayout 分层布局,
   *    TreeLayout 树形布局
   * @param  {String} [mode=''] 布局(layout)
   * @return {Object}         Go布局对象
   */
  getLayout(mode = '') {
    let res
    switch(mode) {
      case 'GridLayout':
        console.log(this.diagram.model.nodeDataArray.length)
        let columns = Math.floor(Math.sqrt(this.diagram.model.nodeDataArray.length))
        res = this.maker(go.GridLayout, { wrappingColumn: columns, spacing: new go.Size(50, 50) })
        break;
      case 'LayeredDigraphLayout':
        res = this.maker(go.LayeredDigraphLayout, {
          direction: 90,
          layerSpacing: 80,
          columnSpacing: 15,
          setsPortSpots: false
        })
        break;
      case 'CircularLayout':
        res = this.maker(go.CircularLayout, {})
        break;
      case 'TreeLayout':
        res = this.maker(go.TreeLayout, {})
        break;
      default:
        res = this.maker(go.ForceDirectedLayout, {
          defaultSpringLength: 10,
          defaultElectricalCharge: 50,
          defaultSpringStiffness: 0.01
        })
    }
    return res
  }

  /**
   * 生成节点连接点(绘点)
   * @param  {String}  [name='']      绘点名称
   * @param  {Object}  [spot={}]      连细绘点
   * @param  {Boolean} [output=false] 声明用户是否可以从外部引入链接
   * @param  {Boolean} [input=false]  声明用户是否可以绘制链接
   * @return {go.Shape}               Go布局对象
   */
  makePort(name = '', spot = {}, output = false, input = false) {
    // the port is basically just a small circle that has a white stroke when it is made visible
    return this.maker(go.Shape, 'Circle', {
      fill: 'transparent',
      stroke: null, // this is changed to 'white' in the showPorts function
      desiredSize: new go.Size(8, 8),
      alignment: spot,
      alignmentFocus: spot, // align the port on the main Shape
      portId: name, // declare this object to be a 'port'
      fromSpot: spot,
      toSpot: spot, // declare where links may connect at this port
      fromLinkable: output,
      toLinkable: input, // declare whether the user may draw links to/from here
      cursor: 'pointer' // show a different cursor to indicate potential link point
    })
  }

  /**
   * 数据节点, 鼠标事件
   * @desc 内部包含点击/经过 等事件
   * @param  {Boolean} [center=false] 触发点是否为节点中心点
   * @return {Object}                 goEvent事件对象
   */
  nodeMouseEvent(center = false) {
    let self = this,
      eventObj
    if(self.readOnly === true) {
      eventObj = {}
    } else {
      eventObj = {
        click(e, obj) {
          if(self.ops.nodeOnClickEvent) self.ops.nodeOnClickEvent(e, obj)
        },
        mouseEnter(e, obj) {
          self.showPorts(obj.part, true)
          e.diagram.model.setDataProperty(obj.part.data, 'showBtn', true)
        },
        mouseLeave(e, obj) {
          self.showPorts(obj.part, false)
          e.diagram.model.setDataProperty(obj.part.data, 'showBtn', false)
        }
      }
      if(center === true) {
        eventObj.locationSpot = go.Spot.Center
      }
    }
    return eventObj
  }

  /**
   * 显示隐藏节点链接点
   * @param  {Object} node 目标节点对象
   * @param  {Boolean} show 是否显示
   */
  showPorts(node, show) {
    let diagram = node.diagram
    if(!diagram || diagram.isReadOnly || !diagram.allowLink) return
    node.ports.each(function (port) {
      port.stroke = (show ? 'white' : null)
    })
  }

  /**
   * 节点样式
   * @return {Array} GO节点样式数组
   */
  nodeStyle() {
    return [
      // The Node.location comes from the "loc" property of the node data,
      // converted by the Point.parse static method.
      // If the Node.location is changed, it updates the "loc" property of the node data,
      // converting back using the Point.stringify static method.
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify), {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center,
        // isShadowed: true,
        // shadowColor: "#888",
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter: function (e, obj) {
          this.showPorts(obj.part, true)
        },
        mouseLeave: function (e, obj) {
          this.showPorts(obj.part, false)
        }
      }
    ]
  }

  /**
   * 随机唯一颜色
   * @desc 随机生成指定明度范围内的颜色, 基于css3 hsl
   * @param  {Number} [randomVal=360]            随机阀值
   * @param  {Array}  [lightness=['100%','30%']] 明度限制
   * @return {String} 随机结果颜色码(hsl)
   */
  getOnlyColor(randomVal = 360, lightness = ['100%', '30%']) {
    return `hsl(${(Math.random() * 360)},${lightness[0]},${lightness[1]})`
  }

  /**
   * 刷新模型
   */
  reload() {
    this.diagram.model = go.Model.fromJson(this.diagram.model.toJson())
  }
}
export { NgwGo }
