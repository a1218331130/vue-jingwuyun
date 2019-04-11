<!-- 家庭成员 -->
<template>
  <div>
    <!-- 标题 checkRule('ajgl/family/addfamilymember', true)-->
    <card-header title="家庭成员"
                 :titleTipIcon="false"
                 :tool="checkRuleCase('ajgl/family/addfamilymember',caseId)"
                 :add="true"
                 @call:add="add()"
                 style="margin-top: -48px;border-bottom: none;"></card-header>
    <!-- 内容 -->
    <el-row :gutter="15" class="kinship-box">
      <el-col :span="24">
        <el-table
          :data="tableData"
          border stripe
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            prop="useIcon"
            label="人员头像"
            width="100"
          >
            <template scope="scope">
              <div class="k-user-img-box">
                <data-image class="k-user-img" v-show="scope.row.useIconId === null" :idCard="scope.row.IDCard"></data-image>
                <img class="k-user-img" v-show="scope.row.useIconId !== null" :src="scope.row.useIcon" width="100px" alt="照片">
                <!--<img class="k-user-img" :src="scope.row.useIcon"/>-->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="relative"
            label="关系"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="sexText"
            label="性别"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="dateBirth"
            label="出生日期"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="IDCard"
            label="证件号码"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="Address"
            label="现住址"
          >
          </el-table-column>
          <el-table-column
            prop="source"
            label="来源"
            width="50"
          >
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <el-button type="text"
                         v-if="checkRuleCase('ajgl/family/updatefamilymember',caseId)  && scope.row.sourceCode !== '1' && scope.row.sourceCode !== 1"
                         @click="edit(scope.row)"
                         icon="icon iconfont icon-brush"></el-button>
              <el-button type="text" v-if="checkRuleCase('ajgl/family/delfamilymember',caseId)"
                         @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <certificate-edit :dialog="editDialog" :title="editTitle" :dataForm="dialogData" @update:submit="submit"
                      @close="editDialog = false"></certificate-edit>
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
  import mixin from '../../../../utils/mixin'
  import '../../../../utils/dateFormat'
  import {arrayGetRid} from '../../../../utils/util'
  import cardHeader from '../../base/card-header.vue'
  import certificateEdit from '../dialog/certificate-edit.vue'
  import dataImage from '../../../../widgets/data-image/data-image'
  import {DOWNLOAD_FILE_PATH} from '../../../../config'
  import {
    FETCH_FAMILY_MENBERS_LIST,
    ADD_FAMILY_MENBERS,
    UPDATE_FAMILY_MENBERS,
    REMOVE_FAMILY_MENBERS
  } from '../../../../store/types'
  export default{
    mixins: [mixin],
    props: ['data', 'suspect'],
    components: {
      cardHeader,
      'data-image': dataImage,
      certificateEdit
    },
    computed: {
      ...mapState(['familyMenbers'])
    },
    data() {
      return {
        editTitle: '',
        editDialog: false,
        tableData: [],
        dialogData: '',
        caseId: ''
      }
    },
    methods: {
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
       * @param f
       */
      submit(f) {
        let _submitPath = ADD_FAMILY_MENBERS
        let _machF = {
          tx: f.imageId,
          xm: f.name,
          xb: f.sex,
          gx: f.relative,
          zjhm: f.IDCard,
          csrq: f.dateBirth === '' ? '' : this.dateFormat(new Date(f.dateBirth), 'yyyy-MM-dd'),
          xzz: f.Address,
          ly: f.sourceCode
        }
        let _message = '家庭成员添加成功！'
        if (f.id) { // 判断id 是否为空, 否则做更新提交
          _submitPath = UPDATE_FAMILY_MENBERS
          _machF.id = f.id
          _message = '家庭成员更新成功！'
        } else {
          _machF.ly = f.source
          _message = '家庭成员添加成功！'
        }
        this.dispatchTemp(_submitPath, _machF, _message)
      },
      /**
       * 表单数据提交后台
       * @param path 提交路径 默认是新增 ADD_FAMILY_MENBERS
       * @param parameter 提价的表单数据
       */
      dispatchTemp(path = ADD_FAMILY_MENBERS, parameter = {}, mess = '家庭成员操作成功！') {
        this.dispatch(path, Object.assign(parameter, {
          xyrid: this.suspect.id,  // 必填，嫌疑人id
          xyrsfz: this.suspect.sfz // 必填，身份证
        })).then(r => {
          this.$message({
            type: 'success',
            message: mess
          })
          this.editDialog = false
          this.queryList() // 刷新列表
        })
      },
      /**
       * 查询列表
       */
      queryList() {
        if (this.checkRuleCase('ajgl/family/list', this.caseId)) {
          this.dispatch(FETCH_FAMILY_MENBERS_LIST, {
            xyrid: this.suspect.id,  // 必填，嫌疑人id
            sfz: this.suspect.sfz || '' // 必填，身份证
          }).then(r => {
            console.log(this.familyMenbers.fetchFamilyMenbersList)
            if (this.familyMenbers.fetchFamilyMenbersList) {
              this.tableData = this.familyMenbers.fetchFamilyMenbersList.map(r => {
                return {
                  id: r.id,
                  useIconId: r.tx,
                  useIcon: r.tx === '' || !r.tx ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + r.tx,
                  name: r.xm,
                  relative: r.gx,
                  sexText: r.xb === '1' ? '男' : r.xb === '2' ? '女' : '未知',
                  sex: r.xb,
                  dateBirth: r.csrq === '' ? '' : this.dateFormat(new Date(r.csrq), 'yyyy-MM-dd'),
                  IDCard: r.zjhm,
                  Address: r.xzz,
                  sourceCode: r.ly, // 数据来源代码
                  source: r.ly === '1' ? '采集' : '手动' //  数据来源翻译
                }
              })
            }
          })
        }
      },
      /**
       * 删除家庭成员
       * @param item
       * @param scope
       */
      remove(item, scope) {
        let removeId = item.id
        this.$confirm('确认删除该家庭成员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (item.sourceCode === '1') { // 采集的数据删除处理逻辑
            this.dispatchTemp(ADD_FAMILY_MENBERS, {
              tx: item.useIconId,
              xm: item.name,
              xb: item.sexCode,
              gx: item.relative,
              zjhm: item.IDCard,
              csrq: item.dateBirth,
              xzz: item.Address,
              ly: item.sourceCode,
              sfsc: '1' // 是否删除 1:是删除
            }, '删除家庭成员成功！')
          } else {
            this.dispatch(REMOVE_FAMILY_MENBERS, {
              id: removeId
            }).then(() => {
              this.$message({
                message: '删除家庭成员成功！',
                type: 'success'
              })
              this.tableData = arrayGetRid(this.tableData, [item])
            })
          }
        }).catch(() => {
        });
      }
    },
    watch: {},
    mounted() {
    },
    created() {
      this.caseId = this.$route.query.a // 初始化获取案件id
      if (this.data) {
        this.tableData = this.data.map(r => {
          return {
            id: r.id,
            useIconId: r.tx,
            useIcon: r.tx === '' || !r.tx ? '/static/img/default_user.png' : DOWNLOAD_FILE_PATH + r.tx,
            name: r.xm,
            relative: r.gx,
            sex: r.xb,
            sexText: r.xb === '1' ? '男' : r.xb === '2' ? '女' : '未知',
            dateBirth: r.csrq === '' ? '' : this.dateFormat(new Date(r.csrq), 'yyyy-MM-dd'),
            IDCard: r.zjhm,
            Address: r.xzz,
            sourceCode: r.ly,
            source: r.ly === '1' ? '采集' : '手动'
          }
        })
      }
    }
  }
</script>
