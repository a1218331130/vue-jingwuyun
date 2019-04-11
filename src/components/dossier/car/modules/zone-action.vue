<!-- 主要活动区域 -->
<template>
<div>
  <!-- 标题 -->
  <card-header :title="'主要活动区域('+tags.length+'条结果)'" :tableData="tags" :expand="true" @on-update-expand="updateExpand"></card-header>
  <!-- 内容 -->
  <el-row :gutter="15" class="zone-box" v-loading="dossierLoading" v-show="expandMark">
    <el-col :span="24" v-if="tags.length > 0">
      <div>
        <el-tag color="#e4f0fa" v-for="item in tags" :key="item.addresstag">{{item.hdqy}}</el-tag>
      </div>

    </el-col>
    <el-col :span="24" class="zone-empty" v-else>
      <div class="empty"></div>
    </el-col>
  </el-row>
</div>
</template>

<style lang="scss" scoped>
.zone-box {
    margin-top: 13px;
    .zone-empty {
        height: 113px;
    }
    span {
        color: #333;
        padding: 0 30px;
        margin-right: 6px;
        line-height: 22px;
    }
}
</style>


<script>
import dossierMixin from '../../dossierMixin'
import cardHeader from './card-header.vue'
import mixin from '../../../../utils/mixin'
import { GET_AREA_LIST } from '../../../../store/types'
import { mapState } from 'vuex'
import bus from '../../../../utils/bus'
export default {
  mixins: [mixin, dossierMixin],
  components: {
    cardHeader
  },
  props: ['carKey'],
  data() {
    return {
      dossierLoading: true,
      tags: []
    }
  },
  methods: {
    loadData() {
      if(this.checkRule('jwy/vehicleFile/getAreaList', true) === true) {
        this.dispatch(GET_AREA_LIST, { cphm: this.carKey }).then(() => {
          this.dossier.getAreaList ? this.tags = this.dossier.getAreaList : this.tags = []
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
    tags(val) {
      bus.$emit('update:dossierSubTitleNumber', { 'title': '主要活动区域', 'number': val.length })
    }
  }
}
</script>
