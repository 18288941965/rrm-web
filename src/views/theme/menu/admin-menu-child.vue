<template>
  <template
    v-for="(menu, index) in menus"
    :key="'menu-' + index"
  >
    <el-menu-item
      v-if="!menu.children || menu.children.length === 0"
      :key="index + '_' + menu.id"
      :index="menu.id"
      :class="{'menu-active' : menu.id === menuId }"
      @click="pushRouter(menu)"
    >
      <template #title>
        <span>{{ menu.label }}</span>
      </template>
    </el-menu-item>

    <el-sub-menu
      v-else
      :key="index + '__' + menu.id"
      :index="menu.id"
    >
      <template #title>
        <i class="menu-icon">
          <component
            :is="menuGroupIcon"
            :size="10"
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
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {RrmMenuBean} from './menuModels'

export default defineComponent({
  name: 'AdminMenuChild',
  props: {
    menus: {
      type: Array as PropType<RrmMenuBean[]>,
      default: () => {
        return []
      },
    },
    menuId: {
      type: String,
      default: '',
    },
  },
  emits: ['push-router'],
  setup (props, { emit }) {
    const menuGroupIcon = 'Dot'

    const pushRouter = (menu: RrmMenuBean) => {
      if (menu.id === props.menuId) {
        return
      }
      emit('push-router', menu)
    }

    return {
      menuGroupIcon,
      pushRouter,
    }
  },
})
</script>