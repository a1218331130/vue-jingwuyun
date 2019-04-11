<template>
<div>
  <!-- 内容区 -->

  <!--顶部工具栏-->
  <toolbar :unfoldState="unfoldT" @unfoldHandle="unfoldHandle" :listOfdetail="listOfdetail" v-if="active===2" @call:show-east="showEast" @call:change-type="toggleTypeList" @call:add="add"></toolbar>

  <!-- 中心内容 -->
  <noticeList ref="list" :listType="listType" :draft="true" :listOfdetail="listOfdetail" v-if="active===2" @call:edit="edit"></noticeList>
  <dialog-editor :dialog="editorDialog" :data="editData" @close="editorDialog=false" :RcvUserList="RcvUserList" @rectlist="rectlist" @openNotifPersonDialog="chooseNotifPersonDialog = true"></dialog-editor>
  <!-- 右侧栏 -->
  <side-right-box :unfoldHandle="unfoldT" @unfoldState="sideState" style="height: calc(100% - 135px); top: 100px;">
    <right-toolbar title="查询列表" :params="filter" :options="options" @packup="packup" @update:params="searchSubmit"></right-toolbar>
  </side-right-box>

  <user-selector :dialog="chooseNotifPersonDialog" @update:value="updateUserSelect" size="middle--user"  @close="chooseNotifPersonDialog=false"></user-selector>

</div>
</template>
<style lang="scss" scoped>
.sunCenter-box {
    height: 100%;
}

.sunCenter {
    background-color: #f0f0f0;
}

.nav-bar {
    height: 100%;
    color: #ffffff;
    text-align: center;
    width: 75px;
    background-color: #2893e1;
    .nav-item {
        cursor: pointer;
        height: 35px;
        width: 65px;
        padding: 13px 5px 12px;
        text-align: center;
        border-bottom: 1px solid #027aca;
        &:hover {
            background-color: #ff9900;
        }
    }
    .nav-item--current {
        background-color: #ff9900;
        cursor: pointer;
        height: 35px;
        width: 65px;
        padding: 13px 5px 12px;
        text-align: center;
        border-bottom: 1px solid #027aca;
    }
    i {
        font-size: 24px;
        margin-top: 0;
    }
    p {
        height: 12px;
        margin-top: 5px;
        line-height: 12px;
        font-size: 12px;
    }
}
</style>

<script>
import '../../../utils/dateFormat'
import mixin from '../../../utils/mixin'
import sideRightBox from '../../../widgets/right-toolbar/side-right-box.vue'
import rightToolbar from '../../../widgets/right-toolbar/right-toolbar'
import noticeList from '../list/list'
import toolbar from '../list/top-bar'
import dialogEditor from '../dialog-editor'
import userSelector from '../../../widgets/user-selector/user-selector'
export default {
  mixins: [mixin],
  components: {
    rightToolbar,
    sideRightBox,
    noticeList,
    toolbar,
    'dialog-editor': dialogEditor,
    userSelector
  },
  data() {
    return {
      RcvUserList: [],
      chooseNotifPersonDialog: false,
      editorDialog: false,
      editData: null,
      unfoldT: false, // 当前侧栏窗体是否展开状态中继 unfoldT: false, // 当前侧栏窗体是否展开状态中继
      screen: { // 筛选列表数据配置
        filter: {
          keyword: '',
          sex: '',
          tag: '',
          nation: '',
          peopleLevel: [],
          peopleState: ''
        },
        options: [
          {
            title: '关键字',
            prop: 'keyword',
            type: 'input'
          },
          {
            title: '标签',
            prop: 'tag',
            type: 'input'
          },
          {
            title: '民族',
            prop: 'nation',
            type: 'select',
            children: [
              { label: '汉', value: '汉' },
              { label: '壮', value: '壮' },
              { label: '满', value: '满' },
              { label: '回', value: '回' },
              { label: '苗', value: '苗' },
              { label: '维吾尔族', value: '维吾尔族' },
              { label: '更多', value: '更多' }
            ]
          },
          {
            title: '性别',
            prop: 'sex',
            type: 'radio',
            children: [
              { label: '男', value: '1' },
              { label: '女', value: '0' }
            ]
          },
          {
            title: '人员状态',
            prop: 'peopleState',
            type: 'radio',
            children: [
              { label: '已审核', value: '已审核' },
              { label: '未审核', value: '未审核' }
            ]
          },
          {
            title: '人员等级',
            prop: 'peopleLevel',
            type: 'radio',
            children: [
              { label: '一级', value: '1' },
              { label: '二级', value: '2' },
              { label: '三级', value: '3' },
              { label: '四级', value: '4' }
            ]
          }
        ]
      },
      active: 2,
      listType: 1,
      isEastCollapsed: false,
      listOfdetail: true,
      filter: {
        CollectDeptArr: [],
        keyword: '',
        // type: [],
        BeginDate: '',
        EndDate: '',
        grade: '',
        state: ''
        // enclosure: [],
        // signState: ''
      },
      options: [
        {
          title: '接收单位',
          prop: 'CollectDeptArr',
          props: {
            id: 'orgId',
            label: 'name',
            parentId: 'parentId',
            children: 'children'
          },
          type: 'treeSelect',
          children: []
        },
        {
          title: '关键字',
          prop: 'keyword',
          type: 'search'
        },
        // {
        //   title: '类型',
        //   prop: 'type',
        //   type: 'checkbox',
        //   children: [
        //     { label: '通知通报', value: '通知通报' },
        //     { label: '进度汇报', value: '进度汇报' },
        //     { label: '行政通告', value: '行政通告' },
        //     { label: '案件监察', value: '案件监察' },
        //     { label: '党务文化', value: '党务文化' },
        //     { label: '重点工作', value: '重点工作' }
        //   ]
        // },
        {
          title: '开始时间',
          prop: 'BeginDate',
          type: 'datetime'
        },
        {
          title: '结束时间',
          prop: 'EndDate',
          type: 'datetime'
        },
        {
          title: '等级',
          prop: 'grade',
          type: 'radio',
          children: [
            { label: '非常紧急', value: '3' },
            { label: '紧急', value: '2' },
            { label: '普通', value: '1' }
          ]
        },
        {
          title: '状态',
          prop: 'state',
          type: 'radio',
          children: [
            { label: '已读', value: '1' },
            { label: '未读', value: '0' }
          ]
        }
        // , {
        //   title: '附件',
        //   prop: 'enclosure',
        //   type: 'radio',
        //   inline: true,
        //   children: [
        //     { label: '有', value: '有' },
        //     { label: '无', value: '无' }
        //   ]
        // }
        // , {
        //   title: '签收状态',
        //   prop: 'signState',
        //   type: 'radio',
        //   inline: true,
        //   children: [
        //     { label: '已签', value: '已签' },
        //     { label: '未签', value: '未签' }
        //   ]
        // }
      ]
    }
  },
  props: [],
  computed: {},
  methods: {
    rectlist() {
      this.$refs.list.fetchList()
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
    searchSubmit(obj) {
      // 条件筛选
      //        this.$router.go(0)
      //        this.$message('条件筛选')
      this.filter = obj
      this.filter.BeginDate = obj.BeginDate !== '' ? this.dateFormat(new Date(obj.BeginDate), 'yyyy-MM-dd') : '';
      this.filter.EndDate = obj.EndDate !== '' ? this.dateFormat(new Date(obj.EndDate), 'yyyy-MM-dd') : '';
      this.filter.CollectDeptArr = obj.CollectDeptArr.join(',')
      this.$refs.list.searList(this.filter)
      this.packup()
    },
    showEast: function () {
      this.isEastCollapsed = this.isEastCollapsed === false
    },
    toggleTypeList: function (type) {
      this.listType = type;
      console.log(this.listType);
    },
    toggleEastCollapse() {
      this.isEastCollapsed = !this.isEastCollapsed
    },
    add() {
      this.editData = null
      this.editorDialog = true
    },
    edit(item) {
      this.editData = item
      this.editorDialog = true
    },
    updateUserSelect(val) {
      this.RcvUserList = val
    }
  },
  created() {
    /**
     * 采集单位
     */
    this.getRuleOrgTree('', true).then(d => {
      this.options[0].children = d.map
    })
  },
  mounted() {
    // this.active = this.$route.path
  }
}
</script>
