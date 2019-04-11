<template>
  <div style="padding: 30px">
    <el-button @click="handleAdd">增加</el-button>
    <el-form :model="formData">
      <el-table :data="formData.tableData" class="app-table">
        <el-table-column label="标题" prop="title">
          <template scope="scope">
            <el-form-item style="margin-bottom: 0" :prop="`tableData.${scope.$index}.title`"
                          :rules="{required:true,message:'年龄不能为空',trigger:'blur'}">
              <el-input v-model="scope.row.title"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template scope="scope">
            <el-button @click="handleRemove(scope.$index)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<style scoped>
</style>
<script>
  export default {
    data() {
      return {
        formData: {
          tableData: [{
            title: '324234234'
          }]
        }
      }
    },
    methods: {
      handleAdd() {
        this.formData.tableData.push({
          title: ''
        })
      },
      handleRemove(index) {
        this.formData.tableData.splice(index, 1)
      }
    }
  }
</script>
