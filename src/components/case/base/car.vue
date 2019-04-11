<!-- 涉案车辆 -->
<template>
<div class="car-box">
  <!-- 标题 -->
  <card-header title="涉案车辆" :tool="checkUserRuleCase('ajgl/vehicle/save',caseId,true,cjrId)" :add="true" @call:add="add"></card-header>

  <el-table @cell-mouse-enter="cellMouseEnter" :data="list" border>
    <el-table-column label="车牌号" prop="no"></el-table-column>
    <el-table-column label="驾驶人" prop="driver"></el-table-column>
    <el-table-column label="车主" prop="master"></el-table-column>
    <el-table-column label="涉案描述" prop="masterSpc"></el-table-column>
    <el-table-column label="类型" prop="type"></el-table-column>
    <el-table-column label="操作" width="90" algin="center">
      <template scope="scope">
        <!-- <el-button v-if="checkUserRuleCase('ajgl/vehicle/info',caseId,true,cjrId)" type="text" title="详情" @click="openDetail(scope.row)" icon="icon iconfont icon-iconfontsousuo1"></el-button> -->
        <el-button v-if="checkUserRuleCase('ajgl/vehicle/update',caseId,true,cjrId)" type="text" title="编辑" @click="edit(scope.row)" icon="icon iconfont icon-brush"></el-button>
        <el-button v-if="checkUserRuleCase('ajgl/vehicle/delete',caseId,true,cjrId)" type="text" title="删除" @click="remove(scope.row,scope)" icon="icon iconfont icon-trash"></el-button>
        <!-- <el-button v-if="list.bkzt!=='1'" type="text" title="布控" @click="applyControl(scope.row)" icon="icon iconfont icon-jingbao"></el-button>
        <el-button v-if="list.bkzt==='1'" type="text" title="布控结果" @click="" icon="icon iconfont icon-menu"></el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <dialog-edit-car v-loading="loading" element-loading-text="正在提交..." :mode="carDialogMode" :carInfo="carInfo" :isdetail="isDetail" :dialog="editCarDialog" :data="detail" @update="submit" @close="editCarDialog=false" @on-control="applyControl" @on-view-result="ContrastDialog=true"
    @on-cancel-control="cancelControl"></dialog-edit-car>
  <!-- 添加布控 -->
  <!-- @call:change-update="loadData" -->
  <dialog-form :type="'car'" :hiddenBtn="true" :peopleObj="carInfo" :dialog="formDialog" @close="formDialog=false"></dialog-form>
  <!-- 查看布控结果  -->
  <dialog-contrast-results :dialog="ContrastDialog" @close="ContrastDialog=false" :ID="carInfo.bkid" :title="carInfo.no"></dialog-contrast-results>
  <!-- 撤销布控弹窗 -->
  <el-dialog title="撤销布控" v-draggable="dialogDraggableOptions" :visible.sync="repealDialog" :modal-append-to-body="true" size="large--fixed" :modal="true" :close-on-click-modal="false" @open="repealInitDialog" :before-close="repealCloseEvent" v-loading="loading"
    element-loading-text="正在撤销布控中……">
    <el-form :model="repealForm" :rules="rules" label-width="100px" class="repealForm" ref="repealForm">
      <el-form-item label="撤控原因" prop="ckyy">
        <el-input type="textarea" v-model="repealForm.ckyy" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="" @click="repealCloseEvent">关闭</el-button>
      <el-button type="primary" @click="repealSubmit('repealForm')">确认</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style scoped lang="scss">
.car-box {
    background: #fff;
    margin-top: 10px;
    min-height: 450px;
}
</style>

<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import {
  FETCH_INVOLVED_CAR_LIST,
  ADD_INVOLVED_CAR,
  GET_INVOLVED_CAR_INFO,
  UPDATE_INVOLVED_CAR,
  REMOVE_INVOLVED_CAR,
  REVOKE_APPROVAL
} from '../../../store/types'
import cardHeader from './card-header.vue'
import dialogEditCar from '../involve/dialog-edit-car'
import dialogForm from '../../controlManage/apply/dialog-form'
import dialogContrastResults from '../../controlManage/supervise/contrastResults'

export default {
  mixins: [mixin],
  components: {
    cardHeader,
    'dialog-edit-car': dialogEditCar,
    'dialogForm': dialogForm,
    'dialog-contrast-results': dialogContrastResults
  },
  data() {
    return {
      loading: false,
      isDetail: false,
      editCarDialog: false,
      carDialogMode: 'add',
      detail: null,
      formDialog: false,
      ContrastDialog: false,
      list: [],
      carInfo: {},
      caseId: '',
      cjrId: '',
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 100,
        currentpage: 1
      },
      repealDialog: false,
      repealForm: {
        ckyy: '',
        id: '',
        lybid: ''
      },
      rules: {
        ckyy: [
          { required: true, message: '请输入撤控原因', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['involvedCar'])
  },
  methods: {
    queryList() {
      // 查询涉案车辆列表
      if(this.checkUserRuleCase('ajgl/vehicle/list', this.caseId)) {
        this.dispatch(FETCH_INVOLVED_CAR_LIST, {
          data: {
            ajid: this.caseId,
            PageIndex: this.pageInfo.currentpage,
            PageSize: this.pageInfo.limit
          }
        })
      }
    },
    getQueryInfo(carId, callback = () => {}) {
      // 查询单条涉案车辆信息
      this.dispatch(GET_INVOLVED_CAR_INFO, {
        data: {
          id: carId
        }
      }).then(() => {
        callback()
      })
    },
    openDetail(item) {
      // 车辆详情信息预览
      let carId = item.id
      this.carInfo = item
      this.getQueryInfo(carId, () => {
        let getCarInfo = this.involvedCar.Model
        this.isDetail = true
        this.detail = {
          plateNumber: getCarInfo['cph'],
          name: getCarInfo['jsyxm'],
          pilotDescribe: getCarInfo['jsyms'],
          carDescribe: getCarInfo['clms'],
          involvedType: getCarInfo['salxmc'],
          detainState: getCarInfo['kyqkmc'],
          sex: getCarInfo['jsyxbmc'],
          aspectFeature: getCarInfo['jsytmtz'],
          carFeature: getCarInfo['cltz'],
          carColor: getCarInfo['clys'],
          carImageId: getCarInfo['tpid'], // 车辆图片路径
          carModel: getCarInfo['clxh'], // 车辆型号
          ownerName: getCarInfo['czxm'], // 车主姓名
          ownerIdCard: getCarInfo['czsfz'], // 车主身份证号
          ownerAge: getCarInfo['czcsrq'], // 车主年龄
          ownerNowAddress: getCarInfo['czxzz'], // 车主现住址
          ownerLicenceType: getCarInfo['czjzlx'], // 车主驾照类型
          ownerLicenceNumber: getCarInfo['czjzid'], // 车主驾照编号
          controlState: getCarInfo['bkzt'], // 车辆布控状态
          controlCount: getCarInfo['bksl'] // 车辆布控结构条数
        }
        this.editCarDialog = true
      })
    },
    edit(item) {
      // update
      let carId = item.id;
      this.getQueryInfo(carId, () => {
        let getCarInfo = this.involvedCar.Model
        this.isDetail = false
        this.detail = {
          id: getCarInfo['id'],
          plateNumber: getCarInfo['cph'],
          name: getCarInfo['jsyxm'],
          carImageId: getCarInfo['tpid'], // 车辆图片
          pilotDescribe: getCarInfo['jsyms'],
          carDescribe: getCarInfo['clms'],
          involvedType: getCarInfo['salx'],
          detainState: getCarInfo['kyqk'],
          sex: getCarInfo['jsyxb'],
          aspectFeature: getCarInfo['jsytmtz'],
          carFeature: getCarInfo['cltz'],
          carColor: getCarInfo['clys']
        }
        this.carDialogMode = 'edit';
        this.editCarDialog = true
      })
    },
    add(val) {
      this.isDetail = false
      this.detail = null
      this.carDialogMode = 'add';
      this.editCarDialog = true
    },
    remove(item, scope) {
      let removeCarId = item.id
      this.$confirm('确认删除该车辆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dispatch(REMOVE_INVOLVED_CAR, {
          data: {
            ids: removeCarId
          }
        }, scope.$index).then(() => {
          this.$message({
            message: '删除涉案车辆成功！',
            type: 'success'
          })
        })
      }).catch(() => {});
    },
    submit(form) {
      this.loading = true
      let submitType = ADD_INVOLVED_CAR
      let dataDetail = {
        cph: form.plateNumber,
        jsyxm: form.name,
        jsyms: form.pilotDescribe,
        clms: form.carDescribe,
        salx: form.involvedType,
        kyqk: form.detainState,
        jsyxb: form.sex,
        jsytmtz: form.aspectFeature,
        cltz: form.carFeature,
        clys: form.carColor,
        tpid: form.carImageId
      }
      if(form.id !== '') { // 判断表单id是否为空，非空可判断为更新提交
        submitType = UPDATE_INVOLVED_CAR
        dataDetail.id = form.id
      } else {
        dataDetail.ajid = this.$route.query.a // 新增数据赋值当前案件id
      }
      this.dispatch(submitType, {
        data: dataDetail
      }).then(() => {
        this.loading = false
        this.editCarDialog = false
        this.queryList()
        this.$message({
          message: '更新车辆信息成功',
          type: 'success'
        })
      })
    },
    // 取消布控
    cancelControl() {
      this.$confirm('确定要取消布控' + '该车吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(REVOKE_APPROVAL)
        this.repealForm.id = this.carInfo.bkid
        this.repealForm.lybid = this.carInfo.id
        this.repealDialog = true
        // this.dispatch(REVOKE_APPROVAL, { id: this.carInfo.bkid, ckyy: '', bkly: '4', lybid: this.carInfo.id }).then(() => {
        //   this.$message({
        //     message: '取消布控成功',
        //     type: 'success'
        //   })
        // this.editCarDialog = false
        // this.queryList()
        // }).catch(() => {})
      })
    },
    // 申请布控
    applyControl() {
      this.editCarDialog = false
      this.formDialog = true
    },
    repealInitDialog() {
      this.repealForm.ckyy = ''
    },
    repealCloseEvent() {
      this.repealDialog = false
    },
    // 撤销布控确认按钮
    repealSubmit(repealForm) {
      this.$refs[repealForm].validate((valid) => {
        if(valid) {
          this.dispatch(REVOKE_APPROVAL, {
            id: this.repealForm.id,
            bkly: '3',
            ck_object: {
              id: '',
              lybid: this.repealForm.lybid,
              ckyy: this.repealForm.ckyy
            }
          }).then(() => {
            this.repealDialog = false
            this.$message({
              message: '取消布控成功!',
              type: 'success'
            })
            this.editCarDialog = false
            this.queryList()
          }).catch(() => {})
        }
      })
    }
  },
  mounted() {},
  watch: {
    'involvedCar.PageData': {
      handler(val) {
        this.list = val.map(row => {
          return {
            id: row.id,
            no: row.cph,
            master: row.czxm,
            masterSpc: row.jsyms,
            sign: row.clys,
            type: row.salxmc,
            driver: row.jsyxm,
            bksl: row.bksl,
            bkzt: row.bkzt,
            bkid: row.bkid,
            lylx: '4' // 来源类型
          }
        })
        this.pageInfo.count = this.involvedCar.DataCount
      },
      deep: true
    },
    formDialog(val) {
      if(!val) {
        setTimeout(() => {
          this.queryList()
        }, 300)
      }
    }
  },
  created() {
    this.caseId = this.$route.query.a // 案件ID
    this.cjrId = this.$route.query.b // 创建人ID
    this.queryList()
  }
}
</script>
