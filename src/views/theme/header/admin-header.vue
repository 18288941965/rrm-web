<template>
  <header class="admin-header">
    <slot name="default" />

    <admin-logo
      class="theme-header-ht"
      :menu-collapse="false"
      :module-icon="moduleIcon"
      :module-label="userInfoObj.itemName"
      :module-code="userInfoObj.itemCode"
    />

    <div
      v-show="getMenuLabel"
      class="active-menu-label"
    >
    </div>

    <div class="empty-flex" />

    <app-theme class="mgr-medium" />

    <user-avatar
      :user-name="userInfoObj.userName"
      class="user-avatar-container arrow-down"
    >
      <template #summary>
        <PersonFill />
        <Expand
          :size="10"
          class="expand-mg"
        />
      </template>
    </user-avatar>
  </header>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, ref} from 'vue'
import AdminLogo from '../../logo/admin-logo.vue'
import {ActiveMenus, RrmMenuBean} from '../menu/menuModels'
import AppTheme from '../../../app-theme.vue'
import UserAvatar from '../../../components/avatar/user-avatar.vue'
import {Expand, PersonFill} from '../../../components/svicon/publicIcon'
import LocalStorage from '../../../class/LocalStorage'
import {LocalUserInfoBean} from '@utils/interface'
import {closeDetails} from '@utils/utils'

export default defineComponent({
  name: 'AdminHeader',
  components: {
    AdminLogo,
    AppTheme,
    UserAvatar,
    Expand,
    PersonFill,
  },
  props: {
    menuCollapse: {
      type: Boolean,
      default: false,
    },
    moduleIcon: {
      type: String,
    },
    moduleLabel: {
      type: String,
      default: null,
    },
    activeMenus: {
      type: Object as PropType<ActiveMenus>,
      required: true,
    },
  },
  emits: ['push-router'],
  setup (props, {emit}) {
    const userInfoObj = ref<LocalUserInfoBean>({
      id: -1,
      fontType: '',
      loginStatus: '',
      themeModel: '',
      userName: '',
      token: '',
      itemCode: '',
      itemName: '',
    })

    const getMenuLabel = computed(() => {
      if (!props.activeMenus.menuId || !props.activeMenus.menus) {
        return ''
      }
      const menuBean = props.activeMenus.menus.find(item => item.id === props.activeMenus.menuId)
      return menuBean ? menuBean.label : ''
    })

    const pushRouter = (menu: RrmMenuBean) => {
      if (menu.id === props.activeMenus?.menuId) {
        return
      }
      emit('push-router', menu)
    }

    onMounted(() => {
      const local = new LocalStorage()
      userInfoObj.value = local.getUserInfoObj()
    })

    return {
      userInfoObj,
      getMenuLabel,
      pushRouter,
      closeDetails,
    }
  },
})
</script>

<style lang="scss">
@use "@assets/scssscoped/admin-header";
</style>