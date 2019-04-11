<!-- 车曾挂牌 -->
<template>
<div class="car-history-box">
  <!-- 标题 -->
  <card-header :title="'车曾挂牌('+tableData.length+'条结果)'" :tableData="tableData" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <div class="car-history-content" v-show="expandMark">
    <el-row :gutter="15" class="contact-box" v-if="tableData.length > 0" v-loading="dossierLoading">
      <el-col :span="4" v-for="item in tableData" :key="item.id">
        <div class="carhistory-list">
          <div class="carlist-header">{{item.jdchphm}}</div>
          <div class="carlist-content">{{item.xm}}</div>
          <div class="carlist-foot">{{item.sfzhm}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="contact-box" v-loading="dossierLoading" v-else>
      <el-col :span="24">
        <div class="empty"></div>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .car-history-box .contact-box {
    margin-top: 13px;
    min-height: 113px;
  }

  .carhistory-list {
    text-align: center;
    border: 1px solid #ccc;
    .carlist-header {
      padding: 10px 0;
      font-weight: bold;
      font-size: 18px;
      background: #457dbc;
      color: #fff;
    }
    .carlist-content {
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
    }
    .carlist-foot {
      padding: 3px 0;
      color: #69b4fd;
    }
  }

</style>


<script>
  import dossierMixin from '../../dossierMixin'
  import cardHeader from './card-header.vue'
  import mixin from '../../../../utils/mixin'
  import { GET_CCGP_LIST } from '../../../../store/types'
  import { mapState } from 'vuex'
  import bus from '../../../../utils/bus'
  export default {
    mixins: [mixin, dossierMixin],
    components: {
      cardHeader
    },
    data() {
      return {
        dossierLoading: false,
        tableData: []
      }
    },
    props: ['carKey', 'clxh', 'jdcfdjddjh'],
    methods: {
      loadData() {
        this.dossierLoading = true
        if (this.checkRule('jwy/vehicleFile/getCCGPList', true) === true) {
          this.dispatch(GET_CCGP_LIST, { clxh: this.clxh, jdcfdjddjh: this.jdcfdjddjh }).then(() => {
            this.tableData = this.dossier.getCCGPList
            bus.$emit('allCarLoading')
            this.dossierLoading = false
          })
        } else {
          bus.$emit('allCarLoading')
          this.dossierLoading = false
        }
      }
    },
    created() {
      this.loadData()
    },
    computed: {
      ...mapState(['dossier'])
    },
    watch: {
      tableData(val) {
        bus.$emit('update:dossierSubTitleNumber', { 'title': '车曾挂牌', 'number': val.length })
      }
    }
  }

</script>
