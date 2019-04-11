<template>
<div>
  <el-dialog v-draggable="dialogDraggableOptions" title="详情" :visible.sync="dialog" @open="initDialog" :before-close="closeEvent" :close-on-click-modal="false" size="bigest">

    <div class="padd-lr" v-loading="tableLoading">
      <el-table :data="tableData" :stripe="true" :show-header=false>
        <el-table-column type="index" class-name="vt_t" width="60px" align="center">
          <template scope="scope">
            <el-tag type="primary">{{scope.$index + 1}}</el-tag>
          </template>
</el-table-column>

<el-table-column>
  <template scope="scope">
            <div class="other-text">
              <label v-for="item in columns" :key="item.prop">
                <div style="width:8%;float:left;color:#ccc;">{{item.label}}</div>
                <div style="width:17%;float:left;color:#222;">{{scope.row[item.prop] ? scope.row[item.prop] : '无数据' }}</div>
                </label>
            </div>
          </template>
</el-table-column>
</el-table>
</div>
<div>
  <div style="height:24px;">
    <el-row>
      <el-col :span="24">
        <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
      </el-col>
    </el-row>
  </div>
</div>
<div slot="footer" class="dialog-footer">
  <el-button type="" @click="closeEvent">取消</el-button>
  <!--<el-button type="primary" @click="submit">确定</el-button>-->
</div>
</el-dialog>
</div>
</template>
<style lang="scss" scoped>
  .padd-lr {
    padding: 0 15px;
  }

  .other-text {
    white-space: normal;
    color: #000;
    span {
      margin: 0 5px 0 10px;
      display: inline-block;
      color: #999;
      &:first-child {
        margin-left: 0;
      }
    }
  }

  .dialog-footer {}

  .pagenav {
    position: absolute;
    top: 6px;
    right: 45px;
    .btn-next,
    .btn-prev {
      background: transparent;
    }
    button.disabled {
      background: transparent;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

</style>
<script>
  import pagination from '../../../widgets/pagination/pagination'
  import columnsMap from '../../../utils/columnsMap'
  import { FWZX_BASE_PATH } from '../../../config'
  import mixin from '../../../utils/mixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        count: 0,
        pagenav: {
          currentpage: 1,
          limit: 10
        },
        tableLoading: true,
        tableData: [],
        columns: []
      }
    },
    watch: {
      pagenav: {
        handler: function(val, oldVal) {
          this.initDialog()
        },
        deep: true
      }
    },
    components: {
      pagination
    },
    props: ['dialog', 'tableList'],
    methods: {
      closeEvent() {
        this.count = 0
        this.tableData = []
        this.pagenav.currentpage = 1
        this.$emit('close')
      },
      submit() {},
      initDialog() {
        this.tableLoading = true
        this.updateRecord(this.tableList)
      },
      updateRecord(data) {
        this.$http.post(FWZX_BASE_PATH + '/call', {
          c: 0,
          token: this.userData.UserToken,
          data: JSON.stringify({ sql: data.callsql, PageIndex: this.pagenav.currentpage, PageSize: this.pagenav.limit }),
          id: 'zfsc/library/callgp'
        }, this.httpSettings).then((res) => {
          this.tableData = JSON.parse(res.bodyText).Data.PageDate
          this.count = JSON.parse(res.bodyText).Data.DataCount
          let columns = []
          for (let item in this.tableData[0]) {
            columns.push({
              label: columnsMap[item] || item,
              prop: item
            })
          }
          this.columns = columns
          this.tableLoading = false
        })
      }
    },
    mounted() {}
  }

</script>
