<template>
<el-tabs class="relevant-basic">
  <el-tab-pane>
    <span slot="label" class="pane-count">
      <el-badge :value="temporaryTables.transactTable.length" :max="99" class="itemcount" :hidden="false"><i style="margin-right:3px" class="icon iconfont"></i>办案人员</el-badge>
    </span>
    <transactCase @update:Table="transactCaseTable" :isInitDialog="isInitDialog"></transactCase>
  </el-tab-pane>
  <el-tab-pane>
    <span slot="label" class="pane-count">
      <el-badge :value="temporaryTables.involveTable.length" :max="99" class="itemcount" :hidden="false"><i style="margin-right:3px" class="icon iconfont"></i>涉案人员</el-badge>
    </span>
    <involveCase @update:Table="involveCaseTable" :isInitDialog="isInitDialog"></involveCase>
  </el-tab-pane>
  <el-tab-pane label="涉案物品">
    <span slot="label" class="pane-count">
      <el-badge :value="temporaryTables.involveArticleTable.length" :max="99" class="itemcount" :hidden="false"><i style="margin-right:3px" class="icon iconfont"></i>涉案物品</el-badge>
    </span>
    <involveArticle @update:Table="involveArticleTable" :isInitDialog="isInitDialog"></involveArticle>
  </el-tab-pane>
  <el-tab-pane label="涉案车辆">
    <span slot="label" class="pane-count">
      <el-badge :value="temporaryTables.involveCarTable.length" :max="99" class="itemcount" :hidden="false"><i style="margin-right:3px" class="icon iconfont"></i>涉案车辆</el-badge>
    </span>
    <involveCar @update:Table="involveCarTable" :isInitDialog="isInitDialog"></involveCar>
  </el-tab-pane>
  <el-tab-pane label="嫌疑人">
    <span slot="label" class="pane-count">
      <el-badge :value="temporaryTables.suspectPeopleTable.length" :max="99" class="itemcount" :hidden="false"><i style="margin-right:3px" class="icon iconfont"></i>嫌疑人</el-badge>
    </span>
    <suspectPeople @update:Table="suspectPeopleTable" :isInitDialog="isInitDialog"></suspectPeople>
  </el-tab-pane>
</el-tabs>
</template>

<style scoped lang='scss'>
.kinship-box {
    margin-top: 10px;
}

.el-tabs {
    margin: 0 auto;
    width: calc(100% - 30px);
}
</style>
<style lang="scss">
.relevant-basic {
    .pane-count {
        .itemcount {
            .el-badge__content.is-fixed {
                top: 9px;
            }
        }
    }
}
</style>

<script>
//  import {mapState} from 'vuex'
import mixin from '../../../../utils/mixin'
import transactCase from './transactCase.vue' // 办案人员
import involveCase from './involveCase.vue' // 涉案人员
import involveArticle from './involveArticle.vue' // 涉案物品
import involveCar from './involveCar.vue' // 涉案车辆
import suspectPeople from './suspectPeople.vue' // 嫌疑人
export default {
  mixins: [mixin],
  components: {
    transactCase,
    involveCase,
    involveArticle,
    involveCar,
    suspectPeople
  },
  data() {
    return {
      temporaryTables: { // 临时表格数据集合
        transactTable: [], // 办案人员
        involveTable: [], // 涉案人员
        involveArticleTable: [], // 涉案物品
        involveCarTable: [], // 涉案车辆
        suspectPeopleTable: [] // 嫌疑人
      }
    }
  },
  props: ['isInitDialog'],
  methods: {
    transactCaseTable(tables) {
      // 办案人员表格数据
      //        console.log('办案人员表格数据', tables)
      let tablesT = tables.map(row => {
        return {
          id: row.id,
          jh: row.num,
          mc: row.name,
          ssdw: row.unit,
          zw: row.job,
          zz: row.duty,
          gw: row.work,
          userId: row.userId
        }
      })
      this.temporaryTables.transactTable = tablesT
      this.getTableData()
    },
    involveCaseTable(tables) {
      // 涉案人员表格数据
      //        console.log('涉案人员表格数据', tables)
      let tablesT = tables.map(row => {
        return {
          id: row.id,
          xm: row.name,
          lb: row.peopleType,
          sfz: row.idCard,
          xb: row.sex,
          tpid: row.imageId,
          csrq: row.birthday,
          ms: row.remark
        }
      })
      this.temporaryTables.involveTable = tablesT
      this.getTableData()
    },
    involveArticleTable(tables) {
      // 涉案物品表格数据
      //        console.log('涉案物品表格数据', tables)
      let tablesT = tables.map(row => {
        return {
          id: row.id,
          wpmc: row.name, // 物品名称
          wpms: row.desc, // 物品描述
          wplx: row.itemType, // 物品类型
          sasm: row.remark, // 涉案说明
          wptz: row.sign, // 物品特征
          salx: row.caseType // 涉案类型
        }
      })
      this.temporaryTables.involveArticleTable = tablesT
      this.getTableData()
    },
    involveCarTable(tables) {
      // 涉案车辆表格数据
      //        console.log('涉案车辆表格数据', tables)
      let tablesT = tables.map(row => {
        return {
          id: row.id,
          tpid: row.carImageId,
          cph: row.plateNumber,
          jsyxm: row.name,
          clms: row.carDescribe,
          salx: row.involvedType,
          kyqk: row.detainState,
          clys: row.carColor,
          jsyxb: row.sex,
          jsytmtz: row.aspectFeature,
          cltz: row.carFeature,
          jsyms: row.pilotDescribe
        }
      })
      this.temporaryTables.involveCarTable = tablesT
      this.getTableData()
    },
    suspectPeopleTable(tables) {
      // 嫌疑人表格数据
      let tablesT = tables.map(row => {
        //          console.log('// 嫌疑人表格数据  ', row)
        return {
          xm: row.name,
          pic: row.imageId,
          zatd: row.crimeTrait,
          nl: row.age,
          zayy: row.crimeCause,
          zagj: row.crimeTool,
          zasd: row.crimeMeans,
          tmtz: row.formTrait,
          sg: row.stature,
          tx: row.bodilyForm,
          ch: row.nickname,
          tjsm: row.remark,
          sfz: row.idCard,
          xyrsj: row.upPeople
        }
      })
      this.temporaryTables.suspectPeopleTable = tablesT
      this.getTableData()
    },
    getTableData() {
      // 爆出表格数据
      this.$emit('update:table', this.temporaryTables)
    }
  },
  watch: {
    isInitDialog(val) {
      if(val) {
        this.tableDataPerson = [] // 初始化表格数据
        this.temporaryTables = { // 临时表格数据集合
          transactTable: [], // 办案人员
          involveTable: [], // 涉案人员
          involveArticleTable: [], // 涉案物品
          involveCarTable: [], // 涉案车辆
          suspectPeopleTable: [] // 嫌疑人
        }
      }
    }
  },
  mounted() {},
  created() {
    this.getTableData()
  }
}
</script>
