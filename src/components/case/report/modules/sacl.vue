<!-- 涉案车辆 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="涉案车辆"></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <el-table :data="tableData" stripe border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="carIcon" label="图片" width="100">
            <template scope="scope">
              <div class="k-user-img-box">
                <img class="k-user-img" :src="scope.row.carIcon"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="车牌号" width="120"></el-table-column>
          <el-table-column prop="name" label="车辆品牌" width="100"></el-table-column>

          <el-table-column prop="feature" label="特征">
          </el-table-column>

          <el-table-column prop="owner" label="车主">
          </el-table-column>
          <el-table-column prop="IDcard" label="身份证">
          </el-table-column>
          <el-table-column prop="driver" label="驾驶员描述">
          </el-table-column>

          <el-table-column prop="state" label="机动车状态" width="100"></el-table-column>
          <el-table-column prop="type" label="涉案类型" width="120"></el-table-column>
          <el-table-column prop="describe" label="车辆描述" width="220">
            <template scope="scope">
              <p class="describe-text">
                {{scope.row.describe}}
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  .kinship-box {
    margin-top: 13px;
  }

  .describe-text {
    white-space: normal;
  }

  .k-user-img-box {
    width: 49px;
    height: 49px;
    border: 1px solid #D7D7D7;
    margin: 10px auto;
    overflow: hidden;
    .k-user-img {
      width: 90%;
      height: 100%;
      margin: 1px auto;
    }
  }
</style>

<script>
  import {mapState} from 'vuex'
  import mixin from '../../../../utils/mixin'
  import {
    FETCH_INVOLVED_CAR_LIST
  } from '../../../../store/types'
  import {DOWNLOAD_FILE_PATH} from '../../../../config'
  import cardHeader from './card-header.vue'
  export default {
    mixins: [mixin],
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['involvedCar'])
    },
    data() {
      return {
        caseId: '',
        tableData: []
      }
    },
    methods: {
      queryList() {
        if (this.checkRuleCase('ajgl/vehicle/list', this.caseId)) {
          // 查询列表
          this.dispatch(FETCH_INVOLVED_CAR_LIST, {
            data: {
              ajid: this.caseId,
              PageIndex: 1,
              PageSize: 10000
            }
          })
        }
      }
    },
    watch: {
      'involvedCar.PageData' (val) {
        this.tableData = val.map(row => {
          return {
            id: row.id,
            name: row.clxh,
            carIcon: DOWNLOAD_FILE_PATH + row.tpid,
            tez: row.cltz,
            state: row.kyqkmc,
            feature: row.clms,
            owner: row.czxm,
            IDcard: row.czsfz,
            driver: row.jsytmtz,
            type: row.salxmc,
            describe: row.jsyms,
            incone: row.salxmc,
            num: row.cph
          }
        })
      }
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.queryList()
    }
  }
</script>
