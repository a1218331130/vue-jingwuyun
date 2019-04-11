<template>
<div class="sidebar--tree">
  <ul id="userMenuTree"></ul>
  <loader-bar :action="loading"></loader-bar>
</div>
</template>
<style lang="scss">
.sidebar {
    &--tree {
        height: calc(100% - 48px);
        overflow: auto;
        ul {
            background: #1770c5;
            list-style: none;
            padding: 0;
            margin: 0;
            li {
                &:hover {
                    background: #2078d9;
                }
                a {
                    height: 42px;
                    line-height: 42px;
                    color: #fff;
                    padding-left: 20px;
                    display: block;
                    border-bottom: 1px solid #115497;
                    cursor: pointer;
                    &.curSelectedNode {
                        background: #BD6C39;
                    }
                }
                ul {
                    box-shadow: inset 0 5px 5px rgba(0,0,0,.2);
                    > li {
                        a {
                            height: 30px;
                            line-height: 30px;
                            padding-left: 35px;
                            position: relative;
                            border-bottom: 0 solid #115497;
                            &:before {
                                content: '';
                                display: block;
                                background: #1770c5;
                                width: 5px;
                                height: 5px;
                                border-radius: 5px;
                                border: 1px solid #b4daf5;
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                                left: 20px;
                                z-index: 3;
                            }
                            &:after {
                                content: '';
                                display: block;
                                background: #b4daf5;
                                height: 100%;
                                width: 1px;
                                position: absolute;
                                left: 23px;
                                top: 0;
                            }
                        }

                        ul {
                            box-shadow: inset 0 0 0 rgba(0,0,0,.2);
                            li {
                                a {
                                    padding-left: 45px;
                                    &:before {
                                        display: none;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
<script>
import '../../../node_modules/_ztree@3.5.24@ztree/js/jquery.ztree.core.min.js'
import '../../../node_modules/_ztree@3.5.24@ztree/js/jquery.ztree.excheck.min.js'

import mixin from '../../utils/mixin'

import { mapState } from 'vuex'
import { FETCH_USER_MENU } from '../../store/types'

import { getTokenUrl, clone } from '../../utils/util'
import { get, remove } from '../../utils/storage'

// import { getTokenUrl } from '../../utils/util'

import loaderBar from '../../widgets/loader/loader-bar.vue'

export default {
  mixins: [mixin],
  components: {
    'loader-bar': loaderBar
  },
  data() {
    return {
      items: [],
      menus: []
    }
  },
  props: {
    collapsed: Boolean,
    active: String,
    data: {
      type: Array,
      default: null
    }
  },
  computed: {
    ...mapState({
      menuList: state => state.users.userMenu,
      menusInfo: state => state.menus.Model
    })
  },
  watch: {
    collapsed(val) {
      if (val) {
        this.handleMouseLeave()
      }
    }
  },
  methods: {
    getMenus() {
      return hideItems(clone(this.menuList))

      function hideItems(target) {
        return target.filter(d => {
          if ((d.MenuType === 1 || d.MenuType === 3) && d.SubMenus && d.SubMenus.length > 0) {
            d.SubMenus = hideItems(d.SubMenus)
          }
          return d.MenuType === 1 || d.MenuType === 3
        })
      }
    },
    checkNodeRule(node) {
      let res = false
      if (node.Sfqy !== '1') {
        this.$message('此处正在施工中……')
      } else if (node.HasAuthority !== '1') {
        this.$message({
          type: 'error',
          message: '暂无此功能权限！',
          showClose: true
        })
      } else {
        res = true
      }
      return res
    }
  },
  mounted() {},
  created() {
    const permissionId = get(this.permission).id;
    if (!permissionId) {
      remove(this.permission)
      remove('ngw_user_actions')
      this.$router.push('/login')
    } else {
      this.dispatch(FETCH_USER_MENU, {
        CurMenuId: permissionId
      }).then(() => {
        this.$nextTick(() => {
          this.$.fn.zTree.init(this.$('#userMenuTree'), {
            data: {
              key: {
                name: 'MenuName',
                children: 'SubMenus',
                isHidden: true
              }
            },
            callback: {
              beforeCollapse: (id, node) => {
                return this.checkNodeRule(node)
              },
              beforeClick: (id, node) => {
                return this.checkNodeRule(node)
              },
              onClick: (e, id, node) => {
                let path = node.RequestUrl
                console.log(path)
                if ((!node.SubMenus || node.SubMenus.length === 0) && path) {
                  // 跳转
                  if (node.MenuType === 3) {
                    this.$emit('update:external', getTokenUrl(path, this.userData.UserToken))
                  } else {
                    this.$emit('update:external', '')
                    // this.$router.push(path);
                    window.location.href = '/#' + path
                    // this.collapsed && this.handleItemClick(path);
                  }
                }
              }
            }
          }, this.getMenus())
        })
      })
    }
  },
  updated() {}
}
</script>
