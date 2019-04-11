<template>
  <el-dialog v-draggable="dialogDraggableOptions" class="no-padding" :visible.sync="dialog" title="临时储存" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed"
             :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <span slot="title" class="el-dialog__title">
      临时储存
    <!-- <pagination class="pagenav" :count="5" :small="true" mode="prev,next" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
    <span class="pageNum">{{pagenav.currentpage}}/1</span> -->
  </span>
    <div class="table-wrapper">

      <el-table @cell-mouse-enter="cellMouseEnter" :data="data" @row-click="handleClick">
        <el-table-column label="序号" width="60">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
</el-table-column>
<el-table-column label="记录名称" prop="tableName" class-name="text-left"></el-table-column>
<el-table-column label="记录序号" prop="index" class-name="text-left" width="80"></el-table-column>
<el-table-column label="操作" align="center" width="80">
  <template scope="scope">
            <el-button type="text" size="small" @click.stop="remove(scope.row, scope.$index)">
              <i class="iconfont icon-trash_fill"></i>
            </el-button>
          </template>
</el-table-column>
</el-table>
</div>
<!-- <span slot="footer" class="dialog-footer">
      <el-button type="primary" >导出临时储存</el-button>
    </span> -->
</el-dialog>
</template>
<style lang="scss" scoped>
  .pagenav {
    position: absolute;
    top: 5px;
    right: 30px;
    .btn-next,
    .btn-prev {
      background: transparent;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .table-wrapper {
    padding: 10px;
    text-align: left;
  }

</style>
<style>
  .table-wrapper .el-table__row {
    cursor: pointer;
  }

  .table-wrapper .el-table th.is-leaf {
    text-align: left;
  }

  .temp_tr>td {
    background: #fff;
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import pagination from '../../widgets/pagination/pagination'

  export default {
    mixins: [mixin],
    components: {
      pagination
    },
    data() {
      return {
        pagenav: {
          currentpage: 1,
          limit: 10
        }
      }
    },
    props: ['dialog', 'data'],
    computed: {},
    methods: {
      initDialog() {},
      closeEvent() {
        this.$emit('close')
      },
      remove(row, index) {
        this.$emit('remove', index)
      },
      handleClick(row) {
        this.$emit('on-item-click', row)
        this.$emit('close')
      }
    },
    created() {

    },
    updated() {},
    mounted() {}
  }

</script>
