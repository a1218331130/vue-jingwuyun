<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="选择通知人
" :modal-append-to-body="true" :append-to-body="true" size="large" :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div class="selector-wrap">
    <div class="p-title">选择人员</div>
    <el-tree class="cat-tree" v-if="tree.length>0" :data="tree" node-key="id" :highlight-current="true" :indent="0" :default-expand-all="true"></el-tree>
    <el-transfer v-model="value" :data="data" :titles="['选择人员','已选人员']"></el-transfer>

  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.selector-wrap {
    width: 660px;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    position: relative;
    .p-title {
        background: #fff;
        color: #1f2d3d;
        width: 400px;
        height: 37px;
        line-height: 36px;
        background: #fbfdff;
        margin: 0;
        padding-left: 20px;
        border: 1px solid #d1dbe5;
        botrder-bottom: 0;
        box-sizing: border-box;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }
    .cat-tree {
        width: 198px;
        height: 282px;
        overflow: auto;
        box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    }
}
.el-dialog--full--auto {
    width: 300px;
}
.el-dialog__body {
    height: 300px;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { Transfer } from 'element-ui';

export default {
  mixins: [mixin],
  components: { 'el-transfer': Transfer },
  data() {
    return {
      value: [],
      data: [],
      tree: [{
        label: '怀化市公安局',
        id: '1',
        count: 8,
        children: [{
          label: '鹤城区公安分局',
          id: '1',
          count: 8
        }, {
          label: '会同县公安分局',
          id: '2',
          count: 8
        }, {
          label: '辰溪县公安分局',
          id: '3',
          count: 8
        }, {
          label: '中方县公安分局',
          id: '4',
          count: 8
        }, {
          label: '溆浦县公安分局',
          id: '5',
          count: 8
        }, {
          label: '沅陵县公安分局',
          id: '6',
          count: 8
        }, {
          label: '麻阳苗族自治县公安分局',
          id: '7',
          count: 8
        }, {
          label: '芷江侗族自治县公安分局',
          id: '8',
          count: 8
        }, {
          label: '洪江市公安分局',
          id: '9',
          count: 8
        }, {
          label: '靖州苗族侗族自治县公安分局',
          id: '10',
          count: 8
        }, {
          label: '通道侗族自治县公安分局',
          id: '11',
          count: 8
        }, {
          label: '溆浦县公安分局',
          id: '12',
          count: 8
        }, {
          label: '新晃侗族自治县公安分局',
          id: '13',
          count: 8
        }]
      }]
    }
  },
  props: ['dialog'],
  computed: {},
  methods: {
    initDialog() {},
    submit() {
      this.$emit('update:value', this.value)
      this.$emit('close')
    },
    closeEvent() {
      this.$emit('close')
    }
  },
  mounted() {
    let s = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈']
    for (let i = 0; i <= 30 - 1; i++) {
      this.data.push({
        key: i,
        label: s[parseInt(Math.random() * 9)] + '某某',
        disabled: false
      })
    }
  }
}
</script>
