<template>
  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="数据预览" :modal-append-to-body="true" :append-to-body="true" size="bigest" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
    <el-table @cell-mouse-enter="cellMouseEnter" :data="list">
      <el-table-column label="序号" prop="id" width="45"></el-table-column>
      <el-table-column label="关键字" prop="keyword"></el-table-column>
      <el-table-column label="IP" prop="ip"></el-table-column>
      <el-table-column label="日期" prop="date"></el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="closeEvent">关闭</el-button>
    </div>
  </el-dialog>
</template>
<style lang="scss" scoped>

</style>

<script>
  import mixin from '../../../utils/mixin'
  export default {
    mixins: [mixin],
    props: ['dialog', 'data'],
    data() {
      return {
        list: [{
          id: 1,
          keyword: '441424198601030022',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 2,
          keyword: '张晓',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 3,
          keyword: '刘房泰',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 4,
          keyword: '13726279778',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 5,
          keyword: '李娜娜',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 6,
          keyword: '杨少纯',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 7,
          keyword: '邱阳',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 8,
          keyword: '邱少阳',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 9,
          keyword: '13609786578',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }, {
          id: 10,
          keyword: '14367679012',
          ip: '10.142.64.172',
          date: '2017/8/11 12:30:47'
        }]
      }
    },
    computed: {},
    methods: {
      initDialog() {

      },
      closeEvent() {
        this.$emit('close')
      }
    },
    created() {

    },
    mounted() {}
  }
</script>
