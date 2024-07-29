<template>
  <div>
    <ev-select-demo style="box-shadow: var(--box-shadow-small); border: var(--border-1); border-radius: var(--border-radius-medium);margin-bottom: 20px;" />
    <ev-checkbox-demo style="box-shadow: var(--box-shadow-small); border: var(--border-1); border-radius: var(--border-radius-medium);margin-bottom: 20px;" />
    <ev-radio-demo style="box-shadow: var(--box-shadow-small); border: var(--border-1); border-radius: var(--border-radius-medium);margin-bottom: 20px;" />
  </div>
</template>

<script lang="ts" setup>
import EvCheckboxDemo from './ev-checkbox-demo.vue'
import EvRadioDemo from './ev-radio-demo.vue'
import EvSelectDemo from './ev-select-demo.vue'
</script>