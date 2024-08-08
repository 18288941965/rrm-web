<template>
  <el-dialog
    v-model="visible"
    title="用户说明编辑"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <el-form
      :model="form"
      class="app-item-edit-form"
      label-width="auto"
    >
      <el-form-item
        label="用户说明"
        prop="comment"
      >
        <el-input
          v-model.trim="form.comment"
          clearable
          placeholder=""
        />
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, watch} from 'vue'
import {ElMessage} from 'element-plus/es'
import {AxiosResult, PropPrams} from '@utils/interface'
import {updateUserComment} from './userOption'
import {dialogOptions} from '@utils/dialogOptions'

export default defineComponent({
  name: 'UserEditDialog',
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: 0,
          comment: '',
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
      comment: '',
    })


    // 关闭窗口
    const handleClose = () => {
      Object.assign(form, {
        id: 0,
        comment: '',
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
      updateUserComment(form.id, form.comment).then(res => {handleCallback(res)})
    }

    const handleOpen = () => {
      form.id = props.params?.dataId
      form.comment = props.params?.comment
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