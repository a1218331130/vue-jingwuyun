<template>
<el-dialog v-draggable="dialogDraggableOptions" title="违章记录" :visible.sync="dialogVisit" :before-close="close" @open="start()" size="bigest">
  <el-table @cell-mouse-enter="cellMouseEnter" :data="visitList" border @row-dblclick="rowDblclick" height="500">
    <el-table-column type="index" align="center" label="序号" width="80">
      <template scope="scope">
          {{scope.$index + 1}}
        </template>
    </el-table-column>
    <el-table-column prop="caseNumber" label="违章代码"></el-table-column>
    <el-table-column prop="PlateNo" label="车牌号"></el-table-column>
    <el-table-column prop="caseAction" label="违章行为"></el-table-column>
    <el-table-column prop="caseAddress" label="违章地点"></el-table-column>
    <el-table-column prop="casePunish" label="处罚"></el-table-column>
    <el-table-column prop="caseDriver" label="驾驶人"></el-table-column>
    <el-table-column prop="caseDriverLicense" label="驾驶证"></el-table-column>
  </el-table>
  <div class="app-toolbar">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="val=>pagenav=val"></pagination>
  </div>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close">关闭</el-button>
  </div>
</el-dialog>
</template>
<style scoped lang='scss'>
.visit-add {
    margin-top: 30px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 80px);
    background: #fff;
}
</style>
<script>
import mixin from '../../../utils/mixin'
import { GET_CAR_ILLEGAL_HIS_DATA } from '../../../store/types'
import { mapState } from 'vuex'
import pagination from '../../../widgets/pagination/pagination'
export default {
  mixins: [mixin],
  components: {
    pagination
  },
  data() {
    return {
      count: 0,
      pagenav: {
        currentpage: 1,
        limit: 10
      },
      visitList: []
    }
  },
  props: ['dialogVisit', 'object'],
  methods: {
    start() {
      this.dispatch(GET_CAR_ILLEGAL_HIS_DATA, {
        PlateNo: this.object.PlateNo,
        PageIndex: this.pagenav.currentpage,
        PageSize: this.pagenav.limit
      }).then(d => {
        this.visitList = this.focusCar.GetCarIllegalHisData.PageData.map(c => {
          return {
            caseNumber: c.KeyId,
            plateNo: c.PlateNo,
            caseAction: c.IllegalActCode,
            caseAddress: c.Addr,
            casePunish: c.Fines,
            caseDriver: c.DriverName,
            caseDriverLicense: c.DriverLicenseNumber
          }
        })
        this.count = this.focusCar.GetCarIllegalHisData.DataCount
      })
    },
    close() {
      this.$emit('close')
      this.isEdit = false
    },
    rowDblclick(r, e) {
      // 双击表格行
    }
  },
  watch: {
    pagenav: {
      handler() {
        this.start()
      },
      deep: true
    }
  },
  mounted() {},
  created() {},
  computed: {
    ...mapState(['dict', 'focusCar'])
  }
}
</script>
