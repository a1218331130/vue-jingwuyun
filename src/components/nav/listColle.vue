<template>
<div>
  <div class="classify-box">
    <el-row>
      <el-col :span="12">收藏系统 :
        <span class="total"> {{total}}个</span>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="dialog=true">添加收藏</el-button>
        <el-button-group class="classify">
          <el-button :class="{current:type===1}" @click="type=1">点击数 <i class="iconfont icon-paixu"></i></el-button>
          <el-button :class="{current:type===2}" @click="type=2">分类 <i class="iconfont icon-menu"></i></el-button>
        </el-button-group>
      </el-col>
    </el-row>
  </div>
  <div class="nav-list-box">
    <!--按分类显示-->
    <div v-if="type===2" class="genre-box" :key="lIndex" v-for="(list,lIndex) in list">
      <div class="type-box">
        <div class="type-title" style="max-width: 120px;" :class="'c'+list.classGrade">{{list.className}}
          <span> {{list.num}}</span>
        </div>
        <hr class="hr" style="width: calc(100% - 155px);" />
      </div>
      <div class="link-box">
        <div class="span" :key="iIndex" v-for="(item,iIndex) in list.class" style="height:auto">
          <div class="image_hide">    
           <img :src="item.webLogo"></img>
          </div>
          <span class="collfont" v-if="item.isColle!==null"> <i class="iconfont icon-collection_fill" @click="unCollect(item)"></i></span>
          {{item.name}}
          <div class="label" :class="'c'+item.label">
            <span v-if="item.label==='1'">市</span>
            <span v-if="item.label==='2'">省</span>
            <span v-if="item.label==='3'">部</span>
          </div>
          <div class="hold" style="top:78px">
            <el-row>
              <el-col :span="8"><i class="iconfont icon-into" @click="into(item)"></i></el-col>
              <el-col :span="8"><i class="iconfont icon-xinjianbiji" @click="apply(item)"></i></el-col>
              <el-col :span="8" v-if="item.isColle!==null"><i class="iconfont icon-collection_fill" @click="unCollect(item)"></i>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <searchdialog :dialog="dialog" @close="refresh"></searchdialog>
    <!--按点击数显示-->
    <div v-if="type===1" class="link-box">
      <div class="span" v-for="item in clickList" style="height:auto;width:185px">
        <div class="image_hide">    
           <img :src="item.webLogo"></img>
        </div>
        {{item.name}}
        <div class="label" :class="'c'+item.label">
          <span v-if="item.label==='1'">市</span>
          <span v-if="item.label==='2'">省</span>
          <span v-if="item.label==='3'">部</span>
        </div>
        <div class="hold" style="top:78px">
          <el-row>
            <el-col :span="8"><i class="iconfont icon-xinjianbiji" @click="into(item)"></i></el-col>
            <el-col :span="8">
              <!--<i class="iconfont icon-xinjianbiji" @click="apply(item)"></i>-->
              <i class="iconfont icon-into" @click="initTo(item)"></i>
            </el-col>
            <el-col :span="8" v-if="item.isColle!==null"><i class="iconfont icon-collection_fill" @click="unCollect(item)"></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  <div class="classify-box">
    <el-row>
      <el-col :span="12">外部系统 :
        <!-- <span class="total"> {{total}}个</span> -->
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="upDialog=true">添加外部系统</el-button>
      </el-col>
    </el-row>
  </div>
    <div class="nav-list-box">
    <!--按点击数显示-->
    <div class="link-box">
      <div class="span" v-for="item in systemList" style="height:auto;width:185px">
        <div class="image_hide">    
           <img :src="item.webLogo"></img>
        </div>
        {{item.systemName}}
        <!-- <div class="label" :class="'c'+item.label">
          <span v-if="item.label==='1'">市</span>
          <span v-if="item.label==='2'">省</span>
          <span v-if="item.label==='3'">部</span>
        </div> -->
        <div class="hold" style="top:78px">
          <el-row>
            <el-col :span="8"><i class="iconfont icon-xinjianbiji" @click="intoEdit(item)"></i></el-col>
            <el-col :span="8">
              <!--<i class="iconfont icon-xinjianbiji" @click="apply(item)"></i>-->
              <a :href="item.systemUrl" target="_blank">
                <i class="iconfont icon-into"></i>
               </a>
            </el-col>
            <el-col :span="8" v-if="item.isColle!==null"><i class="iconfont icon-collection_fill" @click="systemDelete(item)"></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  <!-- 上传模态窗 -->
   <up-form :dialog="upDialog" :ifSaveSystem="stysemSave" @close="upDialog=false" @returnSystem="returnSystems" :systemEdit="systemEditList"></up-form> 
   <!-- 编辑模态窗 -->
   <edit-form :dialog="editDialog" :ifSaveSystem="stysemSave" @close="editDialog=false" @returnSystem="returnSystems" :systemEdit="systemEditList"></edit-form> 
</div>
</template>
<style lang="scss" scoped>
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
  /**情报导航分类/等级颜色**/

  $firstColor: #0c5693;
  $secondColor: #0f9f0a;
  $thirtColor: #d43249;
  $fourthColor: #ef6c02;
  $fifthColor: #105bb8;
  .classify-box {
    text-align: left;
    padding: 10px 10px 0;
    margin-bottom: 10px;
    height: 37px;
    border-bottom: 1px solid #cccccc;
    .total {
      color: #ff9900;
    }
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

  .classify {
    height: 28px;
    border: 1px solid #cccccc;
    display: inline-block;
    .el-button {
      text-align: center;
      display: inline-block;
      height: 28px;
      line-height: 28px;
      padding: 0 10px;
      border: 0;
      color: #cccccc;
      &.current,
      &:hover {
        background-color: #fb991a;
        color: #ffffff;
      }
    }
  }

</style>
<script>
  import upForm from './up-form'
  import editForm from './edit-form'
  import mixin from '../../utils/mixin'
  import crypto from 'crypto'
  import { getOnlyArray, getTokenUrl } from '../../utils/util'
  import bus from '../../utils/bus'
  import searchdialog from './search-dialog'
  import { FWZX_JUMP_URL, DOWNLOAD_FILE_PATH } from '../../config'
  import {
    FETCH_TYPE_LIST,
    FETCH_CLICKNUM_LIST,
    CANCEL_COLLE_XTZTC,
    APPLY_XTZTC,
    OUT_SYETEM_LIST,
    OUT_SYETEM_DELETE
  } from '../../store/types'
  import {
    mapState
  } from 'vuex'
  export default {
    mixins: [mixin],
    data() {
      return {
        dialog: false,
        upDialog: false,
        editDialog: false,
        stysemSave: false,
        pageSize: 100000,
        list: [],
        clickList: [],
        systemList: [],
        systemEditList: {},
        type: 1,
        total: ''
      }
    },
    components: {
      searchdialog,
      upForm,
      editForm
    },
    mounted() {
      bus.$on('cancelNav', () => {
        this.loadData();
      })
    },
    methods: {
      // 外部系统编辑
      intoEdit(item) {
        this.systemEditList = item;
        this.editDialog = true;
      },
      returnSystems(msg) {
        this.outSystemList();
      },
      outSystemList() {
        this.dispatch(OUT_SYETEM_LIST, {}).then(() => {
          this.systemList = this.colleXtztc.outSyetemList.map(c => {
            return {
              id: c.id,
              createTime: c.createTime,
              createUser: c.createUser,
              systemName: c.systemName,
              systemUrl: c.systemUrl,
              webLogo: DOWNLOAD_FILE_PATH + c.systemPic
            }
          });
          console.log(this.colleXtztc, 'this.colleXtztc');
        })
      },
      loadData(page = 1, pageSize = 100000) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_CLICKNUM_LIST, {
          PageIndex: page,
          PageSize: pageSize
        }).then(_ => {
          // 总数
          this.total = this.applyXtztc.fetchClicknumList.length
          this.clickList = this.applyXtztc.fetchClicknumList.map(c => {
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
          })
        })
        this.dispatch(FETCH_TYPE_LIST, {
          PageIndex: page,
          PageSize: pageSize
        }).then(_ => {
          let cate = [];
          this.applyXtztc.fetchTypeList.forEach((d, i) => {
            cate.push(d.lxid)
          })
          let cateList = getOnlyArray(cate)
          this.list = cateList.map(d => {
            let children = this.applyXtztc.fetchTypeList.filter(c => c.lxid === d).map(c => {
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
                webLogo: c.pic
              }
            })
            return {
              num: children.length,
              classGrade: d,
              className: children[0].lxmc,
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
      systemDelete(item) {
        this.$confirm('确定要取消收藏?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(OUT_SYETEM_DELETE, {
            id: item.id
          }).then(d => {
            this.$message('取消成功!')
            this.outSystemList();
          })
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
      },
      refresh() {
        this.dialog = false
        this.loadData()
      }
    },
    created() {
      this.loadData();
      this.outSystemList();
    },
    computed: {
      ...mapState(['xtztc', 'dict', 'colleXtztc', 'applyXtztc'])
    }
  }

</script>
