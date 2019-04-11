<template>
<div class="nav-list-box">
  <el-button-group class="slotBox">
    <el-button :class="{current:(current === item)}" :disabled="!soltSelect.includes(item)" :key="index" v-for="(item,index) in solt" @click="clickLetterChange(item)">
      {{item}}
    </el-button>
  </el-button-group>
  <div class="letter-content-box_div" ref="letter-content-box_ref">
    <div class="genre-box" :letterClass="lItem.className" :key="lIndex" v-for="(lItem,lIndex) in list">
      <div class="type-box">
        <div class="type-title" :class="'c'+lItem.classGrade">{{lItem.className}}
          <span> ({{lItem.num}})</span>
        </div>
        <hr class="hr" />
      </div>
      <div class="link-box">
        <div class="span" :key="iInd" v-for="(item,iInd) in lItem.classChildren" style="height:auto;width:185px">
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
  .nav-list-box {
    height: calc(100% - 20px);
    overflow: hidden;
    position: relative;
    .letter-content-box_div {
      overflow: auto;
      height: calc(100% - 55px);
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

  .slotBox {
    width: calc(100% - 10px);
    display: flex;
    margin: 5px 5px 20px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    .el-button {
      background: #f5f5f5;
      flex-grow: 1;
      cursor: pointer;
      text-align: center;
      height: 28px;
      line-height: 28px;
      padding: 0;
      border: 0;
      &.current,
      &:hover {
        background-color: #fcb527;
        color: #ffffff;
        border-color: #ccc;
      }
    }
  }

</style>
<script>
  import mixin from '../../utils/mixin'
  import crypto from 'crypto'
  import bus from '../../utils/bus'
  import { FWZX_JUMP_URL, DOWNLOAD_FILE_PATH } from '../../config'

  import {
    arrayGetRid,
    getOnlyArray,
    getTokenUrl
  } from '../../utils/util'
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
        pageSize: 100000,
        list: [],
        childrenArray: [],
        current: 'A',
        soltSelect: [],
        solt: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      }
    },
    mounted() {
      bus.$on('cancelNav', () => {
        this.loadData();
      })
      // 监控滚动条数据
      let parentDom = this.$refs['letter-content-box_ref']
      parentDom.addEventListener('scroll', it => {
        if (this.childrenArray.length === 0) {
          // 初始化维护滚动结果集合
          for (let iDom of parentDom.children) {
            this.childrenArray.push({
              letter: iDom.getAttribute('letterClass'),
              scrollTop: iDom.offsetTop - 85
            })
          }
          this.current = this.childrenArray[0].letter
        }
        for (let ich of this.childrenArray) {
          if (it.srcElement.scrollTop >= ich.scrollTop) {
            this.current = ich.letter //  更改当前选中字母
          }
        }
      })
    },
    methods: {
      loadData(page = 1, pageSize = 100000) {
        this.pageSize = pageSize;
        this.dispatch(FETCH_XTZTC_LIST, {
          PageIndex: page,
          PageSize: pageSize
        }).then(_ => {
          let initial = [];
          this.xtztc.PageData.forEach((d, i) => {
            initial.push(d.szm)
          })
          let cateList = getOnlyArray(initial).sort()

          this.current = cateList[0]
          this.soltSelect = cateList

          this.list = cateList.map(d => {
            let childrenItemId = [] // 子类集合ID
            let children = this.xtztc.PageData.filter(c => c.szm === d).map(c => {
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
                  szm: c.szm,
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
              classGrade: children[0].grade,
              className: children[0].szm,
              classChildren: children
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
      },
      /***
       * 检索字母跳转滚动
       * @param item
       */
      clickLetterChange(item) {
        let parentDom = this.$refs['letter-content-box_ref']
        if (this.childrenArray.length === 0) {
          // 初始化维护滚动结果集合
          for (let iDom of parentDom.children) {
            this.childrenArray.push({
              letter: iDom.getAttribute('letterClass'),
              scrollTop: iDom.offsetTop - 85
            })
          }
          this.current = this.childrenArray[0].letter
        }
        if (this.current !== item) {
          for (let ich of this.childrenArray) {
            if (ich.letter === item) {
              this.rollAnimation(parentDom.scrollTop - 10, ich.scrollTop, item)
            }
          }
        }
      },
      rollAnimation(rollStart, rollEnd, title) {
        // 滚动条滚动
        let stepLength = rollEnd - rollStart
        if (stepLength > 0) {
          let st = setInterval(_ => {
            rollStart += stepLength / 60
            this.$refs['letter-content-box_ref'].scrollTop = rollStart
            if (rollStart >= rollEnd) {
              clearInterval(st)
            }
          }, 1)
        } else {
          stepLength = rollStart - rollEnd
          let st = setInterval(_ => {
            rollStart -= stepLength / 60
            this.$refs['letter-content-box_ref'].scrollTop = rollStart
            if (rollEnd + 10 >= rollStart) {
              clearInterval(st)
            }
          }, 1)
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
