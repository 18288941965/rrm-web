<template>
  <div class="pd-m">
    <h4>菜单图标</h4>
    <div class="icon-demo">
      <div
        v-for="(item, index) in menuIcons"
        :key="'m-i-' + index"
        class="icon-demo-item"
      >
        <component
          :is="item.toString()"
        />
        <span>{{ item }}</span>
      </div>
    </div>

    <h4>其他图标</h4>
    <div class="icon-demo">
      <div
        v-for="(item, index) in publicIcons"
        :key="'o-i-' + index"
        class="icon-demo-item"
      >
        <component
          :is="item.toString()"
        />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import * as menuIcon from '../../components/svicon/menuIcon'
import * as publicIcon from '../../components/svicon/publicIcon'

export default defineComponent({
  name: 'IconDemo',
  components: {
    ...menuIcon,
    ...publicIcon,
  },
  setup () {
    const menuIcons = ref<Array<String>>([])
    const publicIcons = ref<Array<String>>([])

    for (const name in menuIcon) {
      menuIcons.value.push(name)
    }
    
    for (const name in publicIcon) {
      publicIcons.value.push(name)
    }
    return {
      menuIcons,
      publicIcons,
    }
  },
})
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/demo/icon-demo";
</style>