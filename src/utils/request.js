// 引入axios
import axios from 'axios'
import store from '@/store'
// import { config } from 'vue/types/umd'
// 配置axios的默认配置
//  - 创建一个全新的axios的对象, 克隆
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

request.interceptors.request.use(
  // 想在发送请求钱做什么
  // config 本次请求的配置
  // 必须要返回出去
  (config) => {
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  // 请求错误的时候，处理的方法
  (error) => {
    return Promise.reject(error)
  }
)

export default request
