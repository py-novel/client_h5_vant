import axios from 'axios'
import NProgress from 'nprogress'
import qs from 'qs'
import { Toast } from 'vant'
import { apiPrefix } from '../configs/config'

const instance = axios.create({
    baseURL: apiPrefix,
    timeout: 30000,
    // withCredentials: true,
})

// 添加一个请求拦截器
instance.interceptors.request.use((config) => {
    NProgress.start()
    return config
}, (error) => {
    return Promise.reject(error)
})

// 添加一个响应拦截器
instance.interceptors.response.use((response) => {
    NProgress.done()
    return response
}, (error) => {
    NProgress.done()
    return Promise.reject(error)
})

/**
 * 处理成功时响应
 */
function handleSucc(response, opt) {
    console.log(`【${opt.method} ${opt.url}】请求成功，响应数据：%o`, response)

    if (response.data.code !== '0000') {  // 打印业务错误提示
        Toast(response.data.message)
    }

    return { ...response.data }
}

/**
 * 处理失败时响应
 */
function handleFail(error, opt) {
    // 请求配置发生的错误
    if (!error.response) {
        return console.log('Error', error.message)
    }

    // 响应时状态码处理 
    const status = error.response.status
    const errortext = error.response.statusText

    // 开发时使用，上线时删除
    console.log(`【${opt.method} ${opt.url}】请求失败，响应数据：%o`, error.response)

    return { code: status, message: errortext }
}

function request(opt) {
    if (!opt.headers || !opt.headers.Authorization) {
        const token = localStorage.getItem('token') || ''
        instance.defaults.headers = { Authorization: `Bearer ${token}` }
    }

    // 传参序列化，主要支持传递数组
    if (opt.params) {
        opt.paramsSerializer = params => {
            return qs.stringify(params, { indices: false })
        }
    }

    return instance(opt)
        .then((response) => handleSucc(response, opt))
        .catch((error) => handleFail(error, opt))
}

export default request