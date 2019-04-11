<template>
<form :action="action" method="post" :ref="formRef" v-loading.fullscreen.lock="submit" element-loading-text="快照生成中...">
  <input name="image64" type="hidden" :value="imageBase" />
  <input name="name" type="hidden" :value="printName+ '_' + getTimeIndex()" />
</form>
</template>

<style scoped>

</style>

<script>
import html2canvas from 'html2canvas'
import { IMAGE_CONVERSION_PATH } from '../../config'

/**
 * @module HtmlToImage
 * @desc 页面生成快照导出组件
 *
 * 依赖：html2canvas.js
 *
 * 服务端支持接口：config.js ==> IMAGE_CONVERSION_PATH
 *
 *  @example <html-to-image :el="element" :name="snapshotName" :submit="snapshot" @generate="generateState"></html-to-image>
 */
export default {
  data() {
    return {
      formRef: '',
      action: IMAGE_CONVERSION_PATH,
      imageBase: '',
      option: {
        allowTaint: false,
        useCORS: true
      }
    }
  },
  /**
   * 接收参数
   * @prop {String} printName 导出快照文件名 @default '页面快照'
   * @prop {Number} width 快照图片宽 @default 0
   * @prop {Number} height 快照图片高 @default 0
   * @prop {Boolean} submit 是否导出快照 @default false
   * @prop {HTMLElement} el 生成快照的DOM
   */
  props: {
    printName: {
      type: String,
      default: '页面快照'
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    submit: {
      type: Boolean,
      default: false
    },
    el: HTMLElement
  },
  watch: {
    /**
     * 触发快照生成事件
     * */
    submit(val) {
      if(val) {
        this.generate()
      }
    }
  },
  methods: {
    getTimeIndex() {
      let t = new Date()
      let Month = t.getMonth() + 1
      let Day = t.getDate()
      let strTak = t.getMilliseconds();
      let str = t.getFullYear() + (Month > 10 ? Month : '0' + Month) + (Day > 10 ? Day : '0' + Day) + strTak
      return str
    },
    generate() {
      if(this.width > 0) this.option.width = this.width
      if(this.height > 0) this.option.height = this.height
      this.snapshotLoLoading(this.option, this.el)
    },
    snapshotLoLoading(opt = {}, el = document.body) {
      html2canvas(el, opt).then(canvas => {
        let imgBase = canvas.toDataURL('image/png')
        this.imageBase = imgBase
        this.$nextTick(_ => {
          // 导出快照
          this.$refs[this.formRef].submit()

          /**
           * 快照生成完成
           * @event module:HtmlToImage~generate
           * @param {Boolean} a true:快照导出成功  false:快照导出失败
           */
          this.$emit('generate', true)

          this.$message({
            type: 'success',
            message: '快照导出成功！',
            duration: 1500
          })
        })
      }).catch(res => {
        console.log('快照生成失败', res)
        this.$message({
          type: 'warning',
          message: '快照生成失败，请重试！',
          duration: 1500
        })
        this.$emit('generate', false)
      })
    },
    /**
     * 生成form 节点对象 ref name,防止重复
     */
    refNameGenerate() {
      let formDom = 'snapshot-form-' + new Date().getTime()
      if(!this.$refs[formDom]) {
        this.formRef = formDom
      } else {
        this.refNameGenerate()
      }
    }
  },
  created() {
    this.refNameGenerate()
    // 页面初始化加载判断是否导出快照
    if(this.submit) {
      this.generate()
    }
  }
}
</script>
