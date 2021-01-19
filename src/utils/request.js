import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Message, Notification,Loading } from 'element-ui'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
  withCredentials: true,
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000000, // request timeout
  headers: {
    'content-type': 'application/json'
  },
  paramsSerializer: function(params) {
    return Qs.stringify(params, {encodeValuesOnly: true})
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['baoziToken'] = getToken()
    }
    if (_.indexOf(config.url, '?') != -1) {
      config.url = config.url + '&hash=' + new Date().getTime();
    } else {
      config.url = config.url + '?hash=' + new Date().getTime();
    }

    return config;
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {

    const res = response.data
    return res
  },
  error => {
    let message = error.message

    switch (error.response.status) {
      case 401:
        message = '登录超时，请重新登录'
        break
      case 404:
        message = "请求错误，未找到资源"
        break
      default:
        message = error.response.data.message

    }
    Notification({
      type: 'error',
      title: '错误提示',
      message: message,
      duration: 2 * 1000
    });
    return Promise.reject(message)
  }
)

export default service
