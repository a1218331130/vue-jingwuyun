<!-- 嫌疑人 -->
<template>
  <div>
    <!-- 标题 -->
    <!--<div class="sun-title" style="color: #46BDFD;margin-top: -48px;">嫌疑人列表</div>-->
    <card-header title="嫌疑人列表"></card-header>
    <!-- 内容 -->
    <el-row class="kinship-box">
      <el-col :span="24">
        <el-table :data="tableData" border stripe>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="useIcon" label="人员头像" width="100">
            <template scope="scope">
              <div class="k-user-img-box">
                <data-image class="k-user-img" v-show="scope.row.useIconId === null" :idCard="scope.row.IDCard"></data-image>
                <img class="k-user-img" v-show="scope.row.useIconId !== null" :src="scope.row.useIcon" width="100px" alt="照片">
                <!--<img class="k-user-img" :src="scope.row.useIcon"/>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="relative" label="是否主犯" width="100"></el-table-column>

          <el-table-column prop="IDCard" label="证件号码" width="180"></el-table-column>

          <el-table-column prop="hight" label="身高" width="100"></el-table-column>

          <el-table-column prop="habitus" label="体型" width="100"></el-table-column>

          <el-table-column prop="reasons" label="作案原因" min-width="100"></el-table-column>

          <el-table-column prop="means" label="作案手段" min-width="100"></el-table-column>

          <el-table-column prop="toolmc" label="作案工具" min-width="100"></el-table-column>

          <el-table-column prop="features" label="作案特点" min-width="100"></el-table-column>

          <el-table-column prop="caseDesc" label="涉案描述" min-width="220">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
  .kinship-box {
    margin-top: 26px;
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
  import mixin from '../../../utils/mixin'
  import dataImage from '../../../widgets/data-image/data-image'
  import {
    FETCH_SUSPECT_CASE_PEOPLE_LIST
  } from '../../../store/types'
  import {DOWNLOAD_FILE_PATH} from '../../../config'

  import cardHeader from '../report/modules/card-header.vue'
  export default {
    mixins: [mixin],
    components: {
      'data-image': dataImage,
      cardHeader
    },
    computed: {
      ...mapState(['suspectCasePeople'])
    },
    data() {
      return {
        caseId: '',
        tableData: []
      }
    },
    methods: {
      queryList() {
        if (this.checkRuleCase('ajgl/suspect/list', this.caseId)) {
          // 查询列表
          // 嫌疑人
          this.dispatch(FETCH_SUSPECT_CASE_PEOPLE_LIST, {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 10000
          })
        }
      }
    },
    watch: {
      'suspectCasePeople.PageData' (val) {
        this.tableData = val.map(row => {
          return {
            id: row.id,
            useIconId: row.pic,
            useIcon: DOWNLOAD_FILE_PATH + row.pic,
            name: row.xm,
            relative: row.sfzf === '1' ? '主犯' : '从犯',
            sex: row.xb === '1' ? '男' : row.xm === '2' ? '女' : '未知',
            num: row.nl,
            hight: row.sg === null ? '' : row.sg + 'CM',
            habitus: row.tx,
            reasons: row.zayymc,
            means: row.zasdmc,
            tool: row.zagj,
            toolmc: row.zagjmc,
            features: row.zatdmc,
            IDCard: row.sfz,
            caseDesc: row.tjsm
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
