<!-- 右侧栏目盒子 【2017年9月4日15:56:57】
:unfoldHandle  Boolean  侧栏状态是否展开  true / false
@unfoldState Funtion 侧栏状态更新回调  true / false
-->
<template>
<div :class="{'side-box':true,'side-box-initShow':initShow}" ref="side_box">
  <slot></slot>
</div>
</template>

<style scoped lang='scss'>
  .side-box {
    /*min-width: 309px;*/
    width: 309px;
    height: calc(100% - 70px);
    background-color: #fff;
    border-left: 1px solid #ccc;
    position: absolute;
    right: 0;
    top: 40px;
    padding: 15px 10px;
    transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -moz-transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -webkit-transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    -o-transition: right 0.5s cubic-bezier(0.21, 0.99, 0.59, 1.03);
    overflow: scroll;
    &.side-box-initShow {
      opacity: 0;
    }
  }

</style>

<script>
  export default {
    computed: {},
    data() {
      return {
        unfoldState: true,
        initShow: true
      }
    },
    props: {
      unfoldHandle: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      unfold() {
        if (this.initShow) {
          this.initShow = false
        }
        this.$refs.side_box.style.right = '0px'
        this.unfoldState = true
      },
      packup() {
        this.$refs.side_box.style.right = '-' + this.$refs.side_box.offsetWidth + 'px'
        this.unfoldState = false
      }
    },
    watch: {
      unfoldHandle(val) {
        // 接受窗体状态响应
        if (val) {
          this.unfold()
        } else {
          this.packup()
        }
      },
      unfoldState(val) {
        // 更新窗体状态，回调
        this.$emit('unfoldState', this.unfoldState)
      }

    },
    mounted() {
      this.packup()
    },
    created() {}
  }

</script>
