<!-- 关联线索 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="其它关联" logtitle="添加其它关联"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="involved-box">
    <el-col :span="24">
      <el-table :data="list"  border stripe  :show-header="true">

        <el-table-column class-name="compact" label="内容集">
          <template scope="scope">
              <div class="compact__wrap">
                <div class="compact__serial">
                  <el-tag type="primary">{{scope.$index+1}}</el-tag>
                </div>
                <div class="compact__box">
                  <div class="compact__title">
                    采集时间: {{getAcqTime(scope.row)}} {{columnsMap[scope.row.ngw_table_sign][0].tableName}}
                  </div>
                  <!-- 内容 -->
                  <div
                    :class="{'compact__item':true,'compact__item--point':column.type!==null}"
                     v-for="column in (columnsMap[scope.row.ngw_table_sign])"
                     v-if="scope.row[column.prop]!==''"
                     :key="column.id"
                       @click="colOnClickEvent(column.type,scope.row[column.prop],scope.row)"
                   >
                    <label v-html="column.label"></label>
                    <span v-html="heightLightElms(scope.row[column.prop], caseKey)"></span>
                  </div>
                </div>
              </div>
            </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <dialog-people-info :dialog="peopleInfoDialog" :data="infoDialogData" @close="peopleInfoDialog=false" @call:dialog="openInfoDialog"></dialog-people-info>
  <dialog-car-info :dialog="carInfoDialog" :data="infoDialogData" @close="carInfoDialog=false" @call:dialog="openInfoDialog"></dialog-car-info>
  <dialog-mobile-info :dialog="mobileInfoDialog" :data="infoDialogData" @close="mobileInfoDialog=false" @call:dialog="openInfoDialog"></dialog-mobile-info>

</div>
</template>

<style lang="scss" scoped>
.involved-box {
    margin-top: 13px;
    .time-text {
        color: #ff6633;
    }
    .describe-text {
        white-space: normal;
    }
    .relation-text {
        padding: 18px 15px;
        background: #88cfff;
        margin: 0 -15px;
        color: #fff;
        line-height: 27px;
        white-space: normal;
    }
    .time-text {
        color: #ff6633;
        margin-bottom: 0;
    }
    .other-text {
        white-space: normal;
        color: #000;
        span {
            display: inline-block;
            color: #999;
            &:first-child {
                margin-left: 0;
            }
        }
    }
}
</style>


<script>
import cardHeader from './card-header.vue'
import { mapState } from 'vuex'
import { SEARCH_AGGR_RESULT } from '../../../../store/types'
import dossierMixin from '../../dossierMixin'
import dialogInfo from '../../../../widgets/info-dialog/info-dialog'
import infoDialogEvents from '../../../../utils/infoDialogEvents'

export default {
  mixins: [dossierMixin, infoDialogEvents],
  components: {
    cardHeader,
    'dialog-people-info': dialogInfo,
    'dialog-car-info': dialogInfo,
    'dialog-mobile-info': dialogInfo
  },
  computed: {
    ...mapState(['search'])
  },
  data() {
    return {
      dossierLoading: true,
      columnsMap: null,
      list: [],
      searchData: null,
      tableData: [{
        time: '2017-08-26 17:33:33',
        qename: '新圆华府6栋2单元',
        qeqq: '4056689878',
        ssx: '北京市xx县',
        address: '大亚湾XXXX华府小区',
        qeaddress: '大亚湾XXXX华府小区',
        lxname: '李四',
        qetel: '15878866505',
        special: '1',
        qenumber: '200',
        czname: '赵武',
        cztel: '14785622325',
        czsfz: '4415877855652568544',
        cstime: '1988/02/16',
        caxj: '广东省',
        czsex: '男',
        jgxzqy: '广东省惠州市',
        frname: '',
        frsfz: ''
      }]
    }
  },
  props: ['caseKey'],
  methods: {
    loadData() {
      let object = {
        TableName: '',
        RowIndex: 0,
        TypeId: 0,
        SearchType: 0,
        SearchWhere: [{
          Keyword: this.caseKey,
          KeywordType: 0,
          Name: '人员档案-其他关联',
          SearchType: 0
        }],
        ScrollID: null
      }
      if (this.checkRule('Search/SearchAggrNextPage', true) === true) {
        this.dispatchDossier(SEARCH_AGGR_RESULT, object).then(() => {
          this.searchData = this.search.searchAggrResult
          this.handleArrayData()
        })
      }
    },
    getAcqTime(item) {
      let columns = (this.columnsMap[item.ngw_table_sign])
      return item[columns[0].collectTime]
    },
    handleArrayData() {
      this.columnsMap = {}
      this.list = []
      let data = this.searchData.SearchDatas.filter(d => d.HasQx === true && d.Source !== null && d.TableInfo
        .Columns !== null && d.TableInfo.Columns.length > 0)
      data.forEach((d, i) => {
        this.columnsMap[d.TableInfo.ID] = d.TableInfo.Columns.map(c => {
          return {
            id: c.ID,
            label: c.FieldCn,
            prop: c.FieldEn,
            tableId: d.TableInfo.ID,
            tableName: d.TableInfo.ZyName,
            type: this.getColumnsType(c.Ybsf)
          }
        })
        d.Source.forEach(s => {
          s['ngw_table_sign'] = d.TableInfo.ID
        })
        this.list = [...this.list, ...d.Source]
        this.dossierLoading = false
      })
    }
  },
  created() {
    this.loadData()
  }
}
</script>
