<!-- 人员布控预警 -->
<template>
<div>
  <div class="app-toolbar clearfix">
    <el-form :inline="true" class="app-search__form">
      <el-form-item label="预警类型">
        <el-select v-model="warnType" placeholder="请选择预警类型">
          <el-option label="预警类型1" value="0"></el-option>
          <el-option label="预警类型2" value="1"></el-option>
          <el-option label="预警类型3" value="2"></el-option>
          <el-option label="预警类型4" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预警等级">
        <el-select v-model="warnType2" placeholder="请选择预警类型">
          <el-option label="预警等级1" value="0"></el-option>
          <el-option label="预警等级2" value="1"></el-option>
          <el-option label="预警等级3" value="2"></el-option>
          <el-option label="预警等级4" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管辖单位">
        <el-input placeholder="支持模糊查询" v-model="dataList.name"></el-input>
      </el-form-item>
      <el-form-item label="预警时间">
        <el-date-picker type="datetimerange" v-model="warnType3" :editable="false" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择预警时间区间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click.prevent="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="app-content-box">
    <!-- 列表 -->
    <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" border stripe :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="idCard" label="身份证号" width="200">
      </el-table-column>
      <el-table-column prop="add" class-name="text-left" label="户籍地址">
      </el-table-column>
      <el-table-column prop="ms" label="预警描述"></el-table-column>
      <el-table-column label="操作" width="100">
        <template scope="scope">
              <el-button type="primary" size="mini" @click="handleDetails(scope.row)" icon="icon iconfont icon-xiangqing">查看详情</el-button>
          </template>
</el-table-column>
</el-table>
</div>
<div class="app-toolbar tool-pagination">
  <el-row>
    <el-col :span="4">
      <el-button @click="handleMultiRemove()">批量删除</el-button>
    </el-col>
    <el-col :span="20">
      <pagination :count="1" :pagenav="{limit: 10,currentpage: 1}"></pagination>
    </el-col>
    <el-col :span="0"></el-col>
  </el-row>
</div>

<!-- 详情弹窗 -->
<dialog-handle :dialog="detailsDialog" @close="detailsDialog=false" :title="title" :data="rowData"></dialog-handle>
</div>
</template>

<style scoped>


</style>

<script>
  import pagination from '../../../widgets/pagination/pagination.vue'
  import dialogHandle from './people/dialog-handle.vue'
  export default {
    components: {
      pagination,
      dialogHandle
    },
    data() {
      return {
        dataList: [],
        warnType: '',
        warnType2: '',
        warnType3: '',
        selectList: [],
        detailsDialog: false,
        title: '操作',
        rowData: ''
      }
    },
    methods: {
      handlePageChange() {},
      handleSelectionChange(val) {
        this.selectList = val
      },
      handleMultiRemove() {
        console.log('批量删除', this.selectList)
      },
      handleDetails(row) {
        console.log(row)
        this.detailsDialog = true
        this.title = '详情'
        this.rowData = row
      }
    },
    created() {
      // 生成多条模拟数据
      for (let item = 0; item < 10; item++) {
        this.dataList.push({
          name: '阿布达思吉' + item,
          idCard: '420012197703064561',
          warnType: 1,
          add: '湖南麻阳苗族自治县',
          ms: '姓名: 阿布达思吉证件号码: 420012197703064561出生日期: 1989-08-16 00:00:00常住地址: 广东省佛冈县石角镇黄花村委坑口村38号所属城市: 广东省深圳市性别: 男酒店名称: 无名252入住房号: 213入住时间: 2013-07-13 23:10:00离开时间: 2013-07-16 10:26:00行政区划: 广东省清远市佛冈县证件类型: 外交护照民族: 汉族'
        })
      }
    }
  }

</script>
