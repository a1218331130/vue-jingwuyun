<!-- 案件研判-基础信息管理 -->
<template>
<div class="basic-box" ref="report-base-ref" id="report-base-ref">
  <el-row :gutter="10" v-if="checkUserRuleCase('ajgl/lawcase/info',caseId,true,cjrId)">
    <el-col :span="24">
      <basic-info class="box-item" @call:exportSnapshot="exportSnapshot('report-base-ref')"></basic-info>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="24">
      <person v-if="checkUserRuleCase('ajgl/personnel/list',caseId,true,cjrId) || checkUserRuleCase('ajgl/suspect/list',caseId,true,cjrId)"></person>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="12">
      <car class="box-item" v-if="checkUserRuleCase('ajgl/vehicle/list',caseId,true,cjrId)"></car>
    </el-col>
    <el-col :span="12">
      <item class="box-item" v-if="checkUserRuleCase('ajgl/article/list',caseId,true,cjrId)"></item>
    </el-col>
  </el-row>
    <html-to-image :height="snapshot.height" :printName="snapshot.name" :el="snapshot.el" :submit="snapshot.isTF" @generate="generateState"></html-to-image>
</div>
</template>

<style lang="scss" scoped>
.basic-box {
    padding: 10px;
    height: calc(100% - 20px);
    .box-item {
        padding: 10px;
    }
}
</style>
<script>
import mixin from '../../../utils/mixin'
import basicInfo from './basic-info'
import person from './person'
import car from './car'
import item from './item'
import htmlToImage from '../../../widgets/html-image/html-to-image.vue'
import { outerHeight } from '../../../utils/util'
export default {
  mixins: [mixin],
  components: {
    htmlToImage,
    'basic-info': basicInfo,
    person,
    car,
    item
  },
  props: ['loginJudgeMenu'],
  data() {
    return {
      penRecordListDialog: false,
      caseId: '',
      cjrId: '',
      snapshot: { // 研判报告快照参数初始化
        isTF: false,
        name: '研判报告',
        height: 0,
        el: document.body
      }
    }
  },
  computed: {},
  methods: {
    generateState(type) {
        // 快照生成结束,状态重置
      this.$('.handle-tool').css({ 'display': 'block' })
      this.$('.add-box-button').css({ 'display': 'block' })
      this.snapshot.isTF = false
      this.$(this.snapshot.el).remove();
    },
    exportSnapshot(r) {
      let _tDom = this.$('#' + r).clone().appendTo(document.body).css({'background-color': '#fff'})
      if(_tDom) {
        this.$('.handle-tool').css({ 'display': 'none' })
        this.$('.add-box-button').css({ 'display': 'none' })
        _tDom.css('width', this.$('#' + r).width());
        this.snapshot.height = outerHeight(_tDom[0])
        this.snapshot.el = _tDom[0]
        this.$nextTick(_ => {
          this.snapshot.isTF = true
        })
      }
    }
  },
  watch: {},
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    this.cjrId = this.$route.query.b // 初始化获取案件创建人id
  },
  mounted() {}
}
</script>
