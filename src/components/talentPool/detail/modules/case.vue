<template>

  <!--具体案件-->
  <div class="bmhx_box">
    <card-header title="具体案件"></card-header>
    <div class="bmhx_box_body">

      <div class="bmhx_content">
        <el-table
          :data="tableData"
        >
          <el-table-column
            label="序号"
            type="index"
          >
          </el-table-column>


          <el-table-column
            label="案件名称"
            prop="casenames"
          >
          </el-table-column>

          <el-table-column
            label="涉案领域"
            prop="field"
          >
          </el-table-column>

          <el-table-column
            label="犯罪嫌疑人姓名"
            prop="peoplename"
          >
          </el-table-column>

          <el-table-column
            label="单位"
            prop="company"
          >
          </el-table-column>
          <el-table-column
            label="职务"
            prop="job"
          >
          </el-table-column>
          <el-table-column
            label="职级"
            prop="level"
          >
          </el-table-column>
        </el-table>
      </div>
      <!-- 小模块内容-->

    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>


<script>
  import cardHeader from './card-header.vue'
  export default {
    components: {
      cardHeader
    },
    data() {
      return {
        tableData: [
          {
            casenames: '某某案件',
            field: '通告',
            peoplename: '李四',
            company: 'XX单位',
            job: '警察',
            level: '警员'
          }, {
            casenames: '某某案件',
            field: '通告',
            peoplename: '李四',
            company: 'XX单位',
            job: '警察',
            level: '警员'
          }
        ]
      }
    }
  }
</script>
