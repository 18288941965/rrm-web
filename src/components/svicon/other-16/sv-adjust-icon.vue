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
      d="M8 0C3.58214 0 0 3.58214 0 8C0 12.4179 3.58214 16 8 16C12.4179 16 16 12.4196 16 8C16 3.58214 12.4179 0 8 0ZM8.8 14.3446V12H7.2V14.3446C4.31071 13.9821 2.01786 11.6893 1.65536 8.8H4V7.2H1.65536C2.01786 4.3125 4.31071 2.01964 7.2 1.65536V4H8.8V1.65536C11.6893 2.01964 13.9821 4.3125 14.3446 7.2H12V8.8H14.3446C13.9821 11.6893 11.6893 13.9821 8.8 14.3446Z"
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