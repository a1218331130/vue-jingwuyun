<template>
<div style="display:flex" v-loading="flag">
  <div class="cate__up" @click="miniSlider" v-if="miniWest">
    <i :class="['iconfont', miniWest? 'icon-enter':'icon-fold']"></i>
  </div>
  <div v-if="data!==null" :class="{'tree':true, 'app-west--mini':miniWest }">
    <div class="tree-title">
      {{data.MenuName}}
      <div class="cate__arrow" @click="miniSlider">
        <i :class="['iconfont', miniWest? 'icon-enter':'icon-return']"></i>
      </div>
    </div>
    <el-tree v-if="treeData.length>0" v-loading="flag" ref="treeNode" class="filter-tree" :props="defaultProps" :data="treeData" node-key="RequestUrl" highlight-current :current-node-key="treeData[0].SubMenus.length !== 0 ? treeData[0].SubMenus[0].RequestUrl : treeData[0].RequestUrl" height="100%" @node-click="handleNodeClick" :default-checked-keys="[treeData[0].RequestUrl]" :default-expanded-keys="[treeData[index].RequestUrl]"></el-tree>
  </div>
  <group :dataType="listType" :titleName="titleName" v-if="data.RequestUrl === '/control/risk/person'" @update-loading="changeLoading"></group>
  <!-- <countes :dataType="listType" :titleName="titleName" @update-loading="changeLoading" v-if="data.RequestUrl === '/control/chart'"></countes> -->
  <air :dataType="listType" :titleName="titleName" @update-loading="changeLoading" v-if="data.RequestUrl === '/control/risk/aviation'"></air>
  <car :dataType="listType" :titleName="titleName" @update-loading="changeLoading" v-if="data.RequestUrl === '/control/car'"></car>
  <place :dataType="listType" :parentType='parentType' :titleName="titleName" @update-loading="changeLoading" v-if="data.RequestUrl === '/control/risk/place'"></place>
  <org :dataType="listType" :parentType='parentType' :titleName="titleName" @update-loading="changeLoading" v-if="data.RequestUrl === '/control/risk/industry'"></org>
  <countTable :dataType="listType" :parentType='parentType' :titleName="titleName" @update-loading="changeLoading" v-if="data.RequestUrl === '/control/risk/count'"></countTable>
  <!-- <cases :dataType="listType" :titleName="titleName" v-if="data.RequestUrl === '/control/risk/case'"></cases> -->
  <!-- <keep-alive>
      <router-view v-if="showRouterView"></router-view>
    </keep-alive>
    <div v-if="!showRouterView" class="welcome"></div> -->
</div>
</template>
<style lang="scss" scoped>
  // 新添加的
  .tree {
    background: #fff;
    width: 230px;
    flex-shrink: 0;
    flex-basis: 226px;
    flex-grow: 0;
    .tree-title {
      width: 227px;
      background: #d4eaf7;
      color: #003369;
      height: 40px;
      line-height: 40px;
      text-align: center;
      position: fixed;
      z-index: 5;
    }
    &.app-west--mini {
      display: none;
    }
  }

  .cate__arrow {
    position: absolute;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    background: #fff;
    top: 0;
    right: 0;
    z-index: 3;
    border: 1px solid #ccc;
    line-height: 40px;
    color: #666;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      background: #f9f9f9;
      box-shadow: 1px 0 3px rgba(0, 0, 0, .2);
      opacity: 1;
    }
  }

  .cate__up {
    position: fixed;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    color: #000;
    background: #fff;
    z-index: 5;
    border: 1px solid #ccc;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      background: #f9f9f9;
      box-shadow: 1px 0 3px rgba(0, 0, 0, .2);
      opacity: 1;
    }
  }

  .search-result-tree {
    height: 100%;
  }

  .tree {
    //overflow-x: hidden;
    //height: 100%;
    //  position: fixed;
    //z-index: 9;
  }

  .filter-tree {
    border: none;
    box-sizing: border-box;
    padding-top: 40px;
    margin-bottom: 60px;
    position: fixed;
    height: calc(100% - 60px);
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid #ccc;
    z-index: 1;
    width: 227px;
  }

</style>
<style>
  .tree .el-tree-node__label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 180px;
  }

  .tree .el-tree-node__label:hover {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .tree .el-tree-node__content {
    height: 28px;
    line-height: 28px;
  }

</style>
<script>
  import group from './group/index'
  import air from './air/index'
  // import countes from './count/index'
  import car from './car/index'
  import place from './industry/index'
  import org from './org/index'
  import countTable from './table/index'
  export default {
    components: {
      air,
      group,
      car,
      // countes,
      place,
      countTable,
      org
    },
    data: () => ({
      miniWest: false,
      listType: '',
      parentType: '',
      checkeValue: '/freeder',
      flag: true,
      titleName: '',
      defaultProps: {
        label: 'MenuName',
        children: 'SubMenus'
      },
      menuNameList: [],
      index: 0
    }),
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    computed: {
      treeData() {
        let res = []
        const parser = function(array) {
          return array.filter(n => {
            if (n.SubMenus && n.SubMenus.length > 0) {
              n.SubMenus = parser(n.SubMenus)
            }
            return n.MenuType !== 2
          })
        }
        if (this.data !== null && this.data.children) {
          res = parser(this.data.children.slice())
        } else {
          res = []
        }
        this.menuNameList = res
        return res
      }
    },
    methods: {
      gettreeData() {
        let res = []
        const parser = function(array) {
          return array.filter(n => {
            if (n.SubMenus && n.SubMenus.length > 0) {
              n.SubMenus = parser(n.SubMenus)
            }
            return n.MenuType !== 2
          })
        }
        if (this.data !== null && this.data.children) {
          res = parser(this.data.children.slice())
        } else {
          res = []
        }
        return res
      },
      // 菜单收缩
      miniSlider() {
        this.miniWest = !this.miniWest
      },
      handleNodeClick(data) {
        console.log('data', data)
        if (data.HasAuthority === '0') {
          // 无权
          this.$message({
            type: 'error',
            message: '暂无此功能权限！',
            showClose: true
          })
        } else if (data.Sfqy === '0') {
          // 未启用
          this.$message('此处正在施工中……')
        } else {
          if (data.SubMenus.length === 0 && this.data.RequestUrl === '/control/risk/person') { // 重点群体人员子菜单
            // if(this.flag) {
            //   this.flag = false
            //   setTimeout(() => {
            //     this.flag = true
            //   }, 1000)
            this.titleName = data.MenuName
            this.menuNameList.forEach((d, i) => {
              d.SubMenus.forEach(f => {
                if (f.MenuName === this.titleName) {
                  console.log('index', i)
                  this.index = i
                }
              })
            })
            if (data.SubMenus.length === 0) {
              let url = data.RequestUrl.split('/') || []
              // this.listType = url[5] || url[4] || url[3] || url[2] || url[1] || ''
              for (var i = url.length - 1; i > 0; i--) {
                if (url[i] !== '') {
                  this.listType = url[i] || ''
                  this.parentType = url[i - 1] || ''
                  break
                }
              }
            }
          } else {
            if (data.SubMenus.length === 0) {
              // console.log(data.RequestUrl, 'url');
              this.titleName = data.MenuName
              this.menuNameList.forEach((d, i) => {
                d.SubMenus.forEach(f => {
                  if (f.MenuName === this.titleName) {
                    console.log('index', i)
                    this.index = i
                  }
                })
              })
              let url = data.RequestUrl.split('/') || []
              // this.listType = url[5] || url[4] || url[3] || url[2] || url[1] || ''
              for (var i2 = url.length - 1; i2 > 0; i2--) {
                if (url[i2] !== '') {
                  this.listType = url[i2] || ''
                  this.parentType = url[i2 - 1] || ''
                  break
                }
              }
            }
          }
          // console.log(url)
          // console.log('点击父菜单' + this.parentType)
          // console.log('点击菜单' + this.listType);
          // if (data.SubMenus.length === 0 && data.RequestUrl) {
          // let mainMenu = get(this.permission)
          // this.$router.push({ path: data.RequestUrl, query: { menuId: (mainMenu ? mainMenu.id : false) || this.$route.query.menuId || '', subMenuId: this.$route.query.subMenuId || '' } })
          // }
        }
      },
      changeLoading(val) {
        console.log(val, 'loading');
        this.flag = val
      }
    },
    mounted() {
      if (this.gettreeData()[0].SubMenus.length > 0) {
        let url = this.gettreeData()[0].SubMenus[0].RequestUrl.split('/') || []
        // this.listType = url[5] || url[4] || url[3] || url[2] || url[1] || ''
        for (let i = url.length - 1; i > 0; i--) {
          if (url[i] !== '') {
            this.listType = url[i] || ''
            this.parentType = url[i - 1] || ''
            break
          }
        }
      } else {
        let url = this.gettreeData()[0].RequestUrl.split('/') || []
        // this.listType = url[5] || url[4] || url[3] || url[2] || url[1] || ''
        for (let i = url.length - 1; i > 0; i--) {
          if (url[i] !== '') {
            this.listType = url[i] || ''
            this.parentType = url[i - 1] || ''
            break
          }
        }
      }
      // 侧边栏字典加载
      // this.listType = data.RequestUrl
    }
  }

</script>
