<template>
<div class="app-west-menu">
  <ul>
    <li class="start">
      <div class="mark-box">
        <div class="mark-icon">
        </div>
        <div class="connect-bottom"></div>
      </div>
    </li>

    <li v-for="item in dataList" @click="menuClickEvent(item)">
      <div class="mark-box">
        <div class="connect-top"></div>
        <div :class="{'mark-icon':thisSelectTitle !== item.title,'mark-select iconfont icon-right-tag':thisSelectTitle === item.title}">
        </div>
        <div class="connect-bottom">
          <div :class="{'text-box':true,'text-box-select':thisSelectTitle === item.title}">
            {{item.title}}
            <span class="number">{{item.number?item.number:''}}</span>
          </div>
        </div>
      </div>
    </li>

    <li class="end">
      <div class="mark-box">
        <div class="connect-top"></div>
        <div class="mark-icon-end">
          end
        </div>
      </div>
    </li>
  </ul>
</div>
</template>

<style scoped lang="scss">
  .app-west-menu {
    width: 170px;
    position: absolute;
    left: 10px;
    top: 20px;
    height: calc(100% - 40px);
    overflow-y: auto;
    &::-webkit-scrollbar {
      // background: transparent;
      width: 4px;
      &-track {
        background: transparent;
      }
      &-thumb {
        background: rgba(0, 0, 0, .2); //$borderColor;
        border-radius: 8px;
      }
    }
    >ul {
      list-style: none;
      width: 100%;
      padding: 0;
      margin: 0;
      background-color: #fff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
      >li {
        display: flex;
        cursor: pointer;
        .mark-box {
          float: left;
          margin-left: 10px;
          width: 170px;
          position: relative;
          .mark-icon {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #C9C9C9;
            position: absolute;
            border: 1px solid #fff;
            margin-left: -1px;
          }
          .mark-select {
            color: #46BDFD;
            margin-left: -4px;
            font-size: 12px;
            position: absolute;
            background-color: white;
            line-height: 13px;
          }
          .connect-top {
            height: 13px;
            width: 2px;
            margin-left: 5px;
            background-color: #E4E4E4;
          }
          .connect-bottom {
            min-height: 27px;
            margin-left: 5px;
            margin-right: 5px;
            border-left: 2px solid #E4E4E4;
            .number {
              color: #46BDFD; // color: #ff6633;
              float: right;
              padding-right: 5px;
            }
            .text-box {
              margin: -1px 0 0 10px;
              color: #1E1E1E;
              line-height: 1.2;
              &-select {
                margin-left: 15px;
              }
            }
          }
        }
      }
      >li:hover {
        background-color: #B4D6F1;
        .mark-icon {
          background-color: #46BDFD;
          border-color: transparent;
        }
        .mark-select {
          background-color: transparent;
        }
      }
      >li.start:hover {
        background-color: rgba(180, 214, 241, 0);
        cursor: default;
        .mark-icon {
          background-color: rgba(70, 189, 253, 0);
        }
      }
      >li.end:hover {
        background-color: rgba(180, 214, 241, 0);
        cursor: default;
        .mark-icon {
          background-color: rgba(70, 189, 253, 0);
        }
      }
      .start {
        .mark-box {
          margin-top: 14px;
          .mark-icon {
            width: 9px;
            height: 9px;
            background-color: #fff;
            border: 2px solid #2F8BD8;
          }
        }
      }
      .end {
        .mark-box {
          .mark-icon-end {
            color: #E4E4E4;
            margin-left: -5px;
            padding-bottom: 10px;
          }
        }
      }
    }
  }

</style>

<script>
  import bus from '../../utils/bus'
  export default {
    data() {
      return {
        dataList: [],
        thisSelectTitle: '',
        titleNumber: ''
      }
    },
    props: [],
    methods: {
      menuClickEvent(item) {
        // 菜单点击事件,返回当前点击项
        bus.$emit('clickEvent:menuSubTitle', item)
      }
    },
    mounted() {},
    created() {
      bus.$on('update:dossierSubTitle', d => {
        this.dataList = d
        this.thisSelectTitle = this.dataList[0].title
      })
      bus.$on('update:dossierThisSubTitle', d => {
        // 获取当前选择的导航项
        this.thisSelectTitle = d
      })
      bus.$on('update:dossierSubTitleNumber', d => {
        this.dataList.forEach(c => {
          if (c.title === d.title) {
            c.number = d.number
          }
        })
      })
    }
  }

</script>
