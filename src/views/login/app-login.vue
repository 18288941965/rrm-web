<template>
  <div class="app-login">
    <header class="login-header">

    </header>

    <main class="login-main">
      <div class="title">
        <img
          :src="logo"
          alt=" "
        >
        <p>RRM</p>
      </div>

      <section>
        <input
          v-model.trim="loginBean.username"
          placeholder="账号"
          autofocus
          @keyup.enter="login"
        >

        <input
          v-model.trim="loginBean.password"
          placeholder="密码"
          type="password"
          @keyup.enter="login"
        >

        <el-button
          color="#1F883D"
          size="large"
          style="width: 100%"
          @click="login"
        >
          登录
        </el-button>
      </section>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from 'vue'
import {useRouter} from 'vue-router'
import logo from '@assets/logo.png'
import {GitHub} from '../../components/svicon/publicIcon'
import {AxiosResult} from '@utils/interface'
import {doLogin} from './loginOptions'
import {LoginSuccess} from '@utils/types'
import BChannel from '../../utils/channel/BChannel'
import {BCEnum} from '@utils/channel/channelModels'
import {RUEnum} from '../../router/routerModels'
import LocalStorage from '../../class/LocalStorage'
import {LSEnum, LoginBean} from './loginModels'

const router = useRouter()

const {
  postMessage,
} = BChannel()

const loginBean = reactive<LoginBean>({
  username: 'admin@163.com',
  password: 'admin',
})

const local = new LocalStorage()

// 登录成功回调
const loginSuccess: LoginSuccess = (data: AxiosResult) => {
  local.setLoginStatus(true, LSEnum.LOG_INST, loginBean.username)
  postMessage({ code: BCEnum.LOGIN, msg: '登录成功' })
  router.replace(RUEnum.ITEM)
}

const login = () => {
  doLogin(loginBean, loginSuccess)
}
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/base/app-login";
</style>