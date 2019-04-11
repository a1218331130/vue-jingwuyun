<template>
   <div>
    <el-button type="primary" @click="fileImportShow = true">导入文件</el-button>
    <file-import-dialog :dialog="fileImportShow" :title="'文件导入'" :caseInfo="null" @close="fileImportShow=false"></file-import-dialog>
    </div>
</template>
<style lang="scss" scoped>


</style>
<script>
  import fileImportDialog from '../../../widgets/import-dialog/import-file-dialog'
  export default {
    data() {
      return {
        fileImportShow: false
      }
    },
    components: {
      fileImportDialog
    }
  }

</script>
