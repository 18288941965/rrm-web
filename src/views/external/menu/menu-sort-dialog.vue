<template>
  <el-dialog
    v-model="visible"
    width="720"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <template #header>
      <dialog-header
        title="菜单"
        type="排序"
      />
    </template>
    <div class="drag-body">
      <draggable
        v-model="dataList"
        item-key="id"
      >
        <template #item="{element, index}">
          <div class="drag-item">
            <span>{{ index + 1 }}</span> {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            提交
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'
import {ElMessage} from 'element-plus/es'
import {AxiosResult} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'

import draggable from 'vuedraggable'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'
import {MenuBean, MenuSortBean} from './menuModel'
import {getMenuByParentId, updateMenuSort} from './menuOption'

export default defineComponent({
  name: 'MenuSortDialog',
  components: {
    draggable,
    DialogHeader,
    DialogFooter,
  },
  props: {
    dataId: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, {emit}) {
    const {
      visible,
        isRefresh,
    } = dialogOptions()

    const dataList = ref<Array<MenuBean>>([])
    const bakMap = new Map<string, number>()

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    // 关闭窗口
    const handleClose = () => {
      dataList.value = []
      bakMap.clear()
      const refresh = isRefresh.value
      isRefresh.value = false
      emit('close-dialog', refresh)
    }

    const handleCallback = (res: AxiosResult) => {
      if (res.code == 200) {
        ElMessage.success(res.message)
        isRefresh.value = true
        handleClose()
      }
    }

    const onSubmit = () => {
      const tmp = new Array<MenuSortBean>()

      for (let i = 1; i <= dataList.value.length; i++) {
        const obj = dataList.value[i-1]
        if (i !== bakMap.get(obj.id)) {
          tmp.push({ id: obj.id, sortOrder: i })
        }
      }

      if (tmp.length < 1) {
        ElMessage.warning('顺序未发生变化！')
        return
      }

      updateMenuSort(tmp).then(res => { handleCallback(res) })
    }

    const handleOpen = () => {
      const parentId = props.dataId ? props.dataId : 'null'
      getMenuByParentId(parentId).then(res => {
        if (res.code === 200) {
          dataList.value = res.data
          dataList.value.forEach(item => {
            bakMap.set(item.id, item.sortOrder)
          })
        }
      })
    }

    return {
      visible,
      handleOpen,
      handleClose,
      onSubmit,
      dataList,
    }
  },
})

</script>


<style scoped lang="scss">
  .drag-body{
    min-height: 200px;
  }
  .drag-item{
    line-height: var(--size-default);
    padding: 0 var(--pd-medium);
    border: var(--border-1);
    border-bottom: 0;
    cursor: move;
    & span{
      display: inline-block;
      padding-right: var(--pd-medium);
      color: var(--color-purple);
    }
  }
  .drag-item:first-of-type{
    border-top-left-radius: var(--border-radius-medium);
    border-top-right-radius: var(--border-radius-medium);
  }
  .drag-item:last-of-type{
    border-bottom: var(--border-1);
    border-bottom-left-radius: var(--border-radius-medium);
    border-bottom-right-radius: var(--border-radius-medium);
  }
</style>