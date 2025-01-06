<template>
  <div
    v-if="menus.length > 0"
    class="admin-el-menu menu-scroll"
  >
    <el-menu
      ref="adminMenuRef"
      :collapse="collapse"
      :default-openeds="menuDefaultOpeneds"
      :default-active="menuId"
    >
      <template
        v-for="(menu, index) in menus[0].children"
        :key="'menu-' + index"
      >
        <el-menu-item
          v-if="!menu.children || menu.children.length === 0"
          :key="index + '_' + menu.id"
          :index="menu.id"
          :class="{'menu-active' : menu.id === menuId }"
          @click="pushRouter(menu)"
        >
          <i
            class="menu-icon"
          >
            <component
              :is="menu.icon.toString()"
              v-if="menu.icon"
            />
          </i>

          <template #title>
            <span>{{ menu.label }}</span>
          </template>
        </el-menu-item>

        <el-sub-menu
          v-else
          :key="index + '_' + menu.id"
          :index="menu.id"
        >
          <template #title>
            <i class="menu-icon">
              <component
                :is="menu.icon.toString()"
                v-if="menu.icon"
              />
            </i>
            <span>{{ menu.label }}</span>
          </template>
          <admin-menu-child
            :menus="menu.children"
            :menu-id="menuId"
            @push-router="pushRouter"
          />
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import AdminMenuChild from './admin-menu-child.vue'
import {RrmMenuBean} from './menuModels'
import {MenuOptions} from './menuOptions'
import {useRouter} from 'vue-router'
import {PushRouter} from '@utils/types'
import rrmMenuDfs from '../../../algo/rrmMenuDfs'

export default defineComponent({
  name: 'AdminMenu',
  components: {
    AdminMenuChild,
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
  emits: ['push-router', 'set-parent-menu', 'set-active-node'],
  setup (props, {emit}) {
    const router = useRouter()
    const adminMenuRef = ref()

    const {
      menus,
      menuDefaultOpeneds,
      getMenus,
    } = MenuOptions()

    // 2、滚动到当前的元素
    const scrollTarget = () => {
      const targetElement = document.getElementsByClassName('menu-active')
      if (targetElement.length > 0) {
        targetElement[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
    }

    const setActivePath = (menuId: string) => {
      const menuPath = rrmMenuDfs(menus.value[0], menuId, false)
      emit('set-active-node', menuPath)
    }

    // 1、展开当前的菜单
    const menuOpen = (index: string) => {
      const menuPrev = rrmMenuDfs(menus.value[0], index)
      if (menuPrev.length > 1) {
        index = menuPrev[menuPrev.length - 2].id
      }
      adminMenuRef.value?.open(index)
      scrollTarget()
    }

    const pushRouter: PushRouter = (menu: RrmMenuBean) => {
      if (menu.id === props.menuId) {
        return
      }
      emit('push-router', menu)
      setActivePath(menu.id)
    }

    const loadCallback = (id: string, label: string, icon = '') => {
      emit('set-parent-menu', id, label, icon)
    }

    onMounted(() => {
      const routerPath =  router.currentRoute.value.path

      getMenus(pushRouter, routerPath, loadCallback)
    })

    return {
      menus,
      pushRouter,
      menuDefaultOpeneds,
      adminMenuRef,
      menuOpen,
      setActivePath,
    }
  },
})
</script>
<style lang="scss">
  @import "@assets/scss/theme/_admin-menu.scss";
</style>