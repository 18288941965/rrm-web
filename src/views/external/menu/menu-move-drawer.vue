<template>
  <el-drawer
    v-model="visible"
    title="菜单移动"
    direction="rtl"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :size="560"
    @open="handleOpen"
  >
    <p class="tree-move-tip">
      红色标记项为需要移动的菜单，如果要移动到根目录下则不选中任务菜单直接提交即可。
    </p>

    <menu-tree
      ref="menuMoveTreeRef"
      :menu-list="menuList"
      :move-ids="moveIds"
      :disabled-ids="disabledIds"
      :source="1"
      @set-active-menu="treeCheckChange"
    />

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            :loading="loading"
            @click="submitBefore"
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
import {operationConfirm} from '@utils/utils'
import {dialogOptions} from '@utils/dialogOptions'
import {moveMenuTo} from './menuOption'

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
    moveIds: {
      type: Array<string>,
      default: [],
    },
    disabledIds: {
      type: Array<string>,
      default: [],
    },
  },
  emits: ['close-dialog'],
  setup (props, {emit}) {
    const {
      visible,
        isRefresh,
        loading,
    } = dialogOptions()
    const menuMoveTreeRef = ref()
    const menuMoveTo = ref('')
    
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
      menuMoveTreeRef.value?.cleanTreeActiveId()
      menuMoveTo.value = ''
      loading.value = false
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }


    const treeCheckChange = (data: MenuBeanVO) => {
      menuMoveTo.value = data.id
    }

    const submit = (message: string) => {
      operationConfirm(message).then(flag => {
        if (flag) {
          moveMenuTo(props.moveIds, menuMoveTo.value).then(res => {
            if (res.code === 200) {
              isRefresh.value = true
              handleClose()
            }
            loading.value = false
          }).catch(() => { loading.value = false })
        } else {
          loading.value = false
        }
      })
    }

    const submitBefore = () => {
      loading.value = true
      const message = menuMoveTo.value ? '你确定把菜单移动到 [ 此 ] 目录下吗？' :
          '你确定把选中的菜单移动到 [ 根 ] 目录下吗？'
     submit(message)
    }

    return {
      visible,
      loading,
      submitBefore,
      menuMoveTreeRef,
      treeCheckChange,
      handleOpen,
      handleClose,
    }
  },
})
</script>

<style scoped lang="scss">
  .tree-move-tip{
    text-indent: 2rem;
    color: var(--color-black-secondary);
    margin-top: 0;
  }
</style>