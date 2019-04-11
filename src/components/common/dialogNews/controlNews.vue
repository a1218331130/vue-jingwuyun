<template>
  <el-dialog class="center-list" :visible.sync="dialog" v-draggable="dialogDraggableOptions" @open="initDialog" :modal="false" :modal-append-to-body="true" size="large" :title="keys === '41'?'新增审批':keys === '42'?'续控审批':'撤控审批'" :before-close="closeEvent">
    <div v-if="detailData&&detailData.bklx ==='1'">
      <institution  :data="detailData" :status="3"></institution>
  <controlObj  :data="detailData" :status="3" style="margin-top:30px;"></controlObj>
  <controlInfo :data="detailData" :status="3" style="margin-top:30px;"></controlInfo>
  <processInfo :data="detailData" style="margin-top:30px;"></processInfo>
  <sign v-if="(keys === '41'||keys === '42'||keys === '43')&&(detailData.bkzt === '3'||detailData.bkzt === '4'||detailData.bkzt === '5')" :lcid="detailData.lcid" ref='sign' @close='closeEvent'></sign>
  </div>
    <div  v-else-if="detailData&&detailData.bklx ==='2'">
      <institution :data="detailData" :status="3"></institution>
      <controlObjCar :data="detailData" :status="3" style="margin-top:30px;"></controlObjCar>
      <controlInfo :data="detailData" :status="3" style="margin-top:30px;"></controlInfo>
      <processInfo :data="detailData" style="margin-top:30px;"></processInfo>
      <sign v-if="(keys === '41'||keys === '42'||keys === '43')&&(detailData.bkzt === '3'||detailData.bkzt === '4'||detailData.bkzt === '5')" :lcid="detailData.lcid" ref='sign' @close='closeEvent'></sign>
    </div>
    <div class="tipWord" v-else>
      暂无数据
    </div>
  </el-dialog>
  <!-- 41新增审批 42续控审批 43撤控审批 -->
</template>
<script>
  import { GET_CAR_INFO_CONTROL } from '../../../store/types'
  import mixin from '../../../utils/mixin'
  import institution from '../../controlManage/common/institution.vue'
  import controlObj from '../../controlManage/common/controlObj.vue'
  import controlInfo from '../../controlManage/common/controlInfo.vue'
  import processInfo from '../../controlManage/common/processInfo.vue'
  import controlState from '../../controlManage/common/controlState.vue'
  import controlObjCar from '../../controlManage/common/controlObjCar.vue'
  import sign from '../../controlManage/detail/sign.vue'
  import { mapState } from 'vuex'
  export default {
    mixins: [mixin],
    components: {
      institution,
      controlObj,
      controlInfo,
      processInfo,
      controlState,
      sign,
      controlObjCar
    },
    data() {
      return {
        detailData: null
      }
    },
    props: ['id', 'dialog', 'keys'],
    computed: {
      ...mapState(['controlManage', 'surveillance'])
    },
    methods: {
      closeEvent() {
        this.$emit('call:close')
      },
      initDialog() {
        this.dispatch(GET_CAR_INFO_CONTROL, { id: this.id }).then(() => {
          this.detailData = this.surveillance.getCarInfoControl
        })
      }
    },
    mounted() {}
  }

</script>
