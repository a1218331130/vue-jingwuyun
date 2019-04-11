<template>
<ul class="top-menu">
  <!-- <li>
    <el-button type="primary" size="mini" class="import-btn iconfont icon-import">&nbsp;导入</el-button>
  </li> -->
  <li>
    <el-button size="mini" icon="plus" class="import-btn add" @click="addHandle">新增</el-button>
  </li>
  <li>
    <el-button type="danger" size="mini" icon="delete" class="import-btn delete" @click="handleDelete">批量删除</el-button>
  </li>
  <li>
    <el-button type="info" size="mini" icon="edit" class="import-btn out" @click="handleOut">数据导出</el-button>
  </li>
  <li>
    <el-button-group>
      <el-button size="mini" title="详情模式" @click="toggleType(1)" :class="{action:listType===1}"><i class="iconfont icon-fold"></i></el-button>
      <el-button size="mini" title="列表模式" @click="toggleType(2)" :class="{action:listType===2}"><i class="iconfont icon-card-list"></i>
      </el-button>
    </el-button-group>
  </li>

  <li>
    <div class="search-menu-button" @click="unfoldFun" style="border: 0;padding: 5px;">
      <i class="unfold-button_i iconfont icon-sousuo"></i>
      <!--<i class="search el-icon-search"></i>-->
      <!-- <i :class="{'organ-button':true,'el-icon-d-arrow-right':unfold,'el-icon-d-arrow-left':!unfold}"
        ></i>-->
    </div>
  </li>
</ul>
</template>

<style scoped lang='scss'>
  .top-menu {
    list-style: none;
    float: right;
    height: 40px;
    margin: 0;
    position: fixed;
    right: 0;
    li {
      float: left;
      margin-right: 10px;
      margin-top: 5px;
      .import-btn {
        border-radius: 3px;
        border: none;
        padding: 7px 10px;
        background-color: #6FB6EA;
        &.add {
          background-color: #FF9900;
          color: #fff;
        }
        &.delete {
          background-color: #ff6b6b;
          color: #fff;
        }
        &.out {
          background-color: #6FB6EA;
          color: #fff;
        }
      }
      .search-menu-button {
        border: 1px solid #D7D7D7;
        cursor: pointer;
        i.search {
          padding-left: 10px;
          padding-right: 10px;
          color: #D7D7D7;
        }
        i.organ-button {
          background-color: #F2F2F2;
          color: #666;
          margin-top: 0;
          padding: 6px 5px;
        }
        &:hover {
          border-color: #6FB6EA;
        }
      }
    }
  }

</style>

<script>
  import bus from '../../utils/bus'
  export default {
    computed: {},
    data() {
      return {
        listType: '1',
        unfold: false
      }
    },
    props: {
      unfoldState: {
        type: Boolean,
        default: false
      },
      FocusType: {
        type: String,
        default: '000002'
      }
    },
    methods: {
      unfoldFun() {
        // console.log(this.unfold, '右侧搜索');
        this.unfold = !this.unfold
        this.$emit('unfoldHandle', this.unfold)
      },
      handleDelete() {
        this.$emit('handleDelete', this.FocusType)
      },
      handleOut() {
        this.$emit('handleOut', this.FocusType)
      },
      addHandle() {
        // 新增操作
        this.$emit('handleAdd', this.FocusType)
        bus.$emit('add', false)
      },
      toggleType: function(targetType) {
        if (targetType) this.$emit('call:change-type', targetType)
      }
    },
    watch: {
      unfoldState(v) {
        this.unfold = v
      }
    },
    mounted() {},
    created() {}
  }

</script>
