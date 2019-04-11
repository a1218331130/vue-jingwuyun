<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="data && data.title?data.title:'详情'" :modal="false" :before-close="close" size="bigest--fixed" :modal-append-to-body="true" :append-to-body="true"  :show-close="true" @open="initDialog">
  <detail v-if="data!==null" @call:listyd="listyd" :notificationData="data" @call:back="close" style="min-height:516px;"></detail>
  <div style="text-align:center" v-if="idarrs.length!==0">
    <el-button type="primary" size="mini" class="import-btn" @click="perlist" v-if="index!==0">上一条信息</el-button>
    共{{idarrs.length}}条
    <el-button type="primary" size="mini" class="import-btn" @click="nextlist">{{listtext}}</el-button>
  </div>
</el-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { FETCH_MESSAGE_BY_ID, ADD_READ_MSG_DATA, GET_NEWS_BY_ID, UPDATE_NEWS_STATE } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  import detail from '../../../notification/detail/index'
  export default {
    mixins: [mixin],
    components: {
      detail
    },
    data() {
      return {
        idarrs: [],
        listtext: '下一条信息',
        index: 0,
        clonedata: null,
        data: null,
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
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      noticeType: {
        type: String,
        default: 0
      },
      id: {
        type: String,
        default: ''
      },
      idarr: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    computed: {
      ...mapState(['message', 'systemNew'])
    },
    methods: {
      initDialog() {
        this.idarrs = this.idarr
        this.clonedata = this.id
        this.getDetail()
      },
      listyd() {
        this.dispatch(this.noticeType === '0' ? ADD_READ_MSG_DATA : UPDATE_NEWS_STATE, {}).then(_ => {
          this.$message('所有已读！')
        })
      },
      /**
       * 上一条信息
       * @return {[type]} [description]
       */
      perlist() {
        this.index = this.index - 1
        if (this.index >= 0) {
          this.clonedata = this.idarrs[this.index]
          this.getDetail()
        }
      },
      /**
       * 下一条信息
       * @return {[type]} [description]
       */
      nextlist() {
        this.index = this.index + 1
        if (this.index < this.idarrs.length) {
          if (this.index === this.idarrs.length - 1) {
            this.listtext = '关闭'
          }
          this.clonedata = this.idarrs[this.index]
          this.getDetail()
        } else {
          this.data = null
          this.$emit('call:close')
        }
      },
      getDetail() {
        this.data = null
        if (this.clonedata !== '') {
          this.dispatch(this.noticeType === '0' ? FETCH_MESSAGE_BY_ID : GET_NEWS_BY_ID, {
            KeyId: this.clonedata,
            Id: this.clonedata
          }).then(_ => {
            let c = this.noticeType === '0' ? this.message.Model : this.systemNew.Model
            if (this.noticeType === '0') {
              this.data = {
                id: 0,
                key: c.KeyId,
                title: c.Title,
                creator: c.CreatorName || c.SenderName,
                type: this.typeMap[c.NoticeType],
                typeVal: c.NoticeType,
                unit: '', // c.Title,
                postTime: c.CreatedTime || c.CreateTime,
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
            } else {
              this.data = {
                id: 0,
                key: c.Id,
                title: c.NoticeFeaturesName,
                creator: c.CreatorName || c.SenderName,
                type: c.NoticeFeaturesName,
                typeVal: c.NoticeFeaturesName,
                unit: '', // c.Title,
                postTime: c.CreatedTime || c.CreateTime,
                desc: this.fixedContent(c.Content),
                contentSTUB: c.Content.replace(/<\/?[^>]*>/g, ''),
                content: c.Content,
                isSign: c.IsSignUp === '1',
                isReaded: c.IsRead === '1',
                isSended: '1',
                RcvRoleList: [],
                RcvDeptList: []
              }
            }
            if (this.data.isReaded !== '1') {
              this.dispatch(this.noticeType === '0' ? ADD_READ_MSG_DATA : UPDATE_NEWS_STATE, {
                KeyId: this.clonedata,
                Id: this.clonedata
              }).then(_ => {
                this.$emit('call:readed')
              })
            }
          })
        }
      },
      fixedContent(str, len = 50) {
        let res = str.replace(/<\/?[^>]*>/g, '')
        if (res.length > len) {
          res = res.substr(0, len - 1) + '...'
        }
        return res
      },
      close(d) {
        this.data = null

        this.$emit('call:close')
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
