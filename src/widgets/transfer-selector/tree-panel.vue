<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">{{ title }}</p>
    
    <div class="el-transfer-panel__body">
      <el-input
        class="el-transfer-panel__filter"
        v-model="query"
        size="small"
        :placeholder="placeholder"
        :icon="inputIcon"
        @mouseenter.native="inputHover = true"
        @mouseleave.native="inputHover = false"
        @click="clearQuery"
        v-if="filterable"></el-input>

        <el-tree
        v-show="!hasNoMatch && data.length > 0"
        class="filter-tree transfer-selector-tree"
        :data="data"
        :show-checkbox = "false"
        @check-change="treeCheckChange"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="targetTree">

          </el-tree>
          <!--
      <el-checkbox-group
        v-model="checked"
        v-show="!hasNoMatch && data.length > 0"
        :class="{ 'is-filterable': filterable }"
        class="el-transfer-panel__list">
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :disabled="item[disabledProp]"
          :key="item[keyProp]"
          v-for="item in filteredData">
        </el-checkbox>
      </el-checkbox-group>
      -->
      <p
        class="el-transfer-panel__empty"
        v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p
        class="el-transfer-panel__empty"
        v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>
    <!--
    <p class="el-transfer-panel__footer">
      <el-checkbox
        v-model="allChecked"
        @change="handleAllCheckedChange"
        :indeterminate="isIndeterminate">{{ checkedSummary }}</el-checkbox>
      <slot></slot>
    </p>
    -->
  </div>
</template>
<style lang="scss" scoped>
  .el-tree {
    overflow: scroll;
    height: 100%;
  }

</style>
<style lang="scss">
  .transfer-selector-tree .el-tree-node__content {
    line-height: 24px;
    height: 24px;
  }

</style>
<script>
  import ElCheckboxGroup from 'element-ui/packages/checkbox-group';
  import ElCheckbox from 'element-ui/packages/checkbox';
  import ElInput from 'element-ui/packages/input';
  import Locale from 'element-ui/src/mixins/locale';

  export default {
    mixins: [Locale],

    name: 'ElTransferPanel',

    componentName: 'ElTransferPanel',

    components: {
      ElCheckboxGroup,
      ElCheckbox,
      ElInput
    },

    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      renderContent: Function,
      placeholder: String,
      title: String,
      filterable: Boolean,
      footerFormat: Object,
      filterMethod: Function,
      defaultChecked: Array,
      props: Object
    },

    data() {
      return {
        checked: [],
        allChecked: false,
        query: '',
        inputHover: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },

    watch: {
      query(val) {
        this.$refs.targetTree.filter(val);
      },
      checked(val) {
        // this.updateAllChecked();
        // this.$emit('checked-change', val);
      },

      data: {
        handler(val, oldVal) {

        },
        deep: true
      },

      checkableData() {
        // this.updateAllChecked();
      }
      // ,

      // defaultChecked: {
      //   immediate: true,
      //   handler(val, oldVal) {
      //     if (oldVal && val.length === oldVal.length &&
      //       val.every(item => oldVal.indexOf(item) > -1)) return;
      //     const checked = [];
      //     const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
      //     val.forEach(item => {
      //       if (checkableDataKeys.indexOf(item) > -1) {
      //         checked.push(item);
      //       }
      //     });
      //     this.checked = checked;
      //   }
      // }
    },

    computed: {
      filteredData() {
        // return this.data.filter(item => {
        //   if (typeof this.filterMethod === 'function') {
        //     return this.filterMethod(this.query, item);
        //   } else {
        //     const label = item[this.labelProp] || item[this.keyProp].toString();
        //     return label.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
        //   }
        // });
      },

      checkableData() {
        // return this.filteredData.filter(item => !item[this.disabledProp]);
      },

      checkedSummary() {
        // const checkedLength = this.checked.length;
        // const dataLength = this.data.length;
        // const { noChecked, hasChecked } = this.footerFormat;
        // if (noChecked && hasChecked) {
        //   return checkedLength > 0 ?
        //     hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength) :
        //     noChecked.replace(/\${total}/g, dataLength);
        // } else {
        //   return checkedLength > 0 ?
        //     this.t('el.transfer.hasCheckedFormat', { total: dataLength, checked: checkedLength }) :
        //     this.t('el.transfer.noCheckedFormat', { total: dataLength });
        // }
      },

      isIndeterminate() {
        // const checkedLength = this.checked.length;
        // return checkedLength > 0 && checkedLength < this.checkableData.length;
      },

      hasNoMatch() {
        // return this.query.length > 0 && this.filteredData.length === 0;
      },

      inputIcon() {
        // return this.query.length > 0 && this.inputHover ?
        //   'circle-close' :
        //   'search';
      },

      labelProp() {
        // return this.props.label || 'label';
      },

      keyProp() {
        // return this.props.key || 'key';
      },

      disabledProp() {
        // return this.props.disabled || 'disabled';
      }
    },

    methods: {
      treeCheckChange(data, checked, hasCheckedChild) {
        console.log(data, checked, hasCheckedChild)
        console.log(!checked && !data.children)
        console.log(!checked && data.children)
        // if (!checked && !data.children) {
        //   this.$emit('child-unchecked', data.id);
        // } else if (!checked && data.children) {
        //   this.$emit('tree-unchecked')
        // }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      updateAllChecked() {
        // const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        // this.allChecked = checkableDataKeys.length > 0 &&
        //   checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
      },

      handleAllCheckedChange(value) {
        // this.checked = value.target.checked ? this.checkableData.map(item => item[this.keyProp]) : [];
      },

      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = '';
        }
      }
    }
  };

</script>
