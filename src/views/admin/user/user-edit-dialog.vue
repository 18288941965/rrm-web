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
        title="账号说明"
        type="编辑"
      />
    </template>
    
    <el-form
      :model="form"
      class="app-item-edit-form"
      label-width="auto"
    >
      <el-form-item
        label="账号描述"
        prop="description"
      >
        <el-input
          v-model.trim="form.description"
          clearable
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <dialog-footer>
        <template #default>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            确定
          </el-button>
        </template>
      </dialog-footer>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, watch} from 'vue'
import {ElMessage} from 'element-plus/es'
import {AxiosResult, PropPrams} from '@utils/interface'
import {updateUserDescription} from './userOption'
import {dialogOptions} from '@utils/dialogOptions'
import DialogHeader from '../../../components/dialog-header.vue'
import DialogFooter from '../../../components/dialog-footer.vue'

export default defineComponent({
  name: 'UserEditDialog',
  components: {DialogFooter, DialogHeader},
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: 0,
          description: '',
        }
      },
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
    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive({
      id: 0,
      description: null,
    })


    // 关闭窗口
    const handleClose = () => {
      Object.assign(form, {
        id: 0,
        description: null,
      })
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
      updateUserDescription(form.id, form.description).then(res => {handleCallback(res)})
    }

    const handleOpen = () => {
      form.id = props.params?.dataId
      form.description = props.params?.description
    }

    return {
      visible,
      form,
      handleOpen,
      handleClose,
      onSubmit,
    }
  },
})

</script>


<style scoped lang="scss">
  .app-item-edit-form{
    margin: var(--mg-large);
  }
</style>