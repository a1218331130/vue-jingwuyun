<template>
<div class="menus-newList-dialog">
  <el-dialog class="center-list" v-draggable="dialogDraggableOptions" :modal-append-to-body="true" size="middle" title="近期警情消息" :visible.sync="dialog" @open="initList" :before-close="handleClose">
    <ul class="menus__xxlistul" v-if="xxlist.length">
      <!-- <li v-for="(items, i) in xxlist" :key="i" @click="showDetail(items)" v-show="noticeType!=='4'">
        {{i + 1}}. {{noticeType !=='0' ? items.Content : items.Title}}
        <span style="float:right;position: relative; "><i v-if="items.IsRead === '0'" style="  position: absolute;    width: 5px;  height: 5px;  background: #f00;  top: 50%;  left: -10px;  border-radius: 50%;  transform: translateY(-50%);"></i>{{noticeType !=='0' ? items.SendTime:items.CreatedTime}}</span>
      </li> -->
      <li v-for="(items, i) in xxlist" :key="i" @click="showWarnNew(items)" style="position: relative;">
        <i v-if="items.STATUS === '0'" style="position: absolute;width: 5px;height: 5px;background: #f00;top: 50%;left: -5px;border-radius: 50%;  transform: translateY(-50%);"></i>
        {{i+1}}、{{items.message_info}}
      </li>
    </ul>
    <div class="tipWord" v-else>
      暂无数据
    </div>
  </el-dialog>
</div>
</template>

<style lang="scss" scoped>
  .menus__xxlistul {
    list-style-type: none;
    list-style: none;
    min-height: 400px;
    color: #fff;
    padding: 0 20px;
    li {
      line-height: 28px;
      border-bottom: 1px solid #015B9B;
      padding: 5px 0;
      cursor: pointer;
    }
  }

  .tipWord {
    height: 400px;
    line-height: 400px;
    text-align: center;
    font-size: 24px;
    color: #fff;
  }

</style>

<style lang="scss">
  .menus-newList-dialog {
    .center-list {
      .el-dialog__header {
        background: url("/static/img/main_bg3.df1bbaa.jpg") no-repeat center top;
        .el-dialog__title {
          color: #fff;
        }
      }
      .el-dialog__body {
        // background-image: radial-gradient(#2894ff, #014587);
        background: url("/static/img/main_bg3.df1bbaa.jpg") no-repeat center top;
      }
    }
  }

</style>

<script>
  import { mapState } from 'vuex'
  // fetchCarList
  // import { FETCH_CAR_LIST } from '../../../store/types'
  import mixin from '../utils/mixin'
  import { getTokenUrl } from '../utils/util'
  import { RECENT_LIST_BY_CENTER_ID, CHANGE_STATUS } from '../store/types'
  export default {
    components: {},
    mixins: [mixin],
    data() {
      return {
        xxlist: [],
        dialogVisible: false
      }
    },
    props: {
      searchVal: {
        type: String,
        default: () => {
          return ''
        }
      },
      dialog: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      centerId: {
        type: String,
        defaolt: () => {
          return ''
        }
      }
    },
    methods: {
      // 警情消息跳转
      showWarnNew(item) {
        this.dispatch(CHANGE_STATUS, { jqid: item.jqid, status: '1' }).then(() => {
          this.initList()
          this.jumpTo(getTokenUrl(item.url, this.userData.UserToken), true)
        })
      },
      // 重新刷新列表
      initList() {
        // this.xxlist = [
        //   {
        //     'message_info': '最近30天治安盗窃警情预警',
        //     'url': 'http://10.146.90.20:8080/hnhhMiddService/MidServer?dashId=dsh_d8e91505142e0ad4e3924ca8d2ede747'
        //   },
        //   {
        //     'message_info': '最近30天治安警情预警',
        //     'url': 'http://10.146.90.20:8080/hnhhMiddService/MidServer?dashId=dsh_f7f8e2f75770cf45718f6397ece03737'
        //   },
        //   {
        //     'message_info': '最近30天群体聚集警情预警',
        //     'url': 'http://10.146.90.20:8080/hnhhMiddService/MidServer?dashId=dsh_c157423ea252d9e41722abfc2d8ed816'
        //   }
        // ]
        this.dispatch(RECENT_LIST_BY_CENTER_ID, { centerId: this.$route.params.id }).then(() => {
          this.xxlist = this.centerEnter.recentListByCenterId
        })
      },
      handleClose() {
        this.$emit('call:change-update')
      }
    },
    watch: {},
    computed: {
      ...mapState(['centerEnter'])
    },
    mounted() {},
    created() {}
  }

</script>
