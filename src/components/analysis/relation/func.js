/**
 * @file 关系分析核心逻辑
 */
import mixin from '../../../utils/mixin'
import bus from '../../../utils/bus'
import { mapState } from 'vuex'
import {
  FETCH_RESULT_FROM_OBJECT,
  GET_RELATION_TYPE,
  GET_RELATION_NODE_TYPE,
  GET_TEXT_FILE_CONTENT,
  REMOVE_RESULT_NODE,
  REMOVE_RESULT_RELATION,
  POST_RESULT_NODE
} from '../../../store/types'

import { UPLOAD_PATH, IMAGE_CONVERSION_PATH } from '../../../config'

import gocharts from '../../../widgets/gocharts/gocharts'
import objectSelectorDialog from '../../../widgets/object-selector-dialog/object-searchers-dialog'

import temp from './temp'
import filterBox from './filter'
import relationBox from './relation-box'
import statistics from './statistics'
import baseInfo from './base-info'

import dialogNode from './dialog-node'
import dialogSave from './dialog-save'
import dialogManage from './dialog-manage'
import dialogSubnode from './dialog-subnode'
import dialogRelation from './dialog-relation'
import dialogTable from './dialog-table'

import { arrayGetRid, clone, dateFormat } from '../../../utils/util'
import { save } from '../../../utils/storage'

/**
 * 测试数据
 */
import testMixin from './test'

/**
 * @module RelationCore 关系分析核心逻辑
 * @desc 关系分析核心逻辑继承类
 * @example
 * import func from './func'
 * export default {  mixins: [func] }
 */
export default {
  mixins: [mixin, testMixin],
  components: {
    gocharts,
    objectSelectorDialog,
    temp,
    filterBox,
    statistics,
    baseInfo,
    dialogNode,
    dialogSubnode,
    dialogRelation,
    dialogTable,
    dialogSave,
    dialogManage,
    relationBox
  },
  data() {
    let categoryToType = {
      place: 8,
      tel: 2,
      car: 3,
      user: 4,
      case: 6
    }
    return {
      dataTypeToNodeType: {
        8: categoryToType['place'], // 单位名称
        2: categoryToType['tel'], // 电话号码
        3: categoryToType['car'], // 车牌号码
        4: categoryToType['user'], // 身份证
        5: categoryToType['car'], // 车辆车牌号码
        6: categoryToType['case'] // 案件编号
      },
      relationInfoData: null,
      itemClickTimeout: null,
      currFilter: [],
      relationColors: {},
      diagramEnabled: true,
      initting: false,
      dialogObjectSelector: false,
      showTemp: false,
      nodeDialog: false,
      subnodeDialog: false,
      relationDialog: false,
      tableDialog: false,
      saveDialog: false,
      manageDialog: false,
      linkData: null,
      parentNode: null,
      recordList: [],
      keyword: '',
      idCardFlag: false,
      showRightBar: true,
      showRightFilter: false,
      detailTab: '1',
      screenshotAction: IMAGE_CONVERSION_PATH,
      operateType: '', // 打开关系图操作类型，用于afterInited初始化关系图后回调攀
      goOptions: {
        readOnly: false,
        allowZoom: true,
        layout: 'LayeredDigraphLayout',
        overview: 'analysisRelationOverview',
        contextMenuElm: 'analysisRelationContextMenu',
        makerClickEvent: () => {
          this.makerClickEvent()
        },
        nodeClickEvent: (e, node) => {
          this.nodeClickEvent(e, node)
        },
        nodeDoubleClickEvent: (e, node) => {
          this.nodeDoubleClickEvent(e, node)
        },
        linkClickEvent: (obj) => {
          this.linkClickEvent(obj)
        },
        wrapOpenEvent: (e, obj) => {
          this.wrapOpenEvent(e, obj);
        },
        wrapFoldEvent: (e, obj) => {
          this.wrapFoldEvent(e, obj);
        }
      },
      packList: [],
      chartData: {
        nodeDataArray: [],
        linkDataArray: []
      },
      postData: null,
      chartImage: '',
      importting: false,
      file: null,
      fileInput: true,
      fileTypes: ['txt', 'json'],
      linkContextMenuList: [],
      unableDelete: '', // 不能移除的节点
      unableKey: []
    }
  },
  // props: {
  //   idCards: {
  //     type: String,
  //     default: ''
  //   }
  // },
  computed: {
    ...mapState(['analysisRelation', 'improt']),
    relationFilters() {
      let links = this.chartData.linkDataArray.map(d => {
        return d.text
      });
      let linkSet = new Set(links);
      let res = [...linkSet];
      return res;
    },
    diagram() {
      let diagram = null;
      if(this.$refs.analysisRelationGoBox && this.$refs.analysisRelationGoBox.mainGo) {
        diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      }
      return diagram;
    },
    model() {
      let model = null;
      if(this.diagram) {
        model = this.diagram.model;
      }
      return model;
    }
  },
  methods: {
    highlightShortPath(key1, key2) {
      let node1, node2;
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      let model = diagram.model;
      node1 = diagram.findNodeForKey(key1);
      node2 = diagram.findNodeForKey(key2);
      if(!node1 || !node2) {
        return;
      }
      let paths = this.findRoute(node1, node2, [key1]);
      let minPath, minLength;
      if(paths.length === 0) {
        return;
      }
      paths.forEach(r => {
        if(minLength === undefined || r.length < minLength) {
          minPath = r;
        }
      });
      model.modelData.analysisRoute = minPath;
      for(let i = 0; i < minPath.length - 1; i++) {
        let node1 = diagram.findNodeForKey(minPath[i]);
        let node2 = diagram.findNodeForKey(minPath[i + 1]);
        node1.isHighlighted = true;
        node2.isHighlighted = true;
        let links = node1.findLinksBetween(node2);
        links.each(r => {
          r.isHighlighted = true;
        })
      }
    },
    // 两点之间查找最短路径
    findRoute(node1, node2, searchPath) {
      let paths = [];
      if(node1.data.key === node2.data.key) {
        return [searchPath];
      } else {
        let cNodes = node1.findNodesConnected();
        if(cNodes.count !== 1 || searchPath[0] === node1.data.key) {
          cNodes.each(item => {
            if(!searchPath.includes(item.data.key)) {
              let p = this.findRoute(item, node2, searchPath.concat([item.data.key]));
              if(p.length !== 0) {
                p.forEach(r => paths.push(r));
              }
            }
          })
          return paths;
        } else {
          return [];
        }
      }
    },
    // 展开节点
    wrapOpenEvent(event, obj) {
      let data = obj.panel.panel.panel.data;
      let rootKey = data.key;
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      let model = diagram.model;
      this.loading = true;
      diagram.nodes.each(node => {
        let key = node.data.key;
        // 找到只有一条关系线的节点
        let relationFrom = diagram.findLinksByExample({ from: rootKey, to: key });
        let relationTo = diagram.findLinksByExample({ from: key, to: rootKey });
        // 此节点与要折叠的节点是否有关系,有关系则隐藏
        if(relationFrom.count + relationTo.count !== 0) {
          model.setDataProperty(node.data, 'visible', true);
          if(relationFrom.count) {
            relationFrom.each(item => {
              model.setDataProperty(item.data, 'visible', true)
            })
          }
          if(relationTo.count) {
            relationTo.each(item => {
              model.setDataProperty(item.data, 'visible', true)
            })
          }
        }
      })
      model.setDataProperty(data, 'wrapStatus', 'open')
      // setTimeout(() => {
      this.loading = false;
      // }, 200)
    },
    // 折叠节点
    wrapFoldEvent(event, obj) {
      let data = obj.panel.panel.panel.data;
      let rootKey = data.key;
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      let model = diagram.model;
      this.loading = true;
      diagram.nodes.each(node => {
        let key = node.data.key;
        let fromLink = diagram.findLinksByExample({ from: key, visible: true });
        let toLink = diagram.findLinksByExample({ to: key, visible: true });
        // 找到只有一条关系线的节点
        if(fromLink.count + toLink.count === 1) {
          let relationFrom = diagram.findLinksByExample({ from: rootKey, to: key });
          let relationTo = diagram.findLinksByExample({ from: key, to: rootKey });
          // 此节点与要折叠的节点是否有关系,有关系则隐藏
          if(relationFrom.count + relationTo.count !== 0) {
            model.setDataProperty(node.data, 'visible', false);
            if(relationFrom.count === 1) {
              relationFrom.each(item => {
                model.setDataProperty(item.data, 'visible', false)
              })
            }
            if(relationTo.count === 1) {
              relationTo.each(item => {
                model.setDataProperty(item.data, 'visible', false)
              })
            }
          }
        }
      })
      model.setDataProperty(data, 'wrapStatus', 'fold')
      // setTimeout(() => {
      this.loading = false;
      // }, 500)
    },
    // 筛选关系
    filterRelation(item, idx) {
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      let model = diagram.model;
      this.loading = true;
      diagram.nodes.each((node) => {
        model.setDataProperty(node.data, 'visible', false);
      })
      diagram.links.each((link) => {
        model.setDataProperty(link.data, 'visible', false);
      })
      if(item) {
        if(this.currFilter.includes(item)) {
          this.currFilter.splice(this.currFilter.indexOf(item), 1)
        } else {
          this.currFilter.push(item);
        }
        let links = diagram.findLinksByExample({
          text: n => {
            return this.currFilter.includes(n)
          }
        });
        links.each(link => {
          model.setDataProperty(link.data, 'visible', true);
        })
        diagram.nodes.each(node => {
          let key = node.data.key;
          let fromLink = diagram.findLinksByExample({ from: key, visible: true });
          let toLink = diagram.findLinksByExample({ to: key, visible: true });
          if(fromLink.count !== 0 || toLink.count !== 0) {
            model.setDataProperty(node.data, 'visible', true)
          }
        })
      } else {
        // 全部
        this.currFilter = [];
        diagram.nodes.each((node) => {
          model.setDataProperty(node.data, 'visible', true);
        })
        diagram.links.each((link) => {
          model.setDataProperty(link.data, 'visible', true);
        })
      }
      this.resetWrapIcons()
      // setTimeout(() => {
      this.loading = false;
      // }, 500)
    },
    // 打包数据添加节点后移除
    removeFilterNode(item) {
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      let model = diagram.model;
      let node = model.findNodeDataForKey(item.endNodeId);
      model.removeNodeData(node)
      let linkKey = this.findLink(model.linkDataArray, item.rstartId, item.rendId);
      if(linkKey) {
        let link = model.findLinkDataForKey(linkKey);
        model.removeLinkData(link);
      }
      // diagram.requestUpdate(true)
      this.updateChartData();
      this.$refs.filterBox.changeAdded(item, 'remove');
    },
    // 打包数据添加到分析节点中
    addFilterNode(d) {
      let mark = this.getNodeType(d.endlabels[0]),
        type = mark.type,
        column = mark.key;
      let fromKey = d.rstartId;
      let toKey = d.rendId;
      let nodeData = {
        key: d.endNodeId,
        keyword: d.endNode[column],
        category: this.getCategoryByType(type),
        type: type,
        mark: mark,
        flag: d.endNode.flag,
        text: type === 4 ? d.endNode.ms : d.endNode[column],
        wrapStatus: 'none'
      }
      let linkData = {
        from: fromKey,
        to: toKey,
        textArray: d.type.map(t => {
          return {
            text: t,
            fromKey: d.rstartId,
            toKey: d.rendId,
            rid: d.rid,
            delFlag: d.relationNode[0].flag === '1'
          }
        })
      }
      this.addNode(nodeData, linkData);
      this.updateChartData()
      this.$refs.filterBox.changeAdded(d, 'add');
    },
    // 查找关系
    findLink(linkArray, from, to) {
      let key = '';
      for(let i = 0; i < linkArray.length; i++) {
        if(linkArray[i].from === from && linkArray[i].to === to) {
          key = linkArray[i].key;
          break;
        }
      }
      return key;
    },
    toggleLock(status) {
      this.diagramEnabled = status;
      this.$refs.analysisRelationGoBox.mainGo.diagram.setProperties({ isEnabled: status })
    },
    diagramDragHandler() {
      let isEnabled = this.$refs.analysisRelationGoBox.mainGo.diagram.isEnabled;
      console.log(isEnabled)
    },
    /**
     * 关系线点击事件
     * @function linkClickEvent
     * @param {any} obj 关系线数据来源
     */
    linkClickEvent(obj) {
      this.analysisRelation.ListForResultFromObject.relationList.forEach(d => {
        if(obj.targetObj.data.textArray[0].rid === d.rid) {
          let startKey, endKey = null;
          this.detailTab = '1';
          delete d.startNode['ms'];
          delete d.endNode['ms'];
          if(d.rstartId === d.startNodeId) {
            startKey = Object.keys(d.startNode)[0];
            endKey = Object.keys(d.endNode)[0];
            obj.targetObj.data.from = d.startNode[startKey];
            this.$set(obj.targetObj.data, 'startNodeType', startKey);
            obj.targetObj.data.to = d.endNode[endKey];
            this.$set(obj.targetObj.data, 'endNodeType', endKey === 'bjhm' ? 'dhhm' : endKey);
          } else {
            startKey = Object.keys(d.endNode)[0];
            endKey = Object.keys(d.startNode)[0];
            obj.targetObj.data.from = d.endNode[startKey];
            this.$set(obj.targetObj.data, 'startNodeType', startKey);
            obj.targetObj.data.to = d.startNode[endKey];
            this.$set(obj.targetObj.data, 'endNodeType', endKey === 'bjhm' ? 'dhhm' : endKey);
          }
          return d;
        }
      })
      // this.$refs.baseInfoBox.getLineData(obj.targetObj.data);
    },
    /**
     * 获取节点类型标识
     * @function getCategoryByType
     * @param  {Number} type 来自数据库的节点类型标识
     * @return {String}      节点类型标识(与goChartNode组件节点模板对应)
     */
    getCategoryByType(type) {
      let res
      if(type === 4 || type === 1) {
        // 人员
        res = 'person'
      } else if(type === 2) {
        // 电话
        res = 'tel'
      } else if(type === 8) {
        // 单位
        res = 'place'
      } else if(type === 3 || type === 5) {
        // 车辆
        res = 'car'
      } else if(type === 6) {
        // 案件
        res = 'case'
      } else {
        res = 'default'
      }
      return res
    },
    /**
     * 获取打包数据中文名称
     * @function getPackNameByType
     * @param  {Number} type 来自数据库的节点类型标识
     * @return {String}      打包数据中文名称
     */
    getPackNameByType(type) {
      let res
      if(type === 1) {
        res = '同房间'
      } else if(type === 2) {
        res = '同旅馆'
      } else if(type === 3) {
        res = '同火车'
      } else if(type === 4) {
        res = '同航班'
      } else if(type === 5) {
        res = '同网吧'
      } else if(type === 6) {
        res = '居住地'
      } else if(type === 7) {
        res = '常去城市'
      } else {
        res = '其他'
      }
      return res
    },
    getObjKeyAndValue(target) {
      let typedata;
      if(!this.analysisRelation.resultObjectTypeList) {
        this.getNodeType().then(() => {
          typedata = this.analysisRelation.resultObjectTypeList.find(r => r.TYPE === target.dataType);
        })
      } else {
        typedata = this.analysisRelation.resultObjectTypeList.find(r => r.TYPE === target.dataType);
      }
      return { keyColumn: typedata.BY2, textColumn: typedata.BY1 }
    },
    // 将节点添加到库，用于检索到的节点在库中没有对应数据的情况
    addNodeToDatabase({ text, keyword, typeString }) {
      return new Promise((resolve, reject) => {
        this.dispatch(POST_RESULT_NODE, {
          ms: text,
          value: keyword,
          node: typeString,
          objtype: this.analysisRelation.resultObjectTypeList.find(d => d.NODE === typeString).KEY
        }).then(() => {
          let guid = this.analysisRelation.postResultNodeRes;
          resolve({ id: guid, oldKey: keyword });
        }).catch((e) => {
          this.$message({ type: 'warning', message: `添加节点失败!信息${JSON.stringify(e)}` })
        })
      })
    },
    /**
     * 添加以数据来源为基础的节点
     * @function addObject
     * @listens module:ObjectSearcherDialog~call:addObject
     * @param {Object} target 来源数据对象
     */
    addObject(target) {
      // if(!this.unableDelete){
      //   this.unableDelete=target.keyword
      // }
      let { keyColumn, textColumn } = this.getObjKeyAndValue(target);
      let key = keyColumn ? target.data[keyColumn] : null;
      let text = textColumn ? target.data[textColumn] : null;
      let type = target.data.type;
      if(!key) {
        this.$alert('添加失败, 请联系管理员! (Error: 该条数据缺少 key:true 字段)', '温馨提示');
      }

      if(!text) {
        this.$alert('添加失败, 请联系管理员! (Error: 该条数据缺少 title:true 字段)', '温馨提示');
      }

      if(key && text && type && !this.chartData.nodeDataArray.find(c => c.key === key)) {
        this.addNode({
          key: key,
          keyword: key,
          category: this.getCategoryByType(type),
          type: type,
          text: text,
          flag: target.flag,
          mark: this.getNodeMark(target.dataType),
          wrapStatus: 'none'
        })
        this.updateChartData();
        this.$nextTick(() => {
          this.analysisAction({
            key: key,
            keyword: key,
            type: type,
            text: text
          })
        })
      } else {}
    },
    /**
     * 初始化GOJS建模器
     * @function initChart
     */
    initChart() {
      // 如新建, 默认存在案件基本节点
      this.chartData = {
        nodeDataArray: [],
        linkDataArray: []
      }
    },
    /**
     * 清空建模器
     * @function clearAll
     */
    clearAll() {
      this.loading = true
      this.goOptions.readOnly = false;
      this.$refs.baseInfoBox.clear()
      this.relationInfoData = null;
      this.detailTab = '1';
      this.initChart()
      setTimeout(() => {
        this.$refs.analysisRelationGoBox.initMaker()
        this.loading = false
      }, 300)
    },
    /**
     * 打开保存对话框
     */
    openSaveDialog() {
      this.postData || this.$refs.analysisRelationGoBox.commitData()
      if(this.postData.linkDataArray.length !== 0 && this.postData.nodeDataArray.length !== 0) {
        this.saveDialog = true;
      } else {
        this.$alert('请先进行关系分析')
      }
    },
    /**
     * 保存
     * @function save
     */
    saveRelation() {
      this.$message({
        type: 'success',
        message: '关系添加成功！'
      })
      this.saveDialog = false;
    },
    /**
     * 关系图初始化后调用
     * @function afterInited
     */
    afterInited() {},
    /**
     * 编辑关系图
     */
    showRelation(obj, row) {
      this.relationInfoData = row;
      this.detailTab = '4';
      if(obj) {
        this.goOptions.readOnly = true;
        this.operateType = 'show';
        obj.nodeObj.nodeDataArray.forEach((item, idx) => {
          let idCard = '';
          let match = item.source.match(/(?:sfzh=)(\w+)$/);
          if(match) {
            idCard = match[1];
          }
          item.source = `${this.personImagePath}${idCard}`;
        });
        this.$refs.analysisRelationGoBox.initMaker(clone(obj.nodeObj))
        this.updateChartData();
        this.resetWrapIcons()
      }
    },
    /**
     * 更新模型数据
     * @function updateChartData
     */
    updateChartData() {
      this.$refs.analysisRelationGoBox.commitData() // 申请同步数据
      this.chartData = clone(this.postData)
    },
    /**
     * 导出模型数据
     * @function exportData
     */
    exportData() {
      this.$refs.analysisRelationGoBox.commitData() // 申请同步数据
      this.tableDialog = true // 打开数据导出预览窗口
    },
    /**
     * 建模器点击事件
     * @function makerClickEvent
     */
    makerClickEvent() {
      this.$refs.baseInfoBox.clear()
    },
    /**
     * 节点双击事件
     * @function nodeDoubleClickEventnodeDoubleClickEvent
     * @param  {Event} e     DOM Event
     * @param  {Object} node 节点数据
     */
    nodeDoubleClickEvent(e, node) {
      if(this.itemClickTimeout) {
        clearTimeout(this.itemClickTimeout);
      }
      this.$refs.baseInfoBox.clear()
      this.analysisAction() // 出发关系分析
    },
    /**
     * 节点单击事件
     * @function nodeClickEvent
     * @param  {Event} e     DOM Event
     * @param  {Object} node 节点数据
     */
    nodeClickEvent(e, node) {
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      diagram.model.modelData.analysisRoute = [node.data.key]
      if(e.control) {
        // 查找两个节点的路径并且高亮显示
        if(diagram.selection.count === 2) {
          let nodes = []
          diagram.selection.each(r => {
            nodes.push(r);
          })
          this.highlightShortPath(nodes[0].data.key, nodes[1].data.key)
        }
      } else {
        let handler = () => {
          if(node.data.list) {
            this.detailTab = '3'
            this.packList = node.data.list
          } else {
            this.detailTab = '1'
            this.packList = []
            this.$refs.baseInfoBox.getData(node.data.keyword || node.data.text, node.data.category)
          }
        }
        this.itemClickTimeout = setTimeout(() => {
          handler();
        }, 500)
      }
    },
    // getObjectKey(relationList, keyword, keyColumn) {
    //   let id;
    //   // debugger;
    //   let tempKeyArr = [];
    //   if(relationList.length === 1) {
    //     let startNode = relationList[0].startNode;
    //     let endNode = relationList[0].endNode;
    //     if(startNode[keyColumn] === keyword) {
    //       id = relationList[0].startNodeId;
    //     } else if(endNode[keyColumn] === keyword) {
    //       id = relationList[0].endNodeId;
    //     }
    //   } else if(relationList.length > 1) {
    //     for(let i = 0; i < 2; i++) {
    //       let endNodeId = relationList[i].endNodeId;
    //       if(tempKeyArr.includes(endNodeId)) {
    //         id = relationList[i].endNodeId;
    //         break;
    //       } else {
    //         tempKeyArr.push(endNodeId);
    //       }
    //       console.log(tempKeyArr)
    //       let startNodeId = relationList[i].startNodeId;
    //       if(tempKeyArr.includes(startNodeId)) {
    //         id = relationList[i].startNodeId;
    //         break;
    //       } else {
    //         tempKeyArr.push(startNodeId);
    //       }
    //       console.log(tempKeyArr)
    //     }
    //   }
    //   return id;
    // },
    /**
     * 关系分析
     * @function analysisRelation
     * @param  {Object}  targetData 需分析的数据对象, 可为空, 为空时会取当前选中节点的data
     */
    analysisAction(targetData = null) {
      let target = targetData || this.getSelectionData();
      if(target) {
        this.dispatch(FETCH_RESULT_FROM_OBJECT, {
          type: target.type || 1,
          keyword: target.keyword
        }, undefined, undefined, undefined, undefined, { autoCancelLoading: false }).then(() => {
          this.loading = false;
          this.$refs.analysisRelationGoBox.commitData()
          if(this.analysisRelation.ListForResultFromObject && this.analysisRelation.ListForResultFromObject.relationList && this.analysisRelation.ListForResultFromObject.relationList.length > 0) {
            let relationList = this.analysisRelation.ListForResultFromObject.relationList;
            let targetId = relationList[0].startNodeId;
            let nodes = this.diagram.findNodesByExample({ keyword: target.keyword, type: target.type });
            nodes.each(node => {
              this.model.setKeyForNodeData(node.data, targetId);
            })
            target.key = targetId;
            let finishCount = 0;
            relationList.forEach((d, idx) => {
              if(d.endNode.TYPE && d.endNode.NUM) {
                // 打包数据
                let key = target.key + '_' + d.endNode.TYPE
                this.addNode({
                  key: key,
                  keyword: d.endNode.NAME,
                  category: 'dataPack',
                  list: JSON.parse(d.endNode.DATA),
                  text: `${d.endNode.NAME}(${d.endNode.NUM})`
                }, {
                  from: key,
                  to: target.key,
                  textArray: d.type.map(t => {
                    return {
                      text: t,
                      fromKey: key,
                      toKey: target.key,
                      rid: d.rid
                    }
                  })
                })
              } else {
                // 单一节点
                let mark = this.getNodeType(d.endlabels[0]),
                  type = mark.type,
                  column = mark.key;
                // let fromKey = d.rstartId === d.endNodeId ? d.rstartId : target.key;
                // let toKey = d.rendId === d.endNodeId ? d.rendId : target.key;
                let fromKey = d.rstartId;
                let toKey = d.rendId;
                let nodeData = {
                  key: d.endNodeId,
                  keyword: d.endNode[column],
                  category: this.getCategoryByType(type),
                  type: type,
                  mark: mark,
                  flag: d.endNode.flag,
                  text: type === 4 ? d.endNode.ms : d.endNode[column],
                  wrapStatus: 'none'
                }
                let linkData = {
                  from: fromKey,
                  to: toKey,
                  textArray: d.type.map(t => {
                    return {
                      text: t,
                      fromKey: d.rstartId,
                      toKey: d.rendId,
                      rid: d.rid,
                      delFlag: d.relationNode[0].flag === '1'
                    }
                  })
                }
                this.addNode(nodeData, linkData);
              }
              finishCount++;
              if(finishCount === relationList.length) {
                // 如果是网格布局，由于节点数量有变化，需要重新排布成方形
                if(this.goOptions.layout === 'GridLayout') {
                  this.$refs.analysisRelationGoBox.mainGo.setLayout(this.goOptions.layout);
                }
                this.updateChartData()
                this.resetWrapIcons()
              }
            })
          } else if(!this.analysisRelation.ListForResultFromObject ||
            !this.analysisRelation.ListForResultFromObject.relationList ||
            this.analysisRelation.ListForResultFromObject.relationList.length === 0) {
            this.addNodeIfNotExist(target)
          } else {
            this.resetWrapIcons()
          }
        }).catch((e) => {
          this.addNodeIfNotExist(target)
        })
      }
    },
    addNodeIfNotExist(target) {
      if(!target.typeString) {
        let dataType;
        for(let i in this.dataTypeToNodeType) {
          if(this.dataTypeToNodeType[i] === target.type) {
            dataType = i;
          }
        }
        let typeString = this.analysisRelation.resultObjectTypeList.find(d => d.TYPE === dataType.toString()).NODE;
        target.typeString = typeString;
      }
      this.addNodeToDatabase({
        text: target.text,
        keyword: target.keyword,
        typeString: target.typeString
      }).then(({ id, oldKey }) => {
        this.loading = false;
        let searchTarget = this.model.findNodeDataForKey(oldKey);
        this.model.setKeyForNodeData(searchTarget, id);
        this.updateChartData();
      })
    },
    resetWrapIcons() {
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram;
      let model = diagram.model;
      diagram.nodes.each(node => {
        let key = node.data.key;
        let fromLink = diagram.findLinksByExample({ from: key, visible: true });
        let toLink = diagram.findLinksByExample({ to: key, visible: true });
        if(fromLink.count + toLink.count > 1) {
          model.setDataProperty(node.data, 'wrapStatus', 'open')
        } else {
          model.setDataProperty(node.data, 'wrapStatus', 'none')
        }
      })
    },
    /**
     * 获取节点类型对标
     * @function getNodeType
     * @param  {String} typeString 后端返回的类型码
     * @return {Object}            对标对象
     */
    getNodeType(typeString) {
      let res = null
      if(typeString && this.analysisRelation.resultObjectTypeList && this.analysisRelation.resultObjectTypeList.length > 0) {
        let target = this.analysisRelation.resultObjectTypeList.find(d => d.NODE === typeString)
        if(target) {
          res = { type: parseInt(target.TYPE), key: target.KEY, typeString: typeString }
        } else {
          res = { type: '4', key: 'ms', typeString: 't_zt_ryjbqk' }
        }
      }
      return res
    },
    getNodeMark(type) {
      let res = null;
      if(type && this.analysisRelation.resultObjectTypeList && this.analysisRelation.resultObjectTypeList.length > 0) {
        let target = this.analysisRelation.resultObjectTypeList.find(d => d.TYPE === type)
        res = { type: parseInt(target.TYPE), key: target.KEY, typeString: target.NODE };
      }
      return res;
    },
    /**
     * 关系挖掘(预留方法)
     * @function analysisExcavate
     */
    analysisExcavate() {
      console.log(this.getSelectionData());
    },
    /**
     * 人员档案(预留方法)
     * @function analysisDossier
     */
    analysisDossier() {
      console.log(this.getSelectionData());
    },
    /**
     * 轨迹分析(预留方法)
     * @function analysisLocus
     */
    analysisLocus() {
      console.log(this.getSelectionData());
    },
    /**
     * 检索(跳转到慧搜)
     * @function analysisSearch
     */
    analysisSearch() {
      let data = this.getSelectionData(),
        formData = {
          SearchWhere: [{
            Keyword: data.text, // 关键字
            KeywordType: 0, // 关键字类型 0:文本, 1:时间段, 2:年龄段
            Name: '来自关系分析的检索需求',
            SearchType: 0
          }], // 查询条件，检索关键字(8.1.7)的集合
          TypeId: 0,
          SearchType: 0,
          TableIDs: [],
          FlTypeIDs: []
        }
      save('ngw_search_searcWhere_' + data.text, formData)
      save('ngw_search_catTreeData', null)

      this.jumpTo(`/search/result?key=${data.text}`, true)
    },
    /**
     * 查询节点详情(预留方法)
     * @function analysisDetail
     */
    analysisDetail() {
      console.log(this.getSelectionData());
    },
    /**
     * 添加关系对象子节点
     * @function analysisSubNode
     */
    analysisSubNode() {
      this.parentNode = this.getSelectionData()
      this.subnodeDialog = true
    },
    /**
     * 打包数据添加节点，因逻辑有点不同，独立出来
     */
    addWrapNode(node = null, link = null) {
      // node = clone(node)
      // link = clone(link)
      // let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram,
      //   model = diagram.model,
    },
    /**
     * 添加节点及连线到模型
     * @function addNode
     * @param {Object} [node=null] 需添加的节点对象
     * @param {Object} [link=null] 需添加的连线对象
     */
    addNode(node = null, link = null) {
      node = clone(node)
      link = clone(link)
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram,
        model = diagram.model,
        targetNode = node !== null ? this.chartData.nodeDataArray.find(n => n.key === node.key || n.keyword === node.keyword) : null,
        targetLink = link !== null ? this.chartData.linkDataArray.find(l => l.from === link.from && l.to === link.to) : null
      if(node !== null && !targetNode) {
        model.addNodeData({
          key: node.key || 0,
          keyword: node.keyword,
          type: node.type,
          mark: node.mark || null,
          category: node.category || 'default',
          delFlag: node.flag && node.flag === '1',
          text: node.text,
          color: '#fff',
          list: node.list || null,
          source: `${this.personImagePath}${node.keyword}`,
          isHit: false,
          wrapStatus: 'none'
        })
      }
      if(link !== null) {
        if(targetLink && targetLink.key) {
          let targetObj = model.findLinkDataForKey(targetLink.key)
          if(targetObj) {
            link.textArray.forEach(lt => {
              if(!targetObj.textArray.find(tt => tt.text === lt.text)) targetObj.textArray.push(lt)
            })
            model.setDataProperty(targetObj, 'textArray', targetObj.textArray)
            model.setDataProperty(targetObj, 'text', targetObj.textArray.map(d => d.text).join('_'))
            // model.setFromKeyForLinkData(targetObj, targetLink.key)
          }
        } else {
          let linkText = link.textArray.map(d => d.text).join('_');
          // 如果这个随机颜色找不到,给它一个随机颜色
          model.addLinkData({
            key: `${link.from}_${link.to}_${Date.parse(new Date())}`,
            from: link.from,
            to: link.to,
            textArray: link.textArray,
            text: linkText,
            // color: (linkText.indexOf('妻') !== -1 || linkText.indexOf('情') !== -1) ? '#f0acad' : (linkText.indexOf('子') !== -1 || linkText.indexOf('父') !== -1 ? '#5c92fa' : '#8bc63a'),
            // color: this.relationColors[linkText] || '#8bc63a',
            color: this.getRelationColor(linkText),
            visible: true
          })
        }
      }
      this.updateChartData()
    },
    /**
     * 创建自定义节点
     * @function addNewNode
     * @param {Object} [d] 需添加的节点对象
     */
    addNewNode(d) {
      let mark = this.getNodeType(d.bType),
        type = mark.type
      this.addNode({
        key: d.guid,
        keyword: d.target,
        category: this.getCategoryByType(type),
        type: type,
        mark: mark,
        flag: '1',
        text: d.targetName,
        wrapStatus: 'none'
      })
      this.nodeDialog = false
      this.$nextTick(() => {
        this.analysisAction({
          key: d.guid,
          keyword: d.target,
          type: type,
          text: d.targetName
        })
      })
    },
    /**
     * 创建子节点
     * @function addSubNode
     * @param {Object} obj 子节点对象
     */
    addSubNode(obj) {
      let subKey = obj.subKey,
        mark = this.getNodeType(obj.bType),
        type = mark.type,
        fromKey = obj.link === '1' ? obj.key : subKey,
        toKey = obj.link === '1' ? subKey : obj.key

      this.addNode({
        key: subKey,
        keyword: obj.keyword || obj.target,
        category: this.getCategoryByType(type),
        type: type,
        mark: mark,
        flag: '1',
        text: obj.target
      }, {
        from: fromKey,
        to: toKey,
        textArray: [{
          rid: obj.rid,
          fromKey: fromKey,
          toKey: toKey,
          text: obj.relationText,
          delFlag: false
        }]
      })

      this.subnodeDialog = false
    },
    removeNodeFromDiagram() {
      let target = this.getSelectionData();
      if(!target) {
        this.$alert('请先选择一个要操作的节点', '温馨提示')
      } else {
        if(!target.delFlag) {
          this.$alert('当前选中的属于系统节点, 不允许删除.', '温馨提示')
          return false
        }
        let links = this.chartData.linkDataArray.filter(d => d.from === target.key || d.to === target.key)
        if(links.length > 0) {
          this.$alert('该对象和其他对象存在关系, 请先手动删除所有相关关系再删除对象节点.', '温馨提示');
          return false
        }
        this.$confirm('请确认是否从画布移除该节点?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.model.removeNodeData(target)
          this.updateChartData()
        }).catch(() => {
          this.$refs.analysisRelationGoBox.hideContextMenu()
        })
      }
    },
    /**
     * 删除当前选中节点或关系(连线)
     * @function analysisRemoveNode
     */
    analysisRemoveNode() {
      let target = this.getSelectionData();
      console.log(target, 'this.target')
      if(!target) {
        this.$alert('请先选择一个要操作的节点 或 连线关系', '温馨提示')
      } else {
        if(target.from && target.to) {
          this.removeRelation({
            link: target,
            list: target.textArray
          })
        } else {
          if(!target.delFlag) {
            this.$alert('当前选中的属于系统节点, 不允许删除.', '温馨提示')
            return false
          }
          let links = this.chartData.linkDataArray.filter(d => d.from === target.key || d.to === target.key)
          if(links.length > 0) {
            this.$alert('该对象和其他对象存在关系, 请先手动删除所有相关关系再删除对象节点.', '温馨提示');
            return false
          }
          // 判断是否存在关系
          // 判断关系是否大于1个

          this.$confirm('请确认是否删除该节点? 该操作不可恢复!', '温馨提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dispatch(REMOVE_RESULT_NODE, {
              n: target.key
            }).then(() => {
              let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram
              diagram.commandHandler.deleteSelection()
              this.$refs.analysisRelationGoBox.hideContextMenu()
              this.updateChartData()
            })
          }).catch(() => {
            this.$refs.analysisRelationGoBox.hideContextMenu()
          })
        }
      }
    },
    removeNodeArray(key, keyword) { // 自查移除画布节点
      this.chartData.nodeDataArray.map((item, idx) => {
        if(item.keyword === keyword) {
          this.chartData.nodeDataArray.splice(idx, 1)
        }
      })
      let arr = [];
      this.chartData.linkDataArray = this.chartData.linkDataArray.filter((item, idx) => {
        let flag = true
        if(item.to === key) {
          arr.push(item.from)
          flag = false;
        }
        if(item.from === key) {
          arr.push(item.to)
          flag = false;
        }
        return flag
      })
      arr.map(item => {
        let num = 0;
        this.chartData.linkDataArray.map(item1 => {
          if(item1.to === item || item1.from === item) {
            num++
          }
        })
        if(num === 0) {
          this.chartData.nodeDataArray = this.chartData.nodeDataArray.filter((item1, idx) => {
            return item1.key !== item
          })
        } else if(num === 1) {
          let nodeKeyWord = ''
          this.chartData.nodeDataArray.map(item1 => {
            if(item1.key === item) {
              nodeKeyWord = item1.keyWord
              return false;
            }
          })
          this.removeNodeArray(key, nodeKeyWord)
        }
      })
    },
    removeNode(val) { // 移除画布节点
      let target = this.getSelectionData();
      this.removeNodeArray(target.key, target.keyword)
      this.$nextTick(() => {
        this.$refs.analysisRelationGoBox.initMaker()
      })
    },
    /**
     * 删除指定关系
     * @function removeRelation
     */
    removeRelation(item) {
      let fromNode, toNode;
      let target = this.getSelectionData()
      if(!item && target && target.textArray) {
        item = {
          link: target,
          list: target.textArray
        }
      }
      if(item) {
        if(!item.list[0].delFlag) {
          this.$alert('该关系是系统关系, 不允许删除!', '温馨提示');
          return false
        }

        fromNode = this.chartData.nodeDataArray.find(d => d.key === item.link.from)
        toNode = this.chartData.nodeDataArray.find(d => d.key === item.link.to)
        this.$confirm(`请确认是否删除 ${fromNode.text} 与 ${toNode.text} 的 ${item.list.map(d => d.text).join('、')} 关系? 该操作直接入库, 不可逆, 请谨慎操作!`, '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dispatch(REMOVE_RESULT_RELATION, {
            n1: item.list[0].fromKey || item.link.from, // 起始节点
            n2: item.list[0].toKey || item.link.to, // 结束节点
            rela: item.list.map(d => d.text).join(','), // 中文关系名称
            rid: item.list.map(d => d.rid)[0] // 关系节点的关系id
          }).then(() => {
            let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram,
              model = diagram.model
            let targetObj = model.findLinkDataForKey(item.link.key)
            if(targetObj) {
              arrayGetRid(targetObj.textArray, item.list)
              if(targetObj.textArray.length === 0) {
                diagram.commandHandler.deleteSelection()
              } else {
                model.setDataProperty(targetObj, 'textArray', targetObj.textArray)
                model.setDataProperty(targetObj, 'text', targetObj.textArray.map(d => d.text).join('_'))
              }
            }
            this.updateChartData()
          })
        }).catch(() => {})
      }
    },
    /**
     * 收起右键菜单
     * @function hideContextMenu
     */
    hideContextMenu() {
      document.getElementById('analysisRelationLinkContextMenu').style.display = 'none'
    },
    /**
     * 连线右键点击事件
     * @function linkContextmenu
     * @listens module:GoCharts~link-contextmenu
     * @param  {Object} res GoCharts对应事件回调对象
     */
    linkContextmenu(res) {
      if(res && res.targetObj && res.targetObj.data.textArray.length > 0) {
        this.$refs.analysisRelationGoBox.hideContextMenu()
        this.linkContextMenuList = res.targetObj.data.textArray.map(d => {
          return {
            link: res.targetObj.data,
            list: [d],
            text: d.text
          }
        })

        let e = res.e,
          elm = document.getElementById('analysisRelationLinkContextMenu')
        elm.style.display = 'block'
        elm.style.left = (e.viewPoint.x + 10) + 'px'
        elm.style.top = (e.viewPoint.y + 20) + 'px'
        elm.addEventListener('contextmenu', e => {
          e.preventDefault()
          return false
        }, false)
      }
    },
    /**
     * 连线事件
     * @function linkDrawn
     * @listens module:GoCharts~link-drawn
     * @param  {Event} e GoCharts对应事件回调对象
     */
    linkDrawn(e) {
      this.linkData = {
        objA: this.chartData.nodeDataArray.find(d => d.key === e.subject.data.from),
        objB: this.chartData.nodeDataArray.find(d => d.key === e.subject.data.to)
      }
      this.relationDialog = true
      e.diagram.commandHandler.deleteSelection()
    },
    addLink(res) {
      res = clone(res)
      this.addNode(null, {
        from: res.data.objA.key,
        to: res.data.objB.key,
        textArray: [{
          fromKey: res.data.objA.key,
          toKey: res.data.objB.key,
          rid: res.rid,
          text: res.relation,
          delFlag: 1
        }]
      })
      this.relationDialog = false
    },
    /**
     * 获取当前选中节点数据
     * @function getSelectionData
     */
    getSelectionData() {
      let diagram = this.$refs.analysisRelationGoBox.mainGo.diagram,
        res
      diagram.selection.each((node) => {
        res = node.data
      })
      this.$refs.analysisRelationGoBox.hideContextMenu()
      return res
    },
    /**
     * 节点过滤规则
     * @function filter
     * @listens module:RelationFilter~update:value
     * @param  {Object} obj 条件对象, 来源'./filter'
     * @param  {Boolean} obj.close 是否需要关闭条件筛选框
     * @param  {String} obj.idCard 身份证
     * @param  {String} obj.name 姓名
     * @param  {Array} obj.cat 分类
     * @param  {String} obj.objKeyword 节点名称关键字
     * @param  {String} obj.relationKeyword 关系名称关键字
     * @param  {Number} obj.objCount 关联节点数
     * @param  {Number} obj.relationCount 存在关系数
     */
    filter(obj) {
      this.loading = true
      let needFilter = false,
        linkData = this.chartData.linkDataArray,
        res = clone(this.chartData.nodeDataArray)
      // 分类筛选 category
      if(obj.cat.length > 0) {
        needFilter = true
        res = res.filter(d => {
          if(!obj.cat.find(c => d.category === c)) {
            return false
          } else {
            return true
          }
        })
      }

      // 对象关键字筛选
      if(obj.objKeyword !== '') {
        needFilter = true
        res = res.filter(d => d.text.indexOf(obj.objKeyword) !== -1)
      }

      // 关系名称关键字筛选
      if(obj.relationKeyword !== '') {
        needFilter = true
        let relationFilterResArr = [],
          relationFilterRes = []
        linkData.forEach(d => {
          if(d.text.indexOf(obj.relationKeyword) !== -1) {
            relationFilterResArr = [...relationFilterResArr, ...res.filter(r => d.from === r.key || d.to === r.key)]
          }
        })
        relationFilterResArr.forEach(d => {
          if(!relationFilterRes.find(r => r.key === d.key)) {
            relationFilterRes.push(d)
          }
        })
        res = relationFilterRes
      }

      // 关联对象数筛选
      if(obj.objCount > 0) {
        needFilter = true
        arrayGetRid(res,
          res.filter(d => {
            let relNode = []
            linkData.forEach(c => {
              if(c.from === d.key) {
                if(!relNode.find(n => n === c.to)) {
                  relNode.push(c.to)
                }
              } else if(c.to === d.key) {
                if(!relNode.find(n => n === c.from)) {
                  relNode.push(c.from)
                }
              }
            })
            return relNode.length < obj.objCount
          })
        )
      }

      // 关联关系数筛选
      if(obj.relationCount > 0) {
        needFilter = true
        arrayGetRid(res,
          res.filter(d => {
            return linkData.filter(c => c.from === d.key || c.to === d.key).length < obj.relationCount
          })
        )
      }

      // 设置命中
      this.chartData.nodeDataArray.forEach(d => {
        if(needFilter === true) {
          if(!res.find(r => r.key === d.key)) {
            d.isHit = false
          } else {
            d.isHit = true
          }
        } else {
          d.isHit = false
        }
      })

      // 更新模型
      this.$refs.analysisRelationGoBox.initMaker(null, false)

      this.loading = false
    },
    /**
     * 添加临时储存
     * @function addRecord
     */
    addRecord() {
      this.$refs.analysisRelationGoBox.makeImage({ makeOptions: { background: 'rgba(41,51,66,1)' } })
      this.recordList.unshift({
        img: this.chartImage,
        data: clone(this.chartData),
        goOptions: clone(this.goOptions),
        dateTime: dateFormat(new Date(), 'yyyy-MM-dd hh:mm')
      })
    },
    /**
     * 删除临时储存
     * @function removeRecord
     * @param  {Number} index 需删除临时临时储存的Index
     */
    removeRecord(index) {
      arrayGetRid(this.recordList, [this.recordList[index]])
    },
    /**
     * 恢复临时储存
     * @function updateChartDataFromRecord
     * @param  {Object} record 需恢复的恢复临时储存对象
     */
    updateChartDataFromRecord(record) {
      this.loading = true
      this.chartData = clone(record.data)
      this.setLayout(record.goOptions.layout, 'analysisRelationGoBox')
      this.loading = false
    },
    switchTemp() {
      this.showTemp = !this.showTemp
    },
    /**
     * 生成图片
     * @function makeImage
     */
    makeImage() {
      let afterMakeImage = () => {
        this.$nextTick(() => {
          this.$refs.screenshotForm.submit()
          this.$message({
            type: 'success',
            message: '关系图截取成功！',
            duration: 1000
          })
        })
      }
      this.$refs.analysisRelationGoBox.makeImage({
        makeOptions: { background: 'rgba(41,51,66, 1)' },
        afterMakeImage: afterMakeImage
      })
    },
    updateImageData(val) {
      this.chartImage = val.data;
    },
    /**
     * 切换右侧栏显示隐藏状态
     * @function switchRightBar
     */
    switchRightBar() {
      this.showRightBar = !this.showRightBar;
      if(this.showRightFilter && this.showRightBar) {
        this.showRightFilter = false;
      }
    },
    switchRightFilter() {
      this.showRightFilter = !this.showRightFilter;
      if(this.showRightBar && this.showRightFilter) {
        this.showRightBar = false;
      }
    },
    /**
     * 导入
     * @function importData
     * @param  {HTMLForm} [elm= null]        文件上传的form element
     */
    importData(elm = null) {
      if(elm === null) {
        this.$refs.relationImportUploadBtn.click()
      } else {
        let file = elm.target.files[0],
          fileTypeArr = file.name.split('.'),
          fileType = fileTypeArr[fileTypeArr.length - 1]
        if(file.size > 1024 * 1024 * 100) {
          this.$alert('文件不能大于100MB', '温馨提示');
        } else if(!this.fileTypes.find(d => d === fileType)) {
          this.$alert('只支持 TXT/JSON 文件', '温馨提示');
        } else {
          this.upload(file).then(res => {
            if(res && res.ID) {
              this.dispatch(GET_TEXT_FILE_CONTENT, { ID: res.ID }).then(() => {
                if(this.improt.textFileContent) {
                  let resData = clone(JSON.parse(this.improt.textFileContent))
                  resData.nodeDataArray.forEach(d => {
                    d.source = `${this.personImagePath}${d.keyword}`
                    d.text = decodeURIComponent(d.text)
                  })
                  resData.linkDataArray.forEach(d => {
                    d.text = decodeURIComponent(d.text)
                  })
                  this.chartData = resData
                  this.$nextTick(() => {
                    this.$refs.analysisRelationGoBox.initMaker()
                  })
                }
                this.clearFileInput()
              })
            } else {
              this.$alert('文件上传失败, 请联系管理员!', '温馨提示')
            }
            this.importting = false
          })
        }
      }
    },
    /**
     * 上传
     * @function upload
     * @param  {File}   file          文件实体
     * @param  {FormData} formData    form实体
     * @return {Promise}              上传承诺, 完成后返回后端返回数据
     */
    upload(file, formData = new FormData()) {
      let self = this
      this.importting = true

      // 插文件
      formData.append('file', file)
      // 插token
      formData.append('data', JSON.stringify({ token: this.userData.UserToken }))

      return new Promise(function (resolve, reject) {
        // let formData = new FormData()
        self.$http.post(UPLOAD_PATH, formData).then((res) => {
          resolve(res.body.Data)
        }).catch(() => {
          reject()
        })
      })
    },
    /**
     * 清除 input="file" 的已选内容
     * @function clearFileInput
     */
    clearFileInput() {
      this.file = null
      this.fileInput = false
      this.$nextTick(() => {
        this.fileInput = true
      })
    },
    // 初始化关系类型对应的颜色列表
    genRelationColor(list) {
      list.forEach((item, idx) => {
        this.relationColors[item.GXMC] = this.getRandomColor();
      })
    },
    // 得到一个不连续的随机数
    // start 随机开始位置
    // end 随机结束位置
    // isInteger 随机结果为整数
    // containRange 包含的范围, 示例 一个范围: [30, 90], 多个范围 [[40,60],[90,100]]
    getDiscoutinuousRandom(containRange = [0, 100], isInteger) {
      let ran = 0;
      let numCount = 0;
      let arrayCount = 0;
      containRange.forEach(item => {
        if(Array.isArray(item)) {
          arrayCount++;
        } else if(!isNaN(parseFloat(item))) {
          numCount++;
        }
      });
      if(numCount === containRange.length) {
        if(containRange.length !== 2) {
          throw new Error('containRange 数组元素为number时,只能包含两个元素')
        } else {
          ran = containRange[0] + Math.random() * (containRange[1] - containRange[0]);
        }
      } else if(arrayCount === containRange.length) {
        // 先随机出区间，再随机数字
        let range = Math.floor(Math.random() * containRange.length);
        if(containRange[range].length !== 2) {
          throw new Error('containRange 数组元素为number时,只能包含两个元素')
        } else {
          ran = containRange[range][0] + Math.random() * (containRange[range][1] - containRange[range][0])
        }
      } else {
        throw new Error('containRange 参数错误,数组元素必须全为数字或全为数组')
      }
      return isInteger ? Math.floor(ran) : ran;
    },
    getRandomColor() {
      let h = '100',
        s = '100%',
        l = '50%';
      h = this.getDiscoutinuousRandom([[0, 185], [275, 360]], false);
      s = this.getDiscoutinuousRandom([50, 100], true) + '%';
      l = this.getDiscoutinuousRandom([20, 40], true) + '%';
      return `hsl(${h},${s},${l})`;
    },
    // 得到某关系的随机颜色, 由于可能存在找不到该关系的颜色, 所以需要判断,使用时若没有就给一个随机色
    getRelationColor(relation) {
      if(!this.relationColors[relation]) {
        this.relationColors[relation] = this.getRandomColor();
      }
      return this.relationColors[relation];
    },
    validSfzh(sfzh) { // 验证是否为身份证号
      let reg1 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/g;
      let reg2 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/g;
      if(!reg1.test(sfzh) && !reg2.test(sfzh)) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    let initCount = 0
    this.initting = true
    // 关系类型
    this.dispatch(GET_RELATION_TYPE, { type: 2 }).then(() => {
      initCount++;
      this.genRelationColor(this.analysisRelation.relationType);
      if(initCount === 2) this.initting = false
    })
    // 节点对象类型
    this.dispatch(GET_RELATION_NODE_TYPE, { type: 1 }).then(() => {
      initCount++;
      if(initCount === 2) this.initting = false
    })
  },
  mounted() {
    bus.$on('update:idCard', d => { // 人员档案自动展开第一层关系分析
      if(d) {
        this.idCardFlag = true
      }
    })
    if(this.validSfzh(this.$route.query.key)) { // 慧搜小卡片点击进入关系分析自动展现第一层关系
      console.log(this.$route.query.key, 'this.$route.query.key 222222222222222222')
      bus.$emit('update:idCard', this.$route.query.key)
    }
  }
}
