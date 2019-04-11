<template>
  <div class="field-wrap">
    <div class="field-cont">
      <div class="all-field">
        <span>所有字段</span>
        <el-tree :default-checked-keys="[]" :props="defaultProps" :default-expand-all="true" class="cat-tree" :data="data1" node-key="name" :show-checkbox="false" :render-content = "manageTreeRender"></el-tree>
      </div>
      <div class="arrow"><i class="el-icon-d-arrow-right"></i></div>
      <div class="ckecked-field">
        <span>已选字段</span>
        <el-tree :default-checked-keys="[]" :props="defaultProps" :default-expand-all="true" class="cat-tree" :data="data2" node-key="name" :show-checkbox="false"></el-tree>
      </div>
    </div>
    <div class="btn">
      <el-button type="primary" @click="upStep(3)">上一步</el-button>
      <el-button type="primary" @click="dialog = true">保存模型</el-button>
      <el-button type="primary" @click="comparisonResult()">对比结果</el-button>
    </div>
    <el-dialog title="保存模型" :visible.sync="dialog" top="30%" size="tiny" :before-close="close" height="300px">
      <el-form v-if="step === 1" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模型描述" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save('ruleForm')">保存</el-button>
          <el-button @click="reset('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="wrap" v-if="step === 2">
        <div class="loading">
          <el-progress class="loading__progress" type="circle" :percentage="importPercentage" :status="importPercentage===100?'success':''"></el-progress>
          <div class="" style="text-align:center; position: absolute;bottom: 0; left: 50%;transform: translateX(-50%);">
            {{resultText}}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
  .field-wrap {
    margin-top: 30px;
    .field-cont {
      width: 900px;
      height: 500px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: auto;
      .all-field,
      .ckecked-field {
        width: 400px;
        height: 500px;
        &>span {
          display: inline-block;
          width: 398px;
          height: 35px;
          line-height: 35px;
          background-color: #fafafa;
          border: 1px solid #ddd;
          border-bottom: 0;
          text-indent: 10px;
        }
        .cat-tree {
          overflow: auto;
        }
      }
      .arrow {
        width: 50px;
        height: 25px;
        border: 1px solid #ddd;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .wrap {
    min-height: 300px;
    overflow: hidden;
  }

  .loading {
    background: rgba(255, 255, 255, .5);
    width: 100%;
    height: calc(100% - 60px);
    position: absolute;
    top: 35px;
    left: 0;
    &__progress {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    cursor: pointer;
    button {
      border-radius: 3px;
    }
  }

</style>
<script>
  import { mapState } from 'vuex'
  import { SAVE_MY_DATA } from '../../../../store/types'
  import mixin from '../../../../utils/mixin'
  import bus from '../../../../utils/bus'
  import { clone } from '../../../../utils/util'
  export default {
    mixins: [mixin],
    computed: {
      ...mapState(['dataComparison'])
    },
    data() {
      return {
        dialog: false,
        comparisonData: '',
        data1: [],
        data2: [],
        defaultProps: {
          label: 'NameCn',
          children: 'options'
        },
        ruleForm: {
          name: '',
          desc: ''
        },
        rules: {
          name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }]
        },
        importPercentage: 0,
        step: 1,
        resultText: '您的数据已加入处理列队, 大约需要等待5分钟'
      }
    },
    methods: {
      manageTreeRender(h, { node, data, store }) {
        let styleArr = [],
          style;
        if (data.active) {
          styleArr.push(`background-color:#B7DAF5;color: #fff`)
        }
        style = styleArr.join(';')
        return h('span', {
          style: style,
          on: {
            click: (e) => {
              this.data1.forEach((item, idx) => {
                item.options.forEach((item2, idx2) => {
                  if (item2.Name === data.Name) {
                    this.$set(this.data1[idx].options[idx2], 'active', !item2.active)
                    if (item.NameCn === this.data1[0].NameCn) {
                      if (data.active) {
                        this.comparisonData.Columns.push({
                          TableIndex: 0,
                          ColumnName: data.Name
                        })
                      } else {
                        this.comparisonData.Columns.splice(this.comparisonData.Columns.indexOf(data.NameCn), 1);
                      }
                    } else {
                      if (data.active) {
                        this.comparisonData.Columns.push({
                          TableIndex: 1,
                          ColumnName: data.Name
                        })
                      } else {
                        this.comparisonData.Columns.splice(this.comparisonData.Columns.indexOf(data.NameCn), 1);
                      }
                    }
                  }
                })
              })
              let cloneData1 = clone(this.data1)
              let arr = cloneData1.filter((item, idx) => {
                let existSelected = item.options.some((item2) => { return item2.active; })
                let arrChild = this.data1[idx].options.filter((item3) => {
                  return item3.active
                })
                cloneData1[idx].options = arrChild;
                return existSelected
              })
              this.data2 = arr;
            }
          }
        }, node.label)
      },
      upStep(step) {
        this.$emit('step', step);
        bus.$emit('secondRest', null)
      },
      comparisonResult() {
        sessionStorage.setItem('comparsionResult', JSON.stringify(this.comparisonData))
        this.jumpTo(`/analysis/comparisonResult`, true)
      },
      save(formName) {
        this.$set(this.comparisonData, 'Name', this.ruleForm.name);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dispatch(SAVE_MY_DATA, this.comparisonData).then(() => {
              this.step = 2
              // this.dialog = false;
              // this.data1 = []
              // this.data2 = []
              // this.comparisonData.Columns = []
              // this.ruleForm.name = ''
              // this.ruleForm.desc = ''
              // this.dispatch(FETCH_MY_DATA_LIST, { PageIndex: 1, PageSize: 18, Keyword: '' }).then(() => {
              //   let resData = clone(this.dataComparison.myDataList.PageData);
              //   resData.forEach(el => {
              //     switch (Number(el.SourceType)) {
              //       case 1:
              //         el.SourceType = '上传数据'
              //         break;
              //       case 2:
              //         el.SourceType = '交叉对比'
              //         break;
              //       case 3:
              //         el.SourceType = '排除对比'
              //         break;
              //       case 4:
              //         el.SourceType = '表单运算'
              //         break;
              //       case 5:
              //         el.SourceType = '索引结果'
              //         break;
              //     }
              //   })
              //   this.$message({
              //     message: '保存成功',
              //     type: 'success'
              //   })
              //   bus.$emit('currentComm', 'datalist');
              //   bus.$emit('current', 3);
              //   bus.$emit('resData', resData)
              //   bus.$emit('save', 'success')
              //   bus.$emit('resetting', 1)
              // })
            })
          }
        })
      },
      reset(formName) {
        this.$refs[formName].resetFields();
      },
      close(done) {
        if (this.step === 1) {
          this.dialog = false
        } else {
          this.$confirm('关闭页面将会刷新').then(_ => {
            done()
            window.location.reload()
          })
        }
      }
    },
    created() {
      bus.$on('acossFilterList', m => {
        this.data1 = m;
      })
      bus.$on('acossSecondComparisonData', n => {
        this.comparisonData = n;
      })
      this.$connect.on('ImportSjbdDataProcess', (data) => {
        if (data.ID) {
          console.log('收到 ImportSjbdDataProcess 推送, 开始回调处理');
          this.importPercentage = parseInt((data.CompletedCount / data.Total) * 100) || 3
          this.resultText = '上传成功,手动刷新页面'
          console.log('ImportSjbdDataProcess 回调处理完成');
        }
      })
    }
  }

</script>
