const _ = require('lodash')
module.exports = _.template(`
/*! build time: <%=new Date().toLocaleString()%> */
// <%=importTypeArray.join(', ')%>
import { <%=importTypeArray.join(', ')%> } from '../types'
// <%=importApiArray.join(', ')%>
import { <%=importApiArray.join(', ')%> } from '../../api/code/<%=name%>'
// store module
export default {
  state: {
   <%_.each(customStateArray, function(state){ %>
      <%=state%>: null,
   <%})%>
    <%=list%>: [],
    <%=page%>: null,
    <%=limit%>: null,
    <%=total%>: 0,
    <%=model%>: null
  },
  mutations: {
    <%_.each(items, function(item, i){%>
      <%if(i>0){%>,<%}%>
      
      <%if(item.methodType == 'fetch'){%>
        [<%=item.NAME%>](state, payload) {
          state.<%=list%> = payload.<%=list%>;
          state.<%=page%> = payload.<%=page%>;
          state.<%=limit%> = payload.<%=limit%>;
          state.<%=total%> = payload.<%=total%>;
        }
      <%}%>
      
      <%if(item.methodType == 'add'){%>
        [<%=item.NAME%>](state, payload) {
          if(payload.index !== undefined) {
            state.<%=list%>.splice(payload.index, 0, payload.<%=model%>)
          }else {
            state.<%=list%>.push(payload.<%=model%>);
          }
        }
      <%}%>
      
      <%if(item.methodType == 'update'){%>
        [<%=item.NAME%>](state, payload) {
          if(payload.index !== undefined) {
            state.<%=list%>.splice(payload.index, 1, payload.<%=model%>)
          }
        }
      <%}%>
      
      <%if(item.methodType == 'remove'){%>
        [<%=item.NAME%>](state, payload) {
          state.<%=list%>.splice(payload.index, 1)
        }
      <%}%>
      
      <%if(item.methodType == 'get'){%>
        [<%=item.NAME%>](state, payload) {
          state.<%=model%> = payload.<%=model%>
        }
      <%}%>
      
      <%if(['fetch','get','add','update','remove'].indexOf(item.methodType)==-1){%>
       [<%=item.NAME%>](state, payload) {
          state.<%=item.state%> = payload.<%=item.state%>
        }
      <%}%>
      
    <%})%>
    
  },
  actions: {
  
    <%_.each(items, function(item, i){%>
      <%if(i>0){%>,<%}%>
      
      <%if(item.methodType == 'fetch'){%>
        [<%=item.NAME%>]({commit}, params={}) {
          return <%=item.name%>(
              <%_.each(item.params, function(param){%>
                 params.<%=param%>,
              <%})%>
               params.<%=item.ajaxParam%>
              
              <%if(item.ajaxParam=='body'){%>
                  ,params.query
              <%}%>
          ).then(data => {
            commit({
              type: <%=item.NAME%>,
              <%=list%>: data.<%=list%>,
              <%=page%>: Number.parseInt(data.<%=page%>),
              <%=limit%>: Number.parseInt(data.<%=limit%>),
              <%=total%>: Number.parseInt(data.<%=total%>)
            })
          })
        }
      <%}%>
      
      <%if(item.methodType == 'add'){%>
        [<%=item.NAME%>]({commit}, params={}) {
          return <%=item.name%>(
              <%_.each(item.params, function(param){%>
                 params.<%=param%>,
              <%})%>
               params.<%=item.ajaxParam%>
              
              <%if(item.ajaxParam=='body'){%>
                  ,params.query
              <%}%>
          ).then(data => {
            commit({
              type: <%=item.NAME%>,
              <%=model%>: Object.assign({}, params.<%=item.ajaxParam%>, data),
              index: params.index
            })
          })
        }
      <%}%>
      
      <%if(item.methodType == 'update'){%>
        [<%=item.NAME%>]({commit, state}, params={}) {
          return <%=item.name%>(
              <%_.each(item.params, function(param){%>
                 params.<%=param%>,
              <%})%>
               params.<%=item.ajaxParam%>
              
              <%if(item.ajaxParam=='body'){%>
                  ,params.query
              <%}%>
          ).then(data => {
            commit({
              type: <%=item.NAME%>,
              index: params.index,
              <%=model%>: Object.assign({}, state.<%=list%>[params.index], params.<%=item.ajaxParam%>, data)
            })
          })
        }
      <%}%>
      
      <%if(item.methodType == 'remove'){%>
        [<%=item.NAME%>]({commit}, params={}) {
          return <%=item.name%>(
              <%_.each(item.params, function(param){%>
                 params.<%=param%>,
              <%})%>
               params.<%=item.ajaxParam%>
              
              <%if(item.ajaxParam=='body'){%>
                  ,params.query
              <%}%>
          ).then(data => {
            commit({
              type: <%=item.NAME%>,
              index: params.index
            })
          })
        }
      <%}%>
      
      <%if(item.methodType == 'get'){%>
        [<%=item.NAME%>]({commit}, params={}) {
          return <%=item.name%>(
              <%_.each(item.params, function(param){%>
                 params.<%=param%>,
              <%})%>
               params.<%=item.ajaxParam%>
              
              <%if(item.ajaxParam=='body'){%>
                  ,params.query
              <%}%>
          ).then(data => {
            commit({
              type: <%=item.NAME%>,
              <%=model%>: data
            })
          })
        }
      <%}%>
      
      
      <%if(['fetch','get','add','update','remove'].indexOf(item.methodType)==-1){%>
        [<%=item.NAME%>]({commit}, params={}) {
          return <%=item.name%>(
              <%_.each(item.params, function(param){%>
                 params.<%=param%>,
              <%})%>
               params.<%=item.ajaxParam%>
              
              <%if(item.ajaxParam=='body'){%>
                  ,params.query
              <%}%>
              
          ).then(data => {
            commit({
              type: <%=item.NAME%>,
              <%=item.state%>: data
            })
          })
        }
      <%}%>
      
    <%})%>
  }
}
`)
