<template>
  <div class=" bmhx-sidebar fadein-left  " id="bmhx_lh">
    <!--左边导航start-->
    <div class="user_avaice">
      <img :src="value.Thumb||''" class=""/>
      <div class="user_name">
        {{value.Name || ""}}
      </div>
      <div class="user_address">
        {{value.Org || ""}}
      </div>
    </div>
    <div class="user_titlebg"><span class="fa fa-vcard-o"></span> 基本信息</div>
    <div class="user_basic">
      <ul>
        <li><span>部门：</span>{{value.Dept || ""}}</li>
        <li><span>行政职务：</span>{{value.Post || ""}}</li>
        <li><span>等级：</span>{{value.ZwLevel || ""}}</li>
        <li>
          <span>工作年限：</span>10
        </li>
        <li><span>出生日期：</span>{{value.BirthDay | dateFormat }}</li>
        <li><span>办案数：</span>199件</li>
      </ul>
    </div>
    <div class="user_titlebg"><span class="fa fa-vcard-o"></span> 联系方式</div>
    <div class="user_basic">
      <ul>
        <li><span>电话：</span>15789822983</li>

        <li><span>邮箱：</span>dzw@polic.com</li>

      </ul>
    </div>


  </div>
</template>

<style lang="scss" scoped>

</style>


<script>
  import {mapState} from 'vuex'
  import '../../../../utils/dateFormat'
  export default {
    props: ['value'],
    computed: {
      ...mapState(['talentPool']),
      themodel() {
        return this.talentPool.Model || {}
      },
//      year() {
//        return this.talentPool.Model.SubGzjlList[0].EndDate.substring(2, 4) - this.talentPool.Model.SubGzjlList[0].BeginDate.substring(2, 4)
//      }
      getbd() {
        this.talentPool.Model.BirthDay.substring(0, 10)
      }
    },
    methods: {},
    created() {
    },
    mounted() {
    }
  }
</script>
