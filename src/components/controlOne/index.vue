<!-- 对象管控 -->
<template>
<page-container>
  <!-- 主体内容-->
  <div class="welcome">
    <router-view class="app-center_view"></router-view>
  </div>
</page-container>
</template>

<style scoped lang='scss'>
  .page-container {
    background: #f5f5f5;
    .app-center_view {
      position: relative;
      height: 100%;
    }
  }

</style>

<script>
  import rightToolbar from '../../widgets/right-toolbar/right-toolbar.vue'
  import PageContainer from '../common/page-container.vue'
  export default {
    components: {
      rightToolbar,
      PageContainer
    },
    data() {
      return {
        filter: {
          keyword: '',
          type: [],
          postTime: [],
          grade: '',
          state: '',
          enclosure: '',
          signState: ''
        },
        options: [{
          title: '关键字',
          prop: 'keyword',
          type: 'search'
        }, {
          title: '类型',
          prop: 'type',
          type: 'checkbox',
          children: [
            { label: '通知通报', value: '通知通报' },
            { label: '进度汇报', value: '进度汇报' },
            { label: '行政通告', value: '行政通告' },
            { label: '案件监察', value: '案件监察' },
            { label: '党务文化', value: '党务文化' },
            { label: '重点工作', value: '重点工作' }
          ]
        }, {
          title: '发布时间',
          prop: 'postTime',
          type: 'checkbox',
          children: [
            { label: '一天内', value: '一天内' },
            { label: '三天内', value: '三天内' },
            { label: '一周内', value: '一周内' },
            { label: '一个月内', value: '一个月内' },
            { label: '半年内', value: '半年内' },
            { label: '一年内', value: '一年内' }
          ]
        }, {
          title: '等级',
          prop: 'grade',
          type: 'radio',
          children: [
            { label: '非常紧急', value: '非常紧急' },
            { label: '紧急', value: '紧急' },
            { label: '普通', value: '普通' }
          ]
        }, {
          title: '状态',
          prop: 'state',
          type: 'radio',
          children: [
            { label: '已读', value: '已读' },
            { label: '未读', value: '未读' }
          ]
        }, {
          title: '附件',
          prop: 'enclosure',
          type: 'radio',
          inline: true,
          children: [
            { label: '有', value: '有' },
            { label: '无', value: '无' }
          ]
        }, {
          title: '签收状态',
          prop: 'signState',
          type: 'radio',
          inline: true,
          children: [
            { label: '已签', value: '已签' },
            { label: '未签', value: '未签' }
          ]
        }]
      }
    },
    props: {},
    methods: {
      unfoldHandle(s) {
        // 外部操作更新窗体状态
        this.unfoldT = s
      },
      sideState(s) {
        // 窗体自身操作更新窗体状态
        this.unfoldT = s
      },
      searchSubmit() {}
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
