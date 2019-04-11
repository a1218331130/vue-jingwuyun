<template>
<div class="nav-list-box">
  <el-input placeholder="输入关键字搜索" v-model="navKeyword" class="search-input">
    <el-button slot="append" icon="search" @click="loadData"></el-button>
  </el-input>
  <div class="genre-box" :key='iIndex' v-for="(list,iIndex) in list">
    <div class="type-box">
      <div class="type-title" style="max-width: 120px;" :class="'c'+list.classGrade">{{list.className}}
        <span> {{list.num}}</span>
      </div>
      <hr class="hr" style="width: calc(100% - 155px);" />
    </div>
    <div class="link-box">
      <div class="span" :key="index" v-for="(item,index) in list.class">{{item.name}}
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
.nav-list-box {
    .link-box {
        span {
            width: 128px;
        }
    }
}
</style>
<script>
export default {
  data() {
    return {
      list: [{
        num: 3,
        classGrade: '1',
        className: '案',
        class: [{
          name: '按警编号'
        }, {
          name: '按警编号'
        }, {
          name: '按警编号'
        }]
      }, {
        num: 1,
        classGrade: '2',
        className: '人',
        class: [{
          name: '按警编号'
        }]
      }, {
        num: 2,
        classGrade: '3',
        className: '物',
        class: [{
          name: '按警编号'
        }, {
          name: '按警编号'
        }]
      }]
    }
  }
}
</script>
