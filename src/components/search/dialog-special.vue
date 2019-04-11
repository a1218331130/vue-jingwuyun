<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" v-if="type!==null" :title="type.name+'搜索'" :modal-append-to-body="true" :append-to-body="true" size="middle--fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <el-row :gutter="20">
    <!-- 找人 -->
    <el-form ref="specialPeopleForm" :model="form" label-width="100px" v-if="type.value===1">

      <el-col :span="12">
        <el-form-item label="姓名">
          <el-input v-model="form.name.value" placeholder="" :maxlength="12"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证">
          <el-input v-model="form.idcard.value" placeholder="" :maxlength="18"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="年龄段">
          <el-select v-model="form.age.value" placeholder="">
            <el-option v-for="d in options.age" :key="d" :label="d" :value="d"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="籍贯">
          <el-cascader v-model="form.origin.value" :options="options.area" :props="{value:'name',label:'name'}" expand-trigger="hover" :show-all-levels="false"></el-cascader>
        </el-form-item>
      </el-col>


      <el-col :span="12">
        <el-form-item label="民族">
          <el-select v-model="form.nation.value" placeholder="">
            <el-option v-for="d in options.nation" :key="d" :label="d" :value="d"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex.value">
            <el-radio label="全部" value="全部"></el-radio>
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-form>

    <!-- 前科 -->
    <!-- <el-form ref="specialRecodForm" :model="form" label-width="100px" v-if="type.value===2">

      <el-col :span="12">
        <el-form-item label="姓名">
          <el-input v-model="form.name.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证">
          <el-input v-model="form.idcard.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>


      <el-col :span="12">
        <el-form-item label="年龄段">
          <el-select v-model="form.age.value" placeholder="">
            <el-option v-for="d in options.age" :key="d" :label="d" :value="d"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="籍贯">
          <el-cascader v-model="form.origin.value" :options="options.area" :props="{value:'name',label:'name'}" expand-trigger="hover" :show-all-levels="false"></el-cascader>
        </el-form-item>
      </el-col>


      <el-col :span="12">
        <el-form-item label="民族">
          <el-select v-model="form.nation.value" placeholder="">
            <el-option v-for="d in options.nation" :key="d" :label="d" :value="d"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex.value">
            <el-radio label="全部" value="全部"></el-radio>
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-form> -->

    <!-- 卡口/车辆 -->
    <el-form ref="specialBayonetForm" :model="form" label-width="100px" v-if="type.value===5">

      <el-col :span="10">
        <el-form-item label="车牌号码">
          <el-input v-model="form.carNo.value" placeholder="" :maxlength="7"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="过车时间">
          <el-date-picker v-model="carPassDate" type="daterange" range-separator=" / " @change="val=>form.carPassDate.value=val" :editable="false" placeholder=""></el-date-picker>
        </el-form-item>
      </el-col>


      <el-col :span="24">
        <el-form-item label="位置范围">
          <el-input v-model="form.carArea.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-form>

    <!-- 案件 -->
    <el-form ref="specialCaseForm" :model="form" label-width="100px" v-if="type.value===2">

      <el-col :span="10">
        <el-form-item label="案件编号">
          <el-input v-model="form.caseNo.value" placeholder="" :maxlength="30"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="14">
        <el-form-item label="受理时间">
          <el-date-picker v-model="caseDate" type="daterange" range-separator=" / " @change="val=>form.caseDate.value=val" :editable="false" placeholder=""></el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="10">
        <el-form-item label="包含关键字">
          <el-input v-model="form.caseKey.value" placeholder="" :maxlength="50"></el-input>
        </el-form-item>
      </el-col>
    </el-form>

    <!-- 旅业 -->
    <!-- <el-form ref="specialTouristForm" :model="form" label-width="100px" v-if="type.value===5">

      <el-col :span="12">
        <el-form-item label="姓名">
          <el-input v-model="form.name.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证">
          <el-input v-model="form.idcard.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>


      <el-col :span="12">
        <el-form-item label="年龄段">
          <el-select v-model="form.age.value" placeholder="">
            <el-option v-for="d in options.age" :key="d" :label="d" :value="d"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="籍贯">
          <el-cascader v-model="form.origin.value" :options="options.area" :props="{value:'name',label:'name'}" expand-trigger="hover" :show-all-levels="false"></el-cascader>
        </el-form-item>
      </el-col>


      <el-col :span="12">
        <el-form-item label="入住时间">
          <el-date-picker v-model="form.inDate.value" type="daterange" :editable="false" placeholder=""></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex.value">
            <el-radio label="全部" value="全部"></el-radio>
            <el-radio label="男" value="男"></el-radio>
            <el-radio label="女" value="女"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>


      <el-col :span="24">
        <el-form-item label="地址">
          <el-input v-model="form.address.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>


      <el-col :span="24">
        <el-form-item label="旅馆名称">
          <el-input v-model="form.hotel.value" placeholder=""></el-input>
        </el-form-item>
      </el-col>
    </el-form> -->
  </el-row>
  <div slot="footer" class="dialog-footer">
    <el-button type="" @click="closeEvent">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </div>
</el-dialog>
</template>
<style  scoped>

</style>
<script>
import mixin from '../../utils/mixin'
import area from '../../utils/area.js'
import { getAgeGroup } from '../../utils/util.js'

export default {
  mixins: [mixin],
  components: {},
  data() {
    return {
      carPassDate: '',
      caseDate: '',
      form: {
        // 类型(valueType) 0:文本, 1:时间段, 2:年龄段
        // 要素ID(searchType) 5电话号码6银行账号7QQ号码8电子邮箱
        name: {
          value: '',
          valueType: 0,
          name: '姓名',
          searchType: 1
        },
        idcard: {
          value: '',
          valueType: 0,
          name: '身份证',
          searchType: 2
        },
        age: {
          value: '',
          valueType: 2,
          name: '全部',
          searchType: 0
        },
        origin: {
          value: [],
          valueType: 0,
          name: '籍贯',
          searchType: 9
        },
        nation: {
          value: '全部',
          valueType: 0,
          name: '全部',
          searchType: 0
        },
        sex: {
          value: '全部',
          valueType: 0,
          name: '全部',
          searchType: 0
        },
        carNo: {
          value: '',
          valueType: 0,
          name: '车牌号',
          searchType: 4
        },
        carPassDate: {
          value: '',
          valueType: 1,
          name: '全部',
          searchType: 0
        },
        carArea: {
          value: '',
          valueType: 0,
          name: '全部',
          searchType: 0
        },
        caseNo: {
          value: '',
          valueType: 0,
          name: '案件编号',
          searchType: 3
        },
        caseDate: {
          value: '',
          valueType: 1,
          name: '全部',
          searchType: 0
        },
        caseKey: {
          value: '',
          valueType: 0,
          name: '全部',
          searchType: 0
        },
        inDate: {
          value: '',
          valueType: 1,
          name: '全部',
          searchType: 0
        },
        address: {
          value: '',
          valueType: 0,
          name: '地址',
          searchType: 10
        },
        hotel: {
          value: '',
          valueType: 0,
          name: '全部',
          searchType: 0
        }
      },
      page: {
        start: '',
        end: ''
      },
      options: {
        age: [],
        area: area,
        nation: ['汉族', '蒙古族', '藏族', '回族']
      }
    }
  },
  props: ['dialog', 'type'],
  computed: {},
  methods: {
    initDialog() {
      if (this.$refs.specialPeopleForm) this.$refs.specialPeopleForm.resetFields()
    },
    submit() {
      this.$emit('update:special', this.form)
    },
    closeEvent() {
      this.$emit('close')
    },
    aaa(val) {
      console.log(val.split(' / '));
    }
  },
  created() {

  },
  mounted() {
    this.options.age = getAgeGroup()
  }
}
</script>
