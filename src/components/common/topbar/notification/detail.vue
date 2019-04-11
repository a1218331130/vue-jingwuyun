<!-- 内容详情 -->
<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="data && data.Title?data.Title:'详情'" :modal="false" size="small" :show-close="true" @open="initDialog" :before-close="close">
  <div class="read-box" v-if="newsType === '1'">
    <p class="textName"><span>通知：</span>{{detailData.bt}}</p>
      <p class="textName"><span>时间：</span>{{detailData.cjsj}}</p>
  </div>
  <div class="read-box" v-if="data && newsType !=='1'">
    <div class="r-title-sub">
      <p class="textName"><span>最后更新时间：</span>{{data.lastUpdateTime}}</p>
      <p class="textName"><span>最后更新数量：</span>{{data.updateCount}}</p>
    </div>
  </div>
</el-dialog>
</template>

<style scoped lang='scss'>
  .read-box {
    padding: 0 20px 30px;
    .r-title {
      text-align: center;
      font-size: 24px;
      margin-top: 50px;
    }
    .r-title-sub {
      line-height: 1;
      .textName {
        color: #666;
      }
    }
    .r-content {
      margin-top: 30px;
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { FETCH_MESSAGE_BY_ID, ADD_READ_MSG_DATA, GET_NEWS_BY_ID, UPDATE_NEWS_STATE, QUERY_DETAIL } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  export default {
    mixins: [mixin],
    components: {},
    data() {
      return {
        data: null,
        massage: ''
      }
    },
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      detailData: {
        type: String,
        default: ''
      },
      newsType: {
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapState(['centerEnter'])
    },
    methods: {
      initDialog() {
        if (this.newsType !== '1') {
          this.data = '';
          this.dispatch(QUERY_DETAIL, { message: this.detailData }).then(_ => {
            this.data = this.centerEnter.queryDetail
          })
        }
      },
      getDetail() {
        this.data = null
        if (this.id !== '') {
          this.dispatch(this.noticeType === '0' ? FETCH_MESSAGE_BY_ID : GET_NEWS_BY_ID, {
            KeyId: this.id,
            Id: this.id
          }).then(_ => {
            this.data = this.noticeType === '0' ? this.message.Model : this.systemNew.Model
            if (this.data.IsRead !== '1') {
              this.dispatch(this.noticeType === '0' ? ADD_READ_MSG_DATA : UPDATE_NEWS_STATE, {
                KeyId: this.id,
                Id: this.id
              }).then(_ => {
                this.$emit('call:readed')
              })
            }
          })
        }
      },
      close(d) {
        this.$emit('call:close')
      }
    },
    watch: {},
    mounted() {},
    created() {}
  }

</script>
