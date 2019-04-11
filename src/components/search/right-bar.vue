<template>
<div class="right-bar">
  <!-- <right-toolbar title="查询列表" :params="filter" :options="filterOptions" @packup="packup" @update:params="searchSubmit"></right-toolbar> -->
  <el-tree ref="cateTree" :data="tree" node-key="id" :highlight-current="true" :indent="0" :render-content="renderContent" :default-expand-all="true"></el-tree>
</div>
</template>
<style lang="scss" scoped>
.right-bar {}
</style>
<script>
export default {
  data: () => ({

  }),
  props: ['data'],
  computed: {
    tree() {
      let res
      if (this.data) {
        res = this.data.map(c => {
          return {
            label: c.Name,
            id: c.ID,
            children: c.AggsBuckets.map((cc, i) => {
              return {
                type: c.ID,
                label: cc.Key,
                id: c.ID + '_' + i,
                count: cc.Total
              }
            })
          }
        })
      } else {
        res = []
      }
      return res
    }
  },
  methods: {
    clickEvents(data, node, store) {
      if (node.isLeaf === true) {
        this.currentItemId = node.id
        if (data.authority === false) {
          this.$alert('你没有权限查询该表数据, 请联系管理员开通.', '温馨提示');
        } else {
          this.$emit('update:value', { data: data })
        }
      } else {
        return false
      }
    },
    renderContent(h, { data, node, store }) {
      let content = h('span', {
        class: { 'cat-tree__item': true, 'cat-tree__item__current': node.id === this.currentItemId },
        on: {
          click: () => {
            this.clickEvents(data, node, store)
          }
        }
      }, [h('i', {
        // class: 'iconfont icon-note'
      }), h('span', {
        class: 'cat-tree__item__label',
        attrs: { title: data.label }
      }, data.label), h('span', {
        class: 'cat-tree__item__count'
      }, data.count)])
      return content
    }
  }
}
</script>
