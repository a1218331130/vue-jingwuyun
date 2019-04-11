<!-- 系统简介组件 -->
<!--
  使用说明：
    接收参数
      contentId:绑定功能简介ID
      btnClass:按钮样式
      btnType:按钮类型

      标题等内容在系统管理-系统功能-功能简介中配置
-->
<template>
<!-- <transition>
    <el-button @click="print" :type="btnType" :class="btnClass">打印</el-button>
  </transition> -->
<!-- <div> -->

<transition>
  <el-button :title="briefInfo.ssmk?'点击查看'+briefInfo.ssmk:'暂无'+'-简介'" type="btnType" :class="btnClass" style="font-size:24px;padding-top: 0px" v-popover:popover>
    <el-popover class="brief-popover-title" placement="bottom" :title="briefInfo.bt" ref="popover" trigger="click">
      <template scope="scope">
        <div v-html="decodeURIComponent(briefInfo.gnms)"></div>
      </template>
    </el-popover>
  </el-button>
</transition>


<!-- </div> -->
</template>


<script>
import mixin from '../../utils/mixin'
import { mapState } from 'vuex'
import {
  SYS_BRIEF_INFO
} from '../../store/types'
export default {
  mixins: [mixin],
  props: {
    btnType: {
      type: String,
      default: 'default'
    },
    btnClass: {
      type: String,
      default: 'el-button export-text iconfont icon-tiwen el-button--text'
    },
    contentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      handle: null,
      briefInfo: {
        id: '',
        bt: '标题',
        gnms: '暂无',
        ssmk: '暂无'
      }
    }
  },
  computed: {
    ...mapState(['brief'])
  },
  methods: {},
  mounted() {
    this.dispatch(SYS_BRIEF_INFO, { id: this.contentId }).then(d => {
      if(this.brief.sysBriefInfo) {
        this.briefInfo = this.brief.sysBriefInfo
      }
    })
  }
}
</script>
