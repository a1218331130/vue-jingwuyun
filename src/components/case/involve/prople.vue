<!-- 办案管理 -->
<template>
<div class="app-content-box">
  <el-row class="involve-box">
    <el-col :span="24" class="involve-box__title">涉案人员</el-col>
    <el-col :span="24" class="involve-box__item">
      <el-row>
        <el-col :span="24">
          <div class="involve-box__item__title">报案人/受害人</div>
          <div class="involve-box__item__person" v-for="d in victim">
            <div class="person__type">{{d.type}}</div>
            <el-button type="text" class="person__remove" @click="remove(victim,[d])"><i class="iconfont icon-close"></i></el-button>
            <img class="person__image" src="/static/img/testPersonImg.jpg" width="100px">
            <div class="person__idcard" @click="peopleInfoDialog=true"> {{detail.idCard}}</div>
            <span class="person__name">{{detail.name}}</span>
            <span class="person__source" @click="resPeopleDialog=true"><i class="iconfont icon-icon_gerendangan_normal"></i> 来源</span>
            <span class="ico-delete btn-action"></span>
          </div>
          <div class="involve-box__item__person involve-box__item__person--empty" @click="openAddPeopleDialog(1)"><i class="iconfont icon-plus"></i></div>
        </el-col>
        <el-col :span="24">
          <hr>
        </el-col>
        <el-col :span="24">
          <div class="involve-box__item__title">嫌疑人</div>
          <div class="involve-box__item__person" v-for="d in criminal">
            <el-button type="text" class="person__remove" @click="remove(criminal,[d])"><i class="iconfont icon-close"></i></el-button>
            <img class="person__image" src="/static/img/testPersonImg.jpg" width="100px">
            <div class="person__idcard" @click="peopleInfoDialog=true"> {{detail.idCard}}</div>
            <span class="person__name">{{detail.name}}</span>
            <span class="person__source" @click="resPeopleDialog=true"><i class="iconfont icon-icon_gerendangan_normal"></i> 来源</span>
            <span class="ico-delete btn-action"></span>
          </div>
          <div class="involve-box__item__person involve-box__item__person--empty" @click="openAddPeopleDialog(2)"><i class="iconfont icon-plus"></i></div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

  <dialog-people-info :dialog="peopleInfoDialog" :data="detail" @close="peopleInfoDialog=false"></dialog-people-info>
  <dialog-add-people :dialog="addPeopleDialog" :type="addType" :data="detail" @update="add" @close="addPeopleDialog=false"></dialog-add-people>
  <dialog-res-people :dialog="resPeopleDialog" @close="resPeopleDialog=false"></dialog-res-people>
</div>
</template>
<style lang="scss" scoped>
.iconfont {
    /*vertical-align: middle;*/
}

.involve-box {
    &__title {
        font-size: 16px;
        font-weight: 400;
        line-height: 32px;
    }
    &__item {
        &__title {
            line-height: 32px;
        }
        &__person {
            width: 155px;
            height: 240px;
            border: 1px solid #ccc;
            position: relative;
            display: inline-block;
            &+& {
                margin-left: 20px;
            }
            .person {
                &__type {
                    background: orange;
                    color: #fff;
                    padding: 0 5px;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                &__image {
                    width: 100%;
                    height: auto;
                }
                &__idcard,
                &__source {
                    text-align: center;
                    color: #115497;
                    cursor: pointer;
                    opacity: 0.8;
                    transition: 0.25s;
                    &:hover {
                        opacity: 1;
                    }
                }
                &__name {
                    padding: 0 3px;
                }
                &__source {
                    padding: 0 3px;
                    float: right;
                }
                &__remove {
                    background: red;
                    color: #fff;
                    padding: 0;
                    display: block;
                    opacity: 0.8;
                    border-radius: 0 0 0 3px;
                    position: absolute;
                    top: 0;
                    right: 0;
                    transition: 0.25s;
                    &:hover {
                        opacity: 1;
                    }
                    .iconfont {
                        height: 20px;
                        line-height: 20px;
                        margin: 0;
                    }
                }
            }
            &--empty {
                color: #aaa;
                cursor: pointer;
                opacity: 0.8;
                transition: 0.25s;
                &:hover {
                    opacity: 1;
                }
                .iconfont {
                    font-size: 32px;
                    text-align: center;
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    border: 1px solid #aaa;
                    border-radius: 100%;
                    position: absolute;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                &:after {
                    content: '添加人员';
                    font-size: 24px;
                    font-weight: 400;
                    text-align: center;
                    width: 100%;
                    position: absolute;
                    bottom: 50px;
                    left: 0;
                }
            }
        }
    }
}
</style>
<script>
import mixin from '../../../utils/mixin'
import infoDialogEvents from '../../../utils/infoDialogEvents'
import { clone, arrayGetRid } from '../../../utils/util'

import dialogInfo from '../../../widgets/info-dialog/info-dialog'
import dialogAddPeople from './dialog-add-people'
import dialogResPeople from './dialog-res-people'

export default {
  mixins: [mixin, infoDialogEvents],
  components: {
    'dialog-people-info': dialogInfo,
    'dialog-add-people': dialogAddPeople,
    'dialog-res-people': dialogResPeople
  },
  data() {
    return {
      addPeopleDialog: false,
      resPeopleDialog: false,
      addType: 1,
      victim: [],
      criminal: [],
      detail: {
        contentType: 1,
        id: 1,
        city: '长沙',
        name: '李明钟',
        idCard: '440104198005065314',
        mobile: '13585466875',
        sex: '男',
        birthday: '1980-05-06',
        nation: '汉',
        native: '湖南省怀化市鹤城区',
        residence: '湖南省怀化市鹤城区',
        domicile: '湖南省怀化市鹤城区坨院街道',
        plateNo: '湘N A56R7',
        service: '不详'
      }
    }
  },
  computed: {},
  methods: {
    openAddPeopleDialog(type) {
      this.addType = type
      this.addPeopleDialog = true
    },
    add(obj) {
      if (this.addType === 1) {
        this.victim.push(clone(obj))
      } else {
        this.criminal.push(clone(obj))
      }
      this.addPeopleDialog = false
    },
    remove(parent, item) {
      this.$confirm('确认删除该人员?', '温馨掘进', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        arrayGetRid(parent, item)
      }).catch(() => {});
    }
  },
  created() {},
  mounted() {}
}
</script>
