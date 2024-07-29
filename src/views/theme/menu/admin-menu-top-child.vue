<template>
  <ul class="admin-menu-top-child">
    <template
      v-for="(menu, index) in menus"
      :key="'menu-' + index"
    >
      <template v-if="menu.children && menu.children.length > 0">
        <li
          class="menu-label"
          :style="{'--menu-level': menuLevel}"
        >
          {{ menu.label }}
        </li>
        <admin-menu-top-child
          :menu-id="menuId"
          :menus="menu.children"
          :menu-level="menuLevel + 1"
          @push-router="pushRouter"
        />
      </template>

      <li
        v-else-if="menu.url"
        :style="{'--menu-level': menuLevel}"
      >
        <router-link
          class="global-menu-item menu-item"
          :to="menu.url"
          @click="pushRouter(menu)"
        >
          <span>{{ menu.label }}</span>
        </router-link>
      </li>
    </template>
  </ul>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {MenuBean} from './menuModels'

export default defineComponent({
  name: 'AdminMenuTopChild',
  props: {
    menus: {
      type: Array as PropType<MenuBean[]>,
      default: () => {
        return []
      },
    },
    menuId: {
      type: String,
      default: '',
    },
    menuLevel: {
      type: Number,
      default: 2,
    },
  },
  emits: ['push-router'],
  setup (props, {emit}) {
    const pushRouter = (menu: MenuBean) => {
      if (menu.id === props.menuId) {
        return
      }
      emit('push-router', menu)
    }

    return {
      pushRouter,
    }
  },
})
</script>
<style scoped lang="scss">
@use "@assets/scss/theme/_admin-menu-top-child.scss";
</style>