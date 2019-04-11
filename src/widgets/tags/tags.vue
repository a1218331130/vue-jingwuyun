<template>
<div>
  <div class="title">
    {{titleText}}
    <i class="iconfont icon-plus" @click="dialog=true"></i>
  </div>
  <hr>
  <div class="tags-box">
    <div v-if="checkedItems.length > 0" class="tags-box__tag" v-for="item in checkedItems">
      <span class="user-tag-count_span" v-if="item.UserCount > 1">『{{item.UserCount}}』</span>
      {{item.label}}<i class="iconfont icon-close" @click="remove(item)" v-if="item.isOwm === '1'"></i></div>
    <div v-if="checkedItems.length === 0" class="no-tags">暂无{{titleText}}</div>
  </div>

  <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="'添加'+titleText" size="middle" :modal="false" :close-on-click-modal="false" :model-append-to-body="true" :append-to-body="true" @open="initTagsForm" v-loading.body="loading">
    <el-form ref="aaaaa" :model="tagsForm" label-width="100px">
      <div class="tags-box">
        <div v-if="tagsOptions.length > 0" class="tags-box__tag tags-own_list" v-for="item in tagsOptions" @click="selectLabel(item)">
          <!--<input type="checkbox" :id="'tag_'+item.id" v-model="tagsForm.tags" :value="item">-->
          <label :for="'tag_'+item.id">{{item.label}} <i class="el-icon-check" style="display: none"></i></label>
        </div>
        <div v-if="tagsOptions.length === 0" class="no-tags">暂未添加{{titleText}}</div>
      </div>
      <hr>
      <el-form-item prop="custom" label="自定义">
        <!--<el-input v-model="tagsForm.custom" placeholder="十字以内" :maxlength="10"></el-input>-->
        <el-select placeholder="输入新建标签" class="label_select" style="width: 100%" v-model="tagsForm.custom" multiple allow-create filterable :no-data-text="'输入新建'+titleText">
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="add">确认</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style lang="scss" scoped>
.no-tags {
    font-size: 18px;
    font-weight: bold;
    color: #ccc;
    text-align: center;
    height: 80px;
    line-height: 80px;
}

.title {
    position: relative;
    .iconfont {
        background: #fea206;
        color: #fff;
        text-align: center;
        width: 26px;
        height: 26px;
        line-height: 26px;
        display: block;
        border-radius: 100%;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
    }
}

.user-tag-count_span {
    // background: #fea206;
    // padding: 0 6px;
    // border-radius: 50%;
    // margin-left: 5px;
    color: rgb(228, 221, 221);
    margin: 0 -6px;
}

.tags-box {
    min-height: 80px;
    padding: 0 20px;
    &__tag {
        $tagSize: 26px;
        background: #5b9ed2;
        color: #fff;
        height: $tagSize;
        line-height: $tagSize;
        padding: 0 0 0 6px;
        border-radius: 3px 0 0 3px;
        display: inline-block;
        position: relative;
        margin-right: $tagSize;
        margin-bottom: 5px;
        .iconfont {
            vertical-align: middle;
            margin-left: 10px;
            opacity: 0.9;
            cursor: pointer;
            &:hover {
                opacity: 1;
            }
        }
        &:after {
            content: '';
            width: 0;
            height: 0;
            border-top: $tagSize/2 solid transparent;
            border-left: $tagSize/2-1 solid #5b9ed2;
            border-bottom: $tagSize/2 solid transparent;
            display: block;
            position: absolute;
            top: 0;
            right: -($tagSize/2)+1;
        }
        & + & {}
        input[type="checkbox"] {
            display: none;
            & + label {
                opacity: 1;
            }
            &:checked + label {
                opacity: 1;
            }
        }
    }
}

.tags-own_list {
    cursor: pointer;
    label {
        cursor: pointer;
        user-select: none;
    }
}
</style>

<script>
import mixin from '../../utils/mixin'

import { mapState } from 'vuex'
import {
  SYS_LABEL_GET_SYS_LABELS_KEYWORD,
  SYS_LABEL_GET_SYS_LABELS_TYPE,
  SYS_LABEL_ADD_LABELS,
  SYS_LABEL_DEL_MY_LABELS
} from '../../store/types'

/**
 * @module Tags
 * @desc 对象标签编辑器
 *
 * @example <tags keyword="keyword"></tags>
 */
export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      dialog: false,
      tagsOptions: [],
      tagsBasket: [],
      tagsForm: {
        tags: [],
        custom: []
      },
      loading: false,
      data: []
    }
  },
  /**
   * 接收参数
   * @prop {String} keyword 标签关键字
   * @prop {Number} type 对象类型, 对应后端数据LabelType
   * @prop {Array} options 选项(备用)
   * @prop {String} title 标题
   * @prop {Boolean} isOpenDialog 是否初始化弹窗 @default false
   */
  props: {
    keyword: { type: String },
    type: { type: Number },
    //      data: {type: Array},
    options: { type: Array },
    title: { type: String },
    isOpenDialog: { // 是否初始化弹窗
      type: Boolean,
      default: false
    }
  },
  computed: {
    titleText() {
      let res
      if(!this.title === false) {
        res = this.title
      } else {
        res = '标签'
      }
      return res
    },
    checkedItems() {
      return this.data
    },
    ...mapState(['sysLabel'])
  },
  methods: {
    dataMatch(singleData) {
      // 数据字段匹配
      let _item = {
        id: singleData.KeyId,
        isOwm: singleData.BzFlag, // 1:是自己的
        Keyword: singleData.Keyword,
        label: singleData.LabelName,
        UserCount: singleData.UserCount, // 当前标签个数
        type: singleData.LabelType
      }
      return _item
    },
    initTagsForm() {
      this.queryLabelListType()
      this.tagsForm.tags = this.checkedItems
      this.tagsForm.custom = []
    },
    selectLabel(item) {
      // 选择添加的标签
      //        console.log('选择添加的标签', item)
      if(!this.tagsForm.custom.find(d => d === item.label)) {
        this.tagsForm.custom.push(item.label)
      }
    },
    queryLabelListType() {
      // 查询自己此类型的标签集合，只包含自己的标签
      let queryfilter = { // 标签类型
        LabelType: this.type
      }
      this.dispatch(SYS_LABEL_GET_SYS_LABELS_TYPE, queryfilter).then(() => {
        //          console.log('查询自己此类型的标签集合')
        this.tagsOptions = this.sysLabel.SysLabelGetSysLabelsType.map(d => {
          return this.dataMatch(d)
        })
      })
    },
    queryLabelListKeyword() {
      // 查询此关键字的标签集合，包含其它用户添加的标签
      let queryfilter = {
        LabelType: this.type, // 标签类型
        Keyword: this.keyword // 外部关键字标签列查询
      }
      this.dispatch(SYS_LABEL_GET_SYS_LABELS_KEYWORD, queryfilter).then(() => {
        //          console.log('查询此关键字的标签集合')
        this.data = this.sysLabel.SysLabelGetSysLabelsKeyword.map(d => {
          return this.dataMatch(d)
        })
      })
    },
    saveLabel() {
      // 保存标签
      let newItem = this.tagsForm.custom // 选中的标签

      this.dispatch(SYS_LABEL_ADD_LABELS, {
        Keyword: this.keyword,
        LabelNames: newItem,
        LabelType: this.type
      }).then(() => {
        this.queryLabelListKeyword() // 添加成功后刷新状态
        //          this.data = this.tagsForm.tags.concat(newItem.map(text => {
        //            return {
        //              label: text
        //            }
        //          }))
        this.dialog = false
        this.loading = false
      })
    },
    // 添加自定义标签
    add() {
      if(this.tagsForm.custom.length > 0) {
        this.loading = true
        // 保存标签
        this.saveLabel()
        return false
        //          if (!this.tagsOptions.find(d => d.label === this.tagsForm.custom)) {
        //          } else {
        //            this.loading = false
        //            this.$alert('该自定义' + this.titleText + '已存在,不能重复添加', '温馨提示')
        //            return false
        //          }
      } else {
        this.data = this.tagsForm.tags
        this.dialog = false
      }
    },
    // 删除标签
    remove(item) {
      // 需求有修改, 暂时不对接 // SYS_LABEL_DEL_LABELS
      this.dispatch(SYS_LABEL_DEL_MY_LABELS, {
        KeyId: item.id
      }).then(_ => {
        //  arrayGetRid(this.checkedItems, [item]) // 删除指定元素
        this.queryLabelListKeyword() // 刷新列表查询
      })
    }
  },
  watch: {
    isOpenDialog(val) {
      if(val) {
        // 刷新查询标签
        this.queryLabelListKeyword()
      }
    }
  },
  mounted() {
    // 获取初始标签
    this.queryLabelListKeyword()
  },
  created() {}
}
</script>
