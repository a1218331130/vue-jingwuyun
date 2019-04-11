// 加载gojs
import go from 'gojs'
/**
 * NgwGo GoJS 节点模板类
 */
class NgwGoNode {
  /**
   * 构建函数
   * @constructs
   */
  constructor(options) {
    this.maker = go.GraphObject.make
    // 默认颜色
    this.defaultColor = '#b8f5ff'
    // 突出颜色
    this.highlightColor = 'orange' // '#48a3fc'
    // nodeType 节点类型对应默认图标表维护
    this.nodeType = {
      default: '\uE6DE', // 默认
      dataPack: '\uE608', // 打包数据
      user: '\uE638', // 证件号码/头像
      register: '\uE620', // 户口
      passport: '\uE640', // 护照
      tel: '\uE7DD', // 电话
      licensePlate: '\uE67B', // 车牌
      car: '\uE656', // 车辆
      case: '\uE621', // 案件
      place: '\uE605', // 单位/场所
      bankcard: '\uE678', // 银行卡
      hotel: '\uE67A', // 酒店
      netbar: '\uE7C0', // 网吧
      railway: '\uE63C', // 铁路
      flight: '\uE659' // 航班
    }
  }

  /**
   *  测试节点模板
   * @return {Object} [节点模板对象]
   */
  testNode() {
    let maker = this.maker
    return maker(go.Node,
      'Horizontal', {
        selectionAdorned: false,
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: 'SHAPE',
        click(e, node) {
          console.log('点击事件:', e, node);
        },
        mouseEnter: function (e, node) {

        },
        mouseLeave: function (e, node) {

        }
      },
      new go.Binding('text', 'text'), // for sorting the nodes
      maker(go.Shape,
        'Ellipse', {
          name: 'SHAPE',
          fill: 'lightgray', // default value, but also data-bound
          stroke: 'transparent', // modified by highlighting
          strokeWidth: 5,
          desiredSize: new go.Size(80, 80),
          portId: ''
        }, // so links will go to the shape, not the whole node
        new go.Binding('fill', 'color')),

      // 定义图标父级面板, 用于定位
      maker(go.Panel,
        go.Panel.Vertical, {
          alignment: new go.Spot(100, 0, -72, 10)
        },
        // 图标
        maker(go.TextBlock, '\uE62d', {
          font: 'bold 60px "iconfont"',
          stroke: 'whitesmoke',
          wrap: go.TextBlock.OverflowEllipsis,
          editable: false,
          width: 60,
          textAlign: 'center'
        })
      ),

      // 定义手机号码父级面板, 用于定位
      maker(go.Panel,
        go.Panel.Vertical, {
          alignment: new go.Spot(0, 0, -50, 35)
        },
        // 手机号码
        maker(go.TextBlock, { name: 'TEXTBLOCK' }, // for search
          new go.Binding('text', 'text'))
      )
    )
  }

  /**
   * 核心根节点
   * @param  {Boolean} readOnly 是否只读
   * @param  {Function} addEvent 添加节点事件回调
   * @return {go.Node} Gojs Node Object
   */
  mainNode(readOnly, addEvent = function () {}) {
    let maker = this.maker
    return maker(go.Node,
      'Spot', {
        selectionAdorned: false,
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: 'SHAPE',
        click(e, node) {
          // console.log('点击事件:', e, node);
        },
        mouseEnter: function (e, node) {
          // console.log('进入事件:', e, node);
        },
        mouseLeave: function (e, node) {

        }
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

      maker(
        go.Panel, 'Auto', {
          margin: 0
        },
        maker(go.Shape,
          'RoundedRectangle', {
            fill: '#74a1c0',
            height: 38,
            stroke: null
          },
          new go.Binding('fill', '背景')
        ),

        maker(go.Panel,
          go.Panel.Horizontal, {
            alignment: new go.Spot(0, 0, 0, 0)
          },

          // 文本区
          maker(go.Panel,
            go.Panel.Vertical, {
              alignment: this.checkBowserType() ? new go.Spot(0, 0, 0, -3) : go.Spot.Center
            },
            maker(
              go.TextBlock, {
                stroke: '#fff',
                textAlign: 'center',
                verticalAlignment: go.Spot.Center,
                height: 30,
                margin: 5,
                wrap: go.TextBlock.OverflowEllipsis,
                editable: false
              },
              new go.Binding('text', 'text').makeTwoWay(),
              new go.Binding('stroke', '文字'))
          ),

          // 按钮区
          maker(
            go.Panel, go.Panel.Horizontal, {
              alignment: new go.Spot(0, 0, 0, 3),
              height: 30,
              visible: !readOnly
            },
            // new go.Binding('visible', 'showBtn'),
            // 添加子节点按钮
            maker(go.TextBlock, '\uE646', {
              font: '16px "iconfont"',
              stroke: '#fff',
              wrap: go.TextBlock.OverflowEllipsis,
              editable: false,
              width: 30,
              cursor: 'pointer',
              textAlign: 'center',
              click: function (e, obj) {
                addEvent(e, obj)
              }
            }, new go.Binding('stroke', '文字'))
          )
        )

      )
    )
  }
  /**
   * 核心子节点
   * @param  {Boolean} readOnly 是否只读
   * @param  {Function} addEvent 添加节点事件回调
   * @param  {Function} removeEvent 删除节点事件回调
   * @return {go.Node} Gojs Node Object
   */
  subNode(readOnly, addEvent = function () {}, removeEvent = function () {}) {
    let maker = this.maker
    return maker(go.Node,
      'Spot', {
        selectionAdorned: false,
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: 'SHAPE',
        click(e, node) {
          // console.log('点击事件:', e, node);
        },
        mouseEnter: function (e, node) {
          // console.log('进入事件:', e, node);
        },
        mouseLeave: function (e, node) {

        }
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

      maker(
        go.Panel, 'Auto', {
          margin: 0
        },
        maker(go.Shape,
          'RoundedRectangle', {
            fill: '#eef4f4',
            height: 22,
            stroke: '#869bac'
          },
          new go.Binding('fill', '背景')
        ),

        maker(go.Panel,
          go.Panel.Horizontal, {
            alignment: new go.Spot(0, 0, 0, 0)
          },

          // 文本区
          maker(go.Panel,
            go.Panel.Vertical, {
              alignment: this.checkBowserType() ? new go.Spot(0, 0, 0, -3) : new go.Spot(0, 0, 0, 1)
            },
            maker(
              go.TextBlock, {
                stroke: '#666',
                textAlign: 'center',
                verticalAlignment: go.Spot.Center,
                margin: 5,
                wrap: go.TextBlock.OverflowEllipsis,
                editable: true
              },
              new go.Binding('text', 'text').makeTwoWay(),
              new go.Binding('stroke', '文字'))
          ),

          // 按钮区
          maker(
            go.Panel, go.Panel.Horizontal, {
              alignment: this.checkBowserType() ? new go.Spot(0, 0, 0, 0) : new go.Spot(0, 0, 0, 5),
              visible: !readOnly
            },
            // new go.Binding('visible', 'showBtn'),
            // 添加子节点按钮
            maker(go.TextBlock, '\uE646', {
              font: 'bold 16px "iconfont"',
              stroke: '#666',
              wrap: go.TextBlock.OverflowEllipsis,
              editable: false,
              width: 20,
              cursor: 'pointer',
              textAlign: 'center',
              click: function (e, obj) {
                addEvent(e, obj)
              }
            }, new go.Binding('stroke', '文字')),

            // 删除节点按钮
            maker(go.TextBlock, '\uE738', {
              font: 'bold 16px "iconfont"',
              stroke: '#666',
              wrap: go.TextBlock.OverflowEllipsis,
              editable: false,
              width: 20,
              cursor: 'pointer',
              textAlign: 'center',
              click: function (e, obj) {
                removeEvent(e, obj)
              }
            }, new go.Binding('stroke', '文字'))
          )
        )
      )
    )
  }

  /**
   * [linkEnterNode description]
   * @param  {Boolean} readOnly 是否只读
   * @return {go.Node} Gojs Node Object
   */
  linkEnterNode(readOnly) {
    let maker = this.maker
    return maker(go.Node,
      'Spot', {
        selectionAdorned: false,
        locationSpot: go.Spot.Center,
        locationObjectName: 'SHAPE'
      },

      maker(go.Panel, 'Auto', { name: 'BOX' },
        // 基本圈
        maker(go.Panel, go.Panel.Vertical, { name: 'BASE_CIRCLE', alignment: go.Spot.Top },
          maker(
            go.Shape, 'Circle', {
              width: 56,
              height: 56,
              fill: '#dfefff',
              stroke: '#93d4ff',
              strokeWidth: 1
            }
          )
        ),

        maker(go.Panel, 'Spot', { name: 'ICON', isClipping: true, scale: 1, alignment: new go.Spot(0, 0, 1, 23) },
          maker(go.TextBlock, '\uE6c0', {
            font: 'bold 40px "iconfont"',
            stroke: '#62bfff',
            wrap: go.TextBlock.OverflowEllipsis,
            editable: false,
            width: 56,
            textAlign: 'center'
          })
        )
      )
    )
  }

  /**
   * [description]
   * @param  {Boolean} readOnly 是否只读
   * @param  {Function} clickEvent 点击节点事件回调
   * @return {go.Node} Gojs Node Object
   */
  linkNode(readOnly, clickEvent = function () {}) {
    let maker = this.maker
    return maker(go.Node,
      'Spot', {
        selectionAdorned: false,
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: 'SHAPE',
        click(e, node) {
          node.diagram.clearHighlighteds()
          node.isHighlighted = true
          clickEvent(e, node)
        }
      },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),

      maker(
        go.Panel, 'Auto', {
          margin: 0
        },
        maker(go.Shape,
          'RoundedRectangle', {
            fill: '#dfefff',
            height: 44,
            stroke: '#7ecbff'
          },
          new go.Binding('fill', 'isHighlighted',
            h => {
              return h === true ? '#dfefff' : '#f2f2f2';
            }
          ).ofObject()
          // ,
          // new go.Binding('height', 'isHighlighted',
          //   h => {
          //     return h === true ? 50 : 44;
          //   }).ofObject()
        ),

        maker(go.Panel,
          go.Panel.Horizontal, {
            alignment: new go.Spot(0, 0, 0, 0)
          },

          // 文本区
          maker(go.Panel,
            go.Panel.Vertical, {
              alignment: new go.Spot(0, 0, 0, 13)
            },
            maker(
              go.TextBlock, {
                stroke: '#53a9ff',
                textAlign: 'center',
                height: 30,
                margin: 5,
                wrap: go.TextBlock.OverflowEllipsis,
                editable: false
              },
              new go.Binding('text', 'text').makeTwoWay())
          )
        )

      )
    )
  }

  /**
   * 基础节点
   * @return {go.Node} Gojs Node Object
   */
  baseNode() {
    let maker = this.maker
    return maker(go.Node,
      'Horizontal', {
        selectionAdorned: false,
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: 'SHAPE',
        click(e, node) {
          console.log('点击事件:', e, node);
        },
        mouseEnter: function (e, node) {

        },
        mouseLeave: function (e, node) {

        }
      },
      new go.Binding('text', 'text'), // for sorting the nodes
      maker(go.Shape,
        'Ellipse', {
          name: 'SHAPE',
          fill: 'lightgray', // default value, but also data-bound
          stroke: 'transparent', // modified by highlighting
          strokeWidth: 5,
          desiredSize: new go.Size(80, 80),
          portId: ''
        }, // so links will go to the shape, not the whole node
        new go.Binding('fill', 'color')),

      // 定义图标父级面板, 用于定位
      maker(go.Panel,
        go.Panel.Vertical, {
          alignment: new go.Spot(100, 0, -72, 10)
        },
        // 图标
        maker(go.TextBlock, '\uE62d', {
          font: 'bold 60px "iconfont"',
          stroke: 'whitesmoke',
          wrap: go.TextBlock.OverflowEllipsis,
          editable: false,
          width: 60,
          textAlign: 'center'
        })
      ),

      // 定义手机号码父级面板, 用于定位
      maker(go.Panel,
        go.Panel.Vertical, {
          alignment: new go.Spot(0, 0, -50, 35)
        },
        // 手机号码
        maker(go.TextBlock, { name: 'TEXTBLOCK' }, // for search
          new go.Binding('text', 'text'))
      )
    )
  }

  /**
   * 默认节点模板
   * @param {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  defaultNode(parametes = {}) {
    return this.commonNode('default', parametes)
  }

  /**
   * 人员节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  userNode(parametes = {}) {
    return this.commonNode('user', parametes)
  }

  /**
   * 电话节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  telNode(parametes = {}) {
    return this.commonNode('tel', parametes)
  }

  /**
   * 车辆节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  carNode(parametes = {}) {
    return this.commonNode('car', parametes)
  }

  /**
   * 打包数据节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  dataPackNode(parametes = {}) {
    return this.commonNode('dataPack', parametes)
  }

  /**
   * 银行卡节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  bankCardNode(parametes = {}) {
    return this.commonNode('bankcard', parametes)
  }

  /**
   * 案件节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  caseNode(parametes = {}) {
    return this.commonNode('case', parametes)
  }

  /**
   * 单位节点模板
   * @param  {Object} [parametes={}] 标准Go节点数据对象
   * @return {go.Node} Gojs Node Object
   */
  placeNode(parametes = {}) {
    return this.commonNode('place', parametes)
  }

  /**
   * 生成节点连接点
   * @param  {String} name   连接点名称
   * @param  {go.Spot} spot   定位
   * @param  {Boolean} output 是否允许往外连线
   * @param  {Boolean} input  是否接收外来连线
   * @param  {Number} size  尺寸
   * @return {go.Shape}      Gojs建模对象
   */
  makePort(name, spot, output, input, size = 50) {
    // the port is basically just a small circle that has a white stroke when it is made visible
    return this.maker(go.Shape, 'Circle', {
      fill: 'transparent',
      stroke: null, // this is changed to 'white' in the showPorts function
      desiredSize: name === 'C' ? new go.Size(size, size) : new go.Size(8, 8),
      alignment: spot,
      alignmentFocus: spot, // align the port on the main Shape
      portId: name, // declare this object to be a 'port'
      fromSpot: spot,
      toSpot: spot, // declare where links may connect at this port
      fromLinkable: output,
      toLinkable: input, // declare whether the user may draw links to/from here
      cursor: 'pointer' // show a different cursor to indicate potential link point
    });
  }

  /**
   * 显示节点链接点
   * @param  {go.Node} node 目标节点
   * @param  {Boolean} show true:显示, false: 不显示
   */
  showPorts(node, show) {
    var diagram = node.diagram;
    if(!diagram || diagram.isReadOnly || !diagram.allowLink) return;
    node.ports.each(function (port) {
      port.stroke = (show ? 'white' : null);
    });
  }

  /**
   * 通用节点创建方法
   * @param  {String} typeNode  节点类型
   * @param  {Object} parametes 标准Go节点数据对象
   * @return {go.Node}          Gojs Node 模型
   */
  commonNode(typeNode, parametes) {
    let self = this,
      maker = this.maker,
      baseSize = 50;
    // 展开按钮
    let wrapBtn = maker(go.Panel, 'Spot', { name: 'WRAP_BUTTON', alignment: new go.Spot(0, 0, 0, 0) },
      maker(go.TextBlock, '\uE646', {
        font: '16px "iconfont"',
        stroke: 'yellow',
        wrap: go.TextBlock.OverflowEllipsis,
        editable: false,
        width: 60,
        cursor: 'pointer',
        textAlign: 'right',
        click: function (el, obj) {
          parametes.wrapOpenEvent(el, obj)
        }
      }, new go.Binding('visible', 'wrapStatus', n => { return n === 'fold' })),
      maker(go.TextBlock, '\uE675', {
        font: '16px "iconfont"',
        stroke: 'yellow',
        wrap: go.TextBlock.OverflowEllipsis,
        editable: false,
        width: 60,
        cursor: 'pointer',
        textAlign: 'right',
        click: function (el, obj) {
          parametes.wrapFoldEvent(el, obj)
        }
      }, new go.Binding('visible', 'wrapStatus', n => { return n === 'open' }))
    )
    // 中心默认填充类型维护 默认填充相应的字体图标
    let centerFill = maker(go.TextBlock, this.nodeType[typeNode], {
      font: 'bold 36px "iconfont"',
      stroke: '#bbb',
      width: baseSize,
      wrap: go.TextBlock.OverflowEllipsis,
      editable: false,
      textAlign: 'center',
      verticalAlignment: go.Spot.Bottom
    });

    // 用户类型
    if(typeNode === 'user') {
      centerFill = maker(go.Picture, this.nodeType[typeNode], {
        background: 'transparent',
        width: baseSize,
        height: baseSize,
        sourceCrossOrigin: function () { return 'anonymous' },
        errorFunction: (picture, e) => {
          picture.source = '/static/img/default_person.jpg'
        }
        // source: '/static/img/default_person.jpg'
      }, new go.Binding('source', 'source'))
    }
    // console.log(centerFill);
    return maker(go.Node,
      'Vertical', {
        visible: true,
        selectionAdorned: false,
        locationSpot: go.Spot.Center, // Node.location is the center of the Shape
        locationObjectName: 'OBJECT',
        contextMenu: parametes.nodeMenu, //  界面鼠标右键点击事件
        contextClick: parametes.contextMenuEvent || function () {}, // 节点鼠标右键点击事件
        click(e, node) {
          parametes.click(e, node)
        },
        doubleClick(e, node) {
          parametes.doubleClick(e, node)
        },
        mouseEnter(e, node) {
          self.showPorts(node.part, true)
          node.diagram.clearHighlighteds()
          node.linksConnected.each(L => {
            L.isHighlighted = true;
            if(L.fromNode) {
              L.fromNode.isHighlighted = true;
            }
            if(L.toNode) {
              L.toNode.isHighlighted = true;
            }
          })
          node.isHighlighted = true;
        },
        mouseLeave(e, node) {
          self.showPorts(node.part, false)
          let diagram = node.diagram;
          diagram.clearHighlighteds()
          // 节点查找关系，如果正在查找，不取消高亮
          let minPath = node.diagram.model.modelData.analysisRoute;
          if(minPath && minPath.length > 1) {
            // 分析路径中有数据时，路径高亮
            for(let i = 0; i < minPath.length - 1; i++) {
              let node1 = diagram.findNodeForKey(minPath[i]);
              let node2 = diagram.findNodeForKey(minPath[i + 1]);
              node1.isHighlighted = true;
              node2.isHighlighted = true;
              let links = node1.findLinksBetween(node2);
              links.each(r => {
                r.isHighlighted = true;
              })
            }
          } else if(minPath && minPath.length === 1) {
            // 选中一个节点时，节点高亮
            let node1 = diagram.findNodeForKey(minPath[0]);
            node1.isHighlighted = true;
          }
        }
      },
      new go.Binding('visible').makeTwoWay(),
      maker(go.Panel, 'Auto', { name: 'BOX' },

        // 基本圈
        maker(go.Panel, go.Panel.Vertical, { name: 'BASE_CIRCLE', alignment: go.Spot.Top },
          maker(
            go.Shape, 'Circle', {
              width: baseSize,
              height: baseSize,
              fill: '#fff',
              stroke: this.defaultColor,
              strokeWidth: 5
            },
            new go.Binding('stroke', 'isHighlighted',
              h => {
                return h === true ? this.highlightColor : this.defaultColor;
              }
            ).ofObject()
          )
        ),

        // 命中圈
        maker(go.Panel, 'Spot', { name: 'HIT_CIRCLE', alignment: go.Spot.Center },
          maker(
            go.Shape, 'Circle', {
              width: baseSize,
              height: baseSize,
              fill: 'transparent',
              stroke: 'orange', // '#5c92fa'
              strokeWidth: 5,
              visible: false
            },
            new go.Binding('visible', 'isHit')
          )
        ),

        // 头像
        maker(go.Panel, 'Spot', { name: 'ICON', isClipping: true, scale: 1, alignment: (!this.checkBowserType() && typeNode !== 'user') ? new go.Spot(0, 0, 5, 21) : go.Spot.Center },
          maker(go.Shape, 'Circle', {
            width: baseSize,
            height: baseSize,
            fill: 'transparent',
            stroke: 'transparent'
          }),
          centerFill // 中心填充图像类别
        ),
        wrapBtn,
        // 连线点
        this.makePort('B', go.Spot.Bottom, true, true, 20)
      ),
      // 文字
      maker(go.Panel, 'Auto', { name: 'CONTENTBOX' },
        maker(
          go.TextBlock, '无', {
            name: 'TEXTBLOCK',
            // width: 10,
            margin: 10,
            textAlign: 'center'
            // overflow: TextBlock.OverflowEllipsis,
            // editable: true
          },
          new go.Binding('text', 'text'),
          new go.Binding('stroke', 'color')
        )
      )
    )
  }

  /**
   * 检查游戏器版本对GOJS兼容性
   * @desc 解决文字没有上下居中
   * @return {Boolean} 检查结果, true: 52及以上chrome, false:52以下或非chrome
   */
  checkBowserType() {
    var agent = navigator.userAgent.toLowerCase(),
      regChrome = /chrome\/[\d.]+/gi
    if(agent.indexOf('chrome') !== -1 && parseInt((agent.match(regChrome))[0].split('/')[1].split('.')[0]) >= 52) {
      return true
    } else {
      return false
    }
  }
}
export default NgwGoNode
