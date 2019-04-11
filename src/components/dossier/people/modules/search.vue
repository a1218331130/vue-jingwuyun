<template>
<div class="dossier-search">
  <div class="dossier-search__box" v-if="tableData!==null" v-loading="tableData.loading">
    <card-header :show='flag' :title="`${tableData.TableInfo.ZyName} (${tableData.Total} 条结果)`" class="cursor--pointer">
      <div class="dossier-search__btn-box" slot="title-center">
        <!-- <el-button v-show="tableData.showList===true" icon="search" @click="callSearch()"></el-button> -->
        <el-button v-show="tableData.showList===true && tableData.list.length>0" icon="setting" @click="callFieldDialog()">更多字段</el-button>
        <el-button :icon="tableData.showList===true ? 'arrow-up' : 'arrow-down'" @click="showList"></el-button>
        <div class="show-list-btn-mark" @click="showList"></div>
      </div>
    </card-header>
    <div v-show="tableData.showList===true" class="dossier-search__box__list">
      <!-- 列表 -->
      <el-table id="dossierSearchResTable" class="app-table" :show-header="true" :data="tableData.list" :border="true" style="width:100%;">
        <el-table-column v-for="(column,ci) in tableData.viewColumns" :key="ci" :label="column.label" :prop="column.prop" align="center">

        </el-table-column>
      </el-table>
    </div>

    <!-- 字段选择模态窗 -->
    <el-dialog v-draggable="dialogDraggableOptions" v-if="tableData!==null" :visible.sync="dialogField" title="选择要显示的字段" :modal-append-to-body="true" :append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog"
      :before-close="closeEvent">
      <div class="dossier-search__dialog-box">
        <el-checkbox-group v-if="tableData.columns && tableData.columns.length > 0" v-model="checkedFields">
          <div class="box">
            <el-row :gutter="20">
              <el-col :span="6" v-for="(item,i) in tableData.columns" v-show="item.label!==''" :key="i" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <el-checkbox class="item" :title="item.label" :label="item">{{item.label}}</el-checkbox>
              </el-col>
            </el-row>
          </div>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEvent">取消</el-button>
        <el-button @click="checkAllFields">{{(checkedFields.length===tableData.columns.length?'取消全选':'全选')}}</el-button>
        <el-button type="primary" @click="updateViewComumns">确定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>
<style lang="scss" scoped>
  .dossier-search {
    &__box {}
    &__btn-box {
      background: transparent;
      text-align: right;
      height: 45px;
      line-height: 45px;
      width: calc(100% - 40px);
      padding: 0 10px;
      border: 0;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 1;
      .el-button {
        padding: 0;
        border: 0;
      }
      .show-list-btn-mark {
        width: calc(100% - 100px);
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    }
    &__dialog-box {
      margin: 0 20px;
      width: calc(100% - 40px);
      overflow: hidden;
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { SEARCH_RESULT } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  import infoDialogEvents from '../../../../utils/infoDialogEvents'

  import bus from '../../../../utils/bus'

  import { clone } from '../../../../utils/util'
  import cardHeader from './card-header.vue'

  export default {
    mixins: [mixin, infoDialogEvents],
    components: { cardHeader },
    data: () => ({
      dialogField: false,
      checkedFields: [],
      tableData: null
    }),
    props: ['keyword', 'searchWhere', 'table', 'flag'],
    computed: {
      ...mapState(['search'])
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': val.TableInfo.ZyName, 'number': val.Total })
      }
    },
    methods: {
      initDialog() {},
      closeEvent() {
        this.dialogField = false
      },
      showList() {
        if (this.tableData.showList === true) {
          this.tableData.showList = false
          return false
        }
        if (this.tableData.list.length > 0) {
          this.tableData.showList = true
        } else {
          if (this.tableData.HasQx === false) {
            this.$alert('你没有权限查询该表数据, 请联系管理员开通.', '温馨提示');
          } else {
            this.tableData.showList = true
            this.fetchList()
          }
        }
      },
      fetchList() {
        let query = {
          TableName: this.tableData.TableInfo.ID, // 指定表名
          RowIndex: 0, // 开始行数下标（把当前行数提交回来就可以）
          TypeId: 0, // 要素类型，选择的要素ID
          SearchType: 0, // 检索类型，全部 = 0,要素 = 1, 找人专题 = 2,案件专题 = 3,车辆专题 = 4,旅业专题 = 5,高危专题 = 6
          SearchWhere: this.searchWhere, // 查询条件
          ScrollID: null,
          IsSearchAggregations: false // 是否需要聚类(默认false)
        }
        this.tableData.loading = true
        this.dispatch(SEARCH_RESULT, query).then(() => {
          this.handleSingleData()
        })
      },
      handleSingleData() {
        this.tableData.columns = this.search.searchResult.TableInfo.Columns.map(c => {
          return {
            id: c.ID,
            label: c.FieldCn,
            prop: c.FieldEn,
            tableId: this.search.searchResult.TableInfo.ID,
            tableName: this.search.searchResult.TableInfo.ZyName,
            collectTime: this.search.searchResult.TableInfo.TableNameEn + '_xdh_cjsj',
            type: this.getColumnsType(c.Ybsf),
            order: this.search.searchResult.TableInfo.OrderNumber || 99,
            isDefault: c.IsDefault === '1',
            disabled: this.search.searchResult.TableInfo.IsSortFlag === '0'
          }
        })
        this.tableData.list = [...this.search.searchResult.Source]
        this.tableData.viewColumns = this.tableData.columns.filter((d, i) => {
          // 如果d.isDefault为true,检查该列所有行是否为空，非空返回true,空返回false
          return d.isDefault && this.tableData.list.some((r, n) => {
            return r[d.prop] !== '';
          })
        })
        this.tableData.loading = false
      },
      isIdCardNumber(type, num) {
        return type === 'idCard' && num && num.length >= 15
      },
      getAcqTime(item) {
        let columns = this.tableData.columns
        if (columns && columns[0]) {
          return item[columns[0].collectTime]
        } else {
          return ''
        }
      },
      callSearch() {},
      callFieldDialog() {
        this.checkedFields = [...this.tableData.viewColumns]
        console.log(this.checkedFields, ' callFieldDialog')
        this.dialogField = true
      },
      checkAllFields() {
        if (this.checkedFields.length === this.tableData.columns.length) {
          this.checkedFields = []
        } else {
          this.checkedFields = [...this.tableData.columns]
        }
        console.log(this.checkedFields, 'checkAllFields')
      },
      updateViewComumns() {
        if (this.checkedFields.length === 0) {
          this.$alert('最少选择一个字段用于展示', '温馨提示')
        } else {
          this.tableData.viewColumns = [...this.checkedFields]
          this.closeEvent()
        }
      }
    },
    mounted() {},
    created() {
      this.tableData = clone(this.table)
    }
  }

</script>
