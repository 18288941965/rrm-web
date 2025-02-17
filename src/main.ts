import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import '@assets/css/var/element-dark.css'

import './style.css'
import '@assets/css/base/cover-element.css'
import '@assets/css/base/scroll.css'
import '@assets/css/base/nprogress.css'
import '@assets/css/base/animation.css'
import '@assets/scss/_base.scss'
import '@assets/scss/_base-button.scss'

import * as menuIcon from './components/svicon/menuIcon'

const app = createApp(App)
app.use(router)
app.use(ElementPlus, {})
app.mount('#app')

// 注册所有自定义图片
for (const [key, component] of Object.entries(menuIcon)) {
    app.component(key, component)
}