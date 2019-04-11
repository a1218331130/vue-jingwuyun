<template>
<div class="toolBar">
  <div class="list" style="float: right">
    <el-tabs v-model="tabValue" v-if="checkRule('ajgl/lawcase/list',true)" @tab-click="tabChange" style="float: left;margin: -8px 0px 0px;z-index: 9;position: absolute;">
      <el-tab-pane label="进行中" name="0">
        <span slot="label">进行中
          <span class="wrn_text"> ({{pageListCount.caseList_0||'加载中'}})</span>
        </span>
      </el-tab-pane>
      <el-tab-pane label="已结案" name="1">
        <span slot="label">已结案
          <span class="wrn_text"> ({{pageListCount.caseList_1||'加载中'}})</span>
        </span>
      </el-tab-pane>
    </el-tabs>

    <el-button icon="plus" v-if="checkRule('ajgl/lawcase/saveall',true)" @click="addHandle" size="mini" class="import-btn add">&nbsp新增
    </el-button>
    <el-button-group v-if="checkRule('ajgl/lawcase/list',true)">
      <el-button title="详情模式" @click="toggleType(1)" :class="{action:listType===1}"><i class="iconfont icon-fold"></i></el-button>
      <el-button title="列表模式" @click="toggleType(2)" :class="{action:listType===2}"><i class="iconfont icon-card-list"></i>
      </el-button>
    </el-button-group>
    <span title="筛选条件" class="iconfont icon-fold" v-if="checkRule('ajgl/lawcase/list',true)" style="float: right; padding: 6px 0 7px 15px; cursor: pointer;" @click="toggleEastCollapse"></span>
  </div>
</div>
</template>
<style lang="scss" scoped>
.search-menu-button {
    border: 1px solid #D7D7D7;
    cursor: pointer;
    height: 28px;
    width: 40px;
    overflow: hidden;
    i.search {
        padding-left: 10px;
        padding-right: 10px;
        color: #D7D7D7;
    }
    i.organ-button {
        background-color: #F2F2F2;
        color: #666;
        margin-top: 0;
        padding: 6px 5px 5px;
    }
    &:hover {
        border-color: #6FB6EA;
    }
}

.toolBar {
    text-align: right;
    z-index: 99;
    height: 28px;
    padding: 5px;
    background-color: #ffffff;
    border-bottom: 1px solid #d7d7d7;
    .el-button-group {
        .el-button {
            display: inline-block;
            width: 38px;
            text-align: center;
            height: 28px;
            line-height: 28px;
            padding: 2px 0 2px 3px;
            color: #53a9ff;
            border: 1px solid #cccccc;
            &.action,
            &:hover {
                background-color: #53a9ff;
                color: #ffffff;
            }
            &.adormBox,
            &.adormBox:hover {
                height: 28px;
                width: 25px;
                padding: 0;
                background-color: #f2f2f2;
                color: #c3c3c3;
                text-align: center;
            }
            &.iconBox,
            &.iconBox:hover {
                background-color: #ffffff;
                color: #cccccc;
                width: 45px;
                text-align: center;
                margin-left: 5px;
            }
            i {
                font-size: 20px;
            }
        }
    }
    .list {
        width: calc(100% - 10px);
        overflow: hidden;
    }
    .detail-box {
        position: relative;
        padding: 0 20px;
        margin-top: -1px;
        .give,
        .sign {
            margin: 0;
            padding: 0;
            background-color: #54a8e7;
            height: 30px;
            line-height: 30px;
            width: 70px;
            color: #ffffff;
            text-align: center;
        }
        .sign_up {
            margin: 0;
            padding: 0;
            background-color: #ff9933;
            height: 30px;
            line-height: 30px;
            width: 105px;
            color: #ffffff;
            text-align: center;
            border-color: #ff9933;
        }
        .return-button {
            color: #666666;
            position: absolute;
            left: 80px;
        }
    }
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { get } from '../../../utils/storage'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      tabValue: '0',
      pageListCount: { caseList_0: '', caseList_1: '' }
    }
  },
  props: ['unfold', 'listType', 'pageCountUpdate'],
  computed: {},
  methods: {
    toggleEastCollapse() {
      this.$emit('call:show-east');
    },
    toggleType: function (targetType) {
      if(targetType) this.$emit('call:change-type', targetType)
    },
    hideDetail() {
      this.$emit('call:change-message', true);
    },
    tabChange(tab) {
      // 选项卡切换
      this.$emit('call:tab-change', tab)
    },
    addHandle() {
      // 新增操作
      this.$emit('call:change-add')
    }
  },
  watch: {
    'pageCountUpdate' (val) {
      this.pageListCount = get('case_list_count') || this.pageListCount
    },
    'pageListCount.caseList_1' (val) {
      if(val === 0) {
        this.pageListCount.caseList_1 = '0'
      }
    },
    'pageListCount.caseList_0' (val) {
      if(val === 0) {
        this.pageListCount.caseList_0 = '0'
      }
    }
  },
  created() {
    this.tabChange({ name: this.tabValue })
  },
  mounted() {}
}
</script>
