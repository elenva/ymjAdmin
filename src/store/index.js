import Vue from 'vue'
import Vuex from 'vuex'
import request from '@/utils/request.js'

Vue.use(Vuex)
const sessionState = sessionStorage.getItem("state");

const state = sessionState?JSON.parse(sessionState):{
  baseCourse:[],//课程类别
  userInfo:null,
}

export default new Vuex.Store({
  state,
  mutations: {
    setBaseCourse(state,data){
      state.baseCourse = data
    },
    setUserInfo(state,data){
      state.userInfo = data
    },
  },
  actions:{
    getBaseCourse({state,commit}){
      request({url: '/course/getBaseCourse'})
        .then(res=> commit(`setBaseCourse`,res.datas))
    }
  }
})

