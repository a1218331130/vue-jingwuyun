<template>
<el-dialog v-draggable="dialogDraggableOptions" class="no-padding" :visible.sync="dialog" :title="title||'批量选择'" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <div class="wrap">
    <el-form ref="form" class="form" :model="form" inline>
      <!-- <el-form-item prop="fileType">
        <el-radio-group v-model="form.fileType">
          <el-radio v-for="item in fileTypeOps" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item prop="break" v-show="disableBreak===false">
        <el-select v-model="form.break" filterable allow-create placeholder="选择 或 输入自定义分隔符" :disabled="disableBreak">
          <el-option v-for="item in breakOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="sheet" v-show="disableSheet===false">
        <el-select v-model="form.sheet" placeholder="选择表格" :disabled="disableSheet">
          <el-option v-for="item in sheetOps" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="isHeadInStartRow" label="是否首行头部">
        <el-switch v-model="form.isHeadInStartRow" on-text="是" off-text="否"></el-switch>
      </el-form-item>

      <el-form-item prop="beginRow" label="数据起始行">
        <el-input-number v-model="form.beginRow" :min="1" style="width:120px;"></el-input-number>
      </el-form-item>

      <el-form-item class="btn-box">
        <el-button type="primary" size="small" @click="fetchList">预览数据</el-button>
      </el-form-item>

    </el-form>
    <div class="table-box" v-loading="loading">
      <el-table @cell-mouse-enter="cellMouseEnter" v-if="list.length>0" border :data="list" @header-click="checkColumn" height="440" v-loading.body="loading">
        <el-table-column v-for="(item,i) in columns" :key="i" :label="item" :prop="item"></el-table-column>
      </el-table>

      <div :class="{empty:true,'empty--tips':true}" v-show="uploading===false && this.isFirst===true && percentage===100">
        <span>点击右上角按钮预览数据</span>
      </div>

    </div>
    <div class="loading" v-show="uploading===true">
      <el-progress class="loading__progress" type="circle" :percentage="percentage" :status="percentage===100?'success':''"></el-progress>
    </div>

  </div>

  <div slot="footer" class="dialog-footer">
    <el-button @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">开始检索</el-button>
  </div>
</el-dialog>
</template>
<style lang="scss" scoped>
.el-dialog__body {
    padding: 0;
}
.wrap {
    height: 500px;
    overflow: auto;
    .form {
        margin: 10px;
        position: relative;
        .el-form-item {
            margin-bottom: 0;
        }
        .btn-box {
            margin: 0;
            position: absolute;
            top: 0;
            right: 0;
        }
    }
    .table-box {
        height: 440px;
        position: relative; // 如需全列效果, 注释这行
        .cell {
            cursor: pointer;
        }
    }
    .loading {
        background: rgba(255,255,255,.5);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        &__progress {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }
    }

    .empty {
        transform: translateX(-50%) translateY(-50%);
    }
}
</style>
<script>
import { FETCH_IMPROT_PRVIEW } from '../../store/types'

import mixin from '../../utils/mixin'
import mixinImportDialog from '../../utils/mixinImportDialog'

import { clone } from '../../utils/util'

export default {
  mixins: [mixin, mixinImportDialog],
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    initDialog() {
      this.percentage = 0
      this.isFirst = true
      this.columns = []
      this.list = []
      this.upload().then((res) => {
        this.form.fileType = res.FileType
        this.attachmentId = res.FjId
        if (this.form.fileType === 0 || this.form.fileType === 3) {
          this.sheetOps = res.Sheets.map(d => {
            return {
              label: d,
              value: d
            }
          })
          this.form.sheet = res.Sheets[0]
        }
        this.uploadComplete()
      })
    },
    fetchList() {
      this.isFirst = false
      this.columns = []
      this.list = []
      this.dispatch(FETCH_IMPROT_PRVIEW, this.params).then(() => {
        this.columns = this.improt.list.Columns
        this.list = this.improt.list.Source
      })
    },
    submit() {
      this.$emit('call:resource', clone({ params: this.params, form: this.form, cats: this.cats }))
    }
  },
  created() {},
  mounted() {}
}
</script>
