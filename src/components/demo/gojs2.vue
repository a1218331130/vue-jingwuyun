<template>
<div slot="center">
  <el-row>
    <el-col id="testGoBox" class="canvas-board" :span="24"></el-col>
    <div id="testGoBoxOverview" class="overview-box"></div>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
.canvas-board {
    background: #fff;
    width: 100%;
    height: 600px;
    border: 0;
    overflow: hidden;
}

.overview-box {
    position: absolute;
    width: 200px;
    height: 100px;
    bottom: 10px;
    right: 10px;
    background-color: aliceblue;
    z-index: 300;
    border: 0;
}
</style>

<script>
import go from 'gojs'
export default {
  data: function() {
    return {
      arr: ['13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403', '13548759403',
        '13548759403', '13548759403'
      ]
    }
  },
  computed: {},
  methods: {
    //   continuousForceDirectedLayout(){
    //         // This variation on ForceDirectedLayout does not move any selected Nodes
    //         // but does move all other nodes (vertexes).
    //         function ContinuousForceDirectedLayout() {
    //           go.ForceDirectedLayout.call(this);
    //           this._isObserving = false;
    //         }
    //         go.Diagram.inherit(ContinuousForceDirectedLayout, go.ForceDirectedLayout);
    //
    //         /** @override */
    //         ContinuousForceDirectedLayout.prototype.isFixed = function(v) {
    //           return v.node.isSelected;
    //         }
    //
    //         // optimization: reuse the ForceDirectedNetwork rather than re-create it each time
    //         /** @override */
    //         ContinuousForceDirectedLayout.prototype.doLayout = function(coll) {
    //           if (!this._isObserving) {
    //             this._isObserving = true;
    //             // cacheing the network means we need to recreate it if nodes or links have been added or removed or relinked,
    //             // so we need to track structural model changes to discard the saved network.
    //             var lay = this;
    //             this.diagram.addModelChangedListener(function (e) {
    //               // modelChanges include a few cases that we don't actually care about, such as
    //               // 'nodeCategory' or 'linkToPortId', but we'll go ahead and recreate the network anyway.
    //               // Also clear the network when replacing the model.
    //               if (e.modelChange !== '' ||
    //                   (e.change === go.ChangedEvent.Transaction && e.propertyName === 'StartingFirstTransaction')) {
    //                 lay.network = null;
    //               }
    //             });
    //           }
    //           var net = this.network;
    //           if (net === null) {  // the first time, just create the network as normal
    //             this.network = net = this.makeNetwork(coll);
    //           } else {  // but on reuse we need to update the LayoutVertex.bounds for selected nodes
    //             this.diagram.nodes.each(function (n) {
    //               var v = net.findVertex(n);
    //               if (v !== null) v.bounds = n.actualBounds;
    //             });
    //           }
    //           // now perform the normal layout
    //           go.ForceDirectedLayout.prototype.doLayout.call(this, coll);
    //           // doLayout normally discards the LayoutNetwork by setting Layout.network to null;
    //           // here we remember it for next time
    //           this.network = net;
    //         }
    //         // end ContinuousForceDirectedLayout
    //   }
  },
  components: {
    go
  },
  mounted: function() {
    let myDiagram, myOverview, self = this

    init()

    // 定义边框/连线 颜色
    let highlightColor = 'orange'

    function init() {
      let mainGo = go.GraphObject.make; // 初始化GO实例

      // 定义GO对象
      myDiagram = mainGo(go.Diagram, 'testGoBox', // 绑定绘图DIV
        {
          initialAutoScale: go.Diagram.Uniform,
          padding: 10,
          contentAlignment: go.Spot.Center,
          // 布局(layout):
          // ForceDirectedLayout 反牵引力
          // CircularLayout 圆形
          // TreeLayout 树形
          layout: mainGo(go.ForceDirectedLayout, {
            defaultSpringLength: 10,
            defaultElectricalCharge: 50,
            defaultSpringStiffness: 0.01
          }),
          //   toolManager.draggingTool.doMouseMove() {
          //     go.DraggingTool.prototype, doMouseMove.call(this)
          //     if (this.isActive) {
          //       this.myDiagram.layout.invalidateLayout()
          //     }
          //   },
          // isReadOnly: true, // 是否只读
          click: function(e) { // 绘图背影板点击事件
            e.diagram.startTransaction('clear');
            // 清除所有高亮显示(取消选中效果)
            // e.diagram.clearHighlighteds();
            e.diagram.commitTransaction('clear');
          }
        });

      //   绑定右下预览小窗口
      myOverview = mainGo(go.Overview, 'testGoBoxOverview', { observed: myDiagram, contentAlignment: go.Spot.Center });
      console.log(myOverview);

      // 定义节点模板
      myDiagram.nodeTemplate =
        mainGo(go.Node,
          'Horizontal', {
            selectionAdorned: false,
            locationSpot: go.Spot.Center, // Node.location is the center of the Shape
            locationObjectName: 'SHAPE',
            click(e, node) {
              console.log('点击事件:', e, node);
            },
            mouseEnter: function(e, node) {
              node.diagram.clearHighlighteds();
              node.linksConnected.each(function(l) { highlightLink(l, true); });
              node.isHighlighted = true;
              let tb = node.findObject('TEXTBLOCK');
              if (tb !== null) tb.stroke = highlightColor;
            },
            mouseLeave: function(e, node) {
              node.diagram.clearHighlighteds();
              let tb = node.findObject('TEXTBLOCK');
              if (tb !== null) tb.stroke = 'black';
            }
          },
          new go.Binding('text', 'text'), // for sorting the nodes
          mainGo(go.Shape,
            'Ellipse', {
              name: 'SHAPE',
              fill: 'lightgray', // default value, but also data-bound
              stroke: 'transparent', // modified by highlighting
              strokeWidth: 5,
              desiredSize: new go.Size(80, 80),
              portId: ''
            }, // so links will go to the shape, not the whole node
            new go.Binding('fill', 'color'),
            new go.Binding('stroke', 'isHighlighted',
              function(h) { return h ? highlightColor : 'transparent'; })
            .ofObject()),

          // 定义图标父级面板, 用于定位
          mainGo(go.Panel,
            go.Panel.Vertical, {
              alignment: new go.Spot(100, 0, -72, 10)
            },
            // 图标
            mainGo(go.TextBlock, '\uE62d', {
              font: 'bold 60px "iconfont"',
              stroke: 'whitesmoke',
              wrap: go.TextBlock.OverflowEllipsis,
              editable: false,
              width: 60,
              textAlign: 'center'
            })
          ),

          // 定义手机号码父级面板, 用于定位
          mainGo(go.Panel,
            go.Panel.Vertical, {
              alignment: new go.Spot(0, 0, -50, 35)
            },
            // 手机号码
            mainGo(go.TextBlock, { name: 'TEXTBLOCK' }, // for search
              new go.Binding('text', 'text'))
          )

        );

      // 定义鼠标经事高亮效果
      function highlightLink(link, show) {
        link.isHighlighted = show;
        link.fromNode.isHighlighted = show;
        link.toNode.isHighlighted = show;
      }

      // 定义连线模板
      myDiagram.linkTemplate =
        mainGo(
          go.Link, {
            routing: go.Link.Normal,
            curve: go.Link.Bezier,
            selectionAdorned: false,
            // 鼠标经过离开时, 出发关联线条高亮
            mouseEnter: function(e, link) { highlightLink(link, true); },
            mouseLeave: function(e, link) { highlightLink(link, false); }
          },
          mainGo(go.Shape,
            new go.Binding('stroke', 'isHighlighted',
              function(h, shape) { return h ? highlightColor : shape.part.data.color; })
            .ofObject(),
            new go.Binding('strokeWidth', 'isHighlighted',
              function(h) { return h ? 2 : 1; })
            .ofObject()),

          // 线条文字面板
          mainGo(go.Panel,
            'Auto', {
              visible: false,
              name: 'LABEL'
            },
            // 线条上的文字样式
            mainGo(
              go.TextBlock, '', {
                textAlign: 'center',
                font: '14px',
                stroke: '#666',
                margin: 4,
                maxLines: 3,
                editable: false
              },
              new go.Binding('text').makeTwoWay()
            ),
          )
        );

      generateGraph();
    }

    function generateGraph() {
      // 插入节点
      let nodeDataArray = [];
      for (let i = 0; i < self.arr.length; i++) {
        nodeDataArray.push({ key: i, text: self.arr[i], color: '#000' }); // go.Brush.randomColor(128, 240)
      }

      // 插入线条
      let linkDataArray = [];
      let num = nodeDataArray.length;
      for (let ii = 0; ii < num * 2; ii++) {
        // 随机连线
        let a = Math.floor(Math.random() * num);
        let b = Math.floor(Math.random() * num / 4) + 1;
        linkDataArray.push({
          from: a,
          to: (a + b) % num,
          text: Math.floor(Math.random() * 5) + '次',
          color: go.Brush.randomColor(0, 127)
        });
      }

      //   数据绑定到GO对象内
      myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    }
  }
}
</script>
