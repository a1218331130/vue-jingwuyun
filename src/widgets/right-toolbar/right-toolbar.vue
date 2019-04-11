<template>
<form ref="sideToolbarForm" :model="sideToolbarForm" class="side-toolbar">

  <div class="side-title_div">
    <span class="side-title-text_span iconfont icon-iconziti23">&nbsp;{{title}}</span>
    <!--<i class="direction el-icon-d-arrow-right" @click="packup"></i>-->
    <el-button type="text" @click="reset">清除</el-button>
  </div>
  <div :class="diffrent === 1?'side-content_div1':'side-content_div'">
    <!-- 无label,【搜索】 -->
    <div class="search" v-if="search">
      <el-input v-model="result[search.prop]" :placeholder="search.title||'请输入关键字'">
        <el-button slot="append" icon="search" @click="submit"></el-button>
      </el-input>
    </div>

    <!-- 存在label-->
    <div class="option-box">
      <div :class="{option:true,'option--inline':list.inline}" v-if="checkOps!==null" v-for="(list,i) in checkOps">
        <!-- 单行排列 -->
        <el-row :gutter="20" v-if="list.inline!==true">
          <el-col :span="24" v-if="list.type==='checkbox'||list.type==='radio'||list.type === 'input'||list.type === 'select'||list.type === 'daterange'||list.type === 'datetime'||list.type==='Mulitiselect'||list.type==='treeSelect'">
            <div class="option__title">
              {{list.title}}
              <span class="title" v-if="list.title ==='关键字'&&list.subTitle">（模糊检索布控名称、布控对象）</span>
            </div>
          </el-col>

          <!-- 文本输入 -->
          <el-col :span="24" v-if="list.type==='input' && result!==null && list.prop">
            <el-input v-model="result[list.prop]" :placeholder="list.title"></el-input>
          </el-col>

          <!-- 下拉选择 -->
          <el-col :span="24" v-if="list.type==='select' && result!==null && list.prop">
            <el-select v-model="result[list.prop]" filterable placeholder="请选择" style="width: 100%">
              <el-option v-for="item in list.children" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <!-- 下拉列表多选 -->
          <el-col :span="24" v-if="list.type==='Mulitiselect' && result!==null && list.prop" class="rel">
            <el-select multiple v-model="result[list.prop]" filterable placeholder="请选择/输入关键字筛选" @visible-change="visibleChange" style="width: 100%;">
              <el-option v-for="item in list.children" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span :class="{'Mulitiselect':true,'Mulitiselect-tip_span':selectSearch}" v-if="result[list.prop].length!==0"> 已选择 {{result[list.prop].length}} 个</span>
          </el-col>

          <!-- 多选树选择器 -->
          <el-col :span="24" v-if="list.type==='treeSelect' && result!==null && list.prop">
            <tree-select style="width:100%" ref="selectTree" :tree="{data:list.children, props:list.props||{},
            'node-key':'orgId',
            'show-checkbox':true,
            'check-strictly':false}" v-model="result[list.prop]"></tree-select>
          </el-col>

          <!-- 日期选择器 -->
          <el-col :span="24" v-if="list.type==='daterange' && result!==null && list.prop">
            <el-date-picker v-model="result[list.prop]" type="daterange" format="yyyy-MM-dd" range-separator=" 至 " placeholder="选择日期范围" :picker-options="list.dateLimit?limitDateFun:''" style="width: 100%"></el-date-picker>
          </el-col>

          <!-- 日期时间选择器 -->
          <el-col :span="24" v-if="list.type==='datetime' && result!==null && list.prop">
            <el-date-picker v-model="result[list.prop]" type="datetime" :placeholder="'选择'+list.title" style="width: 100%" :picker-options="list.dateLimit?limitDateFun:''"></el-date-picker>
          </el-col>

          <!-- 多选 -->
          <el-checkbox-group v-if="list.type==='checkbox' && result!==null && list.prop" v-model="result[list.prop]">
            <el-col :span="24">
              <el-checkbox v-for="item in list.children" :label="item.value" :key="item.value" style="margin-left: 0;margin-right: 15px;">
                {{item.label}}
              </el-checkbox>
            </el-col>
          </el-checkbox-group>

          <!-- 单选 -->
          <el-radio-group v-if="list.type==='radio' && result!==null && list.prop" v-model="result[list.prop]">
            <!-- <el-col :span="8"> -->
            <el-radio label="">不限</el-radio>
            <el-radio :label="item.value" v-for="item in list.children" :key="item.value">{{item.label}}</el-radio>
            <!-- </el-col> -->
          </el-radio-group>
        </el-row>

        <div v-else>
          <!-- 内联排列 -->
          <div v-if="list.type==='checkbox'||list.type==='radio'" class="option__title">{{list.title}}</div>

          <!-- 多选 -->
          <el-checkbox-group v-if="list.type==='checkbox' && result!==null && list.prop" v-for="item in list.children" :key="item.value" v-model="result[list.prop]">
            <el-checkbox :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>

          <!-- 单选 -->
          <el-radio-group v-if="list.type==='radio' && result!==null && list.prop" v-for="item in list.children" :key="item.value" v-model="result[list.prop]">
            <el-radio :label="item.value" :key="item.value"></el-radio>
          </el-radio-group>

          <!-- 下拉列表 -->
          <el-select v-if="list.type==='select' && result!==null && list.prop" v-model="result[list.prop]" filterable placeholder="请选择">
            <el-option v-for="item in list.children" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>

          <!-- 下拉列表多选 -->
          <el-col :span="24" v-if="list.type==='Mulitiselect' && result!==null && list.prop" class="rel">
            <el-select v-model="result[list.prop]" multiple filterable placeholder="请选择/输入关键字筛选" @visible-change="visibleChange" style="width: 100%;">
              <el-option v-for="item in list.children" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span :class="{'Mulitiselect':true,'Mulitiselect-tip_span':selectSearch}" v-if="result[list.prop].length!==0"> 已选择 {{result[list.prop].length}} 个</span>
          </el-col>

          <!-- 日期选择器 -->
          <el-date-picker v-if="list.type==='daterange' && result!==null && list.prop" v-model="result[list.prop]" type="daterange" format="yyyy-MM-dd" range-separator=" 至 " placeholder="选择日期范围" :picker-options="list.dateLimit?limitDateFun:''"></el-date-picker>

          <!-- 日期时间选择器 -->
          <el-date-picker v-if="list.type==='datetime' && result!==null && list.prop" v-model="result[list.prop]" type="datetime" :placeholder="'选择'+list.title" :picker-options="list.dateLimit?limitDateFun:''"></el-date-picker>
        </div>
      </div>
    </div>
  </div>

  <div class="side-button_div">
    <el-button class="side-button_submit" type="info" @click="submit">{{submitText}}</el-button>
  </div>

</form>
</template>
<style scoped lang="scss">
  .rel {
    position: relative;
  }

  .Mulitiselect {
    position: absolute;
    top: 8px;
    left: 20px;
    &-tip_span {
      color: #ccc;
      left: initial;
      right: 40px;
    }
  }

  .side-toolbar {
    padding: 0;
  }

  .side-title_div {
    overflow: hidden;
    border-bottom: 2px solid #4DB8FF;
    color: #4DB8FF;
    padding-bottom: 7px;
    position: relative;
    .el-button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
    .side-title-text_span {
      float: left;
      font-size: 12px;
    }
    .direction {
      float: right;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: rgba(77, 184, 255, 0.7);
      }
    }
  }

  .side-content_div {
    height: calc(96% - 57px);
    margin: 10px auto;
    overflow: auto;
    overflow-x: hidden;
  }

  .side-content_div1 {
    height: calc(96% - 119px);
    margin: 10px auto;
    overflow: auto;
    overflow-x: hidden;
  }

  .side-button_div {
    margin-top: 2%;
    .side-button_submit {
      width: 100%;
      background-color: #5BABE6;
      border: none;
      color: #fff;
      border-radius: 3px;
    }
  }

  .title {
    font-size: 12px;
    color: #8391a5;
  }

</style>
<script>
  /**
   * @module RightRoolbar
   * @desc 右侧筛选栏
   *
   * `@update:params=//点击搜索/确认按钮事件`
   *
   * @example <right-toolbar :params="filter" :options="filterOptions" @update:params="searchSubmit"></right-toolbar>
   */
  import treeSelect from '../tree-select/tree-select'
  export default {
    components: {
      treeSelect
    },
    data: function() {
      return {
        limitDateFun: { // 日期选择范围
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        selectSearch: false,
        result: null,
        search: null,
        sideToolbarForm: {}
      }
    },
    /**
     * 接收参数
     * @prop {String} title 标题 @default '搜索列表'
     * @prop {String} submitText 默认区划CODE数组 @default '确认'
     * @prop {Object} params 原始结果 @default null
     * @prop {Array} options 选项对象 @default null
     * @prop {String} options.title 条件label
     * @prop {String} options.prop 条件数据字段
     * @prop {String} options.type 条件输入类型
     * @prop {Boolean} options.inline 布局是否内联排列
     * @prop {Boolean} options.dateLimit 是否限制只能选择过去的时间，对非日期类型无效
     *
     */
    props: {
      title: {
        type: String,
        default: '搜索列表'
      },
      diffrent: {
        type: Number,
        default: 0
      },
      submitText: {
        type: String,
        default: '确认'
      },
      params: {
        type: Object,
        default: null
      },
      options: {
        type: Array,
        default: null
      }
    },
    computed: {
      checkOps() {
        let res
        if (this.options !== null) {
          this.search = this.options.find(d => d.type === 'search')
          console.log(this.search, 'search');
          res = this.options.filter(d => d.type !== 'search')
          console.log(res, 'res');
        } else {
          res = null
        }
        return res
      }
    },
    watch: {},
    methods: {
      visibleChange(val) {
        this.selectSearch = val // 判断多选下拉是否获取焦点
      },
      submit() {
        /**
         * 提交数据更新
         * @event module:RightRoolbar~update:params
         * @param {Object} a 用户所选条件对象, 来源:options.prop
         */
        this.$emit('update:params', JSON.parse(JSON.stringify(this.result)))
      },
      packup() {
        /**
         * 收起侧栏
         * @event module:RightRoolbar~packup
         */
        this.$emit('packup')
      },
      reset() {
        for (let key in this.result) {
          if (this.result[key] instanceof Array) {
            this.result[key] = []
          } else {
            this.result[key] = ''
          }
        }
        if (this.$refs.selectTree) {
          this.$refs.selectTree.forEach(treeItem => {
            treeItem.clearChecked()
          })
        }
      }
    },
    mounted() {
      this.result = JSON.parse(JSON.stringify(this.params))
    }
  }

</script>
