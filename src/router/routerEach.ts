// 路由前置守卫
import LocalStorage from '../class/LocalStorage'
import NProgress from '../NProgress'
import {useRouter} from 'vue-router'
import {RUEnum} from './routerModels'

const routerEach = () => {

    const router = useRouter()

    const {
        NProgressStart,
        NProgressDone,
    } = NProgress()

    router.beforeEach((to, from, next) => {
        NProgressStart(to.path)
        const loginStatus = new LocalStorage().getLoginStatus()

        // 本地缓存状态为已登录: 如果是跳转到登录页或者是选择项目则跳转到首页，其他则正常跳转
        if (loginStatus === '1') {
            if (to.path === RUEnum.LOGIN || to.path === RUEnum.ITEM) {
                next(RUEnum.HOME)
            } else {
                next()
            }
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