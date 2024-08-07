<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :color="color"
    :height="size"
    :width="size"
    viewBox="0 0 16 16"
  >
    <path
      d="M12 1H4L0 7.95L4.3 14.7H11.8L16 7.95L12 1ZM11 12.9H5.05L2.05 7.6L5.05 2.75H11L14 7.6L11 12.9ZM8.05 6.3C7.2 6.3 6.5 7 6.5 7.85C6.5 8.7 7.2 9.4 8.05 9.4C8.9 9.4 9.6 8.7 9.6 7.85C9.6 7 8.9 6.3 8.05 6.3Z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts" setup>
import {IconProps} from '@utils/types'

withDefaults(defineProps<IconProps>(), {
  color: '',
  size: 16,
})
</script>