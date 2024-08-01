// 路由前置守卫
import LocalStorage from '../class/LocalStorage'
import NProgress from '../NProgress'
import {useRouter} from 'vue-router'
import {RUEnum} from './routerModels'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'

const routerEach = () => {

    const router = useRouter()

    const {
        NProgressStart,
        NProgressDone,
    } = NProgress()

    const isLogin = () => {
        return  axios.get('/auth/isLogin').then((res: { data: AxiosResult }) => {
            return res.data
        })
    }

    router.beforeEach((to, from, next) => {
        NProgressStart(to.path)

        const localStorage = new LocalStorage()
        const loginStatus = localStorage.getLoginStatus()

        // 本地缓存状态为已登录: 如果是跳转到登录页或者是选择项目则跳转到首页，其他则正常跳转
        if (loginStatus === '1') {
            isLogin().then(data => {
                if (data.data) {
                    if (to.path === RUEnum.LOGIN || to.path === RUEnum.ITEM) {
                        next(RUEnum.HOME)
                    } else {
                        next()
                    }
                } else {
                    localStorage.cleanUserInfoObj()
                    next(RUEnum.LOGIN)
                }
            })
        }

        // 本地缓存状态为登录未选择项目：
        if (loginStatus === '2') {
            if (to.path === RUEnum.ITEM) {
                next()
            } else {
                next(RUEnum.ITEM)
            }
        }

        // 本地缓存状态为未登录：
        if (!loginStatus) {
            if (to.path === RUEnum.LOGIN) {
                next()
            } else {
                next(RUEnum.LOGIN)
            }
        }
    })

    // 路由后置守卫
    router.afterEach(() => {
        NProgressDone()
    })
}


export default routerEach