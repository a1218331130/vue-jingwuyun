<template>
<el-dialog v-draggable="dialogDraggableOptions" title="图像布控" :visible.sync="phoneControl" size="large" @open="initDialog" :modal="true" :close-on-click-modal="false" :before-close="closeEvent">
  <div style="height:550px">
    <div style="background-color:#E4E4E4">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row :gutter="5">
          <el-col :span="4">
            <el-form-item label-width="100" prop="PhotosId">
              <div style="height:126px;width:113px">
                <!-- <data-image v-if="(form.Sfz||'').length===18" :idCard="form.Sfz"></data-image>
              <upload style="height:126px;width:113px;margin-left: 100px" v-if="(form.Sfz||'').length!==18" uploadType="picture" :isSinglePic="true" :isFormalSubmit="isFormalSubmit" @upload:submit="uploadSubmit" :currentFiles="currentFiles"></upload> -->
                <data-image v-if="object.sfz!==''" style="height:126px;width:113px;margin-left: 100px" :idCard="object.sfz"></data-image>
                <img v-if="object.sfz===''" style="height:126px;width:113px;margin-left: 100px" src="/static/img/testPersonImg.jpg" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="申请理由">

          </el-form-item>
        </el-col>
      </el-row> -->
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="时段" prop="timeRanger">
              <el-date-picker v-model="form.timeRanger" type="datetimerange" range-separator=" 至 " start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抓拍范围" prop="CaptureRanger">
              <el-select v-model="form.CaptureRanger" placeholder="请选择抓拍范围">
                <el-option v-for="item in CaptureRangerList" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="相似度(%)" label-width="80px" prop="staLike">
              <el-input v-model="form.staLike" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label="" label-width="20px" prop="endLike">
              <el-input v-model="form.endLike" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" label-width="80px">
              <el-button type="primary" @click="submitForm('approvalForm')">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
    </div>
    <div style="margin-top:2px;background-color:#E4E4E4">
      <div style="margin-left:100px;margin-top:2px">
        <el-row>
          <el-col :span="20">结果集：共
            <span style="color:red"> 1000 </span>条数据，结果按相似度从高到低排序
          </el-col>
          <el-col :span="4">
            <el-button @click="closeEvent">导出本页</el-button>
          </el-col>
        </el-row>
      </div>
      <div style="margin-left:50px;margin-top:2px;background-color:#E4E4E4">
        <el-row>
          <div>
            <!-- <el-col :span="3">
            <div>
              <data-image v-if="object.sfz!==''" style="height:126px;width:113px" :idCard="object.sfz"></data-image>
              <img v-if="object.sfz===''" style="height:126px;width:113px" src="/static/img/testPersonImg.jpg" />
            </div>
          </el-col>
          <el-col :span="3">
            <div>
              <img style="height:126px;width:113px;margin-left: 50px" src="/static/img/testPersonImg.jpg" />
            </div>
          </el-col> -->
            <el-col :span="3" v-for="item in resultSeacherList" :key="item.value">
              <div style="width:150px;margin-left: 50px">
                <img style="height:180px;width:150px" src="/static/img/testPersonImg.jpg" />
                <div>{{item.time}}</div>
                <div>
                  <el-progress title="相似度(%)" text-inside :stroke-width="18" :status="item.like>70?'success':'exception'" :percentage="item.like"></el-progress>
                </div>
                <div><i class="iconfont icon-dingwei"></i> {{item.place}}</div>
              </div>
            </el-col>
          </div>
          <!-- <el-col :span="8">
          <data-image :idCard="IDcard"></data-image>
          <img v-if="IDcard===''" src="/static/img/testPersonImg.jpg" />
        </el-col> -->
        </el-row>
      </div>
    </div>

  </div>

  <!-- <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitForm('approvalForm')">加入</el-button>
    <el-button @click="closeEvent">取 消</el-button>
  </div> -->
  <div class="app-toolbar footer" style="width:96%">
    <pagination :count="count" :pagenav="pagenav" @update:pagenav="pagenavChange"></pagination>
  </div>
</el-dialog>
</template>

<style scoped>

</style>
<script>
import mixin from '../../../../utils/mixin'
import pagination from '../../../../widgets/pagination/pagination.vue'
import dataImage from '../../../../widgets/data-image/data-image'
// import { POST_PROCESS_EXAMINE } from '../../../../store/types'
import upload from '../../../../widgets/upload/upload.vue'
import { mapState } from 'vuex'
export default {
  mixins: [mixin],
  components: {
    upload,
    pagination,
    'data-image': dataImage
  },
  data() {
    return {
      FocusType: 1,
      IDcard: '',
      isFormalSubmit: false,
      currentFiles: [], // 当前文件集合
      count: 0,
      pagenav: {
        currentpage: 1,
        limit: 50
      },
      approvalForm: {
        RyName: '',
        idcard: '',
        OwnerName: '',
        PlateNo: '',
        HandleOpinion: 'TY',
        Lczbid: '',
        Note: ''
      },
      form: {
        Sfz: '',
        CaptureRanger: '',
        PhotosId: '',
        timeRanger: '',
        staLike: '',
        endLike: ''
      },
      CaptureRangerList: [
        { label: '全部抓拍机', value: '1' },
        { label: '高清抓拍机', value: '2' },
        { label: '票证验证机', value: '3' },
        { label: '视频监控', value: '4' }
      ], // 抓拍
      resultSeacherList: [
      ], // 查询结果集
      rules: {
        HandleOpinion: [
          { required: true, message: '选择是否同意', trigger: 'change' }
        ],
        Note: [
          { required: true, message: '请输入审批意见', trigger: 'change' }
        ]
      }
    }
  },
  props: ['phoneControl', 'object'],
  methods: {
    /**
     *初始化编辑窗口
     * @return {[type]} [description]
     */
    initDialog() {
      this.resultSeacherList = []
      this.approvalForm.Lczbid = this.object.FlowId
      if(this.object.Sfz) {
        this.FocusType = 1
      } else {
        this.FocusType = 2
      }
      // 人员
      // this.dispatch(GET_PERSON_JUDGE_HIS, {
      //   Sfz: this.object.Sfz
      // }).then(() => {
      //   this.process.GetPersonJudgeHis
      // })
      this.approvalForm.RyName = this.object.RyName
      this.approvalForm.idcard = this.object.Sfz
      // 车辆
      this.approvalForm.OwnerName = this.object.OwnerName
      this.approvalForm.PlateNo = this.object.PlateNo
    },
    pagenavChange(obj) {
      // 分页切换操作
      this.pagenav = obj
      // 刷新列表
      this.loadData()
    },
    uploadSubmit(f) {
      // 获取当前上传文件列表文件id
      if(f.Status === 1) { // 文件更新保存成功后提交
        let _fileIdArray = []
        for(let ii in f.data.fileList) {
          _fileIdArray.push(f.data.fileList[ii].response.Data.ID)
          this.currentFiles.push({
            name: f.data.fileList[ii].name,
            id: f.data.fileList[ii].response.Data.ID
          })
        }
        this.form.PhotosId = _fileIdArray.join()
      }
    },
    /**
     * 重置表单
     */
    reset() {
      if(this.$refs['approvalForm']) {
        this.$refs['approvalForm'].resetFields()
      }
    },
    /**
     * 编辑窗关闭事件
     * @return {[type]} [description]
     */
    closeEvent() {
      this.reset()
      this.$emit('close')
      // this.dialog = false
    },
    submitForm(d) {
      this.resultSeacherList = [
        { label: '全部抓拍机', value: '1', time: '2018-03-09 15:42:31', place: '长沙南站B进站口1', like: 99.97 },
        { label: '全部抓拍机', value: '1', time: '2018-01-02 05:12:12', place: '衡阳东站A进站口2', like: 93.02 },
        { label: '全部抓拍机', value: '1', time: '2017-10-09 11:23:37', place: '衡阳东站A进站口2', like: 88.91 },
        { label: '全部抓拍机', value: '1', time: '2016-04-19 08:35:31', place: '长沙南站A进站口3', like: 50.63 },
        { label: '全部抓拍机', value: '1', time: '2016-01-09 13:49:11', place: '永州站A进站口1', like: 30.42 }
      ]
    }
  },
  watch: {},
  mounted() {},
  created() {},
  computed: {
    ...mapState(['process'])
  }
}
</script>
