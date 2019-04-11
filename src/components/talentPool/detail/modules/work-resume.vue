<template>
  <div class="bmhx_box">
    <card-header title="基本情况"></card-header>
    <!--大模块内容-->

    <div class="bmhx_box_body">
      <!-- 小模块内容-->
      <div class="bmhx_content">

        <el-row :gutter="20" class="bottom_line" v-cloak>
          <el-col :span="1"><span class="divcrider">1</span></el-col>
          <el-col :span="5" v-cloak><span
            class="subtext">时间：</span>{{aimodel.BeginDate | dateFormat}}
          </el-col>
          <el-col :span="5"><span class="subtext">单位名称：</span>{{aimodel.Org || ""}}</el-col>
          <el-col :span="5"><span class="subtext">职务：</span>{{aimodel.Zw || ""}}</el-col>
        </el-row>
        <el-row :gutter="20" class="bottom_line">
          <el-col :span="1"><span class="divcrider">2</span></el-col>
          <el-col :span="5"><span class="subtext">时间：</span>2017/05/01</el-col>
          <el-col :span="5"><span class="subtext">单位名称：</span>怀化市警察局</el-col>
          <el-col :span="5"><span class="subtext">职务：</span>武警</el-col>
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
  import '../../../../utils/dateFormat'
  export default {
    components: {
      cardHeader
    },
    computed: {
      ...mapState(['talentPool']),
      themodel() {
        return this.talentPool.Model || {}
      },
      aimodel() {
        if (!this.talentPool.Model.SubGzjlList[0]) {
          return {}
        } else {
          return this.talentPool.Model.SubGzjlList[0]
        }
      }
    }
  }
</script>
