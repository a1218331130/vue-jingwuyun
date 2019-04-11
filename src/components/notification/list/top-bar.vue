<template>
<div class="toolBar">
  <div class="top-menu">
    <el-button class="btn-add" type="primary" size="mini" icon="icon iconfont icon-plus" @click="add">新增</el-button>
    <el-button-group>
      <el-button @click="toggleType(1)"><i class="iconfont icon-fold"></i></el-button>
      <el-button @click="toggleType(2)"><i class="iconfont icon-card-list"></i></el-button>
    </el-button-group>
    <el-button style="padding: 3px 12px;" @click="unfoldFun">
      <i class="iconfont icon-fold"></i>
      <!--<i class="search el-icon-search"></i>-->
      <!-- <i :class="{'organ-button':true,'el-icon-d-arrow-right':unfold,'el-icon-d-arrow-left':!unfold}"
          ></i>-->
    </el-button>
  </div>
</div>
</template>

<style scoped lang='scss'>
.return-button {
    color: #666666;
    position: absolute;
    left: 80px;
    top: 0;
}

.toolBar {
    text-align: left;
    z-index: 99;
    height: 28px;
    padding: 5px;
    background-color: #ffffff;
    border-bottom: 1px solid #d7d7d7;
    .top-menu {
        .el-button {
            &.btn-add {
                background-color: #FF9900;
                color: #fff;
                height: 29px;
                line-height: 29px;
                padding: 0 10px;
                border: 0;
                border-radius: 3px;
                .iconfont {}
            }
        }
    }
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

}

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

.top-menu {
    padding: 0;
    list-style: none;
    float: right;
    margin: 0;
    .import-btn {
        border-radius: 3px;
        border: none;
        padding: 7px 10px;
        background-color: #6FB6EA;
        &.add {
            background-color: #FF9900;
            color: #fff;
        }
    }
    .search-menu-button {
        border: 1px solid #D7D7D7;
        width: 60px;
        cursor: pointer;
        padding: 0;
        margin-top: 0;
        border-radius: 0;
        background-color: #ffffff;
        i.search {
            padding-left: 5px;
            padding-right: 5px;
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
</style>

<script>
import bus from '../../../utils/bus'
export default {
  computed: {},
  data() {
    return {
      unfold: false
    }
  },
  props: {
    unfoldState: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hideDetail() {
      this.$emit('call:change-message', true);
    },
    toggleType: function(targetType) {
      if (targetType) this.$emit('call:change-type', targetType)
    },
    unfoldFun() {
      this.unfold = !this.unfold
      this.$emit('unfoldHandle', this.unfold)
    },
    addHandle() {
      // 新增操作
      bus.$emit('control.addHandle')
    },
    add() {
      this.$emit('call:add')
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
