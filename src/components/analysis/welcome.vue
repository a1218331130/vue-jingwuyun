<template>
<el-layout class="app-layout" :fit="true">
  <!-- 头部导航 -->
  <el-region class="app-north" slot="north" :zoom="false" type="north" :fixed="false">
    <top-bar></top-bar>
  </el-region>
  <!-- 侧边栏(左导航按钮) -->
  <el-region :class="{'app-west':true, 'app-west--collapsed':isWestCollapsed}" slot="west" type="west" :zoom="false" :fixed="false">
  </el-region>
  <!-- 内容区 -->
  <el-region class="app-center" slot="center" type="center">
    <div class="analysis">
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in list" :key="item.MenuName">
          <div :class="{analysis__item:true, disabled:item.disabled===true}">
            <el-row :gutter="10">
              <el-col :span="6">
                <div class="analysis__item__image">
                  <!-- <img :src="'/static/img/res/menu_0'+item.id+'.png'" /> -->
                  <img :src="item.MenuIcon" />
                </div>
              </el-col>
              <el-col :span="18">
                <div class="analysis__item__title">
                  {{item.MenuName}}
                </div>
                <div class="analysis__item__desc">
                  {{item.MenuDesc}}
                </div>
              </el-col>
            </el-row>

            <div v-show="item.disabled===false" class="analysis__item__ctrl">
              <el-row>
                <el-col :span="12">
                  <el-button class="orange" @click="run(item)"><i class="iconfont icon-qidong"></i> 启动</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-region>
  <!-- 侧边栏(右工具按钮) -->
</el-layout>
</template>
<style lang="scss" scoped>
.app-west {
    background: #133e9a url("../../assets/analysis_left.jpg") no-repeat 0 0;
    background-size: 100%;
    width: 140px;

}

.analysis {
    padding: 0 18px;
    margin: 10px 0;
    &__item {
        background: #fff;
        color: #999;
        height: 100px;
        padding: 10px 10px 5px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 3px;
        position: relative;
        &__image {
            text-align: center;
            height: 84px;
            display: flex;
            align-items: center;
            align-self: center;
            img {
                width: 100%;
                height: auto;
                margin: 0 auto;
                display: block;
            }
        }
        &__title {
            color: #000;
            width: 100%;
            margin-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        &__desc {
            color: #666;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        &__ctrl {
            width: calc(100% - 20px + 2px);
            width: 100%;
            height: 55px;
            line-height: 55px;
            // padding: 0 10px;
            position: absolute;
            bottom: -1px;
            left: -1px;
            opacity: 0;
            transition: 0.25s;
            &:before {
                content: '';
                background: rgba(0, 0, 0, .5);
                width: 100%;
                height: 100%;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
            }
            .el-button {
                font-size: 12px;
                color: #fff;
                height: 28px;
                line-height: 28px;
                padding: 0 5px;
                border: 0;
                border-radius: 5px;

                width: 50%;
                height: 55px;
                border-radius: 0;
                position: absolute;
                top: 0;
                left: 0;

                .iconfont {
                    vertical-align: middle;
                    margin: 0;
                }
                &.orange {
                    background: #ff9900;
                }
                &.blue {
                    background: #5babe6;
                }
            }
        }
        &:hover {
            box-shadow: 0 0 10px rgba(0, 0, 0, .5);
            .analysis__item__ctrl {
                opacity: 1;
            }
        }
    }
}
</style>
<script>
import { mapState } from 'vuex'
import { FETCH_USER_MENU } from '../../store/types'
import { FWZX_BASE_PATH } from '../../config'

import mixin from '../../utils/mixin'
import { getTokenUrl } from '../../utils/util'
import { save } from '../../utils/storage'
import TopBar from '../common/topbar/index.vue'
export default {
  mixins: [mixin],
  components: {
    TopBar
  },
  data() {
    return {
      isWestCollapsed: false,
      list: []
    }
  },
  props: [],
  computed: {
    ...mapState(['users'])
  },
  methods: {
    run(data, isBig = false) {
      console.log(data, window.JWY_SERVICE_BASE_INFO, 'data')
      let path = data.RequestUrl,
        uMenuId = data.TreeId,
        accredit = data.HasAuthority,
        uMenuName = data.MenuName,
        tokenSrc = getTokenUrl(data.RequestUrl, this.userData.UserToken)
      if(accredit === '0') {
        this.$message({
          type: 'error',
          message: '暂无此模块权限！',
          showClose: true
        })
      } else {
        if(data.Sfqy !== '1') {
          this.$message('此处正在施工中……')
        } else if(path == null || path === '-') {
          this.$message({
            type: 'error',
            message: '此模块无指向地址，无法访问',
            showClose: true
          })
        } else {
          if(data.MenuType === 6) {
            // 第三方系统(特殊类别, 需请求接口后使用即时生成的URL做新窗口跳转)
            this.$http.get('http://127.0.0.1:8189/Service/?Msg=bilu', {}, this.httpSettings).then(() => {
              this.$http.post(FWZX_BASE_PATH + '/call', {
                token: this.userData.UserToken,
                id: path
              }, this.httpSettings).then((res) => {
                if(res.body.Data && res.body.Data.source) {
                  if(data.OpenType === '3') {
                    window.open(res.body.Data.source);
                  } else {
                    window.location.href = res.body.Data.source
                  }
                } else {
                  this.$alert('生成功能出口失败, 请与管理员联系!', '温馨提示')
                }
              }).catch(() => {
                this.$alert('功能开启失败, 请与管理员联系!', '温馨提示')
              })
            }).catch(() => {
              this.$confirm('您尚未安装智能笔录客户端, 可通过下方按钮进入下载页面下载安装.', '温馨提示', {
                confirmButtonText: '前往下载',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                window.open('http://10.146.90.26:8080')
              }).catch(() => {});
            })
          } else if(data.MenuType === 3) {
            save('permission_external_' + data.MenuId, {
              id: data.MenuId,
              name: data.MenuName,
              src: tokenSrc
            })
            if(data.OpenType === '3') {
              this.jumpTo(`/external-single/${data.MenuId}?big=${data.MenuType === 4}`, true)
            } else {
              this.$router.push({ name: '外部系统独立页', params: { menuId: data.MenuId } })
            }
          } else if(data.MenuType === 4) {
            if(data.OpenType === '3') {
              window.open(tokenSrc);
            } else {
              window.location.href = tokenSrc
            }
          } else if(path.includes('http://') || path.includes('https://') || path.includes('FDBL://')) {
            if(data.OpenType === '3') {
              window.open(path);
            } else {
              window.location.href = path
            }
          } else {
            let targetUrl = path.indexOf('?') ? path.split('?')[0] : path
            path = `${path}${(path.indexOf('?') === -1 ? '?' : '&')}menuId=${uMenuId}&menuName=${uMenuName}`
            save('permission_' + targetUrl.split('/')[1], { id: uMenuId, name: uMenuName }); // 对应菜单权限
            if(data.OpenType === '3') {
              this.jumpTo(path, true)
            } else {
              this.$router.push(path)
            }
          }
        }
      }
    }
  },
  created() {
    if(!this.$route.query.menuId) {
      this.$alert('URL参数缺失菜单ID, 请返回重新进入', '温馨提示')
      this.$router.back()
    } else {
      this.dispatch(FETCH_USER_MENU, {
        CurMenuId: this.$route.query.menuId
      }).then(() => {
        this.list = this.users.userMenu.filter(d => d.IsHide === '0').map(d => {
          return {
            TreeId: d.TreeId,
            MenuName: d.MenuName,
            MenuDesc: d.MenuDesc,
            MenuIcon: d.MenuIcon,
            RequestUrl: d.RequestUrl,
            disabled: d.Sfqy === '0',
            HasAuthority: d.HasAuthority,
            Sfqy: d.Sfqy,
            MenuType: d.MenuType,
            OpenType: d.OpenType,
            MenuId: d.MenuId
          }
        })
      }).catch(() => {
        this.$router.back();
      })
    }
  },
  mounted() {}
}
</script>
