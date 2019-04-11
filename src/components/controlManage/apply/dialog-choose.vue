<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="新增" :modal-append-to-body="true" 
:append-to-body="true" size="bigest" :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row>
    <el-col :span="6" style="height:670px;">
      <el-tree class="cat-tree" v-if="tree.length>0" :data="tree" node-key="id" :highlight-current="true" :indent="0" :default-expand-all="true"></el-tree>
      <!-- :render-content="treeRenderContent" -->
    </el-col>
    <el-col :span="18">
      <div class="list-wrap">
        <div class="app-toolbar">
          <el-row>
            <el-col :span="22">
              <el-form :inline="true">
                <el-form-item label="姓名">
                  <el-input placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="身份证">
                  <el-input placeholder=""></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="2" class="text-right">
              <el-button type="primary">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="list-box">
          <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" :show-header="true" :data="tableList" :border="true" height="600">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column v-for="column in columns" :key="column.id" :label="column.label" :prop="column.prop"></el-table-column>
          </el-table>
        </div>

        <!-- <div class="app-toolbar tool-pagination">
            <el-row>
              <el-col :span="24">
                <pagination :count="1" :pagenav="{limit: 10,currentpage: 1}"></pagination>
              </el-col>
              <el-col :span="0"></el-col>
            </el-row>
          </div> -->
      </div>

    </el-col>
  </el-row>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.cat-tree {
    height: 100%;
}
.el-dialog__body {
    height: 900px;
    padding: 0;

}
</style>
<script>
import mixin from '../../../utils/mixin'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      columns: [],
      tableList: [],
      tree: [{
        label: '案件',
        id: '1',
        count: 8,
        children: [{
          label: '830入室盗窃案',
          id: '3',
          count: 5
        }, {
          label: '825暴力伤人案',
          id: '4',
          count: 24
        }, {
          label: '820飞车抢劫案',
          id: '5',
          count: 12
        }]
      }, {
        label: '管控对象',
        id: '2',
        count: 8,
        children: []
      }]
    }
  },
  props: ['dialog', 'type'],
  computed: {},
  methods: {
    initDialog() {
      if (this.type === 'person') {
        this.tree[1].children = [{
          label: '涉稳人员',
          id: '3',
          count: 5
        }, {
          label: '涉恐人员',
          id: '4',
          count: 24
        }, {
          label: '精神病人',
          id: '5',
          count: 12
        }, {
          label: '涉毒人员',
          id: '6',
          count: 12
        }, {
          label: '前科人员',
          id: '8',
          count: 12
        }, {
          label: '涉抢涉爆人员',
          id: '8',
          count: 12
        }, {
          label: '上访人员',
          id: '8',
          count: 12
        }]
        this.columns = [{
          id: 3,
          allowPropertyEvent: true,
          label: '姓名',
          prop: 'name',
          type: 'name'
        }, {
          id: 4,
          allowPropertyEvent: true,
          label: '身份证',
          prop: 'idCard',
          type: 'idCard'
        }, {
          id: 5,
          allowPropertyEvent: true,
          label: '籍贯',
          prop: 'source',
          type: null
        }, {
          id: 6,
          allowPropertyEvent: true,
          label: '职业',
          prop: 'job',
          type: null
        }, {
          id: 13,
          allowPropertyEvent: true,
          label: '备注',
          prop: 'mark',
          type: null
        }]
        for (let i = 0; i <= 30 - 1; i++) {
          this.tableList.push({
            id: (i + 1),
            city: '长沙',
            name: '李明钟',
            idCard: '440104198005065314',
            source: '怀化',
            job: '车间工人',
            mark: '人员其他相关信息'
          })
        }
      } else {
        this.tree[1].children = [{
          label: '毒驾车辆',
          id: '3',
          count: 5
        }, {
          label: '超员车辆',
          id: '4',
          count: 24
        }, {
          label: '酒驾车辆',
          id: '5',
          count: 12
        }, {
          label: '超速车辆',
          id: '6',
          count: 12
        }, {
          label: '涉牌涉证车辆',
          id: '8',
          count: 12
        }, {
          label: '超载车辆',
          id: '8',
          count: 12
        }, {
          label: '疲劳驾驶车辆',
          id: '8',
          count: 12
        }]
        this.columns = [{
          id: 3,
          allowPropertyEvent: true,
          label: '车牌号',
          prop: 'no',
          type: null
        }, {
          id: 4,
          allowPropertyEvent: true,
          label: '车辆识别码',
          prop: 'idCard',
          type: 'idCard'
        }, {
          id: 5,
          allowPropertyEvent: true,
          label: '品牌型号',
          prop: 'type',
          type: null
        }, {
          id: 6,
          allowPropertyEvent: true,
          label: '颜色',
          prop: 'color',
          type: null
        }, {
          id: 13,
          allowPropertyEvent: true,
          label: '备注',
          prop: 'mark',
          type: null
        }]
        for (let i = 0; i <= 30 - 1; i++) {
          this.tableList.push({
            id: (i + 1),
            no: '湘N551552',
            code: 'SHGND88898',
            color: '黑',
            brand: '别克昂科拉',
            noType: '蓝底',
            ep: 'SHGND88898',
            dooNo: 'AGUDNG5465784556',
            mark: '2014年10月9日更改车辆颜色'
          })
        }
      }
    },
    submit() {
      this.closeEvent()
    },
    closeEvent() {
      this.$emit('close')
    }
  },
  mounted() {

  }
}
</script>
