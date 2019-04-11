<!-- 涉案物品 -->
<template>
<div class="item-box">
  <!-- 标题 -->
  <card-header title="涉案物品" :tool="checkUserRuleCase('ajgl/article/save',caseId,true,cjrId)" :add="true" @call:add="add"></card-header>

  <el-table @cell-mouse-enter="cellMouseEnter" :data="list" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="类型" prop="caseTypeText"></el-table-column>
    <el-table-column label="数量" prop="sl"></el-table-column>
    <el-table-column label="描述" prop="desc"></el-table-column>
    <el-table-column label="说明" prop="remark"></el-table-column>
    <el-table-column label="特征" prop="sign"></el-table-column>
    <el-table-column label="操作" width="80" align="center">
      <template scope="scope">
        <el-button v-if="checkUserRuleCase('ajgl/article/update',caseId,true,cjrId)" type="text" @click="edit(scope.row)" icon="icon iconfont icon-brush" title="编辑"></el-button>
        <el-button v-if="checkUserRuleCase('ajgl/article/delete',caseId,true,cjrId)" type="text" @click="remove(scope.row.id,scope)" icon="icon iconfont icon-trash" title="删除"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <dialog-edit-item v-loading="loading" element-loading-text="正在提交..." :dialog="editItemDialog" :data="detail" @form:submit="submit" @close="editItemDialog=false"></dialog-edit-item>
</div>
</template>

<style scoped lang="scss">
.item-box {
    background: #fff;
    margin-top: 10px;
    min-height: 450px;
}
</style>

<script>
import { mapState } from 'vuex'
import mixin from '../../../utils/mixin'
import {
  FETCH_INVOLVED_ITEM_LIST,
  ADD_INVOLVED_ITEM,
  GET_INVOLVED_ITEM_INFO,
  UPDATE_INVOLVED_ITEM,
  REMOVE_INVOLVED_ITEM
} from '../../../store/types'

import cardHeader from './card-header.vue'
import dialogEditItem from '../involve/dialog-edit-item'
export default {
  mixins: [mixin],
  components: {
    cardHeader,
    'dialog-edit-item': dialogEditItem
  },
  data() {
    return {
      loading: false,
      editItemDialog: false,
      detail: null,
      list: [],
      caseId: '',
      cjrId: '',
      pageInfo: { // 页面分页信息相关配置
        count: 10,
        limit: 100,
        currentpage: 1
      }
    }
  },
  computed: {
    ...mapState(['involvedItem'])
  },
  methods: {
    queryList() {
      // 查询列表
      if(this.checkUserRuleCase('ajgl/article/list', this.caseId)) {
        this.dispatch(FETCH_INVOLVED_ITEM_LIST, {
          data: {
            ajid: this.caseId,
            PageIndex: this.pageInfo.currentpage,
            PageSize: this.pageInfo.limit
          }
        })
      }
    },
    getQueryInfo(carId, callback = () => {}) {
      // 查询单条信息
      this.dispatch(GET_INVOLVED_ITEM_INFO, {
        data: {
          id: carId
        }
      }).then(() => {
        callback()
      })
    },
    edit(item) {
      let carId = item.id
      this.getQueryInfo(carId, () => {
        let getCarInfo = this.involvedItem.Model
        this.isDetail = false
        this.detail = {
          id: getCarInfo['id'],
          name: getCarInfo['wpmc'],
          desc: getCarInfo['wpms'],
          sl: getCarInfo['sl'],
          remark: getCarInfo['sasm'],
          no: getCarInfo['wpbh'],
          sign: getCarInfo['wptz'],
          itemType: getCarInfo['wplx'],
          caseType: getCarInfo['salx'],
          caseTypeText: getCarInfo['salxmc']
        }
        this.editItemDialog = true
      })
    },
    add(val) {
      this.detail = null
      this.editItemDialog = true
    },
    remove(rowId, row) {
      this.$confirm('确认删除该物品?', '温馨提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dispatch(REMOVE_INVOLVED_ITEM, {
          data: {
            ids: rowId
          }
        }, row.$index).then(() => {
          this.$message({
            message: '删除涉案物品成功！',
            type: 'success'
          })
        })
      }).catch(() => {});
    },
    submit(form) {
      this.loading = true
      let submitType = ADD_INVOLVED_ITEM
      let dataDetail = {
        wpmc: form.name, // 物品名称
        wpms: form.desc, // 物品描述
        sl: form.sl, // 物品数量
        wplx: form.itemType, // 物品类型
        sasm: form.remark, // 涉案说明
        wptz: form.sign, // 物品特征
        salx: form.caseType // 涉案类型
      }
      if(form.id !== '') { // 判断表单id是否为空，非空可判断为更新提交
        submitType = UPDATE_INVOLVED_ITEM
        dataDetail.id = form.id
      } else {
        dataDetail.ajid = this.$route.query.a // 新增数据赋值当前案件id
      }
      this.dispatch(submitType, {
        data: dataDetail
      }).then(() => {
        this.loading = false
        this.editItemDialog = false
        this.queryList()
      })
    }
  },
  mounted() {},
  watch: {
    'involvedItem.PageData' (val) {
      this.list = val.map(row => {
        return {
          id: row.id,
          name: row.wpmc,
          caseType: row.salx,
          caseTypeText: row.salxmc,
          desc: row.wpms,
          sl: row.sl,
          remark: row.sasm,
          sign: row.wptz
        }
      })
      this.pageInfo.count = this.involvedItem.DataCount
    }
  },
  created() {
    this.caseId = this.$route.query.a // 初始化获取案件id
    this.cjrId = this.$route.query.b // 初始化获取案件创建人id
    this.queryList()
  }
}
</script>
