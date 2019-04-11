<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="详情" :modal-append-to-body="true"
:append-to-body="true" size="middle" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row :gutter="20" class="detail" v-loading="loading">

    <el-col v-if="data!==null" :span="16" class="detail__box">
      <div class="detail__title">{{data.Title}}</div>
      <hr>
      <div class="detail__meta">
        <span class="detail__meta__item">作者: {{data.CreatorName}}</span>
        <span class="detail__meta__item">发布日期: {{data.CreatedTime}}</span>
        <span class="detail__meta__item">阅读数: {{data.ReadCount}}</span>
      </div>
      <div class="detail__content" v-html="data.Content">
        {{data.Content}}
      </div>

      <div class="detail__attachment">
        附件:
        <a class="detail__attachment__item" v-for="item in data.FileDetail" :href="downloadFilePath+item.ID" target="_blank">
          <!-- <i :class="'iconfont ' + getFileIconByType(item.Extend)"></i> -->
          <span class="detail-box__attachment__filename cursor--pointer" style="margin-right:10px;">{{item.Name}}</span>
        </a>
      </div>

      <div class="tags">
        <span class="tags__tag" v-for="k in getKeywordArray(data.Keyword)">{{k}}</span>
      </div>

    </el-col>

    <el-col v-if="data!==null" :span="8" class="detail__box">
      <div class="interactive">
        <!-- 点赞 -->
        <praise class="interactive__item" :id="data.KeyId" @update:success="getDetail(data.KeyId)"><i :class="{'iconfont':true, 'icon-praise':data.CurUser_IsPraise === '0','icon-praise_fill':data.CurUser_IsPraise === '1'}"></i> 点赞({{data.PraiseCount}})</praise>
        <!-- 收藏 -->
        <collect class="interactive__item" :id="data.KeyId" @update:success="getDetail(data.KeyId)"><i :class="{'iconfont':true, 'icon-xitong_shoucang':data.CurUser_IsCollect === '0','icon-collection_fill':data.CurUser_IsCollect === '1'}"></i> 收藏</collect>
      </div>
      <!-- 评论 -->
      <comment :id="data.KeyId"></comment>
    </el-col>

  </el-row>

  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">返回</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.detail {
    min-height: 200px;
    .interactive .iconfont {
        color: #e6a00c;
    }
}
.el-dialog--tiny {
    width: 80vh;
}
</style>
<script>
import { mapState } from 'vuex'
import { GET_STRATEGY_BY_ID, ADD_STRATEGY_READ } from '../../store/types'
import mixin from '../../utils/mixin'
import { clone } from '../../utils/util'

import comment from './comment'
import collect from './collect'
import praise from './praise'

export default {
  mixins: [mixin],
  components: {
    praise,
    collect,
    comment
  },
  data() {
    return {
      data: null
    }
  },
  props: ['dialog', 'id'],
  computed: {
    ...mapState(['know'])
  },
  methods: {
    /**
     * 初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.getDetail(this.id)
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.data = null
      this.$emit('close');
      // this.dialog = false
    },
    /**
     * 获取文章内容
     * @param  {String} [id=''] [description]
     * @return {[type]}         [description]
     */
    getDetail(id = '') {
      // 拉取内容
      this.dispatch(GET_STRATEGY_BY_ID, {
        KeyId: id
      }).then(() => {
        this.data = clone(this.know.detail)
        this.data.Content = decodeURI(this.data.Content);
      })
      // 添加阅读数
      this.dispatch(ADD_STRATEGY_READ, {
        KeyId: id,
        MlId: id
      }).then()
    },
    getKeywordArray(data) {
      let arr
      if(data) {
        if(data.indexOf('/') !== -1) {
          arr = data.split('/')
        } else if(data.indexOf(' ') !== -1) {
          arr = data.split(' ')
        } else {
          arr = [data]
        }
      } else {
        arr = ['']
      }
      return arr
    },
    /**
     * 编辑模态窗取消按钮事件
     * @return {[type]} [description]
     */
    cancel() {
      this.closeEvent()
    }
  },
  created() {

  },
  mounted() {}
}
</script>
