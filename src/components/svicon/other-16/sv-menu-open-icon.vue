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
      d="M0 13.6667V11.8889H11.5556V13.6667H0ZM14.7556 12.7778L10.3111 8.33333L14.7556 3.88889L16 5.13333L12.8 8.33333L16 11.5333L14.7556 12.7778ZM0 9.22222V7.44444H8.88889V9.22222H0ZM0 4.77778V3H11.5556V4.77778H0Z"
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