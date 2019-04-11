<template>
<!--列表-->
<div>
  <!--序号、布控任务编号、姓名、身份证号、布控范围、布控开始时间、布控结束时间、是否通报发现地、-->
  <!--布控状态（续控、布控中）、登记时间、布控结果次数、操作（续控、撤控、删除）-->
  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="baseInfo">
    <!--<el-table-column type="selection" width="55"></el-table-column>-->
    <el-table-column type="index" label="序号" width="80"></el-table-column>
    <el-table-column prop="number" label="布控任务编号" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名">
    </el-table-column>
    <el-table-column prop="key" label="关键词">
    </el-table-column>
    <el-table-column prop="idCard" label="身份证号" width="180">
    </el-table-column>
    <el-table-column prop="area" label="布控范围" width="150">
    </el-table-column>
    <el-table-column prop="starTime" label="布控开始时间" width="150">
    </el-table-column>
    <el-table-column prop="endTime" label="布控结束时间" width="100"></el-table-column>
    <el-table-column prop="place" label="是否通报发现地" width="100"></el-table-column>
    <el-table-column prop="state" label="布控状态" width="100"></el-table-column>
    <el-table-column prop="time" label="登记时间" width="90"></el-table-column>
    <el-table-column prop="num" width="120" label="布控结果次数">
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)" icon="icon iconfont icon-lock">续控</el-button>
          <el-button type="primary" size="mini" @click="edit(scope.row)" icon="icon iconfont icon-undo">撤控</el-button>
          <el-button type="danger" size="mini" @click="handleRemove(scope.row)" icon="icon iconfont icon-trash">删除</el-button>
        </template>
    </el-table-column>
  </el-table>
  <!--<div class="app-toolbar tool-pagination">-->
  <!--<el-row>-->
  <!--<el-col :span="4">-->
  <!--&lt;!&ndash;<el-button @click="handleMultiRemove()">批量删除</el-button>&ndash;&gt;-->
  <!--</el-col>-->
  <!--<el-col :span="20">-->
  <!--<pagination :count="50" :pagenav="{limit: 10,currentpage: 1}"-->
  <!--@update:pagenav="handlePageChange"></pagination>-->
  <!--</el-col>-->
  <!--<el-col :span="0"></el-col>-->
  <!--</el-row>-->
  <!--</div>-->
</div>
</template>
<style lang="scss" scoped>
Error: Source sample is missing.
</style>
<script>
import mixin from '../../../utils/mixin'
import pagination from '../../../widgets/pagination/pagination'
export default {
  mixins: [mixin],
  components: {
    pagination
  },
  data() {
    return {
      baseInfo: []
    }
  },
  props: [],
  computed: {},
  methods: {
    handlePageChange() {
      console.log(11);
    }
  },
  created() {
    for (var i = 0; i < 10; i++) {
      this.baseInfo.push({
        number: 'qwer134234435235435',
        name: '李四',
        key: '关键词',
        idCard: '44092355554445585',
        area: '怀化',
        place: '怀化长沙县',
        callType: '主叫',
        starTime: '2017-07-21',
        endTime: '2017-08-21',
        state: '撤控',
        time: '2017-08-28',
        num: '10'
      })
    }
  },
  mounted() {}
}
</script>
