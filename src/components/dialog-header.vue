<template>
  <div class="dialog-header">
    <Logo class="logo" />
    <span class="title"> {{ title }} </span>
    <span
      v-if="type"
      class="type"
    >{{ type }}</span>
    <span v-if="name" class="message">
      <span
        class="name"
      >{{ name }}</span>
      <span
        v-if="detail"
        class="detail"
      > {{ detail }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Logo} from './svicon/publicIcon'

export default defineComponent({
  name: 'DialogHeader',
  components: {
    Logo,
  },
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
  .dialog-header{
    display: flex;
    align-items: center;
    font-size: var(--h4-size);
    font-weight: bolder;
    margin-bottom: var(--mg-medium);
    & .logo{
      margin-right: var(--mg-small);
    }
    & .type{
      color: var(--color-black-secondary);
    }
    & .message{
      background-color: var(--color-purple);
      margin-left: var(--mg-medium);
      padding: 0 var(--pd-ultra-small);
      color: var(--color-white);
      font-size: var(--h5-size);
    }
  }
</style>