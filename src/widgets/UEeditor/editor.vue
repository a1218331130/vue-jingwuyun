<template>
<script :id="elmId" type="text/plain"></script>
</template>
<script>
/**
 * @module UEeditor
 * @desc 基于UEeditor的编辑器
 *
 * @example <UE ref="processBusEditor" v-model="formService.Note" :height="300" :transcode="true"></UE>
 */
export default {
  name: 'UE',
  data: () => ({
    editor: null,
    content: '',
    ueConfig: {
      serverUrl: '', // 上传路径
      zIndex: 2002,
      enableContextMenu: false,
      scaleEnabled: false,
      toolbars: [[
        'source', '|', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist',
        'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'directionalityltr', 'directionalityrtl', 'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
        'link', 'unlink', 'anchor', '|',
        'horizontal', 'date', 'time', 'spechars', '|',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols'
      ]],
      elementPathEnabled: false
    }
  }),
  /**
   * 接收参数
   * @prop {String} elementId 元素唯一ID
   * @prop {String} resMode 结果类型 (html|text) @default 'html'
   * @prop {Boolean} transcode 是否需要转码(URIComp)
   * @prop {String} toolbarMode 工具栏模式, 编辑器工具栏基项, 如配置了config.toolbars, 将会使用config.toolbars 覆盖本配置,  rich: 丰富工具栏, simple: 精简版工具栏 @default 'simple'
   * @prop {Number} width 编辑器初始宽度 @default 800
   * @prop {Number} height 编辑器初始高度 @default 300
   * @prop {Boolean} scale 是否允许缩放 @default false
   * @prop {Object} config UEeditor原配置项, 非必要时无需使用, 详情请参考UEeditor官方文档
   *
   */
  props: {
    elementId: {
      type: String,
      default: ''
    },
    resMode: {
      type: String,
      default: 'html'
    },
    transcode: {
      type: Boolean,
      default: false
    },
    toolbarMode: {
      type: String,
      default: 'simple' //
    },
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 300
    },
    scale: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    elmId() {
      return this.elementId !== '' ? `ueeditor_${this.elementId}` : `ueeditor_${this.$route.path}`
    }
  },
  methods: {
    /**
     * 获取编辑器内容
     */
    getContent() {
      console.log(this.editor.hasContents(), this.editor.getContent());
    },
    setContent(val = null) {
      this.editor.setContent(this.transcode === true ? decodeURIComponent(val === null ? this.value : val) : (val === null ? this.value : val))
    }
  },
  mounted() {
    if(this.toolbarMode === 'simple') {
      this.ueConfig.toolbars = [
        [
          'source', '|', 'undo', 'redo', '|',
          'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', '|', 'forecolor', 'backcolor',
          '|', 'fontfamily', 'fontsize', '|',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
          'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols'
        ]
      ]
    }
    if(!this.editor) {
      this.ueConfig.initialFrameWidth = this.width
      this.ueConfig.initialFrameHeight = this.height
      this.ueConfig.scaleEnabled = this.scale

      this.editor = this.UE.getEditor(this.elmId, this.ueConfig)
      this.editor.addListener('contentChange', (e) => {
        let res = this.resMode === 'text' ? this.editor.getContentTxt() : this.editor.getContent()
        if(this.transcode === true) res = encodeURIComponent(res)
        this.$emit('input', res)
      })
    }
    this.editor.addListener('ready', () => {
      this.setContent()
    })
  },
  destroyed() {
    this.editor.destroy()
  }
}
</script>
