<template>
<div>
  <div class="notice-list">
    <div class="" v-show="noticeType==='0'">
      <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading="loading" @row-dblclick="showDetail" height="450" border :data="systemNew.PageData">
        <el-table-column type="index" label="序号" align="center" width="45"></el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template scope="scope">
            <span class="pointer link" @click="showDetail(scope.row)">详情</span>
          </template>
</el-table-column>
<el-table-column prop="Title" class-name="text-left" align="center" label="标题">
  <template scope="scope">
            <i v-if="!Number(scope.row.isread)" style="position: absolute; width: 5px; height: 5px; background: rgb(255, 0, 0); top: 50%; left: 0px; border-radius: 50%; transform: translateY(-50%);margin-left:3px;"></i>
            <span style="margin-left:6px;">{{scope.row.bt}}</span>
          </template>
</el-table-column>
<el-table-column prop="xm" align="center" width="100" label="发布人"></el-table-column>
<el-table-column prop="Emergency" label="紧急程度" align="center" width="100">
  <template scope="scope">{{lev[scope.row.jjcd]}}</template>
</el-table-column>
<!-- <el-table-column prop="Emergency" label="状态" align="center" width="80">
  <template scope="scope">{{readType[scope.row.isread]}}</template>
</el-table-column> -->
<el-table-column prop="cjsj" label="发件时间" align="center" width="180"></el-table-column>
</el-table>
</div>
<div class="" v-show="noticeType!=='0'">
  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-loading="loading" border stripe @row-dblclick="showDetail" height="450" :data="systemNew.PageData">
    <el-table-column type="index" label="序号" align="center" width="45"></el-table-column>
    <el-table-column label="操作" align="center" width="80">
      <template scope="scope">
            <span class="pointer link" @click="showDetail(scope.row)">详情</span>
          </template>
    </el-table-column>
    <el-table-column prop="xxgnMc" label="消息类型" align="center" width="100"></el-table-column>
    <el-table-column prop="Content" class="ellips" label="消息内容">
      <template scope="scope">
            <i v-if="!Number(scope.row.isread)" style="position: absolute; width: 5px; height: 5px; background: rgb(255, 0, 0); top: 50%; left: 0px; border-radius: 50%; transform: translateY(-50%);margin-left:3px;"></i>
            <span style="margin-left:6px;">{{scope.row.xxnr}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="isread" label="状态" align="center" width="80">
          <template scope="scope">{{readType[scope.row.isread]}}</template>
        </el-table-column> -->
    <el-table-column prop="xm" label="发件人" align="center" width="100"></el-table-column>
    <el-table-column prop="cjsj" label="发件时间" align="center" width="180"></el-table-column>

  </el-table>
</div>

<div class="app-toolbar tool-pagination">
  <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
</div>
</div>
<approval-dialog @call:change-update="dialogApproval=false" :dialogApproval="dialogApproval" :object="messobj" @close="fetchList()" :size="full"></approval-dialog>
<dialogDetail :dialog="detailDialog" :id="detailId" :type="detailType" @close="detailDialog=false" :due="steer" :size="full"></dialogDetail>
<!-- 系统消息列表详情 -->
<detaila-dialog :dialog="dialog" :url="detailId" :lcid="lcid" :type="detailType" @close="fetchList()"></detaila-dialog>
<!-- 通知通报 -->
<detail ref="det" :dialog="readPageDialoge" :noticeType="'0'" :id="detailId" @call:readed="readed" @call:close="closeDetail"></detail>
<detaila ref="det" :dialog="readPageDialog" :newsType="newsType" :detailData="detailData" @call:close="closeDetail"></detaila>
<!-- <contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="id" :title="caseName"></contrast-results> -->
</div>
</template>
<style scoped>
  .textName {
    padding-left: 20px;
    color: #999999;
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { FETCH_SYSTEM_NEW, UPDATE_NEWS_STATE, UPDATE_MESSAGE_STATE } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  import bus from '../../../../utils/bus'
  import pagination from '../../../../widgets/pagination/pagination'
  import { tableFill } from '../../../../utils/util'
  import approvalDialog from '../../../control/group/dialog/approval-dialog.vue'
  import dialogDetail from '../../../union/detail/dialog-detail'
  import detailaDialog from '../../../controlManage/detail/dialog-detail.vue'
  import detail from './notice-detail.vue'
  import detaila from './detail.vue'
  import contrastResults from '../../../controlManage/supervise/contrastResults.vue'
  export default {
    mixins: [mixin],
    components: {
      pagination,
      approvalDialog,
      dialogDetail,
      detailaDialog,
      detail,
      detaila,
      contrastResults
    },
    data() {
      return {
        id: '',
        caseName: '',
        detailData: '',
        lcid: '',
        newsType: '',
        dialog: false,
        readPageDialoge: false,
        readPageDialog: false,
        idArrs: [],
        full: 'full',
        steer: null,
        detailDialog: false,
        dialogApproval: false,
        messobj: {},
        detailId: '',
        detailType: null,
        lev: { 1: '普通', 2: '紧急', 3: '非常紧急' },
        readType: { 0: '未读', 1: '已读' },
        count: 0,
        pagenav: {
          limit: 10,
          currentpage: 1
        }
      }
    },
    props: ['noticeType', 'keyword'],
    computed: {
      ...mapState(['message', 'notice', 'systemNew', 'focusPerson', 'focusOrg', 'focusCar', 'surveillance'])
    },
    watch: {
      pagenav: {
        handler(v) {
          this.fetchList()
        },
        deep: true
      },
      noticeType(val) {
        if (val !== '') this.reload()
      },
      keyword() {
        this.fetchList()
      }
    },
    methods: {
      closeDetail() {
        this.readPageDialoge = false
        this.readPageDialog = false
        this.detailId = ''
      },
      clickDetail(val) {
        this.dispatch(UPDATE_NEWS_STATE, {
          KeyId: val,
          Id: val
        }).then(_ => {
          this.readed()
        })
      },
      readed() {
        this.$emit('call:readed')
      },
      reload() {
        this.dialogApproval = false
        if (this.pagenav.currentpage === 1) {
          this.fetchList()
        } else {
          this.pagenav.currentpage = 1
        }
      },
      fetchList() {
        if (this.noticeType !== '') {
          this.dispatch(FETCH_SYSTEM_NEW, {
            PageIndex: this.pagenav.currentpage,
            PageSize: this.pagenav.limit,
            Keyword: this.keyword,
            NoticeModularType: this.noticeType
          }).then(_ => {
            this.count = this.systemNew.DataCount
            this.dialogApproval = false
            this.dialog = false
          })
        }
      },
      showDetail(row) {
        if (!Number(row.isread)) {
          row.isread = 1;
        }
        bus.$emit('showDetailsDialog', row)
      },
      updateNewsState(id, NoticeModularType) {
        let jsonData = {
          isread: 0,
          id: id,
          NoticeModularType: NoticeModularType
        }
        this.dispatch(UPDATE_MESSAGE_STATE, jsonData)
      }
    },
    mounted() {
      tableFill(this.$, '.notice-list')
    },
    created() {
      this.fetchList()
    }
  }

</script>
