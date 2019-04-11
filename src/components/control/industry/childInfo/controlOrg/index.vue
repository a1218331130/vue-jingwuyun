<template>
<div style="height:100%">
  <div>
    <h3 class="addh3">重点场所基本信息</h3>
  </div>
  <div>
    <el-row :gutter="5">
      <el-col :span="12">
        <el-form-item label="重点场所类型" prop="zdcslx" label-width="147px">
          <el-select :maxlength="50" v-model="value.zdcslx" disabled filterable placeholder="请选择" style="width: 100%">
            <el-option v-for="item in zdcslxArr['ZDCSBW']" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="监管场所名称" prop="csmc" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.csmc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="场所电话" prop="csdh" label-width="147px">
          <el-input :maxlength="50" :disabled="this.flag" v-model="value.csdh"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8" icon="icon iconfont icon-plus">
        <el-form-item label="经纬度" label-width="147px">
          <el-col :span="11" style="padding:0">
            <el-input v-model="value.csjd" :disabled="this.flag" :maxlength="50"></el-input>
          </el-col>
          <el-col :span="2">-</el-col>
          <el-col :span="11" style="padding:0">
            <el-input v-model="value.cdwd" :disabled="this.flag" :maxlength="50"></el-input>
          </el-col>
        </el-form-item>
      </el-col>
      <el-col :span="4" v-if="!this.flag">
        <el-button type="text" icon="icon iconfont icon-dingwei" @click="openMap"></el-button>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="监管场所地址" prop="csdz" label-width="147px">
          <el-input type="textarea" v-model="value.csdz" :disabled="this.flag" :maxlength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="bz" label-width="147px">
          <el-input type="textarea" v-model="value.bz" :disabled="this.flag" :maxlength="200"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="管控原因" prop="gkyy" label-width="147px">
          <el-input type="textarea" v-model="value.gkyy" :disabled="this.flag" :maxlength="200"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="8">
        <el-form-item label="登记人" prop="pcr" label-width="147px">
          <el-input :maxlength="50" v-model="value.pcr"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="登记时间" prop="pcsj" label-width="147px">
          <el-date-picker v-model="value.pcsj" type="datetime" placeholder="请选择时间" style="width:100%"></el-date-picker>
        </el-form-item>
      </el-col> -->
    </el-row>
  </div>
  <!-- 地图弹窗 -->
  <el-dialog :visible.sync="dialogMapvisible" size="full" :modal="dialogModal">
    <pgis ref="controlPgis" class="map-box__item" layer="PGIS_CS_FWCS_DH_PG_BG" mapStyle="height:100%;" :showSidebar="false" :showTools="false" @on-updata-grid="handleGrid"></pgis>
  </el-dialog>
</div>
</template>
<style>
  .addh3 {
    background: #eee;
    font-size: 14px;
    font-weight: normal;
    padding: 5px 0;
    margin: 0 -15px 15px;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    text-align: center;
  }

</style>
<script>
  import mixin from '../../../../../utils/mixin'
  import pgis from '../../../../../widgets/location-selector/control-map.vue'
  export default {
    mixins: [mixin],
    components: {
      pgis
    },
    data() {
      return {
        dictLists: [],
        newinfo: null,
        zdcslxArr: [],
        dialogMapvisible: false,
        dialogModal: false
      }
    },
    methods: {
      initDialog() {
        // this.editForm = clone(this.dataForm)
        if (this.dictLists.length <= 0) {
          this.queryDictType()
        }
      },
      queryDictType() {
        // 表单字典初始化
        this.getDict(['ZDCSBW', 'JQDJ', 'ZRRZW', 'CSLX', 'SYGN', 'JZYT']).then(res => {
          this.zdcslxArr = res
        })
      },
      handleGrid(data) {
        if (data) {
          this.value.csjd = data[0].toFixed(3)
          this.value.cdwd = data[1].toFixed(3)
          this.dialogMapvisible = false
        }
      },
      openMap() {
        this.dialogMapvisible = true
        setTimeout(() => {
          if (this.value.csjd && this.value.cdwd && parseInt(this.value.csjd) && typeof parseInt(this.value.cdwd)) {
            this.$refs.controlPgis.renderMarker([{ x: this.value.csjd, y: this.value.cdwd }])
            let position = new window.EzCoord(this.value.csjd, this.value.cdwd)
            this.$refs.controlPgis.map.centerAndZoom(position, 10)
          } else {
            this.$refs.controlPgis.clearMap()
          }
        }, 20)
      }
    },
    watch: {
      newinfo: {
        handle() {
          this.$emit('updata:value', this.newinfo)
        },
        deep: true
      }
    },
    props: ['value', 'form', 'dataType', 'flag'],
    mounted() {},
    created() {
      this.initDialog()
    }
  }

</script>
