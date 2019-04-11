const _ = require('lodash')
module.exports = _.template(`
/*! build time: <%=new Date().toLocaleString()%> */
<%if(configKeys.length>0){%>
// <%=configKeys.join(', ')%>
import { <%=configKeys.join(', ')%>} from '../../config'
<%}%>
// ajax
import ajax from '../ajax'

<%_.each(items, function(item, i){%>
/**
 * <%=item.URL%>
 * @type {string}
 */
export const <%=item.URL%> = <%if(item.prefix){%> <%=item.prefix%> + <%}%>'<%=item.url%>'

/**
 * <%=item.camelCaseName%>
 <%_.each(item.params, function(param){%> 
 * @param <%=param%>
 <%})%>
 * @param <%=item.ajaxParam%>
 <%if(item.ajaxParam=='body'){%>
 * @param query
 <%}%>
 * @returns {promise}
 */
export const <%=item.camelCaseName%> = function (

<%=item.params.join(', ')%>

<%if(item.params.length>0){%>,<%}%>

 <%=item.ajaxParam%>

<%if(item.ajaxParam=='body'){%>
    ,query
<%}%>

) {
  return ajax({
        <%if(item.options){%>
          <%_.each(item.options, function(value, key){%>
              <%=key%>: <%if(typeof value=='string'){%> '<%=value%>' <%}else{%> <%=value%> <%}%>,
          <%})%>
        <%}%>
        
      <%if(item.params.length>0){%>
          params:{<%=item.params.join(', ')%>}, 
      <%}%>
      
      <%=item.ajaxParam%>:<%=item.ajaxParam%>,
      
      <%if(item.ajaxParam=='body'){%>
         query: query,
      <%}%>
       
      url: <%=item.URL%>
  })
}
<%})%>
`)
