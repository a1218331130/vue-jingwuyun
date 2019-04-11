<template>
<el-dialog v-draggable="dialogDraggableOptions" :visible.sync="dialog" :title="title" :modal-append-to-body="true"
:append-to-body="true" size="info-fixed" :modal="true" :close-on-click-modal="false" @open="initDialog" :before-close="closeEvent">
  <!-- {{data}} -->
  <el-row v-if="this.data!==null">
    <!-- 信息 -->
    <el-col :span="24">
      <el-row :gutter="10" class="info">
        <el-col :span="4" class="info__image-box">
          <i class="iconfont icon-addressbook_fill" v-if="type===1"></i>
          <i class="iconfont icon-xiaoche" v-if="type===2"></i>
          <i class="iconfont icon-dianhuadingdan" v-if="type===3"></i>
          <!-- <img class="info__image-box__image" src="" alt=""> -->
        </el-col>
        <el-col :span="20">
          <!-- 人员 -->
          <el-form v-if="type===1">
            <el-row :gutter="10" class="user-bg">
              <el-col :span="24" class="info__sign">
                李明钟 <span class="info__sign__mark--blue">男</span>
              </el-col>
              <el-col :span="24" class="info__secondary">
                440104198005065314[湖南省怀化市鹤城区]
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="出生日期">1983-12-05</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="民族">汉</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="出生地">湖南省怀化市鹤城区</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="服务处所">不详</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="户籍地">湖南省怀化市鹤城区坨院街道</el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!-- 车辆-->
          <el-form v-if="type===2">
            <el-row :gutter="10">
              <el-col :span="24" class="info__sign">
                湘NA56R7 <span class="info__sign__mark--blue">怀化市</span>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="品牌">五菱</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="颜色">白</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="登记时间">2017-03-26</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="排量">1.5L</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">正常</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所有人">李明钟</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="身份证">440104198005065314</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="户籍地">湖南省怀化市鹤城区</el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <!-- 手机 -->
          <el-form v-if="type===3">
            <el-row :gutter="10">
              <el-col :span="24" class="info__sign">
                13467319999 <span class="info__sign__mark--blue">怀化市</span>
              </el-col>
              <el-col :span="24" class="info__secondary">
                湖南 怀化 湖南 移动动感地带卡
              </el-col>
            </el-row>
            <el-row :gutter="10" class="info__mobile-master">
              <el-col :span="4">
                <div class="info__mobile-master__label">
                  可能机主
                </div>
                <div class="info__mobile-master__label">
                  可能机主
                </div>
                <div class="info__mobile-master__label seat"></div>
              </el-col>
              <el-col :span="20">
                <div class="info__mobile-master__value">
                  <span class="info__mobile-master__people" @click="callOtherDialog(1)">李明钟 440104198005065314</span> <span class="info__mobile-master__score"><label>来源: </label>交管_驾驶人证</span>
                </div>
                <div class="info__mobile-master__value">
                  <span class="info__mobile-master__people" @click="callOtherDialog(1)">李明钟 440104198005065314</span> <span class="info__mobile-master__score"><label>来源: </label>旅业_入住信息</span>
                </div>
              </el-col>
            </el-row>
          </el-form>

        </el-col>
      </el-row>
    </el-col>
    <!-- 标签 -->
    <el-col :span="24">
      <tags class="tags" :data="tags" :options="tagsOptions" @update:data="val=>tags=val" @update:options="val=>tagsOptions=val"></tags>
    </el-col>
    <!-- 入口 -->
    <el-col :span="24">
      <hr>
      <el-row ref="bbbbb" :gutter="20" class="entery">
        <el-col :span="4" v-if="type===1">
          <a href="/#/dossier/people" target="_blank">
            <i class="iconfont icon-icon_gerendangan_normal red"></i>人员档案
          </a>
        </el-col>
        <el-col :span="4" v-if="type===1">
          <i class="iconfont icon-guiji green"></i>人员轨迹
        </el-col>
        <el-col :span="4" v-if="type===2">
          <a href="/#/dossier/car" target="_blank">
            <i class="iconfont icon-xiaoqiche red"></i>车辆档案
          </a>
        </el-col>
        <el-col :span="4" v-if="type===2">
          <i class="iconfont icon-guiji orange"></i>车辆轨迹
        </el-col>
        <el-col :span="4" v-if="type===3">
          <a href="/#/analysis/telList" target="_blank">
            <i class="iconfont icon-dianhuadingdan blue"></i>话单分析
          </a>
        </el-col>
      </el-row>
    </el-col>
  </el-row>

</el-dialog>
</template>
<style lang="scss" scoped>
.info {
    transition: 0.25s;
    &__image-box {
        background: #dff1ff;
        height: 130px;
        overflow: hidden;
        display: flex;
        align-items: center;
        align-content: center;
        position: relative;
        &__image {
            width: auto;
            height: 100%;
            display: block;
            border: 0;
        }
        .iconfont {
            font-size: 42px;
            color: #b9dfff;
            text-align: center;
            width: 100%;
        }
    }
    &__sign {
        font-size: 20px;
        color: #1e1e1e;
        &__mark {
            font-size: 12px;
            color: #fff;
            height: 18px;
            line-height: 18px;
            padding: 0 3px;
            margin-left: 5px;
            display: inline-block;
            &--blue {
                font-size: 12px;
                color: #fff;
                height: 18px;
                line-height: 18px;
                padding: 0 3px;
                margin-left: 5px;
                display: inline-block;
                background: #199ed8;
            }
            &--red {
                font-size: 12px;
                color: #fff;
                height: 18px;
                line-height: 18px;
                padding: 0 3px;
                margin-left: 5px;
                display: inline-block;
                background: #ff3b62;
            }
        }
    }
    &__secondary {
        color: #1e1e1e;
    }
    &__mobile-master {
        margin-top: 18px;
        &__label {
            text-align: center;
            // width: 60px;
            height: 21px;
            line-height: 21px;
            padding-right: 10px;
            position: relative;
            border-right: 1px solid #d7d7d7;
            &:after {
                content: '';
                background: #49a3ff;
                width: 8px;
                height: 8px;
                border-radius: 10px;
                display: block;
                position: absolute;
                top: 50%;
                right: -5px;
                margin-top: -4px;
            }
            &.seat {
                &:after {
                    display: none;
                }
            }
        }
        &__value {
            height: 21px;
            line-height: 21px;
        }
        &__people {
            color: #53a9ff;
            margin-right: 10px;
            opacity: 0.9;
            cursor: pointer;
            &:hover {
                opacity: 1;
            }
        }
        &__score {
            color: #000;
            label {
                color: #656565;
            }
        }
    }
    .el-form-item {
        margin: 0;
    }
}

.entery {
    .iconfont {
        font-size: 32px;
        color: #fff;
        text-align: center;
        width: 60px;
        height: 60px;
        line-height: 60px;
        display: block;
        border-radius: 5px;
        opacity: 0.9;
        cursor: pointer;
        transition: 0.25s;
        &:hover {
            opacity: 1;
            box-shadow: 0 2px 2px #c2c2c2;
        }
        &.red {
            background: #e36e6e;
        }
        &.green {
            background: #99c27a;
        }
        &.orange {
            background: #e28750;
        }
        &.blue {
            background: #77c8eb;
        }
    }
}
</style>
<style media="screen">
.el-dialog--info-fixed {
  width: 650px;
}
</style>
<script>
import mixin from '../../utils/mixin'

import tags from '../../widgets/tags/tags'

export default {
  mixins: [mixin],
  components: {
    tags
  },
  data() {
    return {
      title: '',
      type: null,
      tags: [],
      tagsOptions: []
    }
  },
  props: ['dialog', 'data'],
  computed: {},
  methods: {
    initDialog() {
      console.log(222, this.$refs);

      this.type = this.data.contentType
      if (this.type === 1) {
        this.title = '个人信息'
        this.tags = [{
          id: 1,
          label: '肥胖'
        }, {
          id: 2,
          label: '光头'
        }, {
          id: 3,
          label: '戴眼镜'
        }]
        this.tagsOptions = [{
          id: 1,
          label: '肥胖'
        }, {
          id: 2,
          label: '光头'
        }, {
          id: 3,
          label: '戴眼镜'
        }]
      }
      if (this.type === 2) {
        this.title = '车辆信息'
        this.tags = [{
          id: 1,
          label: '前档风玻璃右下有裂痕'
        }]
        this.tagsOptions = [{
          id: 1,
          label: '前档风玻璃右下有裂痕'
        }, {
          id: 2,
          label: '倒后镜有刮痕'
        }, {
          id: 3,
          label: '大面积锈斑'
        }]
      }
      if (this.type === 3) {
        this.title = '手机信息'
        this.tags = []
        this.tagsOptions = []
      }
    },
    closeEvent() {
      this.$emit('close')
    },
    callOtherDialog(targetType) {
      if (targetType) this.$emit('call:dialog', targetType)
    }
  },
  created() {

  },
  mounted() {}
}
</script>
