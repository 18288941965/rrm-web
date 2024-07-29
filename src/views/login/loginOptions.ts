import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {ElMessage} from 'element-plus'
import {LoginSuccess, LogoutSuccess} from '@utils/types'
import {useRouter} from 'vue-router'
import BChannel from '../../utils/channel/BChannel'
import {BCEnum} from '@utils/channel/channelModels'
import {RUEnum} from '../../router/routerModels'
import LocalStorage from '../../class/LocalStorage'
import {LSEnum, LoginBean} from './loginModels'

// 退出系统
const doLogout = (logoutSuccess: LogoutSuccess) => {
    axios.get('/admin/doLogout').then((res: { data: AxiosResult }) => {
        if (res.data.code === 200) {
            logoutSuccess()
        }
    })
}

// 登录系统
const doLogin = (loginBean: LoginBean, loginSuccess: LoginSuccess) => {
    if (!loginBean.username || !loginBean.password) {
        ElMessage.error('用户名或密码不能为空！')
        return
    }
    axios.post('/admin/doLogin', { ...loginBean }).then((res: { data: AxiosResult }) => {
        if (res.data.code === 200) {
            loginSuccess(res.data)
        }
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
        local.setLoginStatus(false, LSEnum.LOG_OUT)
        postMessage({ code: BCEnum.LOGOUT, msg: '您已在其他窗口退出登录' })
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