<template>
  <a
    class="admin-logo"
    href="/app/home"
  >
    <img
      :src="logo"
      alt=" "
    >
    <Transition name="slide-fade">
      <span
        v-if="!menuCollapse"
        id="admin-logo-text"
      >
        {{ moduleLabel }}
      </span>
    </Transition>
  </a>
</template>

<script lang="ts">
import {defineComponent } from 'vue'
import logo from '@assets/logo.png'

export default defineComponent({
  name: 'AdminLogo',
  props: {
    menuCollapse: {
      type: Boolean,
    },
    moduleIcon: {
      type: String,
      default: undefined,
    },
    moduleLabel: {
      type: String,
      default: undefined,
    },
  },
  setup () {
    return {
      logo,
    }
  },
})
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/theme/admin-logo";
</style>