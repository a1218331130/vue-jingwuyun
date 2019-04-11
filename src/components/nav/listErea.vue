<template>
<div class="nav-list-box">
  <el-input placeholder="输入关键字搜索" v-model="navKeyword" class="search-input">
    <el-button slot="append" icon="search" @click="loadData"></el-button>
  </el-input>
  <div class="genre-box" :key="iIndex" v-for="(list,iIndex) in list">
    <div class="type-box">
      <div class="type-title" :class="'c'+list.classGrade">
        <span v-if="list.className==='3'">市</span>
        <span v-if="list.className==='2'">省</span>
        <span v-if="list.className==='1'">部</span>
        <span>{{list.num}}</span>
      </div>
      <hr class="hr" />
    </div>
    <div class="link-box">
      <div class="span" :key="index" v-for="(item,index) in list.class" style="height:auto;width:185px">
        <div class="image_hide">    
           <img :src="item.webLogo"></img>
        </div>
        <span class="collfont" v-if="item.isColle!==null"> <i class="iconfont icon-collection_fill" @click="unCollect(item)"></i></span>
        {{item.name}}
        <!--<div class="label" :class="'c'+item.grade"> {{item.label}}-->
        <!--</div>-->
        <div class="hold" style="top:78px">
          <el-row>
            <el-col :span="8"><i class="iconfont icon-xinjianbiji" @click="into(item)"></i></el-col>
            <el-col :span="8">
              <!--<i class="iconfont icon-xinjianbiji" @click="apply(item)"></i>-->
              <i class="iconfont icon-into" @click="initTo(item)"></i>
            </el-col>
            <el-col :span="8" v-if="item.isColle===null"><i class="iconfont icon-collection" @click="collect(item)"></i>
            </el-col>
            <el-col :span="8" v-if="item.isColle!==null"><i class="iconfont icon-collection_fill" @click="unCollect(item)"></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped lang="scss">
  .search-input {
    float: right;
    width: 30%;
  }
  .image_hide {
    width:185px;
    height:65px;
    /* border:1px solid red; */
    margin: 0 auto;
    margin-top:10px;
  }
  .image_hide img {
    width:185px;
    height:65px;
  }
  .collfont {
    color: white;
    position: absolute;
    left: 0px;
    background: red;
    height: 20px;
    width: 20px;
    line-height: 20px;
    top: 0px;
    font-size: 12px;
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import crypto from 'crypto'
  import { getOnlyArray, arrayGetRid, getTokenUrl } from '../../utils/util'
  import bus from '../../utils/bus'
  import { FWZX_JUMP_URL, DOWNLOAD_FILE_PATH } from '../../config'

  import {
    FETCH_XTZTC_LIST,
    UPDATE_COLLE_XTZTC,
    CANCEL_COLLE_XTZTC,
    APPLY_XTZTC
  } from '../../store/types'
  import {
    mapState
  } from 'vuex'
  export default {
    mixins: [mixin],
    data() {
      return {
        navKeyword: '', // 搜索关键字
        pageSize: 100000,
        list: []
      }
    },
    mounted() {
      bus.$on('cancelNav', () => {
        this.loadData();
      })
    },
    methods: {
      loadData() {
        this.dispatch(FETCH_XTZTC_LIST, {
          xtmc: this.navKeyword,
          PageIndex: 1,
          PageSize: 100000000
        }).then(_ => {
          let area = [];
          this.xtztc.PageData.forEach((d, i) => {
            area.push(d.xtjb)
          })
          let cateList = getOnlyArray(area)
          this.list = cateList.map(d => {
            let childrenItemId = [] // 子类集合ID
            let children = this.xtztc.PageData.filter(c => c.xtjb === d).map(c => {
              let _childrenObj = ''
              if (!childrenItemId.includes(c.id)) {
                childrenItemId.push(c.id)
                return {
                  id: c.id,
                  name: c.xtmc.indexOf('md5') > 0 ? c.xtmc.slice(0, c.xtmc.length - 5) : c.xtmc,
                  htNmae: c.xtmc,
                  grade: c.lxid,
                  label: c.xtjb,
                  link: c.xtlj,
                  user: c.lxr,
                  phone: c.lxdh,
                  area: c.dw,
                  desc: c.jj,
                  system: c.xtgn,
                  xtmc: c.xtmc,
                  lxmc: c.lxmc,
                  isApply: c.sfsq,
                  isColle: c.sfsc1,
                  webLogo: DOWNLOAD_FILE_PATH + c.pic,
                  isDLogin: c.sfdddl // 是否单点登录 是:’1‘
                }
              }
              return _childrenObj
            })
            children = arrayGetRid(children, '')
            return {
              num: children.length,
              classGrade: d,
              className: d,
              class: children
            }
          })
        })
      },
      into(object) {
        this.$emit('call:change', object)
      },
      initTo(item) {
        if(item.htNmae.indexOf('md5') > 0) {
          let md5 = crypto.createHash('md5');
          md5.update(this.userData.UserSfz);
          this.md5Id = md5.digest('hex');
          let linkBeiJing = item.link + this.md5Id;
          window.open(linkBeiJing)
          return;
        }
        if (item.ieOnly) {
          let link = '/#/ie/message?jumpPage=' + item.link + '&sysName=' + item.xtmc;
          window.open(getTokenUrl(link, this.userData.UserToken))
        } else {
          let link = getTokenUrl(item.link, this.userData.UserToken);
          let url = `${FWZX_JUMP_URL}?name=${item.name}&url=${link}`;
          window.open(getTokenUrl(url, this.userData.UserToken))
        }
      },
      collect(item) {
        this.dispatch(UPDATE_COLLE_XTZTC, {
          sysid: item.id
        }).then(d => {
          item.isColle = '已收藏'
          item.sideUp = true // 收起侧栏
          this.into(item)
          if(this.colleXtztc.updateColleXtztc.indexOf('不允许重复收藏') > -1) {
            this.$message({
              type: 'error',
              message: this.colleXtztc.updateColleXtztc
            })
          }else {
            this.$message({
              type: 'success',
              message: this.colleXtztc.updateColleXtztc
            })
          }
          this.loadData();
        })
      },
      unCollect(item) {
        this.$confirm('确定要取消收藏?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(CANCEL_COLLE_XTZTC, {
            sysid: item.id
          }).then(d => {
            item.isColle = null
            item.sideUp = true // 收起侧栏
            this.into(item)

            this.$message('取消成功!')
            this.loadData();
          })
        })
      },
      apply(item) {
        if (item.isApply !== '' && item.isApply) {
          this.$alert('该项已提交申请,请勿重复提交', '提示', {
            confirmButtonText: '确认',
            type: 'warning'
          })
        } else {
          this.$prompt('申请原因', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            beforeClose: function(a, i, d) {
              if (a === 'confirm') {
                if (typeof i.inputValue === 'string' ? i.inputValue.replace(/(^\s+)|(\s$)/g, '') : i.inputValue) {
                  d()
                } else {
                  this.$message('请输入申请原因')
                }
              } else {
                d()
              }
            }
          }).then(cause => {
            this.dispatch(APPLY_XTZTC, {
              sysid: item.id,
              sqyy: cause.value.replace(/(^\s+)|(\s$)/g, '')
            }).then(d => {
              this.$message({
                type: 'success',
                message: '申请成功',
                showClose: true
              })
              item.isApply = '已申请'
              this.into(item)
            })
            this.offClick = false
          }).catch(() => {
            this.offClick = false
          })
        }
      }
    },
    created() {
      this.loadData();
    },
    computed: {
      ...mapState(['xtztc', 'dict', 'colleXtztc', 'applyXtztc'])
    }
  }

</script>
