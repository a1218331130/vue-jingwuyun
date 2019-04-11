<template>
<div class="person-box">
  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" v-if="list.length > 0" :show-header="false" v-loading.body="loading" :data="value" :border="true">
    <el-table-column class-name="compact" label="内容集">
      <template scope="scope">
        <div class="compact__wrap">
          <div class="compact__image">
            <data-image class="person-list__item__image" :idCard="scope.row.sfz"></data-image>
          </div>
          <div class="compact__box">
            <div class="compact__box__name">
              {{scope.row.xm}}
              <span v-if="scope.row.sfck==='1'" class="keyWord">(已撤控)</span>
              <el-button v-if="detail" type="text" size="mini" icon="icon iconfont icon-trash_fill" @click="deleteThisInfo(scope.row)"></el-button>
            </div>
            <el-row>
              <el-col :span="9">
                <div class="compact__box__meta">
                  身份证:
                  <span>{{scope.row.sfz}}</span>
                  <!-- 性别:
                  <span>{{scope.row.sex}}</span> -->
                </div>
              </el-col>
              <!-- <el-col :span="15">
                <div class="compact__box__meta text-right">
                  居住地:
                  <span>{{scope.row.city}}</span>
                </div>
              </el-col> -->
            </el-row>
            <el-row>
              <el-col :key="index" :span="8" v-if="item.tzlx!== '1'&&item.tzlx!=='2'" v-for="(item, index) in scope.row.keywordList">
                  <el-checkbox class="compact__box__checkbox" :disabled="!detail" :checked="true" @change="changeChecked" :name="item.lybid+'-'+item.tzlx+'-'+item.gjz" :label="switchData(scope.$index,item.tzlx) + item.gjz"></el-checkbox>
              </el-col>
            </el-row>
            <el-row v-if="scope.row.sfck === '1'">
              <div class="compact__box__meta">
                撤控原因:
                <span>{{scope.row.ckyy}}</span>
                <!-- 性别:
                <span>{{scope.row.sex}}</span> -->
              </div>
            </el-row>
            <!-- <el-row>
              <el-col :span="24">
                <div class="compact__box__meta">职业:
                  <span>{{scope.row.jog}}</span> 备注:
                  <span>{{scope.row.mark}}</span>
                </div>
              </el-col>
            </el-row> -->
          </div>
        </div>

      </template>
</el-table-column>
</el-table>
</div>
</template>
<style lang="scss" scoped>
  .person-box {
    height: auto;
    overflow: auto;
    .compact {
      &__image {
        width: 50px;
        margin-right: 10px;
        .data-image {
          width: 100%;
          height: auto;
        }
      }
      &__box {
        width: 620px;
        &__name {
          color: #000;
          position: relative;
          .el-button {
            position: absolute;
            top: -5px;
            right: 0;
          }
          .keyWord {
            color: red;
            font-weight: bold;
          }
        }
        &__checkbox {
          font-size: 12px;
          color: #5d5d5d;
        }
        &__meta {
          color: #999;
          font-size: 12px;
          line-height: 20px;
          height: 20px;
          text-align: left;
          span {
            color: #666;
            margin-right: 5px;
            display: inline-block;
          }
        }
        .text-right {
          position: relative;
          span {
            position: absolute;
            left: 52px;
            color: #666;
            margin-right: 5px;
            display: inline-block;
          }
        }
      }
    }
  } // .compact__box__name {
  //     height: 20px;
  // }

</style>
<script>
  import mixin from '../../../utils/mixin'
  import dataImage from '../../../widgets/data-image/data-image'
  export default {
    mixins: [mixin],
    components: {
      'data-image': dataImage
    },
    data() {
      return {
        checkedValue: [],
        list: [],
        index: 0,
        xm: 1,
        cph: 1,
        sfz: 1,
        phone: 1
      }
    },
    props: ['value', 'detail'],
    computed: {},
    watch: {},
    methods: {
      switchData(index, val) {
        if (this.index !== index) {
          this.index = index;
          this.xm = 1;
          this.cph = 1;
          this.sfz = 1;
          this.phone = 1;
        }
        let data = '';
        switch (val) {
          case '1':
            data = `姓名${this.xm}：`
            this.xm++;
            break;
          case '2':
            data = `身份证${this.sfz}：`
            this.sfz++;
            break;
          case '3':
            data = `联系电话${this.phone}：`
            this.phone++;
            break;
          case '7':
            data = `车牌号${this.cph}：`
            this.cph++;
            break;
        }
        return data
      },
      nature(item) {
        let data = `${item.lybid}-${item.tzlx}-${item.gjz}`
        return data
      },
      deleteThisInfo(data) {
        this.value.forEach((d, i) => {
          if (d.lybid === data.lybid) {
            this.value.splice(i, 1)
          }
        })
      },
      changeChecked(val) {
        let jsonData = {},
          obj = val.target,
          arr = obj.name.split('-');
        jsonData.tzlx = arr[1]
        jsonData.gjz = arr[2]
        jsonData.lybid = arr[0]
        if (!obj.checked) {
          this.checkedValue.push(jsonData)
        } else {
          this.checkedValue = this.checkedValue.filter(item => {
            return item.lybid !== arr[0] || item.tzlx !== arr[1] || item.gjz !== arr[2]
          })
        }
        this.$emit('checkedValue', this.checkedValue)
      }
    },
    mounted() {
      for (let i = 1; i <= 2; i++) {
        this.list.push({
          name: '李明钟',
          idCard: '440104198005065314',
          sex: '男',
          nation: '汉',
          native: '怀化市鹤城区',
          residence: '怀化市鹤城区',
          jog: '车间工人',
          mark: '备注内容备注内容备注内容备注内容备注内容备注内容',
          image: '/static/img/testPersonImg.jpg'
        })
      }
    }
  }

</script>
