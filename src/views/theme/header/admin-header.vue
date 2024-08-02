<template>
  <header class="admin-header">
    <slot name="default" />

    <admin-logo
      class="theme-header-ht"
      :menu-collapse="false"
      :module-icon="moduleIcon"
      :module-label="moduleLabel"
    />

    <div
      class="active-menu-label"
    >
      <span>–</span>
      <span>{{ userInfoObj.itemName }}</span>
    </div>
    
    <div
      v-show="getMenuLabel"
      class="active-menu-label"
    >
      <span>-</span>
      <span>{{ getMenuLabel }}</span>
    </div>

    <div class="empty-flex" />

    <app-search>
      <template #button>
        <button
          class="icon-button mgr-medium"
        >
          <Search />
        </button>
      </template>
    </app-search>

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
import {ActiveMenus, MenuBean} from '../menu/menuModels'
import AppSearch from '../../../app-search.vue'
import AppTheme from '../../../app-theme.vue'
import UserAvatar from '../../../components/avatar/user-avatar.vue'
import {Expand, PersonFill, Search, Star, StarFill,} from '../../../components/svicon/publicIcon'
import LocalStorage from '../../../class/LocalStorage'
import {LocalUserInfoBean} from '@utils/interface'
import {closeDetails} from '@utils/utils'

export default defineComponent({
  name: 'AdminHeader',
  components: {
    AdminLogo,
    AppSearch,
    AppTheme,
    UserAvatar,
    Star,
    StarFill,
    Search,
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
      default: undefined,
    },
    moduleLabel: {
      type: String,
      default: undefined,
    },
    activeMenus: {
      type: Object as PropType<ActiveMenus>,
      required: true,
    },
  },
  emits: ['push-router'],
  setup (props, {emit}) {
    const userInfoObj = ref<LocalUserInfoBean>({
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

    const pushRouter = (menu: MenuBean) => {
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
@use "@assets/scssscoped/theme/admin-header";
</style>