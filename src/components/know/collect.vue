<template>
<span @click="collect"><slot></slot></span>
</template>
<style scoped>
</style>
<script>
import { mapState } from 'vuex'
import { ADD_STRATEGY_COLLECT, DEL_STRATEGY_COLLECT, GET_STRATEGY_COLLECTS } from '../../store/types'
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
    ...mapState(['knowCollect'])
  },
  watch: {},
  methods: {
    /**
     * 方法入口
     * @return {[type]} [description]
     */
    collect() {
      if (!this.id) {

      } else {
        // 检查是否已收藏
        this.dispatch(GET_STRATEGY_COLLECTS, {
          MlId: this.id
        }).then(() => {
          if (this.knowCollect.Model.length === 0) {
            this.add()
          } else {
            this.remove(this.knowCollect.Model[0].KeyId)
          }
        });
      }
    },
    /**
     * 添加收藏
     */
    add() {
      this.dispatch(ADD_STRATEGY_COLLECT, {
        MlId: this.id
      }).then(() => {
        this.$emit('update:success')
      });
    },
    /**
     * 取消收藏
     * @return {[type]} [description]
     */
    remove(collectId) {
      this.dispatch(DEL_STRATEGY_COLLECT, {
        MlId: this.id,
        KeyId: collectId
      }).then(() => {
        this.$emit('update:success')
      });
    }
  }
}
</script>
