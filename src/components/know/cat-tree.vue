<template>
<div class="">
  <el-tree v-if="knowCateTree.length>0" class="orgTree" :data="knowCateTree" :props="{children: 'Children', label: 'Name', id: 'KeyId'}" node-key="KeyId" :default-expanded-keys="['1']" :highlight-current="true" @node-click="catChange" :render-content="renderContent"></el-tree>
</div>
</template>

<style scoped>
</style>
<script>
import { mapState } from 'vuex'
import { ZSK_FL_GET_TREE_SELECT } from '../../store/types'
import mixin from '../../utils/mixin'
import { listToTree } from '../../utils/listToTree'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {}
  },
  props: {},
  computed: {
    knowCateTree() {
      let res
      if (this.knowCate.Model) {
        this.knowCate.Model.forEach((d, i) => {
          if (d.Children && d.Children.length === 0) {
            delete d.Children
          }
        })
        res = [{
          KeyId: '',
          Name: '全部',
          ParentId: '',
          Children: [...listToTree(this.knowCate.Model, '', 0, {
            id: 'KeyId',
            parentId: 'ParentId',
            children: 'Children'
          })]
        }]
      } else {
        res = []
      }
      return res
    },
    ...mapState(['knowCate'])
  },
  watch: {},
  methods: {
    catChange(data, node, store) {
      this.$emit('click', {
        id: data.KeyId,
        level: data.Level,
        name: data.Name
      })
    },
    renderContent(h, { data, node, store }) {
      let content
      if (node.isLeaf === true) {
        content = h('span', {}, [data.Name])
      } else {
        content = h('span', {
          class: 'cat-tree__item',
          style: node.level === 1 ? 'line-height: 32px; right:0; left:20px;' : ''
        }, [h('i', {
          class: 'iconfont icon-note',
          style: 'line-height: 32px;'
        }), data.Name])
      }
      return content
    }
  },
  created() {

  },
  mounted() {
    this.$emit('update:loading', true)
    this.dispatch(ZSK_FL_GET_TREE_SELECT).then(() => {
      this.$emit('update:loading', false)
    })
  }
}
</script>
