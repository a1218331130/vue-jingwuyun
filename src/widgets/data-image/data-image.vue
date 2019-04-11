<template>
<img ref="imageElm" :class="{'data-image':true,'error':imageUrl===''}" :src="imageUrl" @load="imageLoaded" @error="imageError" alt="暂无相关图片">
</template>
<style lang="scss" scoped>
.data-image {
    .error {}
}
</style>
<script>
// import { FWZX_PATH } from '../../config'
import mixin from '../../utils/mixin'

/**
 * @module DataImage
 * @desc 通过身份证或数据ID获取图片
 *
 * @example <data-image idCard="440104199901120123X" tableId="TABLE_ABCDEFG"></data-image>
 */
export default {
  mixins: [mixin],
  components: {},
  data: () => ({
    imageUrl: ''
  }),
  /**
   * 接收参数
   * @prop {String} idCard 身份证  @default ''
   * @prop {String} dataId 数据ID @default ''
   * @prop {String} tableId 表ID @default ''
   */
  props: {
    idCard: {
      type: String,
      default: ''
    },
    dataId: {
      type: String,
      default: ''
    },
    tableId: {
      type: String,
      default: ''
    }
  },
  computed: {
    // ...mapState(['image'])
  },
  watch: {
    idCard() {
      this.getImage()
    }
  },
  methods: {
    clearImage() {
      this.imageUrl = '/static/img/default_person.jpg'
    },
    imageLoaded() {
      // this.dispatch(POST_URLS_TO_FILE, { Sfzh: this.idCard || this.dataId, ImageUrls: this.image.imageByIdCard })
    },
    imageError() {
      this.imageUrl = '/static/img/default_person.jpg'
    },
    getImage() {
      // this.imageUrl = ''
      // let api
      // if (this.idCard !== '') {
      //   api = 'query/getperson/xp' // query/getperson/info 'Sys/GetSfzhImage' // GET_IMAGE_BY_ID_CARD
      // } else if (this.dataId !== '') {
      //   api = 'Sys/GetBzbImage' // GET_IMAGE_BY_ID, TableId,Id
      // }
      // http://10.146.92.42:8888/qingbaoyun-navigation/query/getperson/gettx?token=68ED04B8053B734CE053455C920AA4EE&sfzh=431225199201093611
      // 由于同一页内会多次调用, 为避免状态冲突, 暂每次讲求都使用独立的异步来进行
      // this.$http.post(FWZX_PATH + api, {
      //   c: 0,
      //   token: this.userData.UserToken,
      //   data: JSON.stringify({ sfzh: this.idCard, Sfzh: this.idCard, Id: this.dataId, TableId: this.tableId, token: this.userData.UserToken }),
      //   id: api
      // }, this.httpSettings).then((res) => {
      //   console.log('this.imageurl', res)
      this.imageUrl = `${this.personImagePath}${this.idCard}`
      // if (this.idCard !== '') {
      // this.imageUrl = res.body.Data.xp || ''
      // } else {
      // this.imageUrl = res.body.Data[0] || ''
      // }
      // })
      // this.dispatch(api, { Sfzh: this.idCard, Id: this.dataId, TableId: this.tableId }).then(() => {
      //   this.imageUrl = this.image.imageByIdCard[0]
      // })
    }
  },
  created() {},
  mounted() {
    this.getImage()
  }
}
</script>
