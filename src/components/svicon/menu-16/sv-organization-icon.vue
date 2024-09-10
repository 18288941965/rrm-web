<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :color="color"
    :height="size"
    :width="size"
    viewBox="0 0 16 16"
  >
    <path
      d="M11.7333 10.1333V8.53333H0V7.46667H11.7333V5.86667H16V10.1333H11.7333ZM14.9333 6.93333H12.8V9.06667H14.9333V6.93333ZM6.93333 5.6352V5.86667H0V4.8H6.41707L8.53333 3.43147V0H12.8V4.26667H9.0496L6.93333 5.6352ZM9.6 3.2H11.7333V1.06667H9.6V3.2ZM6.93333 10.4901L8.17653 11.7333H11.7333V16H7.46667V12.4432L6.22347 11.2H0V10.1333H6.93333V10.4901ZM8.53333 14.9333H10.6667V12.8H8.53333V14.9333Z"
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