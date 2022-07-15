import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, setToken } from '@/utils'

Vue.use(Vuex)
export default new Vuex.Store({
  // user:{token}
  // null.token 报错
  // {}.token undifined
  state: {
    // 声明 token
    user: getToken() || {}
  },
  // 修改数据的地方
  mutations: {
    setUser (state, payload) {
      state.user = payload
      // 本地存储
      setToken(payload)
    }
  }
})
