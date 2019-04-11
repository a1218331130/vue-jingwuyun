<template>
<div class="toolBar">
  <el-button-group>
    <el-button @click="toggleType(1)"><i class="iconfont icon-fold"></i></el-button>
    <el-button @click="toggleType(2)"><i class="iconfont icon-card-list"></i></el-button>
  </el-button-group>
  <el-button-group>
    <div @click="toggleEastCollapse">
      <el-button class="iconBox"><i class="iconfont icon-sousuo"></i></el-button>
      <el-button class="adormBox"><i class="iconfont icon-card-list"></i></el-button>
    </div>
  </el-button-group>
</div>
</template>
<style lang="scss" scoped>
.toolBar {
    z-index: 99;
    text-align: right;
    height: 40px;
    padding: 5px 0;
    width: 100%;
    background-color: #ffffff;
    border-bottom: 1px solid #d7d7d7;
    .el-button-group {
        .el-button {
            display: inline-block;
            width: 40px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            padding: 2px 0 2px 3px;
            color: #53a9ff;
            border: 1px solid #cccccc;
            &:hover {
                background-color: #53a9ff;
                color: #ffffff;
            }
            &.adormBox,
            &.adormBox:hover {
                height: 30px;
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
  props: [],
  computed: {},
  methods: {
    toggleEastCollapse() {
      this.$emit('call:show-east');
    },
    toggleType: function(targetType) {
      if (targetType) this.$emit('call:change-type', targetType)
    }
  },
  created() {},
  mounted() {}
}
</script>
