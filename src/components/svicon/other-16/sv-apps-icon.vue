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
      d="M0 13.6667V11.8889H16V13.6667H0ZM0 9.22222V7.44444H16V9.22222H0ZM0 4.77778V3H16V4.77778H0Z"
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