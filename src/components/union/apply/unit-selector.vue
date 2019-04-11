<!--选择通知单位-->
<template>
<div class="drpart">
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="选择通知单位" width="550" :modal-append-to-body="true" :append-to-body="true"  :modal="false" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent" v-loading="true">
  <div class="selector-wrap mySelect" style="width:450px">
    <!-- <div class="p-title">选择单位</div> -->
    <div class="tree-box">
      <el-input size="mini" v-model="treeKeyword" icon="search" placeholder="通过单位名称搜索"></el-input>
      <el-tree ref="orgTree" class="cat-tree" v-if="tree.length>0" :data="tree" node-key="id" :props="{label:'name',id:'orgId'}" :highlight-current="true" :default-expand-all="false" :filter-node-method="filterNode" @node-click="nodeClick"></el-tree>
    </div>
    <!-- <el-transfer v-model="value" :data="data" :currTreeNode="currUnitNode" :titles="['选择单位','已选单位']" filterable :filter-method="filterMethod"
    @change="checkChange"></el-transfer> -->
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</div>
</template>
<style>
  .mySelect .tree-box .el-input {
    width: 380px;
    margin: 12px 10px 0;
   }
  .mySelect .tree-box .cat-tree {
    width: 400px;
   }
  /* .mySelect .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: yellow;
   } */
</style>
<style lang="scss" scoped>
  .form-box {
    padding: 0 10px;
    .share-content {
      width: 650px;
      margin: 0 auto 20px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .content {
      line-height: 22px;
    }
  }

</style>
<style lang="scss">
  .selector-wrap {
    .el-tree-node.is-expanded>.el-tree-node__children {
      overflow: visible;
    }
    .el-tree-node>.el-tree-node__children {
      overflow: visible;
    }
  }

</style>
<script>
  /*
               传入参数：dialog 是否显示Dialog
               * */
  import mixin from '../../../utils/mixin'
  // import Transfer from '../transfer-selector';
  // import { mapState } from 'vuex'
  // import { FETCH_USER_SELECTOR_COMPANY_CONTACTS } from '../../store/types'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        value: [],
        data: [],
        tree: [],
        sysTree: [],
        currUnitNode: {},
        treeKeyword: '',
        checkedData: [],
        checkObj: {}
      }
    },
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      orgList: {
        type: Array,
        default () {
          return []
        }
      },
      size: {
        type: String,
        default: 'large'
      }
    },
    computed: {
      // ...mapState(['userSelector'])
    },
    watch: {
      treeKeyword(val) {
        this.$refs.orgTree.filter(val)
      }
    },
    methods: {
      // checkChange(checkKeyArr, checkDataArr) {
      //   this.checkedData = [...checkDataArr];
      // },
      initDialog() {
        if (this.orgList.length > 0) {
          this.tree = this.orgList
        } else if (this.tree.length === 0) {
          this.tree = this.sysTree
        }
        this.data = []
        this.value = []
      },
      filterMethod(keyword, item) {
        return item.label.indexOf(keyword) !== -1
      },
      filterNode(value, data) {
        if (!value) {
          return true
        } else {
          return data.name.indexOf(value) !== -1
        }
      },
      submit() {
        console.log(this.value, 'this.value')
        if(this.checkObj.name === '怀化市公安局') {
          alert('不能选择最顶层的怀化市公安局');
          return;
        }
        // this.$emit('update:value', [...this.checkedData].filter(r => this.value.includes(r.key)))
        this.$emit('update:value', this.checkObj)
        this.$emit('close')
      },
      closeEvent() {
        this.$emit('close')
      },
      nodeClick(data, obj, node) {
        console.log(data, obj, node, 'node')
        this.checkObj = {
          code: data.code,
          name: data.name
        };
        this.currUnitNode = {
          id: data.orgId,
          label: data.name
        };
        if (data.children) {
          this.data = data.children.map(d => {
            return {
              label: d.name,
              key: d.orgId,
              orgId: d.orgId,
              tzdwid: d.orgId
            }
          })
        } else {
          this.data = [{
            label: data.name,
            key: data.orgId,
            orgId: data.orgId,
            tzdwid: data.orgId
          }]
        }
        // this.dispatch(FETCH_USER_SELECTOR_COMPANY_CONTACTS, {
        //   orgId: data.orgId
        // }).then(() => (this.data = this.userSelector.contacts.map((d, i) => {
        //   return {
        //     label: d.xm,
        //     key: d.userId,
        //     userId: d.userId,
        //     orgId: d.orgId,
        //     tzrid: d.userId
        //   }
        // })))
      }
    },
    created() {
      this.getRuleOrgTree().then(d => {
        this.sysTree = d
      })
    }
  }

</script>
