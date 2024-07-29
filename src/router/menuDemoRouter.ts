import {RouteRecordRaw} from 'vue-router'

const menuDemoRouter: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/theme/admin-dashboard.vue'),
    meta: { title: 'AdminDashboard' },
  },
  {
    path: 'icon/demo',
    name: 'IconDemo',
    component: () => import('../views/demo/icon-demo.vue'),
    meta: { title: 'IconDemo' },
  },
  {
    path: 'ev/dic',
    name: 'EvDicDemo',
    component: () => import('../views/demoev/ev-dic-demo.vue'),
    meta: { title: 'EvDicDemo' },
  },
  {
    path: 'ev/pagination',
    name: 'EvPaginationDemo',
    component: () => import('../views/demoev/ev-pagination-demo.vue'),
    meta: { title: 'EvPaginationDemo' },
  },
]

export default menuDemoRouter
