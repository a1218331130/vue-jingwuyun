<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="检索范围" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row>
    <el-col :span="24">
      <div class="cats cats--top" v-for="catOps in resData">
        <div class="cats__title">
          <el-row>
            <el-col :span="18">
              {{catOps.name}}
              <el-checkbox class="check-all" label="true" v-model="all">全选</el-checkbox>
            </el-col>
            <el-col :span="6">
              <el-input v-model="keyword" placeholder="" icon="search" :on-icon-click="filterList"></el-input>
            </el-col>
          </el-row>
        </div>
        <div class="cats__item-box hideCheckBox">
          <div v-if="cateList.length > 0" class="cats__item-box__item" v-for="item in cateList">
            <el-checkbox v-model="cats" :label="item" :key="item.ID">{{item.Name}}</el-checkbox>
          </div>
          <div v-if="cateList.length === 0" class="empty"></div>
        </div>
      </div>
    </el-col>
    <el-col :span="24">
      <div class="cats cats--bottom" v-for="catOps in list">
        <div class="cats__title">
          已选中
          <span class="select_num">({{cats.length}}个)</span>
          <el-button type="text" class="fr" @click="clear"><i class="iconfont icon-trash"></i> 清空</el-button>
        </div>
        <div class="cats__item-box">
          <div class="cats__item-box__select_item" v-for="item in cats" @click="remove(item)">
            {{item.Name}}
            <el-button type="text"><i class="iconfont icon-close"></i></el-button>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.cats {
    &__title {
        font-size: 16px;
        font-weight: bold;
        color: #003366;
        padding-bottom: 10px;
        margin-bottom: 10px;
        border-bottom: 1px dotted #ccc;
        .check-all {
            margin-left: 15px;
        }
    }
    .el-button {
        color: #0099ff;
        .iconfont {
            margin: 0;
        }
    }
    &__item-box {
        overflow-y: auto;
        &__item {
            min-width: 120px;
            height: 38px;
            line-height: 38px;
            display: inline-block;
            cursor: pointer;
            .el-checkbox__inner {
                display: none;
            }
        }
        &__select_item {
            min-width: 50px;
            height: 38px;
            line-height: 38px;
            display: inline-block;
            cursor: pointer;
            padding-right: 15px;
            .iconfont {
                color: #8e8e8e;
            }
        }
    }

    &--top {
        .cats__item-box {
            height: 20vh;
        }
    }

    &--bottom {
        .cats__item-box {
            height: 13vh;
        }
    }
}

.select_num {
    color: #ff6633;
}
</style>
<script>
import mixin from '../../utils/mixin'
import { mapState } from 'vuex'
import { SEARCH_GET_YJ_YSLXS } from '../../store/types'

import { arrayGetRid } from '../../utils/util'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      all: false,
      keyword: '',
      cats: [],
      list: [],
      cateList: [],
      resData: [{
        id: 1,
        name: '怀化市',
        children: []
      }]
    }
  },
  props: ['dialog'],
  computed: {
    ...mapState(['search'])
  },
  watch: {
    keyword(val) {
      this.filterList()
    },
    all(val) {
      if (val === true) {
        this.cats = [...this.resData[0].children]
      } else {
        this.cats = []
      }
    }
  },
  methods: {
    initDialog() {
      this.keyword = ''
      this.list = [...this.resData]
    },
    remove(ele) {
      this.cats = arrayGetRid(this.cats, [ele])
    },
    clear() {
      this.cats = []
    },
    closeEvent() {
      this.$emit('close')
    },
    filterList() {
      let res
      if (this.keyword === '') {
        res = this.resData[0].children
      } else {
        res = this.resData[0].children.filter(d => d.Name.indexOf(this.keyword) !== -1)
      }
      this.cateList = [...res]
    },
    submit() {
      this.$emit('update:range', this.cats)
    },
    cancel() {
      this.closeEvent()
    }
  },
  mounted() {
    if (this.checkRule('Search/GetHylxs', true) === false) {
      return false
    }
    // 获取行业分类集合
    this.dispatch(SEARCH_GET_YJ_YSLXS).then(() => {
      console.log(this.search.searchGetYjYslxs, 'this.search.searchCatListthis.search.searchCatListthis.search.searchCatList');
      if (this.search.searchGetYjYslxs && this.search.searchGetYjYslxs.length > 0) {
        this.resData[0].children = this.search.searchGetYjYslxs
        this.filterList()
      }
    });
  }
}
</script>
