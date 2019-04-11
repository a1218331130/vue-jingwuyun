<template>
<div style="height:100%">
  <div style="width:100vw; margin-left:60px; margin-top:10px;">
    <!-- <h3 class="addh3">重点人群工作信息</h3> -->
    <el-form :model="form">
      <el-row>
        <el-col :span="4">
          <el-form-item label="管辖警种" prop="jzlx">
            <el-select placeholder="选择管辖警种" :clearable="true" @change="changeJzlx" :maxlength="50" v-model="form.jzlx">
              <el-option v-for="item in dictLists['JZLX']" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4">
          <el-form-item label="单位" prop="gxdw">
            <el-cascader placeholder="选择下级单位" :maxlength="50" :show-all-cldjs="true" :filterable="true" v-model="form.gxdw" :options="CollectDeptList" :clearable="true" :show-all-levels="false" :props="{children:'children',value:'orgId',label:'name'}" :change-on-select="true"
              expand-trigger="click" style="width: 70%"></el-cascader>

          </el-form-item>

        </el-col>
        <el-col :span="4">
          <!-- <el-col v-if="!isAddTotal" :span="5"> -->
          <el-form-item label="数据类型" prop="sjlx">
            <el-select :multiple="true" :clearable="true" placeholder="选择数据类型" @change="changeType" v-model="form.sjlx">
              <el-option v-for="item in jzlxList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4" v-if="isAddTotal">
          <el-form-item label="选择时间" prop="djsj">
            <el-date-picker type="daterange" v-model="form.djsj" placeholder=""></el-date-picker>
          </el-form-item>

        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="submit">查询</el-button>
        </el-col>
        <el-col :span="1">
          <breifPopover contentId="1cdf9961daa24033ad0fd8bf8b5b8bed"></breifPopover>
        </el-col>
      </el-row>
    </el-form>
  </div>


  <div>
    <!-- 重点群体人员统计 -->
    <el-table resiable border @row-click="selectByOrg" :data="tableList2" v-if="!isSelect" v-show="this.dataType===''||this.dataType==='zdrq'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column width="220px" v-if="!(isSelect&&item.value==='dw')" v-for="item in peoList" :prop="item.value" :key="item.label" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <el-table resiable border @row-click="selectByOrg" :data="tableList2" v-if="isSelect" v-show="this.dataType===''||this.dataType==='zdrq'">
      <el-table-column width="220px" v-for="item in peoList" :prop="item.value" :key="item.label" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <!-- 重点单位统计 -->
    <el-table resiable border :data="tableList2" @row-click="selectByOrg" v-if="!isSelect" v-show="this.dataType==='zddw'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column width="220px" v-for="item in zdhyList" :prop="item.value" :key="item.value" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <el-table resiable border :data="tableList2" @row-click="selectByOrg" v-if="isSelect" v-show="this.dataType==='zddw'">
      <el-table-column width="220px" v-for="item in zdhyList" :prop="item.value" :key="item.value" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <!-- 重点场所统计 -->
    <el-table resiable border :data="tableList2" @row-click="selectByOrg" v-if="!isSelect" v-show="this.dataType==='zdcs'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column width="220px" v-for="item in zdcsList" :prop="item.value" :key="item.value" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <el-table resiable border :data="tableList2" @row-click="selectByOrg" v-if="isSelect" v-show="this.dataType==='zdcs'">
      <el-table-column width="220px" v-for="item in zdcsList" :prop="item.value" :key="item.value" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <!-- 重点车辆统计 -->
    <el-table resiable border :data="tableList2" @row-click="selectByOrg" v-if="!isSelect" v-show="this.dataType==='qtlx'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column :sortable="true" width="220px" v-for="item in carList" :prop="item.value" :key="item.value" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <el-table resiable border :data="tableList2" @row-click="selectByOrg" v-if="isSelect" v-show="this.dataType==='qtlx'">
      <el-table-column :sortable="true" width="220px" v-for="item in carList" :prop="item.value" :key="item.value" :label="item.label">
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.js'" label="基数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.hcs'" label="核查数"></el-table-column>
        <el-table-column :sortable="true" v-if="item.value!=='dw'" width="60px" :prop="item.value+'.yhs'" label="风险数"></el-table-column>
      </el-table-column>
    </el-table>

    <!-- 重点人群统计（增量） -->
    <el-table resiable border :data="tableList" @row-click="selectByOrg" v-show="this.dataType==='zdrqzl'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column :sortable="true" v-if="!(isSelect&&item.value==='dw')" width="100px" :prop="item.value+'.js'" v-for="item in peoList" :key="item.value" :label="item.label">
      </el-table-column>
    </el-table>

    <!-- 重点单位统计（增量） -->
    <el-table resiable border :data="tableList" @row-click="selectByOrg" v-show="this.dataType==='zdcszl'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column :sortable="true" v-if="!(isSelect&&item.value==='dw')" width="100px" :prop="item.value+'.js'" v-for="item in zdcsList" :key="item.value" :label="item.label">
      </el-table-column>
    </el-table>

    <!-- 重点场所统计（增量） -->
    <el-table resiable border :data="tableList" @row-click="selectByOrg" v-show="this.dataType==='zddwzl'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column :sortable="true" v-if="!(isSelect&&item.value==='dw')" width="100px" :prop="item.value+'.js'" v-for="item in zdhyList" :key="item.value" :label="item.label">
      </el-table-column>
    </el-table>

    <!-- 重点车辆统计（增量） -->
    <el-table resiable border :data="tableList" @row-click="selectByOrg" v-show="this.dataType==='qtlxzl'">
      <el-table-column :sortable="true" prop="dw" label="单位" width="220px"></el-table-column>
      <el-table-column :sortable="true" v-if="!(isSelect&&item.value==='dw')" width="100px" :prop="item.value+'.js'" v-for="item in carList" :key="item.value" :label="item.label">
      </el-table-column>
    </el-table>

  </div>

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
import mixin from '../../../utils/mixin'
import { mapState } from 'vuex'
import { clone } from '../../../utils/util'
import { listToTree } from '../../../utils/listToTree'
import breifPopover from '../../../widgets/brief-popover/brief-popover.vue'
import { PEOPLE_COUNT_DATA, FETCH_SYS_ORG_BY_CURRY_ORG } from '../../../store/types'
export default {
  mixins: [mixin],
  components: { breifPopover },
  data() {
    return {
      isAddTotal: false,
      dictLists: [],
      dw: 'dw',
      rqlbList: [],
      zdcsList: [],
      zdhyList: [],
      carList: [],
      tableList2: [],
      isSelect: false,
      loadingcreate: true,
      loadingwatch: true,
      areaList: [
        { value: '怀化市' }, { value: '鹤城区' }, { value: '中方县' }, { value: '沅陵县' }, { value: '辰溪县' }, { value: '溆浦县' }, { value: '会同县' }, { value: '麻阳苗族自治县' }, { value: '新晃侗族自治县' }, { value: '芷江侗族自治县' }, { value: '靖州苗族侗族自治县' }, { value: '通道侗族自治县' },
        { value: '洪江市' }
      ],
      form: { jzlx: '', sjlx: [], gxdw: [], djsj: [] }, // 搜索条件表单
      tableList: [],
      currentTableListUser: [], // 当前列表存在的用户
      jzlxList: [],
      sjlxList: [],
      peoList: [],
      IsSelectOrg: '',
      IsSelectOrg2: '',
      CollectDeptList: [],
      userList2: [],
      newinfo: null
    }
  },
  methods: {
    GetSysOrgDictTree(keyId) { // GetSysOrgList GetSysOrgTree
      this.dispatch(FETCH_SYS_ORG_BY_CURRY_ORG, {
        isAll: '1',
        jzlx: this.form.jzlx,
        orgId: keyId
      }).then(() => {
        this.CollectDeptList = listToTree(this.orgs.orgByCurryOrg, keyId, 0, {
          id: 'orgId',
          parentId: 'parentId',
          children: 'children'
        });
      })
    },
    submit() {
      this.$emit('update-loading', true) // 修改父组件loading.
      if(this.form.sjlx.length !== 0) {
        this.isSelect = true
        let peo = this.rqlbList.filter(d => (this.form.sjlx.indexOf(d.value) !== -1)).map(d => {
          return {
            label: d.label,
            value: d.value
          }
        })
        this.peoList.push({
          label: '单位',
          value: 'dw'
        })
        peo.forEach(d => {
          this.peoList.push(d)
        })
      } else {
        this.isSelect = false
        this.peoList = this.rqlbList
      }
      this.dispatch(PEOPLE_COUNT_DATA, {
        jzlx: this.form.jzlx,
        // sjlx: this.form.sjlx.join(','),
        gxdw: (this.form.gxdw[this.form.gxdw.length - 1]) || this.users.UserLogin.UserData.DeptNo,
        type: this.dataType,
        djsjsx: this.dateFormat(this.form.djsj[0], 'yyyy-MM-dd'),
        djsjxx: this.dateFormat(this.form.djsj[1], 'yyyy-MM-dd')
      }).then(d => {
        this.tableList = clone(this.focusChart.peopleCountData)
        this.tableList2 = clone(this.focusChart.peopleCountData)
        this.$emit('update-loading', false) // 修改父组件loading
      })
    },
    selectByOrg(row, envent, column) {
      this.form.gxdw = this.CollectDeptList.filter(d => (d.name === row.dw)).map(d => {
        return d.orgId
      })
      this.submit()
    },
    /**
     * [changeJzlx 修改警种类型]
     * @return {[type]} [description]
     */
    changeJzlx() {
      this.GetSysOrgDictTree(this.users.UserLogin.UserData.DeptNo)
    },
    /**
     * [changeType 修改数据类型]
     * @return {[type]} [description]
     */
    changeType() {
      if(this.dataType === 'zdrq' || this.dataType === 'zdrqzl') {
        this.peoList = []
        if(this.form.sjlx.length !== 0) {
          this.isSelect = true
          let peo = this.rqlbList.filter(d => (this.form.sjlx.indexOf(d.value) !== -1)).map(d => {
            return {
              label: d.label,
              value: d.value
            }
          })
          this.$nextTick(() => {
            this.peoList.push({
              label: '单位',
              value: 'dw'
            })
            peo.forEach(d => {
              this.$nextTick(() => {
                this.peoList.push(d)
              })
            })
          })
        } else {
          this.isSelect = false
          this.peoList = this.rqlbList
        }
      } else if(this.dataType === 'zdcs' || this.dataType === 'zdcszl') {
        this.zdcsList = []
        if(this.form.sjlx.length !== 0) {
          this.isSelect = true
          let cs = this.dictLists['ZDCSBW'].filter(d => (this.form.sjlx.indexOf(d.value) !== -1)).map(d => {
            return {
              label: d.label,
              value: d.value
            }
          })
          this.$nextTick(() => {
            this.zdcsList.push({
              label: '单位',
              value: 'dw'
            })
            cs.forEach(d => {
              this.$nextTick(() => {
                this.zdcsList.push(d)
              })
            })
          })
        } else {
          this.isSelect = false
          this.zdcsList = this.dictLists['ZDCSBW']
        }
      } else if(this.dataType === 'zddw' || this.dataType === 'zddwzl') {
        this.zdhyList = []
        if(this.form.sjlx.length !== 0) {
          this.isSelect = true
          let hy = this.dictLists['ZDHYDW'].filter(d => (this.form.sjlx.indexOf(d.value) !== -1)).map(d => {
            return {
              label: d.label,
              value: d.value
            }
          })
          this.$nextTick(() => {
            this.zdhyList.push({
              label: '单位',
              value: 'dw'
            })
            hy.forEach(d => {
              this.$nextTick(() => {
                this.zdhyList.push(d)
              })
            })
          })
        } else {
          this.isSelect = false
          this.zdhyList = this.dictLists['ZDHYDW']
        }
      } else {
        this.carList = []
        if(this.form.sjlx.length !== 0) {
          this.isSelect = true
          let cl = this.dictLists['ZDCLLX'].filter(d => (this.form.sjlx.indexOf(d.value) !== -1)).map(d => {
            return {
              label: d.label,
              value: d.value
            }
          })
          this.$nextTick(() => {
            this.carList.push({
              label: '单位',
              value: 'dw'
            })
            cl.forEach(d => {
              this.$nextTick(() => {
                this.carList.push(d)
              })
            })
          })
        } else {
          this.isSelect = false
          this.carList = this.dictLists['ZDCLLX']
        }
      }
    },
    initDialog() {
      this.$emit('update-loading', true) // 修改父组件loading
      this.isSelect = false
      this.tableList = []
      if(this.dataType === 'zdrq') {
        this.jzlxList = this.rqlbList
        this.peoList = clone(this.rqlbList)
      } else if(this.dataType === 'zdcs') {
        this.jzlxList = this.dictLists['ZDCSBW']
        this.zdcsList = this.dictLists['ZDCSBW']
      } else if(this.dataType === 'zddw') {
        this.jzlxList = this.dictLists['ZDHYDW']
        this.zdhyList = this.dictLists['ZDHYDW']
      } else if(this.dataType === 'zdrqzl') {
        this.jzlxList = this.rqlbList
        this.peoList = clone(this.rqlbList)
      } else if(this.dataType === 'zdcszl') {
        this.jzlxList = this.dictLists['ZDCSBW']
        this.zdcsList = this.dictLists['ZDCSBW']
      } else if(this.dataType === 'zddwzl') {
        this.jzlxList = this.dictLists['ZDHYDW']
        this.zdhyList = this.dictLists['ZDHYDW']
      } else {
        this.jzlxList = this.dictLists['ZDCLLX']
        this.carList = this.dictLists['ZDCLLX']
      }
      this.form.gxdw = [this.users.UserLogin.UserData.DeptNo]
      if(this.dataType.endsWith('zl')) {
        this.isAddTotal = true
      } else {
        this.isAddTotal = false
      }
      this.dispatch(PEOPLE_COUNT_DATA, { jzlx: this.form.jzlx, gxdw: (this.form.gxdw[this.form.gxdw.length - 1]) || this.users.UserLogin.UserData.DeptNo, type: this.dataType }).then(d => {
        this.tableList = this.focusChart.peopleCountData
        this.tableList2 = this.focusChart.peopleCountData
        this.tableList.djsj = [this.focusChart.peopleCountData.djsjsx, this.focusChart.peopleCountData.djsjxx]
      })
    }
  },
  watch: {
    dataType() {
      console.log(this.dataType);
      this.$emit('update-loading', true)
      this.form = { jzlx: '', sjlx: [], gxdw: [], djsj: [] }
      this.initDialog() // 修改父组件loading
      this.loadingwatch = false
      this.$emit('update-loading', (this.loadingwatch || this.loadingcreate))
    }
  },
  computed: {
    ...mapState(['dict', 'focusChart', 'orgs', 'users'])
  },
  props: ['dataType', 'parentType', 'titleName'],
  mounted() {

  },
  created() {
    console.log('创建');
    this.$emit('update-loading', true)
    this.GetSysOrgDictTree(this.users.UserLogin.UserData.DeptNo)
    this.getDict(['JZLX', 'RQFL', 'ZDHYDW', 'ZDCSBW', 'ZDCLLX']).then(res => {
      this.dictLists = res
      this.rqlbList = res['RQFL'].filter(d => (d.value.length !== 5)).map(d => {
        return {
          label: d.label,
          value: d.value
        }
      })
      this.initDialog()
      this.loadingcreate = false
      this.$emit('update-loading', (this.loadingwatch || this.loadingcreate))
    })
  }
}
</script>
