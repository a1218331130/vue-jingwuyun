<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="排序" :modal-append-to-body="true" 
:append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-radio-group v-if="viewColumns && viewColumns.length > 0" v-model="column">
    <div class="sort-box">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,i) in viewColumns" v-show="item.label!==''" :key="i">
          <el-radio class="item" :title="item.label" :label="item">{{item.label}}</el-radio>
        </el-col>
      </el-row>
    </div>
  </el-radio-group>
  <hr/>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="defaultSort">默认排序</el-button>
    <el-button type="success" @click="submit(0)" icon="icon iconfont icon-asc">升序</el-button>
    <el-button type="primary" @click="submit(1)" icon="icon iconfont icon-desc">降序</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.sort-box {
    width: calc(100% - 20px);
    margin: 0 auto;
    overflow: hidden;
    .item {
        width: 100%;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
<script>
import mixin from '../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      viewColumns: [],
      column: ''
    }
  },
  props: ['dialog', 'columns'],
  computed: {},
  methods: {
    initDialog() {
      let viewColumns = [...this.columns.filter(d => d.disabled === false)]
      viewColumns.sort((a, b) => {
        return a.order - b.order
      })
      this.viewColumns = viewColumns
    },
    closeEvent() {
      this.$emit('close')
    },
    submit(type) {
      if (type === -1) {
        this.$emit('update:value', null)
      } else {
        this.$emit('update:value', {
          type: type === 1 ? 'desc' : 'aes',
          column: this.column.prop,
          tips: this.column.label + (this.type === 1 ? '降序' : '升序') + '排列'
        })
      }
    },
    defaultSort() {
      this.column = ''
      this.submit(-1)
    }
  },
  created() {

  },
  mounted() {}
}
</script>
