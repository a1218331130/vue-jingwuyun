<template>
<div class="detail-box" v-loading.body="loading" v-loading="signLoading" element-loading-text="正在签收中…">
  <div class="app-toolbar" v-if="data">
    <el-row>
      <el-col :span="12">
        <el-button type="text" class="return-button" @click="backEvents"><i class="iconfont icon-return"></i>返回
        </el-button>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button type="primary" size="mini" class="import-btn add" @click="listyd">全部已读</el-button>
        <!-- <el-button v-if="!isMessage &&  data.isSended === '1'" type="primary" size="mini" class="import-btn iconfont icon-praise">&nbsp;32</el-button> -->
        <el-button v-if="!isMessage" :type="data.isSign===true? 'primary' : 'danger'" size="mini" :class="data.isSign===true? 'import-btn' : 'qs-btn'" @click="sign">{{data.isSign===true?'&nbsp;已签收':'&nbsp;未签收'}}</el-button>
        <el-button type="primary" v-if="!isMessage && !listshow" size="mini" class="import-btn add" @click="dialogReaded=true">查看签收情况</el-button>
      </el-col>
    </el-row>
  </div>
  <div>
    <el-row :gutter="0">
      <el-col class="detail-box__title">
        <i v-if="!data.isReaded" style="position: absolute; width: 8px; height: 8px; background: rgb(255, 0, 0); top: 35%; left: 60px; border-radius: 50%; transform: translateY(-50%);"></i>{{data.title}}
      </el-col>
      <!-- 查阅: 230 -->
      <el-col class="detail-box__meta">
        <span class="detail-box__meta__item">发布时间: {{data.postTime}}</span>
        <span class="detail-box__meta__item">发件人: {{data.creator}}</span>
        <span class="detail-box__meta__item">分类: {{data.type}}</span>
        <!-- <span class="detail-box__meta__item">分发单位: {{data.unit}}</span> -->
        <span class="detail-box__meta__item" v-if="data.grade==='1' || data.grade==='2'">等级: {{data.grade==='1'?'普通':'紧急'}}</span>
        <span class="detail-box__meta__item" v-if="data.grade==='3'">等级: 非常紧急</span>
        <span class=" detail-box__meta__item " v-if="data.isSign">签收状态: {{data.isSign===true?'已签收':'未签收'}}</span>
        <!-- <span class="detail-box__meta__item ">已读状态: {{data.isReaded===true?'已读':'未读'}}</span> -->
      </el-col>
    </el-row>
    <div class="detail-box__content" v-html="data.content"></div>
    <div class="enclosure-box " v-if="data.fileCount>0">
      <div class="enclosure-box__title">
        <i class="iconfont icon-link"></i> 附件（{{data.fileCount}}个）
      </div>
      <div class="enclosure-box__list">
        <div class="item" v-for="(item, index) in data.fileDetail" :key="index">
          <!-- <img class="item__image" src="../../../assets/enclosure.gif" alt=""> -->
          <a class="detail-box__attachment__item" :href="downloadFilePath+item.ID" target="_blank">
              <i :class="'iconfont ' + getFileIconByType(item.Extend)"></i><span
              class="detail-box__attachment__filename cursor--pointer">{{item.Name}}</span>
            </a>
          <div class="item__ctrl">
          </div>
        </div>
      </div>
    </div>
    <!--<el-button type="primary" class="detail-box__content__return" @click="hideDetail()">返回</el-button>-->
  </div>
  <readed-dialog :dialog="dialogReaded" :id="data" @close="dialogReaded=false"></readed-dialog>
</div>
</template>
<style lang="scss" scoped>
  .app-content-box {
    height: calc(100% - 90px);
  }

  .detail-box {
    height: 100%;
    background-color: #ffffff;
    &__title {
      font-size: 26px;
      font-weight: bold;
      color: #333333;
      text-align: center;
      height: 50px;
      line-height: 50px;
      float: left;
    }
    &__meta {
      background-color: rgb(227, 227, 227);
      height: 30px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      &__item {
        margin: 0 10px;
      }
    }
    &__content {
      font-size: 18px;
      color: #393939;
      text-align: left;
      text-indent: 2em;
      height: calc(100% - 285px);
      text-indent: 2rem;
      margin-top: 20px;
      padding: 0 50px 20px;
      line-height: 25px;
      overflow: scroll;
      border-bottom: 1px solid #cccccc;
      &__return {
        position: absolute;
        bottom: 10px;
        left: 100px;
      }
    }
    .enclosure-box {
      width: 100%;
      .enclosure-box__title {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        background-color: #ebebeb;
        .iconfont {
          font-size: 16px;
          margin-left: 10px;
        }
      }
      .enclosure-box__list {
        .item {
          margin: 10px 0 0 25px;
          &__image {
            width: 33px;
            height: 33px;
          }
          &__title {}
          &__ctrl {}
        }
      }
    }
    .qs-btn {
      background-color: #ff4949;
      border-color: #ff4949;
      color: #fff;
    }
  }

  .return-button {
    float: left;
  }

</style>

<script>
  import { mapState } from 'vuex'
  import { POST_SIGN_UP, ADD_READ_MSG_DATA } from '../../../store/types'

  import dialogReaded from './readList'

  import mixin from '../../../utils/mixin'
  import { clone } from '../../../utils/util'
  export default {
    mixins: [mixin],
    components: {
      'readed-dialog': dialogReaded
    },
    data() {
      return {
        dialogReaded: false,
        isMessage: false,
        listshow: false,
        signLoading: false
      }
    },
    props: {
      notificationData: {
        type: Object,
        default: null
      }
    },
    computed: {
      data() {
        let res
        if (!this.notificationData) {
          this.isMessage = false
          this.listshow = false
          res = this.$route.params.data
        } else {
          this.isMessage = true
          this.listshow = true
          this.notificationData.grade ? this.isMessage = false : this.isMessage = true
          res = clone(this.notificationData)
        }
        return res
      },
      ...mapState(['message'])
    },
    methods: {
      listyd() {
        if (this.notificationData) {
          this.$emit('call:listyd')
        } else {
          this.dispatch(ADD_READ_MSG_DATA, {}).then(_ => {
            this.$message('所有已读！')
          })
        }
      },
      sign() {
        if (this.data.isSign) {
          this.$message({
            type: 'success',
            message: '已签收成功'
          })
          return
        }
        this.signLoading = true
        this.dispatch(POST_SIGN_UP, {
          KeyId: this.data.key
        }).then(() => {
          this.$message({
            type: 'success',
            message: '签收成功'
          })
          this.data.isSign = true
          this.signLoading = false
          this.data.isSended = '666'
        })
      },
      backEvents() {
        if (!this.isMessage) {
          // this.historyBakc()
          if(this.$route.params.send) {
            this.$router.push({path: '/notification/send'});
          }else {
            this.$router.push({path: '/notification/list'});
          }
        } else {
          this.$emit('call:back')
        }
      }
    },
    created() {},
    mounted() {}
  }

</script>
