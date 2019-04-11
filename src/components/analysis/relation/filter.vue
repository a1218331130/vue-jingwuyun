<template>
<div class="filter">
  <el-form v-show="list.length>0">
    <!-- 证件、姓名 -->
    <el-input v-model="keyword" placeholder="通过 姓名 或 证件号码 筛选"></el-input>

    <!-- 同订票 -->
    <!-- 同订票(1)最少次数
    <el-input-number placeholder=""></el-input-number> -->

    <!-- 性别 -->
    <!-- <el-radio-group>
      <el-radio label="不限性别"></el-radio>
      <el-radio label="男"></el-radio>
      <el-radio label="女"></el-radio>
    </el-radio-group> -->

    <!-- 人员类型 -->
    <!-- <el-checkbox-group>
      <el-checkbox label="重点人员"></el-checkbox>
      <el-checkbox label="前科人员"></el-checkbox>
    </el-checkbox-group> -->

    <!-- 人品去年 -->
    <!-- <el-button type="primary">搜索</el-button> -->
  </el-form>

  <hr class="filter__line" />

  <div v-show="list.length>0" class="list">
    <!-- <div class="text-right">
      <el-button class="list__btn--all" icon="plus"></el-button>
    </div> -->

    <div v-show="viewList.length>0" v-for="(item,idx) in viewList" class="list__item" :key = "idx">
      <span class="cursor--pointer" @click="openInfoDialog(1, item.endNode.zjhm, null)">{{item.endNode.zjhm}}</span>
      <span>{{item.endNode.ms}}</span>
      <i class="el-icon-plus pointer"  v-if="!addedItem.includes(item.endNode.zjhm)" @click="addNode(item)"></i>
      <i class="el-icon-minus pointer"  v-if="addedItem.includes(item.endNode.zjhm)" @click="removeNode(item)"></i>
    </div>

    <div v-show="viewList.length===0" class="tips--fixed">
      暂无相关数据
    </div>

  </div>

  <div v-show="list.length===0" class="tips">
    选择一个数据节点
  </div>

  <dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog" :showModal="false"></dialog-people-info>
</div>
</template>
<style lang="scss" scoped>
  .tips {
    color: #fff;
    text-align: center;
    width: 100%;
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    &--fixed {
      @extend .tips;
      position: static;
      transform: none;
    }
  }

  .relation-box .filter-box .list__item {
    padding: 0 0 0 10px;
    .pointer {
      cursor: pointer;
    }
  }

</style>
<script>
  import infoDialogEvents from '../../../utils/infoDialogEvents'
  import dialogInfo from '../../../widgets/info-dialog/info-dialog'

  /**
   * @module RelationFilter
   * @desc 关系分析-过滤组件
   */
  export default {
    mixins: [infoDialogEvents],
    components: {
      'dialog-people-info': dialogInfo
    },
    data: () => ({
      keyword: '',
      form: {
        close: false,
        idCard: '',
        name: '',
        cat: [],
        objKeyword: '',
        relationKeyword: '',
        objCount: 0,
        relationCount: 0
      },
      catOps: [
        { label: '人员', value: 'person' },
        { label: '车辆', value: 'car' },
        { label: '酒店', value: 'hotel' },
        { label: '电话', value: 'tel' },
        { label: '网吧', value: 'ntebar' },
        { label: '虚拟账号', value: 'visualAccound' }
      ],
      addedItem: []
    }),
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    watch: {
      list() {
        this.addedItem = [];
      }
    },
    computed: {
      viewList() {
        let res = [...this.list]
        if (this.keyword !== '') {
          res = res.filter(d => d.endNode.ms.indexOf(this.keyword) !== -1 || d.endNode.zjhm.indexOf(this.keyword) !== -1)
        }
        return res
      }
    },
    methods: {
      changeAdded(item, type) {
        if (type === 'add') {
          this.addedItem.push(item.endNode.zjhm)
        } else if (type === 'remove') {
          let key = item.endNode.zjhm;
          this.addedItem.splice(this.addedItem.indexOf(key), 1);
        }
      },
      removeNode(item) {
        this.$emit('call:removeNode', item);
      },
      addNode(item) {
        this.$emit('call:addNode', item)
      },
      submit(needClose = false) {
        this.form.close = needClose
        /**
         * 拖拉连接两个节点
         * @event module:RelationFilter~update:value
         * @param {Object} a 条件对象
         */
        this.$emit('update:value', this.form)
      }
    }
  }

</script>
