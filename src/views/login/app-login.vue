<template>
  <div class="app-login">
    <header class="login-header" />

    <p class="login-rrm-title">
      <img :src="loginAm" alt=" ">
    </p>

    <main class="login-main">
      <div class="title">
        <h3>Welcome to login</h3>
        <h5>Contact the administrator to obtain the login account</h5>
      </div>

      <form>
        <input
          v-model.trim="userBeanBase.username"
          placeholder="account"
          autofocus
          autocomplete="current-username"
          @keyup.enter="login"
        >

        <input
          v-model.trim="userBeanBase.password"
          placeholder="password"
          type="password"
          autocomplete="current-password"
          @keyup.enter="login"
        >

        <el-button
          color="#333333"
          size="large"
          style="width: 100%"
          :loading="loading"
          @click="login"
        >
          Log in
        </el-button>
      </form>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router'
import {AxiosResult} from '@utils/interface'
import {doLogin} from './loginOptions'
import {LoginSuccess} from '@utils/types'
import BChannel from '../../utils/channel/BChannel'
import {BCEnum} from '@utils/channel/channelModels'
import {RUEnum} from '../../router/routerModels'
import LocalStorage from '../../class/LocalStorage'
import {LSEnum} from './loginModels'
import {UserBeanBase} from '../admin/user/userModel'
import loginAm from '@assets/image/login-am.svg'

const router = useRouter()
const loading = ref(false)

const {
  postMessage,
} = BChannel()

const userBeanBase = reactive<UserBeanBase>({
  username: 'admin',
  password: '123456',
})

const local = new LocalStorage()

// 登录成功回调
const loginSuccess: LoginSuccess = (data: AxiosResult) => {
  const cache = data.data
  local.setToken(cache.token)
  local.setLoginStatus(LSEnum.LOG_ITEM)
  local.setLoginUsername(userBeanBase.username, cache.id)
  postMessage({ code: BCEnum.LOGIN, message: '登录成功' })
  router.replace(RUEnum.ITEM)
}

const login = () => {
  loading.value = true
  doLogin(userBeanBase, loginSuccess, loading)
}
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/app-login";
</style>