const _ = require('lodash')
module.exports = _.template(`
/*! build time: <%=new Date().toLocaleString()%> */
<% if(importApiArray.length>0){%>
// <%=importApiArray.join(', ')%>
import { <%=importApiArray.join(', ')%> } from '../../api/code/<%=name%>'
<%}%>
<%if(templateArray.length>0){%>
// <%=templateArray.join(', ')%>
import { <%=templateArray.join(', ')%>} from '../templates'
<%}%>
// Mock
export default [
<%_.each(mocks, function(item, i){%>
  <%if(i>0){%>,<%}%>
  <%if(item.methodType == 'fetch'){%>
    {
      title: '<%=item.URL%>',
      url: <%=item.URL%>,
      params: {
        <%=item.page%>: 1,
        <%=item.limit%>: 10
      },
     <%if(item.template){%>
        template: <%=item.template%>
     <%} else {%>
        template: {
          <%=code%>: 1,
          <%=data%>: {
            <%=item.page%>: '{{<%=item.page%>}}',
            <%=item.limit%>: '{{<%=item.limit%>}}',
            <%=item.total%>: 1000,
            '<%=item.list%>|{{<%=item.limit%>}}': [<%=item.columns%>]
          }
        }
      }
      <%}%>
  <%}%>
  
  <%if(item.methodType == 'update'){%>
    {
      title: '<%=item.URL%>',
      url: <%=item.URL%>,
      params: {},
     <%if(item.template){%>
        template: <%=item.template%>
     <%} else {%>
      template: {
        <%=code%>: 1,
        <%=message%>: '更新成功',
        <%=data%>: true
      }
      <%}%>
    }
  <%}%>
  
  <%if(item.methodType == 'get'){%>
    {
      title: '<%=item.URL%>',
      url: <%=item.URL%>,
      params: {},
     <%if(item.template){%>
        template: <%=item.template%>
     <%} else {%>
      template: {
        <%=code%>: 1,
        <%=message%>: '',
        <%=data%>: <%=item.columns%>
      }
      <%}%>
    }
  <%}%>
  
  <%if(item.methodType == 'add'){%>
    {
      title: '<%=item.URL%>',
      url: <%=item.URL%>,
      params: {},
     <%if(item.template){%>
        template: <%=item.template%>
     <%} else {%>
      template: {
        <%=code%>: 1,
        <%=message%>: '添加成功',
        <%=data%>: true
      }
      <%}%>
    }
  <%}%>
  
    <%if(item.methodType == 'remove'){%>
    {
      title: '<%=item.URL%>',
      url: <%=item.URL%>,
      params: {},
     <%if(item.template){%>
        template: <%=item.template%>
     <%} else {%>
      template: {
        <%=code%>: 1,
        <%=message%>: '删除成功',
        <%=data%>: true
      }
    <%}%>
    }
  <%}%>
  
  <%if(['fetch','get','update','remove','add'].indexOf(item.methodType)==-1){%>
    {
      title: '<%=item.URL%>',
      url: <%=item.URL%>,
      params: {},
     <%if(item.template){%>
        template: <%=item.template%>
    <%} else {%>
      template: {
        <%=code%>: 1,
        <%=message%>: '',
        <%=data%>: <%=item.columns%>
      }
     <%}%>
    }
  <%}%>
  
  
<%})%>
]
`)
