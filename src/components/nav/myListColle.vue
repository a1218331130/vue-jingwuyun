<template>
<div>
  <div class="classify-box">
    <el-row>
      <el-col :span="12">我的常用 :
        <!-- <span class="total"> {{total}}个</span> -->
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button size="mini" type="button" icon="plus" class="el-button import-btn add el-button--default el-button--mini" @click="upDialog=true">添加我的常用</el-button>
      </el-col>
    </el-row>
  </div>
    <div class="nav-list-box">
    <!--按点击数显示-->
    <div class="link-box">
      <div class="span" v-for="item in systemList" style="height:auto;width:185px">
        <div class="image_hide">    
           <img :src="item.icon"></img>
        </div>
        {{item.menuName}}
        <!-- <div class="label" :class="'c'+item.label">
          <span v-if="item.label==='1'">市</span>
          <span v-if="item.label==='2'">省</span>
          <span v-if="item.label==='3'">部</span>
        </div> -->
        <div class="hold" style="top:78px">
          <el-row>
            <!-- <el-col :span="8"><i class="iconfont icon-xinjianbiji" @click="intoEdit(item)"></i></el-col> -->
            <el-col :span="12">
              <!--<i class="iconfont icon-xinjianbiji" @click="apply(item)"></i>-->
              <a :href="item.absoluteUrl" target="_blank">
                <i class="iconfont icon-into"></i>
               </a>
            </el-col>
            <el-col :span="12" v-if="item.isColle!==null"><i class="iconfont icon-collection_fill" @click="systemDelete(item)"></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
  <!-- 上传模态窗 -->
   <list-dialog :dialog="upDialog" :ifSaveSystem="stysemSave" @close="upDialog=false" @returnSystem="returnSystems" :systemEdit="systemEditList"></list-dialog>
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
  import listDialog from './list-dialog'
  import editForm from './edit-form'
  import mixin from '../../utils/mixin'
  // import { getOnlyArray, getTokenUrl } from '../../utils/util'
  import bus from '../../utils/bus'
  import searchdialog from './search-dialog'
  // import { FWZX_JUMP_URL, DOWNLOAD_FILE_PATH } from '../../config'
  import {
    // FETCH_TYPE_LIST,
    // FETCH_CLICKNUM_LIST,
    // CANCEL_COLLE_XTZTC,
    // APPLY_XTZTC,
    APPLICATION_LIST,
    APPLICATION_DELETE
    // OUT_SYETEM_DELETE
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
      listDialog,
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
        var ipList = location.href.split('/');
        var myIp = ipList[2]
        this.dispatch(APPLICATION_LIST, {ip: myIp}).then(() => {
          this.systemList = this.colleXtztc.applicationList.map(c => {
            return {
              menuId: c.menuId,
              menuName: c.menuName,
              icon: c.icon,
              absoluteUrl: c.absoluteUrl + '?menuId=' + c.menuId + '&menuName=' + c.menuName
            }
          });
          console.log(this.colleXtztc, 'this.colleXtztc');
        })
      },
      into(object) {
        this.$emit('call:change', object)
      },
      // initTo(item) {
      //   if (item.ieOnly) {
      //     let link = '/#/ie/message?jumpPage=' + item.link + '&sysName=' + item.xtmc;
      //     window.open(getTokenUrl(link, this.userData.UserToken))
      //   } else {
      //     let link = getTokenUrl(item.link, this.userData.UserToken);
      //     let url = `${FWZX_JUMP_URL}?name=${item.name}&url=${link}`;
      //     window.open(getTokenUrl(url, this.userData.UserToken))
      //   }
      // },
      systemDelete(item) {
        this.$confirm('确定要取消收藏?', '温馨提示', {
          type: 'warning'
        }).then(() => {
          this.dispatch(APPLICATION_DELETE, {
            menuId: item.menuId
          }).then(d => {
            this.$message('取消成功!')
            this.outSystemList();
          })
        })
      },
      refresh() {
        this.dialog = false
        this.loadData()
      }
    },
    created() {
      this.outSystemList();
    },
    computed: {
      ...mapState(['xtztc', 'dict', 'colleXtztc', 'applyXtztc'])
    }
  }

</script>
