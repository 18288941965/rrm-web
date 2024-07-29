<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :color="color"
    :height="size"
    :width="size"
    viewBox="0 0 16 16"
  >
    <path
      d="M0 14.4737V1L16 7.73684L0 14.4737ZM1.68421 11.9474L11.6632 7.73684L1.68421 3.52632V6.47368L6.73684 7.73684L1.68421 9V11.9474Z"
      fill="currentColor"/>
  </svg>
</template>

<script lang="ts" setup>
import { IconProps} from '@utils/types'

withDefaults(defineProps<IconProps>() , {
  color: '',
  size: 16,
})
</script>