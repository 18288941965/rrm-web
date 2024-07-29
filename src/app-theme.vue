<template>
  <button
    class="icon-button"
    @click="setTheme"
  >
    <Dark
      v-if="model === 'dark'"
    />
    <Light
      v-else
    />
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import {
  Dark,
  Light,
} from './components/svicon/publicIcon'
import {themeContext} from './AppTheme'

export default defineComponent({
  name: 'AppTheme',
  components: {
    Dark,
    Light,
  },
  setup () {
    const model = ref('')
    const {
      getThemeModel,
      setThemeModel,
    } = themeContext()

    const setTheme = () => {
      const themeModel = model.value === 'dark' ? 'light' : 'dark'
      setThemeModel(themeModel)
      model.value = themeModel
    }

    onMounted(() => {
      model.value = getThemeModel()
    })

    return {
      model,
      setThemeModel,
      setTheme,
    }
  },
})
</script>