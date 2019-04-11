<template>
  <div class="contextMenu" @mouseleave="contextMouseOut" :id="menuData.id">
    <ul>
      <li :ref="'ulLi'+idx"  v-for="(item,idx) in menuData.menu" @click="doThing(item, idx)" @mouseover="mouseoverMethod(item.disabled, idx)" @mouseout="mouseoutMethod(item.disabled, idx)" :class="item.disabled?'disabledClass':''">{{item.name}}</li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
  ul,
  li {
    margin: 0;
    padding: 0
  }

  .contextMenu {
    position: fixed;
    width: 120px;
    background-color: #e6e6e6;
    border-radius: 3px;
    padding: 10px 4px;
    box-shadow: 4px 4px 25px #d2d2d2;
    consor: pointer;
    &>ul li {
      list-style: none;
      padding: 0 10px;
    }
    z-index:1000;
  }

  .hightHover {
    background-color: #97cbff;
    color: white;
  }

  .disabledClass {
    color: #888787;
  }

</style>
<script>
  import { DELETE_PERSON_BILL, DELETE_COMMUNICATE_LIST } from '../../../store/types'
  import { mapState } from 'vuex'
  import mixin from '../../../utils/mixin'
  export default {
    mixins: [mixin],
    data() {
      return {
        menu: [{
          name: '删除',
          methods: 'deleteOne'
        }]
      }
    },
    watch: {
      'menuData.clientY': {
        handler: function() {
          let widths = document.body.clientWidth;
          let oMenu = document.querySelector('#' + this.menuData.id);
          if (this.menuData.clientX + 120 > widths) {
            oMenu.style.left = this.menuData.clientX - 100 + 'px';
          } else {
            oMenu.style.left = this.menuData.clientX - 20 + 'px';
          }
          oMenu.style.top = this.menuData.clientY - 10 + 'px';
        },
        deep: true
      }
    },
    computed: {
      ...mapState(['analysisBill', 'analysisTelList'])
    },
    props: ['menuData'],
    methods: {
      mouseoverMethod(val, index) {
        if (val) {
          return
        } else {
          let oLi = this.$refs['ulLi' + index][0];
          oLi.className = 'hightHover';
        }
      },
      mouseoutMethod(val, index) {
        if (val) {
          return
        } else {
          let oLi = this.$refs['ulLi' + index][0];
          oLi.className = '';
        }
      },
      contextMouseOut() {
        this.$emit('changeMenuStatus')
      },
      deleteOne(idx) {
        this.$emit('changeMenuStatus');
        this.$confirm('此操作将永久删除该数据，是否继续？', '温馨提示', 'warning').then(() => {
          this.deleteData(idx);
        });
      },
      deleteData(idx) {
        let url = '';
        if (this.menuData.types === 'billManage') {
          url = DELETE_PERSON_BILL;
        } else if (this.menuData.types === 'listManage') {
          url = DELETE_COMMUNICATE_LIST
        }
        this.dispatch(url, this.menuData.menu[idx].sendData).then(() => {
          let retData = '';
          if (this.menuData.types === 'billManage') {
            retData = this.analysisBill.personBill;
          } else if (this.menuData.types === 'listManage') {
            retData = this.analysisTelList.deleteList;
          }
          if (retData) {
            this.$alert('删除成功', '温馨提示', { type: 'warning' })
            this.$emit('deleteSplit')
          }
        });
      },
      callBack(idx) {
        this.$emit('callBack', idx)
      },
      doThing(val, idx) {
        if (val.method) {
          this[val.method](idx);
        }
      }
    }
  }

</script>
