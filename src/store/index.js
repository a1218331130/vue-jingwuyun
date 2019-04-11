import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import mutations from './mutations'
import getters from './getters'
import tips from './modules/tips'
import tabs from './modules/tabs'
import pgisMap from './modules/pgis'
import dictList from './modules/dictList'
import searchWhere from './modules/searchWhere'
import socketConnect from './modules/socketConnect'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    ...modules,
    tips,
    tabs,
    pgisMap,
    dictList,
    searchWhere,
    socketConnect
  },
  mutations: {
    ...mutations
  },
  getters: {
    ...getters
  }
})
