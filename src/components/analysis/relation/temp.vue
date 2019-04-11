<template>
<div class="temp">
  <div class="temp-top">
    <span>草稿记录</span>
    <el-button icon="close" @click="close"></el-button>
  </div>
  <div class="temp-content">
    <ul>
      <li v-for="(item,i) in list" :key="i">
        <el-button icon="close" @click="removeItem(i)"></el-button>
        <img :src="item.img" @click="useRecord(item)">
        <div class="datetime" @click="useRecord(item)">
          {{item.dateTime}}
        </div>
      </li>
    </ul>
  </div>
  <el-button type="primary" class="submit-button" @click="newRecord">保存草稿</el-button>
</div>
</template>
<style lang="scss" scoped>
  .temp {
    background: #f1f1f1;
    width: 200px;
    height: 310px;
    &-top {
      background-color: #377BB9;
      color: rgba(255, 255, 255, 0.96);
      height: 35px;
      line-height: 35px;
      text-align: center;
      position: relative;
      span {
        display: inline-block;
        padding-left: 10px;
        height: 25px;
        line-height: 25px;
      }
      .el-button {
        background: transparent;
        color: rgba(255, 255, 255, 0.94);
        padding: 0;
        border: 0;
        position: absolute;
        top: 10px;
        right: 5px;
      }
    }
    &-content {
      height: 250px;
      overflow-x: hidden;
      overflow-y: auto;
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
          height: 60px;
          line-height: 60px;
          position: relative;
          cursor: pointer;
          .el-button {
            background: transparent;
            color: #999;
            text-align: center;
            width: 18px;
            height: 60px;
            line-height: 60px;
            padding: 0;
            border: 0;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }
          img {
            background: #fff;
            width: 50px;
            height: 50px;
            position: absolute;
            top: 5px;
            left: 20px;
          }
          .datetime {
            font-size: 12px;
            height: 50px;
            line-height: 50px;
            position: absolute;
            top: 5px;
            left: 70px;
          }
          &:hover {
            background: #e4eafa;
            .el-button {
              opacity: 0.8;
              &:hover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }

  .submit-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: #377BB9
  }

</style>
<script>
  export default {
    data() {
      return {}
    },
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    methods: {
      removeItem(index) {
        this.$confirm('请确认是否删除该快照? 该操作不可恢复!', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('call:remove', index)
        }).catch(() => {})
      },
      close() {
        this.$emit('close')
      },
      newRecord() {
        this.$emit('call:newRecord')
      },
      useRecord(item) {
        this.$confirm('请确认是否使用快照替换当前关系模型? (建议先使用临时储存备份当前模型)', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('call:useRecord', item)
        }).catch(() => {})
      }
    }
  }

</script>
