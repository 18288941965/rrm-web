<template>
  <el-drawer
    v-model="visible"
    title="菜单移动"
    direction="rtl"
    :before-close="handleClose"
    :size="560"
    @open="handleOpen"
  >
    <menu-tree
      ref="menuMoveTreeRef"
      :menu-list="menuList"
      :source="1"
    />

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="null"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-drawer>
</template>

<script lang="ts">
import {defineComponent,ref, watch} from 'vue'
import MenuTree from './menu-tree.vue'
import {MenuBeanVO} from './menuModel'
import DialogFooter from '../../../components/dialog-footer.vue'

export default defineComponent({
  name: 'MenuMoveDrawer',
  components: {
    MenuTree,
    DialogFooter,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
    menuList: {
      type: Array<MenuBeanVO>,
      default: [],
    },
  },
  emits: ['close-dialog'],
  setup (props, {emit}) {
    const visible = ref(false)
    const menuMoveTreeRef = ref()
    
    watch(
      () => props.show,
      () => {
        visible.value = props.show
      },
    )

    const handleOpen = () => {
    }

    // 关闭窗口
    const handleClose = () => {
      menuMoveTreeRef.value?.cleanActiveMenu()
      emit('close-dialog')
    }

    return {
      visible,
      menuMoveTreeRef,

      handleOpen,
      handleClose,
    }
  },
})
</script>

<style scoped lang="scss">
</style>