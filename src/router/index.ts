import {createRouter, createWebHistory} from 'vue-router'

import baseRoutes from './baseRoutes'

const routes = baseRoutes.concat([])

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 }
  },
  routes,
})

export default router
