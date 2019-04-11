<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="检索链路" :modal-append-to-body="true" :append-to-body="true" size="link" height="465" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div v-if="currentNode!==null" class="tips-bar">
    <span class="tips-bar__node-name">{{currentNode.text}}</span>
  </div>
  <el-button type="primary" @click="test" style="position:absolute; top:10px; right:50px;">测试</el-button>
  <gocharts ref="searchLinkGoBox" boxId="searchLinkGoBox" class="maker-box" :data="goData" background="none" :options="goOptions" @update:data="val=>postData=val"></gocharts>
</el-dialog>
</template>
<style lang="scss" scoped>
.tips-bar {
    background: #f2f2f2;
    width: calc(100% - 40px);
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    position: absolute;
    top: 38px;
    left: 0;
    z-index: 3;
    &__node-name {
        color: #0099ff;
    }
}
.maker-box {
    width: 888px;
    height: 360px;
    position: relative;
    z-index: 1;
}
</style>
<script>
import mixin from '../../utils/mixin'
import gocharts from '../../widgets/gocharts/gocharts'

export default {
  mixins: [mixin],
  components: {
    gocharts
  },
  data() {
    return {
      currentNode: null,
      /**
       * [data 模型数据对象(最终结果)]
       * @type {Object}
       */
      goData: {
        nodeDataArray: [],
        linkDataArray: []
      },
      goOptions: {
        readOnly: false,
        allowZoom: true,
        layout: 'LayeredDigraphLayout', // 'GridLayout': 网格 'LayeredDigraphLayout': 分层, 'CircularLayout': 圆形, 'ForceDirectedLayout': 反牵引力, 'TreeLayout': 树形
        linkNodeClickEvent: (e, node) => {
          this.currentNode = node.data
        }
      },
      postData: null
    }
  },
  props: ['dialog'],
  computed: {},
  methods: {
    initDialog() {},
    closeEvent() {
      this.$emit('close')
    },
    test() {
      this.generateGraph()
      this.$refs.searchLinkGoBox.initMaker()
    },
    generateGraph() {
      this.goData = {
        nodeDataArray: [{
          'key': 0,
          'category': 'linkEnterNode'
        }, {
          'key': 1,
          'category': 'linkNode',
          'text': '社会_常住人口_基本信息'
        }, {
          'key': 2,
          'category': 'linkNode',
          'text': '社会职工登记表_1'
        }, {
          'key': 3,
          'category': 'linkNode',
          'text': '社会职工登记表_2'
        }, {
          'key': 4,
          'category': 'linkNode',
          'text': '社会职工登记表_3'
        }, {
          'key': 5,
          'category': 'linkNode',
          'text': '社会职工登记表_4'
        }],
        linkDataArray: [{
          'from': 0,
          'to': 1
        }, {
          'from': 1,
          'to': 2
        }, {
          'from': 2,
          'to': 3
        }, {
          'from': 3,
          'to': 4
        }, {
          'from': 4,
          'to': 5
        }]
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
