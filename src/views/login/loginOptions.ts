import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {ElMessage} from 'element-plus'
import {LoginSuccess, LogoutSuccess} from '@utils/types'
import {useRouter} from 'vue-router'
import BChannel from '../../utils/channel/BChannel'
import {BCEnum} from '@utils/channel/channelModels'
import {RUEnum} from '../../router/routerModels'
import LocalStorage from '../../class/LocalStorage'
import {LoginBean} from './loginModels'
import {Ref} from 'vue'

// 退出系统
const doLogout = (logoutSuccess: LogoutSuccess) => {
    axios.get('/auth/logout').then((res: { data: AxiosResult }) => {
        if (res.data.code === 200) {
            logoutSuccess()
        }
    })
}

// 登录系统
const doLogin = (loginBean: LoginBean, loginSuccess: LoginSuccess, loading: Ref<Boolean>) => {
    if (!loginBean.username || !loginBean.password) {
        ElMessage.error('用户名或密码不能为空！')
        return
    }
    axios.post('/auth/login', { ...loginBean }).then((res: { data: AxiosResult }) => {
        if (res.data.code === 200) {
            loginSuccess(res.data)
        }
    }).catch(() => {
        loading.value = false
    })
}

// 退出登录的回调函数内容
function logoutContext () {
    const router = useRouter()
    const local = new LocalStorage()
    const {
        postMessage,
    } = BChannel()

    const logoutSuccess: LogoutSuccess = () => {
        local.cleanUserInfoObj()
        postMessage({ code: BCEnum.LOGOUT, message: '您已在其他窗口退出登录' })
        router.replace(RUEnum.LOGIN)
    }
    return {
        logoutSuccess,
    }
}

export {
    doLogout,
    doLogin,
    logoutContext,
}