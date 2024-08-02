import {RouteRecordRaw} from 'vue-router'
import menuDemoRouter from './menuDemoRouter'

const baseRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'AppLogin',
        component: () => import('../views/login/app-login.vue'),
        meta: { title: '登录' },
    },
    {
        path: '/app/item',
        name: 'AppItem',
        component: () => import('../views/admin/item/app-item.vue'),
        meta: { title: '选择维护项目' },
    },
    {
        path: '/app/home',
        name: 'AdminTheme2',
        component: () => import('../views/theme/admin-theme2.vue'),
        meta: { title: 'RRM'},
        children: menuDemoRouter,
    },
    {
        path: '/:pathMatch(.*)',
        name: '404Error',
        component: () => import('../views/error/404-error.vue'),
        meta: { title: '404' },
    },
]

export default baseRoutes