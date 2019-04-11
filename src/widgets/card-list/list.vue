<template>
  <el-row>
    <el-row :class="'box ' + (mode=='list'?'list':'card')" :gutter="20">
      <el-col v-if="data.length>0" class="item-box" :xs="mode=='list'?24:12" :sm="mode=='list'?24:6" :md="mode=='list'?24:6" :lg="mode=='list'?24:4" :span="mode=='list'?24:6" v-for="item in data" :key="item.id">
        <el-card class="item" :title="item.modelName" :body-style="{ padding: '0px' }">
          <div class="ctrl" v-show="needBtn==true">
            <div class="btn-box">
              <router-link :to="{ name: '调度任务', params: { type:'edit', id: item.pkValue}}">
                <el-button class="btn" type="text" title="定时" icon="time"></el-button>
              </router-link>

              <router-link :to="{ name: '建模', query: { type: 'edit', id:item.pkValue}}">
                <el-button class="btn" type="text" title="设置" icon="setting"></el-button>
              </router-link>

              <el-button class="btn" type="text" title="删除" icon="delete" @click="remove"></el-button>
            </div>
          </div>
          <router-link :to="{ name: '建模', query: { type: type, id:item.pkValue}}">
            <img src="" class="image">
          </router-link>
          <el-col :span="24">
            <el-col class="title" :span="mode=='list'?19:24">
              <router-link :to="{ name: '建模', query: { type: type, id:item.pkValue}}" style="color:#666; text-decoration:none;">
                {{item.modelName}}
              </router-link>
            </el-col>
            <el-col class="datetime" :span="mode=='list'?5:24">
              {{item.modifyTime}}
            </el-col>
          </el-col>
          <el-col :span="24">
            <div class="desc">{{item.description}}</div>
          </el-col>
        </el-card>
        <el-col :span="24">
          <hr>
        </el-col>
      </el-col>
      <el-col v-else :span="24" style="text-align:center; line-height:50px;">
        暂无相关数据
      </el-col>
    </el-row>
    <pagination v-if="pagenav" :count="count" :pagenav="pagenav" @update:pagenav="val=>updatePagenav(val)"></pagination>
  </el-row>
</template>

<style lang="scss" lscoped>
  .box {
    &.card {
      .item {
        background-color: #e5f3fe;
        padding: 10px;
        margin-bottom: 20px;
        position: relative;
        .ctrl {
          width: calc(100% - 2px);
          height: calc(100% - 2px);
          border: 1px solid #1165a7;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          display: none;
          .btn-box {
            background-color: #1165a7;
            width: 100%;
            height: 50px;
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn {
              color: #fff;
              font-size: 1.5rem;
              margin: 0 0.5rem;
              display: inline-block;
            }
          }
        }
        &:hover {
          .ctrl {
            display: block;
          }
        }
        .image {
          background-color: #fff;
          border: 0;
          width: 100%;
          height: 150px; //auto;
          position: relative;
          z-index: 2;
          display: block;
        }
        .title {
          font-size: 12px;
          color: #000;
          text-align: center;
          line-height: 30px;
          padding: 0 0.5rem;
          margin: 0.5rem 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .datetime {
          font-size: 10px;
          color: #7a7c7e;
          text-align: center;
        }
        .desc {
          display: none;
        }
      }
      hr {
        display: none;
      }
    }
    &.list {
      .item-box {
        // &:nth-child(even) {
        &:hover {
          background-color: #f7f7f7;
        }
      }
      .item {
        background: transparent;
        font-size: 14px;
        padding: 0;
        border: 0;
        box-shadow: none;
        img {
          display: none;
        }
        .title {
          color: #000;
          height: 30px;
          line-height: 30px;
          margin-bottom: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: block;
        }
        .datetime {
          color: #666;
          text-align: right;
          line-height: 30px;
        }
        .desc {
          color: #999;
          line-height: 30px;
          margin-bottom: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      hr {
        display: none;
      }
    }
  }
</style>

<script>
  import pagination from '../pagination/pagination.vue'

  export default {
    data: function() {
      return {}
    },
    props: ['type', 'mode', 'data', 'count', 'pagenav', 'needBtn'],
    computed: {},
    methods: {
      updatePagenav(value) {
        this.$emit('update:pagenav', value)
      },
      remove() {
        if (confirm('确认删除该模型?')) {
          console.log('删除模型');
        }
      }
    },
    components: {
      'pagination': pagination
    },
    mounted: function() {}
  }
</script>
