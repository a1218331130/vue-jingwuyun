<template>
  <div class="el-transfer">
    <checkbox-panel
      v-bind="$props"
      :data="sourceData"
      :title="titles[0] || t('el.transfer.titles.0')"
      :default-checked="
  leftCacheChecked
"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer"></slot>
    </checkbox-panel>
    <!--
  <div class="el-transfer__buttons">
    <el-button type="primary" size="small" @click.native="addToLeft" :disabled="rightTreeChecked.length === 0">
      <i class="el-icon-arrow-left"></i>
      <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
    </el-button>
    <el-button type="primary" size="small" @click.native="addToRight" :disabled="leftChecked.length === 0">
      <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
      <i class="el-icon-arrow-right"></i>
    </el-button>
  </div>
  -->
    <tree-panel
      v-bind="$props"
      ref="treePanelCon"
      :data="targetData"
      :title="titles[1] || t('el.transfer.titles.1')"
      :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
      @checked-change="onTargetCheckedChange"
      @child-unchecked="childUnchecked"
      @tree-unchecked="treeUnchecked"
      >
      <slot name="right-footer"></slot>
    </tree-panel>
  </div>
</template>

<script>
  import 'element-ui/lib/theme-default/transfer.css';
  import ElButton from 'element-ui/packages/button';
  import Emitter from 'element-ui/src/mixins/emitter';
  import Locale from 'element-ui/src/mixins/locale';
  import checkboxPanel from './checkbox-panel.vue';
  import TreePanel from './tree-panel.vue';

  export default {
    name: 'TransferSelector',

    mixins: [Emitter, Locale],

    components: {
      checkboxPanel,
      ElButton,
      TreePanel
    },

    props: {
      currTreeNode: {
        type: Object,
        default () {
          return {};
        }
      },
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      titles: {
        type: Array,
        default () {
          return [];
        }
      },
      buttonTexts: {
        type: Array,
        default () {
          return [];
        }
      },
      filterPlaceholder: {
        type: String,
        default: ''
      },
      filterMethod: Function,
      leftDefaultChecked: {
        type: Array,
        default () {
          return [];
        }
      },
      renderContent: Function,
      value: {
        type: Array,
        default () {
          return [];
        }
      },
      footerFormat: {
        type: Object,
        default () {
          return {};
        }
      },
      filterable: Boolean,
      props: {
        type: Object,
        default () {
          return {
            label: 'label',
            key: 'key',
            disabled: 'disabled'
          };
        }
      }
    },

    data() {
      return {
        leftCacheChecked: [],
        // leftChecked: [], // 左边列表选项
        // rightTreeChecked: [], // 将右边已选择的树的叶子转换成数组,作为已选项
        targetData: [], // 右边已选择的树
        sourceDataChange: false,
        checkedData: []
      };
    },

    computed: {
      sourceData() {
        return [...this.data];
      },
      rightTreeChecked() {
        let keys = [];
        if (this.targetData && this.targetData.length > 0) {
          for (let i in this.targetData) {
            for (let j in this.targetData[i].children) {
              keys.push(this.targetData[i].children[j].id);
            }
          }
        }
        return keys;
      }
    },

    watch: {
      value(val) {
        this.dispatch('ElFormItem', 'el.form.change', val);
      },
      sourceData: {
        handler() {
          // 数据原改变后,需要查看在rightTreeChecked 已选列表中是否存在,如果存在,则写到leftCacheChecked中.
          this.sourceDataChange = true;
          this.$nextTick(() => {
            var defaultChecked = [];
            for (var i in this.data) {
              if (this.rightTreeChecked.indexOf(this.data[i].key) > -1) {
                defaultChecked.push(this.data[i].key)
              }
            }
            if (this.leftDefaultChecked && this.leftDefaultChecked.length > 0) {
              defaultChecked = defaultChecked.concat(this.leftDefaultChecked)
            }
            this.leftCacheChecked = defaultChecked;
            this.$nextTick(() => {
              this.sourceDataChange = false;
            })
          })
        },
        deep: true
      }
    },

    methods: {
      childUnchecked(id) {
        this.$nextTick(() => {
          this.leftCacheChecked = this.data.filter(r => { return r !== id && this.rightTreeChecked.includes(r) });
        })
      },
      treeUnchecked() {
        this.leftCacheChecked = [];
        this.$nextTick(() => {
          this.addToRight();
        })
      },
      getSelectedChildren() {
        // 将已选项组合成子树
        let children = [];
        this.leftCacheChecked.forEach(item => {
          children.push({
            id: item,
            label: this.data.find(r => r.key === item).label
          });
        })
        return children;
      },
      onSourceCheckedChange(val) {
        this.leftCacheChecked = val;
        if (!this.sourceDataChange) {
          this.addToRight()
        }
      },
      onTargetCheckedChange(val) {},

      addToLeft() {
        let currentValue = this.value.slice();
        this.rightTreeChecked.forEach(item => {
          const index = currentValue.indexOf(item);
          if (index > -1) {
            currentValue.splice(index, 1);
          }
        });
        this.$emit('input', currentValue);
        this.$emit('change', currentValue, 'left', this.rightTreeChecked);
      },

      addToRight() {
        let treeIndex;
        for (let i in this.targetData) {
          if (this.targetData[i].id === this.currTreeNode.id) {
            treeIndex = i;
          }
        }
        if (treeIndex) {
          // 如果结果中已存在该单位
          if (this.leftCacheChecked.length !== 0) {
            this.targetData.splice(treeIndex, 1, {
              id: this.currTreeNode.id,
              label: this.currTreeNode.label,
              children: this.getSelectedChildren()
            })
          } else {
            this.targetData.splice(treeIndex, 1)
          }
        } else {
          if (this.leftCacheChecked.length !== 0) {
            this.targetData.push({
              id: this.currTreeNode.id,
              label: this.currTreeNode.label,
              children: this.getSelectedChildren()
            })
          }
        }
        this.setCheckedKeys();
        this.sourceDataChange = false;
        this.checkedData = this.getCheckedData();
        this.$emit('input', this.rightTreeChecked);
        this.$emit('change', this.rightTreeChecked, this.checkedData);
      },
      getCheckedData() {
        let dataArr = [];
        this.checkedData.forEach((item, idx) => {
          // 将不是当前树的数据先保留
          let fixArr = this.sourceData.some(r => r.key === item.key);
          if (!fixArr) {
            dataArr.push(item)
          }
        })
        this.sourceData.forEach((item, idx) => {
          if (this.leftCacheChecked.includes(item.key)) {
            dataArr.push(item)
          }
        })
        return dataArr;
      },
      setCheckedKeys() {
        if (this.targetData.length > 0) {
          this.$nextTick(() => {
            let keys = [];
            for (let i in this.targetData) {
              keys.push(this.targetData[i].id);
            }
            this.$refs.treePanelCon.$refs.targetTree.setCheckedKeys(keys)
          })
        }
      }
    }
  };

</script>
