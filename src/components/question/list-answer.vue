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
   <!-- :key='iIndex' v-for="(list,iIndex) in list" -->
 <el-tabs v-model="listType" @tab-click="changeList">
  <el-tab-pane v-for="tab in tabs" :name="tab.id.toString()" :key="tab.id" :label="tab.label">
  <div class="question-box" v-loading="questionLoading">
    <div class="genre-box-question" v-for="(list,iIndex) in questionList">
      <el-row style="padding-bottom: 10px;">
          <el-col :span="16">
            <div>
              <span class="number">{{iIndex + 1}}</span>
              <span class="content">[{{list.module}}] {{list.questionContent}}
                <!-- <span style="cursor:pointer" @click="like(list.id)">
                  <img class="xcenter-slogan" src="/static/img/question/like.png" />
                  <i style="color:#20a1ff;position: absolute;top: -5px;">{{list.likeCount}}</i>
                </span> -->
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
     <el-row class="answer" v-if="listType!=='2'">
          <el-col :span="16" style="padding-left:30px;margin-top:5px">
              <a style="cursor:pointer" @click="openReply(list)">我来回复</a>
              <i class="el-icon-arrow-up" v-if="!list.isAnswerMe"></i>
              <i class="el-icon-arrow-down" v-if="list.isAnswerMe"></i>
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
      <el-row class="reply" v-if="list.isAnswerMe">
          <el-col :span="16" class="col">
            <el-form ref="questionSearch" :model="questionSearch" label-width="70px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="当前进度">
                    <el-select v-model="questionSearch.currentProgress" @change="moudelChange">
                      <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
               <el-col :span="24"  v-if="listType!=='1'">
                  <el-form-item label="回复内容">
                    <el-input v-model="questionSearch.replyContent"  placeholder="请输入内容" required="true" type="textarea" :rows="3"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="">
                   <el-button type="primary" @click="reply(list)">提交回复</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
      </el-row>
    </div>
  </div>
  </el-tab-pane>
</el-tabs>
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
  .answer i{
    color: #20A0FF;
    cursor: pointer;
  }
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
  import { QGET_APPLICATION_LIST, GET_FEEDBACK_LIST, Q_REPLY, Q_JUDGMENT } from '../../store/types'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    data() {
      return {
        isAnswer: false,
        listType: '0',
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
        questionSearch: {
          id: '',
          currentProgress: '0',
          replyContent: ''
        },
        typeList: [{
          value: '0',
          label: '待开展'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '2',
          label: '已解决'
        }],
        tabs: [{
          id: 0,
          label: '待开展',
          sourceLabel: '待开展'
        }, {
          id: 1,
          label: '进行中',
          sourceLabel: '进行中'
        }, {
          id: 2,
          label: '已解决',
          sourceLabel: '已解决'
        }],
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
        editForm: {
          module: '',
          questionType: '',
          questionContent: '',
          creatUsername: '',
          currentProgress: '0',
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
      openReply(k) {
        this.dispatch(Q_JUDGMENT, {id: k.id}).then(() => {
          if(this.question.qJudgment === 1) {
            this.$message({
              type: 'error',
              message: '已经有回复内容'
            })
          }else{
            k.isAnswerMe = !k.isAnswerMe;
          }
        })
      },
      // 回复
      reply(lists) {
        this.questionSearch.id = lists.id;
        this.dispatch(Q_REPLY, this.questionSearch).then(() => {
          this.$message({
            type: 'success',
            message: '回复成功'
          })
          lists.isAnswerMe = false;
          this.getQuestionList();
        })
        // if(this.questionSearch.replyContent === '' || this.questionSearch.replyContent === null) {
        //   this.$message({
        //     type: 'error',
        //     message: '请输入回复内容'
        //   })
        //   return;
        // }else {
        //   this.dispatch(Q_REPLY, this.questionSearch).then(() => {
        //     this.$message({
        //       type: 'success',
        //       message: '回复成功'
        //     })
        //     lists.isAnswerMe = false;
        //     this.getQuestionList();
        //   })
        // }
      },
      changeList(val) {
        this.editForm.currentProgress = val.name;
        if(val.name === '0') {
          this.typeList = [{
            value: '0',
            label: '待开展'
          }, {
            value: '1',
            label: '进行中'
          }, {
            value: '2',
            label: '已解决'
          }]
        }else {
          this.typeList = [{
            value: '1',
            label: '进行中'
          }, {
            value: '2',
            label: '已解决'
          }];
          this.questionSearch.currentProgress = '1'
        }
        this.getQuestionList();
        // alert(val.name);
      },
      closeEvent() {
        this.imageDialog = false;
      },
      // 大图
      showBigImg(pic) {
        this.imageDialog = true;
        this.bigImg = pic;
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
        this.dispatch(GET_FEEDBACK_LIST, this.editForm).then(() => {
          this.questionLoading = false;
          this.questionList = this.question.getFeedbackList.map(d => {
            return {
              isAnswerMe: false,
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
