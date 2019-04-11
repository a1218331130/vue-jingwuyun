<template>
<span @click="praise"><slot></slot></span>
</template>
<style  scoped>
</style>
<script>
import { mapState } from 'vuex'
import { ADD_STRATEGY_PRAISE, DEL_STRATEGY_PRAISE, GET_STRATEGY_PRAISE } from '../../store/types'
import mixin from '../../utils/mixin'

export default {
  mixins: [mixin],
  data() {
    return {

    }
  },
  props: {
    id: String
  },
  computed: {
    ...mapState(['knowPraise'])
  },
  watch: {},
  methods: {
    /**
     * 方法入口
     * @return {[type]} [description]
     */
    praise() {
      if (!this.id) {

      } else {
        // 检查是否已点赞
        this.dispatch(GET_STRATEGY_PRAISE, {
          MlId: this.id
        }).then(() => {
          if (this.knowPraise.Model.length === 0) {
            this.add()
          } else {
            this.remove(this.knowPraise.Model[0].KeyId)
          }
        });
      }
    },
    /**
     * 添加点赞
     */
    add() {
      this.dispatch(ADD_STRATEGY_PRAISE, {
        MlId: this.id,
        KeyId: this.id
      }).then(() => {
        this.$emit('update:success')
      });
    },
    /**
     * 取消点赞
     * @return {[type]} [description]
     */
    remove(praiseId) {
      this.dispatch(DEL_STRATEGY_PRAISE, {
        MlId: this.id,
        KeyId: praiseId
      }).then(() => {
        this.$emit('update:success')
      });
    }
  }
}
</script>
