<template>
  <!--布控管理--->
  <div class="comm">
    <!-- 搜索条件 -->
    <div class="app-toolbar">
      <transition enter-active-class="animated slideInUp">
        <el-form :model="queryForm" :inline="true" label-position="right" label-width="105px">
          <el-form-item label="布控状态">
            <el-radio-group v-model="queryForm.state">
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">审批不同意</el-radio>
              <el-radio :label="3">布控中</el-radio>
              <el-radio :label="4">呈请</el-radio>
              <el-radio :label="5">撤控</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="布控任务编号">
            <el-input v-model="queryForm.number" placeholder="请输入布控任务编号"></el-input>
          </el-form-item>
          <el-form-item label="布控时间">
            <el-date-picker type="daterange" v-model="timeSlot" :editable="false" @change="dateRange()"
                            format="yyyy-MM-dd" placeholder="请选择时间区间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryForm.name" placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" @click.prevent="submit">查询</el-button>
          </el-form-item>
          <div class="app-search__buttons" style="margin-top: 10px">
            <el-button type="primary" @click="add">新增布控</el-button>
          </div>
        </el-form>
      </transition>
    </div>
    <!-- 查询结果 -->
    <div class="app-content-box" v-if="resBox===true">
      <list></list>
    </div>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
  import list from './keyList.vue'
  import mixin from '../../../utils/mixin'
  import dateFormat from '../../../utils/dateFormat'
  export default {
    mixins: [mixin],
    components: {
      list
    },
    data() {
      return {
        resBox: false,
        detailBox: false,
        timeSlot: '',
        queryForm: {
          state: 1,
          number: '',
          name: '',
          identification: ''
        }
      }
    },
    props: [],
    computed: {},
    methods: {
      submit() {
        this.resBox = true
      },
      dateRange() {
        this.BeginDate = this.timeSlot === '' ? this.timeSlot[0] : dateFormat(new Date(this.timeSlot[0]), 'yyyy-MM-dd');
        this.EndDate = this.timeSlot === '' ? this.timeSlot[1] : dateFormat(new Date(this.timeSlot[1]), 'yyyy-MM-dd');
      }
    },
    created() {
      this.active = this.$route.path
    },
    mounted() {
    }
  }
</script>
