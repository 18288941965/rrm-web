<template>
  <el-drawer
    v-model="visible"
    title="系统设置"
    direction="rtl"
    :before-close="handleClose"
    :size="400"
    @open="handleOpen"
  >
    <main class="app-settings-main">
      <section>
        <h5>字 号 ：</h5>
        <div class="settings-container">
          <ev-radio
            v-model="fontSize"
            :data-list="fontSizeType"
            @change="setHtmlFont(fontSize)"
          />
        </div>
      </section>
    </main>
  </el-drawer>
</template>

<script lang="ts">
import {defineComponent,ref, watch} from 'vue'
import {appSettingsContext} from './appSettings'
import EvRadio from '../evcomp/ev-radio.vue'

export default defineComponent({
  name: 'AppSettingsDrawer',
  components: {EvRadio},
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup (props, {emit}) {
    const visible = ref(false)
    
    const fontSizeType = [
      { label: '小', value: 'small' },
      { label: '中', value: 'medium' },
      { label: '大', value: 'large' },
    ]

    watch(
      () => props.show,
      () => {
        visible.value = props.show
      },
    )
    
    const {
      fontSize,
      initFontSize,
      setHtmlFont,
    } = appSettingsContext()

    const handleOpen = () => {
      initFontSize()
    }

    // 关闭窗口
    const handleClose = () => {
      emit('close-dialog')
    }

    return {
      visible,

      handleOpen,
      handleClose,

      fontSizeType,
      fontSize,
      setHtmlFont,
    }
  },
})
</script>

<style scoped lang="scss">
  .app-settings-main{
    h5{
      padding: var(--pd-small);
      margin-bottom: var(--mg-medium);
      background-color: var(--bg-color-header);
      border: {
        bottom: 1px solid var(--border-color);
        top-left-radius: var(--border-radius-medium);
        top-right-radius: var(--border-radius-medium);
      }
    }
    & section{
      border: var(--border-1);
      border-radius: var(--border-radius-medium);
    }
    & .settings-container{
      padding: var(--pd-medium);
    }
  }
</style>