<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :color="color"
    :height="size"
    :width="size"
    viewBox="0 0 16 16"
  >
    <path
      fill="currentColor"
      d="M3.06 15.2L4.36 9.58L0 5.8L5.76 5.3L8 0L10.24 5.3L16 5.8L11.64 9.58L12.94 15.2L8 12.22L3.06 15.2Z"
    />
  </svg>
</template>

<script lang="ts" setup>
import { IconProps} from '@utils/types'

withDefaults(defineProps<IconProps>() , {
  color: '',
  size: 16,
})
</script>