<template>
  <!--奖罚情况-->
  <div class="bmhx_box">
    <card-header title="奖罚情况"></card-header>
    <!--大模块内容-->
    <div class="bmhx_box_body">
      <div class="bmhx_content bottom_line">

        <el-row :gutter="15">
          <el-col :span="24">
            <span class="divcrider">1</span>
            <h4 class="jftitle">{{form.Title || ""}}</h4>
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <span class="subtext">时间：</span>{{form.JcDate| dateFormat}}
          </el-col>
          <el-col :span="24">
            <span class="subtext">单位名称：</span>{{form.Orangs || ""}}
          </el-col>
        </el-row>
        <el-row :gutter="15">
          <el-col :span="24">
            <span class="subtext">奖励说明：</span>{{form.Content || ""}}
          </el-col>
        </el-row>

      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
  .jftitle {
    font-size: 16px;
    display: inline-block;
    font-weight: normal;
  }
</style>


<script>
  import cardHeader from './card-header.vue'
  import {mapState} from 'vuex'
  import '../../../../utils/dateFormat'
  export default {
    data() {
      return {
        form: {}
      }
    },
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['talentPool']),
      themodel() {
        return this.talentPool.Model || {}
      }
    },
    created() {
      console.log(this.talentPool.Model)
      this.form = {
        Title: this.talentPool.Model.SubJcqkList[0] ? this.talentPool.Model.SubJcqkList[0].Title : '',
        JcData: this.talentPool.Model.SubJcqkList[0] ? this.talentPool.Model.SubJcqkList[0].JcDate : '',
        Orangs: this.talentPool.Model.SubJcqkList[0] ? this.talentPool.Model.SubJcqkList[0].Orangs : '',
        Content: this.talentPool.Model.SubJcqkList[0] ? this.talentPool.Model.SubJcqkList[0].Content : ''
      }
    }
  }
</script>
