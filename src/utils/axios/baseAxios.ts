import axios, {AxiosResponse} from 'axios'
import {AxiosResult} from '../interface'
import {ElMessage} from 'element-plus/es'
import {useRouter} from 'vue-router'

export default function () {
    const router = useRouter()

    axios.defaults.baseURL = '/api'

    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
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
            ElMessage.error(data.msg)
            return response
        }

        // TODO 其他code值，根据后端约定判断

        return response
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
    })
}
