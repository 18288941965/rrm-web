<template>
  <header class="inst-header">
    <div>欢迎你：{{ userInfoObj.userName }}</div>
    <el-button
      type="danger"
      @click="logout"
    >
      退出登录
    </el-button>
  </header>
<!--  <main class="inst-main">
    <div>
      <ul id="institution-ul-scroll">
        <li
          v-for="(inst, index) in instList"
          :key="'inst-' + index"
          class="inst-item-li"
        >
          <span class="name">{{ inst.instName }}</span>
          <span class="code">{{ inst.instCode }}</span>
          <el-button
            plain
            class="inst-sel-btn"
            type="success"
            @click="changeInst(inst)"
          >
            进入
          </el-button>
          <div class="inst-roles">
            <ul>
              <li
                v-for="(role, idx) in inst.roles"
                :key="'inst-role-' + index + idx"
              >
                <span>{{ role.roleName }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </main>-->
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import {AxiosResult} from '@utils/interface'
import LocalStorage from '../../class/LocalStorage'
import {doLogout, logoutContext} from './loginOptions'
import {LoginSuccess} from '@utils/types'
import {RUEnum} from '../../router/routerModels'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'AppItem',
  setup() {
    const router = useRouter()

    const local = new LocalStorage()
    const userInfoObj = local.getUserInfoObj()

    const {
      logoutSuccess,
    } = logoutContext()

    const logout = () => {
      doLogout(logoutSuccess)
    }

    // 选择任职机构成功的回调函数
    const loginSuccess: LoginSuccess = (data: AxiosResult) => {
      router.replace(RUEnum.HOME)
    }

    onMounted(() => {

    })

    return {
      userInfoObj,
      logout,
    }
  },
})
</script>

<style scoped lang="scss">
@use "@assets/scss/mixin/_mixin.scss" as *;
</style>