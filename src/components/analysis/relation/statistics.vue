<template>
<div class="statistics">
  <div class="statistics__box">
    <div class="right-bar__title">节点 ({{nodeList.length}})</div>
    <div class="statistics__box__list">
      <div class="list__item" v-for="item in nodeList">
        <div class="list__item__label">{{item.label}} ({{item.value}})</div>
        <div class="list__item__value">
          <el-progress :percentage="item.percentage" :show-text="false" status="success"></el-progress>
        </div>
      </div>
    </div>
  </div>

  <div class="statistics__box">
    <div class="right-bar__title">关系 ({{linkList.length}})</div>
    <div class="statistics__box__list">
      <div class="list__item" v-for="item in linkList">
        <div class="list__item__label">{{item.label}} ({{item.value}})</div>
        <div class="list__item__value">
          <el-progress :percentage="item.percentage" :show-text="false" status="success"></el-progress>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    nodeList: [],
    linkList: []
  }),
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          nodeDataArray: [],
          linkDataArray: []
        }
      }
    }
  },
  computed: {
    ...mapState(['analysisRelation'])
  },
  watch: {
    data(data) {
      let nodeRes = [],
        linkRes = []

      // 节点统计
      data.nodeDataArray.forEach(d => {
        let cat = this.getNodeTypeByCategory(d.category),
          item = nodeRes.find(c => c.label === cat)
        if (!item) {
          nodeRes.push({
            label: cat,
            value: 1
          })
        } else {
          item.value += 1
        }
      })
      nodeRes.forEach(d => {
        d['percentage'] = (d.value / data.nodeDataArray.length) * 100
      })
      this.nodeList = [...nodeRes]

      // 关系统计
      data.linkDataArray.forEach(d => {
        let item = linkRes.find(c => c.label === d.text)
        if (!item) {
          linkRes.push({
            label: d.text,
            value: 1
          })
        } else {
          item.value += 1
        }
      })
      linkRes.forEach(d => {
        d['percentage'] = (d.value / data.linkDataArray.length) * 100
      })
      this.linkList = [...linkRes]
    }
  },
  methods: {
    getNodeTypeByCategory(category) {
      let res
      switch (category) {
        case 'person':
          res = '人员'
          break;
        case 'tel':
          res = '电话'
          break;
        case 'car':
          res = '车辆'
          break;
        case 'case':
          res = '案件'
          break;
        default:
          res = '其他'
      }
      return res
    },
    /**
     * [getNodeType description]
     * @param  {[type]} typeString [description]
     * @return {[type]}            [description]
     */
    getNodeType(typeString) {
      let res = null
      if (typeString && this.analysisRelation.resultObjectTypeList && this.analysisRelation.resultObjectTypeList.length > 0) {
        res = this.analysisRelation.resultObjectTypeList.find(d => d.NODE === typeString).TYPE
      }
      return res
    }
  }
}
</script>
