import {RouteRecordRaw} from 'vue-router'

const systemRouter: RouteRecordRaw[] = [
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
  {
    path: 'item/index',
    name: 'ItemIndex',
    component: () => import('../views/admin/item/item-index.vue'),
    meta: { title: 'ItemIndex' },
  },
  {
    path: 'user/index',
    name: 'UserIndex',
    component: () => import('../views/admin/user/user-index.vue'),
    meta: { title: 'UserIndex' },
  },
  {
    path: 'menu/index',
    name: 'MenuIndex',
    component: () => import('../views/external/menu/menu-index.vue'),
    meta: { title: 'MenuIndex' },
  },
  {
    path: 'role/index',
    name: 'RoleIndex',
    component: () => import('../views/external/role/role-index.vue'),
    meta: { title: 'RoleIndex' },
  },
  {
    path: 'resource/index',
    name: 'ResourceIndex',
    component: () => import('../views/external/resource/resource-index.vue'),
    meta: { title: 'ResourceIndex' },
  },
  {
    path: 'dict/index',
    name: 'DictIndex',
    component: () => import('../views/external/dict/dict-index.vue'),
    meta: { title: 'DictIndex' },
  },
  {
    path: 'org/index',
    name: 'OrgIndex',
    component: () => import('../views/external/org/org-index.vue'),
    meta: { title: 'OrgIndex' },
  },
  {
    path: 'users/index',
    name: 'UsersIndex',
    component: () => import('../views/external/users/users-index.vue'),
    meta: { title: 'UsersIndex' },
  },
]

export default systemRouter
