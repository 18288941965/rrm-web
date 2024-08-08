import axios, {AxiosResponse} from 'axios'
import {AxiosResult} from '../interface'
import {ElMessage} from 'element-plus/es'
import LocalStorage from '../../class/LocalStorage'
import {LogoutSuccess} from '@utils/types'

export default function (logoutSuccess: LogoutSuccess) {
    axios.defaults.baseURL = '/api'

    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        const token = new LocalStorage().getToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        // Do something before request is sent
        return config
    }, function (error) {
        // Do something with request error
        return Promise.reject(error)
    })

    // Add a response interceptor
    axios.interceptors.response.use(function (response: AxiosResponse<AxiosResult, any>) {
        // 跳过检查
        const skipCheck = Boolean(response.config.headers.SkipCheck)
        if (skipCheck) {
            return response
        }

        const data = response.data
        if (!data) {
            ElMessage.error('未知的返回值类型！请按约定返回一致的数据类型')
            return response
        }

        if (data.code !== 200) {
            ElMessage.error(data.message)
            return response
        }

        // TODO 其他code值，根据后端约定判断

        return response
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (error.response.status === 401) {
            logoutSuccess()
            return new Promise(() => {})
        }

        ElMessage.error(error.message)

        return Promise.reject(error)
    })
}
