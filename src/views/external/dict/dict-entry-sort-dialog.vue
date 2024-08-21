<template>
  <el-dialog
    v-model="visible"
    title="字典项排序"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <div class="drag-body">
      <draggable
        v-model="dataList"
        item-key="id"
      >
        <template #item="{element, index}">
          <div class="drag-item">
            <span>{{ index + 1 }}</span> {{ element.entryName }}
          </div>
        </template>
      </draggable>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit"
        >提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from 'vue'
import {ElMessage} from 'element-plus/es'
import {AxiosResult} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'
import {DictEntryBean, DictEntrySortBean} from './dictModel'
import {
  getDictEntryByTypeId, updateDictEntrySort,
} from './dictOption'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'DictItemSortDialog',
  components: {
    draggable,
  },
  props: {
    dataId: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, {emit}) {
    const {
      visible,
        isRefresh,
    } = dialogOptions()

    const dataList = ref<Array<DictEntryBean>>([])
    const bakMap = new Map<number, number>()

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
      const tmp = new Array<DictEntrySortBean>()

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

      updateDictEntrySort(tmp).then(res => { handleCallback(res) })
    }

    const handleOpen = () => {
      getDictEntryByTypeId(props.dataId).then(res => {
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