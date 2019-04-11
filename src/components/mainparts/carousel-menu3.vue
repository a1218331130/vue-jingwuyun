<template>
<transition name="fade">
  <el-carousel class="el-carousel-menu2" :class="{'indicator-fixed':fixed}" v-if="users.userMenu" indicator-position="outside" :autoplay="false" arrow="always" trigger="click">
    <el-carousel-item>
      <div class="main-menu-list">
        <el-row :gutter="50">
          <el-col :span="4" v-for=" (item,i) in menuList " v-if="i < 18 " :key="i">
            <div :class="{'main-menu-list__item':true,'main-menu-list__item__line2':menuList.length < 13}" @click="openPage(item)">
              <div class="main-menu-list__item__box">
                <img :class="{'main-menu-list__item__image':true,'menu-icon':true,'min-size':minResize}" :src="item.MenuIcon === null ?'/static/img/default02.png':item.MenuIcon" />
              </div>
              <span class="menu-text">{{item.MenuName}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-carousel-item>
    <el-carousel-item>
      <img v-show="menuList.length > 6" :class="{'test-img':true,'test-min-img':minResize}" src="/static/img/test-kjfs.png" />
    </el-carousel-item>
    <el-carousel-item>
      <img v-show="menuList.length > 6" :class="{'test-img':true,'test-min-img':minResize}" src="../../assets/main-table.png" />
    </el-carousel-item>
    <el-carousel-item>
      <img v-show="menuList.length > 6" :class="{'test-img':true,'test-min-img':minResize}" src="/static/img/res/test_list.png" />
    </el-carousel-item>
  </el-carousel>
</transition>
</template>
<style scoped lang="scss">
.el-carousel__item {
    text-align: center;
    .main-menu-list {
        width: 893px;
        list-style-type: none;
        margin: 2% auto;
        overflow: hidden;
        height: 92%;
        position: relative;
        > div {
            width: 100%;
            max-height: 100%;
            overflow-y: auto;
            position: absolute;
            top: 50%;
            left: 52%;
            transform: translateX(-50%) translateY(-50%);
        }
        &__item {
            color: #fff;
            text-align: center;
            height: 105px;
            margin-bottom: 5px;
            border-bottom: 3px solid #029db8;
            overflow: hidden;
            cursor: pointer;
            position: relative;
            &__line2 {
                padding-bottom: 20px;
                margin-bottom: 15px;
                .main-menu-list__item__image {
                    margin-bottom: 17%;
                }
            }
            &__box {
                text-align: center;
                // width: 66px;
                // height: 66px;
                margin: 0 auto;
                // background: -webkit-gradient(linear, 0 0, 0 bottom, from(rgb(20, 163, 228)), to(rgb(11, 112, 226)));
                // border-radius: 15px;
                // box-shadow: 1px 0 4px rgba(0, 54, 84, .3);
            }
            &__image {
                // margin: 16% auto 7%;
                width: auto;
                height: 70px;
                //  display: -webkit-box;
                // &.min-size {
                //     width: 60%;
                //     margin: 2% auto;
                // }
            }
            &:hover {
                background-color: rgba(0, 255, 255, 0.24);
                border-bottom-color: #00ffff;
                .main-menu-list__item__box {
                    //  animation: tada 1s 1 linear;
                }
            }
            .menu-text {
                font-size: 16px;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
@keyframes tada {
    from {
        transform: scale3d(1, 1, 1);
    }
    10%,
    20% {
        transform: scale3d(.9, .9, .9) rotate3d(0, 0, 1, -3deg);
    }
    30%,
    50%,
    70%,
    90% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }
    40%,
    60%,
    80% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }
    to {
        transform: scale(1, 1, 1);
    }

}

// .fade-enter-active,
// .fade-leave-active {
//     transition: 0.5;
// }
// .fade-enter,
// .fade-leave-to {
//     opacity: 0;
// }
.test-img {
    width: 85%;
    &.test-min-img {
        margin-top: 0;
    }
}
</style>
<script>
import { mapState } from 'vuex'
import mixin from '../../utils/mixin'
import { getTokenUrl } from '../../utils/util'
import { save } from '../../utils/storage'
export default {
  mixins: [mixin],
  data() {
    return {
      minResize: true
    }
  },
  props: ['fixed'],
  computed: {
    menuList() {
      let res
      res = [...this.users.userMenu]
      res.sort((a, b) => a.OrderSeq - b.OrderSeq)
      res = res.filter(d => d.Sfqy === '1' && d.HasAuthority === '1')
      console.log(res)
      return res
    },
    ...mapState(['users'])
  },
  methods: {
    openPage(data) {
      if (data.Sfqy === '0') {
        this.$message('此处正在施工中……')
      } else {
        if (data.MenuType === 3) {
          save('permission_external_' + data.MenuId, {
            id: data.MenuId,
            name: data.MenuName,
            src: getTokenUrl(data.RequestUrl, this.userData.UserToken)
          })
          if (data.OpenType === '3') {
            this.jumpTo(`/external-single/${data.MenuId}`, true)
          } else {
            this.$router.push({ name: '外部系统独立页', params: { menuId: data.MenuId } })
          }
        } else {
          this.$emit('call:open', data)
        }
      }
    }
  },
  mounted() {
    // console.log(this.users);
  },
  created() {
    if (document.body.offsetHeight < 800) {
      this.minResize = true;
    } else {
      this.minResize = false;
    }
    window.addEventListener('resize', (e) => {
      if (document.body.offsetHeight < 800) {
        this.minResize = true;
      } else {
        this.minResize = false;
      }
    })
  }
}
</script>
