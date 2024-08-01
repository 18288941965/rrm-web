<template>
  <div class="app-login">
    <header class="login-header" />

    <main class="login-main">
      <div class="title">
        <img
          :src="logo"
          alt=" "
        >
        <p>RRM</p>
      </div>

      <form>
        <input
          v-model.trim="loginBean.username"
          placeholder="账号"
          autofocus
          autocomplete="current-username"
          @keyup.enter="login"
        >

        <input
          v-model.trim="loginBean.password"
          placeholder="密码"
          type="password"
          autocomplete="current-password"
          @keyup.enter="login"
        >

        <el-button
          color="#1F883D"
          size="large"
          style="width: 100%"
          :loading="loading"
          @click="login"
        >
          登录
        </el-button>
      </form>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import logo from '@assets/logo.png'
import {AxiosResult} from '@utils/interface'
import {doLogin} from './loginOptions'
import {LoginSuccess} from '@utils/types'
import BChannel from '../../utils/channel/BChannel'
import {BCEnum} from '@utils/channel/channelModels'
import {RUEnum} from '../../router/routerModels'
import LocalStorage from '../../class/LocalStorage'
import {LoginBean, LSEnum} from './loginModels'

const router = useRouter()
const loading = ref(false)

const {
  postMessage,
} = BChannel()

const loginBean = reactive<LoginBean>({
  username: '',
  password: '',
})

const local = new LocalStorage()

// 登录成功回调
const loginSuccess: LoginSuccess = (data: AxiosResult) => {
  local.setToken(data.data)
  local.setLoginStatus(LSEnum.LOG_ITEM)
  local.setLoginUsername(loginBean.username)
  postMessage({ code: BCEnum.LOGIN, message: '登录成功' })
  router.replace(RUEnum.ITEM)
}

const login = () => {
  loading.value = true
  doLogin(loginBean, loginSuccess, loading)
}
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/base/app-login";
</style>