<template>
  <template v-if="reloadFlag">
    <router-view />

    <app-message
      :system-message-list="systemMessageList"
      @close-message="closeMessage"
    />
  </template>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, provide, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import BChannel from './utils/channel/BChannel'
import {BCEnum} from '@utils/channel/channelModels'
import {ReloadApp} from '@utils/types'
import {RUEnum} from './router/routerModels'
import AppMessage from './app-message.vue'
import {themeContext} from './AppTheme'
import {appSettingsContext} from './components/settings/appSettings'
import {EventType} from '@utils/event'
import routerEach from './router/routerEach'
import baseAxios from '@utils/axios/baseAxios'

export default defineComponent({
  components: {
    AppMessage,
  },
  setup() {
    // 路由和守卫
    const router = useRouter()
    routerEach()
    baseAxios()

    // 页面重新加载
    const reloadFlag = ref(true)
    const reloadApp: ReloadApp = () => {
      reloadFlag.value = false
      setTimeout(function () {
        reloadFlag.value = true
      }, 100)
    }
    provide('reloadApp', reloadApp)

    // 每个示例（每个浏览器标签）只初始化一个广播对象
    // 初始化到这里的时候，虽然provide，但是还未挂载完成，所以inject紧跟着获取不到值
    const channel: BroadcastChannel = new BroadcastChannel('rrm-web')
    provide('channel', channel)
    const {
      systemMessageList,
      postMessage,
      channelOnMessage,
      resetChannel,
    } = BChannel(channel)
    // 接收到广播消息
    const onMessage = (ev: MessageEvent) => {
      channelOnMessage(ev, reloadApp)
    }
    // 关闭消息窗口
    // 根据不同的消息做不同的事

    const closeMessage = () => {
      const codes = systemMessageList.value.map(item => item.code)
      resetChannel()
      if (codes.includes(BCEnum.LOGOUT)) {
        router.replace(RUEnum.LOGIN)
      }
    }

    // 主题
    const {
      initThemeModel,
    } = themeContext()
    
    const {
      initFontSize,
    } = appSettingsContext()

    onMounted(() => {
      initThemeModel()
      initFontSize()
      channel.addEventListener(EventType.Message, onMessage)
    })

    onUnmounted(() => {
      channel.removeEventListener(EventType.Message, onMessage)
    })

    return {
      systemMessageList,
      postMessage,
      closeMessage,
      reloadFlag,
    }
  },
})
</script>