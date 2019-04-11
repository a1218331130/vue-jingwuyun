<!-- 概况(统计) -->
<template>
  <div class="app-content">
    <!-- 列表 -->
    <!--<toolbar :unfold="unfoldT"></toolbar>-->
    <!--顶部工具栏-->
    
    <toolbar :unfoldState="unfoldT" @unfoldHandle="unfoldHandle" @call:tab-change="tabChange" @call:show-east="showEast"
             @call:change-type="toggleTypeList" @call:change-add="add" :listType="listType"
             :pageCountUpdate="listRefresh"></toolbar>
            
             
    <list :listType="listType" :queryCondition="queryCondition" @call:list-update="listRefresh = !listRefresh"
          v-if="checkRule('ajgl/lawcase/list',true)"></list>
        
    <!-- 右侧栏 -->
    <side-right-box :unfoldHandle="unfoldT" @unfoldState="sideState" v-loading="dictLoading"
                    element-loading-text="筛选条件正在初始...">
      <right-toolbar title="筛选条件" :params="filter" :options="options" @packup="packup"
                     @update:params="searchSubmit"></right-toolbar>
    </side-right-box>

    <!-- 编辑模态窗 large/tiny-->
    <editor :dialog="editDialog" @close="editDialog=false" :data="editorObj" @submit="addSubmitSuccess"></editor>
  </div>
</template>

<style lang="scss" scoped>
  .people-label {
    font-size: 12px;
    background-color: #FFC323;
    color: #fff;
    padding: 0 6px;
    border-radius: 3px;
    margin-left: 2px;
  }

  .compact {
    position: fixed;
    &__wrap {
      white-space: normal;
      padding: 15px 0;
      display: flex;
    }
    &__serial {
      line-height: 40px;
      width: 70px;
    }
    &__box {
      text-align: left;
      line-height: 16px;
    }
    &__title {
      color: #fd6533;
      display: block;
    }
    &__item {
      color: #333;
      margin-right: 15px;
      display: inline;
      label {
        color: #656565;
        &:after {
          content: ':';
        }
      }
      &--point {
        @extend .compact__item;
        color: #1e8ffd;
        cursor: pointer;
        &:hover {
          opacity: 0.9;
        }
      }
    }
  }

  .import-btn {
    border-radius: 3px;
    border: none;
    padding: 4px 10px;
    color: #ffffff;
    background-color: #6FB6EA;
    &.delete {
      background-color: #ffffff;
      color: #666;
      i {
        color: #6FB6EA;
        font-size: 23px;
      }
    }
  }

  .tool-box {
    text-align: right;
    background-color: red;
  }

  .app-box {
    height: calc(100% - 40px);
    width: 100%;
    margin: 0;
    overflow: hidden;
  }

  .app-table {
    margin-top: 10px;
  }

  .detail-box {
    height: 100%;
    background-color: #ffffff;
    .detail-box__title {
      font-size: 20px;
      margin-top: 10px;
      color: #333333;
      height: 50px;
      line-height: 50px;
    }
    .detail-box__time {
      height: 30px;
      line-height: 30px;
    }
    .detail-box-content {
      height: calc(100% - 285px);
      text-indent: 2rem;
      margin-top: 20px;
      padding: 0 50px 20px;
      line-height: 25px;
      overflow: scroll;
      border-bottom: 1px solid #cccccc;
    }
    .detail-box-content__return {
      position: absolute;
      bottom: 10px;
      left: 100px;
    }
    .enclosure-box {
      height: 155px;
      width: 100%;
      position: absolute;
      bottom: 0;
      .enclosure-box__title {
        margin-top: 10px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background-color: #ebebeb;
        .iconfont {
          font-size: 16px;
          margin-left: 10px;
        }
      }
      .enclosure-box__content {
        background-color: red;
        .enclosure-list {
          position: relative;
          margin: 10px 0 0 25px;
          img {
            position: absolute;
            top: 30px;
            left: 0;
          }
          .info-box {
            position: absolute;
            left: 45px;
            top: 0;
            p {
              height: 14px;
              line-height: 14px;
            }
          }
        }
      }
    }
  }

  .checked-select-list {
    padding: 0;
    list-style: none;
    background-color: #fff;
    margin: 0 13px;
    >li {
      border: 1px solid #D7D7D7;
      overflow: hidden;
      border-bottom: none;
      &:last-child {
        border-bottom: 1px solid #D7D7D7;
      }
      >.el-checkbox {
        padding: 15px 2px 15px 10px;
        float: left;
      }
      >.list-info-box_div {
        float: left;
        border-left: 1px solid #D7D7D7;
        padding: 15px 10px 12px 30px;
        width: calc(100% - 62px);
        .list-info-user-img_div {
          border: 1px solid #eaeaea;
          width: calc(100% - 8px);
          padding: 3px;
          background-color: #f1f1f1;
          position: relative;
          >img {
            width: 100%;
            min-height: 100%;
          }
          >.people-tag {
            position: absolute;
            background-color: #cd2941;
            padding: 0 10px;
            color: #fff;
            top: 0;
            left: 0;
            font-size: 12px;
            line-height: 18px;
          }
        }
        .people-button_div {
          background-color: rgba(84, 168, 231, 0.8);
          color: #fff;
          width: 100%;
          margin: 5px auto;
          line-height: 24px;
          font-size: 12px;
          text-align: center;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background-color: #54A8E7;
          }
        }
        .name-box_elcol {
          margin-bottom: 5px;
          .name-text {
            color: #1e1e1e;
            font-size: 16px;
            font-weight: bold;
          }
          .people-label {
            font-size: 12px;
            background-color: #FFC323;
            color: #fff;
            padding: 0 6px;
            border-radius: 3px;
            margin: 0 10px;
          }
          .info-source {
            font-size: 12px;
            margin-left: 2px;
          }
        }
        .info-list-handle_dl {
          display: none;
          float: right;
          margin-top: -10px;
          margin-right: -17px;
          font-size: 12px;
          >dd {
            float: left;
            height: 24px;
            line-height: 24px;
            padding: 0 10px;
            background-color: #fff;
            cursor: pointer;
            margin-left: 0;
            margin-right: 5px;
            >i {
              margin-right: 2px;
            }
            &:hover {
              background-color: #6FB6EA;
              color: #fff;
            }
          }
          >dd.color-orange {
            >i.iconfont {
              color: #F97136;
            }
            &:hover {
              background-color: rgba(249, 113, 54, 0.6);
            }
          }
          >dd.color-blue {
            >i.iconfont {
              color: #1296DB;
            }
            &:hover {
              background-color: rgba(18, 150, 219, 0.6);
            }
          }
          >dd.color-green {
            >i.iconfont {
              color: #39D293;
            }
            &:hover {
              background-color: rgba(57, 210, 147, 0.6);
            }
          }
        }
        .user-info-box_elrow {
          >.el-col {
            margin: 2px auto;
            >label {
              float: left;
              color: #a6a6a6;
              margin-right: 10px;
            }
            >span {
              float: left;
              color: #333;
              font-weight: 400;
            }
            >span.ID-card-text_span {
              color: #54A8E7;
            }
          }
        }
        .user-info-box_elrow {
          padding-right: 30px;
          overflow: hidden;
          float: left;
          line-height: 26px;
          >label {
            float: left;
            color: #a6a6a6;
            margin-right: 10px;
          }
          >span {
            float: left;
            color: #333;
            font-weight: 400;
          }
          >span.ID-card-text_span {
            color: #54A8E7;
          }
          >span.label-box-list_dl {
            background-color: #FF6600;
            color: #fff;
            padding: 0 10px;
            font-size: 12px;
            border-radius: 3px;
          }
        }
      }
      &:hover {
        .info-list-handle_dl {
          display: inline;
        }
      }
    }
  }

  .app-content {
    height: calc(100vh - 60px);
  }

</style>

<script>
  import mixin from '../../../utils/mixin'
  import sideRightBox from '../../../widgets/right-toolbar/side-right-box.vue'
  import rightToolbar from '../../../widgets/right-toolbar/right-toolbar'

  import { clone } from '../../../utils/util'

  import editor from './editor'
  import list from './list'
  import toolbar from './toolbar'

  export default {
    mixins: [mixin],
    components: {
      rightToolbar,
      sideRightBox,
      editor,
      list,
      toolbar
    },
    data() {
      return {
        listRefresh: false,
        editorObj: {},
        listCaseState: '0', // 列表案件状态
        rightToolbarData: {}, // 右侧栏筛选条件状态
        queryCondition: {}, // 查询条件
        editMode: 'add',
        targetId: '',
        editDialog: false,
        unfoldT: false, // 当前侧栏窗体是否展开状态中继
        listType: 1,
        pageInfo: { // 页面分页信息相关配置
          count: 10,
          limit: 10,
          currentpage: 1
        },
        dictLists: [], // 字典集合
        filter: { // 右侧工具接收数据配置
          caseName: '', // 案件名称
          crimeScene: '', // 案发地点
          caseType: [], // 案件类别
          caseTimeStart: '', // 发案时间上限
          caseTimeEnd: '', // 发案时间下限
          caseState: [] // 案件状态
        },
        options: [] // 右侧工具栏条件输入配置
      }
    },
    computed: {},
    methods: {
      /**
       *  初始化右侧工具栏配置
       */
      initToolbarOption() {
        // 右侧工具栏条件输入配置
        let _caseTypeArr = this.dictLists['AJLBDM'].map(r => {
          return {
            label: r.label,
            value: r.value
          }
        })
        let _caseStateArr = this.dictLists['XZAJZT'].map(r => {
          return {
            label: r.label,
            value: r.value
          }
        })
        // 右侧工具栏条件输入配置
        this.options = [{
          title: '案件名称',
          prop: 'caseName',
          type: 'input'
        }, {
          title: '案发地点',
          prop: 'crimeScene',
          type: 'input'
        }, {
          title: '案件类别',
          prop: 'caseType',
          type: 'Mulitiselect',
          children: _caseTypeArr
        }, {
          title: '案件状态',
          prop: 'caseState',
          type: 'checkbox',
          children: _caseStateArr
        }, {
          title: '发案时间上限',
          prop: 'caseTimeStart',
          type: 'datetime',
          dateLimit: true
        }, {
          title: '发案时间下限',
          prop: 'caseTimeEnd',
          type: 'datetime',
          dateLimit: true
        }]
      },
      queryDictType() {
        //  表单字典初始化
        this.getDict(['AJLBDM', 'XZAJZT']).then(res => {
          this.dictLists = res
          this.initToolbarOption()
        })
      },
      showEast: function() {
        this.unfoldT = this.unfoldT === false
      },
      unfoldHandle(s) {
        // 外部操作更新窗体状态
        this.unfoldT = s
      },
      packup() {
        // 收起侧栏
        this.unfoldT = false
      },
      sideState(s) {
        // 窗体自身操作更新窗体状态
        this.unfoldT = s
      },
      add() {
        this.targetId = ''
        this.editMode = 'add'
        this.editDialog = true
      },
      searchSubmit(f) {
        // 条件筛选
        this.rightToolbarData = {
          ajmc: f.caseName, // 案件名称
          fadd: f.crimeScene, // 案发地点
          ajlb: f.caseType, // 案件类别
          fasjsx: f.caseTimeStart === '' ? f.caseTimeStart : this.dateFormat(new Date(f.caseTimeStart), 'yyyy-MM-dd hh:mm:ss '), // 发案时间上线
          fasjxx: f.caseTimeEnd === '' ? f.caseTimeEnd : this.dateFormat(new Date(f.caseTimeEnd), 'yyyy-MM-dd hh:mm:ss '), // 发案时间下线
          ajzt: f.caseState // 案件状态
        }
        this.packup()
      },
      toggleTypeList: function(type) {
        this.listType = type;
      },
      /**
       * 切换列表选项卡
       * @param tab
       */
      tabChange(tab) {
        // 条件筛选
        this.listCaseState = tab.name // 案件是否结案
      },
      /**
       * 添加数据成功返回
       */
      addSubmitSuccess() {
        this.queryCondition = {}
        this.queryCondition.sfja = this.listCaseState // 查询案件状态
      }
    },
    watch: {
      'rightToolbarData' (val) {
        this.queryCondition = Object.assign(val, { sfja: this.listCaseState })
      },
      'listCaseState' (val) {
        this.queryCondition = clone(this.rightToolbarData)
        this.queryCondition['sfja'] = val
      }
    },
    created() {
      this.queryDictType() // 初始化查询所需字典
      this.queryCondition.sfja = this.listCaseState // 初始化查询案件状态
    },
    mounted() {}
  }

</script>
