<template>
  <div class="bmhx_box">
    <card-header title="学历情况"></card-header>
    <!--大模块内容-->
    <div class="bmhx_box_body">
      <!-- 小模块内容-->
      <div class="bmhx_content">
        <el-row :gutter="20" class="bottom_line">
          <el-col :span="1"><span class="divcrider">1</span></el-col>
          <el-col :span="5"><span class="subtext">时间：</span>{{form.EndDate | dateFormat}}
          </el-col>
          <el-col :span="5"><span class="subtext">学校名称：</span>{{form.School || ""}}</el-col>
          <el-col :span="5"><span class="subtext">学历：</span>{{form.Xl || ""}}</el-col>
          <el-col :span="5"><span class="subtext">专业：</span>{{form.Zy || ""}}</el-col>
        </el-row>

      </div>

      <!-- 小模块内容-->

    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>


<script>
  import cardHeader from './card-header.vue'
  import {mapState} from 'vuex'
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
      console.log('/*****************', this.talentPool.Model)
      this.form = {
        EndDate: this.talentPool.Model.SubXlList[0] ? this.talentPool.Model.SubXlList[0].EndDate : '',
        school: this.talentPool.Model.SubXlList[0] ? this.talentPool.Model.SubXlList[0].School : '',
        Xl: this.talentPool.Model.SubXlList[0] ? this.talentPool.Model.SubXlList[0].Xl : '',
        Zy: this.talentPool.Model.SubXlList[0] ? this.talentPool.Model.SubXlList[0].Zy : ''
      }
    }
  }
</script>
