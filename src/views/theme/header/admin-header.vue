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
      v-show="getMenuLabel"
      class="active-menu-label"
    >
      <span>/</span>
      <span>{{ getMenuLabel }}</span>
    </div>

    <div class="empty-flex" />

    <div class="star-container mgr-medium">
      <button
        class="icon-button-inner"
        @click="handleStar"
      >
        <StarFill
          v-if="isStar"
          color="#409EFF"
        />
        <Star v-else />
      </button>
      <span class="split" />
      <details
        id="star-menu-container"
        :data-disabled="activeMenus.menus.length === 0"
      >
        <summary
          class="icon-button-inner hv-bg"
        >
          <Expand :size="10" />
        </summary>
        <div
          class="star-menu-overlay"
          @click="closeDetails('star-menu-container')"
        >
          <nav class="global-active card-scroll">
            <ul class="global-overlay-base">
              <template
                v-for="(menu, index) in starMenus"
                :key="'li-0-' + index"
              >
                <li
                  v-if="menu.url"
                  class="global-menu-item-wrapper"
                >
                  <router-link
                    class="global-menu-item"
                    :to="menu.url"
                    @click="pushRouter(menu)"
                  >
                    <span>{{ menu.label }}</span>
                  </router-link>
                </li>
              </template>
            </ul>
          </nav>
        </div>
      </details>
    </div>

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
      :user-name="userName"
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
import {
  Star,
  StarFill,
  Search,
  Expand,
  PersonFill,
} from '../../../components/svicon/publicIcon'
import LocalStorage from '../../../class/LocalStorage'
import axios from 'axios'
import {AxiosResult} from '@utils/interface'
import {closeDetails} from '@utils/utils'
import {ElMessage} from 'element-plus/es'

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
    const userName = ref('')

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

    // 获取登录用户 + 登录单位下收藏的菜单
    // 这里可考虑自动刷新其他标签页的收藏菜单，也可让用户自动刷新页面。
    const starMenus = ref<MenuBean[]>([])
    const getStarMenus = () => {
      axios.get('/admin/getStarMenu').then((res: {data: AxiosResult}) => {
        if (res.data.code === 200) {
          starMenus.value = res.data.data
        }
      })
    }
    const isStar =  computed(() => {
      return starMenus.value.map(item => item.id).includes(props.activeMenus.menuId)
    })

    const handleStar = () => {
       ElMessage.warning('模板未提供此事件！')
    }

    onMounted(() => {
      const local = new LocalStorage()
      const userInfoObj = local.getUserInfoObj()
      userName.value = userInfoObj.userName

      getStarMenus()
    })

    return {
      userName,
      getMenuLabel,
      pushRouter,
      isStar,
      starMenus,
      closeDetails,
      handleStar,
    }
  },
})
</script>

<style lang="scss">
@use "@assets/scssscoped/theme/admin-header";
</style>