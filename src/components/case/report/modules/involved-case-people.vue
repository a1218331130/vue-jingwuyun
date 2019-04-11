<!-- 报案人/受害人人员 -->
<template>
  <div>
    <!-- 标题 -->
    <card-header title="报案人/受害人/证人"></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <el-table :data="tableData" stripe border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="useIcon" label="人员头像" width="100">
            <template scope="scope">
              <div class="k-user-img-box">
                <data-image class="k-user-img" v-show="scope.row.photo === null" :idCard="scope.row.IDCard"></data-image>
                <img class="k-user-img" v-show="scope.row.photo !== null" :src="scope.row.useIcon" width="100px" alt="照片">
                <!--<img class="k-user-img" :src="scope.row.useIcon"/>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="100"></el-table-column>
          <el-table-column prop="sex" label="性别" width="100"></el-table-column>
          <el-table-column prop="birthday" label="出生日期" width="100"></el-table-column>
          <el-table-column prop="IDCard" label="证件号码" width="200"></el-table-column>
          <el-table-column prop="caseType" label="涉案类型" min-width="120"></el-table-column>
          <el-table-column prop="erea" label="描述" align="left" min-width="220">
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
  import dataImage from '../../../../widgets/data-image/data-image'
  import mixin from '../../../../utils/mixin'
  import {
    FETCH_INVOLVED_CASE_PEOPLE_LIST
  } from '../../../../store/types'
  import {DOWNLOAD_FILE_PATH} from '../../../../config'

  import cardHeader from './card-header.vue'
  export default {
    mixins: [mixin],
    components: {
      'data-image': dataImage,
      cardHeader
    },
    computed: {
      ...mapState(['involvedCasePeople'])
    },
    data() {
      return {
        caseId: '',
        tableData: []
      }
    },
    methods: {
      queryList() {
        if (this.checkRuleCase('ajgl/personnel/list', this.caseId) === true) {
          // 查询列表
          // 报案人/受害人/证人
          this.dispatch(FETCH_INVOLVED_CASE_PEOPLE_LIST, {
            ajid: this.caseId,
            PageIndex: 1,
            PageSize: 10000
          })
        }
      }
    },
    watch: {
      'involvedCasePeople.PageData' (val) {
        this.tableData = val.map(row => {
          return {
            id: row.id,
            photo: row.tpid,
            useIcon: row.tpid === '' || !row.tpid ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + row.tpid,
            name: row.xm,
            sex: row.xb === '1' ? '男' : row.xm === '2' ? '女' : '未知',
            birthday: row.csrq ? row.csrq.split(' ')[0] : '',
            caseType: row.lbmc,
            erea: row.ms,
            IDCard: row.sfz
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
