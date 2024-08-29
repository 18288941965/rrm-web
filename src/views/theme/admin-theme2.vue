<template>
  <div class="admin-theme">
    <admin-header
      class="theme-header-ht"
      :module-icon="rootMenu.icon"
      :module-label="rootMenu.label"
      :menu-collapse="menuCollapse"
      :active-menus="activeMenus"
      @push-router="pushRouter"
    />

    <div
      class="layout-fixed theme2-nav theme-header-ht__nav"
    >
      <div
        class="theme2-nav__left"
      >
        <button
          class="icon-button menu-collapse-icon"
          @click="setMenuCollapse(!menuCollapse)"
        >
          <MenuOpen
            :class="{'icon-rotate' : menuCollapse }"
          />
        </button>

        <el-tooltip
          content="选择打开的菜单"
          placement="bottom-start"
          :enterable="false"
          :show-after="500"
        >
          <button
            class="icon-button mgr-medium"
            @click="menuOpen"
          >
            <Adjust />
          </button>
        </el-tooltip>
      </div>

      <nav class="theme2-nav__right">
        <ul id="theme2-nav-ul-scroll">
          <template
            v-for="(menu, index) in activeMenus.menus"
            :key="'header-menu-' + index"
          >
            <li
              v-if="menu.url"
              class="nav-item-li"
            >
              <router-link
                class="nav-item"
                :class="{'green-mark' : menu.cache }"
                :to="menu.url"
                @click.stop="pushRouter(menu)"
              >
                <span>{{ menu.label }}</span>
              </router-link>

              <button
                class="menu-close-button-base"
                @click="cleanHistory(menu.id)"
              >
                <Close :size="8" />
              </button>
            </li>
          </template>
        </ul>
      </nav>
    </div>
    
    <main
      id="admin-theme-main"
      class="layout-dynamic main-grid"
      style="--sticky-pane-height: calc(100vh - var(--header-banner-height));"
      :class="{'layout-dynamic-collapse' : menuCollapse}"
    >
      <div
        class="theme-left-wrapper"
        style="height: var(--sticky-pane-height);"
      >
        <admin-menu
          ref="adminThemeMenuRef"
          :collapse="menuCollapse"
          :menu-id="activeMenus.menuId.toString()"
          @push-router="pushRouter"
          @set-parent-menu="setParentMenu"
        />
      </div>

      <router-view
        v-slot="{ Component }"
        class="theme-content"
      >
        <keep-alive :include="keepAliveInclude">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import AdminMenu from './menu/admin-menu.vue'
import {RrmMenuBean} from './menu/menuModels'
import {MenuStatusContent} from './menu/menuOptions'
import AdminHeader from './header/admin-header.vue'
import {themeBaseContext, updateBrowserTitle} from './adminThemeBase'
import {
  Adjust,
  MenuOpen,
  Close,
} from '../../components/svicon/publicIcon'
import {useScrollSticky, useScrollHorizontalMenu} from '@utils/event'

export default defineComponent({
  name: 'AdminTheme2',
  components: {
    AdminMenu,
    AdminHeader,
    Adjust,
    MenuOpen,
    Close,
  },
  setup () {
    const {
      router,
      rootMenu,
      setParentMenu,
    } = themeBaseContext()

    const adminThemeMenuRef = ref()
    const {
      activeMenus,
      menuCollapse,
      setMenuCollapse,
      updateActiveMenus,
      cleanActiveMenus,
      keepAliveInclude,
      cleanKeepAliveInclude,
      updateKeepAliveInclude,
    } = MenuStatusContent()

    const pushRouter = async (menu: RrmMenuBean) => {
      if (menu.cache && menu.name) {
        updateKeepAliveInclude(menu.name)
      }
      // 刷新页面相同路由页面执行此方法，这里没有做判断，因为同一地址框架默认不会再重复加载
      await router.push(menu.url as string)
      updateActiveMenus(menu)
      updateBrowserTitle(`${menu.label as string} • ${rootMenu.label}`)
    }

    const menuOpen = () => {
      adminThemeMenuRef.value?.menuOpen(activeMenus.menuId)
    }

    const cleanHistory = (id: string | undefined) => {
      const index = activeMenus.menus.findIndex(item => item.id === id)
      cleanKeepAliveInclude(id)
      cleanActiveMenus(id, index)
      if (activeMenus.menus.length === 0) {
        const rootPath = router.currentRoute.value.matched[0].path
        router.push(rootPath)
        return
      }
      // 关闭当前打开窗口后：先右后左的切换
      if (!activeMenus.menuId) {
        let temp: RrmMenuBean | undefined
        if (activeMenus.menus.length -1  >= index) {
          temp = activeMenus.menus[index]
        } else {
          temp = activeMenus.menus[index - 1]
        }
        pushRouter(temp)
      }
    }

    useScrollSticky('#admin-theme-main')
    useScrollHorizontalMenu('#theme2-nav-ul-scroll', 190)

    return {
      rootMenu,
      adminThemeMenuRef,
      activeMenus,
      menuCollapse,
      setMenuCollapse,
      keepAliveInclude,

      setParentMenu,
      pushRouter,
      menuOpen,
      cleanHistory,
    }
  },
})
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/theme/admin-theme2";
</style>