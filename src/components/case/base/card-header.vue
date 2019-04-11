<!-- 各个模块头部工具区域 -->
<template>
  <div class="header-tool">
    <span :class="{'d-sub-title iconfont':true,'icon-iconziti23':titleTipIcon}">{{title}}</span>
    <slot name="toggle"></slot>
    <dl class="handle-tool" v-if="tool&&tranInfo.tool">
      <!--<dd >关注</dd>-->
      <!-- <dd class="iconfont icon-share">分享</dd> -->
      <slot name="export"></slot>
      <dd v-if="add===false">
        <el-button type="text" class="export-text iconfont icon-xinjianbiji" @click="editEvent">编辑
        </el-button>
      </dd>
      <dd style="background-color:#f90 ;" v-if="add===true">
        <el-button type="text" class="export-text iconfont icon-plus" @click="addEvent">添加</el-button>
        <!-- <html-to-image :height="snapshotHeight" :printName="snapshotName" :submit="snapshot" @generate="generateState"></html-to-image> -->
      </dd>
      <!-- <dd>
          <printButton btnType="text" class="print-text iconfont icon-dayin"></printButton>
        </dd> -->
    </dl>
    <dl class="handle-tool" v-if="tool&&!tranInfo.tool">
      <slot name="export"></slot>
    </dl>
  </div>
</template>
<style scoped lang="scss">
  .header-tool {
    overflow: hidden;
    border-bottom: 2px solid #46BDFD;
    color: #46BDFD;
    position: relative;
  }

  .d-sub-title {
    float: left;
    font-size: 18px;
    font-weight: bolder;
    line-height: 32px;
  }

  .handle-tool {
    padding: 0;
    margin: 0;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
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
  import printButton from '../../../widgets/print/print.vue'
  import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
  import { closestRef, outerHeight } from '../../../utils/util'
  export default {
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
      },
      'switch-edit-text': {
        type: String,
        default: ''
      },
      add: {
        type: Boolean,
        default: false
      },
      titleTipIcon: {
        type: Boolean,
        default: true
      },
      tranInfo: {
        type: Object,
        default: function() {
          return {
            print: true,
            exportSnapshot: true,
            tool: true
          }
        }
      }
    },
    watch: {},
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
      },
      editEvent() {
        this.$emit('call:edit')
      },
      addEvent() {
        this.$emit('call:add')
      }
    },
    created() {}
  }

</script>
