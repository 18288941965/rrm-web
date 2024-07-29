<template>
  <div class="admin-menu-top mgr-medium">
    <details id="admin-menu-top-container">
      <summary class="icon-button hv-bg mgr-medium">
        <Apps />
      </summary>
      <div
        class="top-menu-overlay global-active menu-scroll"
        @click="closeDetails('admin-menu-top-container')"
      >
        <nav class="top-menu-overlay__body">
          <ul class="top-menu-column column-one-level">
            <li
              v-for="(menu, index) in getExcludeChildren"
              :key="'e-t-m-' + index"
            >
              <router-link
                class="global-menu-item menu-item"
                :to="menu.url ? menu.url : '/404/error'"
                @click="pushRouter(menu)"
              >
                <span>{{ menu.label }}</span>
              </router-link>
            </li>
          </ul>

          <div
            v-for="(item, index) in getIncludeChildren"
            :key="'i-t-m-' + index"
            class="top-menu-column"
          >
            <h6 class="menu-group-title">
              {{ item.label }}
            </h6>

            <admin-menu-top-child
              :menu-id="menuId"
              :menus="item.children"
              @push-router="pushRouter"
            />
          </div>
        </nav>
      </div>
    </details>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, computed} from 'vue'
import {MenuBean} from './menuModels'
import {MenuOptions} from './menuOptions'
import {useRouter} from 'vue-router'
import {PushRouter} from '@utils/types'
import menuDfs from '../../../algo/menuDfs'
import {Apps} from '../../../components/svicon/publicIcon'
import {closeDetails} from '@utils/utils'
import AdminMenuTopChild from './admin-menu-top-child.vue'

export default defineComponent({
  name: 'AdminMenuTop',
  components: {
    Apps,
    AdminMenuTopChild,
  },
  props: {
    collapse: {
      type: Boolean,
    },
    menuId: {
      type: String,
      required: true,
    },
  },
  emits: ['push-router', 'set-parent-menu', 'set-active-menu'],
  setup (props, {emit}) {
    const router = useRouter()
    const adminMenuRef = ref()

    const {
      menus,
      menuDefaultOpeneds,
      getMenus,
    } = MenuOptions()

    const setActivePath = (menuId: string) => {
      const menuPath = menuDfs(menus.value[0], menuId, false)
      emit('set-active-menu', menuPath)
    }

    const pushRouter: PushRouter = (menu: MenuBean) => {
      if (menu.id === props.menuId) {
        return
      }
      emit('push-router', menu)
      setActivePath(menu.id)
    }

    const loadCallback = (id: string, label: string, icon = '') => {
      emit('set-parent-menu', id, label, icon)
    }

    // 获取有子菜单的菜单
    const getIncludeChildren = computed(() => {
      if (menus.value.length === 0 || !menus.value[0].children) {
        return []
      }
      return (menus.value[0].children as Array<MenuBean>).filter(item => item.children && item.children.length > 0)
    })

    // 获取没有子菜单的菜单
    const getExcludeChildren = computed(() => {
      if (menus.value.length === 0 || !menus.value[0].children) {
        return []
      }
      return (menus.value[0].children as Array<MenuBean>).filter(item => !item.children || item.children.length === 0)
    })

    onMounted(() => {
      const routerPath =  router.currentRoute.value.path

      getMenus(pushRouter, routerPath, loadCallback)
    })

    return {
      menus,
      pushRouter,
      menuDefaultOpeneds,
      adminMenuRef,
      setActivePath,

      closeDetails,
      getIncludeChildren,
      getExcludeChildren,
    }
  },
})
</script>
<style lang="scss">
@use "@assets/scss/theme/_admin-menu-top.scss";
</style>