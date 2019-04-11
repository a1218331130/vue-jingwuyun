<template>
<div class="car-box">
  <el-table @cell-mouse-enter="cellMouseEnter" class="app-table" :show-header="false" v-loading.body="loading" :data="listData" :border="true">
    <!--v-if="list.length > 0"-->
    <el-table-column class-name="compact" label="内容集">
      <template scope="scope">
        <div class="compact__wrap">
          <div class="compact__image">
            <!-- <data-image class="person-list__item__image" :dataId="scope.row.tpid"></data-image> -->
            <!-- <img v-if="scope.row.tpid!==null" :src="picUrl+item.clxp" onerror="this.src='/static/img/default-car.jpg'" /> -->
            <img v-if="!scope.row.tpid" src='/static/img/default-car.jpg' />
          </div>
          <div class="compact__box">
            <div class="compact__box__name">
              <el-button v-if="detail" type="text" size="mini" icon="icon iconfont icon-trash_fill" @click="deleteThisInfo(scope.row)"></el-button>
            </div>
            <el-row>
              <el-col :span="24">
                <div class="compact__box__meta">
                  车牌号:
                  <span>{{scope.row.carNum}}</span>
                  <span v-if="scope.row.sfck==='1'" class="keyWord">(已撤控)</span>
                  <!-- 车辆识别代码:
                  <span>{{scope.row.code}}</span> -->
                  <!-- 车辆型号:
                  <span>{{scope.row.carModel}}</span> -->
                  <!-- 颜色:
                  <span>{{scope.row.carColor}}</span> -->
                  <!-- 车主姓名:
                  <span>{{scope.row.xm}}</span> -->
                  <!-- 品牌:
                  <span>{{scope.row.brand}}</span> -->
                  <!-- 布控状态:
                  <span>{{scope.row.bkzt}}</span> -->
                  <!-- 号牌种类:
                  <span>{{scope.row.noType}}</span>
                  环保标识号:
                  <span>{{scope.row.ep}}</span>
                  档案编号:
                  <span>{{scope.row.dooNo}}</span> -->
                  <!-- 备注:
                  <span>{{scope.row.mark}}</span> -->
                </div>
              </el-col>
              <el-col :span="24" v-if="scope.row.sfck === '1'">
                <div class="compact__box__meta">
                  撤控原因:
                  <span>{{scope.row.ckyy}}</span>
                  <!-- 车辆识别代码:
                  <span>{{scope.row.code}}</span> -->
                  <!-- 车辆型号:
                  <span>{{scope.row.carModel}}</span> -->
                  <!-- 颜色:
                  <span>{{scope.row.carColor}}</span> -->
                  <!-- 车主姓名:
                  <span>{{scope.row.xm}}</span> -->
                  <!-- 品牌:
                  <span>{{scope.row.brand}}</span> -->
                  <!-- 布控状态:
                  <span>{{scope.row.bkzt}}</span> -->
                  <!-- 号牌种类:
                  <span>{{scope.row.noType}}</span>
                  环保标识号:
                  <span>{{scope.row.ep}}</span>
                  档案编号:
                  <span>{{scope.row.dooNo}}</span> -->
                  <!-- 备注:
                  <span>{{scope.row.mark}}</span> -->
                </div>
              </el-col>
            </el-row>
            <!-- <el-row>
              <el-col :span="24">
                <div class="compact__box__meta"> -->
            <!-- 职业:
                  <span>{{scope.row.jog}}</span>  -->
            <!-- 备注:
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
.car-box {
    height: auto;
    overflow: auto;
    .compact {
        &__image {
            width: 50px;
            margin-right: 10px;
            img {
                width: 100%;
                height: auto;
            }
        }

        &__box {
            width: 620px;
            &__name {
                color: #000;
                position: relative;
                z-index: 2;
                .el-button {
                    position: absolute;
                    top: -5px;
                    right: 0;
                }
            }
            &__meta {
                color: #999;
                font-size: 12px;
                line-height: 20px;
                span {
                    color: #666;
                    margin-right: 5px;
                    display: inline-block;
                }
                .keyWord {
                    color: red;
                    font-weight: 700;
                }
            }
        }
    }

}
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
      list: [],
      listData: []
    }
  },
  props: ['value', 'detail'],
  computed: {},
  methods: {
    getMyonlyArray(array) {
      let newArray = []
      for(let i = 0; i < array.length; i++) {
        let flag = true
        // let n = newArray.length
        for(let j = 0; j < newArray.length; j++) {
          if(array[i].lybid === newArray[j].lybid) {
            flag = false
          }
        }
        if(flag) {
          newArray.push(array[i])
        }
      }
      return newArray
    },
    deleteThisInfo(data) {
      this.value.forEach((d, i) => {
        if(d.lybid === data.lybid) {
          this.value.splice(i, 1)
        }
      })
    }
  },
  watch: {
    value(data) {
      this.listData = data
      this.listData = this.getMyonlyArray(data)
    }
  },
  mounted() {
    if(this.value) {
      this.listData = this.value
    }
  }
}
</script>
