<template>
  <div class="dialog-header">
    <div>
      <span class="title"> {{ title }} </span>
      <span
        v-if="type"
        class="type"
      >{{ type }}</span>
      <span
        v-if="name"
        class="message"
      >
        /
        <span
          class="name"
        >
          {{ name }}
        </span>
        <span
          v-if="detail"
          class="detail"
        >
          （{{ detail }}）
        </span>
      </span>
    </div>

    <span class="commands-Key">[esc]</span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'DialogHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    detail: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },
})
</script>


<style scoped lang="scss">
@use "@assets/scss/common";
  .dialog-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bolder;
    margin-bottom: var(--mg-medium);
    & .message{
      margin-left: var(--mg-ultra-small);
      color: var(--color-black-secondary);
    }
  }
</style>