<template>
  <div class="user-avatar">
    <details
      id="user-avatar-container"
    >
      <summary>
        <slot name="summary" />
      </summary>

      <div
        class="user-avatar-overlay"
        @click="closeDetails('user-avatar-container')"
      >
        <ul class="global-overlay-base">
          <li class="li-information">
            {{ userName }}
          </li>
          <li
            class="li-action-item"
            @click="dialogOpenSetting"
          >
            <Discover />
            系统设置
          </li>
          <li
            class="li-action-item"
            @click="dialogOpenUserPass"
          >
            <Key />
            修改密码
          </li>
          <li class="li-divider" />
          <li
            class="li-action-item"
            @click="logout"
          >
            <Logouts />
            退出登录
          </li>
        </ul>
      </div>
    </details>

    <app-settings-drawer
      v-bind="dialogSetting"
      @close-dialog="dialogCloseSetting"
    />

    <user-pass-drawer
      v-bind="dialogUserPass"
      @close-dialog="dialogCloseUserPass"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {doLogout, logoutContext} from '../../views/login/loginOptions'
import {
  Discover,
  Logouts,
    Key,
} from '../svicon/publicIcon'
import {dialogEmptyContent} from '@utils/dialogOptions'
import AppSettingsDrawer from '../settings/app-settings-drawer.vue'
import UserPassDrawer from '../../views/admin/user/user-pass-drawer.vue'
import {closeDetails} from '@utils/utils'

export default defineComponent({
  name: 'UserAvatar',
  components: {
    Discover,
    Logouts,
    Key,
    AppSettingsDrawer,
    UserPassDrawer,
  },
  props: {
    userName: {
      type: String,
      default: '',
    },
  },
   setup () {
     const {
        dialogEmpty: dialogSetting,
       dialogEmptyOpen: dialogOpenSetting,
       dialogEmptyClose: dialogCloseSetting,
     } = dialogEmptyContent()

     const {
       dialogEmpty: dialogUserPass,
       dialogEmptyOpen: dialogOpenUserPass,
       dialogEmptyClose: dialogCloseUserPass,
     } = dialogEmptyContent()

     const {
       logoutSuccess,
     } = logoutContext()

     const logout = () => {
      doLogout(logoutSuccess)
     }

    return {
      logout,
      closeDetails,
      dialogSetting,
      dialogOpenSetting,
      dialogCloseSetting,
      dialogUserPass,
      dialogOpenUserPass,
      dialogCloseUserPass,
    }
   },
})
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/components/user-avatar";
</style>