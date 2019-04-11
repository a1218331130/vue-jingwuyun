// Echarts Options All [引用所有图表配置]
import bar from './bar'
import dashed from './dashed'
import gauge from './gauge'
import heatmap from './heatmap'
import line from './line'
import map from './map'
import pie from './pie'
import radar from './radar'

export default {
  mixins: [
    map,
    bar,
    dashed,
    gauge,
    heatmap,
    line,
    pie,
    radar
  ]
}
