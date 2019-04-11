<template>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>
<style scoped>
</style>
<script>
  import go from 'gojs'

  const make = go.GraphObject.make;
  export default {
    data() {
      return {
        nodes: [{
          key: 1,
          text: '邓霞'
        }, {
          key: 2,
          text: '龙平'
        }, {
          key: 3,
          text: '张三'
        }, {
          key: 4,
          text: '李四'
        }, {
          key: 5,
          text: '王五'
        }],
        links: [{
          from: 2,
          to: 1,
          text: '夫妻'
        }, {
          from: 3,
          to: 1,
          text: '同户'
        }, {
          from: 2,
          to: 3,
          text: '朋友'
        }, {
          from: 4,
          to: 3,
          text: '恋人'
        }, {
          from: 5,
          to: 3,
          text: '情敌'
        }],
        diagram: null
      }
    },
    methods: {
      initDiagram() {
        // 图表实例对象
        this.diagram = make(go.Diagram, this.$refs.chart, {
          initialAutoScale: go.Diagram.Uniform, // 初始自动缩放到合适画布
          contentAlignment: go.Spot.Center, // 视图居中对齐
          allowZoom: true, // 是否允许缩放
          'undoManager.isEnabled': true, // 开启撤销和重做
          // 鼠标滑轮操作缩放
          'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom,
          SelectionMoved: function (e) {
            // 当拖出画布之外,回弹重新布局
            e.diagram.layout.invalidateLayout();
          }
        });
        return this.diagram;
      },
      setNodeTemplate(diagram) {
        // 设置图表节点模板
        diagram.nodeTemplate = make(go.Node, go.Panel.Auto,
          {
            background: null
          },
          new go.Binding('background', 'mark'),
          // 节点包含的图片
          make(go.Shape, 'Circle',
            {
              width: 50,
              height: 50,
              fill: 'lightgreen',
              stroke: null
            },
            new go.Binding('source', 'source')),

          // 节点文字
          make(go.TextBlock, '默认',
            {
              textAlign: 'center',
              stroke: '#666'
            }, new go.Binding('text', 'text'))
        );
      },
      setLinkTemplate(diagram) {
        // 设置图表连线模板
        diagram.linkTemplate = make(go.Link,
          // 线条
          make(go.Shape, {
            stroke: '#999'
          }),

          // 线条指向的箭头
          make(go.Shape, {
            toArrow: 'standard',
            stroke: null,
            fill: '#999'
          }),

          // 线条上的文字
          make(go.TextBlock, {
            textAlign: 'center',
            stroke: '#000',
            margin: 5
          }, new go.Binding('text', 'text'))
        );
      },
      setLayout(diagram) {
        // 设置图表布局
        diagram.layout = make(go.ForceDirectedLayout, {
          defaultSpringLength: 10,
          defaultElectricalCharge: 50,
          defaultSpringStiffness: 0.01
        });

        diagram.toolManager.draggingTool.doMouseMove = function () {
          go.DraggingTool.prototype.doMouseMove.call(this);
          if (this.isActive) {
            this.diagram.layout.invalidateLayout();
          }
        };
      }
    },
    mounted() {
      let diagram = this.initDiagram(diagram);
      this.setNodeTemplate(diagram);
      this.setLinkTemplate(diagram);
      this.setLayout(diagram);
      diagram.model = new go.GraphLinksModel(this.nodes, this.links);
    }
  }
</script>
