<template>
<div class="list-box">
  <div class="app-content">
    <!-- 列表 -->
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" :show-header="listType===2" v-loading.body="loading" :data="list" :border="true">
      <el-table-column v-if="listType===2" prop="id" label="序号" width="45"></el-table-column>
      <el-table-column v-if="listType===2" prop="title" label="标题"></el-table-column>
      <el-table-column v-if="listType===2" prop="creator" label="发件人"></el-table-column>
      <el-table-column v-if="listType===2" prop="type" label="分类" width="45"></el-table-column>
      <!-- <el-table-column v-if="listType===2" prop="unit" label="分发单位"></el-table-column> -->
      <el-table-column v-if="listType===2" prop="postTime" label="日期"></el-table-column>
      <el-table-column v-if="listType===2" prop="isReaded" label="状态" width="45">
        <template scope="scope">
          <span>{{scope.row.isReaded===true?'已读':'未读'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===2 && draft!==true" prop="isSign" label="签收">
        <template scope="scope">
          <span>{{scope.row.isSign===true?'已签收':'未签收'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===2" prop="fileCount" label="附件数" width="45"></el-table-column>
      <el-table-column v-if="listType===2" prop="grade" label="等级" width="45">
        <template scope="scope">
          <span v-if="scope.row.grade===1">普通</span>
          <span v-if="scope.row.grade===2">紧急</span>
          <span v-if="scope.row.grade===3">非常紧急</span>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===2" label="操作">
        <template scope="scope">
          <el-button v-if="!draft" type="primary" size="small" @click="openDetail(scope.row)">
            <i class="iconfont icon-save"></i>
            <span>查看详情</span>
          </el-button>
          <el-button v-if="draft===true" type="primary" size="small" @click="editnew(scope.row)">
            <i class="iconfont icon-brush"></i>
            <span>编辑草稿</span>
          </el-button>
          <el-button v-if="draft===true" type="danger" size="small" @click="remove(scope.row)">
            <i class="iconfont icon-trash"></i>
            <span>删除草稿</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="listType===1" class-name="compact" label="内容集">
        <template scope="scope">
          <div class="compact__wrap">
            <div class="compact__serial">
              <el-tag type="primary">{{scope.row.id}}</el-tag>
            </div>
            <div class="compact__box">
              <div class="compact__title">
                日期: {{scope.row.postTime}}
                <el-button v-if="!draft" type="text" size="small" @click="openDetail(scope.row)" title="查看详情查看详情"><i class="iconfont icon-sousuo"></i></el-button>
                <el-button v-if="draft===true" type="text" size="small" @click="editnew(scope.row)" title="编辑草稿"><i class="iconfont icon-brush"></i></el-button>
                <el-button v-if="draft===true" type="text" size="small" @click="remove(scope.row)" title="删除草稿"><i class="iconfont icon-trash"></i></el-button>
              </div>
              <div class="compact__item">
                <label>标题</label> {{scope.row.title}}
              </div>

              <div class="compact__item">
                <label>发件人</label> {{scope.row.creator}}
              </div>

              <div class="compact__item">
                <label>分类</label> {{scope.row.type}}
              </div>

              <!-- <div class="compact__item">
                  <label>分发单位</label>
                  {{scope.row.unit}}
                </div> -->

              <div class="compact__item" v-if="draft!==true && send!==true">
                <label>状态</label>
                <span>{{scope.row.isReaded===true?'已读':'未读'}}</span>
              </div>
              <div class="compact__item" v-if="draft!==true && send!==true">
                <label>签收</label>
                <span>{{scope.row.isSign===true?'已签收':'未签收'}}</span>
              </div>

              <div class="compact__item">
                <label>附件数</label> {{scope.row.fileCount}}
              </div>

              <div class="compact__item">
                <label>等级</label>
                <span v-if="scope.row.grade==='1'">普通</span>
                <span v-if="scope.row.grade==='2'">紧急</span>
                <span v-if="scope.row.grade==='3'">非常紧急</span>
              </div>
              <div class="compact__item" :title="scope.row.contentSTUB">
                <label>简介</label> {{scope.row.desc}}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="app-toolbar footer">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>

</div>
</template>

<style lang="scss" scoped>
.list-box {
    overflow: hidden;
}
</style>

<script>
import { mapState } from 'vuex'
import { FETCH_MESSAGE, DEL_MESSAGES, FETCH_MESSAGE_BY_ID } from '../../../store/types'
import mixin from '../../../utils/mixin'
import pagination from '../../../widgets/pagination/pagination.vue'
import { arrayGetRid, fitSize, tableFill } from '../../../utils/util'
export default {
  mixins: [mixin],
  components: {
    pagination
  },
  props: ['listType', 'draft', 'send'],
  data() {
    return {
      data: '',
      tableHeight: 0,
      count: 0,
      pagenav: { limit: 20, currentpage: 1 },
      list: [],
      typeMap: {
        1: '通知通报',
        2: '进度汇报',
        3: '行政通告',
        4: '案件监察',
        5: '党务文化',
        6: '重点工作'
      }
    }
  },
  computed: {
    ...mapState(['message'])
  },
  watch: {
    pagenav: {
      handler() {
        this.fetchList()
      },
      deep: true
    }
  },
  methods: {
    pageChange(d) {
      // 页面调转更新
      console.log('当前选择页面参数', d)
    },
    fetchList() {
      this.dispatch(FETCH_MESSAGE, {
        TempFlag: this.draft === true ? '1' : '0',
        IsMySend: this.send === true || this.draft === true,
        PageIndex: this.pagenav.currentpage,
        PageSize: this.pagenav.limit
      }).then(_ => {
        this.count = this.message.DataCount
        this.list = this.message.PageData.map((c, index) => {
          return {
            id: index + 1,
            key: c.KeyId,
            title: c.Title,
            creator: c.CreatorName,
            type: this.typeMap[c.NoticeType],
            typeVal: c.NoticeType,
            unit: '', // c.Title,
            postTime: c.CreatedTime,
            desc: c.Content !== null ? this.fixedContent(c.Content) : '',
            contentSTUB: c.Content !== null ? c.Content.replace(/<\/?[^>]*>/g, '') : '',
            content: c.Content,
            isSign: c.IsSignUp === '1',
            isReaded: c.IsRead === '1',
            fileCount: c.FileCount,
            fileDetail: c.FileDetail,
            grade: c.Emergency,
            isSended: this.send === true ? '2' : '1',
            RcvRoleList: c.RcvRoleList,
            RcvDeptList: c.RcvDeptList
          }
        })
      })
    },
    searList(obj) {
      console.log(obj, '123123sad')
      this.dispatch(FETCH_MESSAGE, {
        TempFlag: this.draft === true ? '1' : '0',
        IsMySend: this.send === true || this.draft === true,
        PageIndex: this.pagenav.currentpage,
        PageSize: this.pagenav.limit,
        Emergency: obj.grade || '',
        IsRead: obj.state || '',
        BeginDate: obj.BeginDate || '',
        EndDate: obj.BeginDate || '',
        Keyword: obj.keyword || '',
        DeptNo: obj.CollectDeptArr || ''
      }).then(_ => {
        this.count = this.message.DataCount
        this.list = this.message.PageData.map((c, index) => {
          return {
            id: index + 1,
            key: c.KeyId,
            title: c.Title,
            creator: c.CreatorName,
            type: this.typeMap[c.NoticeType],
            typeVal: c.NoticeType,
            unit: '', // c.Title,
            postTime: c.CreatedTime,
            desc: c.Content !== null ? this.fixedContent(c.Content) : '',
            contentSTUB: c.Content !== null ? c.Content.replace(/<\/?[^>]*>/g, '') : '',
            content: c.Content,
            isSign: c.IsSignUp === '1',
            isReaded: c.IsRead === '1',
            fileCount: c.FileCount,
            fileDetail: c.FileDetail,
            grade: c.Emergency,
            isSended: this.send === true ? '2' : '1',
            RcvRoleList: c.RcvRoleList,
            RcvDeptList: c.RcvDeptList
          }
        })
      })
    },
    openDetail(data) {
      if(data.id !== '') {
        this.dispatch(FETCH_MESSAGE_BY_ID, {
          KeyId: data.key,
          Id: data.key
        }).then(_ => {
          let c = this.message.Model
          this.data = {
            id: 0,
            key: c.KeyId,
            title: c.Title,
            creator: c.CreatorName,
            type: this.typeMap[c.NoticeType],
            typeVal: c.NoticeType,
            unit: '', // c.Title,
            postTime: c.CreatedTime,
            desc: this.fixedContent(c.Content),
            contentSTUB: c.Content.replace(/<\/?[^>]*>/g, ''),
            content: c.Content,
            isSign: c.IsSignUp === '1',
            isReaded: c.IsRead === '1',
            fileCount: c.FileCount,
            fileDetail: c.FileDetail,
            grade: c.Emergency,
            isSended: '1',
            RcvRoleList: c.RcvRoleList,
            RcvDeptList: c.RcvDeptList
          }
          this.$router.push({ name: '通知通报-详情', params: { data: this.data, send: this.send } })
        })
      }
    },
    fixedContent(str, len = 50) {
      let res = str.replace(/<\/?[^>]*>/g, '')
      if(res.length > len) {
        res = res.substr(0, len - 1) + '...'
      }
      return res
    },
    removeTab(v) {
      if(this.tabs.length > 1) {
        arrayGetRid(this.tabs, [v])
        this.changeTab(this.tabs.length - 1)
      }
    },
    fitEvent() {
      let res = fitSize(1495, [620, 720], [350, 730]) // 480
      this.miniModel = res.mini
      this.tableHeight = res.height
      tableFill(this.$, '.app-content', false, this.$(window).height() - 60 - 45)
    },
    editnew(item) {
      this.$emit('call:edit', item)
      // this.$emit('abcdefg', item)
    },
    remove(item) {
      this.$confirm('确定要删除此项?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.dispatch(DEL_MESSAGES, {
          MsgIdList: [item.key]
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
            showClose: true
          })
          this.fetchList()
        })
      })
    }
  },
  updated() {
    this.fitEvent()
  },
  created() {
    window.addEventListener('resize', (e) => {
      this.fitEvent()
    })
    this.fetchList();
  },
  mounted() {}
}
</script>
