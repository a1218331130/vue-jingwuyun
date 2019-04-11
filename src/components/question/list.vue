<template>
<div class="nav-list-box" style="padding:0px">
     <el-dialog v-draggable="imageDialog" :visible.sync="imageDialog" title="图片预览" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true"  :before-close="closeEvent">
       <div class="imageBig">
         <img style="width:500px;margin-left:30px" :src="bigImg"/>
       </div>
       <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button> -->
      </div>
  </el-dialog>
   <el-form ref="editForm" :model="editForm" label-width="100px">
      <el-row type="flex" class="search-row">
          <el-col :span="5">
              <el-form-item prop="module" label="系统模块" placeholder="请选择系统模块">
              <el-select v-model="editForm.module" style="width:100%" @change="moudelChange" clearable>
                <el-option v-for="item in moudelList" :key="item.nodeName" :label="item.nodeName" :value="item.nodeName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="questionType" label="问题类型" placeholder="请选择问题类型">
              <el-select v-model="editForm.questionType" style="width:100%" @change="questionChange" clearable>
                <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
        </el-col>
          <el-col :span="5">
            <el-form-item prop="questionType" label="进度" placeholder="请选择进度">
              <el-select v-model="editForm.currentProgress" style="width:100%" @change="questionChange" clearable>
                <el-option v-for="item in selectjd" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item prop="title" label="提出人">
              <el-input v-model="editForm.creatUsername" required="true" :disabled="justMe"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="4" style="padding-left: 30px;">
            <el-checkbox size="small" type="primary" label="只显示我的" v-model="justMe"></el-checkbox>
            <el-button type="primary" icon="search" size="small" style="margin-left: 30px;" @click="serch">搜索</el-button>
        </el-col> 
      </el-row> 
  </el-form>
   <!-- :key='iIndex' v-for="(list,iIndex) in list" -->
  <div class="question-box" v-loading="questionLoading">
    <div class="genre-box-question" v-for="(list,iIndex) in questionList" :key='iIndex'>
      <el-row>
          <el-col :span="16">
            <div>
              <span class="number">{{iIndex + 1}}</span>
              <span class="content">[{{list.module}}] {{list.questionContent}}
                <span style="cursor:pointer" @click="like(list.id)">
                  <img class="xcenter-slogan" src="/static/img/question/like.png" />
                  <i style="color:#20a1ff;position: absolute;top: -5px;">{{list.likeCount}}</i>
                </span>
              </span>
            </div>
            <!-- <div><img class="xcenter-slogan" src="/static/img/login/xcanterlogo.png" /></div>
            <div><img class="xcenter-slogan" src="/static/img/login/xcanterlogo.png" /></div> -->
          </el-col>
          <el-col :span="8" style="padding-left:50px">
             <div class="right-type">
               <span class="one">问题类型:</span>
               <span class="two" v-if="list.questionType==='0'">功能需求</span>
               <span class="two" v-if="list.questionType==='1'">数据需求</span>
               <span class="two" v-if="list.questionType==='2'">BUG</span>
               <span class="two" v-if="list.questionType==='3'">其它</span>
               <span class="one">提出人:</span>
               <span class="two">{{list.creatUsername}}</span>
               <span class="one">提出时间:</span>
               <span class="two">{{list.createTime}}</span>
            </div>
            <div class="right-type" style="height:40px">
                 <span class="one">当前进度:</span>
                 <el-steps :active="parseInt(list.currentProgress)" finish-status="success" process-status="success">
                   <el-step title="待开展"></el-step>
                   <el-step title="进行中"></el-step>
                   <el-step title="已解决"></el-step>
               </el-steps> 
            </div>
          </el-col>
      </el-row>
      <el-row v-if="list.pic.length>0">
          <el-col :span="16" style="padding-left:30px">
            <img class="xcenter-slogan" @click="showBigImg(picture)"  v-for="(picture,iIndex) in list.pic" style="width:80px;margin-right:10px;cursor:pointer;height:42px" :src="picture"/>
          </el-col>
      </el-row>
      <el-row v-if="list.filed.length>0">
          <el-col :span="16" style="padding-left:30px" v-for="(files,iIndex) in list.filed" :key='iIndex'>
              <a :href="files.images">{{files.filedName}}</a>
          </el-col>
      </el-row>
      <el-row class="reply" v-if="list.replyContent!==null">
          <el-col :span="16" class="col">
              <div class="replyUsername" style="position: absolute;">
                <p class="admin">{{list.replyUsername}}(回复)</p>
                <p class="time">{{list.replyTime}}</p>
              </div>
              <div class="replyContent replyUsername">
                <p>{{list.replyContent}}</p>
              </div>
          </el-col>
      </el-row>
    </div>
  </div>
</div>
</template>
<style>
 .genre-box-question .el-step__line-inner{
   padding-left: 150px;
 }
  .genre-box-question .el-step__title{
    font-size: 12px;
    line-height: 1px; 
    display: inline-block;
    padding-top: 10px;
  }
  .genre-box-question .el-steps.is-horizontal{
    position: absolute;
    width: 30%;
    right: -70px;
    top: 25px;
  }
  .genre-box-question .el-step__line.is-horizontal{
    top: 12px;
    left: 23px;
  }
  .genre-box-question .el-step__head{
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  .genre-box-question .el-step__icon{
    line-height: 20px;
  }
</style>
<style scoped lang="scss">
  .reply .col{
    margin-left:30px;
    border-top:1px solid #c6c6c6;
    margin-top: 10px;
    padding-top: 10px;
    min-height: 50px;
  }
  .replyContent {
    padding-left: 130px;
  }
  .replyUsername p{
    margin: 0;
  }
  .replyUsername .admin{
    color:#fea74f;
  }
  .replyUsername .time{
    font-size: 12px;
    color: #c6c6c6
  }
  .question-box{
    padding: 10px;
  }
  .genre-box-question .right-type{
    text-align: left;
  }
  .genre-box-question .right-type .one{
    color: #b1b1b1;
  }
  .genre-box-question .right-type .two{
    color: #7b7b7b;
    padding: 0px 5px
  }
  .genre-box-question{
    background: white;
    border: 1px solid #e7e7e7;
    height: auto;
    padding: 10px;
    margin-bottom: 10px;
  }
  .genre-box-question .content{
    display: inline-block;
    padding-left: 30px;
    width: 900px;
  }
  .genre-box-question .number{
    background: #20a1ff;
    color: white;
    font-size: 12px;
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    position: absolute;
  }
  .search-row{
    background: white;
    border-bottom: 1px solid #e7e7e7;
    padding: 10px 0px;
    padding-top: 15px;
  }
  .nav-list-box{
    background: #f5f5f5
  }
  .search-input {
    float: right;
    width: 30%;
  }
  .image_hide {
    width:185px;
    height:65px;
    /* border:1px solid red; */
    margin: 0 auto;
    margin-top:10px;
  }
  .image_hide img {
    width:185px;
    height:65px;
  }
 .collfont {
    color: white;
    position: absolute;
    left: 0px;
    background: red;
    height: 20px;
    width: 20px;
    line-height: 20px;
    top: 0px;
    font-size: 12px;
}

</style>
<script>
  import mixin from '../../utils/mixin'
  import { QGET_APPLICATION_LIST, GET_FEEDBACK_LIST, Q_LIKE } from '../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    data() {
      return {
        questionLoading: false,
        bigImg: '',
        imageDialog: false,
        active: 0,
        justMe: false,
        questionList: [],
        moudelList: [],
        pictureList: [],
        fileList: [],
        arrList: [],
        selectList: [{
          value: '0',
          label: '功能需求'
        }, {
          value: '1',
          label: '数据需求'
        }, {
          value: '2',
          label: 'BUG'
        }, {
          value: '3',
          label: '其它'
        }],
        selectjd: [{
          value: '0',
          label: '待开展'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '2',
          label: '已解决'
        }],
        editForm: {
          module: '',
          questionType: '',
          questionContent: '',
          currentProgress: '',
          creatUsername: '',
          flag: ''
        },
        currentDetail: '',
        navKeyword: '', // 搜索关键字
        offClick: false,
        pageSize: 1000
      }
    },
    mounted() {
      // this.dispatch(QGET_APPLICATION_LIST).then(() => {
      //   this.moudelList = this.question.qgetApplicationList;
      //   console.log(this.question.qgetApplicationList, 'questionquestionquestionquestionquestion');
      // })
    },
    methods: {
      closeEvent() {
        this.imageDialog = false;
      },
      // 大图
      showBigImg(pic) {
        this.imageDialog = true;
        this.bigImg = pic;
      },
      // 点赞
      like(id) {
        this.dispatch(Q_LIKE, {id: id}).then(() => {
          var data = '';
          if(this.question.qLike === '请勿重复点赞！') {
            data = 'error'
          }else {
            data = 'success'
          }
          this.$message({
            type: data,
            message: this.question.qLike
          })
          this.getQuestionList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '点赞失败'
          });
        })
      },
      questionChange(val) {
        // this.editForm.questionType = val;
      },
      moudelChange(val) {
      },
      serch() {
        this.getQuestionList();
      },
      // arrChoose(id, type, name) {
      //   var ipList = location.href.split('/');
      //   var myIp = ipList[2]
      //   if(type === '0' && name === 'pic') {
      //     return myIp + '/jwy/DownFile.ashx?id=' + id;
      //   }else {
      //     return myIp + '/jwy/DownFile.ashx?id=' + id;
      //   }
      // },
      selectPicAndFiled(arr, type) {
        this.pictureList = [];
        this.fileList = [];
        var ipList = location.href.split('/');
        var myIp = ipList[2]
        for(var i = 0; i < arr.length; i++) {
          if(arr[i].fileType === '0') {
            this.pictureList.push('http://' + myIp + '/jwy/DownFile.ashx?id=' + arr[i].attachmentId);
          }
        }
        return this.pictureList
      },
      selectPicAndFiled1(arr, type) {
        this.pictureList = [];
        this.fileList = [];
        var objFileds = {};
        var ipList = location.href.split('/');
        var myIp = ipList[2]
        for(var i = 0; i < arr.length; i++) {
          if(arr[i].fileType === '1') {
            objFileds = {
              images: 'http://' + myIp + '/jwy/DownFile.ashx?id=' + arr[i].attachmentId,
              filedName: arr[i].fileName
            }
            this.fileList.push(objFileds);
          }
        }
        return this.fileList
      },
      getQuestionList() {
        this.questionLoading = true;
        if(this.justMe === true) {
          this.editForm.flag = '1';
        }else {
          this.editForm.flag = '';
        }
        this.dispatch(GET_FEEDBACK_LIST, this.editForm).then(() => {
          this.questionLoading = false;
          this.questionList = this.question.getFeedbackList.map(d => {
            return {
              creatUsername: d.creatUsername,
              createTime: d.createTime,
              createUserid: d.createUserid,
              currentProgress: d.currentProgress,
              deptId: d.deptId,
              deptName: d.deptName,
              fileNames: d.fileNames,
              flag: d.flag,
              id: d.id,
              likeCount: d.likeCount,
              module: d.module,
              questionContent: d.questionContent,
              questionType: d.questionType,
              replyContent: d.replyContent,
              replyUsername: d.replyUsername,
              replyTime: d.replyTime,
              replyUserid: d.replyUserid,
              attachmentIds: d.attachmentIds,
              attachment: d.attachment,
              pic: this.selectPicAndFiled(d.attachment, 'pic'),
              filed: this.selectPicAndFiled1(d.attachment, 'filed')
            }
          })
          console.log(this.questionList, 'questionquestionquestionquestionquestion');
        })
      }
    },
    created() {
      this.getQuestionList();
      this.dispatch(QGET_APPLICATION_LIST).then(() => {
        this.moudelList = this.question.qgetApplicationList;
      })
    },
    computed: {
      ...mapState(['question'])
    }
  }

</script>
