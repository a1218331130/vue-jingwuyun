<template>
  <div>
    <el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" title="轨迹找人详情" :modal-append-to-body="true" :append-to-body="true"
               size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog"
               :before-close="closeEvent">
      <!-- <div class="el-dialog__body__scroll-wrap"> -->
      <el-form v-if="editForm!==null" ref="knowEditForm" :model="editForm" label-width="100px">
        <!-- id 插槽 -->
        <input v-model="editForm.id" type="hidden"></input>
        <el-row :gutter="20">
          <el-col :span="5">
            <data-image style="height: 150px;width: 120px" class="person-box__person__image" :idCard="editmode.ZJHM"
            ></data-image>
          </el-col>
          <el-col :span="7">
            <el-form-item label="姓名" prop="XM">
              {{editmode.XM}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="ZJHM">
              {{editmode.ZJHM}}
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="性别" prop="XM">
              男
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族" prop="ZJHM">
              汉族
            </el-form-item>
          </el-col>
         <!-- <el-col :span="24">
            <el-form-item label="处所名称" prop="csmc">
              {{editmode.csmc}}
            </el-form-item>
          </el-col>-->
        </el-row>
       <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="kssj">
              {{editmode.kssj}} {{timeLine}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="jssj">
              {{editmode.jssj}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置号" prop="wzh">
              {{editmode.wzh}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型" prop="Sjlx">
              {{editmode.Sjlx}}
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row :gutter="15" style="border-top:1px solid #d7d7d7; padding: 0;">
          <el-col :span="24">
            <div class="card-sub-title" style="padding: 15px 0;">时光轨迹</div>
          </el-col>
          <el-col :span="24" v-loading="dossierLoading">
            <time-line :timeLine="timeLineData"></time-line>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>
<style scoped>
</style>
<script>
  import {mapState} from 'vuex'
  import timeLine from './time_line.vue'
  import mixin from '../../../../utils/mixin'
  import upload from '../../../../widgets/upload/upload.vue'
  import dataImage from '../../../../widgets/data-image/data-image'
  export default {
    mixins: [mixin],
    components: {
      'data-image': dataImage,
      'time-line': timeLine,
      upload
    },
    data() {
      return {
        timeLineData: [{
          type: true,
          detailed: [{
            time: '2017-12-07 15:55:28',
            room: '位置号',
            startroom: '2017-12-07 15:57:02',
            address: '地址',
            endroom: '结束时间',
            type: 'WB'
          }],
          year: '2017'
        }],
        editForm: null,
        isFormalSubmit: false,
        cluesTpye: [],
        dossierLoading: false,
        currentFiles: []
      }
    },
    props: ['dialog', 'type', 'editmode', 'timeLine'],
    computed: {
      dialogMode() {
        return this.editmode || 'add'
      },
      ...mapState(['analysisLocus'])
    },
    methods: {
      /**
       *初始化编辑窗口
       * @return {[type]} [description]
       */
      initDialog() {
        this.reset()
        // 初始化选项值
//        this.queryCluesTypeList();
        this.editForm = {
          id: '', // 线索id
          title: '', // 线索标题
          type: '', // 线索类型代码
          fileId: '', // 附件路径
          fileName: '', // 附件名称
          desc: '' // 线索描述
        }
        // 填充表单基本数据
        if (this.dialogMode === 'edit') {
          // 修改
          let _thisInfo = this.caseClues.Model
          this.editForm = {
            id: _thisInfo.id, // 线索ID
            title: _thisInfo.xsbt, // 线索标题
            type: _thisInfo.xslx, // 线索类型代码
            fileName: _thisInfo.fjmc, // 附件名称
            fileId: _thisInfo.fjlj, // 附件路径
            desc: _thisInfo.xsms // 线索描述
          }
          let _fId = _thisInfo.fjlj ? _thisInfo.fjlj.split(',') : _thisInfo.fjlj
          let _fName = _thisInfo.fjmc ? _thisInfo.fjmc.split(',') : _thisInfo.fjmc

          // 附件列表数据回填
          this.currentFiles = [] // 上传文件列表 重置
          for (let fi in _fId) {
            this.currentFiles.push({
              name: _fName[fi],
              id: _fId[fi]
            })
          }
        }
      },
      /**
       * 编辑窗关闭事件
       * @return {[type]} [description]
       */
      closeEvent() {
        this.reset()
        this.$emit('close')
//        this.dialog = false
      },
      /**
       * 编辑模态窗取消按钮事件
       * @return {[type]} [description]
       */
      cancel() {
        this.closeEvent()
      },
      /**
       * 重置表单
       */
      reset() {
        this.currentFiles = [] // 上传文件列表 重置
        if (this.$refs['knowEditForm']) {
          this.$refs['knowEditForm'].resetFields()
        }
      }
    },
    watch: {},
    created() {
//      console.log('子mode', this.editmode)
    },
    mounted() {
      console.log('子mode', this.editmode)
      console.log('子mode2', this.timeLine)
    }
  }
</script>
