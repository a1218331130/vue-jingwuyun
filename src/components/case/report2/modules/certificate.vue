<!-- 家庭成员 -->
<template>
<div>
  <!-- 标题 checkRule('ajgl/family/addfamilymember', true)-->
  <card-header title="家庭成员" :titleTipIcon="false" :tool="checkUserRuleCase('ajgl/family/addfamilymember',caseId,true,cjrId)" :add="true" @call:add="add()" style="margin-top: -48px;border-bottom: none;"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="kinship-box">
    <el-col :span="24">
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="useIcon" label="人员头像" width="100">
          <template scope="scope">
            <div class="k-user-img-box">
              <data-image class="k-user-img" v-show="!scope.row.useIconId" :idCard="scope.row.IDCard"></data-image>
              <img class="k-user-img" v-show="scope.row.useIconId" :src="scope.row.useIcon" width="100px" alt="照片">
              <!--<img class="k-user-img" :src="scope.row.useIcon"/>-->
            </div>
          </template>
</el-table-column>
<el-table-column prop="relative" label="关系" width="80"></el-table-column>
<el-table-column prop="name" label="姓名" width="80"></el-table-column>
<el-table-column prop="sexText" label="性别" width="50"></el-table-column>
<el-table-column prop="dateBirth" label="出生日期" width="140"></el-table-column>
<el-table-column prop="IDCard" label="证件号码" width="180"></el-table-column>
<el-table-column prop="Address" label="现住址">
</el-table-column>
<el-table-column prop="source" label="来源" width="50">
  <template scope="scope">
            {{scope.row.sourceCode !== '1' && scope.row.sourceCode!==1? '手动': '检索'}}
            </template>
</el-table-column>
<el-table-column label="操作" width="80" align="center">
  <template scope="scope">
            <el-button type="text" v-if="checkUserRuleCase('ajgl/family/updatefamilymember',caseId,true,cjrId)  && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1" @click="edit(scope.row)" icon="icon iconfont icon-brush"></el-button>
            <el-button type="text" v-if="checkUserRuleCase('ajgl/family/delfamilymember',caseId,true,cjrId) && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
          </template>
</el-table-column>
</el-table>
</el-col>
</el-row>

<!-- 编辑弹窗 -->
<certificate-edit :dialog="editDialog" :title="editTitle" :dataForm="dialogData" @update:submit="submit" @close="editDialog = false"></certificate-edit>
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
  //  import {mapState} from 'vuex'
  import reportMixin from '../reportMixin'
  import '../../../../utils/dateFormat'
  import {
    arrayGetRid
    //    clone
  } from '../../../../utils/util'
  import cardHeader from '../../base/card-header.vue'
  import certificateEdit from '../dialog/certificate-edit.vue'
  import dataImage from '../../../../widgets/data-image/data-image'
  import { DOWNLOAD_FILE_PATH } from '../../../../config'
  export default {
    mixins: [reportMixin],
    props: ['data', 'suspect'],
    components: {
      cardHeader,
      'data-image': dataImage,
      certificateEdit
    },
    data() {
      return {
        editTitle: '',
        tableDataLoc: [],
        editDialog: false,
        tableData: [],
        dialogData: '',
        cjrId: '',
        caseId: ''
      }
    },
    methods: {
      /**
       * 数据转换
       */
      dataMatch(r) {
        let _rD = null
        if (r) {
          _rD = {
            id: r.id,
            useIconId: r.tx,
            useIcon: (r.tx === '' || !r.tx) ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + r.tx,
            name: r.xm,
            relative: r.gx,
            relativeCode: r.gxdm,
            sex: r.xb,
            sexText: r.xb === '1' ? '男' : r.xb === '2' ? '女' : '未知',
            dateBirth: r.csrq ? this.dateFormat(new Date(r.csrq), 'yyyy-MM-dd') : '',
            IDCard: r.zjhm,
            Address: r.xzz,
            sourceCode: r.ly,
            source: r.ly === '1' ? '采集' : '手动'
          }
        }
        return _rD
      },
      /**
       * 添加嫌疑人家庭成员
       */
      add(id) {
        this.dialogData = ''
        this.editDialog = true
        this.editTitle = '添加家庭成员'
      },
      /**
       * 编辑
       * @param item
       */
      edit(item) {
        this.dialogData = item
        this.editDialog = true
        this.editTitle = '编辑家庭成员'
      },
      /**
       * 家庭成员表单提交
       * @param subF
       */
      submit(f) {
        let _machF = {
          tx: f.imageId,
          xm: f.name,
          xb: f.sex,
          gx: f.relative,
          gxdm: f.relativeCode,
          zjhm: f.IDCard,
          csrq: f.dateBirth ? this.dateFormat(new Date(f.dateBirth), 'yyyy-MM-dd') : '',
          xzz: f.Address,
          ly: f.sourceCode
        }
        let _message = '家庭成员添加'
        if (f.id) { // 判断id 是否为空, 否则做更新提交
          _machF.id = f.id
          this.tableData.map((tr, tIndex) => {
            if (tr.id === f.id) {
              this.$set(this.tableData, tIndex, this.dataMatch(_machF))
              this.tableDataLoc[tIndex] = _machF
            }
          })
          _message = '家庭成员更新'
        } else {
          _machF.id = this.suspect.id + '_family_' + new Date().getTime()
          _machF.ly = f.source
          this.tableData = this.tableData.concat([this.dataMatch(_machF)])
          this.tableDataLoc = this.tableDataLoc.concat([_machF])
          _message = '家庭成员添加'
        }
        this.editDialog = false
        this.localUpdate(this.tableDataLoc, _message)
      },
      /**
       * 删除家庭成员
       * @param item
       * @param scope
       */
      remove(item, scope) {
        this.$confirm('确认删除该家庭成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          arrayGetRid(this.tableData, [item])
          this.tableDataLoc = this.tableDataLoc.filter(fr => fr.id !== item.id)
          this.localUpdate(this.tableDataLoc, '删除该家庭成员')
        }).catch(() => {});
      },
      /**
       * 本地更新数据操作
       * @param _text
       */
      localUpdate(tableData, _text = '') {
        let _tempReportContent = JSON.parse(this.caseReportVersion.getCaseReportVersion.data)
        if (_tempReportContent) {
          _tempReportContent['xinfo'].map((rt, rIndex) => {
            if (rt.baseinfo.id === this.suspect.id) {
              rt.family = tableData
            }
          })
        }
        this.updateReport({ type: 'xinfo', data: _tempReportContent['xinfo'], text: _text }) // 更新数据对象
      }
    },
    watch: {},
    mounted() {},
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      this.cjrId = this.$route.query.b // 初始化获取案件id
      if (this.data) {
        this.tableData = this.data.map(r => {
          return this.dataMatch(r)
        })
        this.tableDataLoc = this.data
      }
    }
  }

</script>
