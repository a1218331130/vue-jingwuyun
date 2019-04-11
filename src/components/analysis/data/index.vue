<template>
<analysisBox @call:showMiniModel="miniSider">
  <div slot="sunWest">
    <sidebar @call:comm="commChange" :miniModel="miniModel"></sidebar>
  </div>
  <div slot="sunCenter" class="content-box">
    <across v-show="currentComm==='across'" ref="across" :currentComm="currentComm"></across>
    <exclude v-show="currentComm==='exclude'" ref="exclude" :currentComm="currentComm"></exclude>
    <forms v-show="currentComm==='form'" ref="form" :currentComm="currentComm"></forms>
    <!-- <manage v-show="currentComm==='manage'" ref="manage" :currentComm="currentComm">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar"></i>
    </manage> -->
    <datalists v-show="currentComm==='datalist'" ref="datalist" :currentComm="currentComm">
      <i slot="switchRightBarBtn" :class="[ 'iconfont', showRightBar ? 'icon-fold': 'icon-unfold']" @click="switchRightBar()"></i>
    </datalists>
    <!-- 侧边栏(右工具按钮) -->
    <side-right-box v-if="currentComm === 'datalist'" style="height:calc(85% - 20px); top:97px;" :unfoldHandle="showRightBar">
      <right-toolbar title="查询列表" :params="filter" :options="filterOptions" @packup="this.showRightBar = false" @update:params="searchSubmit"></right-toolbar>
    </side-right-box>
  </div>
</analysisBox>
</template>

<style lang="scss" scoped>
  .content-box {
    height: 100%; // overflow: hidden;
    .side-box {
      top: 97px;
      height: calc(100% - 130px);
    }
    .cat-tree {
      border: none;
    }
  }

</style>


<script>
  // import { getOnlyArray } from '../../../utils/util'
  import baseMixin from '../baseMixin'
  import analysisBox from '../layout'
  import sidebar from './sidebar'
  import datalists from './datal/index'
  import across from './comparison-type/across'
  import exclude from './comparison-type/exclude'
  import forms from './comparison-type/form'
  // import manage from './custom/manage'

  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  import bus from '../../../utils/bus'
  export default {
    mixins: [baseMixin, mixin],
    components: {
      analysisBox,
      datalists,
      sidebar,
      across,
      exclude,
      forms
    },
    computed: {
      ...mapState(['dataComparison'])
    },
    data() {
      return {
        currentComm: 'across',
        miniModel: true,
        filter: {
          keyword: '',
          cat: ''
        },
        start_time: '',
        end_time: '',
        filterOptions: [{
          title: '关键字',
          prop: 'keyword',
          type: 'input'
        }, {
          title: '分类',
          prop: 'cat',
          type: 'radio',
          children: [
            { label: '上传数据', value: '1' },
            { label: '交叉比对', value: '2' },
            { label: '排除比对', value: '3' },
            { label: '单表运算', value: '4' },
            { label: '检索结果', value: '5' }
          ]
        }]
      }
    },
    props: {},
    methods: {
      miniSider(val) {
        this.miniModel = !val
      },
      commChange(target) {
        this.currentComm = target.comm
      },
      searchSubmit(obj) {
        // 提交条件筛选
        this.filter = obj;
        bus.$emit('parmasData', this.filter);
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.showRightBar = false
      bus.$on('currentComm', d => {
        this.currentComm = d
      })
      bus.$on('SourceType', m => {
        switch (Number(m)) {
          case 2:
            this.currentComm = 'across'
            break
          case 3:
            this.currentComm = 'exclude'
            break
          case 4:
            this.currentComm = 'form'
            break
        }
      })
    }
  }

</script>
