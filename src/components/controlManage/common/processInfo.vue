<template>
  <div class="institution">
      <div class="institution__title">
        <span>{{'审批流程明细('+data.cjrxm+' 新提交关键字布控申请：【'+ nameComputed +'】。请审批)'}}</span>
      </div>
      <div class="table__div" v-for="(items, idx) in datas" :key="idx">
        <p>{{items.trajectory.SQZT}}</p>
        <p v-if="items.sqlx === '3'">撤控原因：{{items.sqly}}</p>
        <p v-if="items.sqlx === '2'">续控原因：{{items.sqly}}</p>
        <p v-if="items.sqlx === '2'">续控时间：{{items.jssj}}</p>
        <el-table :data="items.trajectory.lcgj" border>
          <el-table-column align="center" v-for="(item , index) in columnTab" :prop="item.prop" :label="item.label" :key="index"></el-table-column>
        </el-table>
      </div>
  </div>
</template>
<style lang="scss" scoped>
  .institution {
    &__title {
      height: 30px;
      width: 100%;
      background-color: #85c2e7;
      line-height: 30px;
      >span {
        margin-left: 10px;
        color: white;
      }
    }
    .table__div {
      padding: 10px;
      border: 1px solid #ccc;
      border-top: none;
    }
  }

</style>
<script>
  export default {
    data() {
      return {
        tableData: [],
        datas: '',
        columnTab: [
          { label: '流程步骤', prop: 'CJDMC' },
          { label: '处理人', prop: 'CLRMC' },
          { label: '处理时间', prop: 'CLSJ' },
          { label: '处理状态', prop: 'CLZT' },
          { label: '意见', prop: 'CLYJ' }
        ]
      }
    },
    computed: {
      nameComputed() {
        let arr = []
        if (this.data) {
          this.data.properValues.map(item => {
            if (item.tzlx === '1') {
              arr.unshift(item.tzxx)
            } else if (item.tzlx === '2') {
              arr.push(item.tzxx)
            }
          })
          return arr.join('-')
        }
      }
    },
    props: ['flag', 'rules', 'data'],
    watch: {
      'data.id': {
        handler: function(newVal, oldVal) {
          this.datas = this.data.flowPaths
        },
        deep: true
      }
    },
    methods: {},
    mounted() {
      this.datas = this.data.flowPaths;
    }
  }

</script>
