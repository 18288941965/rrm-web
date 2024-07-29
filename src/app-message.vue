<template>
  <el-dialog
    v-model="visible"
    title="系统消息"
    width="720"
    :modal="false"
    :before-close="closeMessage"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <div class="app-message__body">
      <ul>
        <li
          v-for="(item, index) in systemMessageList"
          :key="'s-m-l-' + index"
        >
          {{ item.msg }}
        </li>
      </ul>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from 'vue'
import {ChannelData} from '@utils/channel/channelModels'

export default defineComponent({
  name: 'AppMessage',
  props: {
    systemMessageList: {
      type: Array as PropType<Array<ChannelData>>,
      default: () => {
        return []
      },
    },
  },
  emits: ['close-message'],
  setup (props, {emit}) {
    const visible = ref(false)

    const closeMessage = () => {
      emit('close-message')
      visible.value = false
    }

    watchEffect(() => {
      if (props.systemMessageList === undefined) {
        visible.value = false
      } else {
        if (props.systemMessageList.length > 0) {
          visible.value = true
        }
      }
    })

    return {
      closeMessage,
      visible,
    }
  },
})
</script>

<style scoped lang="scss">
  @use "@assets/scssscoped/components/app-message";
</style>