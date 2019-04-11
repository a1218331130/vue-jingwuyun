<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="添加收藏" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
<div class="nav-list-box">
  <div class="search-bar">
    <el-input placeholder="输入关键字搜索" v-model="navKeyword" class="search-input">
      <el-button slot="append" icon="search" @click="loadData"></el-button>
    </el-input>
  </div>


  <div class="content">
    <div class="genre-box" :key='iIndex' v-for="(list,iIndex) in list">
      <div class="type-box">
        <div class="type-title" style="max-width: 120px;" :class="'c'+list.classGrade">{{list.className}}
          <span> {{list.num}}</span>
        </div>
        <hr class="hr" style="width: calc(100% - 155px);" />
      </div>
      <div class="link-box">
        <div class="span" :key="index" v-for="(item,index) in list.class">
          <span class="collfont" v-if="item.isColle!==null"> <i class="iconfont icon-collection_fill" @click="unCollect(item)"></i></span>
          {{item.name}}
          <div class="label" :class="'c'+item.label">
            <span v-if="item.label==='3'">市</span>
            <span v-if="item.label==='2'">省</span>
            <span v-if="item.label==='1'">部</span>
          </div>
          <div class="hold">
            <el-row>
              <el-col :span="24" v-if="item.isColle===null">
                <i class="iconfont icon-collection" @click="collect(item)"></i>
              </el-col>
              <el-col :span="24" v-if="item.isColle!==null">
                <i class="iconfont icon-collection_fill" @click="unCollect(item)"></i>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.search-bar {
    width: 50%;
    position: relative;
    left: 20%;
    margin-bottom: 10px;
}
.content {
    height: 460px;
    overflow: scroll;
}
.collfont {
    color: #e6a00c;
    position: absolute;
    left: 5px;
}
</style>
<script>
import { FETCH_XTZTC_LIST, UPDATE_COLLE_XTZTC, CANCEL_COLLE_XTZTC } from '../../store/types'
import { mapState } from 'vuex'
import mixin from '../../utils/mixin'
import {
  getOnlyArray,
  arrayGetRid,
  clone
} from '../../utils/util'
export default {
  data: () => ({
    navKeyword: '',
    offClick: false,
    pageSize: 1000,
    list: []
  }),
  computed: {
    ...mapState(['xtztc'])
  },
  mixins: [mixin],
  props: ['dialog'],
  methods: {
    initDialog() {
      this.loadData()
      this.navKeyword = ''
      this.list = []
    },
    closeEvent() {
      this.$emit('close')
    },
    submit() {
      this.$emit('close')
    },
    loadData() {
      this.dispatch(FETCH_XTZTC_LIST, {
        xtmc: this.navKeyword,
        PageIndex: 1,
        PageSize: 1000000
      }).then(_ => {
        let cate = [];
        this.xtztc.PageData.forEach((d, i) => {
          cate.push(d.lxid)
        })
        let cateList = getOnlyArray(cate)
        this.list = cateList.map(d => {
          let childrenItemId = [] // 子类集合ID
          let children = this.xtztc.PageData.filter(c => c.lxid === d).map(c => {
            let _childrenObj = ''
            if(!childrenItemId.includes(c.id)) {
              childrenItemId.push(c.id)
              return {
                id: c.id,
                name: c.xtmc,
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
                webLogo: c.pic,
                isDLogin: c.sfdddl // 是否单点登录 是:’1‘
              }
            }
            return _childrenObj
          })
          children = arrayGetRid(children, '')
          return {
            num: children.length,
            classGrade: d,
            className: children[0].lxmc,
            class: children
          }
        })
      })
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
        }).then(_ => {
          item.isColle = null // 取消收藏
          item.sideUp = true // 收起侧栏
          this.into(item)

          this.$message({
            type: 'success',
            message: '取消成功!'
          })
          this.loadData();
        })
      })
    },
    into(object) {
      this.$emit('call:change', clone(object))
    }
  }
}
</script>
