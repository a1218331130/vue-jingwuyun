<template>
<div class="toolBar">
  <div class="list" v-if="listOfdetail===true">
    <el-button-group>
      <el-button @click="toggleType(1)"><i class="iconfont icon-fold"></i></el-button>
      <el-button @click="toggleType(2)"><i class="iconfont icon-card-list"></i></el-button>
    </el-button-group>
    <el-button-group>
      <div class="search-menu-button" @click="toggleEastCollapse">
        <i class="search el-icon-search"></i>
        <i :class="{'organ-button':true,'el-icon-d-arrow-right':unfold,'el-icon-d-arrow-left':!unfold}"></i>
      </div>
    </el-button-group>
  </div>
  <div class="detail-box" v-if="listOfdetail===false">
    <el-button type="text" class="return-button" @click="hideDetail"><i class="iconfont icon-return"></i>返回</el-button>
    <el-button class="give" icon="edit">32</el-button>
    <el-button class="sign">签收</el-button>
    <el-button class="sign_up">查看签收情况</el-button>
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
import mixin from '../../utils/mixin'
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {}
  },
  props: ['listOfdetail'],
  computed: {},
  methods: {
    toggleEastCollapse() {
      this.$emit('call:show-east');
    },
    toggleType: function(targetType) {
      if (targetType) this.$emit('call:change-type', targetType)
    },
    hideDetail() {
      this.$emit('call:change-message', true);
    }
  },
  created() {},
  mounted() {}
}
</script>
