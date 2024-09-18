<template>
  <div class="app-login">
    <header class="login-header" />

    <p class="login-rrm-title">
      权限管理系统
    </p>

    <main class="login-main">
      <div class="title">
        <h3>欢迎登录</h3>
        <h5>项目初始创建请在数据库中<span>创建账号</span></h5>
      </div>

      <form>
        <input
          v-model.trim="userBeanBase.username"
          placeholder="账号"
          autofocus
          autocomplete="current-username"
          @keyup.enter="login"
        >

        <input
          v-model.trim="userBeanBase.password"
          placeholder="密码"
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
          登录
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

const router = useRouter()
const loading = ref(false)

const {
  postMessage,
} = BChannel()

const userBeanBase = reactive<UserBeanBase>({
  username: '',
  password: '',
})

const local = new LocalStorage()

// 登录成功回调
const loginSuccess: LoginSuccess = (data: AxiosResult) => {
  local.setToken(data.data)
  local.setLoginStatus(LSEnum.LOG_ITEM)
  local.setLoginUsername(userBeanBase.username)
  postMessage({ code: BCEnum.LOGIN, message: '登录成功' })
  router.replace(RUEnum.ITEM)
}

const login = () => {
  loading.value = true
  doLogin(userBeanBase, loginSuccess, loading)
}
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/base/app-login";
</style>