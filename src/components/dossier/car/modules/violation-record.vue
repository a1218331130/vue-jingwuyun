<!-- 违章记录 -->
<template>
<div>
  <!-- 标题 -->
  <card-header title="违章记录"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="violation-box">
    <el-col :span="24">
      <el-table :data="tableData" stripe>

        <el-table-column prop="address" label="序号" align="center" :width="70" type="index">

        </el-table-column>
        <el-table-column prop="address" align="center" label="时间" :width="200">
          <template scope="scope">
            <p class="time-text">
              {{scope.row.time}}
            </p>

          </template>
        </el-table-column>
        <el-table-column prop="address" label="违章地" align="center">
          <template scope="scope">
            <p class="time-text">
              {{scope.row.address}}
            </p>

          </template>
        </el-table-column>
        <el-table-column prop="address" label="违章描述" align="center">
          <template scope="scope">
            <p class="time-text">
              {{scope.row.certmenber}}
            </p>

          </template>
        </el-table-column>
        <el-table-column prop="address" label="记分" align="center" :width="80">
          <template scope="scope">
            <p class="time-text">
              {{scope.row.score}}
            </p>

          </template>
        </el-table-column>
        <el-table-column prop="address" label="罚款" align="center" :width="80">
          <template scope="scope">
            <p class="time-text">
              {{scope.row.fine}}
            </p>

          </template>
        </el-table-column>
        <el-table-column prop="address" label="处理情况" align="center" :width="120">
          <template scope="scope">
            <p class="time-text">
              {{scope.row.handles}}
            </p>

          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
.violation-box {
    margin-top: 13px;
}
</style>


<script>
import cardHeader from './card-header.vue'
import mixin from '../../../../utils/mixin'
import { GET_CAR_ILLEGAL_HIS_DATA } from '../../../../store/types'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {
    cardHeader
  },
  data() {
    return {
      tableData: [
        {
          fine: '200',
          score: '-2',
          time: '2017-8-19 17:58:33',
          name: '张三',
          certmenber: '28853708191113414',
          address: '湖南省长沙市芙蓉区火柜西路桥边公园西北',
          handles: '已处理'
        }, {
          fine: '200',
          score: '-2',
          time: '2017-8-19 17:58:33',
          name: '张三',
          certmenber: '28853708191113414',
          address: '湖南省长沙市芙蓉区火柜西路桥边公园西北',
          handles: '已处理'
        }
      ]
    }
  },
  props: ['carKey'],
  methods: {
    loadData() {
      this.dispatch(GET_CAR_ILLEGAL_HIS_DATA, { PlateNo: this.carKey, PageIndex: '1', PageSize: '100' }).then(() => {
        // console.log(this.focusCar.GetCarIllegalHisData)
      })
    }
  },
  created() {
    this.loadData()
  },
  computed: {
    ...mapState(['focusCar'])
  }
}
</script>
