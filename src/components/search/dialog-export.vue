<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="数据导出" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row>
    <el-col :span="12">
      <!-- <i class="iconfont icon-quanbu"></i> -->
      <div :class="{'export--current':true,action:type===1}" @click="type=1">
        <el-button type="">导出当前页</el-button>
      </div>
    </el-col>
    <el-col :span="12">
      <div :class="{'export--all':true,action:type===2}" @click="type=2">
        <el-button type="">导出全部页</el-button>
      </div>
    </el-col>
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-row>
      <el-col :span="24" class="title" style="text-align:left;  color: #42b7ec;">自定义</el-col>
      <el-col :span="18">
        <el-form :model="page" :inline="true" label-width="100px;" style="text-align:left;">
          <el-form-item label="导出指定页">
            <el-col :span="11">
              <el-input v-model="page.start" placeholder="请输入页码" style="width:100px;" :maxlength="5"></el-input>
            </el-col>
            <el-col :span="2" style="text-align:center;">-</el-col>
            <el-col :span="11">
              <el-input v-model="page.end" placeholder="请输入页码" style="width:100px;" :maxlength="5"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-button type="primary" @click='submit'>导出</el-button>
      </el-col>
    </el-row>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.export {
    text-align: center;
    width: 80%;
    padding: 15px 0;
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    .el-button {
        color: #fff;
        margin-top: 20px;
    }
    &:before {
        content: '\E781';
        font-family: 'iconfont' !important;
        font-size: 100px;
        height: 100px;
        line-height: 100px;
        margin: 0 auto;
        display: block;
    }
    &:after {
        content: '\E636';
        font-family: 'iconfont' !important;
        font-size: 48px;
        width: 52px;
        height: 50px;
        line-height: 50px;
        margin: 0 auto;
        position: absolute;
        top: 45px;
        left: 50%;
        margin-left: -26px;
    }
    &--current {
        &.action,
        &:hover {
            background: #daf1fc;
        }
        @extend .export;
        &:before {
            color: #42b7ec;
        }
        &:after {
            content: '\E607';
            color: #42b7ec;
        }
        .el-button {
            background: #42b7ec;
            color: #fff;
        }
    }
    &--all {
        @extend .export;
        &.action,
        &:hover {
            background: #ddfdc6;
        }
        &:before {
            color: #56b604;
        }
        &:after {
            content: '\E636';
            color: #56b604;
        }
        .el-button {
            background: #56b604;
        }
    }
}
</style>
<script>
import mixin from '../../utils/mixin'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      type: 1,
      page: {
        start: '',
        end: ''
      }
    }
  },
  props: ['dialog'],
  computed: {},
  methods: {
    initDialog() {},
    closeEvent() {
      this.$emit('close')
    },
    submit() {
      this.$message({
        type: 'success',
        message: '导出成功',
        showClose: true
      })
      this.$emit('close')
    }
  },
  created() {

  },
  mounted() {}
}
</script>
