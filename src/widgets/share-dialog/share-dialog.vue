<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="分享" :modal-append-to-body="true" :size="size" :close-on-click-modal="false" :append-to-body="true" @open="initDialog" :before-close="closeEvent">
  <el-form class="form-box" :model="form">
    <!-- <div class="share-content">
      <el-form-item label="分享内容"></el-form-item>
      <div class="content">{{content.text}}</div>
    </div> -->
    <div class="selector-wrap">
      <div class="p-title">选择分享对象</div>
      <div class="tree-box">
        <el-input size="mini" v-model="treeKeyword" icon="search" placeholder="通过单位名称搜索"></el-input>
        <el-tree ref="shareOrgTree" class="cat-tree" v-if="tree.length>0" :data="tree" :props="{children:'children', parentId:'parentId', label:'name'}" node-key="id" :highlight-current="true" :indent="0" :filter-node-method="filterNode" :default-expand-all="false"
          @node-click="nodeClick"></el-tree>
      </div>
      <el-transfer v-model="form.targets" :data="person" :titles="['选择人员','已选人员']" filterable :filter-method="filterMethod"></el-transfer>
    </div>
  </el-form>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.form-box {
    padding: 0 10px;
    .share-content {
        width: 650px;
        margin: 0 auto 20px;
    }
    .el-form-item {
        margin-bottom: 0;
    }
    .content {
        line-height: 22px;
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { POST_SHARE, FETCH_USER_DICTS } from '../../store/types'

import { Transfer } from 'element-ui';
import mixin from '../../utils/mixin'
/**
 * @module ShareDialog
 * @desc 分享组件
 *
 * @example <dialog-share :dialog="dialog" :content="content" :features="{name: '检索结果', type: '5'}" @close="dialog=false"></dialog-share>
 */
export default {
  mixins: [mixin],
  components: {
    'el-transfer': Transfer
  },
  data() {
    return {
      value: [],
      person: [],
      tree: [],
      form: {
        type: '',
        targets: [],
        content: ''
      },
      treeKeyword: ''
    }
  },
  /**
   * 接收参数
   * @prop {Boolean} dialog 是否打开窗口 @default false
   * @prop {String} size 窗口大小,详情请参考当前项目对应elementUI客化样式文件 @default 'large--fixed'
   * @prop {Object} content 需分享的内容对象 @default null
   * @prop {String} content.text 需分享的内容字符串
   * @prop {Object} features  @default
   * @prop {String} features.name  @default
   * @prop {String} features.type  @default
   */
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'large--fixed'
    },
    content: {
      type: Object,
      default: null
    },
    features: {
      type: Object,
      default: () => {
        return {
          name: '战法结果',
          type: '4'
        }
      }
    }
  },
  computed: {
    ...mapState(['dict'])
  },
  watch: {
    treeKeyword(val) {
      this.$refs.shareOrgTree.filter(val)
    }
  },
  methods: {
    initDialog() {
      this.reset()
    },
    filterMethod(keyword, item) {
      return item.label.indexOf(keyword) !== -1
    },
    filterNode(value, data) {
      if(!value) {
        return true
      } else {
        return data.name.indexOf(value) !== -1
      }
    },
    nodeClick(data, node, store) {
      this.dispatch(FETCH_USER_DICTS, { DeptNo: data.orgId }, null, true).then(() => {
        this.person = [...this.dict.fetchUserDicts.map((d, i) => {
          return {
            key: d.KeyId,
            id: d.KeyId,
            label: d.DictName,
            disabled: false
          }
        })]
      })
    },
    submit() {
      this.dispatch(POST_SHARE, {
        SourceId: '',
        NoticeFeaturesName: this.features.name,
        NoticeFeaturesType: this.features.type,
        Content: this.content.text,
        ReceiveUsers: this.form.targets.map(d => { return { ReceiveUserId: d } })
      }).then(() => {
        this.$message({
          type: 'success',
          message: '您的内容已成功分享',
          showClose: true
        })
        /**
         * 关闭窗口
         * @event module:ShareDialog~close
         */
        this.$emit('close')
      })
    },
    closeEvent() {
      this.$emit('close')
    },
    reset() {

    }
  },
  created() {
    this.getRuleOrgTree().then(res => {
      this.tree = res
    })
  },
  mounted() {}
}
</script>
