<!-- 各个模块头部工具区域 -->
<template>
  <div class="header-tool">
    <span class="d-sub-title iconfont icon-iconziti23">{{title}}</span>
    <dl class="handle-tool" v-if="tool">
      <!--<dd >关注</dd>-->
      <dd class="iconfont icon-share">分享</dd>
      <dd>
        <el-button type="text" class="export-text iconfont icon-daochu" @click="exportSnapshot">导出</el-button>
        <html-to-image :height="snapshotHeight" :printName="snapshotName" :submit="snapshot"
                       @generate="generateState"></html-to-image>
      </dd>
      <dd>
        <printButton btnType="text" class="print-text iconfont icon-dayin"></printButton>
      </dd>
    </dl>
  </div>
</template>
<style scoped lang="scss">
  .header-tool {
    overflow: hidden;
    border-bottom: 2px solid #46BDFD;
    color: #46BDFD;
  }

  .d-sub-title {
    float: left;
    font-size: 14px;
    line-height: 45px;
  }

  .handle-tool {
    float: right;
    padding: 0;
    margin: 9px;
    dd {
      float: left;
      width: 65px;
      height: 28px;
      background-color: #46BDFD;
      line-height: 28px;
      color: #fff;
      text-align: center;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
      .print-text {
        padding: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 100%;
      }
      .export-text {
        padding: 0;
        color: #fff;
        font-size: 14px;
        width: 100%;
        height: 100%;
      }
      &:hover {
        background-color: #ff9900;
      }
    }

    .icon-move:before {
      margin-right: 3px;
    }
    .icon-save:before {
      margin-right: 3px;
    }
    .icon-export:before {
      margin-right: 3px;
    }
  }
</style>
<script>
  import printButton from '../../../../widgets/print/print.vue'
  import htmlToImage from '../../../../widgets/html-image/html-to-image.vue'
  import {closestRef, outerHeight} from '../../../../utils/util'
  export default{
    data() {
      return {
        snapshot: false,
        snapshotName: '人员档案',
        snapshotHeight: 0
      }
    },
    props: {
      title: {
        type: String,
        default: '标题'
      },
      tool: {
        type: Boolean,
        default: false
      }
    },
    components: {
      htmlToImage,
      printButton
    },
    methods: {
      exportSnapshot() {
        // 开始导出
        closestRef(this, 'people-dossier-ref', dom => {
          this.snapshotHeight = outerHeight(dom)
          this.$nextTick(_ => {
            this.snapshot = true
          })
        })
      },
      generateState(type) {
        // 快照生成结束,状态重置
        this.snapshot = false
      }
    },
    created() {
    }
  }
</script>
