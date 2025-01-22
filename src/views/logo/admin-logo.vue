<template>
  <div class="admin-logo">
    <a
      :href="clickTo"
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
    <span
      v-if="moduleCode"
      class="module-code"
    > [ {{ moduleCode }} ]</span>
  </div>
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
    },
    moduleLabel: {
      type: String,
    },
    moduleCode: {
      type: String,
    },
    clickTo: {
      type: String,
      default: '/app/home/dashboard',
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
  @use "@assets/scssscoped/admin-logo";
</style>