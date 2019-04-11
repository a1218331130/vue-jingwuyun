<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="预览数据" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">

  <el-tabs style="margin:0;">
    <el-tab-pane label="关系">
      <el-table :data="linkData" border height="200">
        <el-table-column type="index" label="序号" align="center" width="60">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="来源" prop="from" align="center"></el-table-column>
        <el-table-column label="关系" prop="relation" align="center"></el-table-column>
        <el-table-column label="目标" prop="to" align="center"></el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="对象" border>
      <el-table :data="nodeData" border height="200">
        <el-table-column type="index" label="序号" align="center" width="60">
          <template scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="text" align="center"></el-table-column>
        <el-table-column label="标志" align="center"></el-table-column>
        <el-table-column label="类型" align="center" width="80">
          <template scope="scope">
            {{getCatName(scope.row['category'])}}
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>

  <form ref="relationExportForm" :action="action" method="post">
    <input name="str" type="hidden" :value="dataString" />
    <input name="name" type="hidden" value="关系数据" />
    <input name="extension" type="hidden" value="json" />
  </form>

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <!-- <el-button type="success" @click="submit">导出本页</el-button>
    <el-button type="primary" @click="submit">导出全部</el-button> -->
    <el-button type="primary" @click="submit">导出</el-button>
  </div>
</el-dialog>
</template>

<script>
import { STRING_CONVERSION_PATH } from '../../../config'

import mixin from '../../../utils/mixin'
import { clone } from '../../../utils/util'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      action: STRING_CONVERSION_PATH,
      linkData: [],
      nodeData: []
    }
  },
  props: ['dialog', 'data'],
  computed: {
    dataString() {
      let res
      if (this.data) {
        let data = clone(this.data)
        data.nodeDataArray.forEach(d => {
          d.source = ''
          d.text = encodeURIComponent(d.text)
        })
        data.linkDataArray.forEach(d => {
          d.text = encodeURIComponent(d.text)
        })
        res = JSON.stringify(data)
      } else {
        res = ''
      }
      return res
    }
  },
  methods: {
    initDialog() {
      this.loading === true
      this.linkData = []
      this.nodeData = []
      if (this.data !== null) {
        if (this.data.linkDataArray && this.data.linkDataArray.length > 0) {
          // 关系
          this.linkData = this.data.linkDataArray.map(d => {
            return {
              from: this.data.nodeDataArray.find(n => n.key === d.from).text,
              to: this.data.nodeDataArray.find(n => n.key === d.to).text,
              relation: d.text
            }
          })
        }
        if (this.data.nodeDataArray && this.data.nodeDataArray.length > 0) {
          this.nodeData = [...this.data.nodeDataArray]
        }
        this.loading === false
      }
    },
    closeEvent(success) {
      this.$emit('close')
    },
    submit() {
      if (this.data) {
        this.$refs.relationExportForm.submit()
        this.$message({
          type: 'success',
          message: '关系数据导出成功！',
          duration: 1500
        })
        this.closeEvent()
      }
    },
    getCatName(cat) {
      let res = ''
      switch (cat) {
        case 'person':
          res = '人员'
          break;
        case 'car':
          res = '车辆'
          break;
        default:
          res = '未知'
      }
      return res
    }
  }
}
</script>
