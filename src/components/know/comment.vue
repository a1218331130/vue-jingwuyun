<template>
<el-row>
  <el-col :span="24">
    <el-form class="comment-box" v-model="form">
      <el-form-item>
        <el-input type="textarea" class="comment-box__textarea" v-model="form.CommentText" :maxlength="50" placeholder="输入评论内容"></el-input>
      </el-form-item>
      <el-button class="comment-box__button" @click="postComment">发表评论</el-button>
    </el-form>
  </el-col>
  <!-- <hr> -->
  <el-col :span="24">
    评论列表
    <el-row class="list">
      <el-col :span="24" class="list__item" v-if="list.length>0" v-for="d in list" :key="d.KeyId">
        <div class="list__item__meta">
          <span>评论人: {{d.CreatorName}} </span>
          <span>发表时间: {{d.CareatedTime}}</span>
        </div>
        <div class="list__item__content">
          {{d.CommentText}}
        </div>
      </el-col>

      <el-col :span="24" v-else>
        暂无相关评论
      </el-col>

    </el-row>
  </el-col>
</el-row>
</template>
<style lang="scss" scoped>
.comment-box {
    margin-top: 20px;
    &__textarea {
        margin-bottom: 5px;
    }
    &__button {
        float: right;
    }
}

.list {
    &__item {
        padding: 5px 0;
        margin-bottom: 5px;
        &:nth-child(even) {
            background: #c8e6f7; // 辅色
        }
        &__meta {
            padding: 3px 16px;
            margin-bottom: 5px;
            border-bottom: 1px solid #ccc;
            span {
                &:nth-last-child(1) {
                    float: right;
                }
            }
        }
        &__content {
            padding: 3px 16px;
        }
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { ADD_STRATEGY_COMMENT, GET_STRATEGY_COMMENTS } from '../../store/types'
import mixin from '../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      form: {
        MlId: this.id,
        CommentText: ''
      },
      list: []
    }
  },
  props: ['id'],
  computed: {
    ...mapState(['knowComment'])
  },
  watch: {
    id(val) {
      this.fetchList()
    }
  },
  methods: {
    postComment() {
      this.dispatch(ADD_STRATEGY_COMMENT, this.form).then(() => {
        this.$message({
          type: 'success',
          message: '发表评论成功',
          showClose: true
        })
        this.fetchList()
      });
    },
    fetchList() {
      this.dispatch(GET_STRATEGY_COMMENTS, {
        MlId: this.id
      }).then(() => {
        this.list = this.knowComment.Model
      });
    }
  },
  mounted() {
    this.list = []
    this.form.CommentText = ''
    this.fetchList()
  }
}
</script>
