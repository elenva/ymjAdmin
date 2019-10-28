import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request.js'

Vue.use(Vuex)

const state =  {
  baseCourse:[],//课程类别
}

export default new Vuex.Store({
  state,
  mutations: {
    setBaseCourse(state,data){
      state.baseCourse = data
    }
  },
  actions:{
    getBaseCourse({state,commit}){
      request({url: '/course/getBaseCourse'})
        .then(res=> commit(`setBaseCourse`,res.datas))
    }
  }
})

